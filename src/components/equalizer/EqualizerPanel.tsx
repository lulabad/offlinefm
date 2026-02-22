import { useTranslation } from 'react-i18next';
import { useEqualizer } from '@/hooks/useEqualizer';
import { FrequencyBand } from './FrequencyBand';
import { Button } from '@/components/common/Button';

function formatFreq(hz: number): string {
  return hz >= 1000 ? `${hz / 1000}k` : `${hz}`;
}

export function EqualizerPanel() {
  const { t } = useTranslation();
  const { bands, setBand, applyPreset, activePreset, presets, isOpen, toggleOpen, reset } =
    useEqualizer();

  if (!isOpen) return null;

  return (
    <div className="absolute bottom-28 right-4 z-40 bg-surface border border-app rounded-xl shadow-elevated p-5 w-[480px] transition-theme animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-primary font-display">{t('eq.title')}</h3>
        <button
          onClick={toggleOpen}
          className="text-secondary hover:text-primary transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      {/* Presets */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {presets.map((preset) => (
          <button
            key={preset.name}
            onClick={() => applyPreset(preset.name)}
            className={`px-2.5 py-1 text-xs rounded-full transition-all ${
              activePreset === preset.name
                ? 'bg-accent text-on-accent'
                : 'bg-surface-hover text-secondary hover:text-primary'
            }`}
          >
            {preset.name}
          </button>
        ))}
      </div>

      {/* Bands */}
      <div className="flex items-end justify-between gap-1 h-44 mb-3">
        {bands.map((band, i) => (
          <FrequencyBand
            key={band.frequency}
            label={formatFreq(band.frequency)}
            gain={band.gain}
            onChange={(gain) => setBand(i, gain)}
          />
        ))}
      </div>

      {/* Reset */}
      <div className="flex justify-end">
        <Button variant="ghost" size="sm" onClick={reset}>
          {t('eq.reset')}
        </Button>
      </div>
    </div>
  );
}
