/**
 * «I nostri salati» — il modello di PRESENTAZIONE della sezione salata.
 *
 * Non duplica il catalogo: `lib/catalog.ts` resta l'unica fonte di nomi,
 * note, assi e still, e questo file legge la vista `SALATI` derivata da
 * lì. Aggiungere un salato al catalogo lo fa comparire nel carosello;
 * cambiargli `macro` lo sposta nella griglia dei dolci. In nessuno dei due
 * casi c'è un elenco da riscrivere qui.
 *
 * Qui vive solo ciò che è impaginazione: la numerazione progressiva della
 * vetrina e il testo alternativo delle fotografie.
 */

import { SALATI, type Tipologia } from "@/lib/catalog";

export type VoceSalata = {
  t: Tipologia;
  /** «01», «02»… progressivo DENTRO la sezione */
  indice: string;
  /** testo alternativo reale: nome più ciò che il catalogo dice del prodotto */
  alt: string;
};

/**
 * La numerazione è progressiva sulla sezione e non ripresa da `code`.
 * Nel catalogo i salati sono N.09→N.17: una vetrina che si apre con «09»
 * racconterebbe una gerarchia che qui non esiste più, perché questa è la
 * prima e unica sezione della linea salata. Il codice di catalogo resta
 * visibile dov'è un dato — nella scheda prodotto.
 */
export const VETRINA_SALATI: VoceSalata[] = SALATI.map((t, i) => ({
  t,
  indice: String(i + 1).padStart(2, "0"),
  alt: `${t.name}: ${t.note ?? "scatto di prodotto"}`,
}));

export const TOTALE_SALATI = VETRINA_SALATI.length;
