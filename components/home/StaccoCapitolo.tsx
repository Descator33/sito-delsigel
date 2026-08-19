"use client";

import Image from "next/image";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { STORIA } from "@/data/history";

/**
 * Il cambio di capitolo: dal catalogo (fotografico, chiaro) alla storia
 * (tipografica, scura).
 *
 * Non è un separatore — è la copertina del capitolo che comincia: una
 * campitura inchiostro col bordo alto strappato (lo stesso linguaggio
 * delle fasce della storia) che sale sopra la coda del catalogo grazie al
 * margine negativo, mentre l'anno d'origine si rivela dalla maschera e le
 * fotografie del catalogo arretrano piano. Due ritagli di prodotto
 * attraversano il confine tra le sezioni: sono la punteggiatura pop che
 * rompe la griglia, non decorazione diffusa.
 *
 * `aria-hidden` sull'intera sezione: l'anno e l'invito ripetono ciò che
 * la sezione storia dice subito dopo con il suo titolo vero — agli screen
 * reader questa è scenografia.
 *
 * CONTRATTO CON IL CATALOGO: l'arretramento agisce su
 * `[data-quadro-catalogo]` (la griglia dentro CatalogPhysicalSection),
 * solo `y` e mai scale — un transform di scala sul contenitore di Embla
 * ne falserebbe le misure durante il trascinamento.
 */

/* l'anno della prima tappa: la sorgente è una sola (data/history.ts) */
const ANNO = STORIA[0].titolo;

const RITAGLI = [
  {
    src: "/products/cuore-crema.webp",
    larghezza: "clamp(72px,9vw,150px)",
    classi: "right-[8%] -top-[clamp(28px,4vw,60px)]",
    rotazione: -11,
    profondita: 2.2,
  },
  {
    src: "/products/frittella-cioccolato.webp",
    larghezza: "clamp(54px,6.5vw,110px)",
    classi: "right-[24%] -top-[clamp(16px,2.4vw,38px)]",
    rotazione: 13,
    profondita: 1.3,
  },
] as const;

export function StaccoCapitolo() {
  const radice = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);
      const scope = radice.current;
      if (!scope) return;

      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        /* le fotografie del catalogo si allontanano piano mentre il
           capitolo scuro le copre: pochi vh, quanto basta a farle
           leggere "dietro" */
        const quadro = document.querySelector<HTMLElement>("[data-quadro-catalogo]");
        if (quadro) {
          gsap.fromTo(
            quadro,
            { y: 0 },
            {
              y: "-5vh",
              ease: "none",
              scrollTrigger: {
                trigger: scope,
                start: "top bottom",
                end: "top 30%",
                scrub: true,
                invalidateOnRefresh: true,
              },
            }
          );
        }

        /* l'anno si rivela dalla maschera mentre le ultime fotografie
           sono ancora in campo */
        const anno = scope.querySelector<HTMLElement>("[data-stacco-anno]");
        if (anno) {
          gsap.fromTo(
            anno,
            { yPercent: 112 },
            {
              yPercent: 0,
              ease: "power2.out",
              scrollTrigger: {
                trigger: scope,
                start: "top 82%",
                end: "top 38%",
                scrub: 0.5,
                invalidateOnRefresh: true,
              },
            }
          );
        }

        /* i ritagli sul confine: corsa breve, profondità diverse */
        gsap.utils
          .toArray<HTMLElement>("[data-stacco-pop]", scope)
          .forEach((pop) => {
            const prof = Number(pop.dataset.profondita ?? 1);
            gsap.fromTo(
              pop,
              { y: `${3.2 * prof}vh` },
              {
                y: `${-4 * prof}vh`,
                ease: "none",
                scrollTrigger: {
                  trigger: scope,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: true,
                  invalidateOnRefresh: true,
                },
              }
            );
          });
      });

      return () => mm.revert();
    },
    { scope: radice }
  );

  return (
    <section
      ref={radice}
      aria-hidden
      className="stacco-capitolo relative z-10 -mt-8 text-panna md:-mt-14"
    >
      <div className="stacco-strappo bg-inchiostro px-6 pb-[clamp(3rem,7vh,6rem)] pt-[clamp(5rem,13vh,9rem)] md:px-12">
        <div className="mx-auto max-w-[1800px]">
          <p className="type-label text-panna/45">La nostra storia</p>
          {/* la maschera dell'anno: il numero ci sale dentro in scrub */}
          <p className="mt-5 overflow-hidden pb-[0.05em]">
            <span
              data-stacco-anno
              className="type-display block text-[clamp(4.4rem,15vw,13rem)] leading-[0.85]"
            >
              {ANNO}
              <span className="text-corallo">.</span>
            </span>
          </p>
          <p className="type-scritta mt-4 -rotate-1 text-[clamp(1.2rem,2vw,1.8rem)] text-panna/80">
            Tutto comincia da un forno acceso.
          </p>
        </div>
      </div>

      {/* i ritagli a cavallo del confine: mezzo dentro il catalogo, mezzo
          nel capitolo scuro */}
      {RITAGLI.map((r) => (
        <div
          key={r.src}
          data-stacco-pop
          data-profondita={r.profondita}
          className={`pointer-events-none absolute z-20 ${r.classi}`}
          style={{ width: r.larghezza, rotate: `${r.rotazione}deg` }}
        >
          <Image
            src={r.src}
            alt=""
            width={900}
            height={800}
            sizes="(max-width: 767px) 20vw, 10vw"
            className="h-auto w-full select-none drop-shadow-[0_18px_22px_rgba(0,0,0,0.35)]"
            draggable={false}
          />
        </div>
      ))}
    </section>
  );
}
