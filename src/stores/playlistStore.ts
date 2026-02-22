import { create } from 'zustand';
import type { Playlist } from '@/types';
import { savePlaylists, getAllPlaylists } from '@/services/database';

interface PlaylistState {
  playlists: Playlist[];
  activePlaylistId: string | null;

  // Actions
  loadPlaylists: () => Promise<void>;
  createPlaylist: (name: string) => void;
  deletePlaylist: (id: string) => void;
  renamePlaylist: (id: string, name: string) => void;
  addToPlaylist: (playlistId: string, trackIds: string[]) => void;
  removeFromPlaylist: (playlistId: string, trackId: string) => void;
  reorderPlaylist: (playlistId: string, fromIndex: number, toIndex: number) => void;
  setActivePlaylist: (id: string | null) => void;
  persist: () => Promise<void>;
}

function genId(): string {
  return `pl_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export const usePlaylistStore = create<PlaylistState>((set, get) => ({
  playlists: [],
  activePlaylistId: null,

  loadPlaylists: async () => {
    const playlists = await getAllPlaylists();
    set({ playlists });
  },

  createPlaylist: (name) => {
    const now = Date.now();
    const playlist: Playlist = {
      id: genId(),
      name,
      trackIds: [],
      createdAt: now,
      updatedAt: now,
    };
    set((s) => ({ playlists: [...s.playlists, playlist] }));
    get().persist();
  },

  deletePlaylist: (id) => {
    set((s) => ({
      playlists: s.playlists.filter((p) => p.id !== id),
      activePlaylistId: s.activePlaylistId === id ? null : s.activePlaylistId,
    }));
    get().persist();
  },

  renamePlaylist: (id, name) => {
    set((s) => ({
      playlists: s.playlists.map((p) => (p.id === id ? { ...p, name, updatedAt: Date.now() } : p)),
    }));
    get().persist();
  },

  addToPlaylist: (playlistId, trackIds) => {
    set((s) => ({
      playlists: s.playlists.map((p) =>
        p.id === playlistId
          ? { ...p, trackIds: [...p.trackIds, ...trackIds], updatedAt: Date.now() }
          : p,
      ),
    }));
    get().persist();
  },

  removeFromPlaylist: (playlistId, trackId) => {
    set((s) => ({
      playlists: s.playlists.map((p) =>
        p.id === playlistId
          ? { ...p, trackIds: p.trackIds.filter((id) => id !== trackId), updatedAt: Date.now() }
          : p,
      ),
    }));
    get().persist();
  },

  reorderPlaylist: (playlistId, fromIndex, toIndex) => {
    set((s) => ({
      playlists: s.playlists.map((p) => {
        if (p.id !== playlistId) return p;
        const ids = [...p.trackIds];
        const [removed] = ids.splice(fromIndex, 1);
        ids.splice(toIndex, 0, removed);
        return { ...p, trackIds: ids, updatedAt: Date.now() };
      }),
    }));
    get().persist();
  },

  setActivePlaylist: (id) => set({ activePlaylistId: id }),

  persist: async () => {
    await savePlaylists(get().playlists);
  },
}));
