"use client";

import type { ReactNode } from "react";
import type { Base, Combinazione } from "@/lib/configuratore";
import { Riepilogo } from "./Riepilogo";

/**
 * La colonna delle scelte: rail dei passi, titolo sottolineato d'oro,
 * e sotto quello che il passo corrente propone — la griglia delle
 * tessere ai passi 1 e 2, il pannello dei numeri quando il dolce è
 * finito. Il guscio è uno solo per tutti e tre i passi: cambiando
 * passo cambia il contenuto, non l'impaginato, e l'occhio non deve
 * riorientarsi.
 */
export function Selettore({
  titolo,
  base,
  comb,
  finituraApplicata,
  apriPasso,
  children,
}: {
  titolo: string;
  base: Base | null;
  comb: Combinazione | null;
  finituraApplicata: boolean;
  apriPasso: (passo: 1 | 2) => void;
  children: ReactNode;
}) {
  return (
    <div className="relative min-w-0">
      {/* i trattini di slancio in testa alla colonna, come nella
          reference: tre segni e basta */}
      <svg
        aria-hidden
        viewBox="0 0 40 34"
        fill="none"
        stroke="var(--corallo-scena)"
        strokeWidth="3.4"
        className="mano-libera pointer-events-none absolute -top-6 right-0 hidden w-[34px] xl:block"
      >
        <path d="M4 30L14 4" />
        <path d="M20 30L27 8" />
        <path d="M34 26l4-18" />
      </svg>

      <Riepilogo
        base={base}
        comb={comb}
        finituraApplicata={finituraApplicata}
        apriPasso={apriPasso}
      />

      <h2 className="mt-5 inline-block">
        <span className="block text-[14px] font-extrabold uppercase leading-none tracking-[0.05em] text-inchiostro sm:text-[15px]">
          {titolo}
        </span>
        <span aria-hidden className="mt-2 block h-[5px] w-full rounded-full bg-oro" />
      </h2>

      <div className="mt-6">{children}</div>
    </div>
  );
}

/** La griglia delle tessere: due colonne sul telefono, tre da sm in
 *  su — la misura della reference. */
export function GrigliaTessere({ children }: { children: ReactNode }) {
  return (
    <ul className="grid list-none grid-cols-2 gap-2.5 sm:grid-cols-3">{children}</ul>
  );
}
