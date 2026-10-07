/**
 * WebAudio synthesised UI sounds. No audio files are shipped.
 *
 * - The AudioContext is created lazily, only after a user gesture (`unlock()`),
 *   so autoplay policies are respected and nothing runs during load.
 * - Everything is short, quiet and soft (master gain ~0.15): glass ticks, an
 *   airy whoosh and a warm click.
 * - Mute is persisted in localStorage (guarded; storage may be unavailable).
 */

export type SfxName =
  | 'tick'
  | 'click'
  | 'hover'
  | 'whoosh'
  | 'open'
  | 'close'
  | 'success'
  | 'error'
  | 'next'
  | 'prev';

export interface SfxApi {
  play(name: SfxName): void;
  setMuted(muted: boolean): void;
  isMuted(): boolean;
  subscribe(listener: () => void): () => void;
  /** Create/resume the AudioContext. Call from a user-gesture handler. */
  unlock(): void;
  isUnlocked(): boolean;
}

const STORAGE_KEY = 'kn-sfx-muted';
const MASTER_GAIN = 0.15;
/** Minimum gap between two plays of the same sound, in seconds. */
const MIN_GAP: Record<SfxName, number> = {
  tick: 0.045,
  click: 0.05,
  hover: 0.09,
  whoosh: 0.6,
  open: 0.12,
  close: 0.12,
  success: 0.3,
  error: 0.3,
  next: 0.08,
  prev: 0.08,
};

type AudioContextCtor = typeof AudioContext;

interface Engine {
  ctx: AudioContext;
  master: GainNode;
  noise: AudioBuffer;
}

interface ToneSpec {
  freq: number;
  /** Optional glide target frequency. */
  to?: number;
  type?: OscillatorType;
  at?: number;
  dur: number;
  gain: number;
  attack?: number;
  lowpass?: number;
}

let engine: Engine | null = null;
let muted: boolean | null = null;
const listeners = new Set<() => void>();
const lastPlayed = new Map<SfxName, number>();

function readMuted(): boolean {
  if (muted !== null) return muted;
  let stored = false;
  try {
    stored = typeof localStorage !== 'undefined' && localStorage.getItem(STORAGE_KEY) === '1';
  } catch {
    stored = false;
  }
  muted = stored;
  return stored;
}

function emit(): void {
  listeners.forEach((fn) => fn());
}

function getContextCtor(): AudioContextCtor | null {
  if (typeof window === 'undefined') return null;
  const w = window as Window & { webkitAudioContext?: AudioContextCtor };
  return window.AudioContext ?? w.webkitAudioContext ?? null;
}

function buildNoise(ctx: AudioContext): AudioBuffer {
  const length = Math.floor(ctx.sampleRate * 1);
  const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < length; i += 1) data[i] = Math.random() * 2 - 1;
  return buffer;
}

function ensureEngine(): Engine | null {
  if (engine) return engine;
  const Ctor = getContextCtor();
  if (!Ctor) return null;
  try {
    const ctx = new Ctor();
    const master = ctx.createGain();
    master.gain.value = MASTER_GAIN;
    const limiter = ctx.createDynamicsCompressor();
    limiter.threshold.value = -18;
    limiter.ratio.value = 6;
    master.connect(limiter);
    limiter.connect(ctx.destination);
    engine = { ctx, master, noise: buildNoise(ctx) };
    return engine;
  } catch {
    return null;
  }
}

/** Smooth percussive envelope: fast attack, exponential decay to silence. */
function envelope(param: AudioParam, start: number, peak: number, attack: number, dur: number): void {
  param.setValueAtTime(0.0001, start);
  param.exponentialRampToValueAtTime(peak, start + attack);
  param.exponentialRampToValueAtTime(0.0001, start + dur);
}

function tone(e: Engine, spec: ToneSpec): void {
  const { ctx, master } = e;
  const start = ctx.currentTime + (spec.at ?? 0);
  const attack = spec.attack ?? 0.006;
  const osc = ctx.createOscillator();
  const amp = ctx.createGain();
  osc.type = spec.type ?? 'sine';
  osc.frequency.setValueAtTime(spec.freq, start);
  if (spec.to) osc.frequency.exponentialRampToValueAtTime(spec.to, start + spec.dur);
  envelope(amp.gain, start, spec.gain, attack, spec.dur);

  let tail: AudioNode = amp;
  osc.connect(amp);
  if (spec.lowpass) {
    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.value = spec.lowpass;
    amp.connect(lp);
    tail = lp;
  }
  tail.connect(master);
  osc.start(start);
  osc.stop(start + spec.dur + 0.05);
}

/** Glassy bell: fundamental plus an inharmonic partial. */
function glass(e: Engine, freq: number, gain: number, dur: number, at = 0): void {
  tone(e, { freq, gain, dur, at });
  tone(e, { freq: freq * 2.76, gain: gain * 0.32, dur: dur * 0.55, at });
}

function jitter(base: number, amount = 0.04): number {
  return base * (1 + (Math.random() * 2 - 1) * amount);
}

function whoosh(e: Engine): void {
  const { ctx, master, noise } = e;
  const start = ctx.currentTime;
  const dur = 0.42;
  const src = ctx.createBufferSource();
  src.buffer = noise;
  const band = ctx.createBiquadFilter();
  band.type = 'bandpass';
  band.Q.value = 0.8;
  band.frequency.setValueAtTime(380, start);
  band.frequency.exponentialRampToValueAtTime(2400, start + dur * 0.62);
  band.frequency.exponentialRampToValueAtTime(900, start + dur);
  const amp = ctx.createGain();
  amp.gain.setValueAtTime(0.0001, start);
  amp.gain.exponentialRampToValueAtTime(0.5, start + dur * 0.4);
  amp.gain.exponentialRampToValueAtTime(0.0001, start + dur);
  src.connect(band);
  band.connect(amp);
  amp.connect(master);
  src.start(start, Math.random() * 0.4);
  src.stop(start + dur + 0.05);
}

const RECIPES: Record<SfxName, (e: Engine) => void> = {
  tick: (e) => glass(e, jitter(2600), 0.42, 0.06),
  hover: (e) => tone(e, { freq: jitter(1900), to: 2200, gain: 0.2, dur: 0.07, attack: 0.012 }),
  click: (e) => {
    tone(e, { freq: 520, to: 330, gain: 0.55, dur: 0.1, lowpass: 2600 });
    tone(e, { freq: 1040, type: 'triangle', gain: 0.16, dur: 0.045, lowpass: 3200 });
  },
  whoosh,
  open: (e) => {
    glass(e, 659, 0.3, 0.16);
    glass(e, 988, 0.3, 0.2, 0.06);
  },
  close: (e) => {
    glass(e, 988, 0.26, 0.14);
    glass(e, 659, 0.26, 0.18, 0.06);
  },
  success: (e) => {
    glass(e, 784, 0.3, 0.22);
    glass(e, 988, 0.3, 0.22, 0.09);
    glass(e, 1175, 0.32, 0.34, 0.18);
  },
  error: (e) => {
    tone(e, { freq: 220, to: 196, type: 'triangle', gain: 0.45, dur: 0.14, lowpass: 900 });
    tone(e, { freq: 196, to: 174, type: 'triangle', gain: 0.4, dur: 0.18, at: 0.12, lowpass: 900 });
  },
  next: (e) => {
    tone(e, { freq: 700, to: 1000, gain: 0.3, dur: 0.1, attack: 0.01 });
    glass(e, 1800, 0.18, 0.08, 0.04);
  },
  prev: (e) => {
    tone(e, { freq: 1000, to: 700, gain: 0.3, dur: 0.1, attack: 0.01 });
    glass(e, 1500, 0.18, 0.08, 0.04);
  },
};

function play(name: SfxName): void {
  if (readMuted() || !engine) return;
  if (typeof document !== 'undefined' && document.hidden) return;
  const { ctx } = engine;
  if (ctx.state !== 'running') {
    void ctx.resume().catch(() => undefined);
    return;
  }
  const now = ctx.currentTime;
  const last = lastPlayed.get(name) ?? -1;
  if (now - last < MIN_GAP[name]) return;
  lastPlayed.set(name, now);
  try {
    RECIPES[name](engine);
  } catch {
    // Audio is decorative; never let a synthesis failure surface to the page.
  }
}

function unlock(): void {
  const e = ensureEngine();
  if (e && e.ctx.state === 'suspended') void e.ctx.resume().catch(() => undefined);
  emit();
}

function setMuted(next: boolean): void {
  muted = next;
  try {
    localStorage.setItem(STORAGE_KEY, next ? '1' : '0');
  } catch {
    // Storage unavailable (private mode / blocked): keep the in-memory value.
  }
  emit();
}

export const sfx: SfxApi = {
  play,
  setMuted,
  isMuted: readMuted,
  subscribe(listener) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
  unlock,
  isUnlocked: () => engine !== null && engine.ctx.state === 'running',
};

export default sfx;
