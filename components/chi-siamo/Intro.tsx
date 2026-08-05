"use client";

import { useRef } from "react";
import { Francobollo } from "@/components/chi-siamo/Francobollo";
import { useScatto } from "@/lib/useScatto";

/* targa esagonale centrale, come l'emblema del riferimento */
const HEX =
  "polygon(7% 0, 93% 0, 100% 50%, 93% 100%, 7% 100%, 0 50%)";

/* ottagono del sigillo per gli adesivi */
const OCTAGON =
  "polygon(22% 0, 78% 0, 100% 22%, 100% 78%, 78% 100%, 22% 100%, 0 78%, 0 22%)";

/* biglietto ritagliato per il CTA */
const TICKET =
  "polygon(2% 8%, 98% 0, 100% 42%, 97% 100%, 3% 94%, 0 55%)";

const CHECKER = "repeating-conic-gradient(#160601 0% 25%, transparent 0% 50%)";

/**
 * Hero replica dell'insegna da fiera: la foto della squadra occupa la metà
 * alta e sfuma nel banco a scacchi; sul confine atterrano la targa
 * esagonale, i francobolli, gli adesivi e la card col biglietto. Ogni pezzo
 * schiva il cursore per conto suo e rientra piano al suo posto.
 */
export function Intro() {
  const ref = useRef<HTMLElement>(null);

  useScatto(ref);

  return (
    <section ref={ref} className="relative overflow-hidden bg-panna">
      {/* ------ metà alta: la squadra al banco ------ */}
      <div className="relative h-[52vh] min-h-[400px] w-full overflow-hidden md:h-[64vh]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/chi-siamo/hero-team.webp"
          alt="Quattro colleghe Delsigel abbracciate e sorridenti in laboratorio"
          className="h-full w-full object-cover object-[center_30%]"
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
                Chi siamo · Delsigel Italia
              </p>
              <h1 className="type-display text-[clamp(2rem,4.2vw,3.4rem)] leading-[0.95] text-inchiostro">
                L&apos;industria
                <br />
                artigianale
                <br />
                di Sermoneta<span className="text-fucsia">.</span>
              </h1>
              <p className="font-mono text-xs font-bold uppercase tracking-[0.14em] text-inchiostro/70">
                dal 2011 · certificata IFS
              </p>
            </div>
          </div>
        </div>

        {/* card informativa col biglietto */}
        <div
          data-scatto
          className="relative z-20 mx-auto mt-10 w-full max-w-sm rotate-1 lg:absolute lg:right-[3%] lg:top-[-9rem] lg:mt-0 lg:w-[350px]"
        >
          <div className="bg-acido p-6 text-inchiostro shadow-[0_18px_40px_rgba(22,6,1,0.3)] md:p-7">
            <p className="font-mono text-[13px] leading-relaxed">
              Nati nel 2011 dall&apos;incontro tra due industrie dolciarie
              storiche, Del Monte e Siani Pasticceri. Stessa passione, stessa
              ricetta: solo su scala più grande, certificata IFS.
            </p>
            <a
              href="#storia"
              className="mt-6 inline-block bg-fucsia px-7 py-3.5 transition-transform hover:-translate-y-0.5 active:scale-[0.97]"
              style={{ clipPath: TICKET }}
            >
              <span className="type-scritta text-2xl leading-none text-panna">
                Scopri la storia
              </span>
            </a>
          </div>
        </div>
      </div>

      {/* ------ cluster sinistro: pila di francobolli e adesivi ------ */}
      <div
        data-scatto
        className="absolute -left-12 top-[20%] z-10 hidden -rotate-[7deg] lg:block"
      >
        <Francobollo
          src="/chi-siamo/album/hero-modella-dolci.webp"
          alt="Un'addetta Delsigel modella i dolci alla linea, sorridente"
          className="w-[240px] xl:w-[270px]"
        />
      </div>
      {/* l'insegna monta sopra l'angolo del fornaio */}
      <div
        data-scatto
        className="absolute left-[4%] top-[42%] z-20 hidden rotate-[4deg] lg:block"
      >
        <Francobollo
          src="/chi-siamo/album/hero-fritti.webp"
          alt="Una collega Delsigel ride accanto ai fritti dolci appena zuccherati"
          className="w-[260px] xl:w-[300px]"
        />
      </div>
      {/* la scritta attraversa tutti e due */}
      <div
        data-scatto
        className="absolute left-[10%] top-[36%] z-30 hidden -rotate-[10deg] lg:block"
      >
        <p className="type-scritta max-w-[240px] text-center text-4xl leading-[1.02] text-panna drop-shadow-[0_2px_12px_rgba(22,6,1,0.65)]">
          innovativa e buona per tutti!
        </p>
      </div>
      {/* il sigillo 2011 morde l'angolo dell'insegna */}
      <div
        data-scatto
        className="absolute left-[17%] top-[70%] z-30 hidden -rotate-6 lg:block"
      >
        <div
          className="flex h-20 w-20 items-center justify-center bg-mandarino"
          style={{ clipPath: OCTAGON }}
        >
          <span className="type-scritta text-lg leading-none text-inchiostro">2011</span>
        </div>
      </div>

      {/* ------ cluster destro: francobollo sotto la card, piatto sopra ------ */}
      <div
        data-scatto
        className="absolute right-[7%] top-[24%] z-10 hidden rotate-[8deg] lg:block"
      >
        <Francobollo
          src="/chi-siamo/album/hero-fondatore.webp"
          alt="Un fondatore Delsigel controlla la sfoglia al banco di lavorazione"
          className="w-[200px]"
        />
      </div>
      {/* l'ottagono viola sull'angolo del francobollo */}
      <div
        data-scatto
        className="absolute right-[18%] top-[21%] z-20 hidden rotate-12 lg:block"
      >
        <div className="h-14 w-14 bg-viola" style={{ clipPath: OCTAGON }} />
      </div>
      {/* il piatto morde l'angolo della card */}
      <div
        data-scatto
        className="absolute bottom-[11%] right-[1%] z-30 hidden lg:block"
      >
        <div className="h-52 w-52 overflow-hidden rounded-full border-[6px] border-inchiostro shadow-[0_18px_40px_rgba(22,6,1,0.35)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/chi-siamo/album/hero-canol.webp"
            alt="Un'addetta Delsigel lavora la sfoglia alla linea Canol"
            className="h-full w-full scale-110 object-cover"
            draggable={false}
          />
        </div>
      </div>
    </section>
  );
}
