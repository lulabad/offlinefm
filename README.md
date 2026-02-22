# Offline.fm — Browser-Based Local Music Player

A fully offline, client-side music player built with **React 19 + TypeScript + Vite + Tailwind CSS 4**. Open a local music folder, browse by tracks/albums/artists, play with waveform visualization, adjust a 10-band equalizer, manage playlists, and install as a PWA.

## Features

- **Local file playback** — Open any folder with audio files (.mp3, .flac, .ogg, .wav, .m4a, .aac, .opus, .wma)
- **Metadata parsing** — Automatic ID3/Vorbis/FLAC/MP4 tag reading with cover art extraction
- **Library views** — Browse by tracks (virtualized list), albums (grid), or artists
- **Waveform visualization** — Interactive wavesurfer.js waveform with click-to-seek
- **10-band equalizer** — With built-in presets (Rock, Pop, Jazz, Classical, Bass/Treble Boost)
- **Playlist management** — Create, rename, delete, add/remove/reorder tracks
- **Shuffle & repeat** — Off/all/one repeat modes, toggle shuffle
- **Keyboard shortcuts** — Full keyboard control (see below)
- **Media Session API** — OS-level media controls (play/pause/next/prev)
- **Persistence** — Library stored in IndexedDB, settings in localStorage
- **Light/Dark theme** — With system preference detection
- **i18n** — English & German, extensible
- **PWA** — Installable, offline-capable after first load

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) and click "Open Folder" to load your music.

## Scripts

| Command           | Description              |
| ----------------- | ------------------------ |
| `npm run dev`     | Start dev server (HMR)   |
| `npm run build`   | Production build         |
| `npm run preview` | Preview production build |
| `npm run test`    | Run tests (Vitest)       |
| `npm run lint`    | Lint with ESLint         |

## Keyboard Shortcuts

| Key                   | Action                   |
| --------------------- | ------------------------ |
| `Space`               | Play / Pause             |
| `→` / `←`             | Seek forward/backward 5s |
| `Shift+→` / `Shift+←` | Next / Previous track    |
| `↑` / `↓`             | Volume up / down         |
| `M`                   | Mute / Unmute            |
| `S`                   | Toggle shuffle           |
| `R`                   | Cycle repeat mode        |
| `Ctrl+F`              | Focus search bar         |
| `Ctrl+O`              | Open folder              |
| `?`                   | Show shortcuts overlay   |

## Tech Stack

- **React 19** + **Vite 6** — Fast dev/build
- **TypeScript 5.7+** — Strict mode
- **Tailwind CSS 4** — Utility-first styling with CSS custom properties
- **Zustand 5** — Lightweight state management
- **music-metadata-browser** — Audio metadata parsing
- **wavesurfer.js v7** — Waveform rendering
- **Web Audio API** — Equalizer (BiquadFilterNode chain)
- **IndexedDB** via `idb` — Persistent library storage
- **File System Access API** — Native folder picker (fallback for Firefox/Safari)
- **i18next** — Internationalization
- **vite-plugin-pwa** — PWA with Workbox service worker
- **@tanstack/react-virtual** — Virtualized track list

## Project Structure

```
src/
├── components/
│   ├── layout/      — AppShell, Sidebar, Header, ThemeToggle
│   ├── library/     — LibraryView, TrackList, AlbumGrid, ArtistList, TrackRow
│   ├── player/      — PlayerBar, PlaybackControls, VolumeSlider, ProgressBar
│   ├── waveform/    — WaveformDisplay (wavesurfer.js wrapper)
│   ├── equalizer/   — EqualizerPanel, FrequencyBand
│   ├── playlist/    — PlaylistTrackList
│   └── common/      — Button, Modal, ContextMenu, SearchInput, EmptyState
├── hooks/           — useAudioEngine, useEqualizer, useFileSystem, useKeyboardShortcuts, useMediaSession, useTheme
├── stores/          — playerStore, libraryStore, playlistStore, equalizerStore, settingsStore
├── services/        — audioEngine, metadataParser, database, fileSystemAccess
├── i18n/            — i18next config, en.json, de.json
├── types/           — TypeScript interfaces
└── utils/           — formatTime, shuffle
```

## License

MIT
