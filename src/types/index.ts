// ── Track ────────────────────────────────────────────────────────────────────
export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number; // seconds
  year?: number;
  genre?: string;
  trackNumber?: number;
  coverArtUrl?: string; // Blob URL
  fileHandle?: FileSystemFileHandle;
  file?: File;
  relativePath: string;
}

// ── Album ────────────────────────────────────────────────────────────────────
export interface Album {
  name: string;
  artist: string;
  coverArtUrl?: string;
  trackIds: string[];
  year?: number;
}

// ── Artist ───────────────────────────────────────────────────────────────────
export interface Artist {
  name: string;
  albumNames: string[];
  trackIds: string[];
}

// ── Playlist ─────────────────────────────────────────────────────────────────
export interface Playlist {
  id: string;
  name: string;
  trackIds: string[];
  createdAt: number;
  updatedAt: number;
}

// ── Equalizer ────────────────────────────────────────────────────────────────
export interface EQBand {
  frequency: number;
  gain: number;
}

export interface EQPreset {
  name: string;
  bands: EQBand[];
}

// ── Settings ─────────────────────────────────────────────────────────────────
export type ThemeMode = 'light' | 'dark' | 'system';
export type RepeatMode = 'off' | 'one' | 'all';
export type LibraryView = 'tracks' | 'albums' | 'artists';
export type SortField = 'title' | 'artist' | 'album' | 'duration' | 'year';

export interface AppSettings {
  theme: ThemeMode;
  language: string;
  volume: number;
  lastTrackId?: string;
  lastPosition?: number;
  equalizerPreset?: string;
}

// ── File System ──────────────────────────────────────────────────────────────
export interface AudioFileEntry {
  file: File;
  handle?: FileSystemFileHandle;
  relativePath: string;
}
