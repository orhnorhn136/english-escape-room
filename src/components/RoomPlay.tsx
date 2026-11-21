import { useMemo, useState } from 'react';
import type { Question, Room } from '../game/types';
import { shuffle } from '../game/rooms';
import { pickQuestions } from '../game/recent';
import { isOrderCorrect, starsFor } from '../game/check';
import { playCorrect, playWin, playWrong } from '../game/sound';
import { Confetti, SoundToggle } from './Effects';

interface Props {
  room: Room;
  all: Room[];
  onWon: (stars: number) => void;
  onExit: () => void;
  onRetry: () => void;
}

type Status = 'playing' | 'correct' | 'won' | 'lost';

const MAX_LIVES = 3;

export function RoomPlay({ room, all, onWon, onExit, onRetry }: Props) {
  const [questions] = useState<Question[]>(() => pickQuestions(room, all));
  const [index, setIndex] = useState(0);
  const [lives, setLives] = useState(MAX_LIVES);
  const [mistakes, setMistakes] = useState(0);
  const [status, setStatus] = useState<Status>('playing');
  const [message, setMessage] = useState<string | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [built, setBuilt] = useState<number[]>([]);
  // Her yanlışta artar; kartı yeniden oluşturup sallama animasyonunu tetikler
  const [shake, setShake] = useState(0);

  const q = questions[index];

  // Sıralama soruları için kelimeler rastgele karıştırılır.
  const bank = useMemo(
    () => (q && q.kind === 'order' ? shuffle(q.kelimeler.map((_, i) => i)) : []),
    [q],
  );

  if (questions.length === 0) {
    return (
      <div className="card">
        <h2>{room.baslik}</h2>
        <p>Bu oda için henüz soru yok.</p>
        <button className="btn" onClick={onExit}>Haritaya dön</button>
      </div>
    );
  }

  function wrongAnswer() {
    const next = lives - 1;
    setLives(next);
    setMistakes((m) => m + 1);
    setShowHint(true);
    setShake((s) => s + 1);
    playWrong();
    if (next <= 0) {
      setStatus('lost');
      setMessage('Kapı kilitlendi!');
    } else {
      setMessage('Yanlış, tekrar dene.');
    }
  }

  function correctAnswer() {
    setStatus('correct');
    setMessage('Doğru!');
    playCorrect();
  }

  function pickChoice(i: number) {
    if (!q || q.kind !== 'choice' || status !== 'playing') return;
    if (i === q.dogru) correctAnswer();
    else wrongAnswer();
  }

  function checkOrder() {
    if (!q || q.kind !== 'order' || status !== 'playing') return;
    const words = built.map((i) => q.kelimeler[i]);
    if (isOrderCorrect(words, q.cevap)) correctAnswer();
    else wrongAnswer();
  }

  function next() {
    if (index + 1 < questions.length) {
      setIndex(index + 1);
      setStatus('playing');
      setMessage(null);
      setShowHint(false);
      setBuilt([]);
      return;
    }
    setStatus('won');
    setMessage('Tebrikler, kapı açıldı!');
    playWin();
    onWon(starsFor(mistakes));
  }

  const stars = starsFor(mistakes);
  const remaining = bank.filter((i) => !built.includes(i));

  return (
    <div className="room">
      <div className="room-head">
        <button className="link" onClick={onExit}>← Harita</button>
        <div className="lives" aria-label={`${lives} can`}>
          {Array.from({ length: MAX_LIVES }, (_, i) => (
            <span key={i} className={i < lives ? 'heart' : 'heart off'}>♥</span>
          ))}
        </div>
        <SoundToggle />
      </div>

      <div className="room-title">
        <span className="badge">Oda {room.oda}</span>
        <h2>{room.baslik}</h2>
        <p className="muted">{room.uniteBaslik}</p>
        <p className="muted">Soru {index + 1} / {questions.length}</p>
      </div>

      {status === 'won' ? (
        <div className="card result">
          <Confetti />
          <h2>{message}</h2>
          <div className="stars" aria-label={`${stars} yıldız`}>
            {[1, 2, 3].map((s) => (
              <span key={s} className={s <= stars ? 'star' : 'star off'}>★</span>
            ))}
          </div>
          <button className="btn" onClick={onExit}>Haritaya dön</button>
        </div>
      ) : status === 'lost' ? (
        <div className="card result">
          <h2>{message}</h2>
          <p className="muted">Canların bitti. Tekrar deneyebilirsin.</p>
          <button className="btn" onClick={onRetry}>Tekrar dene</button>
        </div>
      ) : (
        <div className={shake ? 'card shake' : 'card'} key={shake}>
          {q.kind === 'choice' ? (
            <>
              <p className="question">{q.soru}</p>
              <div className="choices">
                {q.secenekler.map((opt, i) => (
                  <button
                    key={i}
                    className={
                      status === 'correct' && i === q.dogru ? 'choice good' : 'choice'
                    }
                    disabled={status !== 'playing'}
                    onClick={() => pickChoice(i)}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </>
          ) : (
            <>
              <p className="question">{q.soru}</p>
              <div className="answer" aria-label="Cümlen">
                {built.length === 0 && <span className="muted">Kelimelere dokun</span>}
                {built.map((i, pos) => (
                  <button
                    key={`${i}-${pos}`}
                    className="tile used"
                    disabled={status !== 'playing'}
                    onClick={() => setBuilt(built.filter((_, p) => p !== pos))}
                  >
                    {q.kelimeler[i]}
                  </button>
                ))}
              </div>
              <div className="bank">
                {remaining.map((i) => (
                  <button
                    key={i}
                    className="tile"
                    disabled={status !== 'playing'}
                    onClick={() => setBuilt([...built, i])}
                  >
                    {q.kelimeler[i]}
                  </button>
                ))}
              </div>
              {status === 'playing' && (
                <button className="btn" disabled={remaining.length > 0} onClick={checkOrder}>
                  Kontrol et
                </button>
              )}
            </>
          )}

          {message && (
            <p className={status === 'correct' ? 'feedback good' : 'feedback'} role="status">
              {message}
            </p>
          )}

          {showHint && status !== 'correct' && (
            <p className="hint">İpucu: {q.ipucu}</p>
          )}

          {status === 'playing' && !showHint && (
            <button className="link" onClick={() => setShowHint(true)}>İpucu göster</button>
          )}

          {status === 'correct' && (
            <button className="btn" onClick={next}>
              {index + 1 < questions.length ? 'Devam' : 'Kapıyı aç'}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
