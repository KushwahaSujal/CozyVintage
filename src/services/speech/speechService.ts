// Speech Service for Audio Quote Player (Offline Browser SpeechSynthesis)

class SpeechService {
  private synth: SpeechSynthesis | null = null;
  private isSpeaking: boolean = false;
  private currentUtterance: SpeechSynthesisUtterance | null = null;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
    }
  }

  public getVoices(): SpeechSynthesisVoice[] {
    if (!this.synth) return [];
    return this.synth.getVoices();
  }

  public speak(
    text: string,
    onEnd?: () => void,
    onError?: (err: unknown) => void,
    voiceName?: string
  ) {
    if (!this.synth) {
      if (onError) onError('Speech synthesis not supported on this device');
      return;
    }

    this.stop();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.92; // Calm, meditative pace
    utterance.pitch = 1.0;

    if (voiceName) {
      const voices = this.getVoices();
      const matched = voices.find((v) => v.name === voiceName);
      if (matched) utterance.voice = matched;
    }

    utterance.onend = () => {
      this.isSpeaking = false;
      this.currentUtterance = null;
      if (onEnd) onEnd();
    };

    utterance.onerror = (e) => {
      this.isSpeaking = false;
      this.currentUtterance = null;
      if (onError) onError(e);
    };

    this.currentUtterance = utterance;
    this.isSpeaking = true;
    this.synth.speak(utterance);
  }

  public stop() {
    if (this.synth) {
      this.synth.cancel();
    }
    this.isSpeaking = false;
    this.currentUtterance = null;
  }

  public getSpeakingState(): boolean {
    return this.isSpeaking;
  }
}

export const speechService = new SpeechService();
