import { useEffect, useRef, useState } from 'react';
import tabulaTheme from 'assets/sounds/music/tabulaTheme.mp3';

interface MainThemePlayerProps {
  started: boolean;
  volume: number;
}

export function MainThemePlayer({ started, volume }: MainThemePlayerProps) {
  const audioA = useRef<HTMLAudioElement | null>(null);
  const audioB = useRef<HTMLAudioElement | null>(null);
  const [activeAudio, setActiveAudio] = useState<'A' | 'B'>('A');
  const crossfadeDuration = 2.5; // seconds
  const [duration, setDuration] = useState<number | null>(null);

  // Prepare both audio elements
  useEffect(() => {
    audioA.current = new Audio(tabulaTheme);
    audioB.current = new Audio(tabulaTheme);
    audioA.current.volume = volume;
    audioB.current.volume = 0;
    audioA.current.preload = 'auto';
    audioB.current.preload = 'auto';
    audioA.current.addEventListener('loadedmetadata', () =>
      setDuration(audioA.current?.duration ?? null),
    );
    return () => {
      audioA.current?.pause();
      audioB.current?.pause();
      audioA.current = null;
      audioB.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update volume for both (do not reset playback)
  useEffect(() => {
    if (audioA.current) audioA.current.volume = activeAudio === 'A' ? volume : 0;
    if (audioB.current) audioB.current.volume = activeAudio === 'B' ? volume : 0;
  }, [volume, activeAudio]);

  // Crossfade logic
  useEffect(() => {
    if (!started || !duration) return;
    let fadeTimer: number | undefined;
    let crossfadeStarted = false;
    const main = activeAudio === 'A' ? audioA.current : audioB.current;
    const alt = activeAudio === 'A' ? audioB.current : audioA.current;
    if (!main || !alt) return;
    // Only reset and play if just started or just switched activeAudio
    if (main.paused) {
      main.currentTime = 0;
      main.volume = volume;
      main.play();
    }
    alt.pause();
    alt.currentTime = 0;
    alt.volume = 0;
    function checkCrossfade() {
      if (!main || !alt) return;
      if (duration && main.currentTime > duration - crossfadeDuration && !crossfadeStarted) {
        crossfadeStarted = true;
        alt.currentTime = 0;
        alt.volume = 0;
        alt.play();
        // Fade out main, fade in alt
        const fadeSteps = 25;
        let step = 0;
        const fadeInterval = setInterval(() => {
          step++;
          const t = step / fadeSteps;
          main.volume = volume * (1 - t);
          alt.volume = volume * t;
          if (step >= fadeSteps) {
            clearInterval(fadeInterval);
            main.pause();
            main.currentTime = 0;
            setActiveAudio(activeAudio === 'A' ? 'B' : 'A');
          }
        }, (crossfadeDuration * 1000) / fadeSteps);
      }
      fadeTimer = window.requestAnimationFrame(checkCrossfade);
    }
    fadeTimer = window.requestAnimationFrame(checkCrossfade);
    return () => {
      if (fadeTimer) window.cancelAnimationFrame(fadeTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [started, activeAudio, duration]);

  return null;
}
