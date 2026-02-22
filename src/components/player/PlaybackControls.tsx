import { usePlayerStore } from '@/stores/playerStore';
import { useTranslation } from 'react-i18next';

export function PlaybackControls() {
  const { t } = useTranslation();
  const {
    isPlaying,
    togglePlay,
    next,
    previous,
    shuffleMode,
    toggleShuffle,
    repeatMode,
    cycleRepeat,
  } = usePlayerStore();

  return (
    <div className="flex items-center gap-3">
      {/* Shuffle */}
      <button
        onClick={toggleShuffle}
        className={`p-1.5 rounded-lg transition-colors ${
          shuffleMode ? 'text-accent' : 'text-secondary hover:text-primary'
        }`}
        title={t('player.shuffle')}
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 4h4l3 6-3 6H4m16-12h-4l-3 6 3 6h4M4 20l16-16M4 4l16 16"
          />
        </svg>
      </button>

      {/* Previous */}
      <button
        onClick={previous}
        className="p-2 text-secondary hover:text-primary transition-colors"
        title={t('player.previous')}
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
        </svg>
      </button>

      {/* Play/Pause */}
      <button
        onClick={togglePlay}
        className="p-3 bg-accent text-on-accent rounded-full hover:bg-accent-hover transition-all shadow-lg hover:shadow-xl hover:scale-105"
        title={isPlaying ? t('player.pause') : t('player.play')}
      >
        {isPlaying ? (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        )}
      </button>

      {/* Next */}
      <button
        onClick={next}
        className="p-2 text-secondary hover:text-primary transition-colors"
        title={t('player.next')}
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
        </svg>
      </button>

      {/* Repeat */}
      <button
        onClick={cycleRepeat}
        className={`p-1.5 rounded-lg transition-colors relative ${
          repeatMode !== 'off' ? 'text-accent' : 'text-secondary hover:text-primary'
        }`}
        title={
          repeatMode === 'off'
            ? t('player.repeatOff')
            : repeatMode === 'one'
              ? t('player.repeatOne')
              : t('player.repeatAll')
        }
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
        {repeatMode === 'one' && (
          <span className="absolute -top-0.5 -right-0.5 text-[8px] font-bold text-accent">1</span>
        )}
      </button>
    </div>
  );
}
