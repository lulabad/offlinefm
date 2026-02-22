import { useEffect, useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';
import { usePlayerStore } from '@/stores/playerStore';

export function WaveformDisplay() {
  const containerRef = useRef<HTMLDivElement>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);
  const currentTrack = usePlayerStore((s) => s.currentTrack);
  const seek = usePlayerStore((s) => s.seek);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!containerRef.current || !currentTrack) return;

    // Cleanup previous instance
    if (wavesurferRef.current) {
      wavesurferRef.current.destroy();
    }

    // WaveSurfer uses its own internal <audio> element – completely separate
    // from the audioEngine. It is only used for waveform analysis/visualization,
    // never for audible playback (we never call ws.play()).
    const ws = WaveSurfer.create({
      container: containerRef.current,
      waveColor: 'rgba(200, 117, 51, 0.25)',
      progressColor: 'rgba(200, 117, 51, 0.7)',
      cursorColor: 'rgba(200, 117, 51, 1)',
      cursorWidth: 2,
      barWidth: 2,
      barGap: 1,
      barRadius: 2,
      height: 80,
      normalize: true,
      interact: true,
    });

    ws.on('ready', () => {
      // Mute WaveSurfer's internal audio so it never produces sound.
      const mediaEl = ws.getMediaElement();
      if (mediaEl) {
        mediaEl.muted = true;
        mediaEl.volume = 0;
      }
      setIsReady(true);
    });

    ws.on('click', (relativeX) => {
      const duration = ws.getDuration();
      if (duration > 0) {
        seek(relativeX * duration);
      }
    });

    // Load the track for waveform decoding only.
    const loadTrack = async () => {
      const file =
        currentTrack.file ??
        (currentTrack.fileHandle ? await currentTrack.fileHandle.getFile() : null);
      if (file) {
        const url = URL.createObjectURL(file);
        ws.load(url);
      }
    };

    loadTrack();
    wavesurferRef.current = ws;

    return () => {
      ws.destroy();
      wavesurferRef.current = null;
      setIsReady(false);
    };
  }, [currentTrack?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  // Keep the waveform progress indicator in sync with the actual audioEngine
  // playback position. We use Zustand's static subscribe (not a React selector)
  // to avoid re-rendering the component on every animation frame.
  useEffect(() => {
    if (!isReady) return;

    let lastTime = -1;
    const unsubscribe = usePlayerStore.subscribe((state) => {
      const t = state.currentTime;
      if (t === lastTime) return;
      lastTime = t;

      const ws = wavesurferRef.current;
      if (!ws) return;
      // setTime() moves the visual progress cursor without triggering play.
      ws.setTime(t);
    });

    // Sync immediately on mount so position is correct if the track is
    // already partway through.
    const ws = wavesurferRef.current;
    if (ws) ws.setTime(usePlayerStore.getState().currentTime);

    return unsubscribe;
  }, [isReady]);

  if (!currentTrack) return null;

  return (
    <div className="w-full px-4">
      <div
        ref={containerRef}
        className={`w-full rounded-xl overflow-hidden transition-opacity duration-300 ${isReady ? 'opacity-100' : 'opacity-20'}`}
      />
    </div>
  );
}
