import type { Scene as SceneName, Slot } from '../game/chapters';

// Tüm görseller bu projede çizilmiştir (telif yok).

interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
}

interface Layout {
  wall: string;
  floor: string;
  accent: string;
  mirror: boolean; // kapı ve sahne sol-sağ aynalanır
  decor: 'pencere' | 'lamba' | 'boru' | 'cati' | 'none';
}

const LAYOUTS: Record<SceneName, Layout> = {
  koridor: { wall: '#1b2540', floor: '#0b0f1e', accent: '#7dd3fc', mirror: false, decor: 'lamba' },
  oda: { wall: '#3a2a22', floor: '#1d140f', accent: '#fbbf24', mirror: true, decor: 'pencere' },
  kutuphane: { wall: '#1f3324', floor: '#0e1a11', accent: '#86efac', mirror: false, decor: 'none' },
  bodrum: { wall: '#2a2a31', floor: '#101014', accent: '#fca5a5', mirror: true, decor: 'boru' },
  mutfak: { wall: '#2f3a3a', floor: '#162020', accent: '#67e8f9', mirror: false, decor: 'pencere' },
  cati: { wall: '#2c2338', floor: '#140f1d', accent: '#c4b5fd', mirror: true, decor: 'cati' },
};

const BASE_SLOTS: Record<Slot, Box> = {
  tablo: { x: 20, y: 28, w: 100, h: 70 },
  kitap: { x: 140, y: 28, w: 70, h: 90 },
  ayna: { x: 20, y: 120, w: 60, h: 80 },
  cekmece: { x: 110, y: 150, w: 90, h: 40 },
};

const LABEL: Record<Slot, string> = {
  tablo: 'Tablo',
  kitap: 'Kitaplık',
  ayna: 'Ayna',
  cekmece: 'Çekmece',
};

const DOOR_BASE: Box = { x: 235, y: 40, w: 70, h: 160 };

function mirrorBox(b: Box, mirror: boolean): Box {
  return mirror ? { ...b, x: 320 - b.x - b.w } : b;
}

interface Props {
  scene: SceneName;
  available: Slot[];
  found: Slot[];
  doorOpen: boolean;
  doorReady: boolean;
  onSlot: (slot: Slot) => void;
  onDoor: () => void;
}

function SlotArt({ slot, box, color }: { slot: Slot; box: Box; color: string }) {
  const b = box;
  switch (slot) {
    case 'tablo':
      return (
        <g>
          <rect x={b.x + 8} y={b.y + 8} width={b.w - 16} height={b.h - 16} fill="#0f172a" stroke={color} strokeWidth={2} />
          <circle cx={b.x + b.w - 30} cy={b.y + 24} r={7} fill="#fef3c7" />
          <path d={`M${b.x + 8} ${b.y + b.h - 16} Q${b.x + b.w / 2} ${b.y + 30} ${b.x + b.w - 8} ${b.y + b.h - 16} Z`} fill="#334155" />
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

function Decor({ kind, accent }: { kind: Layout['decor']; accent: string }) {
  switch (kind) {
    case 'pencere':
      return (
        <g>
          <rect x="222" y="14" width="78" height="56" fill="#0b1224" stroke={accent} strokeWidth={2} />
          <circle cx="282" cy="32" r="8" fill="#fef9c3" opacity={0.85} />
          <line x1="261" y1="14" x2="261" y2="70" stroke={accent} strokeWidth={2} />
        </g>
      );
    case 'lamba':
      return (
        <g>
          <line x1="160" y1="0" x2="160" y2="18" stroke="#52525b" strokeWidth={2} />
          <path d="M146 18 L174 18 L168 32 L152 32 Z" fill="#fde68a" />
          <ellipse cx="160" cy="36" rx="30" ry="12" fill="#fde68a" opacity={0.08} />
        </g>
      );
    case 'boru':
      return (
        <g stroke="#52525b" strokeWidth={5} fill="none">
          <path d="M0 14 H320" />
          <path d="M60 14 V40" />
          <path d="M200 14 V30 H240" />
        </g>
      );
    case 'cati':
      return <path d="M0 0 L160 -10 L320 0 L320 16 L160 4 L0 16 Z" fill="#0f0a18" />;
    default:
      return null;
  }
}

export function SceneView({ scene, available, found, doorOpen, doorReady, onSlot, onDoor }: Props) {
  const L = LAYOUTS[scene];
  const mirrorTransform = L.mirror ? 'translate(320,0) scale(-1,1)' : undefined;
  const door = mirrorBox(DOOR_BASE, L.mirror);
  const slots = (Object.keys(BASE_SLOTS) as Slot[]).reduce(
    (acc, s) => ({ ...acc, [s]: mirrorBox(BASE_SLOTS[s], L.mirror) }),
    {} as Record<Slot, Box>,
  );

  return (
    <svg viewBox="0 0 320 240" className="scene" role="img" aria-label="Oda sahnesi">
      <rect width="320" height="240" fill={L.wall} />
      <rect y="200" width="320" height="40" fill={L.floor} />
      <g transform={mirrorTransform}>
        <Decor kind={L.decor} accent={L.accent} />
      </g>

      {/* Kapı */}
      <g
        className={doorReady && !doorOpen ? 'hotspot ready' : 'hotspot'}
        onClick={doorReady ? onDoor : undefined}
        role={doorReady ? 'button' : undefined}
        aria-label={doorReady ? 'Kapıyı aç' : 'Kapı kilitli'}
      >
        <rect x={door.x} y={door.y} width={door.w} height={door.h} fill="#09090b" stroke={doorReady ? L.accent : '#3f3f46'} strokeWidth={3} />
        {doorOpen ? <rect x={door.x} y={door.y} width={door.w} height={door.h} fill="#fef3c7" opacity={0.55} /> : null}
        <circle cx={L.mirror ? door.x + 8 : door.x + door.w - 8} cy={door.y + door.h / 2} r={4} fill="#d4d4d8" />
        <text x={door.x + door.w / 2} y="220" textAnchor="middle" fontSize="11" fill="#e4e4e7">
          {doorOpen ? 'Açık' : doorReady ? 'Dokun' : 'Kilitli'}
        </text>
      </g>

      {/* Tıklanabilir yüzeyler */}
      {(Object.keys(slots) as Slot[]).map((s) => {
        const b = slots[s];
        const isAvail = available.includes(s);
        const isFound = found.includes(s);
        const cls = ['hotspot', isAvail && !isFound ? 'ready' : '', isFound ? 'found' : ''].join(' ').trim();
        const color = isAvail ? L.accent : '#52525b';
        return (
          <g
            key={s}
            className={cls}
            onClick={isAvail ? () => onSlot(s) : undefined}
            role={isAvail ? 'button' : undefined}
            aria-label={isAvail ? LABEL[s] : undefined}
          >
            <SlotArt slot={s} box={b} color={color} />
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
