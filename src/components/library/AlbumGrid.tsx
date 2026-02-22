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
              className="w-40 h-40 rounded-lg object-cover shadow-lg"
            />
          ) : (
            <div className="w-40 h-40 rounded-lg bg-surface-hover flex items-center justify-center">
              <span className="text-4xl text-secondary">💿</span>
            </div>
          )}
          <div>
            <h2 className="text-2xl font-bold text-primary">{selectedAlbum.name}</h2>
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
          className="group text-left rounded-lg p-3 hover:bg-surface-hover transition-all"
        >
          {album.coverArtUrl ? (
            <img
              src={album.coverArtUrl}
              alt=""
              className="w-full aspect-square rounded-lg object-cover shadow-md group-hover:shadow-lg transition-shadow"
              loading="lazy"
            />
          ) : (
            <div className="w-full aspect-square rounded-lg bg-surface flex items-center justify-center border border-app">
              <span className="text-4xl text-secondary opacity-50">💿</span>
            </div>
          )}
          <h3 className="mt-2 text-sm font-medium text-primary truncate">{album.name}</h3>
          <p className="text-xs text-secondary truncate">{album.artist}</p>
        </button>
      ))}
    </div>
  );
}
