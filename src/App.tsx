import { lazy, Suspense, useEffect } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { LibraryView } from '@/components/library/LibraryView';
import { PlayerBar } from '@/components/player/PlayerBar';
import { ShortcutsOverlay } from '@/components/common/ShortcutsOverlay';
import { useAudioEngine } from '@/hooks/useAudioEngine';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { useMediaSession } from '@/hooks/useMediaSession';
import { useTheme } from '@/hooks/useTheme';
import { useFileSystem } from '@/hooks/useFileSystem';
import { usePlaylistStore } from '@/stores/playlistStore';
import { useSettingsStore } from '@/stores/settingsStore';

// Lazy-loaded components
const EqualizerPanel = lazy(() =>
  import('@/components/equalizer/EqualizerPanel').then((m) => ({ default: m.EqualizerPanel })),
);
const WaveformDisplay = lazy(() =>
  import('@/components/waveform/WaveformDisplay').then((m) => ({ default: m.WaveformDisplay })),
);

export default function App() {
  // Initialize hooks
  useTheme();
  useAudioEngine();
  useKeyboardShortcuts();
  useMediaSession();
  useFileSystem();

  const loadPlaylists = usePlaylistStore((s) => s.loadPlaylists);
  const loadSettings = useSettingsStore((s) => s.loadSettings);

  useEffect(() => {
    loadPlaylists();
    loadSettings();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <AppShell
      playerBar={
        <div className="relative">
          <Suspense fallback={null}>
            <EqualizerPanel />
          </Suspense>
          <PlayerBar />
        </div>
      }
    >
      <Suspense fallback={null}>
        <WaveformDisplay />
      </Suspense>
      <LibraryView />
      <ShortcutsOverlay />
    </AppShell>
  );
}
