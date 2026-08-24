"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * «Il prossimo sei tu» — il ponte tra i salati e il configuratore.
 *
 * Ripresa 2026-08-21 del ponte narrativo del refactor di agosto (allora
 * tra storia e configuratore, «Il prossimo capitolo? / Lo scrivi tu.»):
 * la gamma si chiude con i salati e questa pagina piena di fucsia gira
 * il racconto verso chi guarda prima che entri CREA IL TUO DOLCE.
 *
 * Rev 21/08, secondo passaggio: anche l'INGRESSO è un sipario. Il
 * fucsia non arriva più con un taglio netto sotto i salati: la sezione
 * risale di uno schermo (margine negativo in `.ponte-futuro`) e la
 * quinta — trasparente, `pointer-events-none`, così i salati sotto
 * restano cliccabili — si pinna sull'ultima schermata dei salati.
 * Da lì il fondo fucsia salta dentro dal basso con la stessa curva
 * del sipario crema in uscita: due sipari, una sola lingua.
 *
 * La sequenza in scrub: fucsia su dai salati, la frase si rivela dalla
 * maschera, un momento di quiete, poi il sipario crema sale dal basso
 * e consegna al teaser del configuratore, che di crema è fatto. Con
 * `prefers-reduced-motion` (o senza JS) la quinta si scioglie via CSS:
 * niente sovrapposizione, resta un blocco fucsia in flusso con la
 * frase già composta, e il crema arriva con la sezione dopo.
 */

/* i due stati di ogni sipario: stessa ellisse ancorata sotto il bordo
   basso, prima schiacciata a zero e poi larga da coprire tutto — GSAP
   interpola i soli raggi */
const SIPARIO_GIU = "ellipse(85% 0% at 50% 102%)";
const SIPARIO_SU = "ellipse(145% 125% at 50% 102%)";

export function PonteFuturo() {
  const radice = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);
      const scope = radice.current;
      if (!scope) return;

      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const fondo = scope.querySelector<HTMLElement>("[data-ponte-fondo]");
        const frase = scope.querySelector<HTMLElement>("[data-ponte-frase]");
        const sipario = scope.querySelector<HTMLElement>(
          "[data-ponte-sipario]"
        );

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

        /* il fucsia salta dentro: sale sopra l'ultima schermata dei
           salati — che intanto continua a scorrere via — con la stessa
           andatura del sipario crema in uscita */
        if (fondo) {
          tl.fromTo(
            fondo,
            { clipPath: SIPARIO_GIU },
            { clipPath: SIPARIO_SU, duration: 0.34, ease: "power2.inOut" },
            0
          );
        }

        /* la frase: su dalla maschera a fucsia posato, quiete, poi
           arretra appena quando il sipario la copre. `y: 0` è
           obbligatorio: GSAP legge il translateY(115%) di partenza di
           .ponte-frase come offset in px separato da yPercent, e senza
           azzerarlo la frase resterebbe sotto la maschera per sempre. */
        if (frase) {
          tl.fromTo(
            frase,
            { yPercent: 115, y: 0 },
            { yPercent: 0, y: 0, duration: 0.28, ease: "power2.out" },
            0.4
          ).to(
            frase,
            { scale: 0.94, autoAlpha: 0.6, duration: 0.3, ease: "power1.in" },
            0.86
          );
        }

        /* l'alba crema: sale con la curva e porta il mondo del
           configuratore */
        if (sipario) {
          tl.fromTo(
            sipario,
            { clipPath: SIPARIO_GIU },
            { clipPath: SIPARIO_SU, duration: 0.42, ease: "power2.inOut" },
            0.86
          );
        }
      });

      return () => mm.revert();
    },
    { scope: radice }
  );

  return (
    /* niente bg sulla radice: il fucsia vive nel fondo-sipario, così la
       quinta resta trasparente finché non sale sopra i salati */
    <section ref={radice} className="ponte-futuro relative">
      <div className="ponte-quinta pointer-events-none sticky top-0 flex min-h-[100svh] items-center justify-center overflow-clip">
        {/* il fondo fucsia: nasce chiuso via CSS (.ponte-fondo), lo alza
            solo lo scrub — è l'ingresso del ponte */}
        <div
          aria-hidden
          data-ponte-fondo
          className="ponte-fondo absolute inset-0 bg-fucsia"
        />

        <div className="relative px-6 text-center">
          <p className="overflow-hidden pb-[0.06em]">
            <span
              data-ponte-frase
              className="ponte-frase font-pop block text-[clamp(3rem,10vw,9rem)] font-normal uppercase leading-[0.87] tracking-[-0.02em] text-panna"
            >
              Il prossimo
              <br />
              sei tu.
            </span>
          </p>
        </div>

        {/* il sipario crema: nasce chiuso via CSS (.ponte-sipario), lo
            alza solo lo scrub — è l'uscita del ponte */}
        <div
          aria-hidden
          data-ponte-sipario
          className="ponte-sipario absolute inset-0 z-10 bg-crema"
        />
      </div>

      {/* la corsa della quinta, allungata per i tre atti (ingresso
          fucsia, frase, uscita crema): sparisce con prefers-reduced-motion */}
      <div aria-hidden className="ponte-corsa h-[150vh] md:h-[190vh]" />
    </section>
  );
}
