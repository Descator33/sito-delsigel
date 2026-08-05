/**
 * L'alzata su cui il dolce si compone: disegnata, non fotografata.
 * Un SVG e non un raster perché deve scalare da 260 a 800 px senza
 * sfocare, cambiare colore con i token e reagire al drag — e perché
 * un'immagine di una alzata sarebbe una foto di scena in mezzo alle
 * foto di prodotto, che è esattamente la confusione da evitare.
 *
 * Geometria (viewBox 400×138, il rapporto della reference):
 *   y = 18   piano superiore — è la QUOTA DI APPOGGIO del dolce, e
 *            il Banco ci allinea il bordo inferiore del prodotto
 *   18→34   spessore chiaro del piatto
 *   34→52   bordo corallo
 *   52→122  stelo svasato e piede
 * Le fasce sono cilindri veri: bordo superiore e inferiore sono due
 * archi che gonfiano entrambi verso il basso (l'arco vicino delle
 * due ellissi), ed è quello che dà la profondità senza ombre finte.
 *
 * L'alone sopra il piano è l'ombra del dolce: cresce quando una
 * tessera sorvola la scena (classe .alzata-alone, stili nel palco).
 */
export function Alzata({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 138" className={className}>
      <defs>
        <radialGradient id="alzata-piano" cx="0.38" cy="0.2" r="0.9">
          <stop offset="0" stopColor="#fffefc" />
          <stop offset="0.55" stopColor="#fdf6ec" />
          <stop offset="1" stopColor="#eddcc6" />
        </radialGradient>
        <linearGradient id="alzata-spessore" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fbf1e3" />
          <stop offset="1" stopColor="#e5d1b6" />
        </linearGradient>
        <linearGradient id="alzata-bordo" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f78376" />
          <stop offset="0.45" stopColor="#ef6c5f" />
          <stop offset="1" stopColor="#dc5145" />
        </linearGradient>
        <linearGradient id="alzata-stelo" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#d24a3e" />
          <stop offset="0.2" stopColor="#fa9184" />
          <stop offset="0.44" stopColor="#f4776a" />
          <stop offset="0.74" stopColor="#e05a4c" />
          <stop offset="1" stopColor="#cb4438" />
        </linearGradient>
        <radialGradient id="alzata-ombra" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#7a3a1e" stopOpacity="0.26" />
          <stop offset="0.6" stopColor="#7a3a1e" stopOpacity="0.1" />
          <stop offset="1" stopColor="#7a3a1e" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="alzata-alone" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#8a3f22" stopOpacity="0.3" />
          <stop offset="0.65" stopColor="#8a3f22" stopOpacity="0.1" />
          <stop offset="1" stopColor="#8a3f22" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* l'ombra a terra: una macchia morbida, non un filtro */}
      <ellipse cx="200" cy="127" rx="124" ry="12" fill="url(#alzata-ombra)" />

      {/* piede: l'ellisse scura chiude in basso lo svaso dello stelo */}
      <ellipse cx="200" cy="122" rx="71" ry="9" fill="#d4493c" />
      <path
        d="M182 52c0 28-3 42-14 52-11 10-25 14-39 18h142c-14-4-28-8-39-18-11-10-14-24-14-52Z"
        fill="url(#alzata-stelo)"
      />

      {/* il piatto: bordo corallo, spessore chiaro, piano */}
      <path
        d="M3 30v22a197 18 0 0 0 394 0V30a197 18 0 0 1-394 0Z"
        fill="url(#alzata-bordo)"
      />
      <path
        d="M3 18v12a197 18 0 0 0 394 0V18a197 18 0 0 1-394 0Z"
        fill="url(#alzata-spessore)"
      />
      <ellipse
        cx="200"
        cy="18"
        rx="197"
        ry="18"
        fill="url(#alzata-piano)"
        stroke="#e7d4bb"
        strokeWidth="1"
      />

      {/* l'alone di appoggio, sul piano e sotto il dolce */}
      <ellipse
        cx="200"
        cy="19"
        rx="104"
        ry="13"
        fill="url(#alzata-alone)"
        className="alzata-alone"
      />
    </svg>
  );
}
