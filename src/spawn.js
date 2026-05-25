import { S, shop, world, WORLD_W, WORLD_H, countEl } from './state.js';
import { PARTS } from './parts.js';
import { saveAndPush } from './persistence.js';

export function updateCount() {
  const n = shop.querySelectorAll(".part").length;
  countEl.textContent = n + (n === 1 ? " onderdeel" : " onderdelen");
  shop.classList.toggle("has-parts", n > 0);
}

export function positionLocal(el, localX, localY) {
  const w = 90, h = 90;
  const cx = Math.max(0, Math.min(WORLD_W - w, localX));
  const cy = Math.max(0, Math.min(WORLD_H - h, localY));
  el.style.left = cx + "px";
  el.style.top  = cy + "px";
}

export function spawnPartLocal(kind, localX, localY, opts = {}) {
  const p = PARTS[kind];
  const el = document.createElement("div");
  const id = S.nextId++;
  el.className = "part " + (p.anim || "");
  el.dataset.kind = kind;
  el.dataset.id = id;
  el.innerHTML = p.svg + `<div class="del" title="remove">×</div>`;

  if (p.custom === "brio") {
    const train = document.createElement("div");
    train.style.cssText = `
      position:absolute; left:0; top:0; width:16px; height:12px;
      background:#dc2626; border:2px solid #2a2118; border-radius:3px;
      offset-path: path('M 8 60 Q 45 5, 80 60');
      animation: none; opacity: 0;`;
    train.dataset.train = "1";
    el.appendChild(train);
  }

  positionLocal(el, localX, localY);
  world.appendChild(el);
  attachPartHandlers(el);
  updateCount();
  if (!opts.silent) saveAndPush();
  return el;
}

export function spawnPartFromClient(kind, clientX, clientY) {
  const wr = world.getBoundingClientRect();
  spawnPartLocal(kind, (clientX - wr.left) / S.worldScale - 45, (clientY - wr.top) / S.worldScale - 45);
}

export function spawnInShopRandom(kind) {
  const sr = shop.getBoundingClientRect();
  const vx0 = -S.worldX / S.worldScale;
  const vy0 = -S.worldY / S.worldScale;
  const vw  = sr.width  / S.worldScale;
  const vh  = sr.height / S.worldScale;
  const localX = vx0 + vw * (0.25 + Math.random() * 0.5) - 45;
  const localY = vy0 + vh * (0.25 + Math.random() * 0.5) - 45;
  spawnPartLocal(kind, localX, localY);
}

export function deletePart(el) {
  el.remove();
  updateCount();
  saveAndPush();
}

export function attachPartHandlers(el) {
  el.addEventListener("pointerdown", (e) => {
    if (e.target.classList.contains("del")) {
      if (document.body.classList.contains("running")) return;
      deletePart(el);
      return;
    }
    if (document.body.classList.contains("running")) return;
    S.dragging = el;
    el.classList.add("dragging");
    const r = el.getBoundingClientRect();
    S.dragOffset = { x: e.clientX - r.left - 45, y: e.clientY - r.top - 45 };
    el.setPointerCapture(e.pointerId);
    e.preventDefault();
  });
  el.addEventListener("pointermove", (e) => {
    if (S.dragging === el) {
      const wr = world.getBoundingClientRect();
      positionLocal(el,
        (e.clientX - wr.left) / S.worldScale - S.dragOffset.x - 45,
        (e.clientY - wr.top)  / S.worldScale - S.dragOffset.y - 45);
    }
  });
  const release = () => {
    if (S.dragging === el) {
      el.classList.remove("dragging");
      S.dragging = null;
      saveAndPush();
    }
  };
  el.addEventListener("pointerup", release);
  el.addEventListener("pointercancel", release);
}

// Hook up the bin-item drag/tap behavior.
export function attachBinItemHandlers() {
  document.querySelectorAll(".bin-item").forEach(item => {
    let didDrag = false;
    let startX = 0, startY = 0;
    item.addEventListener("pointerdown", (e) => {
      if (document.body.classList.contains("running")) return;
      didDrag = false;
      startX = e.clientX; startY = e.clientY;
      const kind = item.dataset.kind;
      e.preventDefault();

      const ghost = document.createElement("div");
      ghost.className = "part";
      ghost.style.cssText = `position:fixed; pointer-events:none; left:${e.clientX-45}px; top:${e.clientY-45}px; opacity:0; z-index:9999;`;
      ghost.innerHTML = PARTS[kind].svg;
      document.body.appendChild(ghost);

      const move = (ev) => {
        const dx = ev.clientX - startX, dy = ev.clientY - startY;
        if (!didDrag && (dx*dx + dy*dy) > 36) {
          didDrag = true;
          ghost.style.opacity = "1";
          ghost.classList.add("dragging");
        }
        ghost.style.left = (ev.clientX - 45) + "px";
        ghost.style.top  = (ev.clientY - 45) + "px";
      };
      const up = (ev) => {
        window.removeEventListener("pointermove", move);
        window.removeEventListener("pointerup", up);
        window.removeEventListener("pointercancel", up);
        ghost.remove();
        const sr = shop.getBoundingClientRect();
        const inside = ev.clientX >= sr.left && ev.clientX <= sr.right
                    && ev.clientY >= sr.top  && ev.clientY <= sr.bottom;
        if (didDrag && inside)      spawnPartFromClient(kind, ev.clientX, ev.clientY);
        else if (!didDrag)          spawnInShopRandom(kind);
      };
      window.addEventListener("pointermove", move);
      window.addEventListener("pointerup", up);
      window.addEventListener("pointercancel", up);
    });
  });
}
