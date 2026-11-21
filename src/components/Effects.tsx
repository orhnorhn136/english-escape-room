import { useMemo, useState } from 'react';
import '../effects.css';
import { isSoundOn, setSoundOn } from '../game/sound';

const COLORS = ['#f59e0b', '#8b5cf6', '#22c55e', '#ef4444', '#38bdf8', '#f472b6'];

/** Kutlama konfeti: saf CSS animasyonu, dış kütüphane yok. */
export function Confetti({ count = 70 }: { count?: number }) {
  const pieces = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 0.8,
        duration: 2.2 + Math.random() * 1.8,
        width: 6 + Math.random() * 6,
        color: COLORS[i % COLORS.length],
      })),
    [count],
  );

  return (
    <div className="confetti" aria-hidden="true">
      {pieces.map((p) => (
        <span
          key={p.id}
          style={{
            left: `${p.left}%`,
            width: p.width,
            background: p.color,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        />
      ))}
    </div>
  );
}

/** Ses açma/kapama düğmesi; tercih tarayıcıda saklanır. */
export function SoundToggle() {
  const [on, setOn] = useState(isSoundOn);
  return (
    <button
      className="link sound"
      aria-pressed={on}
      onClick={() => {
        const next = !on;
        setSoundOn(next);
        setOn(next);
      }}
    >
      Ses: {on ? 'açık' : 'kapalı'}
    </button>
  );
}
