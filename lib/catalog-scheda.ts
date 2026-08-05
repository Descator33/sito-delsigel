/**
 * La scheda prodotto del catalogo: il ponte fra la tessera di home
 * (lib/catalog.ts) e il dataset del configuratore (lib/configuratore.ts).
 *
 * Regola unica: qui non si inventa niente. Formato, peso, farciture e
 * topping escono dal foglio Delsigel attraverso le funzioni già esistenti
 * — `baseDi`, `farcitureDi`, `combinazione`, `toppingDi` — e i campi
 * restano `undefined` quando il dato non c'è. Vale in particolare per la
 * linea salata, che nel dataset del configuratore non esiste ancora: la
 * sua scheda mostra la gamma dichiarata dal catalogo e nient'altro.
 */

import type { Tipologia } from "@/lib/catalog";
import {
  TESSERA_A_BASE,
  baseDi,
  combinazione,
  farcitureDi,
  toppingDi,
} from "@/lib/configuratore";

export type Scheda = {
  linea: string;
  /** diametro dichiarato dal foglio, es. «Ø 9,5 cm» */
  formato?: string;
  /** grammatura, o intervallo quando la farcitura la fa variare */
  peso?: string;
  pezziPerCartone?: number;
  modalitaUso?: string;
  farciture: string[];
  topping: string[];
  /** la gamma del catalogo: assi (gusto/finitura/formato) o set */
  gamma: { label: string; values: string[] }[];
  /** href del configuratore, solo se la tipologia ha una base configurabile */
  configuratore?: string;
};

const numero = (n: number) =>
  n.toLocaleString("it-IT", { maximumFractionDigits: 1 });

export function schedaDi(t: Tipologia): Scheda {
  const gamma = t.axes?.length
    ? t.axes.map((a) => ({ label: a.label, values: a.values }))
    : t.set?.length
      ? [{ label: "Set", values: t.set }]
      : [];

  const scheda: Scheda = {
    linea: t.macro === "dolci" ? "Dolci" : "Salati",
    farciture: [],
    topping: [],
    gamma,
  };

  const idBase = TESSERA_A_BASE[t.slug];
  const base = idBase ? baseDi(idBase) : null;
  if (!base) return scheda;

  scheda.formato = `Ø ${numero(base.diametro_cm)} cm`;
  scheda.pezziPerCartone = base.packaging.pezzi_per_cartone;
  scheda.modalitaUso = base.modalita_uso;
  scheda.configuratore = `/configuratore/${base.id}`;

  const farciture = farcitureDi(base.id);
  scheda.farciture = farciture.map((f) => f.nome);

  /* il topping è derivato dalla combinazione, mai scelto: si raccoglie
     dallo stesso giro, senza una seconda mappa da tenere allineata */
  const topping = new Map<string, string>();
  const grammature: number[] = [];
  for (const f of farciture) {
    const c = combinazione(base.id, f.id);
    if (c) grammature.push(c.grammatura_gr);
    const tp = toppingDi(base.id, f.id);
    if (tp) topping.set(tp.id, tp.nome);
  }
  scheda.topping = [...topping.values()];

  if (grammature.length) {
    const min = Math.min(...grammature);
    const max = Math.max(...grammature);
    scheda.peso = min === max ? `${min} g` : `${min}–${max} g`;
  }

  return scheda;
}
