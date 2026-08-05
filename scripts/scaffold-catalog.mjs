/**
 * Scaffold del catalogo prodotti (albero 2026/2027, da albero_prodotti_delsigel.html).
 *
 * Crea assets/catalog/<macro>/<...>/<variante>/refs/ per ogni foglia dell'albero
 * (+ _group/refs/ per i rami che hanno foto proprie non assegnate a una variante)
 * e scrive assets/catalog/manifest.json — la fonte di verità per la pipeline:
 *
 *   refs/  → 3 foto reali scelte     → master still Higgsfield (inchiostro #160601)
 *   master.png → ritaglio con alpha  → public/products/<slug>.webp
 *
 * Idempotente: rilanciarlo non tocca cartelle o file esistenti.
 * Run: node scripts/scaffold-catalog.mjs
 */
import { mkdirSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname;
const BASE = join(ROOT, "assets", "catalog");

// Albero prodotti — copiato 1:1 dal rawData dell'HTML (name, images, children).
const TREE = {"name":"DELSIGEL","children":[{"name":"DOLCI","images":0,"children":[{"name":"BOMBA FRITTA","images":0,"children":[{"name":"BOMBA FRITTA CON CREMA","images":0,"children":[{"name":"BOMBA FRITTA CON CREMA - APERTA","images":20,"children":[]},{"name":"BOMBA FRITTA CON CREMA - CHIUSA","images":9,"children":[]}]},{"name":"BOMBA FRITTA SEMPLICE","images":0,"children":[{"name":"BOMBA FRITTA SEMPLICE - APERTA","images":18,"children":[]},{"name":"BOMBA FRITTA SEMPLICE - CHIUSA","images":7,"children":[]}]}]},{"name":"CUORE","images":0,"children":[{"name":"CUORE AL CIOCCOLATO","images":19,"children":[]},{"name":"CUORE AL PISTACCHIO","images":25,"children":[]},{"name":"CUORE ALLA MARMELLATA","images":17,"children":[]},{"name":"CUORE CON LA CREMA","images":26,"children":[]},{"name":"CUORE SEMPLICE","images":14,"children":[]}]},{"name":"FRITTELLA","images":0,"children":[{"name":"FRITTELLA CIOCCOLATO","images":21,"children":[]},{"name":"FRITTELLA CREMA","images":18,"children":[]}]},{"name":"GOLOSONE","images":0,"children":[{"name":"GOLOSONE CON CIOCCOLATO","images":0,"children":[{"name":"GOLOSONE AL CIOCCOLATO - CON GRANELLA","images":25,"children":[]},{"name":"GOLOSONE CIOCCOLATO - SEMPLICE","images":13,"children":[]},{"name":"GOLOSONE CON CIOCCOLATO - APERTO","images":20,"children":[]}]},{"name":"GOLOSONE CON CREMA","images":0,"children":[{"name":"GOLOSONE CON CREMA - APERTO","images":20,"children":[]},{"name":"GOLOSONE CON CREMA - GRANELLA","images":11,"children":[]},{"name":"GOLOSONE CON CREMA - SEMPLICE","images":11,"children":[]}]}]},{"name":"INTRIKO","images":0,"children":[{"name":"INTRIKO - CIOCCOLATO","images":64,"children":[]},{"name":"INTRIKO - FRUTTI DI BOSCO","images":15,"children":[]},{"name":"INTRIKO - PISTACCHIO","images":20,"children":[]},{"name":"INTRIKO - TRE CIOCCOLATI","images":19,"children":[]}]},{"name":"LUSEKATT","images":14,"children":[]},{"name":"NUVOLA","images":0,"children":[{"name":"NUVOLA CON CIOCCOLATO","images":54,"children":[]},{"name":"NUVOLA CON CREMA","images":21,"children":[]},{"name":"NUVOLA CON MARMELLATA","images":43,"children":[]},{"name":"NUVOLA CON PISTACCHIO","images":46,"children":[]},{"name":"NUVOLA SEMPLICE","images":6,"children":[]}]},{"name":"STELLA","images":0,"children":[{"name":"STELLA CON CIOCCOLATO","images":16,"children":[]},{"name":"STELLA CON CREMA","images":18,"children":[]},{"name":"STELLA CON MARMELLATA","images":32,"children":[]},{"name":"STELLA CON PISTACCHIO","images":26,"children":[]},{"name":"STELLA SEMPLICE","images":15,"children":[]}]}]},{"name":"SALATI","images":0,"children":[{"name":"FOCACCINE MISTE TRE GUSTI","images":23,"children":[{"name":"FOCACCINA BIANCA","images":10,"children":[]},{"name":"FOCACCINA CURCUMA","images":6,"children":[]},{"name":"FOCACCINA POMODORO","images":10,"children":[]}]},{"name":"MONTANARINA","images":0,"children":[{"name":"MONTANARINA CON MOZZARELLA","images":14,"children":[]},{"name":"MONTANARINA CON POMODORO","images":10,"children":[]}]},{"name":"PANINETTO COLORATO TRE GUSTI","images":15,"children":[{"name":"PANINETTO AL POMODORO","images":5,"children":[]},{"name":"PANINETTO COLORATO BIANCO","images":25,"children":[]},{"name":"PANINETTO COLORATO CURCUMA","images":10,"children":[]}]},{"name":"PIZZETTA AL POMODORO","images":24,"children":[]},{"name":"PIZZETTA BIANCA","images":17,"children":[]},{"name":"PIZZETTA FRITTA","images":0,"children":[{"name":"PIZZETTA FRITTA PICCOLA","images":6,"children":[]},{"name":"PIZZETTA PICCOLA MEDIA","images":9,"children":[]}]},{"name":"PIZZETTE FANTASIA","images":0,"children":[{"name":"PIZZETTA FANTASIA FUNGHI","images":10,"children":[]},{"name":"PIZZETTA FANTASIA OLIVE","images":12,"children":[]},{"name":"PIZZETTA FANTASIA VERDURE","images":15,"children":[]},{"name":"PIZZETTA FANTASIA WURSTEL","images":11,"children":[]}]},{"name":"RUSTICI","images":8,"children":[{"name":"RUSTICO AI 4 FORMAGGI","images":9,"children":[]},{"name":"RUSTICO CON I FUNGHI","images":5,"children":[]},{"name":"RUSTICO CON I PEPERONI","images":12,"children":[]},{"name":"RUSTICO CON PIZZAIOLA","images":15,"children":[]},{"name":"RUSTICO CON WURSTEL","images":10,"children":[]},{"name":"RUSTICO CON RICOTTA E SPINACI","images":11,"children":[]}]},{"name":"VOL AU VENT","images":12,"children":[]}]}]};

const slug = (s) =>
  s.toLowerCase()
    .normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const variants = [];
const groups = [];
let dirsCreated = 0;

function ensure(dir) {
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
    dirsCreated++;
  }
}

function walk(node, pathSlugs, ancestors, depth = 0) {
  const isRoot = depth === 0;
  const mySlugs = isRoot ? [] : [...pathSlugs, slug(node.name)];
  const kids = node.children || [];

  if (!isRoot && kids.length === 0) {
    // foglia = variante: riceve refs/ e una entry nel manifest
    const rel = join("assets", "catalog", ...mySlugs);
    ensure(join(ROOT, rel, "refs"));
    variants.push({
      name: node.name,
      slug: slug(node.name),
      macro: ancestors[0] ?? null,
      tipologia: ancestors[1] ?? node.name,
      path: rel,
      driveImages: node.images,
      refs: join(rel, "refs"),
      master: join(rel, "master.png"),
      card: `public/products/${slug(node.name)}.webp`,
      status: "todo",
    });
    return;
  }

  // ramo con foto proprie (es. RUSTICI: scatti di gruppo) → _group/refs
  if (!isRoot && node.images > 0) {
    const rel = join("assets", "catalog", ...mySlugs, "_group");
    ensure(join(ROOT, rel, "refs"));
    groups.push({ name: node.name, path: rel, driveImages: node.images });
  }

  const nextAncestors = isRoot ? [] : [...ancestors, node.name];
  for (const k of kids) walk(k, mySlugs, nextAncestors, depth + 1);
}

walk(TREE, [], []);

const manifest = {
  generatedFrom: "albero_prodotti_delsigel.html (Catalogo 2026/2027)",
  pipeline: {
    background: "#160601",
    rimLight: "acid yellow, upper left",
    steps: ["refs (3 foto reali)", "master still (nano banana, 16:9)", "cutout alpha", "card webp"],
  },
  variants,
  groups,
};

ensure(join(ROOT, "public", "products"));
writeFileSync(join(BASE, "manifest.json"), JSON.stringify(manifest, null, 2) + "\n");

const byMacro = {};
for (const v of variants) byMacro[v.macro] = (byMacro[v.macro] || 0) + 1;
console.log(`cartelle create: ${dirsCreated}`);
console.log(`varianti: ${variants.length}`, byMacro);
console.log(`rami con foto di gruppo: ${groups.length}`);
console.log(`manifest: assets/catalog/manifest.json`);
