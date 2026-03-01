import { useCallback, useRef } from 'react';
import { usePlayerStore } from '@/stores/playerStore';
import { useTranslation } from 'react-i18next';

export function VolumeSlider() {
  const { t } = useTranslation();
  const { volume, muted, setVolume, toggleMute } = usePlayerStore();
  const trackRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);

  const displayVolume = muted ? 0 : volume;

  const updateVolumeFromEvent = useCallback(
    (clientX: number) => {
      const track = trackRef.current;
      if (!track) return;
      const rect = track.getBoundingClientRect();
      const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      setVolume(ratio);
    },
    [setVolume],
  );

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault();
      draggingRef.current = true;
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
      updateVolumeFromEvent(e.clientX);
    },
    [updateVolumeFromEvent],
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!draggingRef.current) return;
      updateVolumeFromEvent(e.clientX);
    },
    [updateVolumeFromEvent],
  );

  const onPointerUp = useCallback(() => {
    draggingRef.current = false;
  }, []);

  const VolumeIcon = () => {
    if (muted || volume === 0) {
      return (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"
          />
        </svg>
      );
    }
    if (volume < 0.5) {
      return (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15.536 8.464a5 5 0 010 7.072M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
          />
        </svg>
      );
    }
    return (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
        />
      </svg>
    );
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={toggleMute}
        className="p-1 text-secondary hover:text-accent transition-colors"
        title={muted ? t('player.unmute') : t('player.mute')}
      >
        <VolumeIcon />
      </button>

      {/* Custom slider track */}
      <div
        ref={trackRef}
        role="slider"
        aria-label={t('player.volume')}
        aria-valuenow={Math.round(displayVolume * 100)}
        aria-valuemin={0}
        aria-valuemax={100}
        tabIndex={0}
        className="relative w-24 h-4 flex items-center cursor-pointer group"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onKeyDown={(e) => {
          if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
            e.preventDefault();
            setVolume(Math.min(1, volume + 0.05));
          } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
            e.preventDefault();
            setVolume(Math.max(0, volume - 0.05));
          }
        }}
      >
        {/* Background track */}
        <div className="absolute inset-x-0 h-1 rounded-full bg-[var(--color-border)]" />

        {/* Filled portion */}
        <div
          className="absolute left-0 h-1 rounded-full bg-[var(--color-accent)]"
          style={{ width: `${displayVolume * 100}%` }}
        />

        {/* Thumb */}
        <div
          className="absolute w-3.5 h-3.5 rounded-full bg-[var(--color-accent)] shadow-[0_1px_4px_rgba(200,117,51,0.2)] transition-transform duration-150 group-hover:scale-[1.2] group-hover:shadow-[var(--shadow-glow)] -translate-x-1/2"
          style={{ left: `${displayVolume * 100}%` }}
        />
      </div>
    </div>
  );
}
