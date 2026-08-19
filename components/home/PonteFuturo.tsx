"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Il ponte tra la storia e il configuratore: dal passato al futuro.
 *
 * La storia chiude su «La storia continua / Cambiano le mani. Non cambia
 * la cura.» — questo ponte prende quel filo e lo gira verso chi guarda:
 * IL PROSSIMO CAPITOLO? / LO SCRIVI TU. La domanda vive sul buio della
 * storia, con la voce del sito (Archivo); la risposta arriva con l'alba
 * crema del configuratore e con la sua voce (Anton, il pop della
 * chiusura): è il cambio di registro tipografico a dire che si è
 * cambiato mondo, non un bordo.
 *
 * La meccanica è una quinta sticky: la domanda si rivela dalla maschera,
 * poi il pannello crema sale dal basso con il bordo strappato delle
 * fasce (clip-path animato tra due poligoni gemelli) e porta la
 * risposta. Con `prefers-reduced-motion` la quinta si scioglie via CSS:
 * i due tempi diventano due blocchi in flusso, già composti.
 */

/* i due stati del sipario crema: stessi otto vertici, prima sotto il
   bordo basso e poi a coprire tutto — GSAP interpola tra poligoni con lo
   stesso numero di punti */
const SIPARIO_GIU =
  "polygon(0% 103%, 32% 101.5%, 66% 103.5%, 100% 101%, 100% 100%, 66% 100%, 32% 100%, 0% 100%)";
const SIPARIO_SU =
  "polygon(0% 2.4%, 32% 0%, 66% 3%, 100% 0.8%, 100% 100%, 66% 100%, 32% 100%, 0% 100%)";

export function PonteFuturo() {
  const radice = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);
      const scope = radice.current;
      if (!scope) return;

      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const domanda = scope.querySelector<HTMLElement>("[data-ponte-domanda]");
        const eco = scope.querySelector<HTMLElement>("[data-ponte-eco]");
        const sipario = scope.querySelector<HTMLElement>("[data-ponte-sipario]");
        const risposta = scope.querySelector<HTMLElement>("[data-ponte-risposta]");

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: scope,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.5,
            invalidateOnRefresh: true,
          },
        });

        /* la domanda: su dalla maschera, un momento di quiete, poi
           arretra appena quando il sipario la copre */
        if (domanda) {
          tl.fromTo(
            domanda,
            { yPercent: 115 },
            { yPercent: 0, duration: 0.3, ease: "power2.out" },
            0.05
          ).to(domanda, { scale: 0.94, autoAlpha: 0.6, duration: 0.3, ease: "power1.in" }, 0.55);
        }
        if (eco) {
          tl.fromTo(eco, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.12 }, 0.3);
        }

        /* l'alba: il crema sale col bordo strappato e porta la risposta */
        if (sipario) {
          tl.fromTo(
            sipario,
            { clipPath: SIPARIO_GIU },
            { clipPath: SIPARIO_SU, duration: 0.4, ease: "power2.inOut" },
            0.52
          );
        }
        if (risposta) {
          tl.fromTo(
            risposta,
            { y: "9vh", scale: 0.96 },
            { y: 0, scale: 1, duration: 0.36, ease: "power2.out" },
            0.6
          );
        }
      });

      return () => mm.revert();
    },
    { scope: radice }
  );

  return (
    <section ref={radice} className="ponte-futuro relative bg-inchiostro">
      <div className="ponte-quinta sticky top-0 flex min-h-[100svh] items-center justify-center overflow-clip">
        {/* primo tempo: la domanda, sul buio della storia */}
        <div className="relative px-6 text-center">
          <p data-ponte-eco className="type-label text-panna/45">
            Dal 2011 a domani
          </p>
          <p className="mt-6 overflow-hidden pb-[0.06em]">
            <span
              data-ponte-domanda
              className="type-display block text-[clamp(2.4rem,7.5vw,6.8rem)] leading-[0.9] text-panna"
            >
              Il prossimo
              <br />
              capitolo<span className="text-corallo">?</span>
            </span>
          </p>
        </div>

        {/* secondo tempo: l'alba crema con la risposta */}
        <div
          data-ponte-sipario
          className="ponte-sipario absolute inset-0 z-10 flex items-center justify-center bg-crema"
        >
          <div data-ponte-risposta className="px-6 text-center text-cacao">
            <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-mandarino">
              Il configuratore
            </p>
            <p className="font-pop mt-5 text-[clamp(3rem,10vw,9rem)] font-normal uppercase leading-[0.87] tracking-[-0.02em]">
              Lo scrivi
              <br />
              <span className="text-mandarino">tu.</span>
            </p>
          </div>
        </div>
      </div>

      {/* la corsa della quinta: sparisce con prefers-reduced-motion */}
      <div aria-hidden className="ponte-corsa h-[110vh] md:h-[140vh]" />
    </section>
  );
}
