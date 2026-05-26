// Run/stop, control buttons, modals, name generator, save/load modal.
import { S, shop, world, machineName } from './state.js';
import { PARTS } from './parts.js';
import { VOICES, ac, tone } from './audio.js';
import { startPhysics, stopPhysics } from './physics.js';
import {
  saveAndPush, undo, exportBuild, importBuild, snapshot
} from './persistence.js';
import { spawnPartLocal, spawnInShopRandom, updateCount } from './spawn.js';

const ADJ  = ["Machtige","Wiebelende","Geschifte","Mega","Turbo","Stiekeme","Krokante","Drassige","Galactische","Kosmische","Stinkende","Wilde","Pluizige","Quantum","Atomische","Vulkanische","Smeltende"];
const NOUN = ["Dingetje","Apparaatje","Vehikel","Gadget","Constructie","Machine","Wiebelaar","Draaier","Vermorzelaar","Toeteraar","Toeter","O-Matic","Motor","Uitbarster"];
const SUFFIX = ["2000","3000","5000","XL","Pro","Mark II","Mark VII","Deluxe","Supreme","9001"];
function generateName(partsUsed) {
  const a = ADJ[Math.floor(Math.random()*ADJ.length)];
  const n = NOUN[Math.floor(Math.random()*NOUN.length)];
  const s = SUFFIX[Math.floor(Math.random()*SUFFIX.length)];
  if (partsUsed.length && Math.random() < 0.6) {
    const featured = PARTS[partsUsed[Math.floor(Math.random()*partsUsed.length)]].name;
    return `De ${a} ${featured}-${n} ${s}!`;
  }
  return `De ${a} ${n} ${s}!`;
}

function run() {
  const parts = [...shop.querySelectorAll(".part")];
  if (!parts.length) {
    machineName.textContent = "...bouw eerst iets, gekkie!";
    return;
  }
  if (S.audioCtx && S.audioCtx.state === "suspended") S.audioCtx.resume();
  ac();

  S.runtimeBackup = parts.map(el => ({
    kind: el.dataset.kind,
    x: parseFloat(el.style.left) || 0,
    y: parseFloat(el.style.top)  || 0
  }));

  document.body.classList.add("running");
  const runBtn = document.getElementById("runBtn");
  runBtn.textContent = "■ STOP!";
  runBtn.classList.add("is-running");
  document.getElementById("historyPanel").classList.remove("open");
  document.getElementById("modalBackdrop").hidden = true;

  machineName.textContent = generateName(parts.map(p => p.dataset.kind));

  parts.forEach(el => {
    if (el.dataset.kind !== "marble") el.classList.add("active");
    const train = el.querySelector("[data-train]");
    if (train) {
      train.style.opacity = "1";
      train.style.animation = "train-ride 1.4s linear infinite";
    }
  });

  const chorus = () => {
    [...shop.querySelectorAll(".part")].forEach((p, i) => {
      if (p.dataset.kind === "marble") return;
      const v = VOICES[PARTS[p.dataset.kind].voice];
      if (v) v(i * 0.12);
    });
  };
  chorus();
  S.runInterval = setInterval(chorus, 2500);

  startPhysics();
}

function stop() {
  document.body.classList.remove("running");
  const runBtn = document.getElementById("runBtn");
  runBtn.textContent = "▶ START!";
  runBtn.classList.remove("is-running");
  if (S.runInterval) { clearInterval(S.runInterval); S.runInterval = null; }
  shop.querySelectorAll(".part").forEach(el => el.classList.remove("active", "hit"));
  shop.querySelectorAll("[data-train]").forEach(t => {
    t.style.opacity = "0"; t.style.animation = "none";
  });
  stopPhysics();
  if (S.runtimeBackup) {
    shop.querySelectorAll(".part").forEach(el => el.remove());
    S.runtimeBackup.forEach(p => spawnPartLocal(p.kind, p.x, p.y, { silent: true }));
    updateCount();
    S.runtimeBackup = null;
  }
}

export function initUI() {
  // run / stop
  document.getElementById("runBtn").addEventListener("click", () => {
    if (document.body.classList.contains("running")) stop();
    else run();
  });

  // clear
  document.getElementById("clearBtn").addEventListener("click", () => {
    const parts = [...shop.querySelectorAll(".part")];
    if (!parts.length && !document.body.classList.contains("running")) return;
    stop();
    const remaining = [...shop.querySelectorAll(".part")];
    remaining.forEach(p => {
      const r = p.getBoundingClientRect();
      const wr = world.getBoundingClientRect();
      for (let i = 0; i < 6; i++) {
        const c = document.createElement("div");
        c.className = "confetti";
        c.style.left = ((r.left - wr.left) / S.worldScale + 40) + "px";
        c.style.top  = ((r.top  - wr.top)  / S.worldScale + 40) + "px";
        c.style.background = ["#ef4444","#f59e0b","#10b981","#3b82f6","#8b5cf6","#ec4899"][i%6];
        world.appendChild(c);
        const dx = (Math.random() - .5) * 200;
        const dy = (Math.random() - .5) * 200;
        c.animate(
          [{ transform: "translate(0,0) rotate(0)", opacity: 1 },
           { transform: `translate(${dx}px, ${dy}px) rotate(720deg)`, opacity: 0 }],
          { duration: 700, easing: "ease-out" }
        ).onfinish = () => c.remove();
      }
      p.remove();
    });
    updateCount();
    tone({ freq: 300, type:"square", dur:.15, vol:.2, slide: -200 });
    machineName.textContent = "naamloze machine";
    saveAndPush();
  });

  // surprise
  document.getElementById("surpriseBtn").addEventListener("click", () => {
    if (document.body.classList.contains("running")) return;
    const kinds = Object.keys(PARTS).filter(k => !PARTS[k].hidden);
    const n = 4 + Math.floor(Math.random() * 3);
    for (let i = 0; i < n; i++) {
      spawnInShopRandom(kinds[Math.floor(Math.random() * kinds.length)]);
    }
    tone({ freq: 700, type: "triangle", dur: .15, vol: .15, slide: 400 });
  });

  // sound
  const soundBtn = document.getElementById("soundBtn");
  soundBtn.addEventListener("click", () => {
    S.soundOn = !S.soundOn;
    soundBtn.textContent = S.soundOn ? "🔊" : "🔇";
  });

  document.getElementById("undoBtn").addEventListener("click", undo);

  // Bin arrows
  const binScroll = document.getElementById("binScroll");
  document.getElementById("binUp")  .addEventListener("click", () => binScroll.scrollBy({ top: -180, behavior: 'smooth' }));
  document.getElementById("binDown").addEventListener("click", () => binScroll.scrollBy({ top:  180, behavior: 'smooth' }));

  // History panel toggle
  const historyPanel = document.getElementById("historyPanel");
  document.getElementById("historyBtn"  ).addEventListener("click", () => historyPanel.classList.toggle("open"));
  document.getElementById("historyClose").addEventListener("click", () => historyPanel.classList.remove("open"));

  // Save/Load modal
  const modalBackdrop = document.getElementById("modalBackdrop");
  const exportText    = document.getElementById("exportText");
  const importText    = document.getElementById("importText");
  const copyBtn       = document.getElementById("copyBtn");
  const loadBtn       = document.getElementById("loadBtn");
  const loadMsg       = document.getElementById("loadMsg");
  document.getElementById("shareBtn").addEventListener("click", () => {
    if (document.body.classList.contains("running")) return;
    exportText.value = exportBuild();
    importText.value = "";
    loadMsg.textContent = "";
    loadMsg.className = "modal-msg";
    modalBackdrop.hidden = false;
  });
  document.getElementById("modalClose").addEventListener("click", () => modalBackdrop.hidden = true);
  modalBackdrop.addEventListener("click", (e) => {
    if (e.target === modalBackdrop) modalBackdrop.hidden = true;
  });
  copyBtn.addEventListener("click", async () => {
    exportText.focus();
    exportText.select();
    let ok = false;
    try {
      await navigator.clipboard.writeText(exportText.value);
      ok = true;
    } catch (e) {
      try { ok = document.execCommand("copy"); } catch {}
    }
    copyBtn.textContent = ok ? "✅ Gekopieerd!" : "Selecteer & kopieer zelf";
    setTimeout(() => copyBtn.textContent = "📋 Code kopiëren", 1800);
  });
  loadBtn.addEventListener("click", () => {
    const res = importBuild(importText.value);
    loadMsg.textContent = res.msg;
    loadMsg.className = "modal-msg " + (res.ok ? "success" : "error");
    if (res.ok) setTimeout(() => modalBackdrop.hidden = true, 900);
  });
}
