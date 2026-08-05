"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";

/**
 * Le due frecce, ai fianchi della fila.
 *
 * Stanno appese al centro degli ovali (`top-[38%]`, che è dove cade l'asse
 * dei prodotti una volta tolti numero e nome dal conto) e non al centro
 * geometrico della vetrina.
 *
 * Da md in su la fila si stringe e lascia due corsie libere ai lati
 * (`px` sul contenitore del carosello): le frecce vivono lì dentro, quindi
 * non coprono mai un ovale a nessuna larghezza — che è la ragione per cui
 * la corsia esiste. Sotto md non ci sono: lì si sfoglia con il dito, la
 * fila si prende tutta la larghezza e i pallini bastano a dire dove si è.
 *
 * A fine corsa il comando è `disabled`: sparisce alla vista, esce dal
 * percorso del tabulatore e resta annunciato come disattivato — nel
 * riferimento, al primo prodotto, a sinistra non c'è nulla.
 */

export function CarouselArrows({
  puoiPrima,
  puoiDopo,
  prima,
  dopo,
}: {
  puoiPrima: boolean;
  puoiDopo: boolean;
  prima: () => void;
  dopo: () => void;
}) {
  return (
    <>
      <Freccia verso="prima" onClick={prima} attivo={puoiPrima} className="left-0" />
      <Freccia verso="dopo" onClick={dopo} attivo={puoiDopo} className="right-0" />
    </>
  );
}

function Freccia({
  verso,
  onClick,
  attivo,
  className,
}: {
  verso: "prima" | "dopo";
  onClick: () => void;
  attivo: boolean;
  className: string;
}) {
  const Segno = verso === "prima" ? ArrowLeft : ArrowRight;
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!attivo}
      aria-label={
        verso === "prima"
          ? "Mostra i prodotti precedenti"
          : "Mostra i prodotti successivi"
      }
      className={`salati-comando absolute top-[38%] z-10 hidden h-11 w-11 -translate-y-1/2 place-items-center rounded-full md:grid xl:h-12 xl:w-12 ${className}`}
    >
      <Segno aria-hidden strokeWidth={1.5} className="h-[18px] w-[18px]" />
    </button>
  );
}
