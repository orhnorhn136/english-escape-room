import type { Progress, Room } from '../game/types';
import { isUnlocked } from '../game/progress';
import { SoundToggle } from './Effects';

interface Props {
  rooms: Room[];
  progress: Progress;
  onOpen: (room: Room) => void;
  onReset: () => void;
}

const TIP_LABEL: Record<string, string> = {
  test: 'Test',
  unite_testi: 'Boss',
  final: 'Final',
};

export function RoomMap({ rooms, progress, onOpen, onReset }: Props) {
  const solved = rooms.filter((r) => (progress.stars[r.oda] ?? 0) > 0).length;

  // Odaları ünite başlığına göre grupla (sıra korunur)
  const groups: { unite: string; baslik: string; rooms: Room[] }[] = [];
  for (const room of rooms) {
    const last = groups[groups.length - 1];
    if (last && last.unite === room.unite) last.rooms.push(room);
    else groups.push({ unite: room.unite, baslik: room.uniteBaslik, rooms: [room] });
  }

  return (
    <div className="map">
      <header className="map-head">
        <h1>English Escape Room</h1>
        <p className="muted">{solved} / {rooms.length} oda çözüldü</p>
        <div className="progress" aria-hidden="true">
          <span style={{ width: `${(solved / rooms.length) * 100}%` }} />
        </div>
      </header>

      {groups.map((g) => (
        <section key={g.unite} className="unit">
          <h2>{g.unite === 'final' ? g.baslik : `Ünite ${g.unite}: ${g.baslik}`}</h2>
          <div className="grid">
            {g.rooms.map((room) => {
              const stars = progress.stars[room.oda] ?? 0;
              const open = isUnlocked(room.oda, progress);
              const cls = ['tile-room', stars > 0 ? 'done' : '', !open ? 'locked' : ''].join(' ');
              return (
                <button
                  key={room.oda}
                  className={cls}
                  disabled={!open}
                  onClick={() => onOpen(room)}
                  aria-label={`Oda ${room.oda}${stars ? `, ${stars} yıldız` : ''}`}
                >
                  <span className="num">{room.oda}</span>
                  <span className="kind">{TIP_LABEL[room.tip] ?? (stars ? '★'.repeat(stars) : '')}</span>
                </button>
              );
            })}
          </div>
        </section>
      ))}

      <footer className="map-foot">
        <SoundToggle />
        <button className="link" onClick={onReset}>İlerlemeyi sıfırla</button>
      </footer>
    </div>
  );
}
