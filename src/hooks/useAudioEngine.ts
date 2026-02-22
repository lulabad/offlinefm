import { useEffect, useRef } from 'react';
import { usePlayerStore } from '@/stores/playerStore';
import { audioEngine } from '@/services/audioEngine';

/**
 * Hook that wires HTMLAudioElement events to the player store
 * and manages time updates via requestAnimationFrame.
 */
export function useAudioEngine() {
  const rafRef = useRef<number>(0);
  const { setCurrentTime, setDuration, setIsPlaying, next, currentTrack, repeatMode } =
    usePlayerStore();

  useEffect(() => {
    const audio = audioEngine.getAudioElement();

    const onLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const onEnded = () => {
      if (repeatMode === 'one') {
        audio.currentTime = 0;
        audio.play();
      } else {
        next();
      }
    };

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);

    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);

    // Time update via RAF for smooth progress
    const tick = () => {
      if (!audio.paused) {
        setCurrentTime(audio.currentTime);
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      cancelAnimationFrame(rafRef.current);
    };
  }, [currentTrack, repeatMode, setCurrentTime, setDuration, setIsPlaying, next]);
}
