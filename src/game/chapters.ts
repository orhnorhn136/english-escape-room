import chapterData from '../data/chapters.json';
import { normalize } from './check';

export type Slot = 'tablo' | 'kitap' | 'ayna' | 'cekmece';
export type Scene = 'koridor' | 'oda' | 'kutuphane' | 'bodrum';
export type Level = 'A1' | 'A2';

export interface Note {
  slot: Slot;
  metin: string;
}

export interface Lock {
  soru: string;
  cevap: string;
  ipuclari: string[];
}

export interface Chapter {
  bolum: number;
  seviye: Level;
  baslik: string;
  sahne: Scene;
  notlar: Note[];
  kilit: Lock;
}

// Seviye ilerledikçe ipucu azalır (ileride C2 için 0 olacak şekilde genişletilebilir).
export const LEVEL_HINTS: Record<Level, number> = { A1: 3, A2: 2 };

export const CHAPTERS = chapterData as unknown as Chapter[];

export function isChapterUnlocked(bolum: number, solved: number[]): boolean {
  return bolum === 1 || solved.includes(bolum - 1);
}

export function checkAnswer(input: string, answer: string): boolean {
  return normalize(input) === normalize(answer);
}

const KEY = 'escape-room-english:chapters:v1';

export function loadSolved(): number[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as unknown;
      if (Array.isArray(parsed)) return parsed.filter((n): n is number => typeof n === 'number');
    }
  } catch {
    // yoksay
  }
  return [];
}

export function saveSolved(list: number[]): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(list));
  } catch {
    // yoksay
  }
}
