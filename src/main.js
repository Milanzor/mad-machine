// Entry point — wires up everything once the DOM is ready.
import { S, shop, WORLD_W, WORLD_H, STORE_THEME } from './state.js';
import { buildBinGrid } from './parts.js';
import { ac } from './audio.js';
import { setWorldTransform, clampWorld, initPan, centerWorld } from './world.js';
import { attachBinItemHandlers } from './spawn.js';
import { loadInitial } from './persistence.js';
import { THEMES, applyTheme, showMapSelect, initMapSelect } from './themes.js';
import { initUI } from './ui.js';

// Build the bin and wire up handlers.
buildBinGrid();
attachBinItemHandlers();
initPan(() => { if (S.audioCtx && S.audioCtx.state === "suspended") S.audioCtx.resume(); });
initMapSelect();
initUI();

// Initial transform.
setWorldTransform();

// Theme: load saved or prompt for one.
const saved = (() => { try { return localStorage.getItem(STORE_THEME); } catch (_) { return null; }})();
if (saved && THEMES[saved]) {
  applyTheme(saved);
} else {
  applyTheme('workshop');
  showMapSelect(false);
}

loadInitial();

// Center world after layout settles.
requestAnimationFrame(() => {
  centerWorld();
});
