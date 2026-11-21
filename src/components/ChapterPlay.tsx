import { useState } from 'react';
import type { FormEvent } from 'react';
import '../chapters.css';
import { LEVEL_HINTS, checkAnswer, locksOf } from '../game/chapters';
import type { Chapter, Lock, Slot } from '../game/chapters';
import { playCorrect, playWin, playWrong } from '../game/sound';
import { Confetti, SoundToggle } from './Effects';
import { SceneView } from './Scene';

interface Props {
  chapter: Chapter;
  onSolved: () => void;
  onExit: () => void;
}

export function ChapterPlay({ chapter, onSolved, onExit }: Props) {
  const locks = locksOf(chapter);
  const available = chapter.notlar.map((n) => n.slot);
  const [found, setFound] = useState<Slot[]>([]);
  const [openSlot, setOpenSlot] = useState<Slot | null>(null);
  const [step, setStep] = useState(0); // şu anki kilit adımı
  const [answer, setAnswer] = useState('');
  const [hintsUsed, setHintsUsed] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [message, setMessage] = useState<string | null>(null);

  const allFound = found.length === available.length;
  const done = step >= locks.length;
  const current: Lock | undefined = locks[step];
  const maxHints = LEVEL_HINTS[chapter.seviye];
  const shownNotes = chapter.notlar.filter((n) => found.includes(n.slot));
  const note = openSlot ? chapter.notlar.find((n) => n.slot === openSlot) : undefined;

  function handleSlot(slot: Slot) {
    if (!found.includes(slot)) setFound([...found, slot]);
    setOpenSlot(slot);
    setMessage(null);
  }

  function solveStep() {
    const next = step + 1;
    setStep(next);
    setAnswer('');
    setHintsUsed(0);
    setWrong(0);
    if (next >= locks.length) {
      setMessage('Kapı açıldı!');
      playWin();
    } else {
      setMessage('Doğru! Sıradaki kilit.');
      playCorrect();
    }
  }

  function failStep(text: string) {
    setWrong((w) => w + 1);
    setMessage(text);
    playWrong();
  }

  function submitCode(e: FormEvent) {
    e.preventDefault();
    if (!current || current.tip !== 'kod' || !current.cevap) return;
    if (checkAnswer(answer, current.cevap)) solveStep();
    else failStep('Kod yanlış. Notlara tekrar bak.');
  }

  function pickChoice(index: number) {
    if (!current || current.tip !== 'secim') return;
    if (index === current.dogru) solveStep();
    else failStep('Yanlış seçenek. Tekrar dene.');
  }

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
          {allFound ? `Kilit ${Math.min(step + 1, locks.length)} / ${locks.length}` : 'Eşyalara dokun ve notları bul.'}
        </p>
      </div>

      <SceneView
        scene={chapter.sahne}
        available={available}
        found={found}
        doorOpen={done}
        doorReady={allFound && !done}
        onSlot={handleSlot}
        onDoor={() => setOpenSlot(null)}
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

      {allFound && current && !done && (
        <div className="card lock">
          <h3>Kilit {step + 1}</h3>
          <p className="question">{current.soru}</p>

          {current.tip === 'kod' ? (
            <form className="lock-form" onSubmit={submitCode}>
              <input
                className="code-input"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Cevabını yaz"
                autoComplete="off"
                aria-label="Kapı kodu"
                key={wrong}
                style={{ animation: wrong > 0 ? 'shake 0.45s' : undefined }}
              />
              <button className="btn" type="submit" disabled={answer.trim().length === 0}>
                Kodu dene
              </button>
            </form>
          ) : (
            <div className="choices" key={wrong}>
              {(current.secenekler ?? []).map((opt, i) => (
                <button key={i} className="choice" onClick={() => pickChoice(i)}>
                  {opt}
                </button>
              ))}
            </div>
          )}

          <HintBox
            hints={current.ipuclari}
            shown={hintsUsed}
            max={Math.min(maxHints, current.ipuclari.length)}
            onMore={() => setHintsUsed((h) => h + 1)}
          />
        </div>
      )}

      {message && <p className={done || message.startsWith('Doğru') ? 'feedback good' : 'feedback'} role="status">{message}</p>}

      {done && (
        <div className="card result">
          <Confetti count={50} />
          <h2>Bölüm tamamlandı</h2>
          <button
            className="btn"
            onClick={() => {
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
  hints,
  shown,
  max,
  onMore,
}: {
  hints: string[];
  shown: number;
  max: number;
  onMore: () => void;
}) {
  if (max === 0) return <p className="muted">Bu seviyede ipucu yok.</p>;
  const left = max - shown;
  return (
    <div className="hints">
      {hints.slice(0, shown).map((h, i) => (
        <p key={i} className="hint">İpucu {i + 1}: {h}</p>
      ))}
      {left > 0 ? (
        <button type="button" className="link" onClick={onMore}>
          İpucu göster ({left} kaldı)
        </button>
      ) : null}
    </div>
  );
}
