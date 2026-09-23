/**
 * Post-build step: writes a static, per-route copy of dist/index.html with the
 * correct <title>/description/canonical/Open Graph/Twitter tags baked in.
 *
 * Why: this is a client-side SPA - Seo.tsx only updates document.head via a
 * React effect after JS runs. Search engines that execute JS (Google) are
 * fine either way, but crawlers that DON'T execute JS (many social share
 * scrapers - Slack, Discord, LinkedIn, older bots) only ever see the single
 * root dist/index.html, so every shared tool link previewed with the
 * homepage's title/description instead of its own. This script generates
 * `dist/<route>/index.html` for every route in the sitemap so a direct
 * request to that path gets accurate metadata without executing any JS.
 * React Router's client-side navigation between tools is unaffected - this
 * only changes what a fresh, non-JS request to that URL receives.
 *
 * Run via `npm run build` (chained after `vite build`).
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { SECTIONS, TOOLS, getToolsBySection } from '../src/lib/tools.ts';

const __dirname = dirname(fileURLToPath(import.meta.url));
const distDir = join(__dirname, '..', 'dist');
const templatePath = join(distDir, 'index.html');

// Read directly from process.env (not src/lib/seo.ts) - import.meta.env is a Vite-only
// construct and doesn't exist when this script runs standalone under tsx/Node.
const SITE_NAME = 'Toolzy';
const SITE_URL = (process.env.VITE_SITE_URL ?? 'https://www.toolzy.app').replace(/\/$/, '');

interface RouteMeta {
  path: string;
  title: string;
  description: string;
}

const staticRoutes: RouteMeta[] = [
  {
    path: '/premium',
    title: 'Support Toolzy - Free Online Tools',
    description: "Support Toolzy's free, privacy-first PDF tools, converters, calculators and text utilities.",
  },
  {
    path: '/about',
    title: 'About Us',
    description: `Why ${SITE_NAME} exists and how its free, in-browser tools work.`,
  },
  {
    path: '/privacy',
    title: 'Privacy Policy',
    description: `How ${SITE_NAME} handles your data, cookies and advertising.`,
  },
  {
    path: '/terms',
    title: 'Terms of Service',
    description: `The terms that apply when you use ${SITE_NAME}'s free online tools.`,
  },
];

const sectionRoutes: RouteMeta[] = SECTIONS.map((section) => ({
  path: section.path,
  title: `${section.label} - Free Online Tools`,
  description: `${section.description} ${getToolsBySection(section.id).length} free tools, running entirely in your browser - no sign-up, no uploads.`,
}));

const toolRoutes: RouteMeta[] = TOOLS.map((tool) => ({
  path: `/tools/${tool.slug}`,
  title: tool.name,
  description: tool.description,
}));

const routes = [...staticRoutes, ...sectionRoutes, ...toolRoutes];

function escapeHtml(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function setTitle(html: string, title: string): string {
  return html.replace(/<title>[^<]*<\/title>/, `<title>${escapeHtml(title)}</title>`);
}

function setMetaContent(html: string, attr: 'name' | 'property', key: string, value: string): string {
  const re = new RegExp(`(<meta\\s+${attr}="${key.replace(/:/g, '\\:')}"[^>]*content=")[^"]*(")`, 'i');
  return html.replace(re, `$1${escapeHtml(value)}$2`);
}

function setLinkHref(html: string, rel: string, href: string): string {
  const re = new RegExp(`(<link\\s+rel="${rel}"\\s+href=")[^"]*(")`, 'i');
  return html.replace(re, `$1${escapeHtml(href)}$2`);
}

/** Nested index.html files need absolute asset paths - "./assets/x.js" only resolves from "/". */
function toAbsoluteAssetPaths(html: string): string {
  return html.replace(/="\.\//g, '="/');
}

function render(template: string, route: RouteMeta): string {
  const fullTitle = `${route.title} | ${SITE_NAME}`;
  const url = `${SITE_URL}${route.path}`;

  let html = template;
  html = setTitle(html, fullTitle);
  html = setMetaContent(html, 'name', 'description', route.description);
  html = setMetaContent(html, 'property', 'og:title', fullTitle);
  html = setMetaContent(html, 'property', 'og:description', route.description);
  html = setMetaContent(html, 'property', 'og:url', url);
  html = setMetaContent(html, 'name', 'twitter:title', fullTitle);
  html = setMetaContent(html, 'name', 'twitter:description', route.description);
  html = setLinkHref(html, 'canonical', url);
  html = toAbsoluteAssetPaths(html);
  return html;
}

function main() {
  if (!existsSync(templatePath)) {
    console.error(`[prerender-seo] ${templatePath} not found - run "vite build" first.`);
    process.exitCode = 1;
    return;
  }

  const template = readFileSync(templatePath, 'utf8');
  let written = 0;

  for (const route of routes) {
    const outDir = join(distDir, route.path.replace(/^\//, ''));
    mkdirSync(outDir, { recursive: true });
    writeFileSync(join(outDir, 'index.html'), render(template, route));
    written += 1;
  }

  console.log(`[prerender-seo] wrote ${written} static route(s) with per-page metadata.`);
}

main();
