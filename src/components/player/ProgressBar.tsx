import { useRef, useCallback } from 'react';
import { usePlayerStore } from '@/stores/playerStore';
import { formatTime } from '@/utils/formatTime';

export function ProgressBar() {
  const barRef = useRef<HTMLDivElement>(null);
  const currentTime = usePlayerStore((s) => s.currentTime);
  const duration = usePlayerStore((s) => s.duration);
  const seek = usePlayerStore((s) => s.seek);

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!barRef.current || duration <= 0) return;
      const rect = barRef.current.getBoundingClientRect();
      const ratio = (e.clientX - rect.left) / rect.width;
      seek(ratio * duration);
    },
    [duration, seek],
  );

  return (
    <div className="flex items-center gap-2 px-4 pt-1">
      <span className="text-[10px] text-secondary w-10 text-right tabular-nums">
        {formatTime(currentTime)}
      </span>
      <div
        ref={barRef}
        onClick={handleClick}
        className="flex-1 h-1 bg-[var(--color-border)] rounded-full cursor-pointer group relative"
      >
        <div
          className="h-full bg-accent rounded-full relative transition-[width] duration-100"
          style={{ width: `${progress}%` }}
        >
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-accent rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md" />
        </div>
      </div>
      <span className="text-[10px] text-secondary w-10 tabular-nums">{formatTime(duration)}</span>
    </div>
  );
}
