"use client";

import { useRef } from "react";
import Image from "next/image";
import { useTesti } from "@/components/LinguaProvider";
import { useScatto } from "@/lib/useScatto";

/* targa esagonale centrale, come l'emblema del riferimento */
const HEX =
  "polygon(7% 0, 93% 0, 100% 50%, 93% 100%, 7% 100%, 0 50%)";

const CHECKER = "repeating-conic-gradient(#160601 0% 25%, transparent 0% 50%)";

/**
 * Hero replica dell'insegna da fiera: la foto della squadra occupa la metà
 * alta e sfuma nel banco a scacchi; sul confine atterra la targa esagonale,
 * che schiva il cursore per conto suo e rientra piano al suo posto.
 */
export function Intro() {
  const ref = useRef<HTMLElement>(null);
  const testi = useTesti().chiSiamo.intro;

  useScatto(ref);

  return (
    <section ref={ref} className="relative overflow-hidden bg-panna">
      {/* ------ metà alta: la squadra al banco ------ */}
      <div className="relative h-[52vh] min-h-[400px] w-full overflow-hidden md:h-[64vh]">
        <Image
          src="/chi-siamo/hero-team.webp"
          alt={testi.fotoAlt}
          fill
          priority
          quality={90}
          sizes="100vw"
          className="object-cover object-[center_30%]"
          draggable={false}
        />
        {/* la linea del banco, a scacchi */}
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-7"
          style={{ backgroundImage: CHECKER, backgroundSize: "26px 26px" }}
        />
      </div>

      {/* ------ metà bassa: panna, dove atterra tutto ------ */}
      <div className="relative z-20 mx-auto w-full max-w-[1800px] px-6 pb-28 md:px-12 md:pb-32">
        {/* targa esagonale a cavallo del confine */}
        <div
          data-scatto
          className="relative z-20 mx-auto -mt-28 w-[min(94vw,620px)] md:-mt-40"
        >
          <div
            className="bg-inchiostro p-[3px] drop-shadow-[0_26px_50px_rgba(22,6,1,0.35)]"
            style={{ clipPath: HEX }}
          >
            <div
              className="relative flex flex-col items-center gap-3 bg-panna px-12 py-10 text-center md:px-16 md:py-12"
              style={{ clipPath: HEX }}
            >
              <span aria-hidden className="absolute left-[5%] top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-inchiostro" />
              <span aria-hidden className="absolute right-[5%] top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-inchiostro" />
              <p className="font-mono text-[11px] font-bold uppercase tracking-[0.22em] text-inchiostro/70">
                {testi.eyebrow}
              </p>
              <h1 className="type-display text-[clamp(2rem,4.2vw,3.4rem)] leading-[0.95] text-inchiostro">
                {testi.titolo.map((riga, indice) => (
                  <span key={riga.testo} className="block">
                    {riga.testo}
                    {indice === testi.titolo.length - 1 && (
                      <span className="text-fucsia">.</span>
                    )}
                  </span>
                ))}
              </h1>
              <p className="font-mono text-xs font-bold uppercase tracking-[0.14em] text-inchiostro/70">
                {testi.sigillo}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
