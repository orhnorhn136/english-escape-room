import type { Question, RawChoice, RawOrder, RawRoom, RawUnit, Room, RoomTip } from './types';

const LEARNING_TIPS: RoomTip[] = ['kelime', 'kalip', 'siralama', 'karisik'];

export interface ExtraItem {
  id: string;
  unite: string;
  soru: string;
  secenekler: string[];
  dogru: number;
  ipucu: string;
}

export function isLearningTip(tip: RoomTip): boolean {
  return LEARNING_TIPS.includes(tip);
}

function toQuestion(raw: RawChoice | RawOrder): Question {
  if ('kelimeler' in raw) {
    return { kind: 'order', id: raw.id, soru: raw.soru, kelimeler: raw.kelimeler, cevap: raw.cevap, ipucu: raw.ipucu };
  }
  return { kind: 'choice', id: raw.id, soru: raw.soru, secenekler: raw.secenekler, dogru: raw.dogru, ipucu: raw.ipucu };
}

function toRoom(raw: RawRoom, unit: RawUnit): Room {
  const base = {
    oda: raw.oda,
    unite: String(unit.unite),
    uniteBaslik: unit.baslik,
    tip: raw.tip,
    baslik: raw.baslik,
  };
  if (isLearningTip(raw.tip)) {
    return { ...base, kind: 'learning', questions: (raw.sorular ?? []).map(toQuestion) };
  }
  return {
    ...base,
    kind: 'test',
    count: raw.soru_sayisi ?? 5,
    pool: raw.havuz ?? [],
    unitPool: raw.unite_havuz ?? [],
  };
}

/** Ham ünite dosyalarından 1..100 sıralı oda listesi üretir. */
export function buildRooms(units: RawUnit[]): Room[] {
  const rooms = units.flatMap((unit) => unit.odalar.map((raw) => toRoom(raw, unit)));
  return rooms.sort((a, b) => a.oda - b.oda);
}

export function shuffle<T>(items: T[], rand: () => number = Math.random): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/**
 * Bir odada gösterilecek soruları döndürür.
 * Öğrenme odaları kendi sorularını verir; test odaları ise ilgili ünitelerin
 * soru havuzundan (ek soru bankası dahil) rastgele seçim yapar.
 * `avoid` içindeki sorular mümkünse seçilmez (tekrarı azaltmak için).
 */
export function questionsFor(
  room: Room,
  all: Room[],
  rand: () => number = Math.random,
  avoid: Set<string> = new Set(),
  extra: ExtraItem[] = [],
): Question[] {
  if (room.kind === 'learning') return room.questions;

  const byOda = new Map(all.map((r) => [r.oda, r]));
  const sources = new Set<number>(room.pool);
  for (const r of all) {
    if (r.kind === 'learning' && room.unitPool.includes(Number(r.unite))) sources.add(r.oda);
  }

  const pool: Question[] = [];
  const units = new Set<string>();
  for (const oda of sources) {
    const r = byOda.get(oda);
    if (r && r.kind === 'learning') {
      pool.push(...r.questions);
      units.add(r.unite);
    }
  }
  for (const e of extra) {
    if (units.has(e.unite)) {
      pool.push({ kind: 'choice', id: e.id, soru: e.soru, secenekler: e.secenekler, dogru: e.dogru, ipucu: e.ipucu });
    }
  }

  const fresh = pool.filter((q) => !avoid.has(q.id));
  const source = fresh.length >= room.count ? fresh : pool;
  return shuffle(source, rand).slice(0, room.count);
}
