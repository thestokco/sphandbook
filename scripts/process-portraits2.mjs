/**
 * One-off: resize the CPE second photos (image2 from each .docx) into
 * public/people/<slug>-2.jpg.
 */
import sharp from "sharp";
import { mkdir, readdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const src = join(root, ".tmp_m3");
const outDir = join(root, "public", "people");

const slugs = [
  "wai-moe-kyaw",
  "ng-guan-jie",
  "sheikh-hafiz",
  "muhammad-amin",
  "marvin-yip",
  "lee-wen-xiang",
  "abdul-majid",
];

await mkdir(outDir, { recursive: true });
const files = await readdir(src);

for (const slug of slugs) {
  const file = files.find((f) => f === `${slug}__image2.jpeg`);
  if (!file) {
    console.warn("missing 2nd image for", slug);
    continue;
  }
  const out = join(outDir, `${slug}-2.jpg`);
  await sharp(join(src, file))
    .resize({ width: 1400, height: 1400, fit: "inside", withoutEnlargement: true })
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(out);
  console.log("wrote", out);
}
