/**
 * La scheda prodotto del catalogo: il ponte fra la tessera di home
 * (lib/catalog.ts) e il dataset del configuratore (lib/configuratore.ts).
 *
 * Regola unica: qui non si inventa niente. Formato, peso e varianti escono
 * dal foglio Delsigel attraverso le funzioni già esistenti — `baseDi`,
 * `farcitureDi`, `combinazione` — e i campi restano `undefined` quando il
 * dato non c'è. Vale in particolare per la linea salata, che nel dataset
 * del configuratore non esiste ancora: la sua scheda mostra la gamma
 * dichiarata dal catalogo e nient'altro.
 *
 * Rev 12/08 — la scheda è un catalogo, non un configuratore. Mostra i
 * PRODOTTI FINITI a listino, cioè le combinazioni (base, farcitura) del
 * dataset: il Golosone è due prodotti, crema e cioccolato. Restano fuori
 * le scelte che si fanno solo nel configuratore — la finitura, il topping
 * derivato dalla coppia, l'elenco astratto delle farciture — perché in
 * scheda darebbero per acquistabile qualcosa che a catalogo non esiste.
 */

import type { Tipologia } from "@/lib/catalog";
import {
  TESSERA_A_BASE,
  baseDi,
  combinazione,
  farcitureDi,
} from "@/lib/configuratore";

/** Un prodotto finito della gamma: una riga del listino, non una scelta. */
export type Variante = {
  /** id farcitura del dataset (o valore d'asse, per le tessere senza base) */
  id: string;
  /** nome commerciale a listino, es. «Ciock e lampone», «Bomba Super» */
  nome: string;
  /** chiave del catalogo: sceglie lo still (`variants`) e il pallino colorato */
  chiave: string;
  /** grammatura della combinazione, quando il foglio la dichiara */
  peso?: string;
};

export type Scheda = {
  linea: string;
  /** diametro dichiarato dal foglio, es. «Ø 9,5 cm» */
  formato?: string;
  /** grammatura, o intervallo quando la farcitura la fa variare */
  peso?: string;
  pezziPerCartone?: number;
  modalitaUso?: string;
  /** i prodotti finiti a catalogo */
  gamma: { label: string; varianti: Variante[] }[];
  /** href del configuratore, solo se la tipologia ha una base configurabile */
  configuratore?: string;
};

/**
 * Farcitura del listino → chiave del catalogo, che vale insieme per lo
 * still e per il colore del pallino.
 *
 * Le due fonti nominano la stessa cosa in modi diversi: il listino è
 * commerciale («Ciock e lampone»), il catalogo fotografico
 * («cioccolato»). Come TESSERA_A_BASE, la corrispondenza è dichiarata e
 * mai assunta: una farcitura che non compare qui tiene il proprio id come
 * chiave, e semplicemente non trova uno still — la scheda ripiega sullo
 * scatto principale, mai su quello di un'altra farcitura.
 */
const FARCITURA_A_CHIAVE: Record<string, string> = {
  cioccolato: "cioccolato",
  "ciock-e-lampone": "cioccolato",
  "tre-cioccolati": "tre cioccolati",
  crema: "crema",
  "crema-e-fragola": "crema",
  "crema-e-lampone": "crema",
  pistacchio: "pistacchio",
  "pistacchio-e-lampone": "pistacchio",
  "marmellata-frutti-rossi-e-ribes": "marmellata",
  "frutti-di-bosco-e-ribes": "marmellata",
  "frutti-rossi": "frutti di bosco",
  "senza-farcitura": "semplice",
};

const numero = (n: number) =>
  n.toLocaleString("it-IT", { maximumFractionDigits: 1 });

export function schedaDi(t: Tipologia): Scheda {
  /* fallback per le tessere senza base nel dataset (tutta la linea salata):
     la gamma dichiarata dal catalogo è l'unica cosa che si sa */
  const gammaCatalogo = t.axes?.length
    ? t.axes.map((a) => ({
        label: a.label,
        varianti: a.values.map((v) => ({ id: v, nome: v, chiave: v })),
      }))
    : t.set?.length
      ? [
          {
            label: "Set",
            varianti: t.set.map((v) => ({ id: v, nome: v, chiave: v })),
          },
        ]
      : [];

  const scheda: Scheda = {
    linea: t.macro === "dolci" ? "Dolci" : "Salati",
    gamma: gammaCatalogo,
  };

  const idBase = TESSERA_A_BASE[t.slug];
  const base = idBase ? baseDi(idBase) : null;
  if (!base) return scheda;

  scheda.formato = `Ø ${numero(base.diametro_cm)} cm`;
  scheda.pezziPerCartone = base.packaging.pezzi_per_cartone;
  scheda.modalitaUso = base.modalita_uso;
  scheda.configuratore = `/configuratore/${base.id}`;

  const varianti: Variante[] = [];
  const grammature: number[] = [];
  for (const f of farcitureDi(base.id)) {
    const c = combinazione(base.id, f.id);
    if (!c) continue;
    grammature.push(c.grammatura_gr);
    varianti.push({
      id: f.id,
      /* il nome proprio della combinazione vince sul nome della farcitura:
         bomba + crema si vende come «Bomba Super», non come «Crema» */
      nome: c.nome ?? f.nome,
      chiave: FARCITURA_A_CHIAVE[f.id] ?? f.id,
      peso: `${c.grammatura_gr} g`,
    });
  }

  /* la gamma del listino sostituisce quella del catalogo: gli assi delle
     tessere mescolano prodotti finiti e scelte da configuratore (il
     Golosone ha un asse «Finitura» che a catalogo non è un prodotto).
     Sotto le due varianti non c'è gamma da sfogliare — il Lussekatt è un
     prodotto solo, e un elenco di una voce sola direbbe il contrario */
  scheda.gamma =
    varianti.length > 1 ? [{ label: "Varianti a catalogo", varianti }] : [];

  if (grammature.length) {
    const min = Math.min(...grammature);
    const max = Math.max(...grammature);
    scheda.peso = min === max ? `${min} g` : `${min}–${max} g`;
  }

  return scheda;
}
