import { FettaDiTorta } from "@/components/contatti/FettaDiTorta";
import { MAPPA } from "@/lib/contatti";

/**
 * L'invito a venire di persona: campitura rossa, bordo nero, ombra dura.
 *
 * È un link vero e non un riquadro decorativo — porta lo stabilimento su
 * Google Maps, che è l'unica azione sensata dietro «vieni a trovarci». Il
 * banner esce dal sito, quindi `target="_blank"` con `rel="noreferrer"`, e
 * l'`aria-label` lo dice al posto delle tre righe spezzate del titolo, che
 * lette di seguito da uno screen reader suonerebbero come uno slogan e non
 * come una destinazione.
 *
 * Le due misure che contano: `min-h` perché il banner non collassi quando
 * la fetta sparisce sotto `sm`, e il testo che resta il pezzo dominante —
 * l'illustrazione accompagna, non conduce.
 */
export function VisitUsBanner() {
  return (
    <a
      href={MAPPA}
      target="_blank"
      rel="noreferrer"
      aria-label="Vieni a trovarci in stabilimento — apri Google Maps"
      className="pop-banner flex min-h-[132px] items-center justify-between gap-4 overflow-hidden py-5 pl-5 pr-4 sm:min-h-[164px] sm:py-6 sm:pl-8 sm:pr-6"
    >
      <span className="font-pop block text-[clamp(1.45rem,2.5vw,2.35rem)] uppercase leading-[0.94] tracking-[-0.005em]">
        <span className="block text-inchiostro">Preferisci parlarne</span>
        <span className="block text-inchiostro">al banco?</span>
        <span className="mt-1 block text-panna">Vieni a trovarci.</span>
      </span>

      <span className="flex flex-none items-center gap-1 sm:gap-3">
        {/* Il ghirigoro che punta alla fetta: c'è solo dove ha spazio per
            essere un gesto invece di una virgola nera. */}
        <FrecciaSghemba className="pop-freccia-lunga hidden h-auto w-[clamp(48px,5vw,86px)] text-inchiostro md:block" />
        <FettaDiTorta className="h-auto w-[clamp(96px,11vw,168px)]" />
      </span>
    </a>
  );
}

/** il tratto tondo che parte da sinistra, si arriccia e punta a destra */
function FrecciaSghemba({ className }: { className: string }) {
  return (
    <svg
      viewBox="0 0 92 54"
      fill="none"
      stroke="currentColor"
      strokeWidth={3.6}
      aria-hidden
      className={`mano-libera ${className}`}
    >
      <path d="M2 30 L26 30" />
      <path d="M38 44 C 46 54, 62 50, 63 38 C 64 27, 50 24, 48 34 C 46 46, 62 54, 86 40" />
      <path d="M74 30 L88 39 L76 50" />
    </svg>
  );
}
