// Pulls anentrypoint-design (the AnEntrypoint design system) directly from
// the npm CDN at the latest version. No build step, no package.json, no install.
import fs from 'node:fs';
import path from 'node:path';

const DESIGN_CDN = 'https://esm.sh/anentrypoint-design@latest/dist/247420.js';
const DESIGN_CSS = 'https://esm.sh/anentrypoint-design@latest/dist/247420.css';

const head = (site, pageTitle, pageId, pageDescription) => {
  const fullTitle = pageId === 'home' ? site.title : pageTitle + ' — ' + site.title;
  const description = pageDescription || site.description;
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="${description}">
  <meta name="author" content="${site.author}">
  <meta name="keywords" content="${site.keywords.join(', ')}">
  <link rel="stylesheet" href="${DESIGN_CSS}">
  <script type="module" src="${DESIGN_CDN}"></script>
  <title>${fullTitle}</title>
</head>`;
};

const navbar = (site, navigation) => {
  const link = (h) => h === '/' ? './index.html' : (h.startsWith('/') ? '.' + h + '.html' : h);
  const brand = site.title.split('—')[0].trim();
  return `<nav class="navbar bg-base-100 border-b border-base-300 sticky top-0 z-50">
  <div class="container mx-auto flex items-center justify-between px-4 py-3">
    <a href="./index.html" class="text-xl font-bold">${brand}</a>
    <div class="flex gap-2">
      ${navigation.map(item => `<a href="${link(item.href)}" class="btn btn-ghost btn-sm">${item.text}</a>`).join('')}
    </div>
  </div>
</nav>`;
};

const footerHtml = (nav) => `<footer class="bg-base-200 border-t border-base-300 py-10 mt-20">
  <div class="container mx-auto px-4">
    <p class="text-base-content/70">${nav.footer.text}</p>
    <div class="flex gap-4 mt-3 text-sm">
      ${nav.footer.social.map(s => `<a href="${s.url}" class="link link-hover">${s.name}</a>`).join('')}
    </div>
  </div>
</footer>`;

const components = {
  hero: (page) => `<section class="hero min-h-[60vh] bg-gradient-to-br from-base-200 to-base-300">
    <div class="hero-content text-center">
      <div class="max-w-2xl">
        <h1 class="text-5xl font-bold mb-6">${page.content.heading}</h1>
        <p class="text-xl mb-8 text-base-content/80">${page.content.subheading}</p>
        <a href="${page.content.cta_href || './paper.html'}" class="btn btn-primary btn-lg">${page.content.cta_text}</a>
      </div>
    </div>
  </section>`,

  longform: (page) => `<section class="container mx-auto px-4 py-16 max-w-4xl">
    <h1 class="text-4xl font-bold mb-4">${page.content.heading}</h1>
    <p class="text-lg text-base-content/70 mb-10">${page.content.description}</p>
    <article class="prose prose-lg max-w-none">${page.content.body || ''}</article>
  </section>`,

  grid: (page) => `<section class="container mx-auto px-4 py-16">
    <h1 class="text-4xl font-bold mb-4">${page.content.heading}</h1>
    <p class="text-lg text-base-content/70 mb-10">${page.content.description}</p>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      ${(page.content.items || []).map(item => `<div class="card bg-base-100 border border-base-300 shadow-sm">
        <div class="card-body">
          <h3 class="card-title">${item.name}</h3>
          <p class="text-base-content/70">${item.description}</p>
        </div>
      </div>`).join('')}
    </div>
  </section>`,
};

const baseTemplate = (content, site, nav, pageTitle, pageId, pageDescription) =>
  head(site, pageTitle, pageId, pageDescription) +
  '<body>' +
  navbar(site, nav.navigation) +
  content +
  footerHtml(nav) +
  '</body></html>';

function inlineMarkdown(md) {
  const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const lines = md.split(/\r?\n/);
  const out = [];
  let inCode = false;
  for (const line of lines) {
    if (line.startsWith('```')) { inCode = !inCode; out.push(inCode ? '<pre><code>' : '</code></pre>'); continue; }
    if (inCode) { out.push(esc(line)); continue; }
    const h = line.match(/^(#{1,6})\s+(.*)/);
    if (h) { const n = h[1].length; out.push(`<h${n}>${esc(h[2])}</h${n}>`); continue; }
    if (line.trim() === '') { out.push(''); continue; }
    if (line.startsWith('- ')) { out.push('<li>' + esc(line.slice(2)) + '</li>'); continue; }
    out.push('<p>' + esc(line) + '</p>');
  }
  return out.join('\n');
}

export default {
  render: async (ctx) => {
    const site = ctx.readGlobal('site');
    const nav = ctx.readGlobal('navigation');
    const { docs: pages } = ctx.read('pages');

    for (const page of pages) {
      if (page.template === 'longform' && page.content && page.content.source) {
        const src = page.content.source;
        if (src.endsWith('.md')) {
          try {
            const md = fs.readFileSync(path.resolve(process.cwd(), src), 'utf8');
            page.content.body = inlineMarkdown(md);
          } catch (_) { page.content.body = '<p><em>Source not found at build time.</em></p>'; }
        } else if (src.endsWith('/')) {
          try {
            const dir = path.resolve(process.cwd(), src);
            const list = fs.readdirSync(dir);
            page.content.body = '<ul>' + list.map(e => `<li><code>${e}</code></li>`).join('') + '</ul>';
          } catch (_) { page.content.body = '<p><em>No artifacts directory at build time.</em></p>'; }
        }
      }
    }

    const outputs = [];
    pages.forEach((page) => {
      const t = components[page.template];
      if (!t) return;
      outputs.push({
        path: page.id === 'home' ? 'index.html' : `${page.id}.html`,
        html: baseTemplate(t(page), site, nav, page.title, page.id, page.content.description),
      });
    });
    return outputs;
  }
};
