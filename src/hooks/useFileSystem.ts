import { useEffect } from 'react';
import { openMusicFolder } from '@/services/fileSystemAccess';
import { useLibraryStore } from '@/stores/libraryStore';

/**
 * Hook for file system operations.
 */
export function useFileSystem() {
  const importFolder = useLibraryStore((s) => s.importFolder);
  const isLoading = useLibraryStore((s) => s.isLoading);
  const loadingProgress = useLibraryStore((s) => s.loadingProgress);
  const loadFromDB = useLibraryStore((s) => s.loadFromDB);

  useEffect(() => {
    // On mount, try to restore library from IndexedDB
    loadFromDB();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    openFolder: importFolder,
    isLoading,
    loadingProgress,
    openMusicFolder,
  };
}
