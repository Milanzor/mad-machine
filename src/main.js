// Entry point — wires up everything once the DOM is ready.
import { S, shop, STORE_THEME, refreshWorldSize } from './state.js';
import { buildBinGrid } from './parts.js';
import { attachBinItemHandlers } from './spawn.js';
import { loadInitial } from './persistence.js';
import { THEMES, applyTheme, showMapSelect, initMapSelect } from './themes.js';
import { initUI } from './ui.js';
import { initUpdateCheck } from './update-check.js';

// iOS: block double-tap-zoom only (pinch-zoom stays enabled).
let lastTouchEnd = 0;
document.addEventListener('touchend', (e) => {
  const now = Date.now();
  if (now - lastTouchEnd <= 350) e.preventDefault();
  lastTouchEnd = now;
}, { passive: false });
document.addEventListener('dblclick', (e) => e.preventDefault());

// Resume audio on first interaction (browsers gate autoplay).
shop.addEventListener("pointerdown", () => {
  if (S.audioCtx && S.audioCtx.state === "suspended") S.audioCtx.resume();
});

// Keep WORLD_W/H in sync if the viewport changes (rotation, resize).
window.addEventListener("resize", refreshWorldSize);

// Build the bin and wire up handlers.
buildBinGrid();
attachBinItemHandlers();
initMapSelect();
initUI();
initUpdateCheck();

// Theme: load saved or prompt for one.
const saved = (() => { try { return localStorage.getItem(STORE_THEME); } catch (_) { return null; }})();
if (saved && THEMES[saved]) {
  applyTheme(saved);
} else {
  applyTheme('workshop');
  showMapSelect(false);
}

loadInitial();
