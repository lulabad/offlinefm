import { useTranslation } from 'react-i18next';
import { usePlaylistStore } from '@/stores/playlistStore';
import { usePlayerStore } from '@/stores/playerStore';
import { formatTime } from '@/utils/formatTime';
import type { Playlist, Track } from '@/types';

interface PlaylistTrackListProps {
  playlist: Playlist;
  tracks: Track[];
}

export function PlaylistTrackList({ playlist, tracks }: PlaylistTrackListProps) {
  const { t } = useTranslation();
  const playTrack = usePlayerStore((s) => s.playTrack);
  const currentTrackId = usePlayerStore((s) => s.currentTrack?.id);
  const removeFromPlaylist = usePlaylistStore((s) => s.removeFromPlaylist);
  const deletePlaylist = usePlaylistStore((s) => s.deletePlaylist);
  const setActivePlaylist = usePlaylistStore((s) => s.setActivePlaylist);
  const renamePlaylist = usePlaylistStore((s) => s.renamePlaylist);

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold text-primary font-display">{playlist.name}</h2>
          <p className="text-sm text-secondary">{tracks.length} tracks</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              const name = prompt(t('playlist.name'), playlist.name);
              if (name) renamePlaylist(playlist.id, name);
            }}
            className="p-2 text-secondary hover:text-accent rounded-lg hover:bg-surface-hover transition-colors"
            title={t('playlist.rename')}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </button>
          <button
            onClick={() => {
              if (confirm(t('playlist.confirmDelete', { name: playlist.name }))) {
                deletePlaylist(playlist.id);
                setActivePlaylist(null);
              }
            }}
            className="p-2 text-danger hover:bg-red-50 dark:hover:bg-red-950 rounded-lg transition-colors"
            title={t('playlist.delete')}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </div>

      {tracks.length === 0 ? (
        <p className="text-secondary text-sm py-8 text-center">{t('playlist.empty')}</p>
      ) : (
        <div className="space-y-1">
          {tracks.map((track, i) => (
            <div
              key={`${track.id}-${i}`}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg group transition-colors cursor-pointer ${
                track.id === currentTrackId ? 'bg-accent/10 text-accent' : 'hover:bg-surface-hover'
              }`}
              onDoubleClick={() => playTrack(track, tracks, i)}
            >
              <span className="text-secondary text-xs w-6 text-right">{i + 1}</span>
              {track.coverArtUrl ? (
                <img
                  src={track.coverArtUrl}
                  alt=""
                  className="w-8 h-8 rounded object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="w-8 h-8 rounded bg-surface-hover flex items-center justify-center">
                  <svg
                    className="w-3.5 h-3.5 text-secondary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z"
                    />
                  </svg>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-primary truncate">{track.title}</p>
                <p className="text-xs text-secondary truncate">{track.artist}</p>
              </div>
              <span className="text-xs text-secondary">{formatTime(track.duration)}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeFromPlaylist(playlist.id, track.id);
                }}
                className="opacity-0 group-hover:opacity-100 p-1 text-secondary hover:text-danger transition-all"
                title={t('playlist.removeFrom')}
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
