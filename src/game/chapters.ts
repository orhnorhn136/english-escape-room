import chaptersA from '../data/chapters.json';
import chaptersB from '../data/chapters-b.json';
import chaptersC from '../data/chapters-c.json';
import { normalize } from './check';

export type Slot = 'tablo' | 'kitap' | 'ayna' | 'cekmece';
export type Scene = 'koridor' | 'oda' | 'kutuphane' | 'bodrum' | 'mutfak' | 'cati';
export type Level = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

export interface Note {
  slot: Slot;
  metin: string;
}

// tip "kod": yazılı cevap. tip "secim": seçeneklerden biri.
export interface Lock {
  tip: 'kod' | 'secim';
  soru: string;
  cevap?: string;
  secenekler?: string[];
  dogru?: number;
  ipuclari: string[];
}

export interface Chapter {
  bolum: number;
  seviye: Level;
  baslik: string;
  sahne: Scene;
  notlar: Note[];
  kilitler?: Lock[];
  // Eski biçim (tek kilit, kod tipi)
  kilit?: { soru: string; cevap: string; ipuclari: string[] };
}

// Seviye ilerledikçe ipucu azalır; C2'de hiç ipucu yok.
export const LEVEL_HINTS: Record<Level, number> = { A1: 3, A2: 2, B1: 2, B2: 1, C1: 1, C2: 0 };

export const LEVELS: Level[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

const RAW = [...(chaptersA as unknown as Chapter[]), ...(chaptersB as unknown as Chapter[]), ...(chaptersC as unknown as Chapter[])];

export const CHAPTERS: Chapter[] = RAW.sort((a, b) => a.bolum - b.bolum);

/** Bir bölümün kilit adımlarını döndürür (eski tek kilit biçimini de destekler). */
export function locksOf(c: Chapter): Lock[] {
  if (c.kilitler && c.kilitler.length > 0) return c.kilitler;
  if (c.kilit) return [{ tip: 'kod', soru: c.kilit.soru, cevap: c.kilit.cevap, ipuclari: c.kilit.ipuclari }];
  return [];
}

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
