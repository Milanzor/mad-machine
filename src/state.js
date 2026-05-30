// Shared mutable state and constants.
// Other modules read/write via the `S` object so changes are visible everywhere.

// World fills the shop viewport — no panning.
// We render the world at WORLD_SCALE so the logical canvas is larger than
// the visible shop ("zoomed out" — more room for parts at the same screen size).
export const WORLD_SCALE = 0.8;

const _shopEl  = document.getElementById("shop");
const _worldEl = document.getElementById("world");

export let WORLD_W = Math.round((_shopEl.clientWidth  || 1024) / WORLD_SCALE);
export let WORLD_H = Math.round((_shopEl.clientHeight || 600)  / WORLD_SCALE);

export function refreshWorldSize() {
  const sw = _shopEl.clientWidth  || (WORLD_W * WORLD_SCALE);
  const sh = _shopEl.clientHeight || (WORLD_H * WORLD_SCALE);
  WORLD_W = Math.round(sw / WORLD_SCALE);
  WORLD_H = Math.round(sh / WORLD_SCALE);
  _worldEl.style.width  = WORLD_W + "px";
  _worldEl.style.height = WORLD_H + "px";
  _worldEl.style.transform = `scale(${WORLD_SCALE})`;
  _worldEl.style.transformOrigin = "0 0";
}
refreshWorldSize();

export const EMPOWER_MS = 15000;
export const PART_RADIUS = 42;
export const MARBLE_RADIUS = 30;
export const FIREBALL_RADIUS = 14;
export const GRAVITY = 0.5;
export const FRICTION = 0.995;

export const STORE_CURRENT = "machinegame:current";
export const STORE_HISTORY = "machinegame:history";
export const STORE_THEME   = "machinegame:theme";

// DOM refs (resolved at module load — type="module" defers until after parse)
export const shop        = _shopEl;
export const world       = _worldEl;
export const binGrid     = document.getElementById("binGrid");
export const countEl     = document.getElementById("count");
export const machineName = document.getElementById("machineName");

// Critter state maps
export const volcanoNext = new Map();
export const robotState  = new Map();
export const rocketState = new Map();
export const mouseState  = new Map();
export const eggState    = new Map();
export const dinoState   = new Map();
export const HIT_COOLDOWN = {};

// Bundle mutable state in one object so other modules can mutate it.
export const S = {
  worldX: 0,
  worldY: 0,
  worldScale: WORLD_SCALE,
  nextId: 1,
  dragging: null,
  dragOffset: { x: 0, y: 0 },
  marbles: [],
  fireballs: [],
  physicsHandle: null,
  lastFrame: 0,
  runtimeBackup: null,
  runInterval: null,
  soundOn: true,
  audioCtx: null,
  history: [],
  lastSnapJson: "",
  weather: "sunny",
  weatherGravity: 1,
  weatherWind: 0,
  weatherDrag: 1,
  weatherTimer: null,
  weatherSoundAt: 0,
  meteors: [],
  meteorNext: 0,
  meteorStormUntil: 0,
  meteorSpawnAt: 0
};
