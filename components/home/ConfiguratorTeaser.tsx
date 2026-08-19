"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { Scintilla } from "@/components/catalog/salati/DecorativeDoodles";
import { ConveyorBelt } from "./ConveyorBelt";
import {
  ANCORA_PERCORSO,
  DESTINAZIONE_CONFIGURATORE,
  PERCORSO,
  type DolceConFoto,
} from "@/lib/percorso-configuratore";

/**
 * ORA TOCCA A TE — il teaser del configuratore, chiusura della home
 * (refactor architettura 2026-08-12).
 *
 * Prende il posto della vetrina a tre colonne (intro + percorso di card +
 * pannello mandarino): quella spiegava, questa fa intuire. Sul nastro —
 * lo stesso ConveyorBelt di prima — i tre stati della Nuvola arrivano
 * dall'alto in scrub, ognuno con la sua inclinazione e la sua profondità,
 * e si posano in fila: vuota, farcita, finita. È l'assemblaggio del
 * configuratore raccontato in tre fotogrammi, non il configuratore — che
 * vive su /configuratore, dove porta l'unica CTA.
 *
 * Le quattro tappe restano, ma come didascalia in una riga (numero,
 * pallino colorato, titolo): il racconto per esteso sta nella pagina
 * vera. La riga tiene l'ancora #come-si-crea, che il footer continua a
 * puntare.
 *
 * Con `prefers-reduced-motion` lo scrub non nasce: i dolci sono già
 * posati (lo stato finale È il markup) e l'onda CSS del nastro è spenta
 * dal blocco reduced-motion già esistente.
 *
 * I trasformi dello scrub stanno su un involucro (`data-teaser-pezzo`) e
 * NON su `.percorso-dolce`: lì sopra c'è l'onda CSS (`dolce-onda`), e
 * un'animazione CSS vincerebbe sullo stile in linea di GSAP.
 */

/* l'arrivo di ciascun pezzo: sparsi e storti, poi in fila */
const ARRIVI = [
  { x: -46, y: -110, rotazione: -12 },
  { x: 0, y: -150, rotazione: 7 },
  { x: 46, y: -120, rotazione: -8 },
] as const;

export function ConfiguratorTeaser({
  dolci,
  titoloId,
}: {
  dolci: DolceConFoto[];
  titoloId: string;
}) {
  const radice = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);
      const scope = radice.current;
      if (!scope) return;

      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const banco = scope.querySelector<HTMLElement>("[data-teaser-banco]");
        const pezzi = gsap.utils.toArray<HTMLElement>("[data-teaser-pezzo]", scope);
        const scintille = gsap.utils.toArray<HTMLElement>(
          "[data-teaser-scintilla]",
          scope
        );

        if (banco && pezzi.length) {
          const tl = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: banco,
              start: "top 88%",
              end: "top 34%",
              scrub: 0.5,
              invalidateOnRefresh: true,
            },
          });

          /* i pezzi si posano uno dopo l'altro: l'ultimo — il dolce
             finito — arriva per ultimo, che è il verso del racconto */
          pezzi.forEach((pezzo, i) => {
            const arrivo = ARRIVI[i % ARRIVI.length];
            tl.fromTo(
              pezzo,
              {
                x: arrivo.x,
                y: arrivo.y,
                rotation: arrivo.rotazione,
                scale: 0.9,
                autoAlpha: 0,
              },
              {
                x: 0,
                y: 0,
                rotation: 0,
                scale: 1,
                autoAlpha: 1,
                duration: 0.62,
                ease: "power2.out",
              },
              i * 0.14
            );
          });

          /* le scintille salutano l'assemblaggio compiuto */
          if (scintille.length) {
            tl.fromTo(
              scintille,
              { scale: 0.3, autoAlpha: 0 },
              {
                scale: 1,
                autoAlpha: 1,
                duration: 0.2,
                stagger: 0.06,
                ease: "back.out(2)",
              },
              0.78
            );
          }
        }

        /* tappe e CTA: un'entrata sola, non in scrub — dopo il numero
           forte serve un momento leggibile e fermo */
        const coda = gsap.utils.toArray<HTMLElement>("[data-teaser-coda]", scope);
        if (coda.length) {
          gsap.from(coda, {
            autoAlpha: 0,
            y: 20,
            duration: 0.6,
            stagger: 0.08,
            ease: "power2.out",
            scrollTrigger: {
              trigger: coda[0],
              start: "top 88%",
              once: true,
            },
          });
        }
      });

      return () => mm.revert();
    },
    { scope: radice }
  );

  return (
    <div
      ref={radice}
      /* overflow-x-clip (mai hidden): i pezzi in arrivo sconfinano di
         qualche decina di pixel, e su un telefono quei pixel sarebbero
         scroll orizzontale di pagina */
      className="mx-auto max-w-[1800px] overflow-x-clip px-6 py-[clamp(4.5rem,7vw,8rem)] md:px-12"
    >
      {/* ------------------------------ INSEGNA ------------------------------ */}
      <header className="mx-auto max-w-[54rem] text-center">
        <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-mandarino">
          Il configuratore
        </p>
        <h2
          id={titoloId}
          className="font-pop mt-5 text-[clamp(3rem,10vw,7.5rem)] font-normal uppercase leading-[0.87] tracking-[-0.02em]"
        >
          <Reveal className="text-cacao">Ora tocca</Reveal>
          <Reveal delay={0.08} className="text-mandarino">
            a te.
          </Reveal>
        </h2>
        <p className="mx-auto mt-[clamp(1.2rem,1.8vw,2rem)] max-w-[40ch] text-[clamp(0.95rem,1.1vw,1.18rem)] font-medium leading-[1.6] text-cacao/80">
          <Reveal delay={0.18}>
            Scegli base, crema, topping e dettagli. Con il nostro configuratore
            componi il tuo dolce ideale in pochi step. Tutto online, tutto su
            misura, tutto tuo.
          </Reveal>
        </p>
      </header>

      {/* ------------------------------- BANCO ------------------------------- */}
      {/* la scena riusa le misure del percorso (--nastro, --dolce, --passo):
          il nastro è lo stesso, cambia solo cosa ci succede sopra */}
      <div
        data-teaser-banco
        className="percorso-scena teaser-banco relative mx-auto mt-[clamp(3rem,5vw,5.5rem)] w-full max-w-[64rem]"
      >
        <ConveyorBelt />

        <div className="teaser-pezzi relative z-10">
          {dolci.map((dolce, i) => (
            <div key={dolce.stato} data-teaser-pezzo className="relative">
              <div
                className="percorso-dolce relative"
                style={{ animationDelay: `${i * 0.55}s` }}
              >
                <span
                  aria-hidden
                  className="percorso-ombra absolute bottom-[3%] left-1/2 h-[16%] w-[64%] -translate-x-1/2"
                />
                {dolce.foto ? (
                  <Image
                    src={dolce.foto}
                    alt=""
                    title={dolce.alt}
                    fill
                    /* molto sotto la piega: nessun preload, resta pigra */
                    sizes="(max-width: 1279px) 180px, 13vw"
                    className="percorso-foto select-none object-contain object-bottom"
                    draggable={false}
                  />
                ) : (
                  /* la foto di quello stato non è ancora in cartella: al
                     suo posto un disco muto, che tiene il posto sul nastro
                     senza mentire */
                  <span
                    aria-hidden
                    className="absolute inset-x-[22%] bottom-0 h-[38%] rounded-full border border-dashed border-cacao/25 bg-cacao/5"
                  />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* le scintille dell'assemblaggio compiuto: compaiono a fine corsa
            sopra il terzo stato, mai prima. Il data-attribute sta su uno
            span involucro: Scintilla accetta solo `className`. */}
        <span aria-hidden>
          <span
            data-teaser-scintilla
            className="absolute right-[6%] top-[8%] block"
          >
            <Scintilla className="h-[clamp(16px,1.6vw,24px)] w-[clamp(16px,1.6vw,24px)] text-mandarino" />
          </span>
          <span
            data-teaser-scintilla
            className="absolute right-[16%] top-[30%] block"
          >
            <Scintilla className="h-[clamp(11px,1.1vw,16px)] w-[clamp(11px,1.1vw,16px)] text-fucsia" />
          </span>
        </span>
      </div>

      {/* ------------------------- LE TAPPE, IN BREVE ------------------------ */}
      <ol
        id={ANCORA_PERCORSO}
        className="mx-auto mt-[clamp(2.6rem,4.5vw,4.5rem)] grid w-full max-w-[64rem] scroll-mt-28 grid-cols-2 gap-x-6 gap-y-5 md:grid-cols-4"
      >
        {PERCORSO.map((tappa) => (
          <li
            key={tappa.numero}
            data-teaser-coda
            className="flex items-start gap-3"
          >
            <span
              aria-hidden
              className="mt-[3px] h-2.5 w-2.5 flex-none rounded-full"
              style={{ background: tappa.colore }}
            />
            <p className="text-[13px] font-medium leading-snug text-cacao/80">
              <span className="font-bold text-cacao">{tappa.numero}</span>
              <span className="mx-2 text-cacao/35">·</span>
              {tappa.titolo}
            </p>
          </li>
        ))}
      </ol>

      {/* -------------------------------- CTA -------------------------------- */}
      <div data-teaser-coda className="mt-[clamp(2.6rem,4vw,4rem)] flex justify-center">
        <Link
          href={DESTINAZIONE_CONFIGURATORE}
          className="cta-azione teaser-cta group flex min-h-[3.6rem] items-center justify-between gap-4 rounded-full bg-inchiostro py-[0.3rem] pl-[clamp(1.4rem,1.8vw,2rem)] pr-[0.3rem] text-[clamp(10px,0.75vw,12px)] font-bold uppercase leading-none tracking-[0.08em] text-panna"
        >
          Crea il tuo dolce
          <span
            aria-hidden
            className="grid h-[clamp(2.5rem,2.7vw,2.9rem)] w-[clamp(2.5rem,2.7vw,2.9rem)] flex-none place-items-center rounded-full bg-panna text-inchiostro"
          >
            <ArrowRight strokeWidth={1.8} className="h-[1.05rem] w-[1.05rem]" />
          </span>
        </Link>
      </div>
    </div>
  );
}
