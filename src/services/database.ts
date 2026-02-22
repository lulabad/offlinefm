import { openDB, type IDBPDatabase } from 'idb';
import type { Track, Playlist, AppSettings } from '@/types';

const DB_NAME = 'offlinefm';
const DB_VERSION = 1;

interface OfflineFmDB {
  tracks: {
    key: string;
    value: Track;
    indexes: {
      'by-artist': string;
      'by-album': string;
      'by-title': string;
    };
  };
  playlists: {
    key: string;
    value: Playlist;
  };
  settings: {
    key: string;
    value: AppSettings;
  };
  coverArt: {
    key: string;
    value: { id: string; blob: Blob };
  };
}

let dbPromise: Promise<IDBPDatabase<OfflineFmDB>> | null = null;

function getDB(): Promise<IDBPDatabase<OfflineFmDB>> {
  if (!dbPromise) {
    dbPromise = openDB<OfflineFmDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        // Tracks store
        if (!db.objectStoreNames.contains('tracks')) {
          const trackStore = db.createObjectStore('tracks', { keyPath: 'id' });
          trackStore.createIndex('by-artist', 'artist');
          trackStore.createIndex('by-album', 'album');
          trackStore.createIndex('by-title', 'title');
        }

        // Playlists store
        if (!db.objectStoreNames.contains('playlists')) {
          db.createObjectStore('playlists', { keyPath: 'id' });
        }

        // Settings store
        if (!db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings');
        }

        // Cover art store
        if (!db.objectStoreNames.contains('coverArt')) {
          db.createObjectStore('coverArt', { keyPath: 'id' });
        }
      },
    });
  }
  return dbPromise;
}

// ── Tracks ───────────────────────────────────────────────────────────────────

export async function addTracks(tracks: Track[]): Promise<void> {
  const db = await getDB();
  const tx = db.transaction('tracks', 'readwrite');
  await Promise.all([...tracks.map((t) => tx.store.put(t)), tx.done]);
}

export async function getAllTracks(): Promise<Track[]> {
  const db = await getDB();
  return db.getAll('tracks');
}

export async function getTracksByAlbum(album: string): Promise<Track[]> {
  const db = await getDB();
  return db.getAllFromIndex('tracks', 'by-album', album);
}

export async function getTracksByArtist(artist: string): Promise<Track[]> {
  const db = await getDB();
  return db.getAllFromIndex('tracks', 'by-artist', artist);
}

export async function clearTracks(): Promise<void> {
  const db = await getDB();
  await db.clear('tracks');
}

// ── Cover Art ────────────────────────────────────────────────────────────────

export async function saveCoverArt(id: string, blob: Blob): Promise<void> {
  const db = await getDB();
  await db.put('coverArt', { id, blob });
}

export async function getCoverArt(id: string): Promise<Blob | undefined> {
  const db = await getDB();
  const entry = await db.get('coverArt', id);
  return entry?.blob;
}

export async function clearCoverArt(): Promise<void> {
  const db = await getDB();
  await db.clear('coverArt');
}

// ── Playlists ────────────────────────────────────────────────────────────────

export async function savePlaylists(playlists: Playlist[]): Promise<void> {
  const db = await getDB();
  const tx = db.transaction('playlists', 'readwrite');
  await tx.store.clear();
  await Promise.all([...playlists.map((p) => tx.store.put(p)), tx.done]);
}

export async function getAllPlaylists(): Promise<Playlist[]> {
  const db = await getDB();
  return db.getAll('playlists');
}

// ── Settings ─────────────────────────────────────────────────────────────────

const SETTINGS_KEY = 'app';

export async function saveSettings(settings: AppSettings): Promise<void> {
  const db = await getDB();
  await db.put('settings', settings, SETTINGS_KEY);
}

export async function getSettings(): Promise<AppSettings | undefined> {
  const db = await getDB();
  return db.get('settings', SETTINGS_KEY);
}
