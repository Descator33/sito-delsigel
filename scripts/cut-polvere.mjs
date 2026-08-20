/**
 * Scontorno per i soggetti POLVEROSI del configuratore (zucchero a velo e
 * simili) — variante di cut-product.mjs, stesso ingresso (render Kling su
 * nero puro) e stessa uscita (WebP con alpha).
 *
 * Perché non basta cut-product.mjs: lì la maschera è binaria e nasce da un
 * flood fill sul nero, che presuppone un bordo netto. Una polvere il bordo
 * netto non ce l'ha — è fatta di grani sempre più radi — e ogni pixel del
 * contorno è mezzo grano e mezzo fondo: la maschera binaria se li tiene tutti
 * e su campitura chiara si legge come una frangia sporca attorno al mucchio.
 *
 * Qui il fondo è nero e il soggetto è bianco, quindi il luma È già la
 * copertura: alpha = luma (con un guadagno che porta a pieno i grani più
 * chiari) restituisce un matte morbido, esattamente come un luma key. Il
 * colore si de-premoltiplica come in cut-product.mjs, così il bordo non
 * resta grigio. Sotto SOGLIA l'alpha si azzera: il render ha un fondo quasi
 * nero ma non perfetto, e senza taglio il bbox prenderebbe tutto il frame.
 *
 * Da usare SOLO sulle polveri chiare: su un soggetto pieno (crema, frutta,
 * cioccolato) il luma come alpha lo renderebbe semitrasparente nelle ombre.
 *
 * uso: node scripts/cut-polvere.mjs <render.png> <out.webp> [maxSide=900] [guadagno=1.9] [soglia=24]
 */
import sharp from "sharp";

const [, , inPath, outPath, maxSideArg, guadagnoArg, sogliaArg] = process.argv;
const MAX_SIDE = Number(maxSideArg || 900);
/** quanto si alza il luma prima di diventare alpha: 1 lascia il mucchio
 *  trasparente come nel render, alzarlo lo rende più solido */
const GUADAGNO = Number(guadagnoArg || 1.9);
/** sotto questa alpha è fondo, non polvere (il nero del render non è mai
 *  perfettamente pulito) */
const SOGLIA = Number(sogliaArg || 24);

const { width: W, height: H } = await sharp(inPath).metadata();
const rgb = await sharp(inPath).rotate().removeAlpha().raw().toBuffer();
const luma = await sharp(inPath).rotate().greyscale().raw().toBuffer();

const rgba = Buffer.alloc(W * H * 4);
for (let i = 0; i < W * H; i++) {
  const a = Math.min(255, Math.round(luma[i] * GUADAGNO));
  if (a < SOGLIA) continue; // resta 0,0,0,0
  rgba[i * 4 + 3] = a;
  // clamp come in cut-product.mjs: sui pixel quasi trasparenti 255/a esplode
  const k = Math.min(255 / a, 2.4);
  for (let c = 0; c < 3; c++)
    rgba[i * 4 + c] = Math.min(255, Math.round(rgb[i * 3 + c] * k));
}

/* bbox sui pixel che contano davvero: la soglia del taglio ha già tolto il
   fondo, ma qualche grano isolato lontano dal mucchio allargherebbe il crop */
let x0 = W,
  y0 = H,
  x1 = 0,
  y1 = 0;
for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    if (rgba[(y * W + x) * 4 + 3] > 60) {
      if (x < x0) x0 = x;
      if (x > x1) x1 = x;
      if (y < y0) y0 = y;
      if (y > y1) y1 = y;
    }
  }
}
const pad = 12;
const box = {
  left: Math.max(0, x0 - pad),
  top: Math.max(0, y0 - pad),
  width: Math.min(W - 1, x1 + pad) - Math.max(0, x0 - pad),
  height: Math.min(H - 1, y1 + pad) - Math.max(0, y0 - pad),
};

await sharp(rgba, { raw: { width: W, height: H, channels: 4 } })
  .extract(box)
  .resize({ width: MAX_SIDE, height: MAX_SIDE, fit: "inside", withoutEnlargement: true })
  .webp({ quality: 78, alphaQuality: 90, effort: 5 })
  .toFile(outPath);

console.log(`${outPath}  crop ${box.width}x${box.height}`);
