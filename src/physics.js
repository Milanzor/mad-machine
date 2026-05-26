// Main physics loop + critter AI. Order of operations each frame:
//   volcano → eggs → dinos → mice → mouse-cheese → robots → mouse-robot → marbles → fireballs
import {
  S, shop, world, WORLD_W, WORLD_H, EMPOWER_MS,
  PART_RADIUS, MARBLE_RADIUS, FIREBALL_RADIUS, GRAVITY, FRICTION,
  volcanoNext, robotState, mouseState, eggState, dinoState
} from './state.js';
import { PARTS } from './parts.js';
import { VOICES } from './audio.js';
import { particleBurst, hitPart } from './effects.js';
import { spawnPartLocal } from './spawn.js';

export function startPhysics() {
  S.marbles.length = 0;
  S.fireballs.length = 0;
  volcanoNext.clear();
  robotState.clear();
  mouseState.clear();
  eggState.clear();
  dinoState.clear();
  shop.querySelectorAll('.part.empowered').forEach(el => el.classList.remove('empowered'));
  shop.querySelectorAll('.part.hatching').forEach(el => el.classList.remove('hatching'));

  shop.querySelectorAll('.part[data-kind="marble"]').forEach(el => {
    const x = parseFloat(el.style.left), y = parseFloat(el.style.top);
    S.marbles.push({
      el, x, y,
      vx: (Math.random() - 0.5) * 3,
      vy: (Math.random() - 0.5) * 2,
      origX: x, origY: y
    });
  });

  const hasVolcano = !!shop.querySelector('.part[data-kind="volcano"]');
  const hasRobot   = !!shop.querySelector('.part[data-kind="robot"]');
  const hasMouse   = !!shop.querySelector('.part[data-kind="mouse"]');
  const hasEgg     = !!shop.querySelector('.part[data-kind="dinoEgg"], .part[data-kind="tRexEgg"]');
  const hasDino    = !!shop.querySelector('.part[data-kind="dino"], .part[data-kind="tRex"]');
  if (!S.marbles.length && !hasVolcano && !hasRobot && !hasMouse && !hasEgg && !hasDino) return;

  S.lastFrame = performance.now();
  S.physicsHandle = requestAnimationFrame(physicsLoop);
}

export function stopPhysics() {
  if (S.physicsHandle) cancelAnimationFrame(S.physicsHandle);
  S.physicsHandle = null;
  S.marbles.length = 0;
  S.fireballs.forEach(f => f.el.remove());
  S.fireballs.length = 0;
  volcanoNext.clear();
  robotState.clear();
  mouseState.clear();
  eggState.clear();
  dinoState.clear();
  shop.querySelectorAll('.part[data-grabbed]').forEach(el => delete el.dataset.grabbed);
  shop.querySelectorAll('.part.empowered').forEach(el => el.classList.remove('empowered'));
  shop.querySelectorAll('.part.hatching').forEach(el => el.classList.remove('hatching'));
}

function explodeMarble(m, colors) {
  particleBurst(m.x + 45, m.y + 45, colors || ['#dc2626','#fbbf24']);
  if (m.el) {
    m.el.animate(
      [{ transform: 'scale(1)', opacity: 1 }, { transform: 'scale(0.2)', opacity: 0 }],
      { duration: 220, easing: 'ease-out' }
    ).onfinish = () => m.el.remove();
  }
}

function destroyByFireLocal(el) {
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

function eruptVolcano(v) {
  const n = 3 + Math.floor(Math.random() * 3);
  const cx = v.cx, cy = v.cy - 22;
  for (let i = 0; i < n; i++) {
    const el = document.createElement('div');
    el.className = 'fireball';
    el.style.left = cx + 'px';
    el.style.top  = cy + 'px';
    world.appendChild(el);
    S.fireballs.push({
      el, x: cx, y: cy,
      vx: (Math.random() - 0.5) * 8,
      vy: -9 - Math.random() * 4,
      life: 200
    });
  }
  v.el.animate(
    [{ transform: 'translate(0,0)' }, { transform: 'translate(-4px,2px)' }, { transform: 'translate(4px,-2px)' }, { transform: 'translate(0,0)' }],
    { duration: 200 }
  );
  VOICES.boom(0);
}

function physicsLoop(now) {
  const dt = Math.min(2, (now - S.lastFrame) / 16);
  S.lastFrame = now;
  const W = WORLD_W, H = WORLD_H;

  const partEls = [...shop.querySelectorAll('.part:not([data-kind="marble"])')];
  const obstacles = partEls.map(el => {
    const x = parseFloat(el.style.left) || 0;
    const y = parseFloat(el.style.top)  || 0;
    return {
      el, kind: el.dataset.kind,
      cx: x + 45, cy: y + 45,
      def: PARTS[el.dataset.kind]
    };
  });

  // --- Volcano eruptions ---
  obstacles.filter(o => o.def.erupts).forEach(v => {
    const id = v.el.dataset.id;
    const next = volcanoNext.get(id);
    if (next == null) {
      volcanoNext.set(id, now + 800 + Math.random() * 1200);
    } else if (now >= next) {
      eruptVolcano(v);
      volcanoNext.set(id, now + 2200 + Math.random() * 1800);
    }
  });

  // --- Dino eggs: hatch on a timer ---
  const eggEls = [...shop.querySelectorAll('.part[data-kind="dinoEgg"], .part[data-kind="tRexEgg"]')];
  eggEls.forEach(el => {
    const id = el.dataset.id;
    const def = PARTS[el.dataset.kind];
    let es = eggState.get(id);
    if (!es) {
      es = { hatchAt: now + 6000 + Math.random() * 10000 };
      eggState.set(id, es);
    }
    if (!el.classList.contains('hatching') && now > es.hatchAt - 2000) {
      el.classList.add('hatching');
    }
    if (now >= es.hatchAt) {
      const x = parseFloat(el.style.left) || 0;
      const y = parseFloat(el.style.top)  || 0;
      const burstColors = def.hatches === 'tRex'
        ? ['#fca5a5','#ef4444','#7f1d1d','#fff']
        : ['#fde047','#fbbf24','#22c55e','#fff'];
      particleBurst(x + 45, y + 45, burstColors);
      VOICES.boom(0);
      VOICES.squeak(0.12);
      el.animate(
        [{ transform: 'scale(1) rotate(0)', opacity: 1 },
         { transform: 'scale(1.4) rotate(120deg)', opacity: 0 }],
        { duration: 320, easing: 'ease-out' }
      ).onfinish = () => el.remove();
      eggState.delete(id);
      const dino = spawnPartLocal(def.hatches, x, y, { silent: true });
      dino.classList.add('active');
    }
  });

  // --- Dinosaurs: stomp around and eat everything ---
  const dinoEls = [...shop.querySelectorAll('.part[data-kind="dino"], .part[data-kind="tRex"]')];
  dinoEls.forEach(el => {
    const id = el.dataset.id;
    const def = PARTS[el.dataset.kind];
    const speed = def.speed || 1.7;
    const range = def.range || 70;
    let ds = dinoState.get(id);
    if (!ds) {
      ds = { vx: 0, vy: 0, dirTimer: 0 };
      dinoState.set(id, ds);
    }
    const dx = parseFloat(el.style.left) || 0;
    const dy = parseFloat(el.style.top)  || 0;
    const dcx = dx + 45, dcy = dy + 45;

    const prey = [...shop.querySelectorAll('.part')].filter(p =>
      p !== el && p.isConnected && PARTS[p.dataset.kind] && !PARTS[p.dataset.kind].dino
    );

    let target = null;
    if (prey.length) {
      let bestD = Infinity;
      prey.forEach(p => {
        const px = (parseFloat(p.style.left) || 0) + 45;
        const py = (parseFloat(p.style.top)  || 0) + 45;
        const d = Math.hypot(px - dcx, py - dcy);
        if (d < bestD) { bestD = d; target = { el: p, x: px, y: py, d }; }
      });
    }

    if (target) {
      const dirX = target.x - dcx, dirY = target.y - dcy;
      const len = Math.hypot(dirX, dirY) || 1;
      ds.vx = (dirX / len) * speed;
      ds.vy = (dirY / len) * speed;
      if (target.d < range) {
        particleBurst(target.x, target.y, ['#16a34a','#fbbf24','#dc2626','#fff','#86efac']);
        VOICES.boom(0);
        VOICES.munch(0.05);
        target.el.animate(
          [{ transform: 'scale(1)', opacity: 1 },
           { transform: 'scale(.3) rotate(160deg)', opacity: 0 }],
          { duration: 260, easing: 'ease-out' }
        ).onfinish = () => target.el.remove();
        const tid = target.el.dataset.id;
        mouseState.delete(tid);
        robotState.delete(tid);
        eggState.delete(tid);
        const marbleIdx = S.marbles.findIndex(m => m.el === target.el);
        if (marbleIdx >= 0) S.marbles[marbleIdx]._dead = true;
      }
    } else {
      ds.dirTimer -= dt;
      if (ds.dirTimer <= 0) {
        const a = Math.random() * Math.PI * 2;
        ds.vx = Math.cos(a) * speed * 0.6;
        ds.vy = Math.sin(a) * speed * 0.6;
        ds.dirTimer = 50 + Math.random() * 80;
      }
    }

    let nx = dx + ds.vx * dt;
    let ny = dy + ds.vy * dt;
    if (nx < 0)        { nx = 0;        ds.vx = Math.abs(ds.vx);  ds.dirTimer = 0; }
    if (nx > W - 90)   { nx = W - 90;   ds.vx = -Math.abs(ds.vx); ds.dirTimer = 0; }
    if (ny < 0)        { ny = 0;        ds.vy = Math.abs(ds.vy);  ds.dirTimer = 0; }
    if (ny > H - 90)   { ny = H - 90;   ds.vy = -Math.abs(ds.vy); ds.dirTimer = 0; }
    el.style.left = nx + 'px';
    el.style.top  = ny + 'px';
  });
  const liveDinoIds = new Set(dinoEls.map(d => d.dataset.id));
  for (const id of dinoState.keys()) if (!liveDinoIds.has(id)) dinoState.delete(id);
  const liveEggIds = new Set(eggEls.map(e => e.dataset.id));
  for (const id of eggState.keys()) if (!liveEggIds.has(id)) eggState.delete(id);

  // --- Mice ---
  const mouseEls  = [...shop.querySelectorAll('.part[data-kind="mouse"]')];
  const cheeseEls = [...shop.querySelectorAll('.part[data-kind="cheese"]')];
  const robotEls  = [...shop.querySelectorAll('.part[data-kind="robot"]')];

  const liveMice = [];
  mouseEls.forEach(el => {
    const id = el.dataset.id;
    let ms = mouseState.get(id);
    if (!ms) {
      ms = { vx: 0, vy: 0, dirTimer: 0, empoweredUntil: 0 };
      mouseState.set(id, ms);
    }
    if (ms.empoweredUntil && now >= ms.empoweredUntil) {
      ms.empoweredUntil = 0;
      el.classList.remove('empowered');
      VOICES.squeak(0);
    }
    liveMice.push({ el, ms });
  });

  const isEmpowered = (mouseEl) => {
    const ms = mouseState.get(mouseEl.dataset.id);
    return ms && ms.empoweredUntil > now;
  };
  const hasEmpoweredMouse = liveMice.some(({el}) => isEmpowered(el));

  liveMice.forEach(({ el, ms }) => {
    const mx = parseFloat(el.style.left) || 0;
    const my = parseFloat(el.style.top)  || 0;
    const mcx = mx + 45, mcy = my + 45;
    const empowered = ms.empoweredUntil > now;

    const nearestOf = (arr) => arr.reduce((acc, e) => {
      const ex = (parseFloat(e.style.left) || 0) + 45;
      const ey = (parseFloat(e.style.top)  || 0) + 45;
      const d = Math.hypot(ex - mcx, ey - mcy);
      return (!acc || d < acc.d) ? { el: e, x: ex, y: ey, d } : acc;
    }, null);

    let targetX = null, targetY = null, speed = 1.8;

    if (empowered) {
      const nr = nearestOf(robotEls);
      if (nr) { targetX = nr.x; targetY = nr.y; speed = 3.2; }
    } else if (cheeseEls.length) {
      const nc = nearestOf(cheeseEls);
      if (nc) { targetX = nc.x; targetY = nc.y; speed = 2.1; }
    } else {
      const nr = nearestOf(robotEls);
      if (nr && nr.d < 220) {
        targetX = mcx + (mcx - nr.x);
        targetY = mcy + (mcy - nr.y);
        speed = 2.8;
      }
    }

    if (targetX == null) {
      ms.dirTimer -= dt;
      if (ms.dirTimer <= 0) {
        const a = Math.random() * Math.PI * 2;
        ms.vx = Math.cos(a) * 1.2;
        ms.vy = Math.sin(a) * 1.2;
        ms.dirTimer = 40 + Math.random() * 60;
      }
    } else {
      const dx = targetX - mcx, dy = targetY - mcy;
      const d = Math.hypot(dx, dy);
      if (d > 0.1) {
        ms.vx = (dx / d) * speed;
        ms.vy = (dy / d) * speed;
      }
    }

    let newX = mx + ms.vx * dt;
    let newY = my + ms.vy * dt;
    if (newX < 0)        { newX = 0;        ms.vx = Math.abs(ms.vx); ms.dirTimer = 0; }
    if (newX > W - 90)   { newX = W - 90;   ms.vx = -Math.abs(ms.vx); ms.dirTimer = 0; }
    if (newY < 0)        { newY = 0;        ms.vy = Math.abs(ms.vy); ms.dirTimer = 0; }
    if (newY > H - 90)   { newY = H - 90;   ms.vy = -Math.abs(ms.vy); ms.dirTimer = 0; }
    el.style.left = newX + 'px';
    el.style.top  = newY + 'px';
  });

  // mouse-cheese
  liveMice.forEach(({ el, ms }) => {
    if (ms.empoweredUntil > now) return;
    const mx = (parseFloat(el.style.left) || 0) + 45;
    const my = (parseFloat(el.style.top)  || 0) + 45;
    for (const ch of cheeseEls) {
      if (!ch.isConnected || ch._eaten) continue;
      const cx = (parseFloat(ch.style.left) || 0) + 45;
      const cy = (parseFloat(ch.style.top)  || 0) + 45;
      if (Math.hypot(cx - mx, cy - my) < 60) {
        ch._eaten = true;
        ms.empoweredUntil = now + EMPOWER_MS;
        el.classList.add('empowered');
        VOICES.munch(0);
        VOICES.squeak(0.18);
        particleBurst(cx, cy, ['#fbbf24','#fde047','#a16207','#fff']);
        ch.animate(
          [{ transform: 'scale(1) rotate(0)', opacity: 1 },
           { transform: 'scale(0.2) rotate(220deg)', opacity: 0 }],
          { duration: 280, easing: 'ease-out' }
        ).onfinish = () => ch.remove();
        break;
      }
    }
  });

  // --- Robots ---
  const robots = obstacles.filter(o => o.kind === 'robot');
  const activeRobotIds = new Set(robots.map(r => r.el.dataset.id));
  const ease = t => t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  robots.forEach(r => {
    const id = r.el.dataset.id;
    let s = robotState.get(id);
    if (!s) {
      s = { phase: 'idle', nextAt: now + 800 + Math.random() * 1400 };
      robotState.set(id, s);
    }

    if (hasEmpoweredMouse && s.phase !== 'fleeing') {
      if (s.targetEl) { delete s.targetEl.dataset.grabbed; s.targetEl = null; }
      s.phase = 'fleeing';
    }

    if (s.phase === 'fleeing') {
      const empMouse = liveMice.find(({el}) => isEmpowered(el));
      if (!empMouse) { s.phase = 'idle'; s.nextAt = now + 400; return; }
      const rx = parseFloat(r.el.style.left) || 0;
      const ry = parseFloat(r.el.style.top)  || 0;
      const mx = parseFloat(empMouse.el.style.left) || 0;
      const my = parseFloat(empMouse.el.style.top)  || 0;
      const dx = rx - mx, dy = ry - my;
      const d = Math.hypot(dx, dy) || 1;
      const step = 2.6 * dt;
      let nx = rx + (dx / d) * step;
      let ny = ry + (dy / d) * step;
      nx = Math.max(0, Math.min(W - 90, nx));
      ny = Math.max(0, Math.min(H - 90, ny));
      r.el.style.left = nx + 'px';
      r.el.style.top  = ny + 'px';
      return;
    }

    if (s.phase === 'idle') {
      if (now < s.nextAt) return;
      const mouseTargets = mouseEls.filter(m => !isEmpowered(m) && !m.dataset.grabbed);
      let target = null;
      let targetIsMouse = false;
      if (mouseTargets.length) {
        target = { el: mouseTargets[Math.floor(Math.random() * mouseTargets.length)] };
        target.kind = 'mouse';
        targetIsMouse = true;
      } else {
        const candidates = obstacles.filter(o =>
          o !== r &&
          o.kind !== 'robot' &&
          o.kind !== 'mouse' &&
          o.kind !== 'cheese' &&
          o.kind !== 'lava' &&
          o.kind !== 'volcano' &&
          !o.el.dataset.grabbed
        );
        if (!candidates.length) { s.nextAt = now + 700; return; }
        target = candidates[Math.floor(Math.random() * candidates.length)];
      }
      if (targetIsMouse) {
        s.targetEl = target.el;
        s.phase = 'chasing';
        VOICES.beep(0);
        return;
      }
      target.el.dataset.grabbed = id;
      const rx = parseFloat(r.el.style.left) || 0;
      const ry = parseFloat(r.el.style.top)  || 0;
      const tx = parseFloat(target.el.style.left) || 0;
      const ty = parseFloat(target.el.style.top)  || 0;
      let destX = tx;
      let destY = ty + 70;
      destX = Math.max(0, Math.min(W - 90, destX));
      destY = Math.max(0, Math.min(H - 90, destY));
      s.targetEl = target.el;
      s.startX = rx; s.startY = ry;
      s.destX = destX; s.destY = destY;
      const dist = Math.hypot(destX - rx, destY - ry);
      s.animStart = now;
      s.animDur = Math.max(400, Math.min(1400, dist * 2.5));
      s.phase = 'seeking';
      VOICES.beep(0);
    } else if (s.phase === 'chasing') {
      if (!s.targetEl || !s.targetEl.isConnected || isEmpowered(s.targetEl)) {
        s.phase = 'idle'; s.nextAt = now + 300; s.targetEl = null; return;
      }
      const rx = parseFloat(r.el.style.left) || 0;
      const ry = parseFloat(r.el.style.top)  || 0;
      const tx = parseFloat(s.targetEl.style.left) || 0;
      const ty = parseFloat(s.targetEl.style.top)  || 0;
      const dx = tx - rx, dy = ty - ry;
      const d = Math.hypot(dx, dy) || 1;
      const step = Math.min(2.4 * dt, d);
      r.el.style.left = (rx + (dx / d) * step) + 'px';
      r.el.style.top  = (ry + (dy / d) * step) + 'px';
    } else if (s.phase === 'seeking') {
      if (!s.targetEl || !s.targetEl.isConnected) {
        s.phase = 'idle'; s.nextAt = now + 600; s.targetEl = null; return;
      }
      const t = Math.min(1, (now - s.animStart) / s.animDur);
      const e = ease(t);
      r.el.style.left = (s.startX + (s.destX - s.startX) * e) + 'px';
      r.el.style.top  = (s.startY + (s.destY - s.startY) * e) + 'px';
      if (t >= 1) {
        hitPart(s.targetEl, true);
        hitPart(r.el, true);
        const tx = parseFloat(s.targetEl.style.left) || 0;
        const ty = parseFloat(s.targetEl.style.top)  || 0;
        s.targetStartOX = tx - s.destX;
        s.targetStartOY = ty - s.destY;
        let dx, dy, tries = 0;
        do {
          dx = Math.random() * Math.max(1, W - 90);
          dy = Math.random() * Math.max(1, H - 90);
          tries++;
        } while (tries < 6 && Math.hypot(dx - s.destX, dy - s.destY) < 180);
        s.startX = s.destX; s.startY = s.destY;
        s.destX = dx; s.destY = dy;
        const dist = Math.hypot(s.destX - s.startX, s.destY - s.startY);
        s.animStart = now;
        s.animDur = Math.max(500, Math.min(1600, dist * 2.5));
        s.phase = 'carrying';
      }
    } else if (s.phase === 'carrying') {
      if (!s.targetEl || !s.targetEl.isConnected) {
        s.phase = 'idle'; s.nextAt = now + 600; s.targetEl = null; return;
      }
      const t = Math.min(1, (now - s.animStart) / s.animDur);
      const e = ease(t);
      const x = s.startX + (s.destX - s.startX) * e;
      const y = s.startY + (s.destY - s.startY) * e;
      r.el.style.left = x + 'px';
      r.el.style.top  = y + 'px';
      const liftT = Math.min(1, t * 2);
      const ox = s.targetStartOX + (0   - s.targetStartOX) * liftT;
      const oy = s.targetStartOY + (-50 - s.targetStartOY) * liftT;
      s.targetEl.style.left = (x + ox) + 'px';
      s.targetEl.style.top  = (y + oy) + 'px';
      if (t >= 1) {
        s.targetEl.style.left = x + 'px';
        s.targetEl.style.top  = (y - 70) + 'px';
        delete s.targetEl.dataset.grabbed;
        hitPart(s.targetEl, true);
        VOICES.beep(0);
        s.targetEl = null;
        s.phase = 'idle';
        s.nextAt = now + 1000 + Math.random() * 1500;
      }
    }
  });
  for (const [rid, rs] of robotState) {
    if (!activeRobotIds.has(rid)) {
      if (rs.targetEl) delete rs.targetEl.dataset.grabbed;
      robotState.delete(rid);
    }
  }
  const liveMouseIds = new Set(mouseEls.map(m => m.dataset.id));
  for (const mid of mouseState.keys()) {
    if (!liveMouseIds.has(mid)) mouseState.delete(mid);
  }

  // --- Mouse vs Robot ---
  for (const m of mouseEls) {
    if (!m.isConnected) continue;
    const mx = (parseFloat(m.style.left) || 0) + 45;
    const my = (parseFloat(m.style.top)  || 0) + 45;
    const ms = mouseState.get(m.dataset.id);
    const empowered = ms && ms.empoweredUntil > now;
    for (const rEl of robotEls) {
      if (!rEl.isConnected) continue;
      const rcx = (parseFloat(rEl.style.left) || 0) + 45;
      const rcy = (parseFloat(rEl.style.top)  || 0) + 45;
      if (Math.hypot(rcx - mx, rcy - my) < 60) {
        if (empowered) {
          particleBurst(rcx, rcy, ['#9ca3af','#ec4899','#fbbf24','#2a2118']);
          VOICES.squeak(0);
          VOICES.boom(0.05);
          rEl.animate(
            [{ transform: 'scale(1)', opacity: 1 },
             { transform: 'scale(.3) rotate(180deg)', opacity: 0 }],
            { duration: 320, easing: 'ease-out' }
          ).onfinish = () => rEl.remove();
          if (ms) ms.empoweredUntil = 0;
          m.classList.remove('empowered');
        } else {
          particleBurst(mx, my, ['#9ca3af','#fbcfe8','#fb7185','#fff']);
          VOICES.squeak(0);
          VOICES.munch(0.05);
          m.animate(
            [{ transform: 'scale(1)', opacity: 1 },
             { transform: 'scale(.2)', opacity: 0 }],
            { duration: 260, easing: 'ease-out' }
          ).onfinish = () => m.remove();
          mouseState.delete(m.dataset.id);
        }
        break;
      }
    }
  }

  // --- Marbles ---
  const marblesToRemove = [];
  S.marbles.forEach(m => {
    m.vy += GRAVITY * dt;
    m.vx *= FRICTION;
    m.vy *= FRICTION;
    m.x += m.vx * dt;
    m.y += m.vy * dt;

    if (m.x < 0)        { m.x = 0;        m.vx = Math.abs(m.vx) * 0.75; }
    if (m.x > W - 90)   { m.x = W - 90;   m.vx = -Math.abs(m.vx) * 0.75; }
    if (m.y < 0)        { m.y = 0;        m.vy = Math.abs(m.vy) * 0.75; }
    if (m.y > H - 90) {
      m.y = H - 90;
      m.vy = -Math.abs(m.vy) * 0.7;
      m.vx *= 0.9;
      if (Math.abs(m.vy) < 1.5) m.vy = 0;
    }

    const mcx = m.x + 45, mcy = m.y + 45;
    let consumed = false;
    for (const o of obstacles) {
      const dx = mcx - o.cx, dy = mcy - o.cy;
      const dist = Math.hypot(dx, dy);
      const minDist = MARBLE_RADIUS + PART_RADIUS;
      if (dist >= minDist || dist === 0) continue;

      if (o.def.lava) {
        explodeMarble(m, ['#dc2626', '#f59e0b', '#fbbf24', '#fde047']);
        VOICES.sizzle(0);
        hitPart(o.el, true);
        consumed = true;
        break;
      }
      const overlap = minDist - dist;
      const nx = dx / dist, ny = dy / dist;
      m.x += nx * overlap;
      m.y += ny * overlap;
      const dot = m.vx * nx + m.vy * ny;
      if (dot < 0) {
        const restitution = o.def.bouncy ? 1.6 : 0.75;
        m.vx -= (1 + restitution) * dot * nx;
        m.vy -= (1 + restitution) * dot * ny;
      }
      hitPart(o.el);
    }
    if (consumed) { marblesToRemove.push(m); return; }

    S.marbles.forEach(other => {
      if (other === m || other._dead) return;
      const dx = (m.x + 45) - (other.x + 45);
      const dy = (m.y + 45) - (other.y + 45);
      const dist = Math.hypot(dx, dy);
      const minDist = MARBLE_RADIUS * 2;
      if (dist < minDist && dist > 0) {
        const overlap = (minDist - dist) / 2;
        const nx = dx / dist, ny = dy / dist;
        m.x += nx * overlap;     m.y += ny * overlap;
        other.x -= nx * overlap; other.y -= ny * overlap;
        const dvx = m.vx - other.vx, dvy = m.vy - other.vy;
        const dot = dvx * nx + dvy * ny;
        if (dot < 0) {
          m.vx -= dot * nx;     m.vy -= dot * ny;
          other.vx += dot * nx; other.vy += dot * ny;
        }
      }
    });

    m.el.style.left = m.x + "px";
    m.el.style.top  = m.y + "px";
  });
  marblesToRemove.forEach(m => { m._dead = true; });
  S.marbles = S.marbles.filter(m => !m._dead);

  // --- Fireballs ---
  const fireballsToRemove = [];
  S.fireballs.forEach(f => {
    f.vy += GRAVITY * 0.6 * dt;
    f.x += f.vx * dt;
    f.y += f.vy * dt;
    f.life -= dt;

    if (f.x < 0)        { f.x = 0;     f.vx = Math.abs(f.vx) * 0.6; }
    if (f.x > W)        { f.x = W;     f.vx = -Math.abs(f.vx) * 0.6; }
    if (f.y > H + 20 || f.life <= 0) { fireballsToRemove.push(f); return; }

    for (const o of obstacles) {
      if (o.def.fireproof) continue;
      const dx = f.x - o.cx, dy = f.y - o.cy;
      const dist = Math.hypot(dx, dy);
      if (dist < FIREBALL_RADIUS + PART_RADIUS - 6) {
        destroyByFireLocal(o.el);
        const i = obstacles.indexOf(o); if (i >= 0) obstacles.splice(i, 1);
        fireballsToRemove.push(f);
        break;
      }
    }
    if (!fireballsToRemove.includes(f)) {
      for (const m of S.marbles) {
        if (m._dead) continue;
        const dx = f.x - (m.x + 45), dy = f.y - (m.y + 45);
        if (Math.hypot(dx, dy) < FIREBALL_RADIUS + MARBLE_RADIUS - 4) {
          explodeMarble(m, ['#dc2626', '#fbbf24', '#7c2d12']);
          m._dead = true;
          fireballsToRemove.push(f);
          break;
        }
      }
    }

    f.el.style.left = f.x + "px";
    f.el.style.top  = f.y + "px";
  });
  fireballsToRemove.forEach(f => f.el.remove());
  S.fireballs = S.fireballs.filter(f => !fireballsToRemove.includes(f));
  S.marbles = S.marbles.filter(m => !m._dead);

  S.physicsHandle = requestAnimationFrame(physicsLoop);
}
