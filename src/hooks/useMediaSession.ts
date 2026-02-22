import { useEffect } from 'react';
import { usePlayerStore } from '@/stores/playerStore';

/**
 * Integrates with the Media Session API for OS-level media controls.
 */
export function useMediaSession() {
  const { currentTrack, isPlaying, togglePlay, next, previous, seek, currentTime, duration } =
    usePlayerStore();

  useEffect(() => {
    if (!('mediaSession' in navigator)) return;

    if (currentTrack) {
      const artwork: MediaImage[] = currentTrack.coverArtUrl
        ? [{ src: currentTrack.coverArtUrl, sizes: '512x512', type: 'image/png' }]
        : [];

      navigator.mediaSession.metadata = new MediaMetadata({
        title: currentTrack.title,
        artist: currentTrack.artist,
        album: currentTrack.album,
        artwork,
      });
    }
  }, [currentTrack]);

  useEffect(() => {
    if (!('mediaSession' in navigator)) return;

    navigator.mediaSession.playbackState = isPlaying ? 'playing' : 'paused';
  }, [isPlaying]);

  useEffect(() => {
    if (!('mediaSession' in navigator)) return;

    navigator.mediaSession.setActionHandler('play', () => togglePlay());
    navigator.mediaSession.setActionHandler('pause', () => togglePlay());
    navigator.mediaSession.setActionHandler('nexttrack', () => next());
    navigator.mediaSession.setActionHandler('previoustrack', () => previous());
    navigator.mediaSession.setActionHandler('seekto', (details) => {
      if (details.seekTime !== undefined) {
        seek(details.seekTime);
      }
    });
    navigator.mediaSession.setActionHandler('seekforward', () => {
      seek(Math.min(duration, currentTime + 10));
    });
    navigator.mediaSession.setActionHandler('seekbackward', () => {
      seek(Math.max(0, currentTime - 10));
    });

    return () => {
      navigator.mediaSession.setActionHandler('play', null);
      navigator.mediaSession.setActionHandler('pause', null);
      navigator.mediaSession.setActionHandler('nexttrack', null);
      navigator.mediaSession.setActionHandler('previoustrack', null);
      navigator.mediaSession.setActionHandler('seekto', null);
      navigator.mediaSession.setActionHandler('seekforward', null);
      navigator.mediaSession.setActionHandler('seekbackward', null);
    };
  }, [togglePlay, next, previous, seek, currentTime, duration]);
}
