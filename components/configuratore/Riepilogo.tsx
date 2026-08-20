"use client";

import {
  farcituraVoce,
  toppingVoce,
  type Base,
  type Combinazione,
} from "@/lib/configuratore";

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
    <ol className="flex list-none flex-wrap items-center gap-2">
      {voci.map((v) => {
        const attivo = v.n === corrente;
        const numero = String(v.n).padStart(2, "0");
        const testo = (
          <>
            <span
              className={
                attivo ? "font-mono text-[10px] text-panna/60" : "font-mono text-[10px] text-inchiostro/40"
              }
            >
              {numero}
            </span>
            <span className="text-[11.5px] font-bold uppercase tracking-[0.04em]">
              {v.valore ?? v.etichetta}
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
                className="group flex items-center gap-1.5 rounded-full border border-linea bg-carta px-3 py-2 text-inchiostro transition-colors hover:border-inchiostro hover:bg-panna-dim/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-corallo-scena"
              >
                {testo}
                <span
                  aria-hidden
                  className="text-[9.5px] font-bold uppercase tracking-[0.06em] text-corallo-scena underline decoration-corallo-scena/35 underline-offset-2 transition-colors group-hover:decoration-corallo-scena"
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
              className={`flex items-center gap-1.5 rounded-full px-3 py-2 ${
                attivo
                  ? "bg-inchiostro text-panna"
                  : "border border-dashed border-linea text-inchiostro/40"
              }`}
            >
              {testo}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
