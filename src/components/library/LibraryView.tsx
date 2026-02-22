import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useLibraryStore } from '@/stores/libraryStore';
import { usePlayerStore } from '@/stores/playerStore';
import { usePlaylistStore } from '@/stores/playlistStore';
import { TrackList } from './TrackList';
import { AlbumGrid } from './AlbumGrid';
import { ArtistList } from './ArtistList';
import { PlaylistTrackList } from '@/components/playlist/PlaylistTrackList';
import { EmptyState } from '@/components/common/EmptyState';
import { Button } from '@/components/common/Button';
import type { Track } from '@/types';

export function LibraryView() {
  const { t } = useTranslation();
  const tracks = useLibraryStore((s) => s.tracks);
  const albums = useLibraryStore((s) => s.albums);
  const artists = useLibraryStore((s) => s.artists);
  const view = useLibraryStore((s) => s.view);
  const searchQuery = useLibraryStore((s) => s.searchQuery);
  const sortBy = useLibraryStore((s) => s.sortBy);
  const sortAsc = useLibraryStore((s) => s.sortAsc);
  const importFolder = useLibraryStore((s) => s.importFolder);
  const isLoading = useLibraryStore((s) => s.isLoading);

  const activePlaylistId = usePlaylistStore((s) => s.activePlaylistId);
  const playlists = usePlaylistStore((s) => s.playlists);

  const playTrack = usePlayerStore((s) => s.playTrack);

  // Filtered and sorted tracks
  const filteredTracks = useMemo(() => {
    let result = [...tracks];

    // Search filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.artist.toLowerCase().includes(q) ||
          t.album.toLowerCase().includes(q) ||
          (t.genre && t.genre.toLowerCase().includes(q)),
      );
    }

    // Sort
    result.sort((a, b) => {
      let cmp = 0;
      switch (sortBy) {
        case 'title':
          cmp = a.title.localeCompare(b.title);
          break;
        case 'artist':
          cmp = a.artist.localeCompare(b.artist);
          break;
        case 'album':
          cmp = a.album.localeCompare(b.album);
          break;
        case 'duration':
          cmp = a.duration - b.duration;
          break;
        case 'year':
          cmp = (a.year ?? 0) - (b.year ?? 0);
          break;
      }
      return sortAsc ? cmp : -cmp;
    });

    return result;
  }, [tracks, searchQuery, sortBy, sortAsc]);

  // If a playlist is active, show that
  if (activePlaylistId) {
    const playlist = playlists.find((p) => p.id === activePlaylistId);
    if (playlist) {
      const playlistTracks = playlist.trackIds
        .map((id) => tracks.find((t) => t.id === id))
        .filter(Boolean) as Track[];
      return <PlaylistTrackList playlist={playlist} tracks={playlistTracks} />;
    }
  }

  // Empty state
  if (tracks.length === 0 && !isLoading) {
    return (
      <EmptyState
        icon={
          <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
            />
          </svg>
        }
        title={t('library.empty')}
        action={
          <Button variant="primary" onClick={importFolder}>
            {t('library.openFolder')}
          </Button>
        }
      />
    );
  }

  const handlePlayTrack = (track: Track, index: number) => {
    playTrack(track, filteredTracks, index);
  };

  switch (view) {
    case 'albums':
      return <AlbumGrid albums={albums} tracks={tracks} />;
    case 'artists':
      return <ArtistList artists={artists} tracks={tracks} />;
    default:
      return <TrackList tracks={filteredTracks} onPlayTrack={handlePlayTrack} />;
  }
}
