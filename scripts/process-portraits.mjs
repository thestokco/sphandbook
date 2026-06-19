/**
 * One-off: resize the CPE profile portraits (extracted from the .docx files)
 * into public/people/<slug>.jpg at a sensible web size.
 */
import sharp from "sharp";
import { mkdir, readdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const src = join(root, ".tmp_media2");
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
  const file = files.find((f) => f === `${slug}__image1.jpeg`);
  if (!file) {
    console.warn("missing portrait for", slug);
    continue;
  }
  const out = join(outDir, `${slug}.jpg`);
  await sharp(join(src, file))
    .resize({ width: 900, height: 1200, fit: "inside", withoutEnlargement: true })
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(out);
  console.log("wrote", out);
}
