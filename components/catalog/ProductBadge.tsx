/**
 * Il sigillo di vetrina: stella a 22 punte, disegnata in SVG e non
 * ritagliata da un PNG, così resta nitida a ogni misura e ruota
 * all'hover senza sfocarsi (la rotazione è in `.badge-vetrina`).
 *
 * Il path è generato una volta su una griglia 100×100 — raggio esterno
 * 50, interno 41,5 — e vive qui come costante: nessuna geometria da
 * ricalcolare a render.
 */

export const STELLA =
  "M50.00 0.00 L55.91 8.92 L64.09 2.03 L67.24 12.25 L77.03 7.94 L77.18 18.64 L87.79 17.26 L84.91 27.56 L95.48 29.23 L89.82 38.31 L99.49 42.88 L91.50 50.00 L99.49 57.12 L89.82 61.69 L95.48 70.77 L84.91 72.44 L87.79 82.74 L77.18 81.36 L77.03 92.06 L67.24 87.75 L64.09 97.97 L55.91 91.08 L50.00 100.00 L44.09 91.08 L35.91 97.97 L32.76 87.75 L22.97 92.06 L22.82 81.36 L12.21 82.74 L15.09 72.44 L4.52 70.77 L10.18 61.69 L0.51 57.12 L8.50 50.00 L0.51 42.88 L10.18 38.31 L4.52 29.23 L15.09 27.56 L12.21 17.26 L22.82 18.64 L22.97 7.94 L32.76 12.25 L35.91 2.03 L44.09 8.92Z";

export function ProductBadge({
  righe,
  className = "",
}: {
  /** due parole: la prima in fucsia, la seconda in panna */
  righe: readonly [string, string];
  className?: string;
}) {
  return (
    <div
      aria-hidden
      className={`badge-vetrina pointer-events-none absolute ${className}`}
    >
      <svg viewBox="0 0 100 100" className="h-full w-full">
        <path d={STELLA} fill="var(--inchiostro)" />
        <text
          x="50"
          y="45"
          textAnchor="middle"
          fill="var(--fucsia)"
          className="font-tecnico"
          fontSize="15"
          fontWeight="600"
          letterSpacing="0.4"
        >
          {righe[0]}
        </text>
        <text
          x="50"
          y="63"
          textAnchor="middle"
          fill="var(--panna)"
          className="font-tecnico"
          fontSize="13"
          fontWeight="600"
          letterSpacing="0.4"
        >
          {righe[1]}
        </text>
      </svg>
    </div>
  );
}
