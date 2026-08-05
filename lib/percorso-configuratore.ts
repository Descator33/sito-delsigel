/**
 * «Crea da solo il tuo dolce custom» — le quattro tappe raccontate in home
 * e i tre stati del dolce che scorrono sul nastro.
 *
 * Non è una copia del configuratore: è la sua vetrina. Il configuratore
 * vero (app/configuratore) chiede base, farcitura, finitura, formato e
 * quantità; qui si racconta il gesto, non il modulo, e si porta l'utente
 * dentro.
 *
 * Rev 05/08 — via la tappa «Personalizza il look»: prometteva colori e
 * scritte che il configuratore non fa.
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
  titolo: string;
  testo: string;
  /** colore del pallino e del segno pop: variabile CSS della palette */
  colore: string;
};

export type StatoDolce = {
  /** cartella di public/img/configuratore/prodotti/ da cui esce la foto */
  stato: string;
  alt: string;
};

export const PERCORSO: readonly TappaPercorso[] = [
  {
    numero: "01",
    titolo: "Scegli la base",
    testo: "Seleziona la base che preferisci e dai forma al tuo dolce.",
    colore: "var(--fucsia)",
  },
  {
    numero: "02",
    titolo: "Aggiungi la farcitura",
    testo: "Scegli la crema o il ripieno che più ti ispira.",
    colore: "var(--acido)",
  },
  {
    numero: "03",
    titolo: "Completa con il topping",
    testo: "Aggiungi croccantezze, frutta, golosità e decorazioni.",
    colore: "var(--viola)",
  },
  {
    numero: "04",
    titolo: "Ottieni il tuo dolce",
    testo: "Visualizza il risultato e completa la tua creazione.",
    colore: "var(--mandarino)",
  },
] as const;

export const DOLCI: readonly StatoDolce[] = [
  { stato: "nuvola", alt: "Nuvola vuota, la base senza farcitura" },
  {
    stato: "nuvola--crema-e-fragola",
    alt: "Nuvola farcita con crema e fragola",
  },
  {
    stato: "nuvola--crema-e-fragola--zucchero-a-velo-idrorepellente",
    alt: "Nuvola alla crema e fragola con zucchero a velo",
  },
] as const;

/** Lo stato con l'URL della foto già risolto (o senza, se non c'è). */
export type DolceConFoto = StatoDolce & { foto?: string };

/** La route vera del configuratore: optional catch-all, la radice è il passo 1. */
export const DESTINAZIONE_CONFIGURATORE = "/configuratore";

/** Ancora del percorso: la CTA secondaria ci riporta sopra. */
export const ANCORA_PERCORSO = "come-si-crea";
