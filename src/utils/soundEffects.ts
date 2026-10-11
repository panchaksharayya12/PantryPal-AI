// Native Web Audio API and Audio element sound generator for tactile culinary feedback
class SoundEffects {
  private ctx: AudioContext | null = null;
  public enabled: boolean = false; // Silenced per user request: no irritating pop sounds
  private knifeAudio: HTMLAudioElement | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      try {
        this.knifeAudio = new Audio('/sounds/knife-slice.wav');
        this.knifeAudio.preload = 'auto';
      } catch (e) {}
    }
  }

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Realistic chef knife blade slicing and taking out knife sound
  public playKnifeChop() {
    try {
      if (this.knifeAudio) {
        const sound = this.knifeAudio.cloneNode() as HTMLAudioElement;
        sound.volume = 0.85;
        sound.play().catch(() => {
          this.playProceduralKnifeChop();
        });
        return;
      }
    } catch (e) {}
    this.playProceduralKnifeChop();
  }

  private playProceduralKnifeChop() {
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      // 1. Crisp vegetable crunch / blade slash (bandpass filtered white noise)
      const bufferSize = Math.floor(this.ctx.sampleRate * 0.12);
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 0.025));
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(3200, now);
      filter.frequency.exponentialRampToValueAtTime(1200, now + 0.1);
      filter.Q.setValueAtTime(2.5, now);

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.35, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(this.ctx.destination);
      noise.start(now);

      // 2. Heavy wooden chopping block thud
      const thudOsc = this.ctx.createOscillator();
      const thudGain = this.ctx.createGain();
      thudOsc.type = 'triangle';
      thudOsc.frequency.setValueAtTime(180, now);
      thudOsc.frequency.exponentialRampToValueAtTime(50, now + 0.08);

      thudGain.gain.setValueAtTime(0.3, now);
      thudGain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      thudOsc.connect(thudGain);
      thudGain.connect(this.ctx.destination);
      thudOsc.start(now);
      thudOsc.stop(now + 0.085);

      // 3. High chef knife steel resonance
      const metalOsc = this.ctx.createOscillator();
      const metalGain = this.ctx.createGain();
      metalOsc.type = 'sine';
      metalOsc.frequency.setValueAtTime(2800, now);
      metalOsc.frequency.exponentialRampToValueAtTime(1600, now + 0.06);

      metalGain.gain.setValueAtTime(0.12, now);
      metalGain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

      metalOsc.connect(metalGain);
      metalGain.connect(this.ctx.destination);
      metalOsc.start(now);
      metalOsc.stop(now + 0.065);
    } catch (e) {}
  }

  public playPop() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(420, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(860, this.ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.08);
    } catch (e) {}
  }

  public playChime() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
      notes.forEach((freq, i) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, this.ctx!.currentTime + i * 0.07);

        gain.gain.setValueAtTime(0.08, this.ctx!.currentTime + i * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx!.currentTime + i * 0.07 + 0.35);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(this.ctx!.currentTime + i * 0.07);
        osc.stop(this.ctx!.currentTime + i * 0.07 + 0.35);
      });
    } catch (e) {}
  }

  public playSwoosh() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(280, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(520, this.ctx.currentTime + 0.12);

      gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.12);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.12);
    } catch (e) {}
  }

  public playVictory() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      // Celebratory culinary triumph arpeggio
      const chord = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      chord.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, this.ctx!.currentTime + idx * 0.1);

        gain.gain.setValueAtTime(0.12, this.ctx!.currentTime + idx * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx!.currentTime + idx * 0.1 + 0.6);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(this.ctx!.currentTime + idx * 0.1);
        osc.stop(this.ctx!.currentTime + idx * 0.1 + 0.6);
      });
    } catch (e) {}
  }
}

export const sounds = new SoundEffects();

