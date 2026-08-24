/**
 * «Crea da solo il tuo dolce custom» — le quattro tappe raccontate in home
 * e i tre stati del dolce che scorrono sul nastro. Qui la sola STRUTTURA:
 * numeri, colori e chiavi delle foto. Titoli, testi e alt vivono nei
 * dizionari (`configuratore.percorso` e `configuratore.statiNastro`),
 * allineati per indice a questi due elenchi.
 *
 * Non è una copia del configuratore: è la sua vetrina. Il configuratore
 * vero (app/[lang]/configuratore) chiede base, farcitura, finitura,
 * formato e quantità; qui si racconta il gesto, non il modulo, e si porta
 * l'utente dentro.
 *
 * Tappe e dolci sono DUE elenchi separati, e non è una svista: le tappe
 * sono quattro (tre scelte più l'esito), gli stati del dolce sono tre —
 * l'esito non aggiunge un quarto stato, è il terzo che esce dalla linea.
 * Legarli uno a uno vorrebbe dire ripetere una fotografia, che sul
 * nastro si legge come un errore. Il nastro distribuisce i tre dolci
 * sulla stessa larghezza della fila, proporzionalmente: la
 * corrispondenza è di ritmo, non di colonna.
 *
 * Il campo `stato` è la chiave di public/img/configuratore/prodotti/: la
 * stessa che usa il configuratore per le sue foto. Nessun percorso
 * cablato — li risolve `fotoStati()` a render, lato server — quindi se
 * una foto cambia nome o arriva più tardi la sezione non si rompe.
 *
 * Il dolce d'esempio è la Nuvola, sempre la stessa in stati successivi:
 * vuota, farcita alla crema e fragola, chiusa con lo zucchero a velo. È
 * questo che rende leggibile il nastro — tre dolci diversi sarebbero tre
 * prodotti, non un'evoluzione.
 */

export type TappaPercorso = {
  numero: string;
  /** colore del pallino e del segno pop: variabile CSS della palette */
  colore: string;
};

export type StatoDolce = {
  /** cartella di public/img/configuratore/prodotti/ da cui esce la foto */
  stato: string;
};

export const PERCORSO: readonly TappaPercorso[] = [
  { numero: "01", colore: "var(--fucsia)" },
  { numero: "02", colore: "var(--acido)" },
  { numero: "03", colore: "var(--viola)" },
  { numero: "04", colore: "var(--mandarino)" },
] as const;

export const DOLCI: readonly StatoDolce[] = [
  { stato: "nuvola" },
  { stato: "nuvola--crema-e-fragola" },
  { stato: "nuvola--crema-e-fragola--zucchero-a-velo-idrorepellente" },
] as const;

/** Lo stato con l'URL della foto già risolto (o senza, se non c'è). */
export type DolceConFoto = StatoDolce & { foto?: string };

/** La route vera del configuratore: optional catch-all, la radice è il passo 1. */
export const DESTINAZIONE_CONFIGURATORE = "/configuratore";

/** Ancora del percorso: la CTA secondaria ci riporta sopra. */
export const ANCORA_PERCORSO = "come-si-crea";
