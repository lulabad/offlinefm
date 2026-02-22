import { useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useTranslation } from 'react-i18next';
import { useLibraryStore } from '@/stores/libraryStore';
import { usePlayerStore } from '@/stores/playerStore';
import { TrackRow } from './TrackRow';
import type { Track, SortField } from '@/types';

interface TrackListProps {
  tracks: Track[];
  onPlayTrack: (track: Track, index: number) => void;
}

export function TrackList({ tracks, onPlayTrack }: TrackListProps) {
  const { t } = useTranslation();
  const parentRef = useRef<HTMLDivElement>(null);
  const currentTrackId = usePlayerStore((s) => s.currentTrack?.id);
  const sort = useLibraryStore((s) => s.sort);
  const sortBy = useLibraryStore((s) => s.sortBy);
  const sortAsc = useLibraryStore((s) => s.sortAsc);

  const virtualizer = useVirtualizer({
    count: tracks.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 48,
    overscan: 20,
  });

  const columns: { key: SortField; label: string; width: string }[] = [
    { key: 'title', label: t('library.title'), width: 'flex-[3]' },
    { key: 'artist', label: t('library.artist'), width: 'flex-[2]' },
    { key: 'album', label: t('library.album'), width: 'flex-[2]' },
    { key: 'duration', label: t('library.duration'), width: 'w-20' },
  ];

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortBy !== field) return null;
    return (
      <svg className="w-3 h-3 ml-1 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d={sortAsc ? 'M5 15l7-7 7 7' : 'M19 9l-7 7-7-7'}
        />
      </svg>
    );
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header row */}
      <div className="flex items-center px-4 py-2 border-b border-app text-xs font-medium text-secondary uppercase tracking-wider">
        <div className="w-10 shrink-0">#</div>
        {columns.map((col) => (
          <button
            key={col.key}
            onClick={() => sort(col.key)}
            className={`${col.width} text-left hover:text-primary transition-colors cursor-pointer`}
          >
            {col.label}
            <SortIcon field={col.key} />
          </button>
        ))}
      </div>

      {/* Virtualized list */}
      <div ref={parentRef} className="flex-1 overflow-auto">
        <div
          style={{ height: `${virtualizer.getTotalSize()}px`, position: 'relative', width: '100%' }}
        >
          {virtualizer.getVirtualItems().map((virtualItem) => {
            const track = tracks[virtualItem.index];
            return (
              <div
                key={virtualItem.key}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: `${virtualItem.size}px`,
                  transform: `translateY(${virtualItem.start}px)`,
                }}
              >
                <TrackRow
                  track={track}
                  index={virtualItem.index}
                  isActive={track.id === currentTrackId}
                  onPlay={() => onPlayTrack(track, virtualItem.index)}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
