import * as mm from 'music-metadata-browser';
import type { Track, AudioFileEntry } from '@/types';

/**
 * Generate a deterministic ID from file path.
 */
function generateId(relativePath: string): string {
  let hash = 0;
  for (let i = 0; i < relativePath.length; i++) {
    const char = relativePath.charCodeAt(i);
    hash = ((hash << 5) - hash + char) | 0;
  }
  return `track_${Math.abs(hash).toString(36)}_${relativePath.length}`;
}

/**
 * Parse a single audio file and return a Track object.
 */
export async function parseAudioFile(entry: AudioFileEntry): Promise<Track> {
  const { file, handle, relativePath } = entry;

  let metadata: mm.IAudioMetadata;
  try {
    metadata = await mm.parseBlob(file);
  } catch {
    // If parsing fails, return minimal track info
    return {
      id: generateId(relativePath),
      title: file.name.replace(/\.[^.]+$/, ''),
      artist: 'Unknown Artist',
      album: 'Unknown Album',
      duration: 0,
      relativePath,
      file,
      fileHandle: handle,
    };
  }

  const { common, format } = metadata;

  // Extract cover art
  let coverArtUrl: string | undefined;
  if (common.picture && common.picture.length > 0) {
    const pic = common.picture[0];
    const blob = new Blob([pic.data], { type: pic.format });
    coverArtUrl = URL.createObjectURL(blob);
  }

  return {
    id: generateId(relativePath),
    title: common.title || file.name.replace(/\.[^.]+$/, ''),
    artist: common.artist || 'Unknown Artist',
    album: common.album || 'Unknown Album',
    duration: format.duration || 0,
    year: common.year,
    genre: common.genre?.[0],
    trackNumber: common.track?.no ?? undefined,
    coverArtUrl,
    fileHandle: handle,
    file,
    relativePath,
  };
}

/**
 * Batch-parse all audio files with a progress callback.
 */
export async function parseAudioFiles(
  entries: AudioFileEntry[],
  onProgress?: (done: number, total: number) => void,
): Promise<Track[]> {
  const tracks: Track[] = [];
  const total = entries.length;
  const BATCH_SIZE = 5; // parse in small batches to avoid overwhelming

  for (let i = 0; i < total; i += BATCH_SIZE) {
    const batch = entries.slice(i, i + BATCH_SIZE);
    const batchResults = await Promise.all(batch.map((e) => parseAudioFile(e)));
    tracks.push(...batchResults);
    onProgress?.(Math.min(i + BATCH_SIZE, total), total);
  }

  return tracks;
}
