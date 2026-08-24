"use client";

import { ArrowRight } from "lucide-react";

/**
 * La CTA sotto la griglia. Nel riferimento è una pillola sola: qui è anche
 * un interruttore, perché la vetrina mostra tre dolci su nove e gli altri
 * sei non possono uscire dalla home. Aperta, la coda scorre sotto la
 * griglia; chiusa, la sezione è esattamente il riferimento.
 *
 * L'etichetta chiusa è parametrica: «dolci» resta il valore predefinito,
 * mentre la sezione gemella la riusa per «salati».
 */
export function CatalogFooterCTA({
  aperto,
  onToggle,
  controlla,
  etichettaChiusa = "Scopri tutti i dolci",
}: {
  aperto: boolean;
  onToggle: () => void;
  /** id del pannello che apre, per aria-controls */
  controlla: string;
  etichettaChiusa?: string;
}) {
  return (
    <div className="mt-6 flex justify-center xl:mt-7">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={aperto}
        aria-controls={controlla}
        className="font-tecnico group inline-flex min-h-11 items-center gap-8 rounded-full border border-fucsia px-7 text-[10px] font-semibold uppercase tracking-[0.18em] text-fucsia transition-colors hover:bg-fucsia hover:text-panna focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-fucsia"
      >
        {aperto ? "Mostra solo la vetrina" : etichettaChiusa}
        <ArrowRight
          aria-hidden
          strokeWidth={1.5}
          className={`h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 ${
            aperto ? "-rotate-90" : ""
          }`}
        />
      </button>
    </div>
  );
}
