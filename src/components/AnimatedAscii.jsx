import { AnsiUp } from 'ansi_up';
import { useEffect, useRef, useState } from 'react';

import styles from './AnimatedAscii.module.css';

// New: AnimatedAsciiBackground - direct DOM animation, progressive loading, smooth UX
export default function AnimatedAsciiBackground({ videoName, opacity = 0.25, loopReverse = false }) {
  const preRef = useRef(null);
  const animationRef = useRef();
  const framesRef = useRef([]); // Array of HTML strings
  const frameCountRef = useRef(0);
  const frameDelayRef = useRef(100);
  const frameIdxRef = useRef(0);
  const directionRef = useRef(1);
  const playingRef = useRef(true);
  const fetchControllers = useRef([]);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState({ loaded: 0, total: 0 });
  const [fadeIn, setFadeIn] = useState(false);

  // Load manifest and first frame ASAP
  useEffect(() => {
    if (!videoName) return;
    let cancelled = false;
    setLoading(true);
    setFadeIn(false);
    setProgress({ loaded: 0, total: 0 });
    framesRef.current = [];
    frameCountRef.current = 0;
    frameDelayRef.current = 100;
    frameIdxRef.current = 0;
    directionRef.current = 1;
    fetchControllers.current.forEach(ac => ac.abort());
    fetchControllers.current = [];
    const base = `/assets/videos/${videoName}/`;
    const ansiUp = new AnsiUp();
    const CONCURRENCY = 4;
    let nextIdx = 1;
    let inFlight = 0;
    function fetchNext(meta) {
      while (inFlight < CONCURRENCY && nextIdx < meta.frames.length) {
        const idx = nextIdx++;
        inFlight++;
        const url = base + meta.frames[idx].file;
        const ac = new AbortController();
        fetchControllers.current.push(ac);
        (async () => {
          try {
            const txt = await fetch(url, { signal: ac.signal }).then(r => r.text());
            const html = ansiUp.ansi_to_html(txt);
            if (cancelled) return;
            framesRef.current[idx] = html;
            setProgress(p => ({ ...p, loaded: p.loaded + 1 }));
          } catch {/* ignore */}
          finally {
            inFlight--;
            if (!cancelled && nextIdx < meta.frames.length) {
              fetchNext(meta);
            }
          }
        })();
      }
    }
    async function loadFrames() {
      try {
        const meta = await fetch(base + 'frames.json').then(r => r.json());
        frameCountRef.current = meta.frames.length;
        frameDelayRef.current = meta.frameDelayMs || 100;
        setProgress({ loaded: 0, total: meta.frames.length });
        // Fetch and convert the first frame immediately
        const firstUrl = base + meta.frames[0].file;
        const ac0 = new AbortController();
        fetchControllers.current.push(ac0);
        const firstTxt = await fetch(firstUrl, { signal: ac0.signal }).then(r => r.text());
        const firstHtml = ansiUp.ansi_to_html(firstTxt);
        if (cancelled) return;
        framesRef.current[0] = firstHtml;
        setProgress({ loaded: 1, total: meta.frames.length });
        setLoading(false);
        setTimeout(() => setFadeIn(true), 10); // trigger fade-in
        // Start loading the rest in background
        fetchNext(meta);
      } catch {
        // ignore
      }
    }
    loadFrames();
    return () => {
      cancelled = true;
      fetchControllers.current.forEach(ac => ac.abort());
      fetchControllers.current = [];
      playingRef.current = false;
    };
  }, [videoName]);

  // Animation loop (direct DOM update)
  useEffect(() => {
    if (loading) return;
    playingRef.current = true;
    let lastTime = performance.now();
    function animate(now) {
      if (!playingRef.current) return;
      const frames = framesRef.current;
      const maxIdx = frames.findIndex(f => !f);
      const available = maxIdx === -1 ? frames.length : maxIdx;
      if (available < 1) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }
      let idx = frameIdxRef.current;
      let dir = directionRef.current;
      const elapsed = now - lastTime;
      if (elapsed >= frameDelayRef.current) {
        if (!loopReverse) {
          idx = (idx + 1) % available;
        } else {
          let next = idx + dir;
          if (next >= available) {
            dir = -1;
            next = Math.max(available - 2, 0);
          } else if (next < 0) {
            dir = 1;
            next = Math.min(1, available - 1);
          }
          idx = next;
        }
        frameIdxRef.current = idx;
        directionRef.current = dir;
        // Direct DOM update
        if (preRef.current) {
          preRef.current.innerHTML = frames[idx] || frames[0];
        }
        lastTime = now;
      }
      animationRef.current = requestAnimationFrame(animate);
    }
    // Set first frame immediately
    if (preRef.current && framesRef.current[0]) {
      preRef.current.innerHTML = framesRef.current[0];
    }
    animationRef.current = requestAnimationFrame(animate);
    return () => {
      playingRef.current = false;
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [loading, loopReverse]);

  // Responsive scaling (optional, can be improved)
  useEffect(() => {
    function handleResize() {
      if (!preRef.current) return;
      preRef.current.style.transform = 'scale(1)';
      requestAnimationFrame(() => {
        const el = preRef.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const vw = window.innerWidth || 1;
        const vh = window.innerHeight || 1;
        const boxW = rect.width || el.scrollWidth || 1;
        const boxH = rect.height || el.scrollHeight || 1;
        const scale = Math.min(1, vw / boxW, vh / boxH);
        el.style.transform = `scale(${scale})`;
      });
    }
    window.addEventListener('resize', handleResize);
    setTimeout(handleResize, 100);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fade-in effect
  const fadeClass = fadeIn ? styles.fadeIn : '';

  return (
    <div
      className={styles.container}
      aria-hidden="true"
      style={{ '--ascii-opacity': `${opacity}` }}
    >
      <pre
        ref={preRef}
        className={`${styles.pre} ${fadeClass}`}
        style={{ '--font-size': '12px' }}
      />
      {loading && (
        <div style={{position:'absolute',bottom:8,right:8,fontSize:'0.9em',color:'#fff8',pointerEvents:'none'}}>
          Loading ASCII video... {progress.loaded}/{progress.total}
        </div>
      )}
    </div>
  );
}