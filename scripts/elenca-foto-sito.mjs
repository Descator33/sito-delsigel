import { readdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

// Solo cartelle usate dal sito: gli archivi fotografici originali restano esclusi.
const cartelle = ["chi-siamo", "storia-generated", "products", "products-4k", "Foto catalogo fisico", "brand", "img/home-configuratore"];
async function elenca(cartella) {
  const percorso = join("public", cartella);
  const voci = await readdir(percorso, { withFileTypes: true }).catch((errore) => {
    if (errore.code === "ENOENT") return [];
    throw errore;
  });
  const risultati = await Promise.all(voci.map(async (voce) => {
    const nome = `${cartella}/${voce.name}`;
    if (voce.isDirectory()) return elenca(nome);
    return /\.(webp|png|jpe?g|svg)$/i.test(voce.name)
      ? [`/${nome.split("/").map(encodeURIComponent).join("/")}`] : [];
  }));
  return risultati.flat();
}
const foto = (await Promise.all(cartelle.map(elenca))).flat().sort();
await writeFile("lib/foto-sito.json", `${JSON.stringify(foto, null, 2)}\n`);
console.log(`${foto.length} foto del sito indicizzate per il precaricamento.`);
