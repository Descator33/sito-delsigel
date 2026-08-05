/**
 * Il repertorio disegnato del palco: scintille, asterischi, smile,
 * fumetto, adesivo, frecce e ghirigori. Tutto SVG, tutto in un file
 * solo — sono segni, non componenti: separarli in dieci file darebbe
 * dieci import e nessuna informazione in più.
 *
 * Regole comuni:
 *  · `aria-hidden` è dentro ogni forma, non a carico di chi la usa:
 *    sono segni, non contenuto, e non esiste un caso in cui debbano
 *    finire nell'albero accessibile;
 *  · il colore arriva da `currentColor` ovunque sia sensato, così la
 *    stessa forma serve corallo, oro o inchiostro senza duplicati;
 *  · nessuna animazione autonoma: il movimento lo decide la scena.
 *
 * Non è un client component: sono funzioni pure che rendono markup, e
 * il confine "use client" lo tiene chi le compone.
 */

/** Scintilla a quattro punte: il segno pop più ricorrente della scena. */
export function Scintilla({ className }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 100 100" fill="currentColor" className={className}>
      <path d="M50 0c3 26 24 47 50 50-26 3-47 24-50 50-3-26-24-47-50-50 26-3 47-24 50-50Z" />
    </svg>
  );
}

/** Asterisco a sei raste, tratto pieno e capi tondi: la firma pop che
 *  scavalca gli angoli del palco e apre la colonna del titolo. */
export function Asterisco({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 100 100"
      fill="none"
      stroke="currentColor"
      strokeWidth={11}
      className={`mano-libera ${className ?? ""}`}
    >
      <path d="M49 8v84" />
      <path d="M16 27l68 46" />
      <path d="M84 25L18 75" />
    </svg>
  );
}

/** Lo smile giallo che si appoggia sul bordo del palco come un
 *  adesivo: anello crema esterno per staccarsi dal profilo nero. */
export function Smile({ className }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 100 100" className={className}>
      <circle cx="50" cy="52" r="45" fill="#c99a12" opacity="0.35" />
      <circle
        cx="50"
        cy="50"
        r="45"
        fill="var(--oro)"
        stroke="var(--inchiostro)"
        strokeWidth="4"
      />
      <rect x="31" y="33" width="8" height="15" rx="4" fill="var(--inchiostro)" />
      <rect x="61" y="33" width="8" height="15" rx="4" fill="var(--inchiostro)" />
      <path
        d="M30 59q20 19 40 0"
        fill="none"
        stroke="var(--inchiostro)"
        strokeWidth="5"
        className="mano-libera"
      />
    </svg>
  );
}

/** Fumetto con il cuore: l'unico commento della scena, e non serve
 *  che dica altro. */
export function FumettoCuore({ className }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 100 80" className={className}>
      <path
        d="M14 2h72a12 12 0 0 1 12 12v34a12 12 0 0 1-12 12H40l-16 16 3-16H14A12 12 0 0 1 2 48V14A12 12 0 0 1 14 2Z"
        fill="var(--carta)"
        stroke="var(--inchiostro)"
        strokeWidth="2.5"
        className="mano-libera"
      />
      <path
        d="M50 47.5l-1-.9C43.8 41.9 40 38.7 40 34.7c0-3.2 2.5-5.7 5.7-5.7 1.8 0 3.5.8 4.3 2.2.8-1.4 2.5-2.2 4.3-2.2 3.2 0 5.7 2.5 5.7 5.7 0 4-3.8 7.2-9 11.9l-1 .9Z"
        fill="var(--corallo-scena)"
      />
    </svg>
  );
}

/** L'adesivo «il tuo dolce, la tua storia»: un cartellino appeso,
 *  con la linguetta e il foro. Il testo è dentro l'SVG apposta —
 *  scala col palco senza una riga di CSS responsive. */
export function Adesivo({ className }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 112 140" className={className}>
      <defs>
        <linearGradient id="adesivo-carta" x1="0" y1="0" x2="0.3" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#fdf1e4" />
        </linearGradient>
      </defs>
      {/* la linguetta con il foro, dietro al corpo */}
      <rect
        x="36"
        y="2"
        width="40"
        height="34"
        rx="14"
        fill="url(#adesivo-carta)"
        stroke="var(--linea)"
        strokeWidth="1.6"
      />
      <rect x="49" y="12" width="14" height="6" rx="3" fill="#e8d4bb" />
      <rect
        x="3"
        y="22"
        width="106"
        height="116"
        rx="20"
        fill="url(#adesivo-carta)"
        stroke="var(--linea)"
        strokeWidth="1.6"
      />
      <text
        x="56"
        y="58"
        textAnchor="middle"
        fontSize="10"
        fontWeight="700"
        letterSpacing="0.2"
        fill="var(--inchiostro)"
      >
        IL TUO DOLCE,
      </text>
      <text
        x="56"
        y="80"
        textAnchor="middle"
        fontSize="17"
        fontWeight="800"
        letterSpacing="-0.2"
        fill="var(--corallo-scena)"
      >
        LA TUA
      </text>
      <text
        x="56"
        y="98"
        textAnchor="middle"
        fontSize="17"
        fontWeight="800"
        letterSpacing="-0.2"
        fill="var(--corallo-scena)"
      >
        STORIA
      </text>
      <path
        d="M56 126l-1.3-1.2c-6.6-6-11-10-11-15 0-4.1 3.2-7.3 7.3-7.3 2.3 0 4.5 1.1 5.5 2.8 1-1.7 3.2-2.8 5.5-2.8 4.1 0 7.3 3.2 7.3 7.3 0 5-4.4 9-11 15L56 126Z"
        fill="none"
        stroke="var(--corallo-scena)"
        strokeWidth="2.4"
        className="mano-libera"
      />
    </svg>
  );
}

/** La freccia che dal testo punta al piatto: asta appena ondulata,
 *  punta aperta e due trattini di slancio ai lati. */
export function FrecciaGiu({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 52 58"
      fill="none"
      stroke="currentColor"
      strokeWidth="3.4"
      className={`mano-libera ${className ?? ""}`}
    >
      <path d="M26 5c-2.6 13 2 25-.4 39" />
      <path d="M16.5 32l9 12.5L35 32" />
      <path d="M6 26L1.5 37" />
      <path d="M46 26l4.5 11" />
    </svg>
  );
}

/** Il ghirigoro della colonna sinistra: un ricciolo che si srotola e
 *  accompagna lo sguardo verso il palco. */
export function GhirigoroFreccia({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 150 76"
      fill="none"
      stroke="currentColor"
      strokeWidth="3.6"
      className={`mano-libera ${className ?? ""}`}
    >
      <path d="M3 42c19 18 43 15 48-2 4-13-7-21-15-16-9 5-4 22 15 29 25 9 58-6 79-33" />
      <path d="M115 15l17 3-3 18" />
    </svg>
  );
}

/** La sottolineatura disegnata sotto «dolce»: un colpo solo, con la
 *  coda che si alleggerisce. */
export function SottolineaturaOro({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 240 16"
      fill="none"
      stroke="var(--oro)"
      strokeWidth="8"
      className={`mano-libera ${className ?? ""}`}
      preserveAspectRatio="none"
    >
      <path d="M5 11c62-6 150-8 230-4" />
    </svg>
  );
}

/** Freccia in cerchio del pulsante nero: l'unica icona funzionale
 *  della colonna introduttiva. */
export function FrecciaCerchio({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 26 26"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      className={`mano-libera ${className ?? ""}`}
    >
      <circle cx="13" cy="13" r="12" />
      <path d="M8 13h9M13.4 9.4L17 13l-3.6 3.6" />
    </svg>
  );
}

/** La manina della pillola in fondo al palco: dice «si prende e si
 *  trascina» meglio di qualsiasi parola in più. */
export function IconaMano({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      className={`mano-libera ${className ?? ""}`}
    >
      <path d="M8.5 12.5V5.2a1.6 1.6 0 0 1 3.2 0v6.1" />
      <path d="M11.7 11.6v-1a1.6 1.6 0 0 1 3.2 0v1.5" />
      <path d="M14.9 11.9v-.7a1.6 1.6 0 0 1 3.2 0v5a5 5 0 0 1-5 5h-1a4.6 4.6 0 0 1-3.6-1.8l-2.9-3.7a1.5 1.5 0 0 1 2.2-2l1.7 1.8" />
    </svg>
  );
}

/** Chiusura del dialogo «come funziona». */
export function IconaChiudi({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      className={`mano-libera ${className ?? ""}`}
    >
      <path d="M7 7l10 10M17 7L7 17" />
    </svg>
  );
}
