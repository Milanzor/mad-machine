import { world, WORLD_W, WORLD_H, STORE_THEME } from './state.js';

export const THEMES = {
  workshop: { name: "Werkplaats", emoji: "🔧",
    bg: "#f4ead5",
    pattern: "linear-gradient(rgba(120,90,40,.07) 1px, transparent 1px), linear-gradient(90deg, rgba(120,90,40,.07) 1px, transparent 1px)",
    patternSize: "24px 24px" },
  dino: { name: "Dinoland", emoji: "🦖",
    bg: "#bbf7d0",
    pattern: "radial-gradient(circle at 30% 40%, rgba(20,83,45,.22) 5px, transparent 8px), radial-gradient(circle at 70% 60%, rgba(101,163,13,.18) 6px, transparent 10px)",
    patternSize: "120px 80px, 160px 100px" },
  robot: { name: "Robotstad", emoji: "🤖",
    bg: "#cbd5e1",
    pattern: "linear-gradient(rgba(51,65,85,.25) 1px, transparent 1px), linear-gradient(90deg, rgba(51,65,85,.25) 1px, transparent 1px)",
    patternSize: "44px 44px" },
  ducks: { name: "Eendenbad", emoji: "🦆",
    bg: "#bae6fd",
    pattern: "radial-gradient(ellipse 22px 7px at center, rgba(255,255,255,.55) 60%, transparent 65%)",
    patternSize: "100px 60px" },
  mice: { name: "Muisstad", emoji: "🐭",
    bg: "#fbcfe8",
    pattern: "radial-gradient(circle, rgba(190,24,93,.18) 3px, transparent 4px), radial-gradient(circle at 50% 50%, rgba(251,191,36,.4) 6px, transparent 9px)",
    patternSize: "44px 44px, 180px 180px" },
  music: { name: "Muziekpark", emoji: "🎵",
    bg: "#ede9fe",
    pattern: "repeating-linear-gradient(0deg, transparent 0 22px, rgba(124,58,237,.45) 22px 24px)",
    patternSize: "100% 130px" },
  space: { name: "Ruimte", emoji: "🚀",
    bg: "#1e1b4b",
    pattern: "radial-gradient(circle, white 1.4px, transparent 1.8px), radial-gradient(circle, #fde047 1.2px, transparent 1.6px)",
    patternSize: "140px 90px, 220px 170px" },
  candy: { name: "Snoepland", emoji: "🍬",
    bg: "#fce7f3",
    pattern: "repeating-linear-gradient(45deg, rgba(236,72,153,.18) 0 10px, transparent 10px 28px), repeating-linear-gradient(-45deg, rgba(251,191,36,.15) 0 10px, transparent 10px 28px)",
    patternSize: "auto" },
  ocean: { name: "Onderzee", emoji: "🌊",
    bg: "#7dd3fc",
    pattern: "radial-gradient(ellipse 36px 11px at center, rgba(255,255,255,.35) 50%, transparent 60%)",
    patternSize: "100px 38px" },
  jungle: { name: "Jungle", emoji: "🌴",
    bg: "#86efac",
    pattern: "radial-gradient(circle at 30% 30%, rgba(20,83,45,.22) 7px, transparent 11px), radial-gradient(circle at 70% 70%, rgba(20,83,45,.16) 4px, transparent 7px)",
    patternSize: "110px 90px, 80px 100px" },
  farm: { name: "Boerderij", emoji: "🚜",
    bg: "#fef3c7",
    pattern: "repeating-linear-gradient(0deg, transparent 0 30px, rgba(180,83,9,.18) 30px 33px), repeating-linear-gradient(90deg, transparent 0 30px, rgba(180,83,9,.12) 30px 33px)",
    patternSize: "auto" },
  ice: { name: "IJswereld", emoji: "❄️",
    bg: "#e0f2fe",
    pattern: "radial-gradient(circle at 50% 50%, rgba(255,255,255,.7) 4px, transparent 6px), radial-gradient(circle at 30% 70%, rgba(56,189,248,.3) 3px, transparent 5px)",
    patternSize: "70px 70px, 100px 100px" }
};

export const DECORATIONS = {
  dino: [
    { count: 10, w: 120, h: 160, fx: '', svg: `<svg viewBox="0 0 120 160" xmlns="http://www.w3.org/2000/svg"><rect x="52" y="70" width="16" height="80" fill="#78350f"/><path d="M 60 70 Q 20 60, 8 30 Q 36 50, 60 55 Q 84 50, 112 30 Q 100 60, 60 70 Q 30 80, 8 100 Q 30 70, 60 70 Q 90 70, 112 100 Q 90 80, 60 70" fill="#16a34a"/><circle cx="48" cy="34" r="6" fill="#86efac"/><circle cx="68" cy="42" r="5" fill="#86efac"/></svg>` },
    { count: 18, w: 56, h: 56, fx: 'drifty', svg: `<svg viewBox="0 0 56 56" xmlns="http://www.w3.org/2000/svg"><path d="M 28 52 L 28 6" stroke="#15803d" stroke-width="2"/><path d="M 28 12 Q 10 14, 4 24 M 28 22 Q 12 24, 7 34 M 28 32 Q 14 34, 10 42" stroke="#22c55e" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M 28 12 Q 46 14, 52 24 M 28 22 Q 44 24, 49 34 M 28 32 Q 42 34, 46 42" stroke="#22c55e" stroke-width="3" fill="none" stroke-linecap="round"/></svg>` },
    { count: 8, w: 80, h: 50, fx: '', svg: `<svg viewBox="0 0 80 50" xmlns="http://www.w3.org/2000/svg"><ellipse cx="40" cy="32" rx="30" ry="14" fill="rgba(20,83,45,.35)"/><ellipse cx="20" cy="20" rx="5" ry="3" fill="rgba(20,83,45,.5)"/><ellipse cx="58" cy="18" rx="5" ry="3" fill="rgba(20,83,45,.5)"/></svg>` }
  ],
  robot: [
    { count: 14, w: 60, h: 60, fx: '', svg: `<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><polygon points="30,5 50,15 50,45 30,55 10,45 10,15" fill="#94a3b8" stroke="#475569" stroke-width="2"/><circle cx="30" cy="30" r="10" fill="#475569"/></svg>` },
    { count: 9, w: 120, h: 60, fx: '', svg: `<svg viewBox="0 0 120 60" xmlns="http://www.w3.org/2000/svg"><path d="M 5 30 H 30 L 40 15 H 70 L 80 45 H 115" stroke="#475569" stroke-width="3" fill="none" stroke-linejoin="round"/><circle cx="5" cy="30" r="4" fill="#475569"/><circle cx="115" cy="45" r="4" fill="#475569"/><circle cx="40" cy="15" r="3" fill="#fbbf24"/><circle cx="70" cy="15" r="3" fill="#22c55e"/><circle cx="80" cy="45" r="3" fill="#ef4444"/></svg>` }
  ],
  ducks: [
    { count: 14, w: 80, h: 60, fx: 'drifty', svg: `<svg viewBox="0 0 80 60" xmlns="http://www.w3.org/2000/svg"><ellipse cx="44" cy="40" rx="28" ry="14" fill="#fbbf24" stroke="#a16207" stroke-width="2"/><circle cx="22" cy="26" r="13" fill="#fbbf24" stroke="#a16207" stroke-width="2"/><path d="M 11 26 L 2 28 L 11 31 Z" fill="#f97316" stroke="#7c2d12" stroke-width="1.5"/><circle cx="20" cy="22" r="2" fill="#1a1a1a"/><circle cx="60" cy="32" r="3" fill="#fde68a"/></svg>` },
    { count: 24, w: 40, h: 22, fx: '', svg: `<svg viewBox="0 0 40 22" xmlns="http://www.w3.org/2000/svg"><ellipse cx="20" cy="11" rx="18" ry="5" fill="none" stroke="rgba(255,255,255,.7)" stroke-width="1.5"/><ellipse cx="20" cy="11" rx="11" ry="3" fill="none" stroke="rgba(255,255,255,.5)" stroke-width="1"/></svg>` }
  ],
  mice: [
    { count: 12, w: 60, h: 60, fx: '', svg: `<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><path d="M 5 55 Q 5 15, 30 15 Q 55 15, 55 55 Z" fill="#1a1a1a"/><rect x="3" y="54" width="54" height="4" fill="#78350f"/><circle cx="22" cy="40" r="2" fill="#fff" opacity=".4"/></svg>` },
    { count: 18, w: 36, h: 30, fx: '', svg: `<svg viewBox="0 0 36 30" xmlns="http://www.w3.org/2000/svg"><polygon points="5,22 30,22 26,8" fill="#fbbf24" stroke="#a16207" stroke-width="1.5"/><circle cx="15" cy="17" r="2.5" fill="#a16207"/><circle cx="22" cy="14" r="1.8" fill="#a16207"/></svg>` }
  ],
  music: [
    { count: 22, w: 36, h: 60, fx: 'drifty', svg: `<svg viewBox="0 0 36 60" xmlns="http://www.w3.org/2000/svg"><ellipse cx="11" cy="50" rx="9" ry="6.5" transform="rotate(-25 11 50)" fill="#7c3aed"/><rect x="19" y="10" width="3" height="42" fill="#7c3aed"/><path d="M 22 10 Q 34 14, 30 28" fill="none" stroke="#7c3aed" stroke-width="3"/></svg>` },
    { count: 10, w: 44, h: 70, fx: '', svg: `<svg viewBox="0 0 44 70" xmlns="http://www.w3.org/2000/svg"><path d="M 22 60 Q 12 60, 12 48 Q 12 36, 22 36 Q 32 36, 32 26 Q 32 14, 20 14 Q 8 14, 12 32 Q 18 50, 26 64" fill="none" stroke="#7c3aed" stroke-width="3.5" stroke-linecap="round"/></svg>` }
  ],
  space: [
    { count: 10, w: 80, h: 80, fx: '', svg: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><circle cx="40" cy="40" r="26" fill="#a78bfa"/><ellipse cx="40" cy="40" rx="38" ry="8" fill="none" stroke="#fde047" stroke-width="2.5"/><circle cx="30" cy="32" r="5" fill="#7c3aed" opacity=".7"/><circle cx="50" cy="48" r="3" fill="#7c3aed" opacity=".7"/></svg>` },
    { count: 50, w: 18, h: 18, fx: 'twinkle', svg: `<svg viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg"><polygon points="9,1 11,7 17,7 12,11 14,17 9,13 4,17 6,11 1,7 7,7" fill="#fde047"/></svg>` },
    { count: 6, w: 50, h: 50, fx: '', svg: `<svg viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg"><circle cx="25" cy="25" r="20" fill="#fbbf24"/><circle cx="18" cy="20" r="4" fill="#a16207"/><circle cx="32" cy="28" r="3" fill="#a16207"/></svg>` }
  ],
  candy: [
    { count: 12, w: 36, h: 90, fx: '', svg: `<svg viewBox="0 0 36 90" xmlns="http://www.w3.org/2000/svg"><circle cx="18" cy="18" r="15" fill="#ec4899" stroke="#9d174d" stroke-width="2"/><path d="M 18 5 Q 8 12, 10 22" fill="#fbcfe8" opacity=".7"/><rect x="16" y="28" width="4" height="58" fill="#fff" stroke="#1a1a1a" stroke-width="1.5"/></svg>` },
    { count: 14, w: 48, h: 60, fx: '', svg: `<svg viewBox="0 0 48 60" xmlns="http://www.w3.org/2000/svg"><path d="M 24 55 V 22 Q 24 8, 36 8 Q 46 8, 46 18" stroke="#ef4444" stroke-width="10" fill="none" stroke-linecap="round"/><path d="M 24 55 V 22 Q 24 8, 36 8 Q 46 8, 46 18" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round" stroke-dasharray="7 7"/></svg>` }
  ],
  ocean: [
    { count: 18, w: 36, h: 80, fx: 'drifty', svg: `<svg viewBox="0 0 36 80" xmlns="http://www.w3.org/2000/svg"><path d="M 18 80 Q 6 60, 18 40 Q 30 20, 18 0" stroke="#16a34a" stroke-width="7" fill="none" stroke-linecap="round"/><path d="M 18 80 Q 6 60, 18 40 Q 30 20, 18 0" stroke="#22c55e" stroke-width="3" fill="none" stroke-linecap="round"/></svg>` },
    { count: 28, w: 24, h: 24, fx: 'drifty', svg: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="8" fill="none" stroke="rgba(255,255,255,.8)" stroke-width="1.5"/><circle cx="10" cy="10" r="2.5" fill="rgba(255,255,255,.6)"/></svg>` },
    { count: 6, w: 70, h: 40, fx: '', svg: `<svg viewBox="0 0 70 40" xmlns="http://www.w3.org/2000/svg"><path d="M 5 20 Q 20 5, 40 20 Q 55 35, 65 20 L 60 30 L 65 20 L 60 10 Z" fill="#fb923c" stroke="#7c2d12" stroke-width="2"/><circle cx="22" cy="18" r="2.5" fill="#1a1a1a"/></svg>` }
  ],
  jungle: [
    { count: 12, w: 70, h: 130, fx: 'drifty', svg: `<svg viewBox="0 0 70 130" xmlns="http://www.w3.org/2000/svg"><path d="M 35 0 Q 22 25, 35 50 Q 48 75, 35 100 Q 22 120, 35 130" stroke="#15803d" stroke-width="4" fill="none"/><ellipse cx="20" cy="30" rx="12" ry="6" transform="rotate(-30 20 30)" fill="#22c55e"/><ellipse cx="50" cy="60" rx="12" ry="6" transform="rotate(30 50 60)" fill="#22c55e"/><ellipse cx="22" cy="90" rx="12" ry="6" transform="rotate(-20 22 90)" fill="#22c55e"/></svg>` },
    { count: 10, w: 64, h: 50, fx: '', svg: `<svg viewBox="0 0 64 50" xmlns="http://www.w3.org/2000/svg"><path d="M 32 45 Q 6 30, 6 14 Q 18 2, 32 7 Q 46 2, 58 14 Q 58 30, 32 45" fill="#16a34a" stroke="#15803d" stroke-width="2.5"/><path d="M 32 45 V 7" stroke="#15803d" stroke-width="2.5"/></svg>` }
  ],
  farm: [
    { count: 8, w: 100, h: 60, fx: '', svg: `<svg viewBox="0 0 100 60" xmlns="http://www.w3.org/2000/svg"><rect x="6" y="18" width="88" height="36" rx="8" fill="#fbbf24" stroke="#a16207" stroke-width="2.5"/><path d="M 6 24 H 94 M 6 34 H 94 M 6 44 H 94" stroke="#a16207" stroke-width="1.5"/></svg>` },
    { count: 14, w: 36, h: 70, fx: '', svg: `<svg viewBox="0 0 36 70" xmlns="http://www.w3.org/2000/svg"><rect x="13" y="12" width="10" height="58" fill="#78350f" stroke="#451a03" stroke-width="2"/><polygon points="13,12 23,12 18,4" fill="#451a03"/><rect x="0" y="30" width="36" height="5" fill="#78350f" stroke="#451a03" stroke-width="1.5"/><rect x="0" y="50" width="36" height="5" fill="#78350f" stroke="#451a03" stroke-width="1.5"/></svg>` }
  ],
  ice: [
    { count: 30, w: 36, h: 36, fx: 'twinkle', svg: `<svg viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg"><g stroke="#fff" stroke-width="2" stroke-linecap="round" fill="none"><line x1="18" y1="3" x2="18" y2="33"/><line x1="3" y1="18" x2="33" y2="18"/><line x1="7.5" y1="7.5" x2="28.5" y2="28.5"/><line x1="28.5" y1="7.5" x2="7.5" y2="28.5"/></g></svg>` },
    { count: 12, w: 36, h: 60, fx: '', svg: `<svg viewBox="0 0 36 60" xmlns="http://www.w3.org/2000/svg"><path d="M 6 0 L 18 60 L 30 0 Z" fill="#bae6fd" stroke="#0284c7" stroke-width="2"/><path d="M 14 6 L 18 36" stroke="#fff" stroke-width="2" opacity=".7"/></svg>` }
  ],
  workshop: [
    { count: 14, w: 60, h: 60, fx: '', svg: `<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><circle cx="30" cy="30" r="22" fill="none" stroke="rgba(120,90,40,.25)" stroke-width="3" stroke-dasharray="6 6"/><circle cx="30" cy="30" r="6" fill="rgba(120,90,40,.25)"/></svg>` }
  ]
};

export function applyTheme(key) {
  const t = THEMES[key] || THEMES.workshop;
  world.style.backgroundColor = t.bg;
  world.style.backgroundImage = t.pattern;
  world.style.backgroundSize = t.patternSize || 'auto';
  document.body.dataset.theme = key;
  try { localStorage.setItem(STORE_THEME, key); } catch (_) {}
  world.querySelectorAll('.deco').forEach(el => el.remove());
  const decos = DECORATIONS[key];
  if (decos) {
    const firstPart = world.querySelector('.part');
    decos.forEach(d => {
      for (let i = 0; i < d.count; i++) {
        const el = document.createElement('div');
        el.className = 'deco' + (d.fx ? ' ' + d.fx : '');
        el.innerHTML = d.svg;
        el.style.left   = Math.floor(Math.random() * (WORLD_W - d.w)) + 'px';
        el.style.top    = Math.floor(Math.random() * (WORLD_H - d.h)) + 'px';
        el.style.width  = d.w + 'px';
        el.style.height = d.h + 'px';
        el.style.animationDelay = (Math.random() * 4).toFixed(2) + 's';
        world.insertBefore(el, firstPart || null);
      }
    });
  }
}

export function showMapSelect(allowClose) {
  const mapBackdrop = document.getElementById('mapBackdrop');
  const mapGrid = document.getElementById('mapGrid');
  const mapClose = document.getElementById('mapClose');
  mapGrid.innerHTML = '';
  for (const [key, t] of Object.entries(THEMES)) {
    const card = document.createElement('div');
    card.className = 'map-card';
    card.innerHTML =
      `<span class="emoji">${t.emoji}</span>${t.name}` +
      `<span class="swatch" style="background:${t.bg}"></span>`;
    card.addEventListener('click', () => {
      applyTheme(key);
      mapBackdrop.hidden = true;
    });
    mapGrid.appendChild(card);
  }
  mapClose.hidden = !allowClose;
  mapBackdrop.hidden = false;
}

export function initMapSelect() {
  document.getElementById('mapClose').addEventListener('click', () => {
    document.getElementById('mapBackdrop').hidden = true;
  });
  document.getElementById('mapBtn').addEventListener('click', () => showMapSelect(true));
}
