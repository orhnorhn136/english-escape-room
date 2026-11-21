import { describe, expect, it } from 'vitest';
import { RAW_UNITS } from './content';
import { buildRooms, questionsFor } from './rooms';
import { isOrderCorrect, normalize, starsFor } from './check';
import { isUnlocked, recordStars } from './progress';

const rooms = buildRooms(RAW_UNITS);
const seeded = (seed: number) => () => {
  seed = (seed * 9301 + 49297) % 233280;
  return seed / 233280;
};

describe('içerik', () => {
  it('100 oda var ve 1-100 sırasındadır', () => {
    expect(rooms).toHaveLength(100);
    expect(rooms.map((r) => r.oda)).toEqual(Array.from({ length: 100 }, (_, i) => i + 1));
  });

  it('her öğrenme odasında en az bir soru var', () => {
    for (const r of rooms) {
      if (r.kind === 'learning') expect(r.questions.length, `oda ${r.oda}`).toBeGreaterThan(0);
    }
  });

  it('çoktan seçmeli sorularda doğru cevap indeksi geçerlidir', () => {
    for (const r of rooms) {
      if (r.kind !== 'learning') continue;
      for (const q of r.questions) {
        if (q.kind === 'choice') {
          expect(q.dogru, q.id).toBeGreaterThanOrEqual(0);
          expect(q.dogru, q.id).toBeLessThan(q.secenekler.length);
        }
      }
    }
  });

  it('sıralama sorularında kelimeler cevapla aynı kelime kümesidir', () => {
    // Kelimeler karışık verildiği için doğrudan değil, harf kümesi olarak karşılaştırılır.
    const letters = (s: string) => normalize(s).split('').sort().join('');
    for (const r of rooms) {
      if (r.kind !== 'learning') continue;
      for (const q of r.questions) {
        if (q.kind === 'order') {
          expect(letters(q.kelimeler.join(' ')), q.id).toBe(letters(q.cevap));
          expect(isOrderCorrect(q.cevap.split(' '), q.cevap), q.id).toBe(true);
        }
      }
    }
  });

  it('soru kimlikleri benzersizdir', () => {
    const ids = rooms.flatMap((r) => (r.kind === 'learning' ? r.questions.map((q) => q.id) : []));
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe('test odaları', () => {
  it('istenen sayıda soru üretir', () => {
    const test = rooms.find((r) => r.oda === 5)!;
    const qs = questionsFor(test, rooms, seeded(1));
    expect(qs).toHaveLength(5);
  });

  it('ünite testi yalnızca kendi havuzundan soru çeker', () => {
    const boss = rooms.find((r) => r.oda === 12)!;
    const allowed = new Set(
      [1, 2, 3, 4, 6, 7, 8, 9, 10].flatMap((oda) => {
        const r = rooms.find((x) => x.oda === oda);
        return r && r.kind === 'learning' ? r.questions.map((q) => q.id) : [];
      }),
    );
    const qs = questionsFor(boss, rooms, seeded(7));
    expect(qs.length).toBe(10);
    for (const q of qs) expect(allowed.has(q.id)).toBe(true);
  });

  it('final testi birden fazla üniteden karışık soru çeker', () => {
    const finalTest = rooms.find((r) => r.oda === 100)!;
    const qs = questionsFor(finalTest, rooms, seeded(3));
    expect(qs.length).toBe(20);
    expect(new Set(qs.map((q) => q.id)).size).toBe(20);
  });
});

describe('kontrol ve ilerleme', () => {
  it('normalize büyük harf ve noktalamayı yok sayar', () => {
    expect(normalize('Do you study English every day?')).toBe(normalize('do you study english every day'));
  });

  it('yıldız sayısı hata sayısına göre belirlenir', () => {
    expect(starsFor(0)).toBe(3);
    expect(starsFor(2)).toBe(2);
    expect(starsFor(3)).toBe(1);
  });

  it('odalar sırayla açılır', () => {
    const empty = { stars: {} };
    expect(isUnlocked(1, empty)).toBe(true);
    expect(isUnlocked(2, empty)).toBe(false);
    const after = recordStars(empty, 1, 2);
    expect(isUnlocked(2, after)).toBe(true);
    expect(isUnlocked(3, after)).toBe(false);
  });

  it('en iyi yıldız saklanır', () => {
    const p = recordStars(recordStars({ stars: {} }, 4, 3), 4, 1);
    expect(p.stars[4]).toBe(3);
  });
});
