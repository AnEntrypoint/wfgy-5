// Theme that actually mounts the anentrypoint-design (247420) SDK at runtime.
// No bundler. No package.json. CSS + ESM importmap from unpkg, then a small
// inline <script type="module"> that calls mount(...) with C.AppShell.
import fs from 'node:fs';
import path from 'node:path';

const DESIGN_CSS = 'https://unpkg.com/anentrypoint-design@latest/dist/247420.css';
const DESIGN_JS  = 'https://unpkg.com/anentrypoint-design@latest/dist/247420.js';

function inlineMarkdown(md) {
  const lines = md.split(/\r?\n/);
  const out = [];
  let buf = [];
  let inCode = false;
  const flush = () => { if (buf.length) { out.push({ text: buf.join(' ') }); buf = []; } };
  for (const line of lines) {
    if (line.startsWith('```')) { flush(); inCode = !inCode; continue; }
    if (inCode) { out.push({ text: line, kind: 'code' }); continue; }
    if (/^#{1,6}\s+/.test(line)) {
      flush();
      out.push({ text: line.replace(/^#+\s+/, ''), kind: 'h' });
      continue;
    }
    if (line.trim() === '') { flush(); continue; }
    if (line.startsWith('- ')) { flush(); out.push({ text: line.slice(2), kind: 'li' }); continue; }
    buf.push(line.trim());
  }
  flush();
  return out;
}

function readMarkdown(rel) {
  try { return fs.readFileSync(path.resolve(process.cwd(), rel), 'utf8'); }
  catch { return ''; }
}

function listOriginalArtifacts(rel) {
  try {
    const root = path.resolve(process.cwd(), rel);
    const entries = fs.readdirSync(root, { withFileTypes: true });
    return entries.map(e => ({
      name: e.name,
      kind: e.isDirectory() ? 'directory' : 'file',
    }));
  } catch { return []; }
}

const NAV = [
  ['home', './index.html'],
  ['paper', './paper.html'],
  ['highlights', './highlights.html'],
  ['research', './research.html'],
  ['skills', './skills.html'],
  ['original', './original.html'],
];

function pageBundle(site, nav, page, extras) {
  return JSON.stringify({
    site: { title: site.title, description: site.description, brand: site.brand || site.title },
    nav,
    page: {
      id: page.id,
      title: page.title,
      template: page.template,
      content: page.content,
      routes: page.routes,
      recovery: page.recovery,
      features: page.features,
      polaris: page.polaris,
      timeline: page.timeline,
      examples: page.examples,
    },
    extras,
  });
}

function renderShell(site, page, dataJson) {
  const fullTitle = page.id === 'home' ? site.title : `${page.title} — ${site.title}`;
  return `<!doctype html>
<html lang="en" class="ds-247420" data-theme="paper" data-density="comfortable">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="${page.content.description || site.description}">
  <meta name="author" content="${site.author}">
  <link rel="stylesheet" href="${DESIGN_CSS}">
  <script type="importmap">
    { "imports": { "anentrypoint-design": "${DESIGN_JS}" } }
  </script>
  <title>${fullTitle}</title>
  <style>
    /* Archive-specific theming */
    :root {
      --accent: var(--purple);
    }

    /* Category-based visual indicators. Rows carry rail-<tone> (SDK-native);
       these rules apply to any element we tag with a real data-cat attribute
       directly (see .cat-chip below), since Row/RowLink cannot carry one. */
    [data-cat="think"] { --cat-accent: var(--cat-purple); }
    [data-cat="kit"]   { --cat-accent: var(--cat-green); }
    [data-cat="doc"]   { --cat-accent: var(--cat-sky); }
    [data-cat="talk"]  { --cat-accent: var(--cat-mascot); }
    .cat-chip[data-cat] { border-left: 3px solid var(--cat-accent); padding-left: var(--space-2); }

    /* File type indicators (real SDK contract: dir|image|video|audio|code|text|archive|document|symlink|other) */
    .file-cell[data-file-type] { border-left: 3px solid transparent; padding-left: var(--space-2); }
    [data-file-type="dir"]     { border-left-color: var(--accent); }
    [data-file-type="text"]    { border-left-color: var(--sky); }
    [data-file-type="code"]    { border-left-color: var(--green-2); }
    [data-file-type="document"]{ border-left-color: var(--amber); }
    [data-file-type="other"]   { border-left-color: var(--fg-3); }
  </style>
</head>
<body>
  <div id="app"></div>
  <script type="module">
    import { mount, components as C, h } from 'anentrypoint-design';
    const data = ${dataJson};

    // cat (think/kit/doc/talk) -> Row's \`rail\` tone prop. \`rail\` is the SDK's
    // real, supported per-row accent mechanism (rail-<tone> class); a bare
    // data-cat prop passed into C.Row is silently dropped since Row
    // destructures a fixed prop list with no rest/spread, so it never reaches
    // the DOM.
    const CAT_RAIL = { think: 'purple', kit: 'green', doc: 'sky', talk: 'mascot' };

    const topbar = C.Topbar({
      brand: data.site.brand,
      leaf: data.page.id === 'home' ? '' : data.page.title,
      items: data.nav,
      active: data.page.id,
    });

    const crumb = C.Crumb({
      trail: ['wfgy', 'extractions'],
      leaf: data.page.id,
    });

    // Built inside the render loop (not hoisted like topbar/crumb) because
    // ThemeToggle's own label reflects current theme state and must refresh
    // when the toggle is clicked.
    function buildStatus(rerender) {
      return C.Status({
        left: ['main'],
        right: [C.ThemeToggle({ compact: true, onChange: () => rerender && rerender() }), 'live'],
      });
    }

    // Wraps a data-cat value onto a real DOM node -- Row/RowLink cannot carry
    // an arbitrary attribute (fixed prop destructure, no passthrough), so the
    // category tag renders as a small leading chip beside the row instead.
    function catChip(cat) {
      if (!cat) return null;
      return h('span', { class: 'cat-chip', 'data-cat': cat }, cat);
    }

    function itemsPanel(heading, panelTitle, items, mapFn) {
      return C.Section({
        title: heading,
        children: C.Panel({
          title: panelTitle,
          count: items.length,
          children: items.map(mapFn),
        }),
      });
    }

    function renderHome(p) {
      const features = p.features || p.content.features || {};
      const routes = p.routes || p.content.routes || {};
      const recovery = p.recovery || p.content.recovery || {};
      const polaris = p.polaris || p.content.polaris || {};
      const timeline = p.timeline || p.content.timeline || {};
      const examples = p.examples || p.content.examples || {};
      const c = p.content;

      const ctas = [{ label: c.cta_text || 'read the paper', href: c.cta_href, primary: true }];
      if (c.cta2_text && c.cta2_href) ctas.push({ label: c.cta2_text, href: c.cta2_href });

      return [
        C.HeroFromPageData({
          heading: c.heading,
          subheading: c.subheading,
          body: c.body,
          badges: c.badges,
          ctas,
        }),

        polaris.items ? itemsPanel(
          polaris.heading || '// the active flagship: polaris protocol',
          polaris.description || 'polaris components',
          polaris.items,
          (it, i) => C.Row({
            key: 'pl' + i,
            code: String(i + 1).padStart(2, '0'),
            title: it.name,
            sub: it.desc + (it.meta ? ' — ' + it.meta : ''),
            rail: CAT_RAIL[it.cat] || null,
            leading: catChip(it.cat),
          })
        ) : null,

        features.items ? itemsPanel(
          features.heading || '// why avatar is different',
          'eight structural differences',
          features.items,
          (it, i) => C.Row({
            key: 'f' + i,
            code: String(i + 1).padStart(2, '0'),
            title: it.name,
            sub: it.desc,
            rail: CAT_RAIL[it.cat] || null,
          })
        ) : null,

        routes.items ? itemsPanel(
          routes.heading || '// public boot routes',
          'three routes, one runtime',
          routes.items,
          (it, i) => C.Row({
            key: 'r' + i,
            code: String(i + 1).padStart(2, '0'),
            title: it.name,
            sub: it.desc + ' — ' + it.meta,
            rail: CAT_RAIL[it.cat] || null,
          })
        ) : null,

        recovery.items ? itemsPanel(
          recovery.heading || '// recovery surface',
          'restore after corruption or drift',
          recovery.items,
          (it, i) => C.Row({
            key: 'rc' + i,
            code: String(i + 1).padStart(2, '0'),
            title: it.name,
            sub: it.desc,
            rail: CAT_RAIL[it.cat] || null,
          })
        ) : null,

        timeline.items ? itemsPanel(
          timeline.heading || '// shipped history',
          timeline.description || 'release timeline',
          timeline.items,
          (it, i) => C.Row({
            key: 'tl' + i,
            code: it.meta || String(i + 1).padStart(2, '0'),
            title: it.name,
            sub: it.desc,
            rail: CAT_RAIL[it.cat] || null,
          })
        ) : null,

        examples.items ? C.Section({
          title: examples.heading || '// explore',
          children: C.PanelFromItems({
            heading: 'pages',
            count: examples.items.length,
            keyPrefix: 'e',
            items: examples.items.map(it => ({ title: it.name, sub: '', meta: it.cta || 'open', href: it.href })),
          }),
        }) : null,
      ].filter(Boolean);
    }

    function renderPaper(p) {
      const blocks = data.extras.paperBlocks || [];
      const sections = [];
      let current = { title: p.content.heading, paragraphs: [] };
      for (const b of blocks) {
        if (b.kind === 'h') {
          if (current.paragraphs.length) sections.push(current);
          current = { title: b.text, paragraphs: [] };
        } else if (b.kind === 'li') {
          current.paragraphs.push({ text: '• ' + b.text });
        } else if (b.kind === 'code') {
          current.paragraphs.push({ text: b.text, dim: true });
        } else {
          current.paragraphs.push({ text: b.text });
        }
      }
      if (current.paragraphs.length) sections.push(current);
      return [
        C.Hero({
          title: p.content.heading,
          body: 'The complete Avatar research archive, preserved for study and historical continuity.',
          accent: '47 documents.',
        }),
        ...sections.map(s =>
          C.Section({
            title: s.title,
            children: C.Manifesto({ paragraphs: s.paragraphs, maxWidth: 760 }),
          })
        ),
      ];
    }

    function renderHighlights(p) {
      const items = p.content.items || [];
      return [
        C.Hero({
          title: p.content.heading,
          body: p.content.description,
          accent: '8 structural signals.',
        }),
        itemsPanel(
          '// archive essence',
          'Avatar research highlights',
          items,
          (it, i) => C.Row({
            key: i,
            code: String(i + 1).padStart(2, '0'),
            title: it.name,
            sub: it.desc + (it.detail ? ' — ' + it.detail : ''),
            rail: CAT_RAIL[it.cat] || null,
          })
        ),
      ];
    }

    // Groups items by cat, renders one filterable panel per category, plus a
    // FilterPills control that toggles visibility client-side via re-render.
    function renderByCategory(p, items, catLabel, defaultCat, keyPrefix, toRow) {
      const bycat = { think: [], kit: [], doc: [], talk: [] };
      for (const it of items) {
        const c = it.cat || defaultCat;
        if (!bycat[c]) bycat[c] = [];
        bycat[c].push(it);
      }
      let activeFilter = null;
      return (rerender) => {
        const options = Object.keys(bycat).filter(c => bycat[c].length).map(c => ({ id: c, label: c }));
        const filterPills = C.FilterPills({
          options,
          selected: activeFilter,
          label: 'filter by category',
          onSelect: (id) => { activeFilter = activeFilter === id ? null : id; rerender && rerender(); },
        });
        const sections = Object.entries(bycat)
          .filter(([cat, catItems]) => catItems.length && (!activeFilter || activeFilter === cat))
          .map(([cat, catItems]) =>
            itemsPanel(catLabel[cat] || ('// ' + cat), cat + ' layer', catItems,
              (it, i) => toRow(it, i, cat, keyPrefix))
          );
        return [
          C.Hero({
            title: p.content.heading,
            body: p.content.description,
            accent: items.length + (items.length === 1 ? ' item.' : ' items.'),
          }),
          filterPills,
          ...sections,
        ];
      };
    }

    function renderResearch(p) {
      const items = p.content.items || [];
      const catLabel = { think: '// reasoning + architecture', kit: '// runtime + engineering', doc: '// governance + law', talk: '// persona + recovery' };
      return renderByCategory(p, items, catLabel, 'doc', 'res', (it, i, cat, kp) => C.Row({
        key: kp + cat + i,
        code: String(i + 1).padStart(2, '0'),
        title: it.name,
        sub: it.desc,
        rail: CAT_RAIL[it.cat] || null,
      }));
    }

    function renderSkills(p) {
      const items = p.content.items || [];
      const catLabel = { think: '// reasoning & design', kit: '// engineering & operations', doc: '// governance & law', talk: '// recovery & continuity' };
      // RowLink is a thin wrapper with a fixed prop list (code/title/sub/meta/
      // href/key/target) that does not forward rail -- using Row directly
      // with kind:link gets both the link behavior and the category tone.
      return renderByCategory(p, items, catLabel, 'think', 'sk', (it, i, cat, kp) => C.Row({
        key: kp + cat + i,
        kind: 'link',
        code: String(i + 1).padStart(2, '0'),
        title: it.name,
        sub: it.description,
        meta: 'github',
        href: it.href || '#',
        rail: CAT_RAIL[it.cat] || null,
      }));
    }

    function renderOriginal(p) {
      const items = data.extras.originalArtifacts || [];
      const pageItems = p.content.items || items;
      const getFileType = (item) => {
        if (item.kind === 'directory') return 'dir';
        if (item.name.endsWith('.md')) return 'text';
        if (item.name.endsWith('.yaml') || item.name.endsWith('.yml')) return 'text';
        if (item.name.endsWith('.json')) return 'text';
        return 'other';
      };
      return [
        C.Hero({
          title: p.content.heading,
          body: p.content.description,
          accent: 'complete Avatar research library.',
        }),
        C.Section({
          title: '// wfgy-core archive',
          children: C.Panel({
            title: 'Original research artifacts',
            count: pageItems.length,
            children: pageItems.map((it, i) => {
              const ft = getFileType(it);
              return h('div', { key: i, class: 'file-cell', 'data-file-type': ft },
                C.Row({
                  code: it.kind === 'directory' ? '/' : ft.charAt(0).toUpperCase(),
                  title: it.name,
                  sub: it.kind === 'directory' ? 'folder' : ft,
                  rail: CAT_RAIL[it.cat] || null,
                })
              );
            }),
          }),
        }),
      ];
    }

    const renderers = {
      home: renderHome,
      paper: renderPaper,
      highlights: renderHighlights,
      research: renderResearch,
      skills: renderSkills,
      original: renderOriginal,
    };
    const renderer = renderers[data.page.id] || renderers[data.page.template] || renderHome;
    // Call the page renderer exactly once, outside the mount render loop, so
    // a stateful renderer (renderByCategory's activeFilter closure) survives
    // across re-renders. Calling renderer(data.page) fresh inside viewFn would
    // reset that closure -- and any local state -- on every re-render.
    const mainResult = renderer(data.page);

    mount(document.getElementById('app'), (rerender) => {
      const main = typeof mainResult === 'function' ? mainResult(rerender) : mainResult;
      return C.AppShell({ topbar, crumb, main, status: buildStatus(rerender) });
    });
  </script>
</body>
</html>`;
}

export default {
  render: async (ctx) => {
    const site = ctx.readGlobal('site');
    const { docs: pages } = ctx.read('pages');

    const outputs = [];
    for (const page of pages) {
      const extras = {};
      if (page.id === 'paper' && page.content && page.content.source) {
        extras.paperBlocks = inlineMarkdown(readMarkdown(page.content.source));
      }
      if (page.id === 'original' && page.content && page.content.source) {
        extras.originalArtifacts = listOriginalArtifacts(page.content.source);
      }
      const dataJson = pageBundle(site, NAV, page, extras);
      outputs.push({
        path: page.id === 'home' ? 'index.html' : `${page.id}.html`,
        html: renderShell(site, page, dataJson),
      });
    }
    return outputs;
  },
};
