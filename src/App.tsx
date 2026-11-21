import { useMemo, useState } from 'react';
import { RAW_UNITS } from './game/content';
import { buildRooms } from './game/rooms';
import { loadProgress, recordStars, saveProgress } from './game/progress';
import type { Progress, Room } from './game/types';
import { RoomMap } from './components/RoomMap';
import { RoomPlay } from './components/RoomPlay';

export default function App() {
  const rooms = useMemo(() => buildRooms(RAW_UNITS), []);
  const [progress, setProgress] = useState<Progress>(loadProgress);
  const [active, setActive] = useState<Room | null>(null);
  const [attempt, setAttempt] = useState(0);

  function handleWon(oda: number, stars: number) {
    const next = recordStars(progress, oda, stars);
    setProgress(next);
    saveProgress(next);
  }

  function handleReset() {
    if (!window.confirm('Tüm ilerleme silinsin mi?')) return;
    const empty: Progress = { stars: {} };
    setProgress(empty);
    saveProgress(empty);
  }

  if (active) {
    return (
      <div className="app">
        <RoomPlay
          key={`${active.oda}-${attempt}`}
          room={active}
          all={rooms}
          onWon={(stars) => handleWon(active.oda, stars)}
          onExit={() => setActive(null)}
          onRetry={() => setAttempt((a) => a + 1)}
        />
      </div>
    );
  }

  return (
    <div className="app">
      <RoomMap
        rooms={rooms}
        progress={progress}
        onOpen={(room) => {
          setAttempt(0);
          setActive(room);
        }}
        onReset={handleReset}
      />
    </div>
  );
}
