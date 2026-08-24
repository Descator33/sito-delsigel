"use client";

import {
  farcituraVoce,
  toppingVoce,
  type Base,
  type Combinazione,
} from "@/lib/configuratore";
import { IconaSpunta } from "./Decori";

/**
 * Il rail dei tre passi, in testa alla colonna delle scelte: discreto
 * ma leggibile, perché è anche la via principale per tornare indietro.
 * I passi completati sono riapribili (tornare alla base azzera la
 * farcitura per costruzione dell'URL, senza tentativi di conservarla),
 * il corrente è marcato in pieno, il futuro è muto e tratteggiato.
 *
 * Rilievo 2026-08-20: i chip a 10.5px col solo glifo ↺ non si
 * spiegavano — cresciuti di un punto e col verbo scritto, «cambia»,
 * in corallo. Il glifo era decorazione, la parola è un'istruzione.
 *
 * La finitura al terzo posto resta «in scelta» finché l'utente non la
 * applica col suo gesto (dal 2026-08-02 non arriva mai da sola): solo
 * allora mostra il nome del topping previsto dalla ricetta.
 */
export function Riepilogo({
  base,
  comb,
  finituraApplicata,
  apriPasso,
}: {
  base: Base | null;
  comb: Combinazione | null;
  finituraApplicata: boolean;
  apriPasso: (passo: 1 | 2) => void;
}) {
  const farcitura = comb ? farcituraVoce(comb.farcitura) : null;
  const topping = comb && finituraApplicata ? toppingVoce(comb.topping) : null;
  const corrente = comb ? 3 : base ? 2 : 1;

  const voci: {
    n: 1 | 2 | 3;
    etichetta: string;
    valore: string | null;
    apribile: boolean;
  }[] = [
    { n: 1, etichetta: "Base", valore: base?.nome ?? null, apribile: corrente > 1 },
    {
      n: 2,
      etichetta: "Farcitura",
      valore: farcitura?.nome ?? null,
      apribile: corrente > 2,
    },
    { n: 3, etichetta: "Finitura", valore: topping?.nome ?? null, apribile: false },
  ];

  return (
    <ol
      aria-label="Avanzamento del configuratore"
      className="candy-livelli grid list-none grid-cols-3 gap-2"
    >
      {voci.map((v) => {
        const attivo = v.n === corrente;
        const completato = v.n < corrente || (v.n === 3 && finituraApplicata);
        const numero = String(v.n).padStart(2, "0");
        const testo = (
          <>
            <span className="candy-livello__numero">
              {completato ? (
                <IconaSpunta className="h-4 w-4" />
              ) : (
                numero
              )}
            </span>
            <span className="min-w-0 text-left">
              <span className="candy-livello__nome">{v.valore ?? v.etichetta}</span>
            </span>
          </>
        );

        if (v.apribile) {
          return (
            <li key={v.n}>
              <button
                type="button"
                onClick={() => apriPasso(v.n as 1 | 2)}
                aria-label={`Torna al passo ${v.n}, ${v.etichetta}: ${v.valore}`}
                data-stato="completato"
                className="candy-livello group relative flex h-full w-full flex-col items-center justify-center text-inchiostro focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-inchiostro"
              >
                {testo}
                <span
                  aria-hidden
                  className="candy-livello__cambia"
                >
                  cambia
                </span>
              </button>
            </li>
          );
        }

        return (
          <li key={v.n}>
            <span
              aria-current={attivo ? "step" : undefined}
              data-stato={completato ? "completato" : attivo ? "attivo" : "futuro"}
              className="candy-livello flex flex-col items-center justify-center"
            >
              {testo}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
