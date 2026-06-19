/**
 * Builds all SP Group logo + icon assets from the official logo file.
 * Source: the official lockup (sphere + "SPgroup") on a white background.
 *
 * Produces (white bg flood-filled to transparent so it sits on any surface):
 *   public/sp-group-logo.png    full lockup (transparent)
 *   public/sp-group-mark.png    sphere only (transparent)
 *   public/icons/icon-192.png, icon-512.png, icon-maskable-512.png
 *   app/icon.png (512), app/apple-icon.png (180), app/favicon.ico (48)
 *
 * Re-run after replacing SRC with a new official file:
 *   node scripts/generate-logo.mjs
 */
import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const SRC = "C:/Users/offic/Downloads/image001.jpg";
const pub = join(root, "public");
const app = join(root, "app");
const iconsDir = join(pub, "icons");

await mkdir(iconsDir, { recursive: true });

// 1) Flood-fill the white background to transparent, starting from the borders.
//    Interior whites (the sphere's swirl/highlights) aren't border-connected, so
//    they're preserved; the gray wordmark stops the fill too.
const { data, info } = await sharp(SRC)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });
const { width, height, channels } = info;
const LIGHT = 195; // treat min-channel above this as background/halo white
const isLight = (i) =>
  data[i] > LIGHT && data[i + 1] > LIGHT && data[i + 2] > LIGHT;
const visited = new Uint8Array(width * height);
const stack = [];
const push = (x, y) => {
  if (x >= 0 && x < width && y >= 0 && y < height) {
    const p = y * width + x;
    if (!visited[p]) stack.push(p);
  }
};
for (let x = 0; x < width; x++) {
  push(x, 0);
  push(x, height - 1);
}
for (let y = 0; y < height; y++) {
  push(0, y);
  push(width - 1, y);
}
while (stack.length) {
  const p = stack.pop();
  if (visited[p]) continue;
  visited[p] = 1;
  const i = p * channels;
  if (!isLight(i)) continue;
  data[i + 3] = 0;
  const x = p % width;
  const y = (p - x) / width;
  push(x + 1, y);
  push(x - 1, y);
  push(x, y + 1);
  push(x, y - 1);
}

// Find the sphere's horizontal extent: the first run of opaque columns from
// the left, ending at the transparent gap before the "SPgroup" wordmark.
const colOpaque = (x) => {
  for (let y = 0; y < height; y++) {
    if (data[(y * width + x) * channels + 3] > 16) return true;
  }
  return false;
};
let sx = 0;
while (sx < width && !colOpaque(sx)) sx++;
let ex = sx;
while (ex < width && colOpaque(ex)) ex++;

// Clean the wordmark region (right of the sphere): its letter-counters are
// white enclosed by gray strokes, so the edge flood-fill can't reach them.
// The wordmark has no legitimate white, so remove all remaining light pixels
// there directly. (The sphere's interior highlights — left of `ex` — are kept.)
for (let x = ex; x < width; x++) {
  for (let y = 0; y < height; y++) {
    const i = (y * width + x) * channels;
    if (isLight(i)) data[i + 3] = 0;
  }
}

const transparentBuf = await sharp(data, {
  raw: { width, height, channels },
}).png().toBuffer();

// 2) Full lockup, trimmed.
await sharp(transparentBuf).trim().png().toFile(join(pub, "sp-group-logo.png"));

// 3) Sphere-only mark: crop the sphere, then trim (separate pipeline —
// combining extract + trim makes sharp trim before extracting).
const croppedBuf = await sharp(transparentBuf)
  .extract({ left: sx, top: 0, width: Math.max(1, ex - sx), height })
  .png()
  .toBuffer();
const markBuf = await sharp(croppedBuf).trim().png().toBuffer();
await sharp(markBuf).toFile(join(pub, "sp-group-mark.png"));

// 4) Square icons: the sphere centered on white, with padding.
async function icon(size, pad, out) {
  const inner = Math.round(size * (1 - pad * 2));
  const m = await sharp(markBuf)
    .resize({
      width: inner,
      height: inner,
      fit: "contain",
      background: { r: 255, g: 255, b: 255, alpha: 0 },
    })
    .png()
    .toBuffer();
  await sharp({
    create: { width: size, height: size, channels: 4, background: "#ffffff" },
  })
    .composite([{ input: m, gravity: "center" }])
    .png()
    .toFile(out);
  console.log("wrote", out);
}

await icon(192, 0.14, join(iconsDir, "icon-192.png"));
await icon(512, 0.14, join(iconsDir, "icon-512.png"));
await icon(512, 0.2, join(iconsDir, "icon-maskable-512.png"));
await icon(512, 0.14, join(app, "icon.png"));
await icon(180, 0.14, join(app, "apple-icon.png"));
await icon(48, 0.08, join(app, "favicon.ico"));

console.log("done");
