// Haptic Vibration Service for Mobile PWA
export class HapticEngine {
  private isEnabled: boolean = true;

  constructor() {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('cozy_haptic_enabled');
      if (saved !== null) {
        this.isEnabled = saved === 'true';
      }
    }
  }

  public setEnabled(enabled: boolean) {
    this.isEnabled = enabled;
    if (typeof window !== 'undefined') {
      localStorage.setItem('cozy_haptic_enabled', String(enabled));
    }
    if (enabled) {
      this.testVibrate();
    }
  }

  public isHapticEnabled(): boolean {
    return this.isEnabled;
  }

  public isSupported(): boolean {
    return typeof window !== 'undefined' && 'vibrate' in navigator;
  }

  public testVibrate() {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate([30, 40, 50]);
      } catch {
        // Safe catch
      }
    }
  }

  // Light tap for button presses (15ms)
  public light() {
    if (!this.isEnabled) return;
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(15);
      } catch {
        // Safe catch
      }
    }
  }

  // Medium vibration for task completion (35ms)
  public medium() {
    if (!this.isEnabled) return;
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(35);
      } catch {
        // Safe catch
      }
    }
  }

  // Double pulse for XP claim or streak milestone
  public celebrate() {
    if (!this.isEnabled) return;
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate([40, 60, 80]);
      } catch {
        // Safe catch
      }
    }
  }
}

export const haptic = new HapticEngine();
