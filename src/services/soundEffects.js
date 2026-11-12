/**
 * KAMVERSE Neo-Brutalist OS Sound Effects Engine
 * 
 * Powered by Web Audio API for 0ms latency, zero external asset dependencies,
 * and high-fidelity mechanical UI sound design.
 */

let audioCtx = null;
let soundEnabled = true;

/**
 * Initializes or resumes the AudioContext on user gesture.
 */
export const getAudioContext = () => {
  if (typeof window === 'undefined') return null;
  
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }

  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }

  return audioCtx;
};

/**
 * Set the global sound enabled state
 */
export const setSoundEnabledState = (enabled) => {
  soundEnabled = Boolean(enabled);
};

export const isSoundEnabled = () => soundEnabled;

/**
 * Play a tactile, mechanical keyboard / mouse click sound.
 * Crisp, punchy transient with rapid exponential decay (18ms).
 */
export const playClickSound = (volume = 0.22) => {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;

    // 1. Transient click oscillator
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(1200, now);
    osc.frequency.exponentialRampToValueAtTime(140, now + 0.016);

    gain.gain.setValueAtTime(volume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.018);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.02);

    // 2. High-pass noise burst for crisp mechanical tactile click
    const bufferSize = Math.floor(ctx.sampleRate * 0.008); // 8ms noise
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.25));
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(1800, now);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(volume * 0.75, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.012);

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(ctx.destination);

    noise.start(now);
  } catch (_) {}
};

/**
 * Play an ascending harmonic chime for launching apps or opening windows.
 */
export const playOpenSound = (volume = 0.18) => {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    const notes = [523.25, 659.25, 783.99]; // C5, E5, G5

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.035);

      const startTime = now + idx * 0.035;
      gain.gain.setValueAtTime(0.001, startTime);
      gain.gain.linearRampToValueAtTime(volume, startTime + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.12);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.14);
    });
  } catch (_) {}
};

/**
 * Play a snappy descending dismiss click for closing windows.
 */
export const playCloseSound = (volume = 0.18) => {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(520, now);
    osc.frequency.exponentialRampToValueAtTime(180, now + 0.045);

    gain.gain.setValueAtTime(volume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.055);
  } catch (_) {}
};

/**
 * Play a subtle whoosh frequency sweep for minimizing windows.
 */
export const playMinimizeSound = (volume = 0.15) => {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(650, now);
    osc.frequency.exponentialRampToValueAtTime(220, now + 0.06);

    gain.gain.setValueAtTime(volume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.065);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.07);
  } catch (_) {}
};

/**
 * Play a snappy dual-tone toggle click (like an iOS / mechanical switch).
 */
export const playToggleSound = (volume = 0.2) => {
  // Allow toggle sound even when toggling sound ON
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;

    [820, 1180].forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.03);

      const startTime = now + idx * 0.03;
      gain.gain.setValueAtTime(volume, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.025);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.03);
    });
  } catch (_) {}
};

/**
 * Play a pleasant confirmation chime.
 */
export const playSuccessSound = (volume = 0.2) => {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    const notes = [659.25, 880]; // E5, A5

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.05);

      const startTime = now + idx * 0.05;
      gain.gain.setValueAtTime(volume, startTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.16);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.18);
    });
  } catch (_) {}
};

/**
 * Universal sound dispatcher
 */
export const playSound = (type, volume) => {
  switch (type) {
    case 'open':
    case 'launch':
      playOpenSound(volume);
      break;
    case 'close':
      playCloseSound(volume);
      break;
    case 'minimize':
      playMinimizeSound(volume);
      break;
    case 'toggle':
    case 'switch':
      playToggleSound(volume);
      break;
    case 'success':
      playSuccessSound(volume);
      break;
    case 'click':
    default:
      playClickSound(volume);
      break;
  }
};
