// One-shot script: take raw screenshots from public/images/portfolio elements/
// and produce per-case-study cover.jpg + og.jpg in public/images/<slug>/.
//
// Run with: node scripts/process-covers.mjs

import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const IN = (p) => resolve(ROOT, 'public/images/portfolio elements', p);
const OUT = (slug) => resolve(ROOT, 'public/images', slug);

const COVER_W = 1600;
const OG_W = 1200;
const OG_H = 630;

const jobs = [
  {
    slug: 'ubc-bank',
    src: 'UBC-bank/ubc-bank-homepage.jpg',
    // 1920 × 7200 full-page web shot — crop top 16:9 hero
    heroCrop: { left: 0, top: 0, width: 1920, height: 1080 },
    ogCrop: { left: 0, top: 0, width: 1920, height: 1008 },
    fitOg: 'cover'
  },
  {
    slug: 'the-reward-society',
    src: 'the-reward-society/the-reward-society-dashboard.jpg',
    // 2882 × 2877 nearly square — keep full square as cover; for OG center-crop horizontal band
    heroCrop: null,
    ogCrop: { left: 0, top: Math.round((2877 - 1513) / 2), width: 2882, height: 1513 },
    fitOg: 'cover'
  },
  {
    slug: 'soutenable',
    src: 'soutenable/soutenable-mobile-homepage.jpg',
    // 393 × 5150 mobile portrait — crop top phone screen for cover
    heroCrop: { left: 0, top: 0, width: 393, height: 850 },
    // OG: portrait won't fit 1200×630 cleanly. Letterbox onto brand bg.
    ogLetterbox: true
  }
];

async function ensureDir(p) {
  await mkdir(p, { recursive: true });
}

async function processOne(job) {
  const inPath = IN(job.src);
  const outDir = OUT(job.slug);
  await ensureDir(outDir);

  // Cover
  let cover = sharp(inPath);
  if (job.heroCrop) cover = cover.extract(job.heroCrop);
  cover = cover.resize({ width: COVER_W, withoutEnlargement: true });
  await cover.jpeg({ quality: 86, mozjpeg: true }).toFile(resolve(outDir, 'cover.jpg'));

  // OG
  if (job.ogLetterbox) {
    // Top 1500h of source, fit on 1200×630 brand-bg canvas
    const phoneCrop = await sharp(inPath)
      .extract({ left: 0, top: 0, width: 393, height: 1500 })
      .resize({ height: 580, withoutEnlargement: false })
      .toBuffer();
    await sharp({
      create: {
        width: OG_W, height: OG_H, channels: 3,
        background: { r: 0xF8, g: 0xF8, b: 0xF6 }
      }
    })
      .composite([{ input: phoneCrop, gravity: 'center' }])
      .jpeg({ quality: 86, mozjpeg: true })
      .toFile(resolve(outDir, 'og.jpg'));
  } else {
    let og = sharp(inPath);
    if (job.ogCrop) og = og.extract(job.ogCrop);
    og = og.resize({ width: OG_W, height: OG_H, fit: job.fitOg ?? 'cover' });
    await og.jpeg({ quality: 86, mozjpeg: true }).toFile(resolve(outDir, 'og.jpg'));
  }

  console.log(`✓ ${job.slug}: cover.jpg + og.jpg`);
}

for (const job of jobs) {
  try {
    await processOne(job);
  } catch (e) {
    console.error(`✗ ${job.slug}:`, e.message);
  }
}
