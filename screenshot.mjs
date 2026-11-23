import puppeteer from 'puppeteer';
import { mkdir, readdir } from 'node:fs/promises';
import { join } from 'node:path';

// Usage: node screenshot.mjs <url> [label] [--width=1440] [--height=900]
const args = process.argv.slice(2);
const flags = Object.fromEntries(
  args.filter((a) => a.startsWith('--')).map((a) => a.slice(2).split('='))
);
const [url, label] = args.filter((a) => !a.startsWith('--'));

if (!url) {
  console.error('Usage: node screenshot.mjs <url> [label] [--width=1440] [--height=900]');
  process.exit(1);
}
if (url.startsWith('file:')) {
  console.error('Serve the site with `node serve.mjs` and screenshot the localhost URL, not a file URL.');
  process.exit(1);
}

const outDir = join(process.cwd(), 'temporary screenshots');
await mkdir(outDir, { recursive: true });

const existing = await readdir(outDir);
const next =
  existing
    .map((f) => /^screenshot-(\d+)/.exec(f))
    .filter(Boolean)
    .reduce((max, m) => Math.max(max, Number(m[1])), 0) + 1;

const name = label ? `screenshot-${next}-${label}.png` : `screenshot-${next}.png`;
const outPath = join(outDir, name);

const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
try {
  const page = await browser.newPage();
  await page.setViewport({
    width: Number(flags.width) || 1440,
    height: Number(flags.height) || 900,
  });
  await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });
  await page.screenshot({ path: outPath, fullPage: true });
  console.log(`Saved ${outPath}`);
} finally {
  await browser.close();
}
