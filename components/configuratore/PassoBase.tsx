"use client";

import { DATASET, farcitureDi, type FotoStati } from "@/lib/configuratore";
import { ImmagineProdotto } from "./ImmagineProdotto";
import { GrigliaTessere } from "./Selettore";
import { TesseraScelta, type Punto } from "./TesseraScelta";

/** Trascinamento verso il palco, da legare alla singola tessera. */
export type DragPasso = {
  onSposta: (p: Punto) => void;
  onRilascia: (id: string, p: Punto) => boolean;
} | null;

/**
 * Passo 1 — la base. Tutte e 10, sempre tutte, sempre selezionabili:
 * non esiste una scelta a monte che possa escluderne una.
 *
 * Sulla tessera compare solo il nome, come nella reference: il numero
 * di farciture disponibili resta nell'etichetta accessibile, dove
 * serve a chi non può contarle a occhio al passo dopo, senza rompere
 * le proporzioni della griglia.
 */
export function PassoBase({
  foto,
  selezionata,
  onScegli,
  drag,
}: {
  foto: FotoStati;
  selezionata: string | null;
  onScegli: (id: string) => void;
  drag?: DragPasso;
}) {
  return (
    <GrigliaTessere>
      {DATASET.basi.map((b) => {
        const n = farcitureDi(b.id).length;
        return (
          <li key={b.id}>
            <TesseraScelta
              titolo={b.nome}
              descrizione={`${b.nome} — ${n === 1 ? "1 farcitura" : `${n} farciture`} a listino`}
              selezionata={selezionata === b.id}
              onScegli={() => onScegli(b.id)}
              drag={
                drag
                  ? {
                      onSposta: drag.onSposta,
                      onRilascia: (p) => drag.onRilascia(b.id, p),
                    }
                  : null
              }
            >
              <ImmagineProdotto
                sorgenti={[foto[b.id]]}
                alt={b.nome}
                iniziale={b.nome.charAt(0)}
              />
            </TesseraScelta>
          </li>
        );
      })}
    </GrigliaTessere>
  );
}
