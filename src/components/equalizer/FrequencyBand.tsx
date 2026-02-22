interface FrequencyBandProps {
  label: string;
  gain: number; // -12 to +12
  onChange: (gain: number) => void;
}

export function FrequencyBand({ label, gain, onChange }: FrequencyBandProps) {
  return (
    <div className="flex flex-col items-center gap-1 flex-1">
      <span className="text-[9px] text-secondary font-medium">
        {gain > 0 ? '+' : ''}
        {gain.toFixed(0)}
      </span>
      <input
        type="range"
        min={-12}
        max={12}
        step={0.5}
        value={gain}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="h-28 w-6 accent-(--color-accent)"
        style={{
          writingMode: 'vertical-lr',
          direction: 'rtl',
          WebkitAppearance: 'slider-vertical',
        }}
      />
      <span className="text-[9px] text-secondary">{label}</span>
    </div>
  );
}
