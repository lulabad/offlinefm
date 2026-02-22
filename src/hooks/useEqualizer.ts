import { useEffect } from 'react';
import { useEqualizerStore } from '@/stores/equalizerStore';
import { audioEngine } from '@/services/audioEngine';

/**
 * Hook that syncs the equalizer store bands with the audio engine.
 */
export function useEqualizer() {
  const { bands, setBand, applyPreset, activePreset, presets, isOpen, toggleOpen, reset } =
    useEqualizerStore();

  useEffect(() => {
    // Apply current bands to engine on mount
    bands.forEach((b, i) => {
      audioEngine.setEQBand(i, b.gain);
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return { bands, setBand, applyPreset, activePreset, presets, isOpen, toggleOpen, reset };
}
