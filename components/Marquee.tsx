const STRIP =
  "Delsigel / L'industria artigianale / Innovazione e Tradizione / Dal 2011 / ";

/** L'unica fascia a scorrimento infinito della pagina: acido, bordata d'inchiostro. */
export function Marquee() {
  return (
    <div
      aria-hidden
      className="marquee border-y-4 border-inchiostro bg-acido py-3.5 text-inchiostro"
    >
      <div className="marquee-track">
        {[0, 1].map((k) => (
          <span
            key={k}
            className="type-display shrink-0 text-xl leading-none"
          >
            {STRIP.repeat(6)}
          </span>
        ))}
      </div>
    </div>
  );
}
