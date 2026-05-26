# Gekke Machine Werkplaats (Mad Machine Workshop)

## Workflow

- After any code change, run `npm run build` to refresh `docs/`, then commit both the source change and the rebuilt `docs/` together. The compiled `docs/` is part of every commit — never commit source changes without rebuilding first.
- Then push to `origin/main` without asking. GitHub Pages serves from `main` branch `/docs` folder at https://milanzor.github.io/mad-machine/, so pushing the rebuilt `docs/` is part of "done."

## Build

- Vite is the build tool. Source: `index.html` (root) + `src/*.js` + `src/style.css`. Output: `docs/` with split, hashed JS + CSS bundles.
- `npm run dev` — local dev server with HMR.
- `npm run build` — produces `docs/`. Must be re-run before every commit.

## Language

- All user-facing strings are in **Dutch**. New parts, themes, modal text, button labels, hint copy, machine-name fragments, error messages — all Dutch. Keep code identifiers (PART keys, function names, classes) in English.
