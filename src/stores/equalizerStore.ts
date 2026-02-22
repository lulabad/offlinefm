import { create } from 'zustand';
import type { EQBand, EQPreset } from '@/types';
import { audioEngine } from '@/services/audioEngine';

const DEFAULT_BANDS: EQBand[] = [
  { frequency: 60, gain: 0 },
  { frequency: 170, gain: 0 },
  { frequency: 310, gain: 0 },
  { frequency: 600, gain: 0 },
  { frequency: 1000, gain: 0 },
  { frequency: 3000, gain: 0 },
  { frequency: 6000, gain: 0 },
  { frequency: 12000, gain: 0 },
  { frequency: 14000, gain: 0 },
  { frequency: 16000, gain: 0 },
];

const BUILTIN_PRESETS: EQPreset[] = [
  { name: 'Flat', bands: DEFAULT_BANDS },
  {
    name: 'Rock',
    bands: DEFAULT_BANDS.map((b) => ({
      ...b,
      gain: [5, 4, 3, 1, -1, 2, 4, 5, 5, 4][DEFAULT_BANDS.indexOf(b)],
    })),
  },
  {
    name: 'Pop',
    bands: DEFAULT_BANDS.map((b) => ({
      ...b,
      gain: [-1, 2, 4, 5, 4, 2, 0, -1, -1, -1][DEFAULT_BANDS.indexOf(b)],
    })),
  },
  {
    name: 'Jazz',
    bands: DEFAULT_BANDS.map((b) => ({
      ...b,
      gain: [3, 2, 1, 2, -1, -1, 0, 2, 3, 4][DEFAULT_BANDS.indexOf(b)],
    })),
  },
  {
    name: 'Classical',
    bands: DEFAULT_BANDS.map((b) => ({
      ...b,
      gain: [4, 3, 2, 1, -1, 0, 1, 3, 4, 5][DEFAULT_BANDS.indexOf(b)],
    })),
  },
  {
    name: 'Bass Boost',
    bands: DEFAULT_BANDS.map((b) => ({
      ...b,
      gain: [8, 6, 4, 2, 0, 0, 0, 0, 0, 0][DEFAULT_BANDS.indexOf(b)],
    })),
  },
  {
    name: 'Treble Boost',
    bands: DEFAULT_BANDS.map((b) => ({
      ...b,
      gain: [0, 0, 0, 0, 0, 2, 4, 6, 7, 8][DEFAULT_BANDS.indexOf(b)],
    })),
  },
];

interface EqualizerState {
  bands: EQBand[];
  presets: EQPreset[];
  activePreset: string;
  isOpen: boolean;

  // Actions
  setBand: (index: number, gain: number) => void;
  applyPreset: (name: string) => void;
  saveCustomPreset: (name: string) => void;
  toggleOpen: () => void;
  reset: () => void;
}

export const useEqualizerStore = create<EqualizerState>((set, get) => ({
  bands: [...DEFAULT_BANDS],
  presets: [...BUILTIN_PRESETS],
  activePreset: 'Flat',
  isOpen: false,

  setBand: (index, gain) => {
    const bands = [...get().bands];
    bands[index] = { ...bands[index], gain };
    audioEngine.setEQBand(index, gain);
    set({ bands, activePreset: 'Custom' });
  },

  applyPreset: (name) => {
    const preset = get().presets.find((p) => p.name === name);
    if (!preset) return;
    preset.bands.forEach((b, i) => audioEngine.setEQBand(i, b.gain));
    set({ bands: [...preset.bands], activePreset: name });
  },

  saveCustomPreset: (name) => {
    const bands = get().bands.map((b) => ({ ...b }));
    const preset: EQPreset = { name, bands };
    set((s) => ({
      presets: [...s.presets.filter((p) => p.name !== name), preset],
      activePreset: name,
    }));
    // Persist custom presets to localStorage
    const custom = get().presets.filter((p) => !BUILTIN_PRESETS.some((bp) => bp.name === p.name));
    localStorage.setItem('offlinefm_eq_presets', JSON.stringify(custom));
  },

  toggleOpen: () => set((s) => ({ isOpen: !s.isOpen })),

  reset: () => {
    DEFAULT_BANDS.forEach((_, i) => audioEngine.setEQBand(i, 0));
    set({ bands: [...DEFAULT_BANDS], activePreset: 'Flat' });
  },
}));
