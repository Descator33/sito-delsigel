"use client";

import { useRef } from "react";
import { Francobollo } from "@/components/chi-siamo/Francobollo";
import { useScatto } from "@/lib/useScatto";

/* ottagono del sigillo per il badge tondo */
const OCTAGON =
  "polygon(22% 0, 78% 0, 100% 22%, 100% 78%, 78% 100%, 22% 100%, 0 78%, 0 22%)";

/**
 * La lettera ai lettori, su carta acida bordata due volte, con a fianco il
 * collage-francobolli della squadra al lavoro e i badge dei numeri veri.
 * La lettera sta ferma; i pezzi del collage schivano il cursore uno a uno.
 */
export function Lettera() {
  const ref = useRef<HTMLElement>(null);

  useScatto(ref);

  return (
    <section
      id="storia"
      ref={ref}
      className="relative scroll-mt-20 overflow-hidden bg-rosso py-24 md:py-32"
    >
      <div className="mx-auto grid w-full max-w-[1800px] items-center gap-16 px-6 md:px-12 lg:grid-cols-[minmax(400px,560px)_1fr] lg:gap-8">
        {/* la lettera */}
        <div className="mx-auto w-full max-w-[560px]">
          <div className="border-[3px] border-inchiostro bg-acido p-2.5 shadow-[0_24px_60px_rgba(22,6,1,0.35)]">
            <div className="border-2 border-inchiostro/60 px-7 py-10 text-center text-inchiostro md:px-10 md:py-12">
              <h2 className="type-display text-[clamp(2.6rem,5vw,4rem)] leading-none">
                Ciao<span className="text-rosso">!</span>
              </h2>
              <div className="mt-7 space-y-5 font-mono text-[13px] leading-relaxed md:text-sm">
                <p>
                  Delsigel nasce nel 2011 dall&apos;incontro tra due industrie
                  dolciarie affermate, Del Monte e Siani Pasticceri,
                  specializzate rispettivamente in fritti dolci tradizionali e
                  pasta sfoglia. Dal loro nome, DEL + SI + GEL.
                </p>
                <p>
                  Nasce così un&apos;industria artigianale: un ossimoro che è
                  anche il nostro programma. Materie prime selezionate, gesti
                  tradizionali ripetuti uguali su scala industriale, standard
                  qualitativo alto e certificato IFS. Innovativa e buona per
                  tutti, senza scorciatoie.
                </p>
                <p>
                  Venite a trovarci in stabilimento, a Sermoneta: il forno è
                  sempre acceso.
                </p>
              </div>
              <p className="mt-8 font-mono text-xs text-inchiostro/70">
                Il team Delsigel
              </p>
              <p className="type-scritta mt-2 -rotate-3 text-4xl leading-none text-inchiostro">
                Delsigel
              </p>
            </div>
          </div>
        </div>

        {/* collage-francobolli della squadra: una pila, non una griglia */}
        <div className="relative flex flex-wrap items-center justify-center gap-8 lg:block lg:min-h-[680px]">
          <div
            data-scatto
            className="z-10 -rotate-[7deg] lg:absolute lg:left-0 lg:top-[8%]"
          >
            <Francobollo
              src="/chi-siamo/album/lettera-gruppo.webp"
              alt="Un fondatore e due colleghe Delsigel ridono davanti ai vassoi di fritti"
              className="w-[280px] xl:w-[340px]"
            />
          </div>
          {/* la linea monta sul bordo destro del forno */}
          <div
            data-scatto
            className="z-20 rotate-[5deg] lg:absolute lg:left-[34%] lg:top-0"
          >
            <Francobollo
              src="/chi-siamo/album/lettera-farina.webp"
              alt="Un impastatore Delsigel infarina la sfoglia sul banco"
              className="w-[250px] xl:w-[310px]"
            />
          </div>
          {/* il banco copre l'incrocio dei due sopra */}
          <div
            data-scatto
            className="z-30 -rotate-[4deg] lg:absolute lg:left-[14%] lg:top-[40%]"
          >
            <Francobollo
              src="/chi-siamo/album/ufficio-comunicazione.webp"
              alt="Una collega Delsigel alla scrivania degli uffici, con occhiali fucsia"
              className="w-[300px] xl:w-[370px]"
            />
          </div>
          {/* l'abbraccio a grappolo delle colleghe, sul fianco destro */}
          <div
            data-scatto
            className="z-20 rotate-[6deg] lg:absolute lg:right-[1%] lg:top-[47%]"
          >
            <Francobollo
              src="/chi-siamo/abbraccio-grappolo.webp"
              alt="Quattro colleghe Delsigel abbracciate ridono in laboratorio"
              className="w-[220px] xl:w-[260px]"
            />
          </div>
          {/* i due fondatori alla sfogliatrice, in basso a sinistra */}
          <div
            data-scatto
            className="z-10 -rotate-[5deg] lg:absolute lg:bottom-[2%] lg:left-[1%]"
          >
            <Francobollo
              src="/chi-siamo/album/fondatori-sfogliatrice.webp"
              alt="I due fondatori Delsigel sorridono davanti alla sfogliatrice"
              className="w-[240px] xl:w-[280px]"
            />
          </div>

          {/* i badge mordono gli angoli dei francobolli */}
          <div
            data-scatto
            className="z-40 lg:absolute lg:left-[47%] lg:top-[32%]"
          >
            <div className="bg-panna p-[3px]" style={{ clipPath: OCTAGON }}>
              <div
                className="flex h-40 w-40 flex-col items-center justify-center bg-fucsia text-panna xl:h-48 xl:w-48"
                style={{ clipPath: OCTAGON }}
              >
                <p className="type-display text-4xl leading-none xl:text-5xl">IFS</p>
                <p className="mt-1.5 text-sm font-semibold">certificato</p>
              </div>
            </div>
          </div>
          <div
            data-scatto
            className="z-30 lg:absolute lg:right-[9%] lg:top-[14%]"
          >
            <div className="rotate-45 border-[3px] border-panna/70 bg-viola p-1.5">
              <div className="flex h-32 w-32 items-center justify-center border-2 border-panna/50 xl:h-36 xl:w-36">
                <div className="-rotate-45 text-center text-inchiostro">
                  <p className="text-sm font-semibold">dal</p>
                  <p className="type-display text-4xl leading-none">2011</p>
                </div>
              </div>
            </div>
          </div>

          {/* il saluto attraversa il bordo del banco */}
          <div
            data-scatto
            className="z-40 -rotate-[8deg] lg:absolute lg:bottom-[10%] lg:left-[42%]"
          >
            <p className="type-scritta text-4xl leading-none text-panna drop-shadow-[0_2px_10px_rgba(22,6,1,0.4)]">
              vi aspettiamo!
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
