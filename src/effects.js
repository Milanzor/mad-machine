import { shop, world, HIT_COOLDOWN, S } from './state.js';
import { VOICES } from './audio.js';
import { PARTS } from './parts.js';

export function particleBurst(cx, cy, colors) {
  for (let i = 0; i < 14; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.style.left = cx + 'px';
    p.style.top  = cy + 'px';
    p.style.background = colors[i % colors.length];
    world.appendChild(p);
    const angle = (i / 14) * Math.PI * 2 + Math.random() * 0.4;
    const dist = 40 + Math.random() * 50;
    const dx = Math.cos(angle) * dist;
    const dy = Math.sin(angle) * dist - 10;
    p.animate(
      [{ transform: 'translate(0,0) scale(1)', opacity: 1 },
       { transform: `translate(${dx}px, ${dy}px) scale(.3)`, opacity: 0 }],
      { duration: 520 + Math.random() * 200, easing: 'ease-out' }
    ).onfinish = () => p.remove();
  }
}

export function destroyByFire(el) {
  if (!el.parentNode) return;
  const r = el.getBoundingClientRect();
  const wr = world.getBoundingClientRect();
  particleBurst((r.left - wr.left) / S.worldScale + 45, (r.top - wr.top) / S.worldScale + 45, ['#dc2626','#fbbf24','#7c2d12','#451a03']);
  el.animate(
    [{ transform: 'scale(1) rotate(0)', opacity: 1, filter: 'brightness(1)' },
     { transform: 'scale(1.3) rotate(30deg)', opacity: 0, filter: 'brightness(3) sepia(1)' }],
    { duration: 350, easing: 'ease-out' }
  ).onfinish = () => el.remove();
  VOICES.boom(0);
}

export function hitPart(el, force = false) {
  const id = el.dataset.id;
  const now = performance.now();
  if (!force && HIT_COOLDOWN[id] && now - HIT_COOLDOWN[id] < 250) return;
  HIT_COOLDOWN[id] = now;
  el.classList.add("hit");
  setTimeout(() => el.classList.remove("hit"), 260);
  const v = VOICES[PARTS[el.dataset.kind].voice];
  if (v) v(0);
}
