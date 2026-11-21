import { useState } from 'react';
import type { FormEvent } from 'react';
import '../chapters.css';
import { LEVEL_HINTS, checkAnswer } from '../game/chapters';
import type { Chapter, Slot } from '../game/chapters';
import { playCorrect, playWin, playWrong } from '../game/sound';
import { Confetti, SoundToggle } from './Effects';
import { SceneView } from './Scene';

interface Props {
  chapter: Chapter;
  onSolved: () => void;
  onExit: () => void;
}

export function ChapterPlay({ chapter, onSolved, onExit }: Props) {
  const available = chapter.notlar.map((n) => n.slot);
  const [found, setFound] = useState<Slot[]>([]);
  const [openSlot, setOpenSlot] = useState<Slot | null>(null);
  const [answer, setAnswer] = useState('');
  const [hints, setHints] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [doorOpen, setDoorOpen] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const allFound = found.length === available.length;
  const maxHints = LEVEL_HINTS[chapter.seviye];
  const shownNotes = chapter.notlar.filter((n) => found.includes(n.slot));

  function handleSlot(slot: Slot) {
    if (!found.includes(slot)) setFound([...found, slot]);
    setOpenSlot(slot);
    setMessage(null);
  }

  function handleDoor() {
    setMessage(null);
    setOpenSlot(null);
    setAnswer('');
  }

  function submit(e: FormEvent) {
    e.preventDefault();
    if (doorOpen) return;
    if (checkAnswer(answer, chapter.kilit.cevap)) {
      setDoorOpen(true);
      setMessage('Kapı açıldı!');
      playWin();
    } else {
      setWrong((w) => w + 1);
      setMessage('Kod yanlış. Notlara tekrar bak.');
      playWrong();
    }
  }

  const note = openSlot ? chapter.notlar.find((n) => n.slot === openSlot) : undefined;

  return (
    <div className="chapter">
      <div className="room-head">
        <button className="link" onClick={onExit}>← Bölümler</button>
        <SoundToggle />
      </div>

      <div className="chapter-title">
        <span className="badge">{chapter.seviye} · Bölüm {chapter.bolum}</span>
        <h2>{chapter.baslik}</h2>
        <p className="muted">
          {allFound ? 'Tüm notlar bulundu. Kapıya dokun.' : 'Eşyalara dokun ve notları bul.'}
        </p>
      </div>

      <SceneView
        scene={chapter.sahne}
        available={available}
        found={found}
        doorOpen={doorOpen}
        doorReady={allFound}
        onSlot={handleSlot}
        onDoor={handleDoor}
      />

      {note && (
        <div className="note" role="status">
          <strong>Not:</strong> {note.metin}
        </div>
      )}

      {shownNotes.length > 0 && (
        <div className="card notes-list">
          <h3>Bulunan notlar</h3>
          <ul>
            {shownNotes.map((n) => (
              <li key={n.slot}>{n.metin}</li>
            ))}
          </ul>
        </div>
      )}

      {allFound && !doorOpen && (
        <form className="card lock" onSubmit={submit}>
          <h3>Kapı kilidi</h3>
          <p className="question">{chapter.kilit.soru}</p>
          <input
            className="code-input"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Cevabını yaz"
            autoComplete="off"
            aria-label="Kapı kodu"
            style={{ animation: wrong > 0 ? 'shake 0.45s' : undefined }}
            key={wrong}
          />
          <button className="btn" type="submit" disabled={answer.trim().length === 0}>
            Kodu dene
          </button>
          <HintBox chapterHints={chapter.kilit.ipuclari} shown={hints} max={maxHints} onMore={() => setHints((h) => h + 1)} />
        </form>
      )}

      {message && (
        <p className={doorOpen ? 'feedback good' : 'feedback'} role="status">{message}</p>
      )}

      {doorOpen && (
        <div className="card result">
          <Confetti count={50} />
          <h2>Bölüm tamamlandı</h2>
          <button
            className="btn"
            onClick={() => {
              playCorrect();
              onSolved();
            }}
          >
            Bölümler ekranına dön
          </button>
        </div>
      )}
    </div>
  );
}

function HintBox({
  chapterHints,
  shown,
  max,
  onMore,
}: {
  chapterHints: string[];
  shown: number;
  max: number;
  onMore: () => void;
}) {
  const left = max - shown;
  return (
    <div className="hints">
      {chapterHints.slice(0, shown).map((h, i) => (
        <p key={i} className="hint">İpucu {i + 1}: {h}</p>
      ))}
      {left > 0 ? (
        <button type="button" className="link" onClick={onMore}>
          İpucu göster ({left} kaldı)
        </button>
      ) : (
        <p className="muted">İpuçları bitti.</p>
      )}
    </div>
  );
}
