import { useTranslation } from 'react-i18next';
import { formatTime } from '@/utils/formatTime';
import { usePlaylistStore } from '@/stores/playlistStore';
import { ContextMenu } from '@/components/common/ContextMenu';
import type { Track } from '@/types';

interface TrackRowProps {
  track: Track;
  index: number;
  isActive: boolean;
  onPlay: () => void;
}

export function TrackRow({ track, index, isActive, onPlay }: TrackRowProps) {
  const { t } = useTranslation();
  const playlists = usePlaylistStore((s) => s.playlists);
  const addToPlaylist = usePlaylistStore((s) => s.addToPlaylist);

  const contextItems = [
    ...playlists.map((pl) => ({
      label: `${t('playlist.addTo')}: ${pl.name}`,
      onClick: () => addToPlaylist(pl.id, [track.id]),
    })),
    ...(playlists.length > 0 ? [{ label: '', onClick: () => {}, divider: true }] : []),
    {
      label: t('playlist.playNext'),
      onClick: () => {
        // This could add to queue logic
      },
    },
  ];

  return (
    <ContextMenu items={contextItems}>
      <div
        className={`flex items-center px-4 py-2 text-sm cursor-pointer group transition-colors ${
          isActive ? 'bg-accent/10 text-accent' : 'hover:bg-surface-hover text-primary'
        }`}
        onDoubleClick={onPlay}
      >
        {/* Index / playing indicator */}
        <div className="w-10 shrink-0 text-secondary text-xs">
          {isActive ? (
            <svg className="w-3.5 h-3.5 text-accent" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55C7.79 13 6 14.79 6 17s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
            </svg>
          ) : (
            <>
              <span className="group-hover:hidden">{index + 1}</span>
              <button onClick={onPlay} className="hidden group-hover:inline text-accent">
                ▶
              </button>
            </>
          )}
        </div>

        {/* Title + cover */}
        <div className="flex-[3] flex items-center gap-2 min-w-0">
          {track.coverArtUrl ? (
            <img
              src={track.coverArtUrl}
              alt=""
              className="w-8 h-8 rounded object-cover shrink-0"
              loading="lazy"
            />
          ) : (
            <div className="w-8 h-8 rounded bg-surface-hover flex items-center justify-center shrink-0">
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
          <span className="truncate font-medium">{track.title}</span>
        </div>

        {/* Artist */}
        <div className="flex-[2] truncate text-secondary">{track.artist}</div>

        {/* Album */}
        <div className="flex-[2] truncate text-secondary">{track.album}</div>

        {/* Duration */}
        <div className="w-20 text-right text-secondary text-xs">{formatTime(track.duration)}</div>
      </div>
    </ContextMenu>
  );
}
