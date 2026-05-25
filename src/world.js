// Panning and zoom of the world inside the shop viewport.
import { S, shop, world, WORLD_W, WORLD_H } from './state.js';

export function setWorldTransform() {
  world.style.transform = `translate(${S.worldX}px, ${S.worldY}px) scale(${S.worldScale})`;
}

export function clampWorld() {
  const sr = shop.getBoundingClientRect();
  const minX = Math.min(0, sr.width  - WORLD_W * S.worldScale);
  const minY = Math.min(0, sr.height - WORLD_H * S.worldScale);
  S.worldX = Math.min(0, Math.max(minX, S.worldX));
  S.worldY = Math.min(0, Math.max(minY, S.worldY));
}

export function zoomBy(factor) {
  const sr = shop.getBoundingClientRect();
  const cx = sr.width / 2, cy = sr.height / 2;
  const wcX = (cx - S.worldX) / S.worldScale;
  const wcY = (cy - S.worldY) / S.worldScale;
  S.worldScale = Math.max(0.4, Math.min(1.8, S.worldScale * factor));
  S.worldX = cx - wcX * S.worldScale;
  S.worldY = cy - wcY * S.worldScale;
  clampWorld();
  setWorldTransform();
}

export function panBy(dx, dy) {
  S.worldX += dx; S.worldY += dy;
  clampWorld(); setWorldTransform();
}

export function centerWorld() {
  const sr = shop.getBoundingClientRect();
  S.worldX = Math.min(0, (sr.width  - WORLD_W * S.worldScale) / 2);
  S.worldY = Math.min(0, (sr.height - WORLD_H * S.worldScale) / 2);
  clampWorld(); setWorldTransform();
}

// drag-to-pan
export function initPan(onPointerDown) {
  let active = false, startX = 0, startY = 0, startWX = 0, startWY = 0, pid = null;
  shop.addEventListener("pointerdown", (e) => {
    if (onPointerDown) onPointerDown(e);
    if (e.target.closest(".part")) return;
    if (e.target.closest(".shop-btn")) return;
    active = true;
    pid = e.pointerId;
    startX = e.clientX; startY = e.clientY;
    startWX = S.worldX; startWY = S.worldY;
    shop.classList.add("panning");
    try { shop.setPointerCapture(e.pointerId); } catch (_) {}
  });
  shop.addEventListener("pointermove", (e) => {
    if (!active || e.pointerId !== pid) return;
    S.worldX = startWX + (e.clientX - startX);
    S.worldY = startWY + (e.clientY - startY);
    clampWorld(); setWorldTransform();
  });
  const end = (e) => {
    if (!active) return;
    if (e && e.pointerId !== pid) return;
    active = false; pid = null;
    shop.classList.remove("panning");
  };
  shop.addEventListener("pointerup", end);
  shop.addEventListener("pointercancel", end);
  window.addEventListener("resize", () => { clampWorld(); setWorldTransform(); });
}
