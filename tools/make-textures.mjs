// Generates the wall textures and spray-paint artwork in public/img/paint/.
// Everything is drawn from code (seeded noise), so there is no third-party art.
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';

const out = 'public/img/paint';
await mkdir(out, { recursive: true });

let seed = 20261124;
const rand = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);

// Tileable value noise: random grid, wrapped, smoothly interpolated.
function noise(size, cells) {
  const g = Array.from({ length: cells * cells }, rand);
  const f = new Float32Array(size * size);
  const s = (t) => t * t * (3 - 2 * t);
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
    const gx = (x / size) * cells, gy = (y / size) * cells;
    const x0 = Math.floor(gx), y0 = Math.floor(gy), x1 = (x0 + 1) % cells, y1 = (y0 + 1) % cells;
    const tx = s(gx - x0), ty = s(gy - y0);
    const a = g[y0 * cells + x0] * (1 - tx) + g[y0 * cells + x1] * tx;
    const b = g[y1 * cells + x0] * (1 - tx) + g[y1 * cells + x1] * tx;
    f[y * size + x] = a * (1 - ty) + b * ty;
  }
  return f;
}

async function wall(name, [r, g, b], strength, pits) {
  const size = 512;
  const big = noise(size, 4), mid = noise(size, 14), fine = noise(size, 90);
  const buf = Buffer.alloc(size * size * 3);
  for (let i = 0; i < size * size; i++) {
    const v = ((big[i] - 0.5) * 0.4 + (mid[i] - 0.5) * 0.35 + (fine[i] - 0.5) * 0.9 + (rand() - 0.5) * 0.35) * strength;
    const pit = rand() < pits ? -strength * 0.9 * rand() : 0;
    [r, g, b].forEach((c, k) => { buf[i * 3 + k] = Math.max(0, Math.min(255, Math.round(c + v + pit))); });
  }
  await sharp(buf, { raw: { width: size, height: size, channels: 3 } }).webp({ quality: 72 }).toFile(`${out}/${name}.webp`);
}

// Paints an SVG silhouette as a spray stencil: solid core plus speckled overspray.
async function spray(name, svg, w, h, [r, g, b], { blur = 14, core = 0.94, over = 0.6, width = w } = {}) {
  const mask = await sharp(Buffer.from(svg)).resize(w, h).flatten({ background: '#000' }).greyscale().raw().toBuffer();
  const soft = await sharp(mask, { raw: { width: w, height: h, channels: 1 } }).blur(blur).extractChannel(0).raw().toBuffer();
  const buf = Buffer.alloc(w * h * 4);
  for (let i = 0; i < w * h; i++) {
    const m = mask[i] / 255, s = soft[i] / 255;
    let a = m * core * (0.88 + 0.12 * rand());
    if (rand() < Math.pow(s, 1.5) * over) a = Math.max(a, 0.45 + 0.45 * rand());
    buf.set([r, g, b, Math.round(a * 255)], i * 4);
  }
  await sharp(buf, { raw: { width: w, height: h, channels: 4 } }).resize({ width }).webp({ quality: 60, alphaQuality: 60 }).toFile(`${out}/${name}.webp`);
}

// Soft cloud of overspray with no silhouette.
async function haze(name, w, h, [r, g, b], peak) {
  const buf = Buffer.alloc(w * h * 4);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const dx = (x / w - 0.5) * 2, dy = (y / h - 0.5) * 2;
    const d = Math.max(0, 1 - Math.sqrt(dx * dx + dy * dy));
    const a = rand() < Math.pow(d, 1.3) * peak ? 0.35 + 0.5 * rand() : 0;
    buf.set([r, g, b, Math.round(a * 255)], (y * w + x) * 4);
  }
  await sharp(buf, { raw: { width: w, height: h, channels: 4 } }).webp({ quality: 45, alphaQuality: 50 }).toFile(`${out}/${name}.webp`);
}

// Rough, hand-torn paper edge used as a mask on the pasted posters.
async function torn(name, w, h) {
  const edge = (n) => { let v = 4; return Array.from({ length: n }, () => (v = Math.max(1, Math.min(11, v + (rand() - 0.5) * 3)))); };
  const t = edge(w), bt = edge(w), l = edge(h), rt = edge(h);
  const buf = Buffer.alloc(w * h * 4);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const on = y > t[x] && h - y > bt[x] && x > l[y] && w - x > rt[y];
    buf.set([255, 255, 255, on ? 255 : 0], (y * w + x) * 4);
  }
  await sharp(buf, { raw: { width: w, height: h, channels: 4 } }).webp({ lossless: true }).toFile(`${out}/${name}.webp`);
}

const ORANGE = [245, 60, 23], INK = [23, 23, 23], CREAM = [254, 246, 235];
await wall('wall-cream', CREAM, 26, 0.006);
await wall('wall-ink', INK, 30, 0.006);
await wall('wall-orange', ORANGE, 34, 0.006);
await haze('haze-orange', 700, 420, ORANGE, 0.55);
await haze('haze-ink', 700, 420, INK, 0.5);

const svg = (w, h, body) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}"><g fill="#fff">${body}</g></svg>`;
// Microphone stencil, split by the bridges a real cut stencil needs.
await spray('stencil-mic', svg(300, 460, `
  <path d="M150 30a70 70 0 0 1 70 70v10H80v-10a70 70 0 0 1 70-70Z"/>
  <path d="M80 124h62v30H80zM158 124h62v30h-62zM80 168h62v30H80zM158 168h62v30h-62z"/>
  <path d="M80 212h140v18a70 70 0 0 1-140 0z"/>
  <path d="M40 200h22v32a88 88 0 0 0 78 87v23A112 112 0 0 1 40 232zM260 200h-22v32a88 88 0 0 1-78 87v23a112 112 0 0 0 100-110z"/>
  <path d="M139 352h22v50h-22zM86 412h128v24H86z"/>`), 600, 920, ORANGE, { width: 360 });
// Question mark stencil for the FAQs.
await spray('stencil-q', svg(300, 460, `
  <path d="M50 150C50 82 92 40 150 40v52c-28 0-46 20-46 58z"/>
  <path d="M164 40c56 4 92 44 92 98 0 48-24 72-50 92-20 16-30 28-30 56v14h-54v-18c0-46 22-70 46-90 20-16 32-28 32-52 0-28-14-44-36-48z"/>
  <path d="M122 330h54v56h-54z"/>`), 600, 920, INK, { width: 360 });
await torn('torn', 300, 340);
console.log('textures written');
