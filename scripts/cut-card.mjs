/**
 * Card assets dal frame finale della sequenza pop (spec 22/07, addendum).
 *
 * Dal frame 361 (master still: Golosone su campo inchiostro piatto) produce:
 *   public/frames/pop/card.webp   ritaglio del dolce con alpha vero (matte per
 *                                 distanza cromatica dal fondo piatto + feather)
 *   public/frames/pop/plate.webp  lo stesso frame SENZA il dolce (delogo ffmpeg):
 *                                 il canvas lo mostra durante il volo della card,
 *                                 così lo swap footage→card è invisibile
 *   public/frames/pop/meta.json   CARD_CROP in coordinate sorgente 1920×1080
 *
 * Run: node scripts/cut-card.mjs
 */
import { execFileSync } from "node:child_process";
import { writeFileSync, rmSync } from "node:fs";
import { join } from "node:path";
import os from "node:os";
import sharp from "sharp";

const ROOT = new URL("..", import.meta.url).pathname;
const POP = join(ROOT, "public", "frames", "pop");
const SRC = join(POP, "f_0361.webp");
const TMP = join(os.tmpdir(), "delsigel-cut");

const { data, info } = await sharp(SRC).raw().toBuffer({ resolveWithObject: true });
const { width: W, height: H, channels: C } = info;

// --- colore di fondo: media di 4 patch d'angolo -----------------------------
const patch = 40;
let br = 0, bg = 0, bb = 0, n = 0;
for (const [px, py] of [[0, 0], [W - patch, 0], [0, H - patch], [W - patch, H - patch]]) {
  for (let y = py; y < py + patch; y++)
    for (let x = px; x < px + patch; x++) {
      const i = (y * W + x) * C;
      br += data[i]; bg += data[i + 1]; bb += data[i + 2]; n++;
    }
}
br /= n; bg /= n; bb /= n;
console.log(`fondo: rgb(${br.toFixed(0)}, ${bg.toFixed(0)}, ${bb.toFixed(0)})`);

// --- matte: distanza cromatica dal fondo, con feather -----------------------
const LO = 8, HI = 26;
const mask = Buffer.alloc(W * H);
for (let p = 0; p < W * H; p++) {
  const i = p * C;
  const d = Math.max(
    Math.abs(data[i] - br),
    Math.abs(data[i + 1] - bg),
    Math.abs(data[i + 2] - bb)
  );
  const t = Math.min(1, Math.max(0, (d - LO) / (HI - LO)));
  mask[p] = Math.round(t * t * (3 - 2 * t) * 255); // smoothstep
}
const { data: softRaw, info: si } = await sharp(mask, {
  raw: { width: W, height: H, channels: 1 },
})
  .blur(1.2)
  .raw()
  .toBuffer({ resolveWithObject: true });
const SC = si.channels; // sharp può promuovere i canali: usare la stride reale
const soft = (p) => softRaw[p * SC];

// --- bbox del soggetto + margine --------------------------------------------
// Soglia dura (>60): il bbox non deve inseguire aloni deboli di spill
let x0 = W, y0 = H, x1 = 0, y1 = 0;
for (let y = 0; y < H; y++)
  for (let x = 0; x < W; x++)
    if (soft(y * W + x) > 60) {
      if (x < x0) x0 = x;
      if (x > x1) x1 = x;
      if (y < y0) y0 = y;
      if (y > y1) y1 = y;
    }
const mx = Math.round((x1 - x0) * 0.05);
const my = Math.round((y1 - y0) * 0.05);
x0 = Math.max(0, x0 - mx); y0 = Math.max(0, y0 - my);
x1 = Math.min(W - 1, x1 + mx); y1 = Math.min(H - 1, y1 + my);
const crop = { x: x0 & ~1, y: y0 & ~1, w: (x1 - x0) & ~1, h: (y1 - y0) & ~1 };
console.log("CARD_CROP:", crop);

// --- card.webp: RGBA ritagliata ----------------------------------------------
const rgba = Buffer.alloc(W * H * 4);
for (let p = 0; p < W * H; p++) {
  rgba[p * 4] = data[p * C];
  rgba[p * 4 + 1] = data[p * C + 1];
  rgba[p * 4 + 2] = data[p * C + 2];
  rgba[p * 4 + 3] = soft(p);
}
await sharp(rgba, { raw: { width: W, height: H, channels: 4 } })
  .extract({ left: crop.x, top: crop.y, width: crop.w, height: crop.h })
  .webp({ quality: 90, alphaQuality: 90, effort: 5 })
  .toFile(join(POP, "card.webp"));

// --- plate.webp: frame senza dolce (delogo interpola dai bordi) --------------
rmSync(TMP, { recursive: true, force: true });
execFileSync("mkdir", ["-p", TMP]);
const png = join(TMP, "f361.png");
await sharp(SRC).png().toFile(png);
const d = 14; // dilatazione: il delogo deve coprire anche il feather
const dx = Math.max(1, crop.x - d);
const dy = Math.max(1, crop.y - d);
const dw = Math.min(W - dx - 1, crop.w + 2 * d);
const dh = Math.min(H - dy - 1, crop.h + 2 * d);
execFileSync("ffmpeg", [
  "-v", "error", "-y", "-i", png,
  "-vf", `delogo=x=${dx}:y=${dy}:w=${dw}:h=${dh}`,
  join(TMP, "plate.png"),
]);
await sharp(join(TMP, "plate.png"))
  .webp({ quality: 84, effort: 5 })
  .toFile(join(POP, "plate.webp"));
rmSync(TMP, { recursive: true, force: true });

writeFileSync(join(POP, "meta.json"), JSON.stringify(crop) + "\n");
console.log("fatto: card.webp, plate.webp, meta.json");
