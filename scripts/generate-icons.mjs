/**
 * Generates the PWA icon set from an inline SVG, using sharp.
 * Run with: node scripts/generate-icons.mjs
 *
 * Produces:
 *   public/icons/icon-192.png
 *   public/icons/icon-512.png
 *   public/icons/icon-maskable-512.png   (extra safe-zone padding)
 *   public/favicon.ico  (via 32px png)
 *   app/icon.png        (Next metadata icon, 512)
 *   app/apple-icon.png  (180)
 */
import sharp from "sharp";
import { mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const NAVY = "#27344A";
const IVORY = "#F7F4ED";
const TAUPE = "#B4A88E";

/** @param {number} pad fraction of the canvas kept as empty margin (maskable safe zone) */
function svg(size, pad = 0.12) {
  const r = Math.round(size * 0.22); // rounded-square corner
  const cx = size / 2;
  // Brand mark: a small dot above wide-tracked "SP".
  const dotR = size * 0.045;
  const dotY = size * (0.30 + pad * 0.4);
  const textY = size * (0.62 + pad * 0.2);
  const fontSize = size * (0.30 - pad * 0.4);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" rx="${r}" ry="${r}" fill="${NAVY}"/>
  <circle cx="${cx}" cy="${dotY}" r="${dotR}" fill="${TAUPE}"/>
  <text x="${cx}" y="${textY}" text-anchor="middle"
        font-family="Georgia, 'Times New Roman', serif" font-weight="500"
        font-size="${fontSize}" letter-spacing="${size * 0.03}" fill="${IVORY}">SP</text>
</svg>`;
}

async function png(size, pad, out) {
  const buf = Buffer.from(svg(size, pad));
  await sharp(buf).png().toFile(out);
  console.log("wrote", out);
}

async function main() {
  await mkdir(join(root, "public", "icons"), { recursive: true });

  await png(192, 0.06, join(root, "public", "icons", "icon-192.png"));
  await png(512, 0.06, join(root, "public", "icons", "icon-512.png"));
  await png(512, 0.2, join(root, "public", "icons", "icon-maskable-512.png"));

  // Next.js app-folder metadata icons (auto-picked up by the framework).
  await png(512, 0.06, join(root, "app", "icon.png"));
  await png(180, 0.06, join(root, "app", "apple-icon.png"));

  // favicon.ico (sharp can emit ICO via the .ico extension on recent libvips;
  // fall back to a 32px png written as favicon if ICO is unsupported).
  try {
    const buf = Buffer.from(svg(48, 0.04));
    await sharp(buf).resize(32, 32).toFile(join(root, "app", "favicon.ico"));
    console.log("wrote app/favicon.ico");
  } catch (e) {
    console.warn("ICO unsupported, skipping favicon.ico:", e.message);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
