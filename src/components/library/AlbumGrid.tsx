import { useState } from 'react';
import { usePlayerStore } from '@/stores/playerStore';
import type { Album, Track } from '@/types';

interface AlbumGridProps {
  albums: Album[];
  tracks: Track[];
}

export function AlbumGrid({ albums, tracks }: AlbumGridProps) {
  const playTrack = usePlayerStore((s) => s.playTrack);
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);

  const handleAlbumPlay = (album: Album) => {
    const albumTracks = album.trackIds
      .map((id) => tracks.find((t) => t.id === id))
      .filter(Boolean) as Track[];
    if (albumTracks.length > 0) {
      playTrack(albumTracks[0], albumTracks, 0);
    }
  };

  if (selectedAlbum) {
    const albumTracks = selectedAlbum.trackIds
      .map((id) => tracks.find((t) => t.id === id))
      .filter(Boolean) as Track[];

    return (
      <div className="p-4">
        <button
          onClick={() => setSelectedAlbum(null)}
          className="text-accent hover:underline text-sm mb-4 flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back
        </button>

        <div className="flex items-end gap-4 mb-6">
          {selectedAlbum.coverArtUrl ? (
            <img
              src={selectedAlbum.coverArtUrl}
              alt=""
              className="w-40 h-40 rounded-xl object-cover shadow-elevated ring-1 ring-(--color-border)"
            />
          ) : (
            <div className="w-40 h-40 rounded-xl bg-surface-hover flex items-center justify-center">
              <svg
                className="w-12 h-12 text-secondary opacity-40"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <circle cx="12" cy="12" r="10" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </div>
          )}
          <div>
            <h2 className="text-2xl font-bold text-primary font-display">{selectedAlbum.name}</h2>
            <p className="text-secondary">{selectedAlbum.artist}</p>
            {selectedAlbum.year && <p className="text-secondary text-sm">{selectedAlbum.year}</p>}
            <p className="text-secondary text-sm">{albumTracks.length} tracks</p>
          </div>
        </div>

        <div className="space-y-1">
          {albumTracks.map((track, i) => (
            <button
              key={track.id}
              onClick={() => playTrack(track, albumTracks, i)}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-surface-hover transition-colors text-left"
            >
              <span className="text-secondary text-sm w-6 text-right">
                {track.trackNumber ?? i + 1}
              </span>
              <span className="text-primary flex-1 truncate">{track.title}</span>
              <span className="text-secondary text-xs">
                {Math.floor(track.duration / 60)}:
                {Math.floor(track.duration % 60)
                  .toString()
                  .padStart(2, '0')}
              </span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-4 p-4">
      {albums.map((album) => (
        <button
          key={`${album.name}|||${album.artist}`}
          onClick={() => setSelectedAlbum(album)}
          onDoubleClick={() => handleAlbumPlay(album)}
          className="group text-left rounded-xl p-3 hover:bg-surface-hover transition-all hover-lift"
        >
          {album.coverArtUrl ? (
            <img
              src={album.coverArtUrl}
              alt=""
              className="w-full aspect-square rounded-xl object-cover shadow-soft group-hover:shadow-elevated transition-shadow ring-1 ring-(--color-border)"
              loading="lazy"
            />
          ) : (
            <div className="w-full aspect-square rounded-xl bg-surface flex items-center justify-center border border-app">
              <svg
                className="w-10 h-10 text-secondary opacity-40"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <circle cx="12" cy="12" r="10" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </div>
          )}
          <h3 className="mt-2 text-sm font-medium text-primary truncate font-display">
            {album.name}
          </h3>
          <p className="text-xs text-secondary truncate">{album.artist}</p>
        </button>
      ))}
    </div>
  );
}
