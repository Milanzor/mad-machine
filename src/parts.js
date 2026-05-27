import { binGrid } from './state.js';

// flags:
//   anim:       CSS animation class active when part has .active
//   voice:      VOICES key for sound
//   custom:     special rendering hook (e.g. brio train)
//   bouncy:     marbles bounce off harder
//   lava:       destroys marbles/fireballs on contact (doesn't bounce them)
//   fireproof:  not destroyed by fireballs
//   erupts:     spawns fireballs while running
//   mouse:      runs the mouse AI
//   cheese:     empowers mice on touch
//   hatches:    kind key this egg hatches into (e.g. "dino", "tRex")
//   dino:       runs the dinosaur AI (eats everything)
//   speed:      chase speed for dino AI (default 1.7)
//   range:      bite range for dino AI (default 70)
//   hidden:     skipped in the bin (spawned only via game logic)
export const PARTS = {
  gear: {
    name: "Tandwiel", anim: "anim-spin", voice: "whirr",
    svg: `<svg viewBox="0 0 100 100" class="core">
      <g fill="#8b5cf6" stroke="#2a2118" stroke-width="3" stroke-linejoin="round">
        <path d="M50 8 l8 10 12-3 4 12 12 4 -3 12 10 8 -10 8 3 12 -12 4 -4 12 -12-3 -8 10 -8-10 -12 3 -4-12 -12-4 3-12 -10-8 10-8 -3-12 12-4 4-12 12 3z"/>
        <circle cx="50" cy="50" r="14" fill="#2a2118"/>
        <circle cx="50" cy="50" r="6" fill="#fbbf24"/>
      </g>
    </svg>`
  },
  wheel: {
    name: "Wiel", anim: "anim-roll", voice: "whirr",
    svg: `<svg viewBox="0 0 100 100" class="core">
      <circle cx="50" cy="50" r="40" fill="#a16207" stroke="#2a2118" stroke-width="3"/>
      <circle cx="50" cy="50" r="32" fill="#b45309" stroke="#78350f" stroke-width="2"/>
      <g stroke="#78350f" stroke-width="4" stroke-linecap="round">
        <line x1="50" y1="14" x2="50" y2="86"/>
        <line x1="14" y1="50" x2="86" y2="50"/>
        <line x1="24" y1="24" x2="76" y2="76"/>
        <line x1="76" y1="24" x2="24" y2="76"/>
      </g>
      <circle cx="50" cy="50" r="10" fill="#2a2118" stroke="#fbbf24" stroke-width="2"/>
      <circle cx="50" cy="50" r="3" fill="#fbbf24"/>
    </svg>`
  },
  spring: {
    name: "Veer", anim: "anim-bounce", voice: "boing",
    bouncy: true,
    svg: `<svg viewBox="0 0 100 100" class="core">
      <g fill="none" stroke="#94a3b8" stroke-width="6" stroke-linecap="round">
        <path d="M25 90 H75 M25 80 H75 M25 68 H75 M25 56 H75 M25 44 H75 M25 32 H75 M25 20 H75"/>
        <path d="M25 90 V20 M75 90 V20" stroke="#475569" stroke-width="3"/>
      </g>
      <rect x="20" y="14" width="60" height="8" fill="#475569" stroke="#2a2118" stroke-width="2"/>
    </svg>`
  },
  cable: {
    name: "Kabel", anim: "anim-wiggle", voice: "buzz",
    svg: `<svg viewBox="0 0 100 100" class="core">
      <path d="M15 80 C 25 20, 40 90, 50 50 S 75 10, 90 30"
            stroke="#ef4444" stroke-width="9" fill="none" stroke-linecap="round"/>
      <path d="M15 80 C 25 20, 40 90, 50 50 S 75 10, 90 30"
            stroke="#fbbf24" stroke-width="3" fill="none" stroke-linecap="round" stroke-dasharray="2 6"/>
      <circle cx="15" cy="80" r="6" fill="#2a2118"/>
      <circle cx="90" cy="30" r="6" fill="#2a2118"/>
    </svg>`
  },
  whisk: {
    name: "Garde", anim: "anim-spinfast", voice: "whisk",
    svg: `<svg viewBox="0 0 100 100" class="core">
      <rect x="44" y="8" width="12" height="34" rx="3" fill="#78350f" stroke="#2a2118" stroke-width="2"/>
      <rect x="42" y="38" width="16" height="6" fill="#9ca3af" stroke="#2a2118" stroke-width="2"/>
      <g fill="none" stroke="#9ca3af" stroke-width="3" stroke-linecap="round">
        <path d="M50 44 Q 20 60, 50 92"/>
        <path d="M50 44 Q 80 60, 50 92"/>
        <path d="M50 44 Q 30 70, 50 92"/>
        <path d="M50 44 Q 70 70, 50 92"/>
        <path d="M50 44 V 92"/>
      </g>
    </svg>`
  },
  spatula: {
    name: "Spatel", anim: "anim-flip", voice: "flap",
    svg: `<svg viewBox="0 0 100 100" class="core">
      <rect x="44" y="50" width="12" height="46" rx="3" fill="#78350f" stroke="#2a2118" stroke-width="2"/>
      <rect x="20" y="20" width="60" height="36" rx="6" fill="#dc2626" stroke="#2a2118" stroke-width="3"/>
      <g stroke="#7f1d1d" stroke-width="2">
        <line x1="30" y1="28" x2="30" y2="48"/>
        <line x1="42" y1="28" x2="42" y2="48"/>
        <line x1="54" y1="28" x2="54" y2="48"/>
        <line x1="66" y1="28" x2="66" y2="48"/>
      </g>
    </svg>`
  },
  fan: {
    name: "Ventilator", anim: "anim-spinrev", voice: "windy",
    svg: `<svg viewBox="0 0 100 100" class="core">
      <g fill="#3b82f6" stroke="#2a2118" stroke-width="3">
        <ellipse cx="50" cy="24" rx="10" ry="22"/>
        <ellipse cx="76" cy="50" rx="22" ry="10"/>
        <ellipse cx="50" cy="76" rx="10" ry="22"/>
        <ellipse cx="24" cy="50" rx="22" ry="10"/>
      </g>
      <circle cx="50" cy="50" r="10" fill="#2a2118"/>
      <circle cx="50" cy="50" r="4" fill="#fbbf24"/>
    </svg>`
  },
  box: {
    name: "Karton", anim: "anim-shake", voice: "thud",
    svg: `<svg viewBox="0 0 100 100" class="core">
      <path d="M10 30 L50 12 L90 30 L50 48 Z" fill="#d97706" stroke="#2a2118" stroke-width="3"/>
      <path d="M10 30 V80 L50 96 V48 Z" fill="#b45309" stroke="#2a2118" stroke-width="3"/>
      <path d="M90 30 V80 L50 96 V48 Z" fill="#92400e" stroke="#2a2118" stroke-width="3"/>
      <path d="M30 58 H70 M30 68 H70 M40 78 H60" stroke="#451a03" stroke-width="2" stroke-linecap="round"/>
    </svg>`
  },
  duplo: {
    name: "Duplo", anim: "anim-glow", voice: "ping",
    svg: `<svg viewBox="0 0 100 100" class="core">
      <rect x="14" y="34" width="72" height="50" rx="4" fill="#ef4444" stroke="#2a2118" stroke-width="3"/>
      <ellipse cx="34" cy="34" rx="14" ry="6" fill="#dc2626" stroke="#2a2118" stroke-width="3"/>
      <ellipse cx="66" cy="34" rx="14" ry="6" fill="#dc2626" stroke="#2a2118" stroke-width="3"/>
      <ellipse cx="34" cy="28" rx="14" ry="6" fill="#f87171" stroke="#2a2118" stroke-width="3"/>
      <ellipse cx="66" cy="28" rx="14" ry="6" fill="#f87171" stroke="#2a2118" stroke-width="3"/>
      <text x="50" y="65" font-size="12" text-anchor="middle" fill="#fff" font-family="sans-serif">DUPLO</text>
    </svg>`
  },
  brio: {
    name: "Brio", anim: "", voice: "chug", custom: "brio",
    svg: `<svg viewBox="0 0 100 100" class="core">
      <path d="M 8 70 Q 50 5, 92 70" stroke="#a16207" stroke-width="14" fill="none" stroke-linecap="round"/>
      <path d="M 8 70 Q 50 5, 92 70" stroke="#fbbf24" stroke-width="4" fill="none" stroke-linecap="round" stroke-dasharray="3 6"/>
      <circle cx="8" cy="70" r="6" fill="#78350f"/>
      <circle cx="92" cy="70" r="6" fill="#78350f"/>
    </svg>`
  },
  knex: {
    name: "K'nex", anim: "anim-wave", voice: "click",
    svg: `<svg viewBox="0 0 100 100" class="core">
      <rect x="18" y="46" width="64" height="10" rx="3" fill="#16a34a" stroke="#2a2118" stroke-width="2"/>
      <circle cx="18" cy="51" r="10" fill="#fbbf24" stroke="#2a2118" stroke-width="2"/>
      <circle cx="82" cy="51" r="10" fill="#fbbf24" stroke="#2a2118" stroke-width="2"/>
      <circle cx="18" cy="51" r="3" fill="#2a2118"/>
      <circle cx="82" cy="51" r="3" fill="#2a2118"/>
      <rect x="46" y="20" width="8" height="60" rx="2" fill="#3b82f6" stroke="#2a2118" stroke-width="2"/>
    </svg>`
  },
  car: {
    name: "Speelgoedauto", anim: "anim-drive", voice: "vroom",
    svg: `<svg viewBox="0 0 100 100" class="core">
      <path d="M10 70 L20 50 L40 40 L70 40 L90 60 L90 70 Z" fill="#06b6d4" stroke="#2a2118" stroke-width="3"/>
      <rect x="38" y="44" width="22" height="14" fill="#7dd3fc" stroke="#2a2118" stroke-width="2"/>
      <circle cx="28" cy="72" r="9" fill="#1f2937" stroke="#2a2118" stroke-width="2"/>
      <circle cx="72" cy="72" r="9" fill="#1f2937" stroke="#2a2118" stroke-width="2"/>
      <circle cx="28" cy="72" r="3" fill="#9ca3af"/>
      <circle cx="72" cy="72" r="3" fill="#9ca3af"/>
    </svg>`
  },
  bouncycar: {
    name: "Stuiterauto", anim: "anim-bouncedrive", voice: "vroom",
    bouncy: true,
    svg: `<svg viewBox="0 0 100 100" class="core">
      <path d="M10 70 L20 48 L40 36 L70 36 L90 58 L90 70 Z" fill="#ec4899" stroke="#2a2118" stroke-width="3"/>
      <rect x="38" y="40" width="22" height="14" fill="#fbcfe8" stroke="#2a2118" stroke-width="2"/>
      <path d="M22 32 L26 22 M50 28 L50 16 M78 32 L74 22" stroke="#fbbf24" stroke-width="3" stroke-linecap="round"/>
      <circle cx="22" cy="22" r="3" fill="#fde047"/>
      <circle cx="50" cy="14" r="3" fill="#fde047"/>
      <circle cx="78" cy="22" r="3" fill="#fde047"/>
      <circle cx="28" cy="74" r="11" fill="#1f2937" stroke="#2a2118" stroke-width="2"/>
      <circle cx="72" cy="74" r="11" fill="#1f2937" stroke="#2a2118" stroke-width="2"/>
      <circle cx="28" cy="74" r="5" fill="#fbbf24"/>
      <circle cx="72" cy="74" r="5" fill="#fbbf24"/>
    </svg>`
  },
  rubber: {
    name: "Elastiek", anim: "anim-stretch", voice: "twang",
    svg: `<svg viewBox="0 0 100 100" class="core">
      <ellipse cx="50" cy="60" rx="34" ry="20" fill="none" stroke="#e11d48" stroke-width="10"/>
      <ellipse cx="50" cy="60" rx="34" ry="20" fill="none" stroke="#fbcfe8" stroke-width="3"/>
    </svg>`
  },
  marble: {
    name: "Knikker", anim: "", voice: "plink",
    svg: `<svg viewBox="0 0 100 100" class="core">
      <circle cx="50" cy="50" r="38" fill="#3b82f6" stroke="#2a2118" stroke-width="3"/>
      <circle cx="50" cy="50" r="32" fill="#60a5fa"/>
      <ellipse cx="40" cy="38" rx="14" ry="10" fill="#dbeafe" opacity=".8"/>
      <circle cx="34" cy="34" r="5" fill="#fff"/>
    </svg>`
  },
  lava: {
    name: "Lava-emmer", anim: "anim-bubble", voice: "sizzle",
    lava: true, fireproof: true, danger: true,
    svg: `<svg viewBox="0 0 100 100" class="core">
      <path d="M 22 30 Q 50 6 78 30" fill="none" stroke="#1f2937" stroke-width="3" stroke-linecap="round"/>
      <path d="M 18 30 L 28 88 H 72 L 82 30 Z" fill="#6b7280" stroke="#2a2118" stroke-width="3"/>
      <ellipse cx="50" cy="30" rx="32" ry="6" fill="#4b5563" stroke="#2a2118" stroke-width="3"/>
      <ellipse cx="50" cy="30" rx="28" ry="5" fill="#dc2626"/>
      <ellipse cx="50" cy="29" rx="22" ry="4" fill="#f59e0b"/>
      <ellipse cx="50" cy="28" rx="14" ry="2" fill="#fde047"/>
      <circle cx="40" cy="30" r="2" fill="#fde047" opacity="0.8"/>
      <circle cx="58" cy="31" r="1.8" fill="#fde047" opacity="0.7"/>
      <circle cx="50" cy="28" r="1.2" fill="#fff" opacity="0.7"/>
    </svg>`
  },
  robot: {
    name: "Robot", anim: "anim-rumble", voice: "beep",
    svg: `<svg viewBox="0 0 100 100" class="core">
      <line x1="50" y1="18" x2="50" y2="6" stroke="#2a2118" stroke-width="3"/>
      <circle cx="50" cy="5" r="4" fill="#ef4444" stroke="#2a2118" stroke-width="2"/>
      <rect x="28" y="16" width="44" height="30" rx="5" fill="#9ca3af" stroke="#2a2118" stroke-width="3"/>
      <circle cx="40" cy="30" r="5" fill="#fff" stroke="#2a2118" stroke-width="2"/>
      <circle cx="60" cy="30" r="5" fill="#fff" stroke="#2a2118" stroke-width="2"/>
      <circle cx="40" cy="30" r="2.2" fill="#06b6d4"/>
      <circle cx="60" cy="30" r="2.2" fill="#06b6d4"/>
      <rect x="40" y="38" width="20" height="3" fill="#2a2118"/>
      <rect x="22" y="48" width="56" height="34" rx="4" fill="#6b7280" stroke="#2a2118" stroke-width="3"/>
      <rect x="32" y="54" width="36" height="20" rx="2" fill="#374151" stroke="#2a2118" stroke-width="2"/>
      <circle cx="40" cy="64" r="2" fill="#10b981"/>
      <circle cx="50" cy="64" r="2" fill="#fbbf24"/>
      <circle cx="60" cy="64" r="2" fill="#ef4444"/>
      <rect x="12" y="52" width="9" height="22" rx="2" fill="#9ca3af" stroke="#2a2118" stroke-width="2"/>
      <rect x="79" y="52" width="9" height="22" rx="2" fill="#9ca3af" stroke="#2a2118" stroke-width="2"/>
      <path d="M14 74 L9 80 L18 80 Z" fill="#374151" stroke="#2a2118" stroke-width="2"/>
      <path d="M86 74 L91 80 L82 80 Z" fill="#374151" stroke="#2a2118" stroke-width="2"/>
      <rect x="22" y="82" width="56" height="10" rx="3" fill="#1f2937" stroke="#2a2118" stroke-width="2"/>
    </svg>`
  },
  mouseEgg: {
    name: "Muis-ei", anim: "anim-wiggle", voice: "ping", hatches: "mouse",
    svg: `<svg viewBox="0 0 100 100" class="core">
      <ellipse cx="50" cy="58" rx="32" ry="40" fill="#e5e7eb" stroke="#2a2118" stroke-width="3"/>
      <ellipse cx="40" cy="42" rx="10" ry="14" fill="#f3f4f6" opacity=".8"/>
      <path d="M 22 50 Q 32 44 36 54 Q 46 48 50 60 Q 56 48 64 54 Q 70 44 78 50" fill="none" stroke="#9ca3af" stroke-width="2.5" stroke-linecap="round"/>
      <circle cx="40" cy="70" r="3" fill="#fbcfe8"/>
      <circle cx="58" cy="78" r="2.5" fill="#fbcfe8"/>
      <circle cx="38" cy="82" r="2" fill="#fb7185"/>
      <circle cx="62" cy="64" r="2.5" fill="#fbcfe8"/>
    </svg>`
  },
  mouse: {
    name: "Muis", anim: "", voice: "squeak", mouse: true,
    svg: `<svg viewBox="0 0 100 100" class="core">
      <path d="M 88 64 Q 72 74, 78 54" stroke="#6b7280" stroke-width="4" fill="none" stroke-linecap="round"/>
      <ellipse cx="55" cy="64" rx="30" ry="20" fill="#9ca3af" stroke="#2a2118" stroke-width="3"/>
      <circle cx="38" cy="40" r="11" fill="#9ca3af" stroke="#2a2118" stroke-width="3"/>
      <circle cx="38" cy="40" r="6" fill="#fbcfe8"/>
      <circle cx="55" cy="40" r="11" fill="#9ca3af" stroke="#2a2118" stroke-width="3"/>
      <circle cx="55" cy="40" r="6" fill="#fbcfe8"/>
      <ellipse cx="42" cy="58" rx="20" ry="17" fill="#9ca3af" stroke="#2a2118" stroke-width="3"/>
      <circle cx="26" cy="64" r="3.5" fill="#fb7185" stroke="#2a2118" stroke-width="1.5"/>
      <circle cx="40" cy="54" r="2.6" fill="#2a2118"/>
      <circle cx="38" cy="52" r="1" fill="#fff"/>
      <line x1="16" y1="60" x2="30" y2="62" stroke="#2a2118" stroke-width="1.5"/>
      <line x1="16" y1="68" x2="30" y2="66" stroke="#2a2118" stroke-width="1.5"/>
      <ellipse cx="50" cy="84" rx="5" ry="3" fill="#6b7280" stroke="#2a2118" stroke-width="1.5"/>
      <ellipse cx="68" cy="84" rx="5" ry="3" fill="#6b7280" stroke="#2a2118" stroke-width="1.5"/>
    </svg>`
  },
  dinoEgg: {
    name: "Dino-ei", anim: "anim-wiggle", voice: "ping", hatches: "dino",
    svg: `<svg viewBox="0 0 100 100" class="core">
      <ellipse cx="50" cy="58" rx="32" ry="40" fill="#fde68a" stroke="#2a2118" stroke-width="3"/>
      <ellipse cx="40" cy="42" rx="10" ry="14" fill="#fef3c7" opacity=".8"/>
      <path d="M 22 50 Q 32 44 36 54 Q 46 48 50 60 Q 56 48 64 54 Q 70 44 78 50" fill="none" stroke="#a16207" stroke-width="2.5" stroke-linecap="round"/>
      <circle cx="40" cy="70" r="3" fill="#854d0e"/>
      <circle cx="58" cy="78" r="2.5" fill="#854d0e"/>
      <circle cx="38" cy="82" r="2" fill="#854d0e"/>
      <circle cx="62" cy="64" r="2.5" fill="#854d0e"/>
    </svg>`
  },
  dino: {
    name: "Dinosaurus", anim: "", voice: "boom", hidden: true, dino: true,
    speed: 1.7, range: 70,
    svg: `<svg viewBox="0 0 100 100" class="core">
      <path d="M 92 70 L 76 52 L 70 64 Z" fill="#16a34a" stroke="#2a2118" stroke-width="2.5"/>
      <ellipse cx="56" cy="62" rx="26" ry="18" fill="#22c55e" stroke="#2a2118" stroke-width="3"/>
      <path d="M 34 46 L 38 38 L 42 46 L 48 36 L 54 46 L 60 36 L 66 46 L 72 38 L 76 46" fill="#15803d" stroke="#2a2118" stroke-width="2" stroke-linejoin="round"/>
      <ellipse cx="26" cy="50" rx="20" ry="15" fill="#22c55e" stroke="#2a2118" stroke-width="3"/>
      <circle cx="18" cy="46" r="4" fill="#fff" stroke="#2a2118" stroke-width="1.5"/>
      <circle cx="17" cy="46" r="2.2" fill="#2a2118"/>
      <path d="M 6 54 L 28 56 L 26 60 L 8 58 Z" fill="#15803d" stroke="#2a2118" stroke-width="2"/>
      <path d="M 12 56 L 14 60 L 16 56 M 20 57 L 22 60 L 24 57" fill="#fff" stroke="#2a2118" stroke-width="1"/>
      <rect x="44" y="74" width="7" height="14" rx="2" fill="#16a34a" stroke="#2a2118" stroke-width="2"/>
      <rect x="64" y="74" width="7" height="14" rx="2" fill="#16a34a" stroke="#2a2118" stroke-width="2"/>
      <ellipse cx="56" cy="68" rx="16" ry="6" fill="#86efac" opacity=".7"/>
    </svg>`
  },
  tRexEgg: {
    name: "T-rex-ei", anim: "anim-wiggle", voice: "ping", hatches: "tRex", danger: true,
    svg: `<svg viewBox="0 0 100 100" class="core">
      <ellipse cx="50" cy="58" rx="32" ry="40" fill="#fca5a5" stroke="#2a2118" stroke-width="3"/>
      <ellipse cx="40" cy="42" rx="10" ry="14" fill="#fecaca" opacity=".8"/>
      <path d="M 22 50 Q 32 44 36 54 Q 46 48 50 60 Q 56 48 64 54 Q 70 44 78 50" fill="none" stroke="#7f1d1d" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M 30 32 L 36 38 L 32 44 L 40 48" fill="none" stroke="#7f1d1d" stroke-width="2" stroke-linecap="round"/>
      <path d="M 64 30 L 60 40 L 68 44" fill="none" stroke="#7f1d1d" stroke-width="2" stroke-linecap="round"/>
      <circle cx="40" cy="70" r="3" fill="#7f1d1d"/>
      <circle cx="58" cy="78" r="2.5" fill="#7f1d1d"/>
      <circle cx="62" cy="64" r="2.5" fill="#7f1d1d"/>
    </svg>`
  },
  tRex: {
    name: "T-rex", anim: "", voice: "boom", hidden: true, dino: true,
    speed: 2.5, range: 90,
    svg: `<svg viewBox="0 0 100 100" class="core">
      <!-- smooth S-curve tail -->
      <path d="M 28 54 C 12 50 0 62 2 76 C 4 90 14 92 22 84 C 26 78 30 70 36 64 Z" fill="#ef4444" stroke="#2a2118" stroke-width="3" stroke-linejoin="round"/>
      <!-- bold tail spikes -->
      <path d="M 6 80 L 10 73 L 14 81 L 18 73 L 22 80 L 26 73 L 30 78" fill="#fde68a" stroke="#2a2118" stroke-width="1.8" stroke-linejoin="round"/>
      <!-- pear body -->
      <path d="M 24 32 Q 18 56 24 72 Q 32 78 42 76 Q 56 68 60 46 Q 62 28 46 26 Q 30 26 24 32 Z" fill="#ef4444" stroke="#2a2118" stroke-width="3" stroke-linejoin="round"/>
      <!-- bold yellow back spikes (saw-tooth row) -->
      <path d="M 56 30 L 64 20 L 62 36 L 70 28 L 66 44 L 72 36 L 60 54" fill="#fde68a" stroke="#2a2118" stroke-width="2" stroke-linejoin="round"/>
      <!-- cream belly -->
      <path d="M 28 40 Q 22 58 28 72 Q 34 76 42 74 Q 50 66 50 40 Z" fill="#fef3c7" stroke="#2a2118" stroke-width="1.5" stroke-linejoin="round"/>
      <!-- BACK LEG (visible from y=68) -->
      <path d="M 44 68 L 42 88 Q 44 96 52 96 L 64 96 Q 66 88 58 68 Z" fill="#dc2626" stroke="#2a2118" stroke-width="2.5" stroke-linejoin="round"/>
      <ellipse cx="54" cy="96" rx="12" ry="3" fill="#dc2626" stroke="#2a2118" stroke-width="2"/>
      <path d="M 46 100 L 44 96 M 54 100 L 54 96 M 62 100 L 64 96" stroke="#2a2118" stroke-width="2" stroke-linecap="round"/>
      <!-- FRONT LEG (visible from y=64) -->
      <path d="M 26 64 L 24 88 Q 26 96 34 96 L 44 96 Q 46 88 40 64 Z" fill="#ef4444" stroke="#2a2118" stroke-width="2.5" stroke-linejoin="round"/>
      <ellipse cx="34" cy="96" rx="12" ry="3" fill="#ef4444" stroke="#2a2118" stroke-width="2"/>
      <path d="M 26 100 L 24 96 M 34 100 L 34 96 M 42 100 L 44 96" stroke="#2a2118" stroke-width="2" stroke-linecap="round"/>
      <!-- TINY arm held up at chest -->
      <path d="M 38 48 Q 46 48 46 56 Q 44 62 38 60 Z" fill="#ef4444" stroke="#2a2118" stroke-width="2" stroke-linejoin="round"/>
      <!-- 3 finger claws -->
      <path d="M 40 60 L 38 64 M 43 62 L 43 66 M 46 60 L 48 64" stroke="#2a2118" stroke-width="1.8" stroke-linecap="round"/>
      <!-- HEAD upper -->
      <path d="M 28 26 Q 32 6 54 4 Q 78 4 90 18 Q 96 28 86 32 L 48 34 Q 28 34 28 26 Z" fill="#ef4444" stroke="#2a2118" stroke-width="3" stroke-linejoin="round"/>
      <!-- LOWER JAW -->
      <path d="M 48 34 L 86 32 Q 90 42 76 46 Q 58 48 50 42 Q 46 38 48 34 Z" fill="#ef4444" stroke="#2a2118" stroke-width="3" stroke-linejoin="round"/>
      <!-- dark mouth -->
      <path d="M 52 34 Q 60 42 80 40 Q 84 36 82 32 Q 68 30 52 34 Z" fill="#7f1d1d"/>
      <!-- tongue -->
      <ellipse cx="66" cy="38" rx="6" ry="2.5" fill="#fb7185" stroke="#2a2118" stroke-width="1"/>
      <!-- 4 big upper teeth -->
      <path d="M 54 33 L 56 41 L 58 33 M 62 32 L 64 42 L 66 32 M 70 32 L 72 42 L 74 32 M 78 33 L 80 40 L 82 33" fill="#fff" stroke="#2a2118" stroke-width="1.2"/>
      <!-- lower teeth -->
      <path d="M 56 42 L 58 36 L 60 42 M 66 43 L 68 38 L 70 43 M 74 42 L 76 37 L 78 42" fill="#fff" stroke="#2a2118" stroke-width="1.2"/>
      <!-- BIG happy eye -->
      <ellipse cx="56" cy="16" rx="7" ry="7" fill="#fff" stroke="#2a2118" stroke-width="2"/>
      <ellipse cx="54" cy="17" rx="3" ry="3.5" fill="#2a2118"/>
      <circle cx="53" cy="15" r="1.5" fill="#fff"/>
      <!-- nostril -->
      <ellipse cx="78" cy="22" rx="1.5" ry="1" fill="#2a2118"/>
    </svg>`
  },
  cucumber: {
    name: "Komkommer", anim: "anim-shake-tiny", voice: "plink", cheese: true,
    svg: `<svg viewBox="0 0 100 100" class="core">
      <g transform="rotate(-22 50 50)">
        <ellipse cx="50" cy="50" rx="40" ry="14" fill="#15803d" stroke="#2a2118" stroke-width="3"/>
        <ellipse cx="50" cy="50" rx="36" ry="10" fill="#22c55e"/>
        <path d="M 22 50 Q 50 38 78 50" fill="none" stroke="#15803d" stroke-width="1.5" stroke-linecap="round"/>
        <path d="M 22 50 Q 50 62 78 50" fill="none" stroke="#15803d" stroke-width="1.5" stroke-linecap="round"/>
        <circle cx="30" cy="46" r="1.6" fill="#14532d"/>
        <circle cx="42" cy="44" r="1.4" fill="#14532d"/>
        <circle cx="54" cy="46" r="1.6" fill="#14532d"/>
        <circle cx="66" cy="44" r="1.4" fill="#14532d"/>
        <circle cx="36" cy="54" r="1.4" fill="#14532d"/>
        <circle cx="48" cy="56" r="1.6" fill="#14532d"/>
        <circle cx="60" cy="54" r="1.4" fill="#14532d"/>
        <circle cx="72" cy="55" r="1.4" fill="#14532d"/>
        <ellipse cx="34" cy="46" rx="14" ry="4" fill="#86efac" opacity=".5"/>
      </g>
    </svg>`
  },
  cheese: {
    name: "Kaas", anim: "anim-glow", voice: "ping", cheese: true,
    svg: `<svg viewBox="0 0 100 100" class="core">
      <path d="M 12 78 L 88 78 L 80 30 Z" fill="#fbbf24" stroke="#2a2118" stroke-width="3" stroke-linejoin="round"/>
      <path d="M 12 78 L 88 78 L 88 84 L 12 84 Z" fill="#d97706" stroke="#2a2118" stroke-width="2"/>
      <ellipse cx="35" cy="68" rx="4.5" ry="3" fill="#a16207"/>
      <ellipse cx="55" cy="58" rx="5" ry="3.5" fill="#a16207"/>
      <ellipse cx="68" cy="70" rx="3.5" ry="2.5" fill="#a16207"/>
      <ellipse cx="48" cy="74" rx="3" ry="2" fill="#a16207"/>
      <ellipse cx="72" cy="48" rx="3" ry="2.5" fill="#a16207"/>
    </svg>`
  },
  volcano: {
    name: "Vulkaan", anim: "anim-rumble", voice: "boom",
    erupts: true, fireproof: true, danger: true,
    svg: `<svg viewBox="0 0 100 100" class="core">
      <path d="M 6 92 L 34 25 L 66 25 L 94 92 Z" fill="#78350f" stroke="#2a2118" stroke-width="3"/>
      <path d="M 42 25 L 35 70 L 28 90" fill="none" stroke="#dc2626" stroke-width="3" stroke-linecap="round"/>
      <path d="M 58 25 L 65 65 L 72 88" fill="none" stroke="#dc2626" stroke-width="3" stroke-linecap="round"/>
      <ellipse cx="50" cy="26" rx="17" ry="4" fill="#1f2937" stroke="#2a2118" stroke-width="2"/>
      <ellipse cx="50" cy="25" rx="13" ry="3" fill="#dc2626"/>
      <ellipse cx="50" cy="24" rx="8" ry="2" fill="#fde047"/>
      <circle cx="48" cy="14" r="6" fill="#9ca3af" opacity="0.6"/>
      <circle cx="40" cy="6" r="4" fill="#d1d5db" opacity="0.5"/>
      <circle cx="58" cy="8" r="5" fill="#9ca3af" opacity="0.5"/>
    </svg>`
  }
};

export function buildBinGrid() {
  for (const [key, p] of Object.entries(PARTS)) {
    if (p.hidden) continue;
    const el = document.createElement("div");
    el.className = "bin-item" + (p.danger ? " danger" : "");
    el.dataset.kind = key;
    el.innerHTML = p.svg + `<span class="label">${p.name}</span>`;
    binGrid.appendChild(el);
  }
}
