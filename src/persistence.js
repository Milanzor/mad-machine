// Autosave + history + import/export.
import { S, shop, STORE_CURRENT, STORE_HISTORY } from './state.js';
import { PARTS } from './parts.js';
import { spawnPartLocal, updateCount } from './spawn.js';

const MAX_HISTORY = 30;

export function snapshot() {
  return {
    t: Date.now(),
    parts: [...shop.querySelectorAll(".part")].map(el => ({
      kind: el.dataset.kind,
      x: parseFloat(el.style.left) || 0,
      y: parseFloat(el.style.top)  || 0
    }))
  };
}

export function applySnapshot(snap, opts = {}) {
  shop.querySelectorAll(".part").forEach(el => el.remove());
  (snap.parts || []).forEach(p => {
    if (!p || !(p.kind in PARTS)) return;
    spawnPartLocal(p.kind, +p.x || 0, +p.y || 0, { silent: true });
  });
  updateCount();
  if (!opts.silent) saveCurrent();
}

export function saveCurrent() {
  try { localStorage.setItem(STORE_CURRENT, JSON.stringify(snapshot())); } catch (e) {}
}
export function saveHistory() {
  try { localStorage.setItem(STORE_HISTORY, JSON.stringify(S.history)); } catch (e) {}
}

export function saveAndPush() {
  if (document.body.classList.contains("running")) return;
  const snap = snapshot();
  const json = JSON.stringify(snap);
  if (json === S.lastSnapJson) return;
  if (S.lastSnapJson !== "") {
    S.history.push(JSON.parse(S.lastSnapJson));
    if (S.history.length > MAX_HISTORY) S.history.shift();
    saveHistory();
    renderHistory();
  }
  S.lastSnapJson = json;
  saveCurrent();
}

export function loadInitial() {
  try {
    const h = localStorage.getItem(STORE_HISTORY);
    if (h) S.history = JSON.parse(h);
  } catch (e) { S.history = []; }
  let cur = null;
  try {
    const c = localStorage.getItem(STORE_CURRENT);
    if (c) cur = JSON.parse(c);
  } catch (e) {}
  if (cur && cur.parts && cur.parts.length) {
    applySnapshot(cur, { silent: true });
  }
  S.lastSnapJson = JSON.stringify(snapshot());
  renderHistory();
}

export function undo() {
  if (document.body.classList.contains("running")) return;
  if (!S.history.length) return;
  const prev = S.history.pop();
  applySnapshot(prev, { silent: true });
  S.lastSnapJson = JSON.stringify(snapshot());
  saveCurrent();
  saveHistory();
  renderHistory();
}

function timeAgo(t) {
  const s = Math.floor((Date.now() - t) / 1000);
  if (s < 5) return "net";
  if (s < 60) return s + "s geleden";
  if (s < 3600) return Math.floor(s / 60) + "m geleden";
  if (s < 86400) return Math.floor(s / 3600) + "u geleden";
  return Math.floor(s / 86400) + "d geleden";
}

export function renderHistory() {
  const undoBtn = document.getElementById("undoBtn");
  const historyList = document.getElementById("historyList");
  const historyPanel = document.getElementById("historyPanel");
  if (!historyList) return;
  if (undoBtn) undoBtn.disabled = S.history.length === 0;

  historyList.innerHTML = "";
  if (!S.history.length) {
    const empty = document.createElement("div");
    empty.className = "empty";
    empty.textContent = "Nog niets — begin met bouwen en je geschiedenis komt hier.";
    historyList.appendChild(empty);
    return;
  }
  for (let i = S.history.length - 1; i >= 0; i--) {
    const snap = S.history[i];
    const li = document.createElement("li");
    const stepNum = i + 1;
    li.innerHTML = `
      <div>
        <div class="step">Stap ${stepNum}</div>
        <div class="info">${snap.parts.length} ${snap.parts.length === 1 ? "onderdeel" : "onderdelen"} • ${timeAgo(snap.t)}</div>
      </div>
      <div style="font-size:18px">↶</div>`;
    li.addEventListener("click", () => {
      const target = S.history[i];
      S.history = S.history.slice(0, i);
      applySnapshot(target, { silent: true });
      S.lastSnapJson = JSON.stringify(snapshot());
      saveCurrent(); saveHistory(); renderHistory();
      if (historyPanel) historyPanel.classList.remove("open");
    });
    historyList.appendChild(li);
  }
}

export function exportBuild() {
  const data = { v: 1, parts: snapshot().parts };
  return "MMW1:" + btoa(JSON.stringify(data));
}

export function importBuild(str) {
  if (typeof str !== "string") return { ok: false, msg: "Lege code." };
  str = str.trim();
  if (!str) return { ok: false, msg: "Plak eerst een code!" };

  let data = null;
  try {
    if (/^MMW\d+:/.test(str)) {
      const b64 = str.split(":").slice(1).join(":");
      data = JSON.parse(atob(b64));
    } else {
      try { data = JSON.parse(str); }
      catch { data = JSON.parse(atob(str)); }
    }
  } catch (e) {
    return { ok: false, msg: "Dat lijkt geen Werkplaats-code." };
  }
  if (!data || !Array.isArray(data.parts)) {
    return { ok: false, msg: "Code mist de onderdelenlijst." };
  }

  const validParts = data.parts.filter(p => p && typeof p.kind === "string" && p.kind in PARTS);
  const skipped = data.parts.length - validParts.length;

  applySnapshot({ parts: validParts });
  saveAndPush();

  let msg = `${validParts.length} ${validParts.length === 1 ? "onderdeel" : "onderdelen"} geladen!`;
  if (skipped > 0) msg += ` (${skipped} onbekend${skipped === 1 ? "" : "e"} overgeslagen)`;
  return { ok: true, msg };
}
