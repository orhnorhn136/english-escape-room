import { describe, expect, it } from 'vitest';
import { CHAPTERS, LEVEL_HINTS, checkAnswer, isChapterUnlocked } from './chapters';

const SLOTS = ['tablo', 'kitap', 'ayna', 'cekmece'];

describe('bölüm içeriği', () => {
  it('40 bölüm var: 1-20 A1, 21-40 A2', () => {
    expect(CHAPTERS).toHaveLength(40);
    CHAPTERS.forEach((c, i) => {
      expect(c.bolum).toBe(i + 1);
      expect(c.seviye).toBe(i < 20 ? 'A1' : 'A2');
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

  it('ipucu sayısı seviyeye göre doğru', () => {
    for (const c of CHAPTERS) {
      expect(c.kilit.ipuclari.length, `bölüm ${c.bolum}`).toBe(LEVEL_HINTS[c.seviye]);
    }
  });

  it('kilit cevabı boş değil', () => {
    for (const c of CHAPTERS) expect(c.kilit.cevap.trim().length, `bölüm ${c.bolum}`).toBeGreaterThan(0);
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
