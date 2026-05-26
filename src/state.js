// Shared mutable state and constants.
// Other modules read/write via the `S` object so changes are visible everywhere.

// World fills the shop viewport — no panning/zooming.
const _shopEl = document.getElementById("shop");
export let WORLD_W = _shopEl.clientWidth  || 1024;
export let WORLD_H = _shopEl.clientHeight || 600;
export function refreshWorldSize() {
  WORLD_W = _shopEl.clientWidth  || WORLD_W;
  WORLD_H = _shopEl.clientHeight || WORLD_H;
}
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
export const shop        = document.getElementById("shop");
export const world       = document.getElementById("world");
export const binGrid     = document.getElementById("binGrid");
export const countEl     = document.getElementById("count");
export const machineName = document.getElementById("machineName");

// Critter state maps
export const volcanoNext = new Map();
export const robotState  = new Map();
export const mouseState  = new Map();
export const eggState    = new Map();
export const dinoState   = new Map();
export const HIT_COOLDOWN = {};

// Bundle mutable state in one object so other modules can mutate it.
export const S = {
  worldX: 0,
  worldY: 0,
  worldScale: 1,
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
  lastSnapJson: ""
};
