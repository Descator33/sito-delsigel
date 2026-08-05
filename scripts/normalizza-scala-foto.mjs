#!/usr/bin/env node
/**
 * Normalizza la scala delle foto del configuratore
 * (public/img/configuratore/{prodotti,farciture}).
 *
 * Il banco e le tessere mostrano le foto con object-contain: quello che
 * conta visivamente è quanta parte del canvas occupa il soggetto, non i
 * pixel assoluti. Il riferimento scelto (2026-08-02, richiesta Davide) è
 * la bomba semplice: soggetto a filo del canvas (ratio ≈ 1), il respiro
 * lo dà la UI, non il file. Le foto arrivano dal servizio con canvas e
 * margini qualunque: qui si ritaglia il bordo trasparente fino alla
 * bounding box dei pixel con alfa, e si ridimensiona ciò che eccede
 * MAX_LATO (solo verso il basso, mai upscaling).
 *
 * Idempotente: una foto già a filo (ratio ≥ SOGLIA_OK) non si tocca, si
 * può rilanciare dopo ogni consegna di foto nuove. Il formato resta
 * quello del file (WebP → WebP con alfa, PNG → PNG): il prebuild
 * continua a verificare il canale alfa.
 */

import sharp from "sharp";
import { readdirSync, renameSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, extname, join } from "node:path";

const qui = dirname(fileURLToPath(import.meta.url));
const RADICE = join(qui, "..", "public", "img", "configuratore");
const CARTELLE = ["prodotti", "farciture"];

const ESTENSIONI = new Set([".png", ".webp"]);
/* sopra questa quota il soggetto è già a filo: non si ricomprime inutilmente */
const SOGLIA_OK = 0.97;
/* alfa sotto cui un pixel è sfondo (≤ ~1,5% di opacità): abbastanza
   bassa da tenere l'alone sfumato dello scontorno, abbastanza alta da
   ignorare la polvere quasi invisibile che certi generatori spargono
   sul canvas e che gonfierebbe il ritaglio */
const SOGLIA_ALFA = 4;
/* lato massimo dopo il ritaglio: alcune consegne arrivano a 7000px */
const MAX_LATO = 1600;

async function normalizza(percorso) {
  const { data, info } = await sharp(percorso)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width: w, height: h, channels: c } = info;

  let minX = w, minY = h, maxX = -1, maxY = -1;
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++)
      if (data[(y * w + x) * c + 3] > SOGLIA_ALFA) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
  if (maxX < 0) return "vuota"; // nessun pixel visibile: non si tocca

  const bw = maxX - minX + 1;
  const bh = maxY - minY + 1;
  const ratio = Math.max(bw, bh) / Math.max(w, h);
  if (ratio >= SOGLIA_OK && Math.max(bw, bh) <= MAX_LATO) return "già a filo";

  let img = sharp(percorso)
    .ensureAlpha()
    .extract({ left: minX, top: minY, width: bw, height: bh });
  if (Math.max(bw, bh) > MAX_LATO)
    img = img.resize({ width: MAX_LATO, height: MAX_LATO, fit: "inside" });

  const ext = extname(percorso).toLowerCase();
  img =
    ext === ".webp"
      ? img.webp({ quality: 92, alphaQuality: 100 })
      : img.png();

  /* scrittura su file temporaneo e rename: sharp non può leggere e
     scrivere lo stesso percorso, e a metà scrittura non deve restare
     una foto rotta nella cartella-contratto */
  const tmp = percorso + ".tmp" + ext;
  await img.toFile(tmp);
  renameSync(tmp, percorso);
  return `ritagliata ${w}x${h} → ${bw}x${bh} (ratio ${ratio.toFixed(2)} → 1.00)`;
}

let toccate = 0;
for (const cartella of CARTELLE) {
  for (const voce of readdirSync(join(RADICE, cartella), { withFileTypes: true })) {
    if (!voce.isDirectory()) continue;
    for (const file of readdirSync(join(RADICE, cartella, voce.name))) {
      if (!ESTENSIONI.has(extname(file).toLowerCase())) continue;
      const percorso = join(RADICE, cartella, voce.name, file);
      const esito = await normalizza(percorso);
      if (esito !== "già a filo") {
        console.log(`${cartella}/${voce.name}/${file}: ${esito}`);
        if (esito !== "vuota") toccate++;
      }
    }
  }
}
console.log(`\n✓ ${toccate} foto normalizzate alla scala di riferimento.`);
