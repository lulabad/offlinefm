/**
 * Audio Engine — Web Audio API graph:
 * HTMLAudioElement → MediaElementSource → BiquadFilter[0..9] → AnalyserNode → GainNode → destination
 */

const EQ_FREQUENCIES = [60, 170, 310, 600, 1000, 3000, 6000, 12000, 14000, 16000];

export class AudioEngine {
  private ctx: AudioContext | null = null;
  private audioElement: HTMLAudioElement;
  private sourceNode: MediaElementAudioSourceNode | null = null;
  private filters: BiquadFilterNode[] = [];
  private analyserNode: AnalyserNode | null = null;
  private gainNode: GainNode | null = null;
  private initialized = false;

  // For gapless playback
  private nextAudioElement: HTMLAudioElement | null = null;

  constructor() {
    this.audioElement = new Audio();
    this.audioElement.crossOrigin = 'anonymous';
    this.audioElement.preload = 'auto';
  }

  private ensureContext(): AudioContext {
    if (!this.ctx) {
      this.ctx = new AudioContext();
    }
    return this.ctx;
  }

  /**
   * Initialize the full audio graph. Must be called after a user gesture.
   */
  init(): void {
    if (this.initialized) return;

    const ctx = this.ensureContext();

    // Source
    this.sourceNode = ctx.createMediaElementSource(this.audioElement);

    // EQ filters
    this.filters = EQ_FREQUENCIES.map((freq, i) => {
      const filter = ctx.createBiquadFilter();
      filter.type =
        i === 0 ? 'lowshelf' : i === EQ_FREQUENCIES.length - 1 ? 'highshelf' : 'peaking';
      filter.frequency.value = freq;
      filter.gain.value = 0;
      filter.Q.value = 1;
      return filter;
    });

    // Analyser
    this.analyserNode = ctx.createAnalyser();
    this.analyserNode.fftSize = 2048;

    // Gain
    this.gainNode = ctx.createGain();

    // Connect chain: source → filters → analyser → gain → destination
    let current: AudioNode = this.sourceNode;
    for (const filter of this.filters) {
      current.connect(filter);
      current = filter;
    }
    current.connect(this.analyserNode);
    this.analyserNode.connect(this.gainNode);
    this.gainNode.connect(ctx.destination);

    this.initialized = true;
  }

  getAudioElement(): HTMLAudioElement {
    return this.audioElement;
  }

  getAnalyserNode(): AnalyserNode | null {
    return this.analyserNode;
  }

  async loadTrack(url: string): Promise<void> {
    if (!this.initialized) this.init();
    if (this.ctx?.state === 'suspended') {
      await this.ctx.resume();
    }
    this.audioElement.src = url;
    this.audioElement.load();
  }

  async play(): Promise<void> {
    if (!this.initialized) this.init();
    if (this.ctx?.state === 'suspended') {
      await this.ctx.resume();
    }
    await this.audioElement.play();
  }

  pause(): void {
    this.audioElement.pause();
  }

  seek(time: number): void {
    this.audioElement.currentTime = time;
  }

  setVolume(value: number): void {
    // value is 0-1
    if (this.gainNode) {
      this.gainNode.gain.value = value;
    }
    this.audioElement.volume = Math.min(1, Math.max(0, value));
  }

  setEQBand(index: number, gain: number): void {
    if (this.filters[index]) {
      this.filters[index].gain.value = gain;
    }
  }

  getEQBands(): number[] {
    return this.filters.map((f) => f.gain.value);
  }

  get currentTime(): number {
    return this.audioElement.currentTime;
  }

  get duration(): number {
    return this.audioElement.duration || 0;
  }

  get paused(): boolean {
    return this.audioElement.paused;
  }

  /**
   * Preload next track for gapless playback.
   */
  preloadNext(url: string): void {
    this.nextAudioElement = new Audio();
    this.nextAudioElement.preload = 'auto';
    this.nextAudioElement.src = url;
  }

  /**
   * Get frequency data from analyser for visualization.
   */
  getFrequencyData(): Uint8Array {
    if (!this.analyserNode) return new Uint8Array(0);
    const data = new Uint8Array(this.analyserNode.frequencyBinCount);
    this.analyserNode.getByteFrequencyData(data);
    return data;
  }

  /**
   * Get time domain data from analyser for waveform.
   */
  getTimeDomainData(): Uint8Array {
    if (!this.analyserNode) return new Uint8Array(0);
    const data = new Uint8Array(this.analyserNode.frequencyBinCount);
    this.analyserNode.getByteTimeDomainData(data);
    return data;
  }

  destroy(): void {
    this.audioElement.pause();
    this.audioElement.src = '';
    this.sourceNode?.disconnect();
    this.filters.forEach((f) => f.disconnect());
    this.analyserNode?.disconnect();
    this.gainNode?.disconnect();
    this.ctx?.close();
    this.ctx = null;
    this.initialized = false;
  }
}

// Singleton
export const audioEngine = new AudioEngine();
