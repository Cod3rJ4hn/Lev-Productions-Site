import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';

const jobs = [
  ['hero.png', 'hero', [800, 1600]],
  ['ari.png', 'ari', [480, 900]],
  ['s1.png', 'studio-1', [440, 660]],
  ['s2.png', 'studio-2', [440, 660]],
  ['s3.png', 'studio-3', [440, 660]],
  ['s4.jpg', 'studio-4', [800, 1600]],
  ['banner.png', 'banner', [990, 1980]],
  ['coast.png', 'coast-and-ocean', [360]],
  ['resonant.png', 'resonant-hand', [300]],
  ['fin.png', 'fin-wheatley', [450]],
  ['anna.png', 'anna-gozlan', [300]],
  ['nuraini.png', 'nuraini', [390]],
  ['creme.png', 'creme-fraiche', [480]],
  ['miggy.png', 'miggy', [360]],
  ['freeds.png', 'freeds', [300]],
];

await mkdir('public/img', { recursive: true });
for (const [src, name, widths] of jobs) {
  const meta = await sharp(`_raw/${src}`).metadata();
  for (const w of widths) {
    const width = Math.min(w, meta.width);
    const base = sharp(`_raw/${src}`).resize({ width });
    await base.clone().avif({ quality: 52, effort: 6 }).toFile(`public/img/${name}-${width}.avif`);
    await base.clone().webp({ quality: 74, effort: 6 }).toFile(`public/img/${name}-${width}.webp`);
  }
  console.log(name, meta.width + 'x' + meta.height);
}
