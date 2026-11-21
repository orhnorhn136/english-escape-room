/** Büyük/küçük harf, noktalama ve boşlukları yok sayarak karşılaştırma yapar. */
export function normalize(text: string): string {
  return text.toLocaleLowerCase('en-US').replace(/[^\p{L}\p{N}]/gu, '');
}

export function isOrderCorrect(words: string[], answer: string): boolean {
  return normalize(words.join(' ')) === normalize(answer);
}

/** Hatasız çözülen oda 3 yıldız, 1-2 hata 2 yıldız, daha fazlası 1 yıldız. */
export function starsFor(mistakes: number): number {
  if (mistakes === 0) return 3;
  if (mistakes <= 2) return 2;
  return 1;
}
