/**
 * Il catalogo stampato 2026/2027: le foto della campagna e la destinazione
 * della CTA.
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

const CARTELLA = "/Foto catalogo fisico";

export type CatalogSlide = {
  src: string;
  alt: string;
  /** didascalia breve, stampata in basso sulla foto */
  label: string;
  /** solo dove il taglio 4:5 centrato perde qualcosa: default `center` */
  objectPosition?: string;
};

/**
 * Ordine editoriale, non alfabetico: si apre con lo scatto più forte
 * (i dolci portati come orecchini), poi si alterna ritratto, dettaglio e
 * still life senza mai mettere in fila due fondi dello stesso colore.
 */
export const CATALOG_SLIDES: readonly CatalogSlide[] = [
  {
    src: `${CARTELLA}/WhatsApp Image 2026-07-25 at 19.19.51.jpeg`,
    alt: "Modella con cappello leopardato indossa due dolci Delsigel come orecchini, su fondo giallo",
    label: "Dolci da indossare",
  },
  {
    src: `${CARTELLA}/WhatsApp Image 2026-07-25 at 19.19.52.jpeg`,
    alt: "Due bignè in scatoline regalo blu circondati da perle, orecchini e un orologio dorato, su fondo arancione",
    label: "Piccoli gioielli",
  },
  {
    src: `${CARTELLA}/WhatsApp Image 2026-07-25 at 19.19.51 (5).jpeg`,
    alt: "Borsa lilla all'uncinetto con dentro due dolci ripieni di confettura, su fondo rosso",
    label: "Moda e pasticceria",
  },
  {
    src: `${CARTELLA}/WhatsApp Image 2026-07-25 at 19.19.49.jpeg`,
    alt: "Ragazzo appoggiato a un piano arancione circondato da pizzette Delsigel",
    label: "La linea salata",
  },
  {
    src: `${CARTELLA}/WhatsApp Image 2026-07-25 at 19.19.51 (2).jpeg`,
    alt: "Quattro mani prendono girelle e sfogliatine da piatti colorati, su fondo fucsia",
    label: "Da condividere",
  },
  {
    src: `${CARTELLA}/WhatsApp Image 2026-07-25 at 19.19.51 (3).jpeg`,
    alt: "Due bomboloni su alzatine di cristallo con perle e papillon nero, su fondo rosso",
    label: "Da collezione",
  },
  {
    src: `${CARTELLA}/WhatsApp Image 2026-07-25 at 19.19.50.jpeg`,
    alt: "Bocconcini salati farciti in equilibrio su vasi scultorei, su fondo blu",
    label: "Finger food",
  },
  {
    src: `${CARTELLA}/WhatsApp Image 2026-07-25 at 19.19.51 (4).jpeg`,
    alt: "Una mano rifinisce con un pennello un dolce a forma di fiore, accanto a una tavolozza di colori",
    label: "Rifiniti a mano",
  },
  {
    src: `${CARTELLA}/WhatsApp Image 2026-07-25 at 19.19.49 (1).jpeg`,
    alt: "Ragazza con cerchietto di perle morde un bombolone alla confettura, su fondo arancione",
    label: "Un morso alla volta",
  },
  {
    src: `${CARTELLA}/WhatsApp Image 2026-07-25 at 19.19.52 (1).jpeg`,
    alt: "Due bomboloni a forma di cuore su fondo blu disegnato a cuoricini",
    label: "Edizione San Valentino",
  },
  {
    src: `${CARTELLA}/WhatsApp Image 2026-07-25 at 19.19.50 (2).jpeg`,
    alt: "Bomboloni disposti come pedine su una scacchiera rosa e arancione",
    label: "Gioco di gusto",
  },
  {
    src: `${CARTELLA}/WhatsApp Image 2026-07-25 at 19.19.51 (1).jpeg`,
    alt: "Tre bignè salati farciti in coppette a fantasia, su fondo giallo",
    label: "Bocconcini salati",
  },
  {
    src: `${CARTELLA}/WhatsApp Image 2026-07-25 at 19.19.50 (1).jpeg`,
    alt: "Sfogliatine salate raccolte in un vaso di vetro fumé, su fondo verde",
    label: "Sfoglia salata",
  },
  {
    src: `${CARTELLA}/WhatsApp Image 2026-07-25 at 19.19.53.jpeg`,
    alt: "Una mano prende uno di due bomboloni farciti da un vassoio ovale, su fondo giallo",
    label: "Il classico",
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
