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
      examples: page.examples,
    },
    extras,
  });
}

function renderShell(site, page, dataJson) {
  const fullTitle = page.id === 'home' ? site.title : `${page.title} — ${site.title}`;
  return `<!doctype html>
<html lang="en" class="ds-247420" data-theme="light">
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
</head>
<body>
  <div id="app"></div>
  <script type="module">
    import { mount, components as C } from 'anentrypoint-design';
    const data = ${dataJson};

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

    const status = C.Status({
      left: ['main'],
      right: ['live'],
    });

    function renderHome(p) {
      const features = p.features || p.content.features || {};
      const routes = p.routes || p.content.routes || {};
      const recovery = p.recovery || p.content.recovery || {};
      const examples = p.examples || p.content.examples || {};
      const c = p.content;

      return [
        C.Hero({
          title: c.heading,
          body: c.body || c.subheading,
          badges: c.badges,
          accent: '— ' + (c.cta_text || 'read the paper'),
          accentHref: c.cta_href,
        }),

        features.items ? C.Section({
          title: features.heading || '// why avatar is different',
          children: C.Panel({
            title: 'eight structural differences',
            count: features.items.length,
            children: features.items.map((it, i) =>
              C.Row({
                key: i,
                code: String(i + 1).padStart(2, '0'),
                title: it.name,
                sub: it.desc,
                'data-cat': it.cat || '',
              })
            ),
          }),
        }) : null,

        routes.items ? C.Section({
          title: routes.heading || '// public boot routes',
          children: C.Panel({
            title: 'three routes, one runtime',
            count: routes.items.length,
            children: routes.items.map((it, i) =>
              C.Row({
                key: i,
                code: String(i + 1).padStart(2, '0'),
                title: it.name,
                sub: it.desc + ' — ' + it.meta,
                'data-cat': it.cat || '',
              })
            ),
          }),
        }) : null,

        recovery.items ? C.Section({
          title: recovery.heading || '// recovery surface',
          children: C.Panel({
            title: 'restore after corruption or drift',
            count: recovery.items.length,
            children: recovery.items.map((it, i) =>
              C.Row({
                key: i,
                code: String(i + 1).padStart(2, '0'),
                title: it.name,
                sub: it.desc,
                'data-cat': it.cat || '',
              })
            ),
          }),
        }) : null,

        examples.items ? C.Section({
          title: examples.heading || '// explore',
          children: C.Panel({
            title: 'pages',
            count: examples.items.length,
            children: examples.items.map((it, i) =>
              C.RowLink({
                key: i,
                code: String(i + 1).padStart(2, '0'),
                title: it.name,
                sub: '',
                meta: it.cta || 'open',
                href: it.href,
                'data-cat': it.cat || '',
              })
            ),
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
      return sections.map(s =>
        C.Section({
          title: s.title,
          children: C.Manifesto({ paragraphs: s.paragraphs, maxWidth: 760 }),
        })
      );
    }

    function renderHighlights(p) {
      const items = p.content.items || [];
      return [
        C.Hero({
          title: p.content.heading,
          body: p.content.description,
          accent: '8 structural signals.',
        }),
        C.Section({
          title: '// eight things',
          children: C.Panel({
            title: 'flagship concepts',
            count: items.length,
            children: items.map((it, i) =>
              C.Row({
                key: i,
                code: String(i + 1).padStart(2, '0'),
                title: it.name,
                sub: it.desc + (it.detail ? ' — ' + it.detail : ''),
                'data-cat': it.cat || '',
              })
            ),
          }),
        }),
      ];
    }

    function renderResearch(p) {
      const items = p.content.items || [];
      const bycat = { think: [], kit: [], doc: [], talk: [] };
      for (const it of items) {
        const c = it.cat || 'doc';
        if (!bycat[c]) bycat[c] = [];
        bycat[c].push(it);
      }
      const catLabel = { think: '// reasoning + architecture', kit: '// runtime + engineering', doc: '// governance + law', talk: '// persona + recovery' };
      const sections = [];
      for (const [cat, catItems] of Object.entries(bycat)) {
        if (!catItems.length) continue;
        sections.push(
          C.Section({
            title: catLabel[cat] || ('// ' + cat),
            children: C.Panel({
              title: cat + ' layer',
              count: catItems.length,
              children: catItems.map((it, i) =>
                C.Row({
                  key: cat + i,
                  code: String(i + 1).padStart(2, '0'),
                  title: it.name,
                  sub: it.desc,
                  'data-cat': it.cat || '',
                })
              ),
            }),
          })
        );
      }
      return [
        C.Hero({
          title: p.content.heading,
          body: p.content.description,
          accent: items.length + ' documents.',
        }),
        ...sections,
      ];
    }

    function renderSkills(p) {
      const items = p.content.items || [];
      return [
        C.Hero({
          title: p.content.heading,
          body: p.content.description,
          accent: 'recognition patterns, not procedures.',
        }),
        C.Section({
          title: '// capabilities',
          children: C.Panel({
            title: 'skills in this extraction',
            count: items.length,
            children: items.map((it, i) =>
              C.RowLink({
                key: i,
                code: String(i + 1).padStart(2, '0'),
                title: it.name,
                sub: it.description,
                meta: 'open',
                href: it.href || '#',
                'data-cat': it.cat || '',
              })
            ),
          }),
        }),
      ];
    }

    function renderOriginal(p) {
      const items = data.extras.originalArtifacts || [];
      const pageItems = p.content.items || items;
      return [
        C.Hero({
          title: p.content.heading,
          body: p.content.description,
          accent: 'copied verbatim from the upstream WFGY repository.',
        }),
        C.Section({
          title: '// artifacts',
          children: C.Panel({
            title: 'wfgy-core/',
            count: pageItems.length,
            children: pageItems.map((it, i) =>
              C.Row({
                key: i,
                code: it.kind === 'directory' ? 'dir' : 'file',
                title: it.name,
                sub: '',
                'data-cat': it.cat || '',
              })
            ),
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

    mount(document.getElementById('app'), () => C.AppShell({
      topbar,
      crumb,
      main: renderer(data.page),
      status,
    }));
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
