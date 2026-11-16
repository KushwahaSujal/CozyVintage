// Haptic Vibration Service for Mobile PWA
export class HapticEngine {
  private isEnabled: boolean = true;

  public setEnabled(enabled: boolean) {
    this.isEnabled = enabled;
  }

  // Light tap for button presses (15ms)
  public light() {
    if (!this.isEnabled) return;
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(15);
      } catch {
        // Ignore if restricted
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
        // Ignore
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
        // Ignore
      }
    }
  }
}

export const haptic = new HapticEngine();
