# wfgy-5 — Polaris Protocol site

Flatspace-built static site exposing onestardao/WFGY's Polaris Protocol and
Fifth-Dimension Engine (WFGY 5.0), plus a portable Claude Code skill tree
adapting WFGY's reasoning discipline.

## Structure

- `wfgy-core/Polaris/` — files copied **verbatim** from `onestardao/WFGY`'s
  `Polaris/` tree (currently the 4 top-level READMEs: root, `engine/
  fifth-dimension-engine/`, `experiments/`, `protocols/goal-compiler/`, plus
  `protocols/goal-compiler/POLARIS_GOAL_COMPILER.txt` which is locally
  authored, not upstream). Verbatim means byte-identical blob content —
  never hand-edit a vendored file; re-copy from upstream instead. Check
  upstream's blob SHA against the local file's `git hash-object` before
  claiming sync.
- `skills/` — portable Claude Code Agent Skills (`wfgy-method`,
  `polaris-protocol`, `polaris-goal-compiler`, `fifth-dimension-engine`)
  adapting WFGY's core reasoning discipline for any project's own
  multi-step work. `skills/POLARIS-SKILLS-GUIDE.md` indexes them.
- `paper.md` — the science paper covering Polaris mechanisms; derived
  content, not vendored, so it can drift from upstream and needs its own
  review when upstream's Polaris docs change.
- `src/theme.mjs`, `config/` — flatspace site source (theme + per-page
  YAML config) that builds into `dist/`.

## Build

```
npx --yes flatspace@latest build
```

Builds the site into `dist/`, published to GitHub Pages. No local
`package.json` — flatspace is invoked directly via `npx`.

## Upstream sync

`onestardao/WFGY` is the source of truth for the 4 vendored READMEs.
Checking for upstream progress means comparing blob SHAs (`gh api
repos/onestardao/WFGY/contents/<path>?ref=main`) against local
`git hash-object`, and scanning recent commit history for anything
beyond the repo's own automated bot commits (ecosystem-metrics/
problemmap-scan/recognition-scan land multiple times daily and carry no
content signal). A real sync-worthy change is a non-bot commit touching
`Polaris/`, or a new release beyond `v5.0.0-teaser-01`.

## Constraints

- No standing test files, ever — verify by actually running
  `npx --yes flatspace@latest build` and inspecting `dist/` output
  directly, not by authoring a `test.js`/`*.test.*` harness.
