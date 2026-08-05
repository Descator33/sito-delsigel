"use client";

import { ArrowRight } from "lucide-react";

/**
 * Il comando tondo del catalogo: filo sottile a riposo, pieno all'hover
 * (l'inversione la fa `.freccia-tonda` in globals.css, leggendo --fondo).
 *
 * `misura` è solo la misura da xl in su: sotto è sempre 44 px, il minimo
 * tattile, anche sulle card compatte dove il disegno la vorrebbe più
 * piccola.
 */
export function CircleArrowButton({
  label,
  onClick,
  misura = "grande",
  className = "",
}: {
  label: string;
  onClick?: () => void;
  misura?: "grande" | "piccola";
  className?: string;
}) {
  const box =
    misura === "grande"
      ? "h-11 w-11 xl:h-[clamp(2.3rem,2.85vw,3rem)] xl:w-[clamp(2.3rem,2.85vw,3rem)]"
      : "h-11 w-11 xl:h-[clamp(2rem,2.4vw,2.5rem)] xl:w-[clamp(2rem,2.4vw,2.5rem)]";

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={`freccia-tonda ${box} ${className}`}
    >
      <ArrowRight
        aria-hidden
        strokeWidth={1.5}
        className={misura === "grande" ? "h-[18px] w-[18px]" : "h-4 w-4"}
      />
    </button>
  );
}
