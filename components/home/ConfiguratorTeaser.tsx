"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight } from "lucide-react";
import { useScatto } from "@/lib/useScatto";
import {
  abilitaInterattiviCaption,
  aggiungiCaptionHome,
  preparaCaptionHome,
  raccogliCaptionHome,
} from "@/lib/home-caption-reveal";
import { Scintilla } from "@/components/catalog/salati/DecorativeDoodles";
import { ConveyorBelt } from "./ConveyorBelt";
import {
  ANCORA_PERCORSO,
  DESTINAZIONE_CONFIGURATORE,
  PERCORSO,
  type DolceConFoto,
} from "@/lib/percorso-configuratore";

/**
 * CREA IL TUO DOLCE: la hero secondaria del configuratore.
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
 *
 * Da qui i tre strati di trasformo, uno per padrone, che si compongono
 * annidati: lo scrub sull'involucro esterno, la schivata al cursore
 * (`useScatto`, la stessa delle card della linea produttiva in chi-siamo)
 * sul `[data-scatto]` in mezzo, l'onda CSS sul `.percorso-dolce` dentro.
 * Metterne due sullo stesso nodo vorrebbe dire che l'ultimo che scrive
 * cancella l'altro.
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

  /* la schivata al cursore sui tre dolci: solo desktop e solo senza
     prefers-reduced-motion, ci pensa l'hook */
  useScatto(radice);

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);
      const scope = radice.current;
      if (!scope) return;

      const mm = gsap.matchMedia();
      mm.add(
        {
          movimento: "(prefers-reduced-motion: no-preference)",
          alto: "(min-height: 700px)",
        },
        (contesto) => {
          const condizioni = contesto.conditions as {
            movimento: boolean;
            alto: boolean;
          };
          const testa = scope.querySelector<HTMLElement>(
            "[data-teaser-caption-header]",
          );
          const coda = scope.querySelector<HTMLElement>(
            "[data-teaser-caption-tail]",
          );
          const captionTesta = testa ? raccogliCaptionHome(testa) : null;
          const captionCoda = coda ? raccogliCaptionHome(coda) : null;

          if (!captionTesta || !captionCoda) return;
          if (!condizioni.movimento) {
            abilitaInterattiviCaption(captionCoda, true);
            return;
          }

          preparaCaptionHome(captionTesta);
          preparaCaptionHome(captionCoda);
          abilitaInterattiviCaption(captionCoda, false);

          const timelineTesta = gsap.timeline({
            scrollTrigger: {
              trigger: scope,
              start: "top 88%",
              end: "top 28%",
              scrub: window.matchMedia("(pointer: coarse)").matches
                ? true
                : 0.45,
              invalidateOnRefresh: true,
            },
          });
          aggiungiCaptionHome(timelineTesta, captionTesta);

          const timelineCoda = gsap.timeline({
            scrollTrigger: {
              trigger: scope,
              start: "top 48%",
              end: "top 8%",
              scrub: window.matchMedia("(pointer: coarse)").matches
                ? true
                : 0.42,
              invalidateOnRefresh: true,
              onUpdate: ({ progress }) =>
                abilitaInterattiviCaption(captionCoda, progress >= 0.72),
            },
          });
          aggiungiCaptionHome(timelineCoda, captionCoda);

          if (condizioni.alto) {
            const banco = scope.querySelector<HTMLElement>(
              "[data-teaser-banco]",
            );
            const pezzi = gsap.utils.toArray<HTMLElement>(
              "[data-teaser-pezzo]",
              scope,
            );
            const scintille = gsap.utils.toArray<HTMLElement>(
              "[data-teaser-scintilla]",
              scope,
            );

            if (banco && pezzi.length) {
              /* Lo scrub non è agganciato al banco ma al BLOCCO: parte
                 quando la scena si ferma a schermo pieno (top top). */
              const tl = gsap.timeline({
                defaults: { ease: "none" },
                scrollTrigger: {
                  trigger: scope,
                  start: "top top",
                  /* 55% della sosta al racconto, il resto alla scena
                     compiuta: l'ultimo stato resta leggibile. */
                  end: "+=55%",
                  scrub: 0.5,
                  invalidateOnRefresh: true,
                },
              });

              /* I pezzi si posano uno dopo l'altro: il dolce finito arriva
                 per ultimo, nel verso del racconto. */
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
                  i * 0.14,
                );
              });

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
                  0.78,
                );
              }
            }
          }

          return () => abilitaInterattiviCaption(captionCoda, true);
        },
      );

      return () => mm.revert();
    },
    { scope: radice },
  );

  return (
    /* IL BLOCCO. Alto due schermi: il primo lo passa fermo — la quinta
       sticky tiene la scena a schermo pieno mentre la pagina scorre — e
       solo dopo il footer entra da sotto. Prima era una fascia in mezzo
       al flusso, alta quanto il suo contenuto: piccola, e col cacao del
       footer già in vista mentre la si guardava (rilievo 2026-08-20). La
       sosta serve al racconto: è lì che i tre stati si posano. */
    <section ref={radice} className="teaser-blocco relative h-[200svh]">
      <div
        /* overflow-x-clip (mai hidden): i pezzi in arrivo sconfinano di
           qualche decina di pixel, e su un telefono quei pixel sarebbero
           scroll orizzontale di pagina */
        className="teaser-quinta sticky top-0 mx-auto flex h-svh max-w-[1800px] flex-col items-center justify-center overflow-x-clip px-6 py-[clamp(2rem,4vh,4rem)] md:px-12"
      >
        {/* ------------------------------ INSEGNA ------------------------------ */}
        <header
          data-teaser-caption-header
          className="mx-auto max-w-[60rem] text-center"
        >
          <div data-home-caption-mask className="overflow-hidden">
            <p
              data-home-caption="eyebrow"
              className="text-[clamp(11px,0.8vw,13px)] font-bold uppercase tracking-[0.3em] text-mandarino"
            >
              Il configuratore
            </p>
          </div>
          <h2
            id={titoloId}
            className="font-pop mt-[clamp(0.8rem,2vh,1.6rem)] text-[clamp(3.2rem,min(11vw,15vh),9rem)] font-normal uppercase leading-[0.87] tracking-[-0.02em]"
          >
            <span
              data-home-caption-mask
              className="block overflow-hidden pb-[0.05em] text-cacao"
            >
              <span data-home-caption="title" className="block">
                Crea il tuo
              </span>
            </span>
            <span
              data-home-caption-mask
              className="block overflow-hidden pb-[0.05em] text-mandarino"
            >
              <span data-home-caption="title" className="block">
                dolce.
              </span>
            </span>
          </h2>
          <p className="mx-auto mt-[clamp(1rem,2.4vh,2rem)] max-w-[46ch] text-[clamp(1rem,1.25vw,1.35rem)] font-medium leading-[1.55] text-cacao/80">
            <span data-home-caption-mask className="block overflow-hidden">
              <span data-home-caption="copy" className="block">
                Scegli base, crema, topping e dettagli. Con il nostro
                configuratore componi il tuo dolce ideale in pochi step. Tutto
                online, tutto su misura, tutto tuo.
              </span>
            </span>
          </p>
        </header>

        {/* ------------------------------- BANCO ------------------------------- */}
        {/* la scena riusa le misure del percorso (--nastro, --dolce, --passo):
            riscritte per lo schermo pieno in «.teaser-banco»: il nastro è
            lo stesso, cambia la taglia e cosa ci succede sopra */}
        <div
          data-teaser-banco
          className="percorso-scena teaser-banco relative mx-auto mt-[clamp(2rem,5vh,4.5rem)] w-full max-w-[min(72rem,90vw)]"
        >
          <ConveyorBelt />

          <div className="teaser-pezzi relative z-10">
            {dolci.map((dolce, i) => (
              <div key={dolce.stato} data-teaser-pezzo className="relative">
                {/* La presa della schivata. Stretta quanto la foto invece
                    che quanto la colonna — il dolce sta al centro e attorno
                    è tutto vuoto, e su un vuoto grande la fuga partirebbe
                    quando il cursore è ancora lontano. Il tetto 1.6×
                    l'altezza resta sopra la proporzione della foto più larga
                    (1.5), quindi l'`object-contain` continua a misurarsi
                    sull'altezza e il dolce non rimpicciolisce; sotto i 1025px
                    l'effetto nemmeno nasce, e lì `min(100%, …)` tiene la
                    presa dentro la colonna. */}
                <div
                  data-scatto
                  data-scatto-dist="34"
                  data-scatto-rot="10"
                  data-scatto-y="0.3"
                  className="mx-auto w-[min(100%,calc(var(--dolce)*1.6))]"
                >
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
        <div data-teaser-caption-tail className="w-full">
          <ol
            id={ANCORA_PERCORSO}
            className="mx-auto mt-[clamp(1.8rem,4vh,3.4rem)] grid w-full max-w-[72rem] scroll-mt-28 grid-cols-2 gap-x-6 gap-y-4 md:grid-cols-4"
          >
            {PERCORSO.map((tappa) => (
              <li
                key={tappa.numero}
                data-home-caption-mask
                className="overflow-hidden"
              >
                <div data-home-caption="copy" className="flex items-start gap-3">
                  <span
                    aria-hidden
                    className="mt-[3px] h-2.5 w-2.5 flex-none rounded-full"
                    style={{ background: tappa.colore }}
                  />
                  <p className="text-[clamp(13px,0.95vw,15px)] font-medium leading-snug text-cacao/80">
                    <span className="font-bold text-cacao">{tappa.numero}</span>
                    <span className="mx-2 text-cacao/35">·</span>
                    {tappa.titolo}
                  </p>
                </div>
              </li>
            ))}
          </ol>

          {/* -------------------------------- CTA -------------------------------- */}
          <div
            data-home-caption-mask
            className="mt-[clamp(1.8rem,3.6vh,3rem)] flex justify-center overflow-hidden"
          >
            <div data-home-caption="cta">
              <Link
                href={DESTINAZIONE_CONFIGURATORE}
                className="cta-azione teaser-cta group flex min-h-[3.6rem] items-center justify-between gap-4 rounded-full bg-inchiostro py-[0.3rem] pl-[clamp(1.4rem,1.8vw,2rem)] pr-[0.3rem] text-[clamp(10px,0.75vw,12px)] font-bold uppercase leading-none tracking-[0.08em] text-panna"
              >
                Configura il tuo dolce
                <span
                  aria-hidden
                  className="grid h-[clamp(2.5rem,2.7vw,2.9rem)] w-[clamp(2.5rem,2.7vw,2.9rem)] flex-none place-items-center rounded-full bg-panna text-inchiostro"
                >
                  <ArrowRight
                    strokeWidth={1.8}
                    className="h-[1.05rem] w-[1.05rem]"
                  />
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
