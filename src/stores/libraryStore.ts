import { create } from 'zustand';
import type { Track, Album, Artist, LibraryView, SortField } from '@/types';
import { openMusicFolder } from '@/services/fileSystemAccess';
import { parseAudioFiles } from '@/services/metadataParser';
import { addTracks, getAllTracks, clearTracks, clearCoverArt } from '@/services/database';

interface LibraryState {
  tracks: Track[];
  albums: Album[];
  artists: Artist[];
  searchQuery: string;
  sortBy: SortField;
  sortAsc: boolean;
  view: LibraryView;
  isLoading: boolean;
  loadingProgress: { done: number; total: number } | null;

  // Actions
  importFolder: () => Promise<void>;
  loadFromDB: () => Promise<void>;
  search: (query: string) => void;
  sort: (field: SortField) => void;
  setView: (view: LibraryView) => void;
  clearLibrary: () => Promise<void>;
}

function deriveAlbums(tracks: Track[]): Album[] {
  const map = new Map<string, Album>();
  for (const t of tracks) {
    const key = `${t.album}|||${t.artist}`;
    if (!map.has(key)) {
      map.set(key, {
        name: t.album,
        artist: t.artist,
        coverArtUrl: t.coverArtUrl,
        trackIds: [],
        year: t.year,
      });
    }
    map.get(key)!.trackIds.push(t.id);
  }
  return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name));
}

function deriveArtists(tracks: Track[]): Artist[] {
  const map = new Map<string, Artist>();
  for (const t of tracks) {
    if (!map.has(t.artist)) {
      map.set(t.artist, { name: t.artist, albumNames: [], trackIds: [] });
    }
    const artist = map.get(t.artist)!;
    artist.trackIds.push(t.id);
    if (!artist.albumNames.includes(t.album)) {
      artist.albumNames.push(t.album);
    }
  }
  return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name));
}

export const useLibraryStore = create<LibraryState>((set, get) => ({
  tracks: [],
  albums: [],
  artists: [],
  searchQuery: '',
  sortBy: 'title',
  sortAsc: true,
  view: 'tracks',
  isLoading: false,
  loadingProgress: null,

  importFolder: async () => {
    set({ isLoading: true, loadingProgress: null });
    try {
      const entries = await openMusicFolder();
      if (entries.length === 0) {
        set({ isLoading: false });
        return;
      }

      const tracks = await parseAudioFiles(entries, (done, total) => {
        set({ loadingProgress: { done, total } });
      });

      // Persist to IndexedDB (strip non-serializable fields)
      const serializableTracks = tracks.map((t) => ({
        ...t,
        file: undefined,
        fileHandle: undefined,
        coverArtUrl: undefined,
      }));
      await addTracks(serializableTracks as unknown as Track[]);

      set({
        tracks,
        albums: deriveAlbums(tracks),
        artists: deriveArtists(tracks),
        isLoading: false,
        loadingProgress: null,
      });
    } catch (e) {
      console.error('Failed to import folder:', e);
      set({ isLoading: false, loadingProgress: null });
    }
  },

  loadFromDB: async () => {
    try {
      const tracks = await getAllTracks();
      if (tracks.length > 0) {
        set({
          tracks,
          albums: deriveAlbums(tracks),
          artists: deriveArtists(tracks),
        });
      }
    } catch (e) {
      console.error('Failed to load from DB:', e);
    }
  },

  search: (query) => set({ searchQuery: query }),

  sort: (field) => {
    const { sortBy, sortAsc } = get();
    if (sortBy === field) {
      set({ sortAsc: !sortAsc });
    } else {
      set({ sortBy: field, sortAsc: true });
    }
  },

  setView: (view) => set({ view }),

  clearLibrary: async () => {
    await clearTracks();
    await clearCoverArt();
    set({ tracks: [], albums: [], artists: [] });
  },
}));
