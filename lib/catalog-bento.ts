/**
 * Catalogo editoriale — il modello di PRESENTAZIONE della griglia bento.
 *
 * Non duplica il catalogo: `lib/catalog.ts` resta l'unica fonte di nomi,
 * note, assi e still. Qui vive solo ciò che è impaginazione — quale
 * tipologia va in vetrina, con che misura, su che campitura, con che
 * ritaglio della foto — e la vetrina è una LISTA DI SLUG: se una tipologia
 * sparisce dal catalogo il build si ferma qui (`vetrina()` lancia) invece
 * di renderizzare una card vuota.
 *
 * Le sette tipologie in vetrina sono i dolci di punta. Le altre due —
 * Stella e Klejner — non spariscono: stanno dietro alla CTA in fondo alla
 * griglia, che le apre in coda senza cambiare pagina.
 *
 * Rev 12/08 — l'Intriko prende la testa della vetrina: card grande in alto
 * a sinistra, campitura fucsia, sigillo «best seller» (che era del
 * Golosone). L'ordine di questa lista È la gerarchia della pagina, e da
 * qui viene anche la numerazione stampata sulle card: la griglia si legge
 * nell'ordine in cui è impaginata, non in quello del listino.
 *
 * Rev 05/08 — questo modello parla SOLO di dolci. La linea salata è uscita
 * dalla griglia e ha una sezione sua (`lib/catalog-salati.ts`), quindi qui
 * si legge `DOLCI` e non più `CATALOG`: nessun salato può rientrare né
 * nella vetrina né nella coda, e i conti dell'intestazione contano la sola
 * linea dolce.
 */

import { DOLCI, type Tipologia } from "@/lib/catalog";

/** Composizione della card: cambia il taglio, non i dati mostrati. */
export type VarianteCard = "hero" | "grande" | "compatta";

/** Le cinque campiture. Nessun colore nuovo se non `sabbia`. */
export type TemaCard = "arancio" | "cacao" | "fucsia" | "acido" | "sabbia";

export type CardCatalogo = {
  t: Tipologia;
  /** «01.» — il posto in vetrina, contato dalla lista */
  indice: string;
  /** claim di card, due righe: è copy di vetrina, non la descrizione
   *  (quella è `t.note` e vive nella scheda prodotto) */
  claim: readonly [string, string];
  variante: VarianteCard;
  tema: TemaCard;
  badge?: string;
  /** posto nella griglia a 12 colonne, da xl in su */
  posto: string;
  /** ritaglio della foto dentro la card, da xl in su: la sagoma esce dai
   *  bordi quanto serve, ed è per-prodotto perché gli still hanno
   *  proporzioni diverse (Lusekatt è largo il doppio del Golosone) */
  foto: string;
};

/**
 * Le variabili che il componente passa alla card: un tema = tre colori,
 * più quanto si può smorzare il claim.
 *
 * `claim` non è una scelta estetica ma di contrasto: panna su cacao o
 * inchiostro su acido hanno margine da vendere e il claim può stare in
 * secondo piano, panna su mandarino no — lì il testo resta pieno, che è
 * tutto quello che si può fare senza spostare la campitura.
 */
export const TEMI: Record<
  TemaCard,
  { fondo: string; testo: string; numero: string; claim: string }
> = {
  arancio: {
    fondo: "var(--mandarino)",
    testo: "var(--panna)",
    numero: "var(--panna)",
    claim: "opacity-100",
  },
  cacao: {
    fondo: "var(--cacao)",
    testo: "var(--panna)",
    numero: "var(--fucsia)",
    claim: "opacity-75",
  },
  fucsia: {
    fondo: "var(--fucsia)",
    testo: "var(--panna)",
    numero: "var(--panna)",
    claim: "opacity-100",
  },
  acido: {
    fondo: "var(--acido)",
    testo: "var(--inchiostro)",
    numero: "var(--fucsia)",
    claim: "opacity-80",
  },
  sabbia: {
    fondo: "var(--sabbia)",
    testo: "var(--inchiostro)",
    numero: "var(--fucsia)",
    claim: "opacity-75",
  },
};

/**
 * La vetrina, nell'ordine in cui si legge.
 *
 * Prima riga 5+4+3 su dodici colonne (≈41/33/25%): tre card della stessa
 * altezza che scendono di peso da sinistra a destra. Seconda riga quattro
 * card uguali, alte poco più della metà — la striscia che chiude
 * l'impaginato senza fargli concorrenza.
 */
const VETRINA = [
  {
    slug: "intriko",
    claim: ["Intrecciata", "alla perfezione."],
    variante: "hero",
    tema: "fucsia",
    badge: "Best seller",
    posto: "sm:col-span-2 xl:col-span-5 xl:row-span-2",
    /* la treccia è la sagoma più larga della vetrina (1,32:1) e attraversa
       la card in diagonale: esce dallo spigolo in basso a destra */
    foto: "xl:w-[68%] xl:h-[87%] xl:right-[-4%] xl:bottom-[-14%]",
  },
  {
    slug: "golosone",
    claim: ["L'originale.", "Soffice e generoso."],
    variante: "grande",
    tema: "arancio",
    posto: "xl:col-span-4 xl:row-span-2",
    foto: "xl:w-[64%] xl:h-[76%] xl:right-[0%] xl:bottom-[-12%]",
  },
  {
    slug: "bomba-fritta",
    claim: ["Classica.", "Senza tempo."],
    variante: "grande",
    tema: "cacao",
    posto: "xl:col-span-3 xl:row-span-2",
    foto: "xl:w-[62%] xl:h-[58%] xl:right-[-2%] xl:bottom-[20%]",
  },
  {
    slug: "cuore",
    claim: ["Morbido dentro.", "Pieno di gusto."],
    variante: "compatta",
    tema: "fucsia",
    posto: "xl:col-span-3",
    foto: "xl:w-[62%] xl:h-[112%] xl:right-[-2%] xl:bottom-[-16%]",
  },
  {
    slug: "frittella",
    claim: ["Cremosa, dorata,", "irresistibile."],
    variante: "compatta",
    tema: "acido",
    posto: "xl:col-span-3",
    foto: "xl:w-[58%] xl:h-[104%] xl:right-[-1%] xl:bottom-[-15%]",
  },
  {
    slug: "lusekatt",
    claim: ["La tradizione", "che scalda il cuore."],
    variante: "compatta",
    tema: "cacao",
    posto: "xl:col-span-3",
    foto: "xl:w-[52%] xl:h-[100%] xl:right-[-1%] xl:bottom-[-4%]",
  },
  {
    slug: "nuvola",
    claim: ["Leggera come", "una nuvola."],
    variante: "compatta",
    tema: "sabbia",
    posto: "xl:col-span-3",
    foto: "xl:w-[56%] xl:h-[100%] xl:right-[0%] xl:bottom-[-8%]",
  },
] as const satisfies readonly {
  slug: string;
  claim: readonly [string, string];
  variante: VarianteCard;
  tema: TemaCard;
  badge?: string;
  posto: string;
  foto: string;
}[];

const PER_SLUG = new Map(DOLCI.map((t) => [t.slug, t]));

/**
 * «01.» è il posto in vetrina, non il codice di listino.
 *
 * I due numeri divergono da quando l'impaginato ha una gerarchia sua
 * (l'Intriko è N.05 a listino e 01. in griglia), ed è giusto così: sulla
 * card il numero conta la lettura, il codice del prodotto resta dov'è
 * sempre stato, in testa alla scheda.
 */
const indiceDi = (posto: number) => `${String(posto + 1).padStart(2, "0")}.`;

function vetrina(): CardCatalogo[] {
  return VETRINA.map((v, i) => {
    const t = PER_SLUG.get(v.slug);
    if (!t)
      throw new Error(
        `catalog-bento: la vetrina cita «${v.slug}», che non è fra i DOLCI`
      );
    return { ...v, t, indice: indiceDi(i) };
  });
}

export const VETRINA_CATALOGO: CardCatalogo[] = vetrina();

const IN_VETRINA = new Set<string>(VETRINA.map((v) => v.slug));

/** I dolci che la vetrina non mostra, nell'ordine del catalogo. */
export const RESTO_DOLCI: Tipologia[] = DOLCI.filter(
  (t) => !IN_VETRINA.has(t.slug)
);

/** Quante varianti dichiara una tipologia: la riga di specifica della card
 *  dice sempre e solo ciò che i dati contengono davvero. */
export function varianti(t: Tipologia): number {
  if (t.axes?.length)
    return t.axes.reduce((n, a) => n * a.values.length, 1);
  if (t.set?.length) return t.set.length;
  return 1;
}

/** «9 tipologie / 30 varianti»: contato, non scritto. Da quando i salati
 *  hanno una sezione loro, il conto dell'intestazione è quello dei dolci. */
export const TOTALE_TIPOLOGIE = DOLCI.length;
export const TOTALE_VARIANTI = DOLCI.reduce((n, t) => n + varianti(t), 0);
