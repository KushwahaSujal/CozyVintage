// Cozy Vintage Web Audio Synthesizer
// Zero external sound asset dependencies - works 100% offline!

export type SoundStyle = 'vintage_bell' | 'cozy_nature' | 'retro_arcade';

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isEnabled: boolean = true;
  private currentStyle: SoundStyle = 'vintage_bell';

  constructor() {
    if (typeof window !== 'undefined') {
      const savedEnabled = localStorage.getItem('cozy_sound_enabled');
      if (savedEnabled !== null) {
        this.isEnabled = savedEnabled === 'true';
      }
      const savedStyle = localStorage.getItem('cozy_sound_style') as SoundStyle | null;
      if (savedStyle && ['vintage_bell', 'cozy_nature', 'retro_arcade'].includes(savedStyle)) {
        this.currentStyle = savedStyle;
      }

      // Automatically unlock AudioContext on first user interaction anywhere
      const unlockAudio = () => {
        this.initContext();
        window.removeEventListener('click', unlockAudio);
        window.removeEventListener('touchstart', unlockAudio);
        window.removeEventListener('keydown', unlockAudio);
      };
      window.addEventListener('click', unlockAudio, { passive: true });
      window.addEventListener('touchstart', unlockAudio, { passive: true });
      window.addEventListener('keydown', unlockAudio, { passive: true });
    }
  }

  public setEnabled(enabled: boolean) {
    this.isEnabled = enabled;
    if (typeof window !== 'undefined') {
      localStorage.setItem('cozy_sound_enabled', String(enabled));
    }
    if (enabled) {
      this.initContext();
    }
  }

  public isAudioEnabled(): boolean {
    return this.isEnabled;
  }

  public setStyle(style: SoundStyle) {
    this.currentStyle = style;
    if (typeof window !== 'undefined') {
      localStorage.setItem('cozy_sound_style', style);
    }
  }

  public getStyle(): SoundStyle {
    return this.currentStyle;
  }

  private initContext(): AudioContext | null {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  // Button Tap Click
  public playClick() {
    if (!this.isEnabled) return;
    const ctx = this.initContext();
    if (!ctx) return;

    try {
      const t = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      if (this.currentStyle === 'cozy_nature') {
        // Woodblock / soft marimba tap
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(320, t);
        osc.frequency.exponentialRampToValueAtTime(140, t + 0.05);

        gain.gain.setValueAtTime(0.18, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
      } else if (this.currentStyle === 'retro_arcade') {
        // 8-bit crisp blip
        osc.type = 'square';
        osc.frequency.setValueAtTime(600, t);
        osc.frequency.setValueAtTime(900, t + 0.02);

        gain.gain.setValueAtTime(0.08, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.04);
      } else {
        // Vintage Parchment Bell tap
        osc.type = 'sine';
        osc.frequency.setValueAtTime(540, t);
        osc.frequency.exponentialRampToValueAtTime(220, t + 0.05);

        gain.gain.setValueAtTime(0.14, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
      }

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(t);
      osc.stop(t + 0.06);
    } catch {
      // Audio error ignored safely
    }
  }

  // Water Drop Sound
  public playWaterDrop() {
    if (!this.isEnabled) return;
    const ctx = this.initContext();
    if (!ctx) return;

    try {
      const t = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      if (this.currentStyle === 'cozy_nature') {
        // Soft organic rainfall bubble
        osc.type = 'sine';
        osc.frequency.setValueAtTime(700, t);
        osc.frequency.exponentialRampToValueAtTime(1200, t + 0.09);
        osc.frequency.exponentialRampToValueAtTime(550, t + 0.18);

        gain.gain.setValueAtTime(0.24, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.22);
      } else if (this.currentStyle === 'retro_arcade') {
        // 8-bit water pip
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(440, t);
        osc.frequency.exponentialRampToValueAtTime(880, t + 0.1);

        gain.gain.setValueAtTime(0.15, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
      } else {
        // Crystal drop
        osc.type = 'sine';
        osc.frequency.setValueAtTime(820, t);
        osc.frequency.exponentialRampToValueAtTime(1450, t + 0.08);
        osc.frequency.exponentialRampToValueAtTime(620, t + 0.16);

        gain.gain.setValueAtTime(0.22, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.22);
      }

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(t);
      osc.stop(t + 0.24);
    } catch {
      // Audio error ignored safely
    }
  }

  // Study Bulb Illumination Chime
  public playBulbIllumination() {
    if (!this.isEnabled) return;
    const ctx = this.initContext();
    if (!ctx) return;

    try {
      const t = ctx.currentTime;
      const freqs =
        this.currentStyle === 'cozy_nature'
          ? [392.0, 493.88, 587.33, 783.99] // Warm G Major Kalimba
          : this.currentStyle === 'retro_arcade'
          ? [523.25, 659.25, 783.99, 1046.5] // Retro arpeggio
          : [523.25, 659.25, 783.99, 1046.5]; // C Major brass chime

      freqs.forEach((freq, idx) => {
        if (!ctx) return;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type =
          this.currentStyle === 'retro_arcade'
            ? 'square'
            : this.currentStyle === 'cozy_nature'
            ? 'sine'
            : 'triangle';
        osc.frequency.setValueAtTime(freq, t + idx * 0.07);

        gain.gain.setValueAtTime(0.12, t + idx * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.07 + 0.7);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(t + idx * 0.07);
        osc.stop(t + idx * 0.07 + 0.75);
      });
    } catch {
      // Audio error ignored safely
    }
  }

  // Coin Claim Chime for XP
  public playXpClaim() {
    if (!this.isEnabled) return;
    const ctx = this.initContext();
    if (!ctx) return;

    try {
      const t = ctx.currentTime;
      const notes =
        this.currentStyle === 'retro_arcade'
          ? [987.77, 1318.51] // Classic 8-bit coin
          : this.currentStyle === 'cozy_nature'
          ? [659.25, 880.0] // Warm chime
          : [987.77, 1318.51]; // B5 -> E6 gold coin

      notes.forEach((freq, idx) => {
        if (!ctx) return;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = this.currentStyle === 'retro_arcade' ? 'square' : 'sine';
        osc.frequency.setValueAtTime(freq, t + idx * 0.08);

        gain.gain.setValueAtTime(0.16, t + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.08 + 0.35);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(t + idx * 0.08);
        osc.stop(t + idx * 0.08 + 0.38);
      });
    } catch {
      // Audio error ignored safely
    }
  }

  // Fanfare for Streaks & Milestones
  public playFanfare() {
    if (!this.isEnabled) return;
    const ctx = this.initContext();
    if (!ctx) return;

    try {
      const t = ctx.currentTime;
      const notes = [261.63, 329.63, 392.0, 523.25, 659.25];

      notes.forEach((freq, idx) => {
        if (!ctx) return;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = this.currentStyle === 'retro_arcade' ? 'square' : 'triangle';
        osc.frequency.setValueAtTime(freq, t + idx * 0.1);

        const duration = idx === notes.length - 1 ? 0.8 : 0.28;
        gain.gain.setValueAtTime(0.16, t + idx * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.1 + duration);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(t + idx * 0.1);
        osc.stop(t + idx * 0.1 + duration + 0.05);
      });
    } catch {
      // Audio error ignored safely
    }
  }

  // Preview test sound when switching effects in Preferences
  public testSound(style?: SoundStyle) {
    if (style) {
      this.currentStyle = style;
    }
    const previous = this.isEnabled;
    this.isEnabled = true;
    this.playXpClaim();
    this.isEnabled = previous;
  }
}

export const sounds = new SoundEngine();
