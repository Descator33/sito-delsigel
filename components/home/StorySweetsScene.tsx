"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { MotionConfig } from "motion/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { lenisAttivo } from "@/components/SmoothScroll";
import {
  CatalogContinuation,
  CatalogFeaturedGrid,
  type SchedaCatalogo,
} from "@/components/catalog/ProductBentoGrid";
import { ProductQuickView } from "@/components/catalog/ProductQuickView";

type ModalitaScena = "desktop" | "mobile" | "compact" | "static";

const ANCORE = new Set(["#storia", "#catalogo", "#dolci"]);

function segnoDi(card: HTMLElement) {
  return card.dataset.sceneSide === "right" ? 1 : -1;
}

function distanzaFuoriSchermo(card: HTMLElement) {
  return segnoDi(card) * (window.innerWidth + card.offsetWidth * 0.45);
}

/**
 * I due primi capitoli scroll-driven della Home.
 *
 * Story e heading arrivano come slot: restano Server Components anche se la
 * regia che li circonda vive sul client. Il palco usa due track distinti:
 * prima la Storia sticky, poi il catalogo che le sale sopra e si ferma mentre
 * le sette card atterrano. La coda espandibile resta fuori dal pin.
 */
export function StorySweetsScene({
  story,
  heading,
}: {
  story: ReactNode;
  heading: ReactNode;
}) {
  const radice = useRef<HTMLDivElement>(null);
  const [scheda, setScheda] = useState<SchedaCatalogo | null>(null);
  const [coda, setCoda] = useState(false);

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);
      const scope = radice.current;
      if (!scope) return;

      const trackStoria = scope.querySelector<HTMLElement>(
        "[data-scene-story-track]",
      );
      const storia = scope.querySelector<HTMLElement>("[data-scene-story]");
      const mediaStoria = scope.querySelector<HTMLElement>(
        "[data-scene-story-media]",
      );
      const elementiStoria = gsap.utils.toArray<HTMLElement>(
        "[data-scene-story-item]",
        scope,
      );
      const trackCatalogo = scope.querySelector<HTMLElement>(
        "[data-scene-catalog-track]",
      );
      const catalogo = scope.querySelector<HTMLElement>(
        "[data-scene-catalog]",
      );
      const elementiHeading = gsap.utils.toArray<HTMLElement>(
        "[data-scene-heading-item]",
        scope,
      );
      const cards = gsap.utils.toArray<HTMLElement>(
        "[data-scene-card]",
        scope,
      );

      if (
        !trackStoria ||
        !storia ||
        !trackCatalogo ||
        !catalogo ||
        elementiStoria.length === 0 ||
        elementiHeading.length === 0 ||
        cards.length !== 7
      ) {
        return;
      }

      const mm = gsap.matchMedia();
      mm.add(
        {
          desktop:
            "(min-width: 1280px) and (min-height: 760px) and (max-aspect-ratio: 19/10)",
          mobile: "(max-width: 767px) and (min-height: 720px)",
          movimento: "(prefers-reduced-motion: no-preference)",
        },
        (contesto) => {
          const condizioni = contesto.conditions as {
            desktop: boolean;
            mobile: boolean;
            movimento: boolean;
          };

          const modo: ModalitaScena = !condizioni.movimento
            ? "static"
            : condizioni.desktop
              ? "desktop"
              : condizioni.mobile
                ? "mobile"
                : "compact";

          scope.dataset.sceneMode = modo;

          if (!condizioni.movimento) return;

          const timelineStoria = gsap.timeline({
            scrollTrigger: {
              trigger: trackStoria,
              start: condizioni.desktop || condizioni.mobile ? "top top" : "top 82%",
              end:
                condizioni.desktop || condizioni.mobile
                  ? "bottom bottom"
                  : "bottom 28%",
              scrub: window.matchMedia("(pointer: coarse)").matches ? true : 0.55,
              invalidateOnRefresh: true,
            },
          });

          gsap.set(elementiStoria, { autoAlpha: 0, y: 34 });
          timelineStoria.to(
            elementiStoria,
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.24,
              stagger: 0.025,
              ease: "power3.out",
            },
            0.03,
          );

          if (mediaStoria) {
            timelineStoria.fromTo(
              mediaStoria,
              { yPercent: -2.5, scale: 1.055 },
              {
                yPercent: 2.5,
                scale: 1.01,
                duration: 1,
                ease: "none",
              },
              0,
            );
          }

          if (condizioni.desktop) {
            gsap.set(elementiHeading, { autoAlpha: 0, y: 32 });
            gsap.set(cards, {
              autoAlpha: 0,
              x: (_indice, card: HTMLElement) => distanzaFuoriSchermo(card),
              rotation: (_indice, card: HTMLElement) => segnoDi(card) * 9,
              scale: 0.9,
            });

            /* L'intestazione appartiene all'ingresso del foglio panna: quando
               il catalogo arriva a coprire la Storia è già leggibile, ma le
               card non sono ancora comparse. */
            gsap
              .timeline({
                scrollTrigger: {
                  trigger: catalogo,
                  start: "top bottom",
                  end: "top top",
                  scrub: window.matchMedia("(pointer: coarse)").matches
                    ? true
                    : 0.5,
                  invalidateOnRefresh: true,
                },
              })
              .to(
                elementiHeading,
                {
                  autoAlpha: 1,
                  y: 0,
                  duration: 0.55,
                  stagger: 0.08,
                  ease: "power3.out",
                },
                0.25,
              );

            const timelineCatalogo = gsap.timeline({
              scrollTrigger: {
                trigger: trackCatalogo,
                start: "top top",
                end: "bottom bottom",
                scrub: window.matchMedia("(pointer: coarse)").matches
                  ? true
                  : 0.62,
                invalidateOnRefresh: true,
              },
            });

            cards.forEach((card, indice) => {
              const segno = segnoDi(card);
              const ingresso = 0.92 + indice * 0.68;

              timelineCatalogo
                .to(
                  card,
                  {
                    autoAlpha: 1,
                    x: () => -segno * window.innerWidth * 0.045,
                    rotation: -segno * 2.6,
                    scale: 1.035,
                    duration: 0.64,
                    ease: "power3.out",
                  },
                  ingresso,
                )
                .to(
                  card,
                  {
                    x: () => segno * window.innerWidth * 0.018,
                    rotation: segno * 1.15,
                    scale: 0.99,
                    duration: 0.18,
                    ease: "power1.inOut",
                  },
                )
                .to(
                  card,
                  {
                    x: () => -segno * window.innerWidth * 0.006,
                    rotation: -segno * 0.4,
                    scale: 1.008,
                    duration: 0.14,
                    ease: "power1.inOut",
                  },
                )
                .to(card, {
                  x: 0,
                  rotation: 0,
                  scale: 1,
                  duration: 0.12,
                  ease: "power1.out",
                });
            });

            /* Un ultimo tratto senza nuovi ingressi lascia leggere la griglia
               completa prima che il palco si liberi. */
            timelineCatalogo.to(
              catalogo,
              { duration: 1.05, ease: "none" },
              6.15,
            );
          } else {
            gsap.set(elementiHeading, { autoAlpha: 0, y: 28 });
            gsap.to(
              elementiHeading,
              {
                autoAlpha: 1,
                y: 0,
                stagger: 0.08,
                ease: "none",
                scrollTrigger: {
                  trigger: catalogo,
                  start: "top 88%",
                  end: "top 42%",
                  scrub: 0.45,
                  invalidateOnRefresh: true,
                },
              },
            );

            cards.forEach((card) => {
              const segno = segnoDi(card);
              const timelineCard = gsap.timeline({
                scrollTrigger: {
                  trigger: card,
                  start: "top 94%",
                  end: "top 54%",
                  scrub: window.matchMedia("(pointer: coarse)").matches
                    ? true
                    : 0.45,
                  invalidateOnRefresh: true,
                },
              });

              timelineCard
                .fromTo(
                  card,
                  {
                    autoAlpha: 0,
                    x: () => segno * Math.min(window.innerWidth * 0.72, 520),
                    rotation: segno * 7,
                    scale: 0.93,
                  },
                  {
                    autoAlpha: 1,
                    x: () => -segno * Math.min(window.innerWidth * 0.055, 34),
                    rotation: -segno * 2,
                    scale: 1.025,
                    duration: 0.62,
                    ease: "power3.out",
                  },
                )
                .to(card, {
                  x: () => segno * Math.min(window.innerWidth * 0.022, 15),
                  rotation: segno * 0.9,
                  scale: 0.99,
                  duration: 0.18,
                  ease: "power1.inOut",
                })
                .to(card, {
                  x: 0,
                  rotation: 0,
                  scale: 1,
                  duration: 0.2,
                  ease: "power1.out",
                });
            });
          }

          ScrollTrigger.refresh();

          return () => {
            scope.dataset.sceneMode = "static";
          };
        },
      );

      return () => mm.revert();
    },
    { scope: radice },
  );

  /* Link e reload con hash devono parlare con Lenis: il browser nativo
     cambierebbe posizione mentre Lenis sta ancora interpolando e verrebbe
     trascinato indietro. Gli id restano sui veri capitoli, quindi il fallback
     senza JavaScript continua a funzionare. */
  useEffect(() => {
    const scope = radice.current;
    if (!scope) return;

    const vaiA = (hash: string, immediato = false) => {
      if (!ANCORE.has(hash)) return;
      const meta = document.getElementById(hash.slice(1));
      if (!meta) return;
      const destinazione =
        hash === "#storia"
          ? (scope.querySelector<HTMLElement>("[data-scene-story-track]") ??
            meta)
          : meta;

      /* Atterrare sul primo pixel della Storia significherebbe fermarsi prima
         del reveal. L'offset resta dentro il suo tratto sticky e porta subito
         la copy in uno stato leggibile; Catalogo e Dolci puntano invece al
         momento esatto in cui il foglio panna ha coperto lo schermo. */
      const modo = scope.dataset.sceneMode;
      const offset =
        hash === "#storia" && modo === "desktop"
          ? window.innerHeight * 0.78
          : hash === "#storia" && modo === "mobile"
            ? window.innerHeight * 0.36
            : 0;

      const lenis = lenisAttivo();
      if (lenis) {
        lenis.scrollTo(destinazione, {
          offset,
          immediate: immediato,
          duration: immediato ? undefined : 1.1,
          easing: (t: number) => 1 - Math.pow(1 - t, 3),
        });
      } else {
        const top =
          destinazione.getBoundingClientRect().top + window.scrollY + offset;
        window.scrollTo({
          top,
          behavior: immediato ? "auto" : "smooth",
        });
      }
    };

    const intercetta = (evento: MouseEvent) => {
      if (
        evento.defaultPrevented ||
        evento.button !== 0 ||
        evento.metaKey ||
        evento.ctrlKey ||
        evento.shiftKey ||
        evento.altKey
      ) {
        return;
      }

      const bersaglio = evento.target;
      if (!(bersaglio instanceof Element)) return;
      const link = bersaglio.closest<HTMLAnchorElement>("a[href]");
      if (!link) return;

      const url = new URL(link.href, window.location.href);
      if (
        url.origin !== window.location.origin ||
        url.pathname !== window.location.pathname ||
        !ANCORE.has(url.hash)
      ) {
        return;
      }

      evento.preventDefault();
      window.history.pushState(null, "", url.hash);
      vaiA(url.hash);
    };

    const riallineaHash = () => vaiA(window.location.hash, true);
    document.addEventListener("click", intercetta, { capture: true });
    window.addEventListener("hashchange", riallineaHash);

    let secondoFrame = 0;
    const primoFrame = requestAnimationFrame(() => {
      secondoFrame = requestAnimationFrame(riallineaHash);
    });

    return () => {
      cancelAnimationFrame(primoFrame);
      cancelAnimationFrame(secondoFrame);
      document.removeEventListener("click", intercetta, true);
      window.removeEventListener("hashchange", riallineaHash);
    };
  }, []);

  useEffect(() => {
    const frame = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(frame);
  }, [coda]);

  return (
    <MotionConfig reducedMotion="user">
      <div
        ref={radice}
        data-story-catalog-scene
        data-scene-track
        data-scene-mode="static"
        className="story-sweets-scene relative bg-panna"
      >
        <div data-scene-story-track className="story-sweets-scene__story-track">
          <div
            data-scene-story-sticky
            className="story-sweets-scene__story-sticky"
          >
            <div data-scene-story className="h-full">
              {story}
            </div>
          </div>
        </div>

        <section
          id="catalogo"
          data-scene-catalog
          aria-label="Catalogo dolci Delsigel"
          className="story-sweets-scene__catalog relative z-20 bg-panna text-inchiostro"
        >
          <div
            id="dolci"
            data-scene-catalog-track
            className="story-sweets-scene__catalog-track"
          >
            <div
              data-scene-sticky
              className="story-sweets-scene__catalog-sticky font-testo bg-panna"
            >
              <div
                data-scroll-catalog-frame
                className="story-sweets-scene__catalog-frame mx-auto max-w-[1800px] px-6 pb-0 pt-14 md:px-12 md:pt-20"
              >
                <div data-scroll-catalog-pinned>
                  {heading}
                  <CatalogFeaturedGrid
                    onApri={(prossima) => setScheda(prossima)}
                  />
                </div>
              </div>
            </div>
          </div>

          <div
            data-catalog-continuation
            className="mx-auto max-w-[1800px] px-6 pb-16 md:px-12 md:pb-24"
          >
            <CatalogContinuation
              aperto={coda}
              onToggle={() => setCoda((corrente) => !corrente)}
              onApri={(prossima) => setScheda(prossima)}
            />
          </div>
        </section>

        <ProductQuickView
          aperto={scheda?.t ?? null}
          tema={scheda?.tema}
          onChiudi={() => setScheda(null)}
        />
      </div>
    </MotionConfig>
  );
}
