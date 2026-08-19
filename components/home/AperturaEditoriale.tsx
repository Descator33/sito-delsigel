"use client";

import Image from "next/image";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Hero } from "@/components/Hero";
import { CATALOG_SLIDES } from "@/lib/catalogo-fisico";

/**
 * L'apertura editoriale della home: la hero e il passaggio di scena verso
 * il catalogo 2026/27 (refactor architettura, 2026-08-12).
 *
 * Prima la hero finiva e il catalogo cominciava — due sezioni, un confine.
 * Qui il confine diventa un passaggio tra due shooting: la hero resta in
 * quinta (sticky) mentre insegna, descrizione e invito escono verso l'alto
 * a velocità leggermente diverse; la fotografia della ragazza tiene la
 * scena più a lungo, e da sotto entra il primo scatto della campagna del
 * catalogo — un ritaglio che si apre (clip-path), si raddrizza e prende
 * progressivamente il controllo del viewport. Nessun crossfade: due
 * composizioni convivono per un momento, poi comanda la nuova.
 *
 * COME NON ROMPERE LA HERO. La finestra della hero vola in
 * `position: fixed` a menu aperto (components/Hero.tsx) e pretende che
 * NESSUN antenato abbia transform, filter o will-change: per questo la
 * hero non è dentro un pin di GSAP (che scrive transform) ma dentro una
 * quinta `position: sticky`, che un containing block per i fixed non lo
 * crea. GSAP tocca solo elementi INTERNI alla finestra — le maschere
 * `data-hero-uscita` e il ritaglio `.hero-scatto` — mai la finestra o la
 * sezione. A menu aperto una regola in globals.css riporta quegli
 * elementi allo stato composto, così l'anteprima nell'angolo mostra
 * sempre la hero intera.
 *
 * La corsa (`.apertura-corsa`) è lo scroll che la quinta resta ferma:
 * l'altezza sta nelle classi, i tempi qui. Con `prefers-reduced-motion`
 * corsa e ritaglio spariscono via CSS e la hero torna a scorrere nel
 * flusso, come prima del refactor.
 */

/* il primo scatto dell'ordine editoriale del catalogo: lo stesso che il
   carosello mostra come pagina attiva — è così che la foto "trova il suo
   posto" nella sezione che segue */
const FOTO_INGRESSO = CATALOG_SLIDES[0];

export function AperturaEditoriale() {
  const radice = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);
      const scope = radice.current;
      if (!scope) return;

      const mm = gsap.matchMedia();

      mm.add(
        {
          ampio: "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
          stretto: "(max-width: 767.98px) and (prefers-reduced-motion: no-preference)",
        },
        (ctx) => {
          const ampio = !!ctx.conditions?.ampio;

          const uscite = gsap.utils.toArray<HTMLElement>("[data-hero-uscita]", scope);
          const scatto = scope.querySelector<HTMLElement>(".hero-scatto");
          const quadro = scope.querySelector<HTMLElement>("[data-apertura-quadro]");
          const zoom = scope.querySelector<HTMLElement>("[data-apertura-zoom]");
          const didascalia = scope.querySelector<HTMLElement>("[data-apertura-didascalia]");

          /* i tre ritagli del quadro in ingresso: chiuso in basso, mezzo
             campo, tutto campo. Sul telefono la feritoia parte più larga —
             a quella misura un ritaglio stretto sarebbe una fessura. */
          const RITAGLI = ampio
            ? {
                chiuso: "inset(100% 36% 0% 36% round 26px)",
                mezzo: "inset(24% 11% 0% 11% round 22px)",
                pieno: "inset(0% 0% 0% 0% round 0px)",
              }
            : {
                chiuso: "inset(100% 18% 0% 18% round 20px)",
                mezzo: "inset(30% 6% 0% 6% round 16px)",
                pieno: "inset(0% 0% 0% 0% round 0px)",
              };

          const tl = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: scope,
              start: "top top",
              end: "bottom bottom",
              scrub: ampio ? 0.6 : true,
              invalidateOnRefresh: true,
            },
          });

          /* L'insegna esce a strati: prima l'invito, poi la descrizione,
             poi le quattro righe — ognuna un soffio dopo l'altra e di una
             corsa un po' più lunga. `autoAlpha` (e non `opacity`): a fine
             corsa gli elementi devono anche smettere di essere bersagli. */
          uscite.forEach((el) => {
            const passo = Number(el.dataset.heroUscita ?? 0);
            if (passo <= 3) {
              tl.to(
                el,
                {
                  yPercent: -(120 + passo * 14),
                  autoAlpha: 0,
                  duration: 0.4,
                  ease: "power1.in",
                },
                0.05 + passo * 0.035
              );
            } else {
              tl.to(
                el,
                {
                  y: passo === 5 ? -44 : -60,
                  autoAlpha: 0,
                  duration: passo === 5 ? 0.24 : 0.3,
                  ease: "power1.in",
                },
                passo === 5 ? 0 : 0.02
              );
            }
          });

          /* la fotografia resta: cresce di poco e sale piano, presente
             ben oltre l'uscita del testo */
          if (scatto) {
            tl.fromTo(
              scatto,
              { scale: 1, yPercent: 0 },
              { scale: ampio ? 1.07 : 1.05, yPercent: -3, duration: 0.85 },
              0.05
            );
          }

          /* il nuovo scatto: entra dal basso come un ritaglio, inclinato
             di un soffio, si raddrizza e si apre fino a prendere il campo */
          if (quadro) {
            tl.set(quadro, { autoAlpha: 1 }, 0.08)
              .fromTo(
                quadro,
                { clipPath: RITAGLI.chiuso, rotation: ampio ? -2.5 : -1.5 },
                {
                  clipPath: RITAGLI.mezzo,
                  rotation: 0,
                  duration: 0.38,
                  ease: "power2.out",
                },
                0.1
              )
              .to(
                quadro,
                { clipPath: RITAGLI.pieno, duration: 0.34, ease: "power2.inOut" },
                0.52
              );
          }

          /* dentro il ritaglio la fotografia arriva da più lontano: è lo
             zoom contrario a dare la profondità, non un movimento in più */
          if (zoom) {
            tl.fromTo(zoom, { scale: 1.22 }, { scale: 1.02, duration: 0.9 }, 0.1);
          }

          if (didascalia) {
            tl.fromTo(
              didascalia,
              { autoAlpha: 0, y: 18 },
              { autoAlpha: 1, y: 0, duration: 0.12, ease: "power2.out" },
              0.62
            );
          }
        }
      );

      return () => mm.revert();
    },
    { scope: radice }
  );

  return (
    <div ref={radice} className="apertura relative">
      {/* la quinta: resta ferma per tutta la corsa. Sticky e non pin:
          vedi il commento di testa. */}
      {/* sticky è già "positioned": gli absolute qui dentro si ancorano
          alla quinta senza bisogno di `relative` */}
      <div className="apertura-quinta sticky top-0 overflow-clip">
        <Hero />

        {/* il quadro in ingresso: primo scatto del catalogo stampato.
            `alt=""` — la stessa fotografia si presenta con la sua
            didascalia vera nel carosello qui sotto; qui è scenografia.
            `pointer-events-none`: non deve mai coprire un bersaglio. */}
        <div
          data-apertura-quadro
          aria-hidden
          className="apertura-quadro pointer-events-none absolute inset-0 z-10"
        >
          <div data-apertura-zoom className="absolute inset-0">
            <Image
              src={FOTO_INGRESSO.src}
              alt=""
              fill
              sizes="100vw"
              className="select-none object-cover"
              draggable={false}
            />
          </div>

          <p
            data-apertura-didascalia
            className="font-tecnico absolute bottom-[7vh] left-[clamp(20px,5vw,96px)] text-[10px] font-semibold uppercase tracking-[0.26em] text-panna"
          >
            Catalogo 2026/27
            <span className="mx-3 text-panna/50">/</span>
            {FOTO_INGRESSO.label}
          </p>
        </div>
      </div>

      {/* la corsa: lo scroll durante il quale la quinta sta ferma.
          Sparisce con prefers-reduced-motion (globals.css). */}
      <div aria-hidden className="apertura-corsa h-[85vh] md:h-[105vh]" />
    </div>
  );
}
