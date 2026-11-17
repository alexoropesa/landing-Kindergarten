// Genera variantes responsivas AVIF + WebP desde assets/src → assets/img
// Uso: npm run images
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

const SRC = 'assets/src';
const OUT = 'assets/img';
fs.mkdirSync(OUT, { recursive: true });

// Anchos por rol de imagen (ver Design.md › Imágenes)
const PRESETS = {
  hero: [640, 960, 1440, 1920],
  'breath-garden': [768, 1280, 1920, 2560],
  'stacker-cutout': [320, 640],
};
const DEFAULT_WIDTHS = [480, 800, 1200];

const manifest = {};
for (const file of fs.readdirSync(SRC)) {
  if (!/\.(jpe?g|png)$/i.test(file)) continue;
  const name = file.replace(/\.(jpe?g|png)$/i, '');
  const input = sharp(path.join(SRC, file));
  const meta = await input.metadata();
  const preset = PRESETS[name] || DEFAULT_WIDTHS;
  const widths = preset.filter((w) => w < meta.width);
  // Si la fuente es menor que el preset mayor, se añade su ancho nativo (nunca se hace upscale)
  if (Math.max(...preset) >= meta.width) widths.push(meta.width);
  manifest[name] = { w: meta.width, h: meta.height, widths };
  for (const w of widths) {
    const base = sharp(path.join(SRC, file)).resize({ width: w });
    await base.clone().avif({ quality: 50, effort: 6 }).toFile(`${OUT}/${name}-${w}.avif`);
    await base.clone().webp({ quality: 72, effort: 6 }).toFile(`${OUT}/${name}-${w}.webp`);
  }
  console.log(`✓ ${name} (${meta.width}×${meta.height}) → ${widths.join(', ')}`);
}

// Open Graph 1200×630 (JPEG por compatibilidad con scrapers sociales)
await sharp(path.join(SRC, 'hero.jpg'))
  .resize(1200, 630, { fit: 'cover', position: 'right' })
  .jpeg({ quality: 78, mozjpeg: true })
  .toFile(`${OUT}/og-image.jpg`);

fs.writeFileSync(`${OUT}/manifest.json`, JSON.stringify(manifest, null, 2));
console.log('✓ og-image.jpg + manifest.json');
