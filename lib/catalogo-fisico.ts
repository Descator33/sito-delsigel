/**
 * Il catalogo stampato 2026/2027: le foto della campagna e la destinazione
 * della CTA. Qui la sola STRUTTURA — file, ordine, ritagli. Didascalie e
 * testi alternativi vivono nei dizionari (`slideCatalogo`), agganciati
 * per `id`: le cinque lingue raccontano le stesse fotografie.
 *
 * I file stanno in `public/Foto catalogo fisico` con il nome che avevano
 * all'arrivo — spazi e parentesi compresi. Non sono stati rinominati: il
 * loader di `next/image` passa la src dentro `encodeURIComponent`, quindi
 * qui i percorsi vanno scritti con gli spazi VERI. Pre-codificarli in %20
 * li farebbe codificare due volte e il file non verrebbe trovato.
 *
 * Sono tutte quadrate (~4670 px di lato) e nel carosello vivono in un
 * riquadro 4:5: il taglio toglie il 10% per lato, che su questi scatti da
 * studio non tocca mai volti né dolci. Dove il centro non basta c'è
 * `objectPosition`.
 */

import type { IdSlideCatalogo } from "@/lib/i18n/tipi";

const CARTELLA = "/Foto catalogo fisico";

export type CatalogSlide = {
  /** chiave di didascalia e alt nel dizionario (`slideCatalogo`) */
  id: IdSlideCatalogo;
  src: string;
  /** solo dove il taglio 4:5 centrato perde qualcosa: default `center` */
  objectPosition?: string;
};

/**
 * Ordine editoriale, non alfabetico: si apre con lo scatto più forte
 * (i dolci portati come orecchini), poi si alterna ritratto, dettaglio e
 * still life senza mai mettere in fila due fondi dello stesso colore.
 */
export const CATALOG_SLIDES: readonly CatalogSlide[] = [
  { id: "orecchini", src: `${CARTELLA}/WhatsApp Image 2026-07-25 at 19.19.51.jpeg` },
  { id: "gioielli", src: `${CARTELLA}/WhatsApp Image 2026-07-25 at 19.19.52.jpeg` },
  { id: "borsa", src: `${CARTELLA}/WhatsApp Image 2026-07-25 at 19.19.51 (5).jpeg` },
  { id: "linea-salata", src: `${CARTELLA}/WhatsApp Image 2026-07-25 at 19.19.49.jpeg` },
  { id: "condividere", src: `${CARTELLA}/WhatsApp Image 2026-07-25 at 19.19.51 (2).jpeg` },
  { id: "collezione", src: `${CARTELLA}/WhatsApp Image 2026-07-25 at 19.19.51 (3).jpeg` },
  { id: "finger-food", src: `${CARTELLA}/WhatsApp Image 2026-07-25 at 19.19.50.jpeg` },
  { id: "pennello", src: `${CARTELLA}/WhatsApp Image 2026-07-25 at 19.19.51 (4).jpeg` },
  { id: "morso", src: `${CARTELLA}/WhatsApp Image 2026-07-25 at 19.19.49 (1).jpeg` },
  { id: "san-valentino", src: `${CARTELLA}/WhatsApp Image 2026-07-25 at 19.19.52 (1).jpeg` },
  { id: "scacchiera", src: `${CARTELLA}/WhatsApp Image 2026-07-25 at 19.19.50 (2).jpeg` },
  { id: "coppette", src: `${CARTELLA}/WhatsApp Image 2026-07-25 at 19.19.51 (1).jpeg` },
  { id: "vaso", src: `${CARTELLA}/WhatsApp Image 2026-07-25 at 19.19.50 (1).jpeg` },
  {
    id: "vassoio",
    src: `${CARTELLA}/WhatsApp Image 2026-07-25 at 19.19.53.jpeg`,
    // il vassoio arriva quasi al bordo destro: la finestra si sposta di lì
    objectPosition: "60% 50%",
  },
];

/**
 * Dove porta «Scopri la nuova edizione».
 *
 * Il PDF del catalogo e una pagina dedicata non esistono ancora nel
 * progetto: si va alla pagina contatti, che ha il modulo con cui si chiede
 * listino e campionatura. Quando il catalogo sfogliabile ci sarà, basta
 * cambiare questa costante.
 */
export const DESTINAZIONE_CATALOGO = "/contatti";
