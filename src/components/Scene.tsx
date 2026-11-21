import type { Scene as SceneName, Slot } from '../game/chapters';

// Tüm görseller bu projede çizilmiştir (telif yok). Renkler sahneye göre değişir.
const PALETTE: Record<SceneName, { wall: string; floor: string; accent: string }> = {
  koridor: { wall: '#1b2540', floor: '#0b0f1e', accent: '#7dd3fc' },
  oda: { wall: '#3a2a22', floor: '#1d140f', accent: '#fbbf24' },
  kutuphane: { wall: '#1f3324', floor: '#0e1a11', accent: '#86efac' },
  bodrum: { wall: '#2a2a31', floor: '#101014', accent: '#fca5a5' },
};

export const SLOT_BOX: Record<Slot, { x: number; y: number; w: number; h: number; label: string }> = {
  tablo: { x: 20, y: 28, w: 100, h: 70, label: 'Tablo' },
  kitap: { x: 140, y: 28, w: 70, h: 90, label: 'Kitaplık' },
  ayna: { x: 20, y: 120, w: 60, h: 80, label: 'Ayna' },
  cekmece: { x: 110, y: 150, w: 90, h: 40, label: 'Çekmece' },
};

interface Props {
  scene: SceneName;
  available: Slot[];
  found: Slot[];
  doorOpen: boolean;
  doorReady: boolean;
  onSlot: (slot: Slot) => void;
  onDoor: () => void;
}

function Art({ slot, color }: { slot: Slot; color: string }) {
  const b = SLOT_BOX[slot];
  switch (slot) {
    case 'tablo':
      return (
        <g>
          <rect x={b.x + 8} y={b.y + 8} width={b.w - 16} height={b.h - 16} fill="#0f172a" stroke={color} strokeWidth={2} />
          <circle cx={b.x + 70} cy={b.y + 24} r={7} fill="#fef3c7" />
          <path d={`M${b.x + 8} ${b.y + 50} Q${b.x + 40} ${b.y + 30} ${b.x + 92} ${b.y + 50} L${b.x + 92} ${b.y + 54} L${b.x + 8} ${b.y + 54} Z`} fill="#334155" />
        </g>
      );
    case 'kitap':
      return (
        <g>
          <rect x={b.x + 4} y={b.y + 6} width={b.w - 8} height={b.h - 12} fill="#1e293b" />
          <rect x={b.x + 8} y={b.y + 14} width={8} height={26} fill="#dc2626" />
          <rect x={b.x + 18} y={b.y + 18} width={7} height={22} fill="#2563eb" />
          <rect x={b.x + 28} y={b.y + 12} width={9} height={28} fill="#16a34a" />
          <rect x={b.x + 40} y={b.y + 20} width={8} height={20} fill="#eab308" />
          <rect x={b.x + 8} y={b.y + 52} width={8} height={26} fill="#a855f7" />
          <rect x={b.x + 20} y={b.y + 58} width={9} height={20} fill="#f97316" />
        </g>
      );
    case 'ayna':
      return (
        <g>
          <ellipse cx={b.x + b.w / 2} cy={b.y + b.h / 2} rx={b.w / 2 - 6} ry={b.h / 2 - 6} fill="#0c4a6e" stroke={color} strokeWidth={2} />
          <path d={`M${b.x + 18} ${b.y + 20} L${b.x + 30} ${b.y + 60}`} stroke="#e0f2fe" strokeWidth={3} opacity={0.6} />
        </g>
      );
    case 'cekmece':
      return (
        <g>
          <rect x={b.x + 6} y={b.y + 6} width={b.w - 12} height={b.h - 12} fill="#44403c" stroke="#78716c" />
          <rect x={b.x + b.w / 2 - 10} y={b.y + 15} width={20} height={5} fill="#d6d3d1" />
        </g>
      );
  }
}

export function SceneView({ scene, available, found, doorOpen, doorReady, onSlot, onDoor }: Props) {
  const p = PALETTE[scene];
  return (
    <svg viewBox="0 0 320 240" className="scene" role="img" aria-label="Oda sahnesi">
      <rect width="320" height="240" fill={p.wall} />
      <rect y="200" width="320" height="40" fill={p.floor} />
      <rect x="0" y="0" width="320" height="6" fill="#00000040" />

      {/* Kapı */}
      <g
        className={doorReady && !doorOpen ? 'hotspot ready' : 'hotspot'}
        onClick={doorReady ? onDoor : undefined}
        role={doorReady ? 'button' : undefined}
        aria-label={doorReady ? 'Kapıyı aç' : 'Kapı kilitli'}
      >
        <rect x="235" y="40" width="70" height="160" fill="#09090b" stroke={doorReady ? p.accent : '#3f3f46'} strokeWidth={3} />
        {doorOpen ? <rect x="235" y="40" width="70" height="160" fill="#fef3c7" opacity={0.55} /> : null}
        <circle cx="292" cy="122" r="4" fill="#d4d4d8" />
        <text x="270" y="220" textAnchor="middle" fontSize="11" fill="#e4e4e7">
          {doorOpen ? 'Açık' : doorReady ? 'Dokun' : 'Kilitli'}
        </text>
      </g>

      {/* Tıklanabilir yüzeyler */}
      {(Object.keys(SLOT_BOX) as Slot[]).map((s) => {
        const b = SLOT_BOX[s];
        const isAvail = available.includes(s);
        const isFound = found.includes(s);
        const cls = ['hotspot', isAvail && !isFound ? 'ready' : '', isFound ? 'found' : ''].join(' ').trim();
        const color = isAvail ? p.accent : '#52525b';
        return (
          <g
            key={s}
            className={cls}
            onClick={isAvail ? () => onSlot(s) : undefined}
            role={isAvail ? 'button' : undefined}
            aria-label={isAvail ? b.label : undefined}
          >
            <Art slot={s} color={color} />
            <rect x={b.x} y={b.y} width={b.w} height={b.h} fill="transparent" stroke={color} strokeWidth={isAvail && !isFound ? 2 : 1} strokeDasharray={isAvail && !isFound ? '4 3' : undefined} />
          </g>
        );
      })}

      {/* Mum */}
      <rect x="200" y="176" width="8" height="24" fill="#e5e7eb" />
      <ellipse cx="204" cy="172" rx="4" ry="7" fill="#fb923c" className="flame" />
    </svg>
  );
}
