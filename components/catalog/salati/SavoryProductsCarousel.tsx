"use client";

import type { EmblaViewportRefType } from "embla-carousel-react";
import type { Tipologia } from "@/lib/catalog";
import type { VoceSalata } from "@/lib/catalog-salati";
import { SavoryProductItem } from "./SavoryProductItem";

/**
 * Il binario: viewport, fila di prodotti e nient'altro.
 *
 * Non possiede lo stato del carosello — riceve il `ref` del viewport da
 * chi lo monta (`SavoryProductShowcase`), che è anche l'unico a poter
 * mettere d'accordo frecce e pagination con la posizione. Qui resta la
 * sola impaginazione della fila.
 *
 * `role="group"` con `aria-roledescription="carosello"`: è il modello
 * a rullo (non a tab) e la fila si sfoglia trascinando, con le frecce o
 * con il tabulatore — Embla porta in campo la diapositiva che riceve il
 * fuoco, quindi la tastiera non lascia mai indietro il prodotto attivo.
 */

export function SavoryProductsCarousel({
  carosello,
  voci,
  onApri,
}: {
  carosello: EmblaViewportRefType;
  voci: VoceSalata[];
  onApri: (t: Tipologia) => void;
}) {
  return (
    <div
      ref={carosello}
      className="salati-viewport"
      role="group"
      aria-roledescription="carosello"
      aria-label="I prodotti della linea salata"
    >
      <div className="salati-binario">
        {voci.map((voce, i) => (
          <SavoryProductItem
            key={voce.t.slug}
            voce={voce}
            posizione={i + 1}
            totale={voci.length}
            onApri={() => onApri(voce.t)}
          />
        ))}
      </div>
    </div>
  );
}
