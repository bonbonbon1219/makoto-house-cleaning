/**
 * public 内の写真を WebP に変換・圧縮する。
 *
 * 使い方:
 *   npm run optimize-images
 *
 * 新しい写真を追加したら:
 *   1. public/ に jpg/png を置く（例: public/before-after/xxx.jpg）
 *   2. npm run optimize-images
 *   3. コードでは .webp パスを指定する
 *
 * 既定:
 * - 最大幅 1600px（ヒーローは 1920px）
 * - 品質 78
 * - 元の jpg/png は残す（--delete-originals で削除）
 */
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = process.cwd();
const PUBLIC_DIR = path.join(ROOT, "public");
const DELETE_ORIGINALS = process.argv.includes("--delete-originals");

const SKIP_NAMES = new Set([
  "makoto-logo.png", // favicon / OG 用に PNG を残す
  "makoto-logo-original.png",
  "makoto-logo-source.png",
]);

const EXT = new Set([".jpg", ".jpeg", ".png"]);

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walk(full)));
      continue;
    }
    const ext = path.extname(entry.name).toLowerCase();
    if (!EXT.has(ext)) continue;
    if (SKIP_NAMES.has(entry.name)) continue;
    files.push(full);
  }
  return files;
}

function maxWidthFor(filePath) {
  const base = path.basename(filePath).toLowerCase();
  if (base.startsWith("hero")) return 1920;
  if (base.includes("logo")) return 512;
  return 1400;
}

async function optimizeOne(filePath) {
  const ext = path.extname(filePath);
  const outPath = filePath.slice(0, -ext.length) + ".webp";
  const input = sharp(filePath, { failOn: "none" });
  const meta = await input.metadata();
  const maxWidth = maxWidthFor(filePath);
  const width = meta.width && meta.width > maxWidth ? maxWidth : undefined;

  const pipeline = sharp(filePath, { failOn: "none" }).rotate();
  if (width) pipeline.resize({ width, withoutEnlargement: true });

  await pipeline.webp({ quality: 78, effort: 5 }).toFile(outPath);

  const before = (await fs.stat(filePath)).size;
  const after = (await fs.stat(outPath)).size;
  const relIn = path.relative(ROOT, filePath);
  const relOut = path.relative(ROOT, outPath);
  console.log(
    `${relIn} -> ${relOut} (${formatKb(before)} -> ${formatKb(after)})`,
  );

  if (DELETE_ORIGINALS && path.resolve(filePath) !== path.resolve(outPath)) {
    await fs.unlink(filePath);
    console.log(`  deleted ${relIn}`);
  }
}

function formatKb(bytes) {
  return `${(bytes / 1024).toFixed(1)}KB`;
}

async function main() {
  const files = await walk(PUBLIC_DIR);
  if (!files.length) {
    console.log("No jpg/png files found under public/");
    return;
  }

  for (const file of files) {
    await optimizeOne(file);
  }
  console.log(`Done. ${files.length} file(s).`);
  console.log("Remember to reference .webp paths in the site code.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
