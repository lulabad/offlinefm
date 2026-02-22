import { useState } from 'react';
import { usePlayerStore } from '@/stores/playerStore';
import type { Artist, Track } from '@/types';

interface ArtistListProps {
  artists: Artist[];
  tracks: Track[];
}

export function ArtistList({ artists, tracks }: ArtistListProps) {
  const playTrack = usePlayerStore((s) => s.playTrack);
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);

  if (selectedArtist) {
    const artistTracks = selectedArtist.trackIds
      .map((id) => tracks.find((t) => t.id === id))
      .filter(Boolean) as Track[];

    return (
      <div className="p-4">
        <button
          onClick={() => setSelectedArtist(null)}
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

        <h2 className="text-2xl font-bold text-primary mb-1 font-display">{selectedArtist.name}</h2>
        <p className="text-secondary text-sm mb-4">
          {selectedArtist.albumNames.length} albums · {artistTracks.length} tracks
        </p>

        <div className="space-y-1">
          {artistTracks.map((track, i) => (
            <button
              key={track.id}
              onClick={() => playTrack(track, artistTracks, i)}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-surface-hover transition-colors text-left"
            >
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
                <span className="text-primary text-sm truncate block">{track.title}</span>
                <span className="text-secondary text-xs truncate block">{track.album}</span>
              </div>
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
    <div className="p-4 space-y-1">
      {artists.map((artist) => (
        <button
          key={artist.name}
          onClick={() => setSelectedArtist(artist)}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-surface-hover transition-colors text-left"
        >
          <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
            <span className="text-accent font-semibold text-sm">
              {artist.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-primary font-medium truncate block">{artist.name}</span>
            <span className="text-secondary text-xs">
              {artist.albumNames.length} albums · {artist.trackIds.length} tracks
            </span>
          </div>
        </button>
      ))}
    </div>
  );
}
