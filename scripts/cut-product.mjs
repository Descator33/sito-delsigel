/**
 * Scontorno del render Kling (prodotto su nero puro) → WebP con alpha, cioè
 * gli still delle card in public/products/.
 *
 * A monte c'è Kling image_to_image con gemini-3.1-flash-image (15 crediti a
 * scatto, e più fedele di Nano Banana Pro, che arrotonda le sagome): due foto
 * INTERE dello stesso prodotto da public/DOLCI o public/SALATI come reference
 * — ritagliate strette peggiora — e un prompt di solo relight (key 45°, due
 * rim light caldi che staccano tutta la sagoma, fondo nero pieno). Le
 * descrizioni prodotto e le cartelle sorgente stanno in product-variants.mjs.
 *
 * Qui il fondo è nero seamless e il prodotto è chiaro: la maschera nasce da
 * una soglia sul luma, ma la soglia da sola bucherebbe le ombre proprie del
 * dolce. Quindi il fondo vero è solo ciò che è NERO **e** connesso al bordo
 * del frame (flood fill 4-vie dai bordi): il resto è prodotto, ombre incluse.
 *
 * uso: node scripts/cut-product.mjs <render.png> <public/products/x.webp> [maxSide=900] [erode=168] [bgLuma=24]
 */
import sharp from "sharp";

const [, , inPath, outPath, maxSideArg, erodeArg, bgLumaArg] = process.argv;
const MAX_SIDE = Number(maxSideArg || 1400);
/** soglia dell'erosione finale: alzarla morde di più il bordo, e serve sui
 *  render in cui il rim light è uscito freddo e lascia un filo azzurro */
const ERODE = Number(erodeArg || 168);
/** soglia del fondo: sotto questo luma il pixel è candidato fondo. Abbassarla
 *  serve sui soggetti che nel nero ci vanno per natura (cioccolato fondente,
 *  ganache): con 24 le loro ombre proprie diventano fondo e il fill le
 *  scava da dentro. */
const BG_LUMA = Number(bgLumaArg || 24);
const FEATHER = 1.1;
const CLOSE = 5; // raggio del closing che ricuce il bordo in ombra

const src = sharp(inPath).rotate();
const { width: W, height: H } = await src.metadata();

const luma = await sharp(inPath).rotate().greyscale().raw().toBuffer();

// flood fill dai bordi: 0 = fondo raggiunto, 1 = soggetto
const isBg = new Uint8Array(W * H);
const stack = [];
const push = (i) => {
  if (!isBg[i] && luma[i] <= BG_LUMA) {
    isBg[i] = 1;
    stack.push(i);
  }
};
for (let x = 0; x < W; x++) {
  push(x);
  push((H - 1) * W + x);
}
for (let y = 0; y < H; y++) {
  push(y * W);
  push(y * W + W - 1);
}
while (stack.length) {
  const i = stack.pop();
  const x = i % W;
  const y = (i - x) / W;
  if (x > 0) push(i - 1);
  if (x < W - 1) push(i + 1);
  if (y > 0) push(i - W);
  if (y < H - 1) push(i + W);
}

/**
 * Alpha binaria: il confine lo traccia già il flood fill, e graduarla sul luma
 * bucherebbe il dolce là dove ha ombre proprie scure (il fondo card
 * trasparirebbe attraverso il prodotto). Il bordo lo ammorbidisce il blur.
 */
const alpha = Buffer.alloc(W * H);
for (let i = 0; i < W * H; i++) alpha[i] = isBg[i] ? 0 : 255;

/**
 * Closing (dilata poi erode) sulla maschera. Dove il dolce va in ombra il suo
 * bordo scende sotto soglia e il fill entra a morsi, lasciando una frangia
 * frastagliata; il closing ricuce quei morsi senza gonfiare la sagoma.
 */
const morph = async (buf, thresholdAt) =>
  sharp(buf, { raw: { width: W, height: H, channels: 1 } })
    .blur(CLOSE)
    .toColourspace("b-w")
    .raw()
    .toBuffer()
    .then((b) => {
      const out = Buffer.alloc(W * H);
      for (let i = 0; i < W * H; i++) out[i] = b[i] >= thresholdAt ? 255 : 0;
      return out;
    });

// closing (dilata → erode) e poi un pelo di erosione in più: il pixel
// esattamente sul confine è mezzo fondo, e su campitura chiara si legge come
// un filo scuro attorno al dolce
const closed = await morph(await morph(await morph(alpha, 32), 224), ERODE);

/**
 * Scarta le macchie isolate: se il fondale del render non è nero pieno in un
 * angolo, il fill non lo raggiunge e resta un rettangolo appiccicato al
 * ritaglio. Si tengono solo le componenti connesse che valgono almeno un
 * quinto della più grande — così i prodotti in due pezzi (spaccati,
 * focaccine) sopravvivono entrambi e i rimasugli spariscono.
 */
const label = new Int32Array(W * H).fill(-1);
const sizes = [];
const touchesEdge = [];
for (let start = 0; start < W * H; start++) {
  if (closed[start] === 0 || label[start] !== -1) continue;
  const id = sizes.length;
  let count = 0;
  let edge = false;
  const q = [start];
  label[start] = id;
  while (q.length) {
    const i = q.pop();
    count++;
    const x = i % W;
    const y = (i - x) / W;
    if (x === 0 || y === 0 || x === W - 1 || y === H - 1) edge = true;
    const near = [];
    if (x > 0) near.push(i - 1);
    if (x < W - 1) near.push(i + 1);
    if (y > 0) near.push(i - W);
    if (y < H - 1) near.push(i + W);
    for (const j of near) {
      if (closed[j] !== 0 && label[j] === -1) {
        label[j] = id;
        q.push(j);
      }
    }
  }
  sizes.push(count);
  touchesEdge.push(edge);
}

/* il prodotto sta al centro e non arriva al bordo: una macchia che tocca il
   bordo ed è più piccola della metà del soggetto è fondale non nero, non dolce */
const biggest = Math.max(...sizes, 0);
const drop = sizes.map(
  (s, i) => s < biggest / 5 || (touchesEdge[i] && s < biggest / 2),
);
for (let i = 0; i < W * H; i++) {
  if (closed[i] !== 0 && drop[label[i]]) closed[i] = 0;
}
const dropped = drop.filter(Boolean).length;
if (dropped) console.log(`  ${dropped} macchie scartate su ${sizes.length}`);

/**
 * Fascia di bordo: la maschera meno se stessa erosa di RIM px. Serve a
 * limitare il despill al solo contorno — dentro al prodotto il verde e
 * l'azzurro sono ingredienti veri (pistacchio, olive) e vanno lasciati stare.
 */
const RIM = 14;
const inner = await sharp(closed, { raw: { width: W, height: H, channels: 1 } })
  .blur(RIM)
  .toColourspace("b-w")
  .raw()
  .toBuffer();

// blur() promuove il raw a 3 canali sRGB: b-w lo tiene a 1 e allineato
const alphaBlurred = await sharp(closed, {
  raw: { width: W, height: H, channels: 1 },
})
  .blur(FEATHER)
  .toColourspace("b-w")
  .raw()
  .toBuffer();

// bbox del soggetto per il trim (alpha significativo)
let x0 = W,
  y0 = H,
  x1 = 0,
  y1 = 0;
for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    if (alphaBlurred[y * W + x] > 12) {
      if (x < x0) x0 = x;
      if (x > x1) x1 = x;
      if (y < y0) y0 = y;
      if (y > y1) y1 = y;
    }
  }
}
const pad = 6;
const box = {
  left: Math.max(0, x0 - pad),
  top: Math.max(0, y0 - pad),
  width: Math.min(W, x1 + pad) - Math.max(0, x0 - pad),
  height: Math.min(H, y1 + pad) - Math.max(0, y0 - pad),
};

/**
 * Il render arriva già composito su nero: ogni pixel di bordo vale
 * colore × alpha, e portarlo così com'è su fondo chiaro lascia una frangia
 * scura attorno al dolce. Dividere per l'alpha (unpremultiply) restituisce
 * il colore vero e il bordo sparisce anche sul fucsia.
 */
const rgb = await sharp(inPath).rotate().removeAlpha().raw().toBuffer();
const rgba = Buffer.alloc(W * H * 4);
for (let i = 0; i < W * H; i++) {
  const a = alphaBlurred[i];
  rgba[i * 4 + 3] = a;
  if (a === 0) continue;
  // clamp: sui pixel quasi trasparenti 255/a esplode e crea un alone chiaro
  const k = Math.min(255 / a, 2.2);
  const r = Math.min(255, Math.round(rgb[i * 3] * k));
  let g = Math.min(255, Math.round(rgb[i * 3 + 1] * k));
  let b = Math.min(255, Math.round(rgb[i * 3 + 2] * k));
  /**
   * Despill sul solo contorno: in un lievitato il verde e il blu non superano
   * il rosso, e sul bordo un pixel freddo è rim light andato storto, non
   * prodotto. Si riportano al livello del rosso, sfumando con la distanza dal
   * bordo così la correzione non lascia uno stacco. I bianchi neutri non si
   * muovono (lì R ≈ G ≈ B) e l'interno resta intatto.
   */
  const edgeness = 1 - inner[i] / 255;
  if (edgeness > 0.02) {
    if (g > r) g = Math.round(g + (r - g) * edgeness);
    if (b > r) b = Math.round(b + (r - b) * edgeness);
  }
  rgba[i * 4] = r;
  rgba[i * 4 + 1] = g;
  rgba[i * 4 + 2] = b;
}

await sharp(rgba, { raw: { width: W, height: H, channels: 4 } })
  .extract(box)
  .resize({ width: MAX_SIDE, height: MAX_SIDE, fit: "inside", withoutEnlargement: true })
  .webp({ quality: 78, alphaQuality: 90, effort: 5 })
  .toFile(outPath);

const cover = ((box.width * box.height) / (W * H)) * 100;
console.log(`${outPath}  crop ${box.width}x${box.height} (${cover.toFixed(0)}% del frame)`);
