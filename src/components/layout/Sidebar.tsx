import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLibraryStore } from '@/stores/libraryStore';
import { usePlaylistStore } from '@/stores/playlistStore';
import { Button } from '@/components/common/Button';

export function Sidebar() {
  const { t } = useTranslation();
  const importFolder = useLibraryStore((s) => s.importFolder);
  const isLoading = useLibraryStore((s) => s.isLoading);
  const loadingProgress = useLibraryStore((s) => s.loadingProgress);
  const trackCount = useLibraryStore((s) => s.tracks.length);
  const view = useLibraryStore((s) => s.view);
  const setView = useLibraryStore((s) => s.setView);

  const playlists = usePlaylistStore((s) => s.playlists);
  const activePlaylistId = usePlaylistStore((s) => s.activePlaylistId);
  const setActivePlaylist = usePlaylistStore((s) => s.setActivePlaylist);
  const createPlaylist = usePlaylistStore((s) => s.createPlaylist);

  const [isCreating, setIsCreating] = useState(false);
  const [newName, setNewName] = useState('');

  const navItems = [
    {
      key: 'tracks' as const,
      label: t('nav.library'),
      icon: (
        <svg
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z"
          />
        </svg>
      ),
    },
    {
      key: 'albums' as const,
      label: t('nav.albums'),
      icon: (
        <svg
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <circle cx="12" cy="12" r="10" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      ),
    },
    {
      key: 'artists' as const,
      label: t('nav.artists'),
      icon: (
        <svg
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      ),
    },
  ];

  const handleCreate = () => {
    if (newName.trim()) {
      createPlaylist(newName.trim());
      setNewName('');
      setIsCreating(false);
    }
  };

  return (
    <aside className="w-56 bg-sidebar border-r border-app flex flex-col h-full transition-theme shadow-soft">
      {/* Logo */}
      <div className="px-4 py-5 border-b border-app">
        <h1 className="font-display text-lg font-bold text-accent tracking-tight flex items-center gap-2">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55C7.79 13 6 14.79 6 17s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
          </svg>
          Offline.fm
        </h1>
      </div>

      {/* Open Folder */}
      <div className="px-3 py-3">
        <Button
          variant="primary"
          size="md"
          className="w-full"
          onClick={importFolder}
          disabled={isLoading}
        >
          {isLoading ? (
            loadingProgress ? (
              t('library.parsing', { done: loadingProgress.done, total: loadingProgress.total })
            ) : (
              t('library.scanning')
            )
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                />
              </svg>
              {t('library.openFolder')}
            </>
          )}
        </Button>
        {trackCount > 0 && (
          <p className="text-xs text-secondary mt-1.5 text-center">
            {trackCount} {t('library.tracks').toLowerCase()}
          </p>
        )}
      </div>

      {/* Navigation */}
      <nav className="px-2 py-1">
        {navItems.map((item) => (
          <button
            key={item.key}
            onClick={() => {
              setView(item.key);
              setActivePlaylist(null);
            }}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all ${
              view === item.key && !activePlaylistId
                ? 'bg-accent/10 text-accent font-medium sidebar-nav-active'
                : 'text-secondary hover:text-primary hover:bg-surface-hover'
            }`}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </nav>

      {/* Playlists */}
      <div className="flex-1 flex flex-col min-h-0 mt-2">
        <div className="flex items-center justify-between px-4 py-2">
          <span className="text-xs font-semibold text-secondary uppercase tracking-wider">
            {t('nav.playlists')}
          </span>
          <button
            onClick={() => setIsCreating(true)}
            className="text-secondary hover:text-accent transition-colors"
            title={t('playlist.create')}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
          </button>
        </div>

        {isCreating && (
          <div className="px-3 pb-2">
            <input
              autoFocus
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleCreate();
                if (e.key === 'Escape') setIsCreating(false);
              }}
              onBlur={() => {
                if (newName.trim()) handleCreate();
                else setIsCreating(false);
              }}
              placeholder={t('playlist.name')}
              className="w-full px-2 py-1 text-sm bg-surface border border-app rounded 
                         text-primary placeholder:text-secondary focus:outline-none 
                         focus:ring-1 focus:ring-(--color-accent)"
            />
          </div>
        )}

        <div className="flex-1 overflow-y-auto px-2">
          {playlists.map((pl) => (
            <button
              key={pl.id}
              onClick={() => setActivePlaylist(pl.id)}
              className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-all ${
                activePlaylistId === pl.id
                  ? 'bg-accent/10 text-accent font-medium sidebar-nav-active'
                  : 'text-secondary hover:text-primary hover:bg-surface-hover'
              }`}
            >
              <svg
                className="w-3.5 h-3.5 shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                />
              </svg>
              <span className="truncate">{pl.name}</span>
              <span className="text-xs text-secondary ml-auto">{pl.trackIds.length}</span>
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}
