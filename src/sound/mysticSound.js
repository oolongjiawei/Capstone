// Mystic sound effects for the whole app, synthesised with the Web Audio API (no audio files).
// Everything runs through a long synthetic reverb so it sounds like a temple hall.
// Bazi flow: playNameReveal / playCrossfade / playInkDrop. Everyday UI: the play* exports below,
// plus installUiSounds(), which gives every button and link a soft wooden-fish tap.

const STORAGE_KEY = 'fortune-house-sound';
const MASTER_VOLUME = 0.6;
// Chinese pentatonic on A (宫商角徵羽 gong shang jue zhi yu), two octaves
const PENTATONIC = [440, 493.9, 554.4, 659.3, 740, 880, 987.8, 1108.7, 1318.5, 1480];

let ctx = null;
let master = null;
let reverb = null;
const listeners = new Set();

// lets every sound toggle in the app stay in sync (useSyncExternalStore)
export const subscribeSound = (listener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

export const isSoundOn = () => {
  try {
    return localStorage.getItem(STORAGE_KEY) !== 'off';
  } catch {
    return true;
  }
};

export const setSoundOn = (on) => {
  try {
    localStorage.setItem(STORAGE_KEY, on ? 'on' : 'off');
  } catch {
    /* ignore */
  }
  if (master) master.gain.setTargetAtTime(on ? MASTER_VOLUME : 0, ctx.currentTime, 0.05);
  listeners.forEach((listener) => listener());
};

// Exponentially decaying stereo noise: a cheap convolution reverb tail
const makeImpulse = (seconds, decay) => {
  const length = Math.floor(ctx.sampleRate * seconds);
  const buffer = ctx.createBuffer(2, length, ctx.sampleRate);
  for (let channel = 0; channel < 2; channel++) {
    const data = buffer.getChannelData(channel);
    for (let i = 0; i < length; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / length) ** decay;
    }
  }
  return buffer;
};

// Returns the audio context, creating it on first use. Browsers only allow sound after a user
// gesture, so call this from the click that starts the flow.
export const unlockSound = () => {
  if (!isSoundOn()) return null;
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return null;
  if (!ctx) {
    ctx = new AudioContextClass();
    master = ctx.createGain();
    master.gain.value = MASTER_VOLUME;
    master.connect(ctx.destination);
    reverb = ctx.createConvolver();
    reverb.buffer = makeImpulse(3.5, 2.6);
    const wet = ctx.createGain();
    wet.gain.value = 0.55;
    reverb.connect(wet).connect(master);
  }
  if (ctx.state === 'suspended') ctx.resume();
  master.gain.value = MASTER_VOLUME;
  return ctx;
};

const ready = () => (isSoundOn() && ctx && ctx.state !== 'closed' ? ctx : null);

// Send a voice to the dry output and the reverb
const route = (node, dry = 0.6, wet = 0.8) => {
  const dryGain = ctx.createGain();
  dryGain.gain.value = dry;
  node.connect(dryGain).connect(master);
  const wetGain = ctx.createGain();
  wetGain.gain.value = wet;
  node.connect(wetGain).connect(reverb);
};

const envelope = (gainNode, at, peak, attack, release) => {
  gainNode.gain.setValueAtTime(0.0001, at);
  gainNode.gain.exponentialRampToValueAtTime(peak, at + attack);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, at + attack + release);
};

// Bell / singing bowl: inharmonic partials, each doubled with a slight detune so it beats
const bell = (freq, at, { gain = 0.1, decay = 2.5, partials = [1, 2.76, 5.4, 8.93], detune = 0.8 } = {}) => {
  partials.forEach((ratio, k) => {
    [-detune, detune].forEach((offset) => {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = freq * ratio + offset;
      const amp = ctx.createGain();
      envelope(amp, at, (gain / (k + 1.5)) * 0.7, 0.006, decay / (1 + k * 0.6));
      osc.connect(amp);
      route(amp);
      osc.start(at);
      osc.stop(at + decay + 0.1);
    });
  });
};

const noiseSource = (seconds) => {
  const buffer = ctx.createBuffer(1, Math.floor(ctx.sampleRate * seconds), ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  const source = ctx.createBufferSource();
  source.buffer = buffer;
  return source;
};

// Name animation: a low breathing drone, a pentatonic chime per letter, starlight shimmer for
// the confetti. Returns a function that fades the drone out (call it when the name leaves).
export const playNameReveal = (letterCount) => {
  if (!ready()) return () => {};
  const t = ctx.currentTime + 0.02;

  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 500;
  filter.Q.value = 4;
  const lfo = ctx.createOscillator();
  lfo.frequency.value = 0.25;
  const lfoDepth = ctx.createGain();
  lfoDepth.gain.value = 250;
  lfo.connect(lfoDepth).connect(filter.frequency);
  const drone = ctx.createGain();
  drone.gain.setValueAtTime(0.0001, t);
  drone.gain.exponentialRampToValueAtTime(0.22, t + 1.2);
  const voices = [
    [55, 'triangle'],
    [110, 'sine'],
    [110.6, 'sine'],
    [164.8, 'sine'],
  ].map(([freq, type]) => {
    const osc = ctx.createOscillator();
    osc.type = type;
    osc.frequency.value = freq;
    osc.connect(filter);
    osc.start(t);
    return osc;
  });
  filter.connect(drone);
  route(drone, 0.7, 0.6);
  lfo.start(t);

  // letters pop in 50ms apart (see NameReveal); keep long names from turning into a cascade
  const chimes = Math.min(letterCount, 10);
  for (let i = 0; i < chimes; i++) {
    bell(PENTATONIC[i], t + 0.08 + i * 0.05, { gain: 0.05, decay: 1.8, partials: [1, 2.76, 5.4] });
  }

  const shimmer = noiseSource(1.2);
  const highpass = ctx.createBiquadFilter();
  highpass.type = 'highpass';
  highpass.frequency.value = 6000;
  const shimmerGain = ctx.createGain();
  envelope(shimmerGain, t + 0.4, 0.05, 0.15, 0.9);
  shimmer.connect(highpass).connect(shimmerGain);
  route(shimmerGain, 0.3, 1);
  shimmer.start(t + 0.4);

  let stopped = false;
  return (fadeSeconds = 1) => {
    if (stopped || !ctx) return;
    stopped = true;
    const now = ctx.currentTime;
    drone.gain.cancelScheduledValues(now);
    drone.gain.setValueAtTime(Math.max(drone.gain.value, 0.0001), now);
    drone.gain.exponentialRampToValueAtTime(0.0001, now + fadeSeconds);
    [...voices, lfo].forEach((osc) => osc.stop(now + fadeSeconds + 0.1));
  };
};

// The name dissolving into the result: a falling whoosh, then a singing bowl that rings on
export const playCrossfade = (seconds = 1.2) => {
  if (!ready()) return;
  const t = ctx.currentTime + 0.02;

  const whoosh = noiseSource(seconds + 0.3);
  const band = ctx.createBiquadFilter();
  band.type = 'bandpass';
  band.Q.value = 1.4;
  band.frequency.setValueAtTime(1800, t);
  band.frequency.exponentialRampToValueAtTime(250, t + seconds);
  const whooshGain = ctx.createGain();
  whooshGain.gain.setValueAtTime(0.0001, t);
  whooshGain.gain.exponentialRampToValueAtTime(0.3, t + seconds * 0.45);
  whooshGain.gain.exponentialRampToValueAtTime(0.0001, t + seconds);
  whoosh.connect(band).connect(whooshGain);
  route(whooshGain, 0.5, 0.7);
  whoosh.start(t);

  bell(196, t + 0.15, { gain: 0.32, decay: 6, partials: [1, 2.71, 5.15], detune: 1.2 });
};

// One result seeping into the chart: a water drop plus a bell, rising through the pentatonic.
// The last one (the description) gets a deeper bowl so the reading feels settled.
export const playInkDrop = (index, isLast = false) => {
  if (!ready()) return;
  const t = ctx.currentTime + 0.02;

  const drop = ctx.createOscillator();
  drop.type = 'sine';
  drop.frequency.setValueAtTime(950, t);
  drop.frequency.exponentialRampToValueAtTime(190, t + 0.14);
  const dropGain = ctx.createGain();
  envelope(dropGain, t, 0.12, 0.004, 0.35);
  drop.connect(dropGain);
  route(dropGain, 0.5, 0.9);
  drop.start(t);
  drop.stop(t + 0.5);

  if (isLast) {
    bell(146.8, t + 0.05, { gain: 0.22, decay: 5, partials: [1, 2.71, 5.15], detune: 1 });
  } else {
    bell(PENTATONIC[index] / 2, t + 0.03, { gain: 0.08, decay: 2.4 });
  }
};

// ---------------------------------------------------------------------------------------------
// Everyday UI sounds. They are always triggered by a click or key press, so each one unlocks
// the audio context itself. Kept quiet and mostly dry so they stay crisp.

const ui = () => unlockSound();

// a short burst of filtered noise (taps, ticks, rustles, cracks)
const noiseBurst = (at, { duration = 0.05, type = 'bandpass', freq = 2000, q = 1, gain = 0.05, sweepTo, dry = 0.8, wet = 0.2 }) => {
  const source = noiseSource(duration + 0.05);
  const filter = ctx.createBiquadFilter();
  filter.type = type;
  filter.Q.value = q;
  filter.frequency.setValueAtTime(freq, at);
  if (sweepTo) filter.frequency.exponentialRampToValueAtTime(sweepTo, at + duration);
  const amp = ctx.createGain();
  envelope(amp, at, gain, Math.min(0.01, duration / 4), duration);
  source.connect(filter).connect(amp);
  route(amp, dry, wet);
  source.start(at);
};

// a plucked string (guzheng-ish): bright attack that mellows as it decays
const pluck = (freq, at, gain = 0.07, decay = 0.7) => {
  const osc = ctx.createOscillator();
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(freq * 1.01, at);
  osc.frequency.exponentialRampToValueAtTime(freq, at + 0.05);
  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(freq * 6, at);
  filter.frequency.exponentialRampToValueAtTime(freq * 1.5, at + decay);
  const amp = ctx.createGain();
  envelope(amp, at, gain, 0.004, decay);
  osc.connect(filter).connect(amp);
  route(amp, 0.7, 0.4);
  osc.start(at);
  osc.stop(at + decay + 0.1);
};

// 木鱼 wooden fish: the default tap for buttons
export const playTap = () => {
  if (!ui()) return;
  const t = ctx.currentTime + 0.005;
  const osc = ctx.createOscillator();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(620, t);
  osc.frequency.exponentialRampToValueAtTime(480, t + 0.06);
  const amp = ctx.createGain();
  envelope(amp, t, 0.07, 0.003, 0.11);
  osc.connect(amp);
  route(amp, 0.8, 0.25);
  osc.start(t);
  osc.stop(t + 0.2);
  noiseBurst(t, { duration: 0.015, freq: 2500, q: 2, gain: 0.02 });
};

// an airy breath, rising (opening, moving on) or falling (closing)
export const playBreath = (rising = true) => {
  if (!ui()) return;
  const t = ctx.currentTime + 0.005;
  noiseBurst(t, {
    duration: 0.28,
    freq: rising ? 500 : 1800,
    sweepTo: rising ? 1800 : 450,
    q: 1.2,
    gain: 0.05,
    dry: 0.5,
    wet: 0.6,
  });
};

// a soft ratchet tick (the year wheel, the clock hand)
// (rate-limited on the wall clock: the audio clock stands still until the context is running)
let lastTick = 0;
export const playTick = () => {
  if (!ui()) return;
  if (performance.now() - lastTick < 30) return;
  lastTick = performance.now();
  noiseBurst(ctx.currentTime + 0.003, { duration: 0.012, freq: 3200, q: 3, gain: 0.035, wet: 0.1 });
};

// choosing something: a pentatonic pluck (index picks the note)
export const playSelect = (index = 0) => {
  if (!ui()) return;
  pluck(PENTATONIC[index % PENTATONIC.length] / 2, ctx.currentTime + 0.005);
};

// done / saved / welcome: two rising bell notes and a little shimmer
export const playSuccess = () => {
  if (!ui()) return;
  const t = ctx.currentTime + 0.01;
  bell(PENTATONIC[0], t, { gain: 0.07, decay: 1.8 });
  bell(PENTATONIC[3], t + 0.12, { gain: 0.07, decay: 2.4 });
  noiseBurst(t + 0.1, { duration: 0.5, type: 'highpass', freq: 6500, gain: 0.02, dry: 0.2, wet: 1 });
};

// something is missing or failed: a low muffled thud
export const playError = () => {
  if (!ui()) return;
  const t = ctx.currentTime + 0.005;
  const osc = ctx.createOscillator();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(140, t);
  osc.frequency.exponentialRampToValueAtTime(70, t + 0.2);
  const amp = ctx.createGain();
  envelope(amp, t, 0.16, 0.005, 0.28);
  osc.connect(amp);
  route(amp, 0.8, 0.3);
  osc.start(t);
  osc.stop(t + 0.4);
};

// deleting: two plucks stepping down
export const playRemove = () => {
  if (!ui()) return;
  const t = ctx.currentTime + 0.005;
  pluck(PENTATONIC[3] / 2, t, 0.06, 0.4);
  pluck(PENTATONIC[0] / 2, t + 0.09, 0.06, 0.5);
};

// opening or closing a panel: paper sliding
export const playSlide = (opening = true) => {
  if (!ui()) return;
  noiseBurst(ctx.currentTime + 0.005, {
    duration: 0.16,
    type: 'lowpass',
    freq: opening ? 900 : 1600,
    sweepTo: opening ? 1600 : 800,
    gain: 0.04,
    wet: 0.3,
  });
};

// the lucky cat's collar bell (鈴): three quick jingles
export const playCatBell = () => {
  if (!ui()) return;
  const t = ctx.currentTime + 0.01;
  [0, 0.07, 0.15].forEach((offset, i) => {
    bell(2100 + i * 90 + Math.random() * 40, t + offset, { gain: 0.045, decay: 0.7, partials: [1, 2.32, 3.86], detune: 3 });
  });
};

// the logo's light/dark switch: a deep gong for night, a bright rising chime for day
export const playThemeSwitch = (toDark) => {
  if (!ui()) return;
  const t = ctx.currentTime + 0.01;
  if (toDark) {
    bell(98, t, { gain: 0.3, decay: 4.5, partials: [1, 2.1, 3.2, 4.6], detune: 0.6 });
  } else {
    [0, 2, 4, 5].forEach((note, i) => bell(PENTATONIC[note], t + i * 0.06, { gain: 0.045, decay: 1.4 }));
  }
};

// cracking a fortune cookie: a crisp crunch, a snap, then the paper slip rustling out
export const playCookieCrack = () => {
  if (!ui()) return;
  const t = ctx.currentTime + 0.005;
  for (let i = 0; i < 6; i++) {
    noiseBurst(t + i * 0.018 + Math.random() * 0.01, {
      duration: 0.02,
      freq: 1800 + Math.random() * 2500,
      q: 1.5,
      gain: 0.07,
      wet: 0.15,
    });
  }
  const snap = ctx.createOscillator();
  snap.type = 'sine';
  snap.frequency.setValueAtTime(300, t);
  snap.frequency.exponentialRampToValueAtTime(120, t + 0.05);
  const snapGain = ctx.createGain();
  envelope(snapGain, t, 0.08, 0.002, 0.08);
  snap.connect(snapGain);
  route(snapGain, 0.8, 0.2);
  snap.start(t);
  snap.stop(t + 0.15);
  for (let i = 0; i < 5; i++) {
    noiseBurst(t + 0.18 + i * 0.05, { duration: 0.06, type: 'bandpass', freq: 3500 + Math.random() * 1500, q: 0.8, gain: 0.02, wet: 0.3 });
  }
};

// collecting a fortune: three quick rising chimes
export const playCollect = () => {
  if (!ui()) return;
  const t = ctx.currentTime + 0.01;
  [2, 4, 7].forEach((note, i) => bell(PENTATONIC[note], t + i * 0.08, { gain: 0.05, decay: 1.6 }));
};

// Every button and link gets the wooden-fish tap (links a rising breath) unless it opts out with
// data-sound="custom" because it plays its own sound. Call once at start-up.
export const installUiSounds = () => {
  document.addEventListener('click', (event) => {
    const target = event.target instanceof Element ? event.target : null;
    if (!target || target.closest('[data-sound="custom"]')) return;
    if (target.closest('a[href]')) {
      playBreath(true);
    } else if (target.closest('button:not(:disabled), [role="button"]')) {
      playTap();
    }
  });
};
