import type { Progress } from './types';

const KEY = 'escape-room-english:v1';

// Tarayıcı depolaması kapalıysa oyun yine de çalışır, yalnızca ilerleme kaydedilmez.
export function loadProgress(): Progress {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Progress;
      if (parsed && typeof parsed.stars === 'object') return parsed;
    }
  } catch {
    // yoksay
  }
  return { stars: {} };
}

export function saveProgress(progress: Progress): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(progress));
  } catch {
    // yoksay
  }
}

export function recordStars(progress: Progress, oda: number, stars: number): Progress {
  const best = Math.max(progress.stars[oda] ?? 0, stars);
  return { stars: { ...progress.stars, [oda]: best } };
}

/** Odalar sırayla açılır: 1. oda her zaman açık, diğerleri bir önceki odayı çözünce. */
export function isUnlocked(oda: number, progress: Progress): boolean {
  return oda === 1 || (progress.stars[oda - 1] ?? 0) > 0;
}
