import { useMemo, useState } from 'react';
import { RAW_UNITS } from './game/content';
import { buildRooms } from './game/rooms';
import { loadProgress, recordStars, saveProgress } from './game/progress';
import type { Progress, Room } from './game/types';
import { loadSolved, saveSolved } from './game/chapters';
import type { Chapter } from './game/chapters';
import { RoomMap } from './components/RoomMap';
import { RoomPlay } from './components/RoomPlay';
import { ChapterMap } from './components/ChapterMap';
import { ChapterPlay } from './components/ChapterPlay';

type Mode = 'bolumler' | 'odalar';

export default function App() {
  const rooms = useMemo(() => buildRooms(RAW_UNITS), []);
  const [mode, setMode] = useState<Mode>('bolumler');

  // Kelime odaları
  const [progress, setProgress] = useState<Progress>(loadProgress);
  const [activeRoom, setActiveRoom] = useState<Room | null>(null);
  const [attempt, setAttempt] = useState(0);

  // Karanlık bölümler
  const [solved, setSolved] = useState<number[]>(loadSolved);
  const [activeChapter, setActiveChapter] = useState<Chapter | null>(null);

  function handleWon(oda: number, stars: number) {
    const next = recordStars(progress, oda, stars);
    setProgress(next);
    saveProgress(next);
  }

  function handleReset() {
    if (!window.confirm('Kelime odalarındaki ilerleme silinsin mi?')) return;
    const empty: Progress = { stars: {} };
    setProgress(empty);
    saveProgress(empty);
  }

  function handleSolved(bolum: number) {
    const next = solved.includes(bolum) ? solved : [...solved, bolum].sort((a, b) => a - b);
    setSolved(next);
    saveSolved(next);
    setActiveChapter(null);
  }

  if (activeRoom) {
    return (
      <div className="app">
        <RoomPlay
          key={`${activeRoom.oda}-${attempt}`}
          room={activeRoom}
          all={rooms}
          onWon={(stars) => handleWon(activeRoom.oda, stars)}
          onExit={() => setActiveRoom(null)}
          onRetry={() => setAttempt((a) => a + 1)}
        />
      </div>
    );
  }

  if (activeChapter) {
    return (
      <div className="app">
        <ChapterPlay
          key={activeChapter.bolum}
          chapter={activeChapter}
          onSolved={() => handleSolved(activeChapter.bolum)}
          onExit={() => setActiveChapter(null)}
        />
      </div>
    );
  }

  return (
    <div className="app">
      <nav className="tabs" aria-label="Oyun modu">
        <button
          className={mode === 'bolumler' ? 'tab on' : 'tab'}
          aria-pressed={mode === 'bolumler'}
          onClick={() => setMode('bolumler')}
        >
          Karanlık Bölümler
        </button>
        <button
          className={mode === 'odalar' ? 'tab on' : 'tab'}
          aria-pressed={mode === 'odalar'}
          onClick={() => setMode('odalar')}
        >
          Kelime Odaları
        </button>
      </nav>

      {mode === 'bolumler' ? (
        <ChapterMap solved={solved} onOpen={setActiveChapter} />
      ) : (
        <RoomMap
          rooms={rooms}
          progress={progress}
          onOpen={(room) => {
            setAttempt(0);
            setActiveRoom(room);
          }}
          onReset={handleReset}
        />
      )}
    </div>
  );
}
