import { S } from './state.js';

export function ac() {
  if (!S.audioCtx) S.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  return S.audioCtx;
}

export function tone({ freq = 440, type = "sine", dur = 0.2, vol = 0.15, slide = 0, delay = 0 }) {
  if (!S.soundOn) return;
  const ctx = ac();
  const t0 = ctx.currentTime + delay;
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, t0);
  if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(20, freq + slide), t0 + dur);
  g.gain.setValueAtTime(0, t0);
  g.gain.linearRampToValueAtTime(vol, t0 + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  o.connect(g).connect(ctx.destination);
  o.start(t0); o.stop(t0 + dur + 0.02);
}

export function noise({ dur = 0.2, vol = 0.1, delay = 0, filter = 800 }) {
  if (!S.soundOn) return;
  const ctx = ac();
  const t0 = ctx.currentTime + delay;
  const buf = ctx.createBuffer(1, Math.ceil(ctx.sampleRate * dur), ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1);
  const src = ctx.createBufferSource(); src.buffer = buf;
  const f = ctx.createBiquadFilter(); f.type = "bandpass"; f.frequency.value = filter;
  const g = ctx.createGain();
  g.gain.setValueAtTime(0, t0);
  g.gain.linearRampToValueAtTime(vol, t0 + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  src.connect(f).connect(g).connect(ctx.destination);
  src.start(t0); src.stop(t0 + dur + 0.02);
}

export const VOICES = {
  whirr:  d => { for (let i = 0; i < 6; i++) tone({ freq: 220 + Math.random()*40, type:"sawtooth", dur:.4, vol:.04, delay: d + i*.4 }); },
  boing:  d => tone({ freq: 600, type:"sine", dur:.3, vol:.2, slide: -400, delay: d }),
  buzz:   d => tone({ freq: 90, type:"square", dur:1.5, vol:.05, delay: d }),
  whisk:  d => noise({ dur: 1.5, vol: .07, filter: 2000, delay: d }),
  flap:   d => { tone({ freq: 200, type:"triangle", dur:.1, vol:.15, delay: d }); tone({ freq: 160, type:"triangle", dur:.1, vol:.15, delay: d+.5 }); },
  thud:   d => { for (let i = 0; i < 4; i++) noise({ dur:.1, vol:.12, filter:200, delay: d + i*.3 }); },
  ping:   d => tone({ freq: 1320, type:"sine", dur:.4, vol:.1, delay: d }),
  chug:   d => { for (let i = 0; i < 8; i++) tone({ freq: 110, type:"square", dur:.08, vol:.1, delay: d + i*.18 }); },
  click:  d => { for (let i = 0; i < 5; i++) tone({ freq: 1800, type:"square", dur:.02, vol:.08, delay: d + i*.3 }); },
  vroom:  d => tone({ freq: 180, type:"sawtooth", dur:1.2, vol:.08, slide: 60, delay: d }),
  windy:  d => noise({ dur: 2, vol: .06, filter: 500, delay: d }),
  twang:  d => tone({ freq: 300, type:"triangle", dur:.4, vol:.15, slide: -100, delay: d }),
  plink:  d => tone({ freq: 1500, type:"sine", dur:.1, vol:.12, slide: -400, delay: d }),
  sizzle: d => { noise({ dur:.5, vol:.12, filter: 3500, delay: d }); tone({ freq: 220, type:"sawtooth", dur:.3, vol:.08, slide:-100, delay: d }); },
  boom:   d => { noise({ dur:.5, vol:.18, filter: 180, delay: d }); tone({ freq: 90, type:"sawtooth", dur:.4, vol:.14, slide:-50, delay: d }); },
  beep:   d => { tone({ freq: 880, type:"square", dur:.06, vol:.1, delay: d }); tone({ freq: 660, type:"square", dur:.06, vol:.1, delay: d+.1 }); tone({ freq: 990, type:"square", dur:.08, vol:.1, delay: d+.2 }); },
  squeak: d => { tone({ freq: 2400, type:"sine", dur:.07, vol:.09, slide:-500, delay: d }); tone({ freq: 2000, type:"sine", dur:.07, vol:.09, slide:-500, delay: d+.09 }); },
  munch:  d => { for (let i = 0; i < 3; i++) noise({ dur:.06, vol:.1, filter: 700, delay: d + i*.1 }); }
};
