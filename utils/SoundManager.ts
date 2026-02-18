class SoundManager {
    private context: AudioContext | null = null;
    private masterGain: GainNode | null = null;
    private isMuted: boolean = false;

    constructor() {
        this.init();
    }

    private init() {
        if (typeof window !== 'undefined' && !this.context) {
            try {
                // @ts-ignore - Handle prefix if needed, though modern browsers support AudioContext
                const AudioContextClass = window.AudioContext || window.webkitAudioContext;
                this.context = new AudioContextClass();
                this.masterGain = this.context.createGain();
                this.masterGain.connect(this.context.destination);
                this.masterGain.gain.value = 0.3; // Default volume
            } catch (e) {
                console.warn('Web Audio API not supported', e);
            }
        }
    }

    private getContext(): AudioContext | null {
        if (!this.context) this.init();
        if (this.context?.state === 'suspended') {
            this.context.resume();
        }
        return this.context;
    }

    public setVolume(value: number) {
        if (this.masterGain) {
            this.masterGain.gain.value = Math.max(0, Math.min(1, value));
        }
    }

    public toggleMute() {
        this.isMuted = !this.isMuted;
        if (this.masterGain) {
            this.masterGain.gain.value = this.isMuted ? 0 : 0.3;
        }
    }

    // --- Sound Effects ---

    public playClick() {
        if (this.isMuted) return;
        const ctx = this.getContext();
        if (!ctx) return;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.connect(gain);
        gain.connect(this.masterGain!);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(400, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.1);

        gain.gain.setValueAtTime(0.5, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);

        osc.start();
        osc.stop(ctx.currentTime + 0.1);
    }

    public playSuccess() {
        if (this.isMuted) return;
        const ctx = this.getContext();
        if (!ctx) return;

        // High pitch arpeggio
        const now = ctx.currentTime;
        [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.connect(gain);
            gain.connect(this.masterGain!);

            osc.type = 'triangle';
            osc.frequency.value = freq;

            gain.gain.setValueAtTime(0, now + i * 0.05);
            gain.gain.linearRampToValueAtTime(0.3, now + i * 0.05 + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.05 + 0.3);

            osc.start(now + i * 0.05);
            osc.stop(now + i * 0.05 + 0.3);
        });
    }

    public playError() {
        if (this.isMuted) return;
        const ctx = this.getContext();
        if (!ctx) return;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.connect(gain);
        gain.connect(this.masterGain!);

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(100, ctx.currentTime + 0.3);

        gain.gain.setValueAtTime(0.5, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);

        osc.start();
        osc.stop(ctx.currentTime + 0.3);
    }

    public playCapture() {
        if (this.isMuted) return;
        const ctx = this.getContext();
        if (!ctx) return;

        // A deep "thud" or "boom"
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.connect(gain);
        gain.connect(this.masterGain!);

        osc.type = 'square';
        osc.frequency.setValueAtTime(100, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.4);

        gain.gain.setValueAtTime(0.5, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);

        osc.start();
        osc.stop(ctx.currentTime + 0.4);
    }

    public playPowerup() {
        if (this.isMuted) return;
        const ctx = this.getContext();
        if (!ctx) return;

        // Sci-fi rising sound
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.connect(gain);
        gain.connect(this.masterGain!);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(200, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(1200, ctx.currentTime + 0.6);

        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.4, ctx.currentTime + 0.4);
        gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.6);

        osc.start();
        osc.stop(ctx.currentTime + 0.6);
    }
}

export const soundManager = new SoundManager();
