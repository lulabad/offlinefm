import { create } from 'zustand';
import type { Track, RepeatMode } from '@/types';
import { audioEngine } from '@/services/audioEngine';

interface PlayerState {
  currentTrack: Track | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  muted: boolean;
  shuffleMode: boolean;
  repeatMode: RepeatMode;
  queue: Track[];
  queueIndex: number;

  // Actions
  playTrack: (track: Track, queue?: Track[], index?: number) => Promise<void>;
  togglePlay: () => Promise<void>;
  next: () => Promise<void>;
  previous: () => Promise<void>;
  seek: (time: number) => void;
  setVolume: (vol: number) => void;
  toggleMute: () => void;
  toggleShuffle: () => void;
  cycleRepeat: () => void;
  setCurrentTime: (t: number) => void;
  setDuration: (d: number) => void;
  setQueue: (tracks: Track[], index?: number) => void;
  setIsPlaying: (playing: boolean) => void;
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
  currentTrack: null,
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  volume: 0.8,
  muted: false,
  shuffleMode: false,
  repeatMode: 'off',
  queue: [],
  queueIndex: -1,

  playTrack: async (track, queue, index) => {
    const file = track.file ?? (track.fileHandle ? await track.fileHandle.getFile() : null);
    if (!file) return;

    const url = URL.createObjectURL(file);
    await audioEngine.loadTrack(url);
    audioEngine.setVolume(get().muted ? 0 : get().volume);
    await audioEngine.play();

    set({
      currentTrack: track,
      isPlaying: true,
      currentTime: 0,
      duration: audioEngine.duration || track.duration,
      ...(queue ? { queue, queueIndex: index ?? 0 } : {}),
    });
  },

  togglePlay: async () => {
    const { isPlaying, currentTrack } = get();
    if (!currentTrack) return;

    if (isPlaying) {
      audioEngine.pause();
      set({ isPlaying: false });
    } else {
      await audioEngine.play();
      set({ isPlaying: true });
    }
  },

  next: async () => {
    const { queue, queueIndex, repeatMode, shuffleMode } = get();
    if (queue.length === 0) return;

    let nextIndex: number;
    if (shuffleMode) {
      nextIndex = Math.floor(Math.random() * queue.length);
    } else {
      nextIndex = queueIndex + 1;
    }

    if (nextIndex >= queue.length) {
      if (repeatMode === 'all') {
        nextIndex = 0;
      } else {
        audioEngine.pause();
        set({ isPlaying: false });
        return;
      }
    }

    const nextTrack = queue[nextIndex];
    if (nextTrack) {
      await get().playTrack(nextTrack, queue, nextIndex);
    }
  },

  previous: async () => {
    const { queue, queueIndex, currentTime } = get();
    if (queue.length === 0) return;

    // If more than 3 seconds in, restart current track
    if (currentTime > 3) {
      audioEngine.seek(0);
      set({ currentTime: 0 });
      return;
    }

    const prevIndex = Math.max(0, queueIndex - 1);
    const prevTrack = queue[prevIndex];
    if (prevTrack) {
      await get().playTrack(prevTrack, queue, prevIndex);
    }
  },

  seek: (time) => {
    audioEngine.seek(time);
    set({ currentTime: time });
  },

  setVolume: (vol) => {
    const clamped = Math.min(1, Math.max(0, vol));
    audioEngine.setVolume(clamped);
    set({ volume: clamped, muted: false });
    localStorage.setItem('offlinefm_volume', String(clamped));
  },

  toggleMute: () => {
    const { muted, volume } = get();
    if (muted) {
      audioEngine.setVolume(volume);
      set({ muted: false });
    } else {
      audioEngine.setVolume(0);
      set({ muted: true });
    }
  },

  toggleShuffle: () => set((s) => ({ shuffleMode: !s.shuffleMode })),

  cycleRepeat: () =>
    set((s) => ({
      repeatMode: s.repeatMode === 'off' ? 'all' : s.repeatMode === 'all' ? 'one' : 'off',
    })),

  setCurrentTime: (t) => set({ currentTime: t }),
  setDuration: (d) => set({ duration: d }),
  setQueue: (tracks, index) => set({ queue: tracks, queueIndex: index ?? 0 }),
  setIsPlaying: (playing) => set({ isPlaying: playing }),
}));
