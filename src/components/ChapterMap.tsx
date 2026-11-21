import '../chapters.css';
import { CHAPTERS, isChapterUnlocked } from '../game/chapters';
import type { Chapter } from '../game/chapters';
import { SoundToggle } from './Effects';

interface Props {
  solved: number[];
  onOpen: (chapter: Chapter) => void;
}

export function ChapterMap({ solved, onOpen }: Props) {
  const levels: { seviye: string; chapters: Chapter[] }[] = [];
  for (const c of CHAPTERS) {
    const last = levels[levels.length - 1];
    if (last && last.seviye === c.seviye) last.chapters.push(c);
    else levels.push({ seviye: c.seviye, chapters: [c] });
  }

  return (
    <div className="map">
      <header className="map-head">
        <h1>Karanlık Bölümler</h1>
        <p className="muted">{solved.length} / {CHAPTERS.length} bölüm tamamlandı</p>
        <div className="progress" aria-hidden="true">
          <span style={{ width: `${(solved.length / CHAPTERS.length) * 100}%` }} />
        </div>
        <div className="map-tools">
          <SoundToggle />
        </div>
      </header>

      {levels.map((lvl) => (
        <section key={lvl.seviye} className="unit">
          <h2>{lvl.seviye} seviyesi</h2>
          <div className="grid">
            {lvl.chapters.map((c) => {
              const done = solved.includes(c.bolum);
              const open = isChapterUnlocked(c.bolum, solved);
              const cls = ['tile-room', done ? 'done' : '', !open ? 'locked' : ''].join(' ');
              return (
                <button
                  key={c.bolum}
                  className={cls}
                  disabled={!open}
                  onClick={() => onOpen(c)}
                  aria-label={`Bölüm ${c.bolum}: ${c.baslik}`}
                >
                  <span className="num">{c.bolum}</span>
                  <span className="kind">{done ? '✓' : ''}</span>
                </button>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
