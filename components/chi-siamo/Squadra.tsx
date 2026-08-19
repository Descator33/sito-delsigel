"use client";

import { useRef, type RefObject } from "react";
import { TeamCard, type TeamMember } from "@/components/TeamCard";
import { Reveal } from "@/components/Reveal";
import { useCardTilt } from "@/lib/useCardTilt";

/** lo stesso still del catalogo, scontornato: il Golosone come decoro */
const GOLOSONE = "/products/golosone-crema-granella.webp";

const OCTAGON =
  "polygon(22% 0, 78% 0, 100% 22%, 100% 78%, 78% 100%, 22% 100%, 0 78%, 0 22%)";

const ARROW =
  "flex h-12 w-12 items-center justify-center rounded-full border border-panna/40 text-xl text-panna transition-all hover:border-panna hover:bg-panna hover:text-inchiostro active:scale-95";

/**
 * La squadra come fila di targhe grandi su fondo inchiostro: carosello a
 * scatti e targhe che inseguono il puntatore, con il Golosone e i sigilli
 * pop a riempire il campo.
 */
export function Squadra({ team }: { team: TeamMember[] }) {
  const section = useRef<HTMLElement>(null);
  const row = useRef<HTMLDivElement>(null);

  useCardTilt(section);

  const scrollRow = (ref: RefObject<HTMLDivElement | null>, dir: 1 | -1) =>
    ref.current?.scrollBy({
      left: dir * ref.current.clientWidth * 0.7,
      behavior: "smooth",
    });

  return (
    <section
      ref={section}
      id="squadra"
      className="relative scroll-mt-20 overflow-hidden bg-inchiostro py-24 text-panna md:py-28"
    >
      {/* il Golosone fa capolino dal bordo, come la pizza del riferimento */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={GOLOSONE}
        alt=""
        aria-hidden
        className="pointer-events-none absolute -left-16 bottom-6 w-48 -rotate-12 opacity-90 md:w-64"
        draggable={false}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute right-[6%] top-[10%] hidden h-16 w-16 bg-acido md:block"
        style={{ clipPath: OCTAGON }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-[14%] right-[3%] hidden h-10 w-10 bg-viola md:block"
        style={{ clipPath: OCTAGON }}
      />

      <div className="mx-auto flex max-w-[1800px] flex-wrap items-end justify-between gap-6 px-6 pb-12 md:px-12">
        <div>
          <h2 className="type-display text-[clamp(2.4rem,5.5vw,4.4rem)] leading-none">
            <Reveal>La squadra.</Reveal>
          </h2>
          <p className="mt-4 max-w-sm text-base leading-relaxed text-panna/70">
            Ventuno volti, un solo laboratorio: l&apos;industria artigianale al
            completo, dal 2011.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <p className="type-scritta hidden -rotate-3 text-3xl leading-none text-acido sm:block">
            una squadra coi fiocchi!
          </p>
          <button
            type="button"
            aria-label="Scorri la squadra indietro"
            onClick={() => scrollRow(row, -1)}
            className={ARROW}
          >
            ‹
          </button>
          <button
            type="button"
            aria-label="Scorri la squadra avanti"
            onClick={() => scrollRow(row, 1)}
            className={ARROW}
          >
            ›
          </button>
        </div>
      </div>

      <div
        ref={row}
        className="no-scrollbar relative flex snap-x snap-mandatory gap-8 overflow-x-auto px-6 pb-4 md:px-12"
      >
        {team.map((m) => (
          <div key={m.name} className="w-[min(88vw,560px)] shrink-0 snap-start">
            <div data-tilt className="h-full">
              <div data-tilt-inner className="h-full">
                <TeamCard m={m} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
