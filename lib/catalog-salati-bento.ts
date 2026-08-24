/**
 * Presentazione bento della linea salata.
 *
 * I dati di prodotto restano in `lib/catalog.ts`: qui vive soltanto la
 * gerarchia della vetrina, come in `lib/catalog-bento.ts` per i dolci.
 * Le tre card richieste sono Pizzetta al Pomodoro, Pizzetta Fritta e
 * Montanarina; tutte le altre tipologie finiscono nella coda espandibile.
 */

import { SALATI } from "@/lib/catalog";
import {
  varianti,
  type CardCatalogo,
  type TemaCard,
  type VarianteCard,
} from "@/lib/catalog-bento";

const VETRINA = [
  {
    slug: "pizzetta-al-pomodoro",
    claim: ["La classica.", "Sempre irresistibile."],
    variante: "hero",
    tema: "arancio",
    posto: "sm:col-span-2 xl:col-span-5 xl:row-span-2",
    foto: "xl:h-[88%] xl:w-[70%] xl:right-[-5%] xl:bottom-[-12%]",
  },
  {
    slug: "pizzetta-fritta",
    claim: ["Soffice, dorata,", "tutta da gustare."],
    variante: "grande",
    tema: "cacao",
    posto: "xl:col-span-4 xl:row-span-2",
    foto: "xl:h-[78%] xl:w-[67%] xl:right-[-5%] xl:bottom-[-10%]",
  },
  {
    slug: "montanarina",
    claim: ["Napoletana.", "Semplicemente buona."],
    variante: "grande",
    tema: "fucsia",
    posto: "xl:col-span-3 xl:row-span-2",
    foto: "xl:h-[66%] xl:w-[70%] xl:right-[-9%] xl:bottom-[4%]",
  },
] as const satisfies readonly {
  slug: string;
  claim: readonly [string, string];
  variante: VarianteCard;
  tema: TemaCard;
  posto: string;
  foto: string;
}[];

const PER_SLUG = new Map(SALATI.map((t) => [t.slug, t]));

function vetrina(): CardCatalogo[] {
  return VETRINA.map((voce, indice) => {
    const t = PER_SLUG.get(voce.slug);
    if (!t) {
      throw new Error(
        `catalog-salati-bento: la vetrina cita «${voce.slug}», che non è fra i SALATI`,
      );
    }

    return {
      ...voce,
      t,
      indice: `${String(indice + 1).padStart(2, "0")}.`,
    };
  });
}

export const VETRINA_SALATI_BENTO = vetrina();

const IN_VETRINA = new Set<string>(VETRINA.map((voce) => voce.slug));

export const RESTO_SALATI = SALATI.filter(
  (t) => !IN_VETRINA.has(t.slug),
);

export const TOTALE_SALATI = SALATI.length;
export const TOTALE_VARIANTI_SALATE = SALATI.reduce(
  (totale, t) => totale + varianti(t),
  0,
);
