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
            <span className="text-accent font-bold">♫</span>
          ) : (
            <span className="group-hover:hidden">{index + 1}</span>
          )}
          <button onClick={onPlay} className="hidden group-hover:inline text-accent">
            ▶
          </button>
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
              <span className="text-xs text-secondary">♫</span>
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
