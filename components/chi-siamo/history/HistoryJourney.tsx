"use client";

import { getImageProps } from "next/image";
import { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { FINALE, INTESTAZIONE, STORIA, type TappaStoria } from "@/data/history";

const PAROLE_MARQUEE = ["mani", "tempo", "cura", "materia", "futuro"];
const SFONDI_CAPITOLI = [
  "var(--panna)",
  "color-mix(in srgb, var(--viola) 18%, var(--panna))",
  "var(--panna-dim)",
  "color-mix(in srgb, var(--acido) 24%, var(--panna))",
  "color-mix(in srgb, var(--fucsia) 12%, var(--panna))",
  "color-mix(in srgb, var(--viola) 24%, var(--panna))",
] as const;

function StoryPicture({
  tappa,
  className,
  loading = "lazy",
}: {
  tappa: TappaStoria;
  className?: string;
  loading?: "eager" | "lazy";
}) {
  const common = {
    alt: tappa.alt,
    sizes: "(min-width: 768px) 64vw, 100vw",
    loading,
  };
  const {
    props: { srcSet: desktop },
  } = getImageProps({
    ...common,
    src: tappa.immagine,
    width: 1536,
    height: 1024,
  });
  const {
    props: { srcSet: mobile, ...rest },
  } = getImageProps({
    ...common,
    src: tappa.immagineVertical,
    width: 768,
    height: 1024,
  });

  return (
    <picture>
      <source media="(min-width: 768px)" srcSet={desktop} />
      <source media="(max-width: 767px)" srcSet={mobile} />
      <img {...rest} alt={tappa.alt} className={className} />
    </picture>
  );
}

function Certificazioni({ tappa }: { tappa: TappaStoria }) {
  if (!tappa.certificazioni) return null;
  return (
    <ul className="mt-6 flex flex-wrap items-center gap-3">
      {tappa.certificazioni.map((cert) => (
        <li
          key={cert.nome}
          title={cert.nome}
          className="flex h-16 w-[5.5rem] items-center justify-center rounded-md border border-cacao/12 bg-white p-2.5 shadow-[0_2px_10px_rgba(22,6,1,0.06)]"
        >
          {/* loghi ufficiali in SVG: nessuna ottimizzazione Next necessaria */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={cert.logo}
            alt={cert.alt}
            loading="lazy"
            className="max-h-full max-w-full object-contain"
          />
        </li>
      ))}
    </ul>
  );
}

function HistoryReduced() {
  return (
    <ol className="hidden border-t border-cacao/15 px-5 text-cacao motion-reduce:block md:px-10">
      {STORIA.map((tappa) => (
        <li key={tappa.id} className="mx-auto max-w-5xl border-b border-cacao/15 py-16">
          <figure className="relative aspect-[3/4] overflow-clip md:aspect-[16/10]">
            <StoryPicture
              tappa={tappa}
              className="absolute inset-0 h-full w-full object-cover"
            />
          </figure>
          <div className="mt-8 max-w-xl">
            <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-cacao/65">
              {tappa.numero} / {tappa.sottotitolo}
            </p>
            <h3 className="mt-3 font-insegna text-[clamp(2.8rem,14vw,5.5rem)] font-semibold leading-[0.86] tracking-[-0.055em]">
              {tappa.titolo}
            </h3>
            <p className="mt-6 text-xl font-medium leading-snug text-cacao">
              {tappa.frase}
            </p>
            <p className="mt-4 max-w-[42ch] text-sm leading-6 text-cacao/65">
              {tappa.descrizione}
            </p>
            <Certificazioni tappa={tappa} />
          </div>
        </li>
      ))}
    </ol>
  );
}

export function HistoryJourney() {
  const sezione = useRef<HTMLElement>(null);
  const [attiva, setAttiva] = useState(0);
  const attivaRef = useRef(0);

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);
      const scope = sezione.current;
      if (!scope) return;

      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const intro = scope.querySelector<HTMLElement>("[data-story-intro]");
        const introFoto = scope.querySelector<HTMLElement>("[data-intro-foto]");
        const introTitolo = scope.querySelector<HTMLElement>("[data-intro-titolo]");
        const marquee = scope.querySelector<HTMLElement>("[data-story-marquee]");
        const sequenza = scope.querySelector<HTMLElement>("[data-story-sequence]");
        const progresso = scope.querySelector<HTMLElement>("[data-story-progress]");
        const fondi = gsap.utils.toArray<HTMLElement>("[data-story-color]", scope);
        const media = gsap.utils.toArray<HTMLElement>("[data-story-media]", scope);
        const immagini = gsap.utils.toArray<HTMLElement>("[data-story-image]", scope);
        const testi = gsap.utils.toArray<HTMLElement>("[data-story-copy]", scope);

        if (intro) {
          const apertura = gsap.timeline({
            scrollTrigger: {
              trigger: intro,
              start: "top 88%",
              end: "bottom top",
              scrub: 0.55,
              invalidateOnRefresh: true,
            },
          });
          if (introFoto) {
            apertura.fromTo(
              introFoto,
              { clipPath: "inset(10% 0 10% 26%)", scale: 1.08 },
              { clipPath: "inset(0% 0 0% 0%)", scale: 1, ease: "none" },
              0
            );
          }
          if (introTitolo) {
            apertura.fromTo(
              introTitolo,
              { y: "10svh" },
              { y: "-6svh", ease: "none" },
              0
            );
          }
          if (marquee) {
            apertura.fromTo(
              marquee,
              { xPercent: 0 },
              { xPercent: -24, ease: "none" },
              0
            );
          }
        }

        if (!sequenza || media.length !== STORIA.length || testi.length !== STORIA.length) {
          return;
        }

        gsap.set(media, {
          clipPath: "inset(100% 0 0 0)",
          autoAlpha: 1,
        });
        gsap.set(media[0], { clipPath: "inset(0% 0 0 0)" });
        gsap.set(immagini, { scale: 1.065 });
        gsap.set(immagini[0], { scale: 1 });
        gsap.set(testi, { autoAlpha: 0, y: 30 });
        gsap.set(testi[0], { autoAlpha: 1, y: 0 });
        gsap.set(fondi, { autoAlpha: 0 });
        gsap.set(fondi[0], { autoAlpha: 1 });
        if (progresso) gsap.set(progresso, { scaleX: 0, transformOrigin: "left center" });

        const durata = STORIA.length;
        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: sequenza,
            start: "top top",
            end: "bottom bottom",
            scrub: window.matchMedia("(pointer: coarse)").matches ? true : 0.55,
            invalidateOnRefresh: true,
            onUpdate(self) {
              const prossimo = Math.min(
                STORIA.length - 1,
                Math.floor(self.progress * STORIA.length)
              );
              if (prossimo !== attivaRef.current) {
                attivaRef.current = prossimo;
                setAttiva(prossimo);
              }
            },
          },
        });

        if (progresso) {
          timeline.to(progresso, { scaleX: 1, duration: durata, ease: "none" }, 0);
        }
        timeline.fromTo(
          immagini[0],
          { scale: 1.055 },
          { scale: 1, duration: 1, ease: "none" },
          0
        );

        for (let i = 1; i < STORIA.length; i += 1) {
          const ingresso = i;
          timeline.to(
            testi[i - 1],
            { autoAlpha: 0, y: -22, duration: 0.22, ease: "power2.in" },
            ingresso - 0.12
          );
          timeline.fromTo(
            media[i],
            { clipPath: "inset(100% 0 0 0)" },
            {
              clipPath: "inset(0% 0 0 0)",
              duration: 0.58,
              ease: "power2.inOut",
            },
            ingresso
          );
          timeline.fromTo(
            immagini[i],
            { scale: 1.065 },
            { scale: 1, duration: 0.9, ease: "none" },
            ingresso
          );
          timeline.fromTo(
            fondi[i],
            { autoAlpha: 0 },
            { autoAlpha: 1, duration: 0.5, ease: "power1.inOut" },
            ingresso
          );
          timeline.fromTo(
            testi[i],
            { autoAlpha: 0, y: 30 },
            { autoAlpha: 1, y: 0, duration: 0.34, ease: "power2.out" },
            ingresso + 0.22
          );
        }

        return () => {
          attivaRef.current = 0;
          setAttiva(0);
        };
      });

      return () => mm.revert();
    },
    { scope: sezione }
  );

  return (
    <section
      ref={sezione}
      id="storia"
      aria-labelledby="storia-titolo"
      className="relative scroll-mt-20 bg-panna text-cacao"
    >
      <div
        data-story-intro
        className="relative grid min-h-[100svh] grid-rows-[1fr_auto] overflow-clip border-b border-cacao/12 bg-panna md:grid-cols-[0.92fr_1.08fr] md:grid-rows-1"
      >
        <div className="relative z-10 flex items-center px-5 py-28 md:px-10 lg:px-14">
          <div data-intro-titolo className="w-full max-w-6xl">
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.3em] text-cacao/70">
              {INTESTAZIONE.eyebrow}
            </p>
            <h2
              id="storia-titolo"
              className="mt-7 max-w-6xl font-insegna text-[clamp(4rem,9.4vw,10.5rem)] font-semibold leading-[0.79] tracking-[-0.07em]"
            >
              <span className="block">La nostra</span>
              <span className="flex items-center gap-[0.11em]">
                <span className="relative inline-block h-[0.42em] w-[0.92em] shrink-0 overflow-hidden rounded-[999px] align-middle">
                  <StoryPicture
                    tappa={STORIA[2]}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                </span>
                storia
              </span>
            </h2>
            <p className="mt-9 max-w-[34ch] text-pretty text-base leading-7 text-cacao/68 md:text-lg">
              {INTESTAZIONE.testo[0]} {INTESTAZIONE.testo[1]}
            </p>
          </div>
        </div>

        <figure className="relative min-h-[56svh] overflow-clip md:min-h-[100svh]">
          <div data-intro-foto className="absolute inset-0 origin-center">
            <StoryPicture
              tappa={STORIA[0]}
              /* È la prima immagine del capitolo e diventa LCP quando si
                 entra direttamente da /#storia: non deve aspettare il
                 margine del lazy loader. Tutte le tappe successive restano
                 lazy tramite il valore predefinito di StoryPicture. */
              loading="eager"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <span
              aria-hidden
              className="absolute inset-0 bg-gradient-to-t from-cacao/20 via-transparent to-transparent md:bg-gradient-to-r md:from-cacao/15 md:via-transparent md:to-transparent"
            />
          </div>
        </figure>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 overflow-hidden border-y border-cacao/10 bg-mandarino py-3">
          <p
            data-story-marquee
            aria-hidden
            className="flex w-max whitespace-nowrap font-insegna text-[clamp(1.25rem,2.2vw,2.5rem)] font-medium uppercase leading-none tracking-[-0.03em] text-panna"
          >
            {[...PAROLE_MARQUEE, ...PAROLE_MARQUEE, ...PAROLE_MARQUEE].map(
              (parola, index) => (
                <span key={`${parola}-${index}`} className="flex items-center">
                  <span className="px-5 md:px-8">{parola}</span>
                  <span className="h-1.5 w-1.5 rounded-full bg-viola" />
                </span>
              )
            )}
          </p>
        </div>
      </div>

      <div
        data-story-sequence
        className="relative h-[610svh] motion-reduce:hidden"
      >
        <div className="sticky top-0 h-[100svh] overflow-clip bg-panna">
          <div aria-hidden className="absolute inset-0">
            {SFONDI_CAPITOLI.map((sfondo, index) => (
              <span
                key={sfondo}
                data-story-color
                className="absolute inset-0"
                style={{ background: sfondo, zIndex: index + 1 }}
              />
            ))}
          </div>

          <div className="absolute inset-x-0 top-0 z-10 h-[52svh] md:inset-y-0 md:left-[39%] md:h-auto">
            {STORIA.map((tappa, index) => (
              <figure
                key={tappa.id}
                data-story-media
                className="absolute inset-0 origin-bottom overflow-clip"
                style={{ zIndex: index + 1 }}
              >
                <div data-story-image className="absolute -inset-[3%] origin-center">
                  <StoryPicture
                    tappa={tappa}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                </div>
                <span
                  aria-hidden
                  className="absolute inset-0 hidden bg-gradient-to-r from-cacao/18 via-transparent to-transparent md:block"
                />
              </figure>
            ))}
          </div>

          <div className="absolute inset-x-5 top-[5.5rem] z-30 flex items-center gap-4 rounded-full border border-cacao/10 bg-panna/90 px-4 py-3 backdrop-blur-md md:inset-x-10 md:top-24 lg:inset-x-14">
            <p className="shrink-0 font-mono text-[10px] font-semibold tabular-nums tracking-[0.22em] text-cacao">
              {String(attiva + 1).padStart(2, "0")}
              <span className="text-cacao/45"> / {String(STORIA.length).padStart(2, "0")}</span>
            </p>
            <div className="h-px flex-1 overflow-hidden bg-cacao/25">
              <span data-story-progress className="block h-full w-full bg-mandarino" />
            </div>
            <p className="hidden font-mono text-[9px] uppercase tracking-[0.22em] text-cacao/70 md:block">
              scorri per continuare
            </p>
          </div>

          <ol className="absolute inset-0 z-20">
            {STORIA.map((tappa, index) => (
              <li
                key={tappa.id}
                data-story-copy
                aria-hidden={index !== attiva}
                className="absolute inset-0 flex items-end px-5 pb-8 pt-24 text-cacao md:items-center md:px-10 md:pb-0 lg:px-14"
              >
                <article className="w-full max-w-[36rem] md:w-[35vw] md:max-w-[34rem]">
                  <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.26em] text-cacao/70">
                    {tappa.sottotitolo}
                  </p>
                  <h3 className="mt-3 max-w-[9ch] text-balance font-insegna text-[clamp(3.4rem,7vw,8.2rem)] font-semibold leading-[0.82] tracking-[-0.065em]">
                    {tappa.titolo}
                  </h3>
                  <p className="mt-6 max-w-[29ch] text-balance text-[clamp(1.2rem,2vw,1.9rem)] font-medium leading-[1.08] text-cacao">
                    {tappa.frase}
                  </p>
                  <p className="mt-4 max-w-[42ch] text-pretty text-sm leading-6 text-cacao/70 md:text-[15px] md:leading-7">
                    {tappa.descrizione}
                  </p>
                  <Certificazioni tappa={tappa} />
                </article>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <HistoryReduced />

      <footer className="relative flex min-h-[92svh] items-center border-t border-cacao/12 bg-[color-mix(in_srgb,var(--viola)_22%,var(--panna))] px-5 py-28 text-cacao md:px-10 lg:px-14">
        <div className="mx-auto w-full max-w-[1480px]">
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.28em] text-cacao/70">
            {FINALE.eyebrow}
          </p>
          <p className="mt-6 max-w-[15ch] text-balance font-insegna text-[clamp(3.4rem,8vw,9.5rem)] font-semibold leading-[0.83] tracking-[-0.068em]">
            {FINALE.frase[0]} {FINALE.frase[1]}
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-7">
            <a
              href={INTESTAZIONE.azione.href}
              className="inline-flex min-h-12 items-center justify-center bg-mandarino px-6 text-xs font-bold uppercase tracking-[0.16em] text-white transition-transform duration-300 hover:-translate-y-1 active:translate-y-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cacao"
            >
              {INTESTAZIONE.azione.testo}
            </a>
            <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-cacao/70">
              {FINALE.coda}
            </p>
          </div>
        </div>
      </footer>
    </section>
  );
}
