// Shared AudioContext singleton — avoids creating a new AudioContext per sound
let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    }
    // Resume if suspended (browser autoplay policy)
    if (audioCtx.state === "suspended") {
        audioCtx.resume();
    }
    return audioCtx;
}

export const playSound = (
    freq: number,
    endFreq: number,
    duration: number,
    volume: number,
    type: OscillatorType = "sine"
) => {
    try {
        const ctx = getAudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(endFreq, ctx.currentTime + duration);
        gain.gain.setValueAtTime(volume, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
        osc.connect(gain).connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + duration);
        // Disconnect nodes after they finish to free resources
        osc.onended = () => {
            osc.disconnect();
            gain.disconnect();
        };
    } catch {
        /* silent fail */
    }
};

export const playOpenSound = () => {
    playSound(600, 1200, 0.15, 0.08, "sine");
    setTimeout(() => playSound(900, 1400, 0.1, 0.05, "sine"), 60);
};

export const playCloseSound = () => {
    playSound(800, 400, 0.15, 0.06, "sine");
};
