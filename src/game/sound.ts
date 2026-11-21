// Ses efektleri Web Audio ile üretilir; dış ses dosyası yoktur (telif sorunu oluşmaz).
const KEY = 'escape-room-english:sound';

let ctx: AudioContext | null = null;

export function isSoundOn(): boolean {
  try {
    return localStorage.getItem(KEY) !== 'off';
  } catch {
    return true;
  }
}

export function setSoundOn(on: boolean): void {
  try {
    localStorage.setItem(KEY, on ? 'on' : 'off');
  } catch {
    // yoksay
  }
}

function getContext(): AudioContext | null {
  if (!isSoundOn()) return null;
  try {
    const Ctor =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return null;
    ctx ??= new Ctor();
    if (ctx.state === 'suspended') void ctx.resume();
    return ctx;
  } catch {
    return null;
  }
}

function tone(freq: number, start: number, dur: number, type: OscillatorType = 'sine', peak = 0.15) {
  const c = getContext();
  if (!c) return;
  const t0 = c.currentTime + start;
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  gain.gain.setValueAtTime(0.0001, t0);
  gain.gain.exponentialRampToValueAtTime(peak, t0 + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  osc.connect(gain).connect(c.destination);
  osc.start(t0);
  osc.stop(t0 + dur + 0.02);
}

export function playCorrect(): void {
  tone(660, 0, 0.12);
  tone(880, 0.1, 0.18);
}

export function playWrong(): void {
  tone(220, 0, 0.25, 'sawtooth', 0.07);
}

export function playWin(): void {
  [523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.12, 0.3));
}
