## 2026-07-07
- Surface the complete original WFGY archive as real, organized pages instead of hand-summarized YAML paraphrases: `buildArchiveManifest()` walks all 5 wfgy-core/Avatar directories (research, highlights, docs, eval, community) and a new `markdownToHtml()` parser generates one real page per document (67 content docs + 5 hub pages = 72 pages), plus a direct `avatar.txt` download and a root README page.
- New markdown parser handles headings, paragraphs, ordered/unordered lists, blockquotes, horizontal rules, tables, code fences, and inline bold/italic/code/link spans; strips `AI_NOTE` HTML-comment headers; preserves original emoji verbatim as third-party archived source content.
- `resolveArchiveLink()` rewrites every source-relative `./x.md`/`../y/z.md` cross-reference to its generated page URL — crawled all 72 pages and checked 3077 internal links, zero broken.
- Fixed a real bug: `highlights.yaml`'s `name` field is a human Title-Case label that doesn't match the real kebab-case file slug (unlike `research.yaml`, where they happen to be identical) — added an explicit `slug` field per item so all 8 highlights links resolve.
- Rewrote `original.html` from a flat 8-item hardcoded directory list into a real file browser: 5 sections with live document counts plus direct downloads for `avatar.txt` and the root README.

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

