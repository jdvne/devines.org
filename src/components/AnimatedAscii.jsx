import { AnsiUp } from 'ansi_up';
import { useEffect, useRef, useState } from 'react';

import styles from './AnimatedAscii.module.css';

// Configuration constants
const CONCURRENCY_LIMIT = 4;
const DEFAULT_FRAME_DELAY = 100;
const FADE_IN_DELAY = 10;
const INITIAL_RESIZE_DELAY = 100;

/**
 * Custom hook for loading ASCII video frames
 * @param {string} videoName - Name of the video to load
 * @returns {Object} Loading state and frame data
 */
function useAsciiFrames(videoName) {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState({ loaded: 0, total: 0 });
  const [fadeIn, setFadeIn] = useState(false);
  
  const framesRef = useRef([]);
  const frameCountRef = useRef(0);
  const frameDelayRef = useRef(DEFAULT_FRAME_DELAY);
  const fetchControllers = useRef([]);

  useEffect(() => {
    if (!videoName) return;
    
    let cancelled = false;
    setLoading(true);
    setFadeIn(false);
    setProgress({ loaded: 0, total: 0 });
    framesRef.current = [];
    frameCountRef.current = 0;
    frameDelayRef.current = DEFAULT_FRAME_DELAY;
    
    // Cancel any existing requests
    fetchControllers.current.forEach(controller => controller.abort());
    fetchControllers.current = [];
    
    const baseUrl = `/assets/videos/${videoName}/`;
    const ansiUp = new AnsiUp();
    let nextFrameIndex = 1;
    let inFlightRequests = 0;

    /**
     * Fetch the next batch of frames
     * @param {Object} metadata - Frame metadata from frames.json
     */
    const fetchNextBatch = (metadata) => {
      while (inFlightRequests < CONCURRENCY_LIMIT && nextFrameIndex < metadata.frames.length) {
        const frameIndex = nextFrameIndex++;
        inFlightRequests++;
        
        const frameUrl = baseUrl + metadata.frames[frameIndex].file;
        const abortController = new AbortController();
        fetchControllers.current.push(abortController);
        
        (async () => {
          try {
            const response = await fetch(frameUrl, { signal: abortController.signal });
            const textContent = await response.text();
            const htmlContent = ansiUp.ansi_to_html(textContent);
            
            if (cancelled) return;
            
            framesRef.current[frameIndex] = htmlContent;
            setProgress(prev => ({ ...prev, loaded: prev.loaded + 1 }));
          } catch (error) {
            // Ignore fetch errors (likely due to cancellation)
          } finally {
            inFlightRequests--;
            if (!cancelled && nextFrameIndex < metadata.frames.length) {
              fetchNextBatch(metadata);
            }
          }
        })();
      }
    };

    const loadFrames = async () => {
      try {
        // Load metadata first
        const metadataResponse = await fetch(baseUrl + 'frames.json');
        const metadata = await metadataResponse.json();
        
        frameCountRef.current = metadata.frames.length;
        frameDelayRef.current = metadata.frameDelayMs || DEFAULT_FRAME_DELAY;
        setProgress({ loaded: 0, total: metadata.frames.length });
        
        // Load first frame immediately for instant display
        const firstFrameUrl = baseUrl + metadata.frames[0].file;
        const firstFrameController = new AbortController();
        fetchControllers.current.push(firstFrameController);
        
        const firstFrameResponse = await fetch(firstFrameUrl, { signal: firstFrameController.signal });
        const firstFrameText = await firstFrameResponse.text();
        const firstFrameHtml = ansiUp.ansi_to_html(firstFrameText);
        
        if (cancelled) return;
        
        framesRef.current[0] = firstFrameHtml;
        setProgress({ loaded: 1, total: metadata.frames.length });
        setLoading(false);
        
        // Trigger fade-in effect
        setTimeout(() => setFadeIn(true), FADE_IN_DELAY);
        
        // Start loading remaining frames in background
        fetchNextBatch(metadata);
      } catch (error) {
        // Ignore loading errors
      }
    };

    loadFrames();

    // Return cleanup function directly
    return () => {
      cancelled = true;
      fetchControllers.current.forEach(controller => controller.abort());
      fetchControllers.current = [];
    };
  }, [videoName]);

  return {
    loading,
    progress,
    fadeIn,
    frames: framesRef.current,
    frameCount: frameCountRef.current,
    frameDelay: frameDelayRef.current
  };
}

/**
 * Custom hook for managing ASCII animation
 * @param {Array} frames - Array of frame HTML strings
 * @param {number} frameDelay - Delay between frames in milliseconds
 * @param {boolean} loopReverse - Whether to reverse the animation loop
 * @param {boolean} loading - Whether frames are still loading
 * @param {React.RefObject} preRef - Reference to the pre element
 */
function useAsciiAnimation(frames, frameDelay, loopReverse, loading, preRef) {
  const animationRef = useRef();
  const frameIndexRef = useRef(0);
  const directionRef = useRef(1);
  const playingRef = useRef(true);
  const lastFrameTimeRef = useRef(performance.now());

  useEffect(() => {
    if (loading) return;
    
    playingRef.current = true;
    
    /**
     * Animation loop function
     * @param {number} currentTime - Current timestamp
     */
    const animate = (currentTime) => {
      if (!playingRef.current) return;
      
      const availableFrames = frames.findIndex(frame => !frame);
      const frameCount = availableFrames === -1 ? frames.length : availableFrames;
      
      if (frameCount < 1) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }
      
      const elapsed = currentTime - lastFrameTimeRef.current;
      
      if (elapsed >= frameDelay) {
        let newFrameIndex = frameIndexRef.current;
        let newDirection = directionRef.current;
        
        if (!loopReverse) {
          // Simple forward loop
          newFrameIndex = (newFrameIndex + 1) % frameCount;
        } else {
          // Ping-pong loop
          let nextIndex = newFrameIndex + newDirection;
          
          if (nextIndex >= frameCount) {
            newDirection = -1;
            nextIndex = Math.max(frameCount - 2, 0);
          } else if (nextIndex < 0) {
            newDirection = 1;
            nextIndex = Math.min(1, frameCount - 1);
          }
          
          newFrameIndex = nextIndex;
        }
        
        frameIndexRef.current = newFrameIndex;
        directionRef.current = newDirection;
        
        // Update DOM directly for performance
        if (preRef.current) {
          preRef.current.innerHTML = frames[newFrameIndex] || frames[0];
        }
        
        lastFrameTimeRef.current = currentTime;
      }
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    // Set initial frame
    if (preRef.current && frames[0]) {
      preRef.current.innerHTML = frames[0];
    }
    
    animationRef.current = requestAnimationFrame(animate);
    
    return () => {
      playingRef.current = false;
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [loading, loopReverse, frames, frameDelay, preRef]);
}

/**
 * Custom hook for responsive scaling of ASCII content
 * @param {React.RefObject} preRef - Reference to the pre element
 */
function useResponsiveScaling(preRef) {
  useEffect(() => {
    /**
     * Handle window resize and scale content to fit viewport
     */
    const handleResize = () => {
      if (!preRef.current) return;
      
      // Reset transform before measuring
      preRef.current.style.transform = 'scale(1)';
      
      requestAnimationFrame(() => {
        const element = preRef.current;
        if (!element) return;
        
        // Get content dimensions
        const rect = element.getBoundingClientRect();
        const contentWidth = rect.width || element.scrollWidth || 1;
        const contentHeight = rect.height || element.scrollHeight || 1;
        
        // Get viewport dimensions
        const viewportWidth = window.innerWidth || 1;
        const viewportHeight = window.innerHeight || 1;
        
        // Calculate aspect ratios
        const contentAspectRatio = contentWidth / contentHeight;
        const viewportAspectRatio = viewportWidth / viewportHeight;
        
        // Calculate scale for object-fit: cover behavior
        // Cover means the content should fill the entire container while maintaining aspect ratio
        let scale;
        if (contentAspectRatio > viewportAspectRatio) {
          // Content is wider relative to its height than viewport
          // Scale based on height to fill viewport height
          scale = viewportHeight / contentHeight;
        } else {
          // Content is taller relative to its width than viewport
          // Scale based on width to fill viewport width
          scale = viewportWidth / contentWidth;
        }
        
        // Apply the scale with center origin
        element.style.transform = `scale(${scale})`;
        element.style.transformOrigin = 'center center';
      });
    };
    
    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Initial resize after a short delay to ensure content is rendered
    const initialResizeTimeout = setTimeout(handleResize, INITIAL_RESIZE_DELAY);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(initialResizeTimeout);
    };
  }, [preRef]);
}

/**
 * Loading indicator component
 * @param {Object} progress - Progress object with loaded and total counts
 */
function LoadingIndicator({ progress }) {
  return (
    <div style={{
      position: 'absolute',
      bottom: 8,
      right: 8,
      fontSize: '0.9em',
      color: '#fff8',
      pointerEvents: 'none'
    }}>
      Loading ASCII video... {progress.loaded}/{progress.total}
    </div>
  );
}

/**
 * AnimatedAsciiBackground - A component that displays animated ASCII art from video frames
 * @param {Object} props - Component props
 * @param {string} props.videoName - Name of the video to load frames from
 * @param {number} [props.opacity=0.25] - Opacity of the ASCII background
 * @param {boolean} [props.loopReverse=false] - Whether to reverse the animation loop
 */
export default function AnimatedAsciiBackground({ videoName, opacity = 0.25, loopReverse = false }) {
  const preRef = useRef(null);
  
  // Use custom hooks for different concerns
  const { loading, progress, fadeIn, frames, frameDelay } = useAsciiFrames(videoName);
  useAsciiAnimation(frames, frameDelay, loopReverse, loading, preRef);
  useResponsiveScaling(preRef);

  // Fade-in effect class
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
      {loading && <LoadingIndicator progress={progress} />}
    </div>
  );
}