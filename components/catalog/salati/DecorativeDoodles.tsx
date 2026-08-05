/**
 * I decori pop della sezione salata: segni disegnati, non icone.
 *
 * Sono SVG con tratto tondo (`mano-libera`, la stessa utility dei decori
 * del configuratore) e non emoji né glifi di libreria: a queste misure la
 * differenza fra un segno tracciato e un'icona da set si vede tutta, ed è
 * quello che tiene la copertina dalla parte dell'editoriale.
 *
 * Vivono in due zone. Nel `pannello` stanno la scintilla bianca e il
 * ghirigoro fucsia che sconfina sulla vetrina — è lui a cucire le due
 * campiture — più lo zigzag in basso. Nella `vetrina` restano una
 * scintilla e un cuore, appoggiati agli angoli liberi.
 *
 * Tutto è `aria-hidden` e `pointer-events-none`: non c'è nulla da leggere
 * e nulla da cliccare. Sotto sm i segni più grandi spariscono — su un
 * telefono ruberebbero spazio al prodotto, che è l'unica cosa che conta.
 */

export function DecorativeDoodles({ zona }: { zona: "pannello" | "vetrina" }) {
  if (zona === "pannello") {
    return (
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <Scintilla className="absolute right-[13%] top-[10%] h-[clamp(20px,2.2vw,30px)] w-[clamp(20px,2.2vw,30px)] text-panna" />
        <Ghirigoro className="absolute left-[86%] top-[11%] hidden h-auto w-[clamp(56px,7vw,104px)] text-fucsia sm:block" />
        <Zigzag className="absolute bottom-[8%] right-[11%] hidden h-auto w-[clamp(40px,4.4vw,62px)] text-fucsia sm:block" />
      </div>
    );
  }

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      <Scintilla className="absolute right-[3%] top-[9%] h-[clamp(20px,2.2vw,32px)] w-[clamp(20px,2.2vw,32px)] text-fucsia" />
      <Cuore className="absolute bottom-[8%] right-[4%] hidden h-auto w-[clamp(24px,2.6vw,36px)] text-fucsia sm:block" />
    </div>
  );
}

/* I quattro segni sono esportati singolarmente perché la chiusura della
   home («Crea da solo il tuo dolce custom») usa gli stessi: sono il
   repertorio pop del sito, non decori privati di questa sezione, e
   ridisegnarli altrove significherebbe averne due versioni che divergono
   al primo ritocco. */

/** tre raggi che partono da un centro che non c'è: il segno «poff» */
export function Scintilla({ className }: { className: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth={3}
      className={`mano-libera ${className}`}
    >
      <path d="M16.5 3 L15 13" />
      <path d="M4 9.5 L11 15" />
      <path d="M28.5 11 L20.5 15.5" />
    </svg>
  );
}

/** il nastro che si arriccia e attraversa il taglio fra le due campiture */
export function Ghirigoro({ className }: { className: string }) {
  return (
    <svg
      viewBox="0 0 104 46"
      fill="none"
      stroke="currentColor"
      strokeWidth={3.2}
      className={`mano-libera ${className}`}
    >
      <path d="M2 33 C 12 9, 30 5, 35 17 C 40 29, 24 39, 20 28 C 16 17, 33 5, 52 10 C 70 15, 76 30, 102 21" />
    </svg>
  );
}

/** lo scarabocchio a tre punte, in basso a sinistra come nel riferimento */
export function Zigzag({ className }: { className: string }) {
  return (
    <svg
      viewBox="0 0 62 36"
      fill="none"
      stroke="currentColor"
      strokeWidth={3.4}
      className={`mano-libera ${className}`}
    >
      <path d="M3 30 L13 7 L23 30 L33 7 L43 28 L59 12" />
    </svg>
  );
}

/** il cuore: contorno, mai pieno */
export function Cuore({ className }: { className: string }) {
  return (
    <svg
      viewBox="0 0 40 38"
      fill="none"
      stroke="currentColor"
      strokeWidth={3.2}
      className={`mano-libera ${className}`}
    >
      <path d="M20 35 C 5 23, 2 14, 6.5 8 C 11 2, 18.5 4.5 20 12 C 21.5 4.5, 29 2, 33.5 8 C 38 14, 35 23, 20 35 Z" />
    </svg>
  );
}

/**
 * La rosetta a otto petali dell'occhiello: otto cerchi che si sovrappongono
 * a uno centrale. Disegnarla per unione invece che con un path di archi la
 * tiene leggibile — e modificabile — senza ricalcolare geometrie.
 */
const PETALI = [
  [80, 50],
  [71.21, 71.21],
  [50, 80],
  [28.79, 71.21],
  [20, 50],
  [28.79, 28.79],
  [50, 20],
  [71.21, 28.79],
] as const;

export function Rosetta({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" aria-hidden className={className}>
      <g fill="currentColor">
        {PETALI.map(([cx, cy]) => (
          <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={17} />
        ))}
        <circle cx={50} cy={50} r={25} />
      </g>
    </svg>
  );
}
