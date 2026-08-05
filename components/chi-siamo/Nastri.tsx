"use client";

import { useRef } from "react";
import { useScatto } from "@/lib/useScatto";

/* inclinazioni alternate e marcate: al centro i nastri quasi si toccano,
   alle estremità si incrociano in profondità — l'acido passa sopra a tutti */
const FASCE = [
  "-rotate-[2.7deg] bg-viola",
  "z-20 -mt-4 rotate-[2.2deg] bg-acido md:-mt-5",
  "z-10 -mt-4 -rotate-[1.5deg] bg-panna md:-mt-5",
];

/**
 * Stacco tra le sezioni: tre nastri a tutta larghezza, storti in versi
 * alternati e sovrapposti come le fasce-premio del riferimento, a cavallo
 * del confine (i margini negativi mordono le sezioni sopra e sotto). Ogni
 * nastro schiva il cursore per conto suo, con rotazione attenuata: è largo
 * un viewport.
 */
export function Nastri({ voci }: { voci: [string, string, string] }) {
  const ref = useRef<HTMLDivElement>(null);

  useScatto(ref);

  return (
    <div
      aria-hidden
      ref={ref}
      className="relative z-30 -my-10 overflow-x-clip md:-my-12"
    >
      {voci.map((testo, i) => (
        <div
          key={testo}
          data-scatto
          data-scatto-rot="2.5"
          className={`relative -mx-[4%] border-y-2 border-inchiostro py-3.5 text-center md:py-4 ${FASCE[i]}`}
        >
          <p className="type-display text-[clamp(1.05rem,2.4vw,1.9rem)] leading-none text-inchiostro">
            {testo}
          </p>
        </div>
      ))}
    </div>
  );
}
