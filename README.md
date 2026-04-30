# WFGY 5.0 — Avatar

> The flagship: governed avatar runtime, branchable behavior, multilingual calibration.

This is one of five extractions of the WFGY ecosystem (`wfgy-1` through `wfgy-5`), each focused on a single section of the original research. This project covers **Avatar**.

## Layout

| Path | Purpose |
| --- | --- |
| `paper.md` | The science paper for this section. |
| `SKILL.md` | Project-level skill manifest. |
| `skills/` | Per-capability skill files (recognition patterns, not procedures). |
| `wfgy-core/` | Original WFGY artifacts, copied verbatim. |
| `config/` and `src/theme.mjs` | Source for the GitHub Pages site (flatspace, no `package.json`). |
| `.github/workflows/build.yml` | CI that builds and publishes the site. |

## Site

The site is built with [flatspace](https://www.npmjs.com/package/flatspace) and pulls UI components directly from [`anentrypoint-design`](https://www.npmjs.com/package/anentrypoint-design) at its latest version, loaded from a CDN at runtime. There is no `package.json` and no install step; CI runs `npx --yes flatspace@latest build`.

## Original research

The contents of `wfgy-core/` are copied verbatim from the WFGY upstream and are the canonical research artifacts. Nothing in this project modifies them; everything here sits on top.
