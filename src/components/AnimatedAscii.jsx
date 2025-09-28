import { AnsiUp } from 'ansi_up';
import { useEffect, useLayoutEffect, useState, useRef } from 'react';

import styles from './AnimatedAscii.module.css';

export default function AnimatedAscii({ videoName, loopReverse = false, opacity = 0.25 }) {
  const [frames, setFrames] = useState([]);
  const [delay, setDelay] = useState(100);
  const idxRef = useRef(0);
  const directionRef = useRef(1);
  const [frameHtml, setFrameHtml] = useState('');
  const [scale, setScale] = useState(1);
  const timerRef = useRef(null);
  const ansiUpRef = useRef(new AnsiUp());
  const preRef = useRef(null);

  useEffect(() => {
    if (!videoName) return;
    const base = `/assets/videos/${videoName}/`;
    const ac = new AbortController();

    fetch(base + 'frames.json', { signal: ac.signal })
      .then(r => r.json())
      .then(meta => {
        setDelay(meta.frameDelayMs || 100);
        setFrames(meta.frames.map(f => base + f.file));
      })
      .catch(() => {});
    return () => { ac.abort(); clearInterval(timerRef.current); };
  }, [videoName]);

  useEffect(() => {
    if (frames.length === 0) return;
    let cancelled = false;
    const ac = new AbortController();

    const loadAndConvert = async (url) => {
      const txt = await fetch(url, { signal: ac.signal }).then(r => r.text());
      const html = ansiUpRef.current.ansi_to_html(txt);
      return { txt, html };
    };

    // load first frame immediately and start interval
    loadAndConvert(frames[0]).then(({ html }) => {
      if (cancelled) return;
      setFrameHtml(html);
    }).catch(() => { /* ignore */ });

    idxRef.current = 0;
    directionRef.current = 1;
    clearInterval(timerRef.current);

    timerRef.current = setInterval(async () => {
      const len = frames.length;
      if (len <= 1) return;

      if (!loopReverse) {
        idxRef.current = (idxRef.current + 1) % len;
      } else {
        let dir = directionRef.current;
        let next = idxRef.current + dir;
        if (next >= len) {
          dir = -1;
          next = Math.max(len - 2, 0);
        } else if (next < 0) {
          dir = 1;
          next = Math.min(1, len - 1);
        }
        directionRef.current = dir;
        idxRef.current = next;
      }

      try {
        const { html } = await loadAndConvert(frames[idxRef.current]);
        if (!cancelled) {
          setFrameHtml(html);
        }
      } catch (e) {
        // ignore fetch/abort errors
      }
    }, delay);

    return () => { cancelled = true; ac.abort(); clearInterval(timerRef.current); };
  }, [frames, delay, loopReverse]);

  // After each frame HTML is rendered, measure the pre element and compute a scale
  useLayoutEffect(() => {
    const el = preRef.current;
    if (!el || !frameHtml) return;

    // Ensure unscaled measurement
    el.style.transform = 'scale(1)';
    // Measure on next frame to guarantee DOM updated
    requestAnimationFrame(() => {
      const rect = el.getBoundingClientRect();
      const boxW = rect.width || el.scrollWidth || 1;
      const boxH = rect.height || el.scrollHeight || 1;
      const vw = window.innerWidth || 1;
      const vh = window.innerHeight || 1;
      // COVER behavior: scale so ascii fills viewport (don't shrink if already larger)
      const next = Math.max(1, vw / boxW, vh / boxH);
      setScale(prev => (Math.abs(prev - next) < 1e-6 ? prev : next));
    });
  }, [frameHtml]);

  if (frames.length === 0) return null;

  // render at a fixed base font-size and scale the whole pre to implement "cover"
  const baseFontPx = 12;

  return (
    <div
      className={styles.container}
      aria-hidden="true"
      style={{ '--ascii-opacity': `${opacity}` }}
    >
      <pre
        ref={preRef}
        className={styles.pre}
        style={{
          '--font-size': `${baseFontPx}px`,
          transform: `scale(${scale})`,
        }}
        dangerouslySetInnerHTML={{ __html: frameHtml }}
      />
    </div>
  );
}