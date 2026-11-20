#!/usr/bin/env node
/* Render a page in both themes at five widths and check it.
 *
 *   npm i -D playwright-core axe-core        (once, in any folder; no browser download needed if Chromium exists)
 *   node verify-render.mjs --url http://localhost:5173 --out ./shots
 *
 * Flags
 *   --widths 375,768,1280,1440,1920   --height 900
 *   --chrome /path/to/chrome          (auto-detects /opt/pw-browsers/chromium-* and common names)
 *   --theme-mode class|attr|both      how the app switches theme (default both: sets .dark AND data-theme)
 *   --no-axe                          skip the accessibility scan
 *
 * Checks per (theme x width): horizontal overflow, console/page errors, full-page screenshot.
 * Checks per theme at 1280 and 375: axe-core WCAG 2.0/2.1 A + AA.
 * Exit code 1 on overflow, page errors, or serious/critical axe violations.
 * Note: axe reports translucent/overlaid backgrounds (tints, glass) as "incomplete", not as a pass.
 *       Run scripts/contrast.py for the token-level truth; use axe for everything else.
 */
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

// resolve playwright-core / axe-core from the folder you run this in (not from this script's folder)
const require = createRequire(path.join(process.cwd(), 'noop.js'));
let chromium;
try { ({ chromium } = require('playwright-core')); }
catch { console.error('playwright-core not found here. Run: npm i -D playwright-core axe-core'); process.exit(2); }
const arg = (n, d) => { const i = process.argv.indexOf('--' + n); return i > -1 ? process.argv[i + 1] : d; };
const flag = (n) => process.argv.includes('--' + n);

const url = arg('url');
if (!url) { console.error('usage: node verify-render.mjs --url <url> [--out dir]'); process.exit(2); }
const out = arg('out', './shots');
const widths = arg('widths', '375,768,1280,1440,1920').split(',').map(Number);
const height = Number(arg('height', '900'));
const mode = arg('theme-mode', 'both');
fs.mkdirSync(out, { recursive: true });

function findChrome() {
  const given = arg('chrome', process.env.PW_CHROMIUM);
  if (given) return given;
  const base = '/opt/pw-browsers';
  if (fs.existsSync(base)) {
    for (const d of fs.readdirSync(base).filter((x) => x.startsWith('chromium-') && !x.includes('headless'))) {
      const c = path.join(base, d, 'chrome-linux', 'chrome');
      if (fs.existsSync(c)) return c;
    }
  }
  return undefined; // let playwright use its own installed browser
}

let axeSource = null;
if (!flag('no-axe')) {
  try { axeSource = fs.readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8'); }
  catch { console.warn('axe-core not installed: skipping accessibility scan (npm i -D axe-core)'); }
}

const setTheme = ({ theme, m }) => {
  const root = document.documentElement;
  if (m === 'class' || m === 'both') root.classList.toggle('dark', theme === 'dark');
  if (m === 'attr' || m === 'both') root.setAttribute('data-theme', theme);
  root.style.colorScheme = theme;
};

const browser = await chromium.launch({ executablePath: findChrome(), args: ['--no-sandbox'] });
const report = { url, results: [], axe: [] };
let failed = false;

for (const theme of ['light', 'dark']) {
  for (const w of widths) {
    const ctx = await browser.newContext({ viewport: { width: w, height }, colorScheme: theme });
    const page = await ctx.newPage();
    const errors = [];
    page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
    page.on('console', (m) => { if (m.type() === 'error') errors.push('console: ' + m.text()); });
    await page.goto(url, { waitUntil: 'networkidle' }).catch(() => page.goto(url));
    await page.evaluate(setTheme, { theme, m: mode });
    // walk the page so once-only scroll reveals complete, then return to top
    await page.evaluate(async () => {
      const step = Math.max(300, innerHeight * 0.8);
      // behavior:'instant' matters: with `html{scroll-behavior:smooth}` plain scrollTo() animates and the steps cancel each other
      for (let y = 0; y < document.documentElement.scrollHeight; y += step) { scrollTo({ top: y, behavior: 'instant' }); await new Promise((r) => setTimeout(r, 160)); }
      scrollTo({ top: 0, behavior: 'instant' });
    });
    await page.waitForTimeout(900);

    const m = await page.evaluate(() => {
      const de = document.documentElement;
      const wide = [...document.querySelectorAll('body *')].filter((el) => {
        const r = el.getBoundingClientRect();
        return r.right > innerWidth + 1 && getComputedStyle(el).position !== 'fixed' && !el.closest('[class*="overflow-x"], .scrollbar-hide, pre, table');
      }).slice(0, 3).map((el) => el.tagName.toLowerCase() + '.' + String(el.className).split(' ').slice(0, 3).join('.'));
      return { scrollWidth: de.scrollWidth, innerWidth, overflow: de.scrollWidth > innerWidth + 1, wide };
    });
    const file = path.join(out, `${theme}-${w}.png`);
    await page.screenshot({ path: file, fullPage: true });
    const row = { theme, width: w, overflow: m.overflow, scrollWidth: m.scrollWidth, wide: m.wide, errors, file };
    report.results.push(row);
    if (m.overflow || errors.length) failed = true;

    if (axeSource && (w === 1280 || w === 375)) {
      await page.evaluate(axeSource);
      const res = await page.evaluate(async () => {
        const r = await window.axe.run(document, { runOnly: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'] });
        return {
          violations: r.violations.map((v) => ({ id: v.id, impact: v.impact, count: v.nodes.length, sample: v.nodes[0]?.target?.join(' '), help: v.help })),
          incomplete: r.incomplete.map((v) => ({ id: v.id, count: v.nodes.length })),
        };
      });
      report.axe.push({ theme, width: w, ...res });
      if (res.violations.some((v) => v.impact === 'serious' || v.impact === 'critical')) failed = true;
    }
    await ctx.close();
  }
}
await browser.close();
fs.writeFileSync(path.join(out, 'report.json'), JSON.stringify(report, null, 2));

console.log(`\n${url}\n`);
for (const r of report.results) {
  const bits = [r.overflow ? `OVERFLOW (scrollWidth ${r.scrollWidth}, ${r.wide.join(' | ')})` : 'no h-scroll', r.errors.length ? `${r.errors.length} error(s): ${r.errors[0]}` : 'no errors'];
  console.log(`  ${r.theme.padEnd(5)} ${String(r.width).padStart(4)}px  ${bits.join('  ')}`);
}
for (const a of report.axe) {
  console.log(`\n  axe ${a.theme} ${a.width}px: ${a.violations.length} violation(s), ${a.incomplete.length} incomplete`);
  for (const v of a.violations) console.log(`    [${v.impact}] ${v.id} x${v.count}  ${v.help}\n      e.g. ${v.sample}`);
}
console.log(`\nscreenshots + report.json in ${out}`);
process.exit(failed ? 1 : 0);
