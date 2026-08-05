/**
 * La fetta di torta del banner «vieni a trovarci»: un disegno vettoriale,
 * non un'emoji e non una foto.
 *
 * L'emoji era esclusa dalla specifica, ma il motivo vero è che su una
 * campitura rossa un glifo di sistema cambia faccia a ogni piattaforma —
 * su Windows quella fetta è un'altra fetta. Qui il contorno è nero come
 * ogni altro segno della pagina e le campiture sono i colori del sito:
 * crema per la panna, acido per il pan di spagna, rosso per la ciliegia.
 *
 * Il viewBox è largo quanto serve alla sola fetta: l'ombra ellittica sotto
 * è dentro il disegno, così la fetta appoggia sul rosso invece di
 * galleggiarci.
 */
/* La sagoma della fetta: punta in basso a sinistra, dorso verticale a
   destra. Serve due volte — una per riempirla, una come `clipPath` per
   tagliarci dentro le fasce degli strati — quindi è una costante e non un
   `d` copiato in due punti, che al primo ritocco divergerebbe. */
const SAGOMA =
  "M14 104 L96 40 L130 40 L130 100 C 130 108, 108 113, 74 113 C 40 113, 14 110, 14 104 Z";

export function FettaDiTorta({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 150 132"
      fill="none"
      aria-hidden
      className={className}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <defs>
        <clipPath id="fetta-sagoma">
          <path d={SAGOMA} />
        </clipPath>
      </defs>

      {/* l'ombra portata: appoggio, non profondità */}
      <ellipse cx="76" cy="119" rx="54" ry="8" fill="#160601" opacity="0.32" />

      {/* la campitura di base — la panna fra gli strati */}
      <path d={SAGOMA} fill="#fffaf3" />

      {/* Gli strati di pan di spagna: due fasce orizzontali ritagliate
          sulla sagoma. Fatte così seguono da sole il taglio diagonale
          della fetta, senza doverne ricalcolare i vertici. */}
      <g clipPath="url(#fetta-sagoma)">
        <rect x="0" y="62" width="150" height="13" fill="#fbc50a" />
        <rect x="0" y="88" width="150" height="13" fill="#fbc50a" />
        <g stroke="#160601" strokeWidth="3.2">
          <path d="M0 62 H150" />
          <path d="M0 75 H150" />
          <path d="M0 88 H150" />
          <path d="M0 101 H150" />
        </g>
      </g>

      {/* il profilo, ridisegnato sopra gli strati perché resti continuo */}
      <path d={SAGOMA} stroke="#160601" strokeWidth="4.6" />

      {/* La glassa sul dorso: una colata che scavalca lo spigolo alto e
          cola sul fianco destro. */}
      <path
        d="M96 40 L130 40 L130 55 C 124 58, 120 50, 114 53 C 108 56, 106 48, 100 50 L 96 40 Z"
        fill="#fffaf3"
        stroke="#160601"
        strokeWidth="4"
      />

      {/* la ciliegia col picciolo, in cima allo spigolo */}
      <path
        d="M112 30 C 114 20, 120 13, 128 12"
        stroke="#160601"
        strokeWidth="3.6"
      />
      <circle
        cx="111"
        cy="34"
        r="10"
        fill="#e8442e"
        stroke="#160601"
        strokeWidth="4"
      />
    </svg>
  );
}

/**
 * Il segno di sottolineatura sotto il recapito: il colpo di pennarello
 * del riferimento. Due tracciati che si alternano nella griglia — quattro
 * tessere con lo stesso identico ghirigoro si leggerebbero come un bordo
 * stampato, che è l'opposto del disegnato a mano.
 */
const TRATTI = [
  "M3 12 C 26 4, 62 4, 96 8 C 118 10, 132 12, 146 9",
  "M4 9 C 30 15, 66 14, 100 8 C 120 5, 134 6, 147 11",
] as const;

export function Sottolineatura({
  variante,
  className,
}: {
  variante: number;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 150 18"
      fill="none"
      stroke="currentColor"
      strokeWidth={3.4}
      aria-hidden
      preserveAspectRatio="none"
      className={`mano-libera ${className ?? ""}`}
    >
      <path d={TRATTI[variante % TRATTI.length]} />
    </svg>
  );
}
