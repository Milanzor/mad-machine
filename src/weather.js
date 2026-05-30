// Weather system — overlay effects painted on the world that also tweak the
// physics. Mirrors the map-select pattern (themes.js): a bottom-bar button opens
// a tile grid; picking a tile swaps the active weather and re-paints the world.
import { world, WORLD_H, S } from './state.js';
import { particleBurst, hitPart } from './effects.js';
import { VOICES } from './audio.js';

const STORE_WEATHER = 'machinegame:weather';

export const WEATHERS = {
  sunny:   { name: 'Zonnig',  emoji: '☀️',  swatch: 'linear-gradient(160deg,#fef9c3,#fbbf24)' },
  rain:    { name: 'Regen',   emoji: '🌧️', swatch: 'linear-gradient(160deg,#94a3b8,#3b82f6)' },
  thunder: { name: 'Onweer',  emoji: '⛈️', swatch: 'linear-gradient(160deg,#475569,#1e1b4b)' },
  tornado: { name: 'Tornado', emoji: '🌪️', swatch: 'linear-gradient(160deg,#a8a29e,#44403c)' },
  snow:    { name: 'Sneeuw',  emoji: '❄️',  swatch: 'linear-gradient(160deg,#e0f2fe,#7dd3fc)' },
};

// How each weather bends the marble physics (read in physics.js).
// gravity/drag are multipliers; wind is the amplitude of a gusting sideways force.
const PHYSICS = {
  sunny:   { gravity: 1,    wind: 0,   drag: 1     },
  rain:    { gravity: 1.3,  wind: 0,   drag: 1     },
  thunder: { gravity: 1.3,  wind: 1.2, drag: 1     },
  tornado: { gravity: 0.7,  wind: 3.4, drag: 0.995 },
  snow:    { gravity: 0.45, wind: 0,   drag: 0.985 },
};

const TORNADO_SVG = `<svg viewBox="0 0 200 320" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
  <defs><linearGradient id="wxtg" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#a8a29e"/><stop offset="1" stop-color="#57534e"/>
  </linearGradient></defs>
  <path d="M8 12 Q100 44 192 12 Q150 120 132 182 Q120 244 100 312 Q80 244 68 182 Q50 120 8 12 Z" fill="url(#wxtg)" opacity=".8"/>
  <g stroke="#fff" stroke-opacity=".35" fill="none" stroke-width="3" stroke-linecap="round">
    <path d="M22 32 Q100 58 178 32"/>
    <path d="M36 82 Q100 102 164 82"/>
    <path d="M50 132 Q100 148 150 132"/>
    <path d="M63 182 Q100 194 137 182"/>
    <path d="M76 232 Q100 242 124 232"/>
  </g>
</svg>`;

function layer(cls) {
  const el = document.createElement('div');
  el.className = 'weather-fx ' + cls;
  world.appendChild(el);
  return el;
}

function buildWeatherFx(w) {
  if (w === 'sunny') {
    layer('wx-sunny-glow');
    layer('wx-sun').innerHTML = '<div class="wx-sun-core"></div>';
  } else if (w === 'rain') {
    layer('wx-tint wx-tint-rain');
    layer('wx-rain');
  } else if (w === 'thunder') {
    layer('wx-tint wx-tint-thunder');
    layer('wx-rain wx-rain-heavy');
    startLightning();
  } else if (w === 'snow') {
    layer('wx-tint wx-tint-snow');
    layer('wx-snow');
  } else if (w === 'tornado') {
    layer('wx-tint wx-tint-tornado');
    layer('wx-dust');
    const t = layer('wx-tornado');
    t.style.height = Math.round(WORLD_H * 0.72) + 'px';
    t.innerHTML = TORNADO_SVG;
  }
}

// Recurring lightning: flash the world, rumble, jolt the marbles and zap a part.
function startLightning() {
  const fire = () => {
    const flash = document.createElement('div');
    flash.className = 'weather-fx wx-flash';
    world.appendChild(flash);
    flash.addEventListener('animationend', () => flash.remove());
    VOICES.boom(0);

    S.marbles.forEach(m => {
      m.vx += (Math.random() - 0.5) * 14;
      m.vy -= Math.random() * 6;
    });
    const parts = [...world.querySelectorAll('.part:not([data-kind="marble"])')];
    if (parts.length) {
      const p = parts[Math.floor(Math.random() * parts.length)];
      hitPart(p, true);
      particleBurst(
        (parseFloat(p.style.left) || 0) + 45,
        (parseFloat(p.style.top)  || 0) + 45,
        ['#fde047', '#fff', '#a5b4fc', '#7c3aed']
      );
    }
    S.weatherTimer = setTimeout(fire, 2500 + Math.random() * 4000);
  };
  S.weatherTimer = setTimeout(fire, 1500 + Math.random() * 2500);
}

export function applyWeather(key) {
  const w = WEATHERS[key] ? key : 'sunny';
  S.weather = w;
  document.body.dataset.weather = w;
  try { localStorage.setItem(STORE_WEATHER, w); } catch (_) {}

  const p = PHYSICS[w];
  S.weatherGravity = p.gravity;
  S.weatherWind    = p.wind;
  S.weatherDrag    = p.drag;

  if (S.weatherTimer) { clearTimeout(S.weatherTimer); S.weatherTimer = null; }
  world.querySelectorAll('.weather-fx').forEach(el => el.remove());
  buildWeatherFx(w);
}

export function showWeatherSelect(allowClose = true) {
  const backdrop = document.getElementById('weatherBackdrop');
  const grid     = document.getElementById('weatherGrid');
  const close     = document.getElementById('weatherClose');
  grid.innerHTML = '';
  for (const [key, w] of Object.entries(WEATHERS)) {
    const card = document.createElement('div');
    card.className = 'map-card weather-card' + (S.weather === key ? ' selected' : '');
    card.innerHTML =
      `<span class="emoji">${w.emoji}</span>${w.name}` +
      `<span class="swatch" style="background:${w.swatch}"></span>`;
    card.addEventListener('click', () => {
      applyWeather(key);
      backdrop.hidden = true;
    });
    grid.appendChild(card);
  }
  close.hidden = !allowClose;
  backdrop.hidden = false;
}

export function initWeatherSelect() {
  document.getElementById('weatherClose').addEventListener('click', () => {
    document.getElementById('weatherBackdrop').hidden = true;
  });
  document.getElementById('weatherBtn').addEventListener('click', () => showWeatherSelect(true));

  const saved = (() => { try { return localStorage.getItem(STORE_WEATHER); } catch (_) { return null; } })();
  applyWeather(saved && WEATHERS[saved] ? saved : 'sunny');
}
