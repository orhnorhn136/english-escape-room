import { describe, expect, it } from 'vitest';
import { CHAPTERS, LEVEL_HINTS, checkAnswer, isChapterUnlocked, locksOf } from './chapters';
import { buildRooms, questionsFor } from './rooms';
import { RAW_UNITS } from './content';
import { EXTRA_QUESTIONS } from './recent';

const SLOTS = ['tablo', 'kitap', 'ayna', 'cekmece'];

describe('bölüm içeriği', () => {
  it('120 bölüm var; her seviye 20 bölüm', () => {
    expect(CHAPTERS).toHaveLength(120);
    CHAPTERS.forEach((c, i) => {
      expect(c.bolum).toBe(i + 1);
      const level = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'][Math.floor(i / 20)];
      expect(c.seviye).toBe(level);
    });
  });

  it('her bölümde en az iki not ve benzersiz yuvalar var', () => {
    for (const c of CHAPTERS) {
      expect(c.notlar.length, `bölüm ${c.bolum}`).toBeGreaterThanOrEqual(2);
      const slots = c.notlar.map((n) => n.slot);
      expect(new Set(slots).size, `bölüm ${c.bolum}`).toBe(slots.length);
      for (const s of slots) expect(SLOTS).toContain(s);
    }
  });

  it('her bölümde en az bir kilit var', () => {
    for (const c of CHAPTERS) expect(locksOf(c).length, `bölüm ${c.bolum}`).toBeGreaterThan(0);
  });

  it('ipucu sayısı seviyeye göre doğru (C2 hiç ipucu yok)', () => {
    for (const c of CHAPTERS) {
      for (const lock of locksOf(c)) {
        expect(lock.ipuclari.length, `bölüm ${c.bolum}`).toBe(LEVEL_HINTS[c.seviye]);
      }
    }
  });

  it('kod kilitlerinde cevap, seçim kilitlerinde geçerli seçenek var', () => {
    for (const c of CHAPTERS) {
      for (const lock of locksOf(c)) {
        if (lock.tip === 'kod') {
          expect(lock.cevap?.trim().length, `bölüm ${c.bolum}`).toBeGreaterThan(0);
        } else {
          expect(lock.secenekler?.length, `bölüm ${c.bolum}`).toBeGreaterThanOrEqual(2);
          expect(lock.dogru, `bölüm ${c.bolum}`).toBeGreaterThanOrEqual(0);
          expect(lock.dogru, `bölüm ${c.bolum}`).toBeLessThan(lock.secenekler!.length);
        }
      }
    }
  });
});

describe('ilerleme ve kontrol', () => {
  it('bölümler sırayla açılır', () => {
    expect(isChapterUnlocked(1, [])).toBe(true);
    expect(isChapterUnlocked(2, [])).toBe(false);
    expect(isChapterUnlocked(2, [1])).toBe(true);
  });

  it('cevap büyük/küçük harf ve boşluktan bağımsız kontrol edilir', () => {
    expect(checkAnswer('Under The Table', 'under the table')).toBe(true);
    expect(checkAnswer('dog', 'cat')).toBe(false);
  });
});

describe('kelime odası soruları', () => {
  it('ek soru bankasının kimlikleri benzersiz ve sayısı doğru', () => {
    const ids = EXTRA_QUESTIONS.map((q) => q.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids.length).toBeGreaterThanOrEqual(64);
    for (const q of EXTRA_QUESTIONS) {
      expect(q.dogru).toBeGreaterThanOrEqual(0);
      expect(q.dogru).toBeLessThan(q.secenekler.length);
    }
  });

  it('tekrar önleme: son sorular mümkünse seçilmez', () => {
    const rooms = buildRooms(RAW_UNITS);
    const boss = rooms.find((r) => r.oda === 12)!;
    const first = questionsFor(boss, rooms, () => 0.5, new Set(), EXTRA_QUESTIONS);
    const avoid = new Set(first.map((q) => q.id));
    const second = questionsFor(boss, rooms, () => 0.5, avoid, EXTRA_QUESTIONS);
    expect(second.some((q) => avoid.has(q.id))).toBe(false);
  });
});
