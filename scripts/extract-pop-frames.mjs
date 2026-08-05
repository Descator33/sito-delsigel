/**
 * Pop-hero asset pipeline (take 1, spec 2026-07-22 + addendum).
 *
 * Estrae i 361 frame di public/video.mp4 (generato come ASCESA su fal.ai) e li
 * scrive in public/frames/pop/ come WebP numerati in ORDINE DI PLAYBACK, cioè
 * invertiti: playback k = gen (TOTAL + 1 - k).
 *
 *   f_0001.webp  = giallo acido, dolce piccolo (inizio caduta)
 *   f_0361.webp  = master still su inchiostro (arresto — frame della card)
 *
 * Requires ffmpeg on PATH. Run: node scripts/extract-pop-frames.mjs
 */
import { execFileSync } from "node:child_process";
import { mkdirSync, rmSync, readdirSync } from "node:fs";
import { join } from "node:path";
import os from "node:os";
import sharp from "sharp";

const ROOT = new URL("..", import.meta.url).pathname;
const SRC = join(ROOT, "public", "video.mp4");
const DEST = join(ROOT, "public", "frames", "pop");
const TMP = join(os.tmpdir(), "delsigel-pop-frames");

rmSync(TMP, { recursive: true, force: true });
mkdirSync(TMP, { recursive: true });
mkdirSync(DEST, { recursive: true });

console.log("ffmpeg: estrazione PNG (ordine di generazione)…");
execFileSync(
  "ffmpeg",
  ["-v", "error", "-y", "-i", SRC, "-fps_mode", "passthrough", join(TMP, "g_%04d.png")],
  { stdio: "inherit" }
);

const files = readdirSync(TMP).filter((f) => f.endsWith(".png")).sort();
const TOTAL = files.length;
console.log(`${TOTAL} frame estratti — conversione WebP con numerazione invertita…`);

let done = 0;
const queue = [...files];
const workers = Array.from({ length: 8 }, async function run() {
  while (queue.length) {
    const f = queue.shift();
    const gen = Number(f.match(/(\d+)/)[1]);
    const playback = TOTAL + 1 - gen; // inversione: il film è girato al contrario
    await sharp(join(TMP, f))
      .webp({ quality: 84, effort: 5 })
      .toFile(join(DEST, `f_${String(playback).padStart(4, "0")}.webp`));
    if (++done % 60 === 0) console.log(`  ${done}/${TOTAL}`);
  }
});
await Promise.all(workers);

rmSync(TMP, { recursive: true, force: true });
console.log(`fatto: ${TOTAL} WebP in public/frames/pop/ (f_0001 = inizio caduta, f_${String(TOTAL).padStart(4, "0")} = master still)`);
