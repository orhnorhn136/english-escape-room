import type { Question, Room } from './types';
import { questionsFor } from './rooms';
import type { ExtraItem } from './rooms';
import extraRaw from '../data/extra.json';

export const EXTRA_QUESTIONS = extraRaw as ExtraItem[];

const KEY = 'escape-room-english:recent-tests:v1';
// Son birkaç testte çıkan sorular bir sonraki testlerde tekrar etmez.
const KEEP = 20;

export function loadRecent(): string[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as unknown;
      if (Array.isArray(parsed)) return parsed.filter((x): x is string => typeof x === 'string');
    }
  } catch {
    // yoksay
  }
  return [];
}

export function saveRecent(ids: string[]): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(ids.slice(-KEEP)));
  } catch {
    // yoksay
  }
}

/** Oda açıldığında gösterilecek soruları seçer ve test sorularını geçmişe kaydeder. */
export function pickQuestions(room: Room, all: Room[]): Question[] {
  if (room.kind === 'learning') return room.questions;
  const recent = loadRecent();
  const qs = questionsFor(room, all, Math.random, new Set(recent), EXTRA_QUESTIONS);
  saveRecent([...recent, ...qs.map((q) => q.id)]);
  return qs;
}
