import { usePlayerStore } from '@/stores/playerStore';
import { PlaybackControls } from './PlaybackControls';
import { ProgressBar } from './ProgressBar';
import { VolumeSlider } from './VolumeSlider';
import { useEqualizerStore } from '@/stores/equalizerStore';
import { useTranslation } from 'react-i18next';

export function PlayerBar() {
  const { t } = useTranslation();
  const currentTrack = usePlayerStore((s) => s.currentTrack);
  const toggleEQ = useEqualizerStore((s) => s.toggleOpen);

  if (!currentTrack) {
    return (
      <div className="h-20 bg-player border-t border-app flex items-center justify-center transition-theme">
        <p className="text-sm text-secondary">{t('player.noTrack')}</p>
      </div>
    );
  }

  return (
    <div className="h-24 bg-player border-t border-app flex flex-col transition-theme">
      {/* Progress bar across full width */}
      <ProgressBar />

      <div className="flex items-center px-4 py-2 flex-1">
        {/* Left: Track info */}
        <div className="flex items-center gap-3 w-72 min-w-0">
          {currentTrack.coverArtUrl ? (
            <img
              src={currentTrack.coverArtUrl}
              alt=""
              className="w-12 h-12 rounded-lg object-cover shadow-md"
            />
          ) : (
            <div className="w-12 h-12 rounded-lg bg-surface-hover flex items-center justify-center">
              <span className="text-lg text-secondary">♫</span>
            </div>
          )}
          <div className="min-w-0">
            <p className="text-sm font-medium text-primary truncate">{currentTrack.title}</p>
            <p className="text-xs text-secondary truncate">{currentTrack.artist}</p>
          </div>
        </div>

        {/* Center: Playback controls */}
        <div className="flex-1 flex justify-center">
          <PlaybackControls />
        </div>

        {/* Right: Volume + EQ */}
        <div className="flex items-center gap-2 w-56 justify-end">
          <button
            onClick={toggleEQ}
            className="p-1.5 text-secondary hover:text-primary transition-colors rounded-lg hover:bg-surface-hover"
            title={t('eq.title')}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
              />
            </svg>
          </button>
          <VolumeSlider />
        </div>
      </div>
    </div>
  );
}
