import { Scintilla } from "@/components/catalog/salati/DecorativeDoodles";

/**
 * I decori della sub-page Contatti: l'esplosione gialla dietro la scheda,
 * il retino, i cerchi tagliati dai bordi e i segni neri.
 *
 * Tutto è `aria-hidden` e `pointer-events-none` — non c'è niente da
 * leggere e niente da cliccare — e tutto sta in un contenitore che copre
 * la sezione senza aggiungere altezza. Il contenimento orizzontale NON è
 * affidato ai decori: la pagina ha `overflow-x: clip`, che è ciò che
 * permette ai cerchi di uscire davvero dal viewport senza generare una
 * barra di scorrimento (`overflow-x: hidden` avrebbe reso `sticky`
 * inutilizzabile su tutta la colonna, `clip` no).
 *
 * Sotto `sm` restano solo il retino e i cerchi d'angolo: su un telefono
 * l'esplosione gialla finirebbe sopra il titolo, e il titolo è la pagina.
 *
 * La `Scintilla` arriva dai decori della sezione salati, che la
 * dichiarano repertorio comune del sito: ridisegnarla qui vorrebbe dire
 * averne due versioni che divergono al primo ritocco.
 */
export function PopDecorations() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 select-none"
    >
      {/* L'esplosione: sta a cavallo del filo nero, come nel riferimento,
          e finisce dietro l'angolo alto della scheda del form. */}
      <Esplosione className="absolute -top-[3.5rem] right-[26%] hidden h-auto w-[clamp(120px,13vw,210px)] text-acido lg:block" />

      {/* i tre raggi appoggiati al filo, poco prima dell'esplosione */}
      <Scintilla className="absolute -top-6 right-[38%] hidden h-9 w-9 rotate-[8deg] text-inchiostro lg:block" />

      {/* Il retino: una macchia rada in alto a sinistra, sotto il titolo.
          Opacità bassa perché deve dare grana, non disegnare una forma. */}
      <div className="pop-retino absolute left-0 top-[42%] hidden h-24 w-32 opacity-[0.13] sm:block" />

      {/* Il cerchio rosso tagliato dal bordo in basso a sinistra */}
      <div className="absolute -bottom-24 -left-20 h-[clamp(150px,18vw,280px)] w-[clamp(150px,18vw,280px)] rounded-full bg-rosso opacity-95" />

      {/* Le tre gobbe gialle in basso a destra: mezzi cerchi accostati,
          tagliati dal bordo inferiore come nel riferimento. */}
      <div className="absolute -bottom-[clamp(60px,7vw,110px)] right-[4%] hidden gap-0 sm:flex">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="block h-[clamp(110px,13vw,190px)] w-[clamp(110px,13vw,190px)] rounded-full bg-acido"
          />
        ))}
      </div>
    </div>
  );
}

/**
 * L'esplosione a punte. I vertici sono calcolati una volta sola qui sotto
 * invece di essere un `path` scritto a mano: cambiare `PUNTE` cambia il
 * segno senza rifare la geometria, e i numeri restano leggibili.
 *
 * Le punte sono dispari (11) di proposito — con un numero pari la stella
 * diventa simmetrica rispetto al centro e si legge come un ingranaggio.
 */
const PUNTE = 11;
const RAGGIO_ESTERNO = 50;
const RAGGIO_INTERNO = 29;

const VERTICI = Array.from({ length: PUNTE * 2 }, (_, i) => {
  const angolo = (Math.PI * i) / PUNTE - Math.PI / 2;
  const r = i % 2 === 0 ? RAGGIO_ESTERNO : RAGGIO_INTERNO;
  return `${(50 + r * Math.cos(angolo)).toFixed(2)},${(50 + r * Math.sin(angolo)).toFixed(2)}`;
}).join(" ");

export function Esplosione({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" aria-hidden className={className}>
      <polygon points={VERTICI} fill="currentColor" />
    </svg>
  );
}

/**
 * La freccia curva che scende verso il pulsante d'invio: nel riferimento
 * è tracciata a mano e sconfina sul bordo destro della scheda. Tratto
 * tondo (`mano-libera`, l'utility dei decori del sito) e punta piena.
 */
export function FrecciaCurva({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 96"
      fill="none"
      stroke="currentColor"
      strokeWidth={4}
      aria-hidden
      className={`mano-libera ${className ?? ""}`}
    >
      <path d="M114 6 C 118 44, 96 74, 62 82" />
      <path d="M78 66 L 60 83 L 79 92" />
    </svg>
  );
}
