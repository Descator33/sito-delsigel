import { MARK_PATHS, LETTER_PATHS, COUNTER_PATHS } from "@/components/logo-paths";

/**
 * Logo Delsigel 2026 — "Vortice Corallo": il gelato mantecato visto
 * dall'alto, eco della forma circolare del sigillo storico.
 * Inline perché i colori seguono il contesto: le lettere prendono
 * currentColor, il vortice resta corallo su qualunque superficie.
 */
type LogoProps = {
  variant?: "horizontal" | "stacked" | "mark";
  /** colore della superficie sotto il logo: campisce gli occhielli di d/e/g */
  surface?: string;
  className?: string;
  title?: string;
};

export function Logo({
  variant = "horizontal",
  surface = "var(--panna)",
  className,
  title = "Delsigel",
}: LogoProps) {
  const mark = (
    <g fill="var(--corallo)">
      {MARK_PATHS.map((d, i) => (
        <path key={i} d={d} />
      ))}
    </g>
  );
  const word = (
    <>
      <g fill="currentColor">
        {LETTER_PATHS.map((d, i) => (
          <path key={i} d={d} />
        ))}
      </g>
      <g fill={surface}>
        {COUNTER_PATHS.map((d, i) => (
          <path key={i} d={d} />
        ))}
      </g>
    </>
  );

  if (variant === "mark") {
    return (
      <svg viewBox="719 462 558 553" role="img" aria-label={title} className={className}>
        {mark}
      </svg>
    );
  }

  if (variant === "stacked") {
    return (
      <svg viewBox="233 462 1534 1166" role="img" aria-label={title} className={className}>
        {mark}
        {word}
      </svg>
    );
  }

  /* orizzontale: vortice ridotto all'altezza delle maiuscole, wordmark a destra */
  return (
    <svg viewBox="0 0 2088 537" role="img" aria-label={title} className={className}>
      <g transform="translate(-572.11 -367.61) scale(0.7957)">{mark}</g>
      <g transform="translate(321 -1091.5)">{word}</g>
    </svg>
  );
}
