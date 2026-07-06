## 2026-07-06
- Research onestardao/WFGY upstream (releases API, Avatar/README.md, main README) to bring site content current: confirmed Polaris Protocol is the real active flagship (WFGY 5.0 Polaris Protocol), with two named shipped components (Polaris Goal Compiler, Fifth-Dimension Engine) previously absent from the site entirely.
- Corrected an unverifiable "Avatar archived May 5" claim (no such dated announcement exists upstream; May 5 is the CFV Easter Egg release date) with a real 6-entry release timeline (v1.0 through v5.0.0-teaser-01).
- Added WFGY acronym meaning (Wan Fa Gui Yi) and a core-mechanisms explainer (Delta-S drift measurement, BBMC/BBPF/BBCR/BBAM) to paper.md, plus a caveat that published benchmark figures are self-reported/unverified.
- Fixed real bugs surfaced by auditing the anentrypoint-design SDK: Row/RowLink silently drop any `data-cat`/`data-file-type` prop (fixed rest-free destructure) so these attributes never reached the DOM — category coloring now uses Row's real `rail` prop; file-type on original.html uses `dir` (not `directory`) matching the SDK's actual contract, applied via a wrapping element. Hero's unsupported `accentHref` prop replaced with `HeroFromPageData`'s `ctas`. Removed a dead `--prose-stack-md` token override that never existed in the SDK.
- Added a working `ThemeToggle` and interactive `FilterPills` (research/skills pages) — fixed a state-loss bug where the page renderer was re-invoked fresh inside `mount`'s render loop, resetting the category-filter closure on every click.
- Verified live in browser across all 6 pages: zero console errors, correct row/rail/pill counts, working click-to-filter and theme-cycle interactions.

## 2026-05-03
- Fix broken skill hrefs: all 12 skill items now link to upstream GitHub repo (onestardao/WFGY/tree/main/Avatar)
- Add test.js: 8 assertions covering build output invariants (nav, hrefs, research grouping, highlights content)

