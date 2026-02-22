import type { AudioFileEntry } from '@/types';

const AUDIO_EXTENSIONS = new Set([
  '.mp3',
  '.flac',
  '.ogg',
  '.wav',
  '.m4a',
  '.aac',
  '.opus',
  '.wma',
  '.webm',
]);

function isAudioFile(name: string): boolean {
  const ext = name.slice(name.lastIndexOf('.')).toLowerCase();
  return AUDIO_EXTENSIONS.has(ext);
}

// ── File System Access API (Chromium) ────────────────────────────────────────

async function traverseDirectory(
  dirHandle: FileSystemDirectoryHandle,
  path: string,
  results: AudioFileEntry[],
): Promise<void> {
  for await (const entry of dirHandle.values()) {
    const entryPath = path ? `${path}/${entry.name}` : entry.name;
    if (entry.kind === 'file' && isAudioFile(entry.name)) {
      const fileHandle = entry as FileSystemFileHandle;
      const file = await fileHandle.getFile();
      results.push({ file, handle: fileHandle, relativePath: entryPath });
    } else if (entry.kind === 'directory') {
      await traverseDirectory(entry as FileSystemDirectoryHandle, entryPath, results);
    }
  }
}

export function supportsFileSystemAccess(): boolean {
  return 'showDirectoryPicker' in window;
}

export async function openMusicFolderNative(): Promise<AudioFileEntry[]> {
  const dirHandle = await window.showDirectoryPicker({ mode: 'read' });
  const results: AudioFileEntry[] = [];
  await traverseDirectory(dirHandle, '', results);

  // Store handle for re-access
  try {
    localStorage.setItem('offlinefm_dirHandleName', dirHandle.name);
  } catch {
    // ignore
  }

  return results;
}

// ── Fallback: <input webkitdirectory> ────────────────────────────────────────

export function openMusicFolderFallback(): Promise<AudioFileEntry[]> {
  return new Promise((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.setAttribute('webkitdirectory', '');
    input.setAttribute('multiple', '');
    input.accept = 'audio/*';

    input.onchange = () => {
      const files = Array.from(input.files ?? []);
      const audioFiles: AudioFileEntry[] = files
        .filter((f) => isAudioFile(f.name))
        .map((f) => ({
          file: f,
          relativePath: (f as File & { webkitRelativePath?: string }).webkitRelativePath || f.name,
        }));
      resolve(audioFiles);
    };

    input.oncancel = () => resolve([]);
    input.click();
  });
}

// ── Unified API ──────────────────────────────────────────────────────────────

export async function openMusicFolder(): Promise<AudioFileEntry[]> {
  if (supportsFileSystemAccess()) {
    return openMusicFolderNative();
  }
  return openMusicFolderFallback();
}
