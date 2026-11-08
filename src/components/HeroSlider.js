'use client';

import { useEffect, useState } from 'react';

export default function HeroSlider({ slides }) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const n = slides.length;

  useEffect(() => {
    if (n < 2 || paused) return undefined;
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const t = setInterval(() => setI((v) => (v + 1) % n), 5500);
    return () => clearInterval(t);
  }, [n, paused]);

  if (!n) return null;
  const go = (d) => setI((v) => (v + d + n) % n);

  return (
    <div
      className="hero-slider"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      role="region"
      aria-roledescription="carrousel"
      aria-label="Nos interventions de nettoyage"
    >
      {slides.map((s, k) => (
        <figure key={k} className={`hs-slide${k === i ? ' on' : ''}`} aria-hidden={k !== i}>
          <img
            src={s.src}
            alt={s.alt || ''}
            width="1500"
            height="1000"
            loading={k === 0 ? 'eager' : 'lazy'}
            fetchPriority={k === 0 ? 'high' : 'auto'}
          />
          {s.caption ? <figcaption>{s.caption}</figcaption> : null}
        </figure>
      ))}
      {n > 1 && (
        <>
          <button type="button" className="hs-arrow prev" onClick={() => go(-1)} aria-label="Image précédente">
            ‹
          </button>
          <button type="button" className="hs-arrow next" onClick={() => go(1)} aria-label="Image suivante">
            ›
          </button>
          <div className="hs-dots">
            {slides.map((_, k) => (
              <button key={k} type="button" className={k === i ? 'on' : ''} onClick={() => setI(k)} aria-label={`Image ${k + 1}`} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
