import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { STORIA } from "@/data/history";
import { StoryPreviewMedia } from "./StoryPreviewMedia";

const ORIGINI = STORIA[0];

/**
 * Un assaggio della storia, non la sua cronologia. Il racconto completo
 * resta su /chi-siamo; qui dati e fotografia arrivano dalla stessa fonte.
 */
export function StoryPreview() {
  return (
    <section
      id="storia-preview"
      aria-labelledby="storia-preview-titolo"
      className="story-preview relative z-20 -mt-[clamp(2.5rem,5vw,5.5rem)] overflow-clip bg-panna text-cacao"
    >
      <div className="mx-auto grid max-w-[1800px] items-center gap-12 px-6 pb-[clamp(8rem,14vw,15rem)] pt-[clamp(9rem,15vw,15rem)] md:px-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-[clamp(3rem,7vw,8rem)]">
        <div className="relative z-10 max-w-[39rem] lg:pl-[clamp(0rem,3vw,3rem)]">
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-fucsia">
            Dal 2011
          </p>
          <h2
            id="storia-preview-titolo"
            className="mt-5 text-balance font-insegna text-[clamp(3.2rem,6.5vw,7.6rem)] font-semibold leading-[0.83] tracking-[-0.06em]"
          >
            <Reveal>Un forno acceso.</Reveal>
            <Reveal delay={0.08}>Una storia che continua.</Reveal>
          </h2>
          <p className="mt-8 max-w-[39ch] text-pretty text-[clamp(1rem,1.25vw,1.25rem)] leading-[1.6] text-cacao/75">
            Delsigel nasce dall&apos;incontro tra Del Monte e Siani Pasticceri.
            Da allora, mani esperte e innovazione crescono insieme.
          </p>
          <Link
            href="/chi-siamo#storia"
            className="story-preview__cta group mt-9 inline-flex min-h-12 items-center gap-5 rounded-full bg-fucsia px-6 text-[11px] font-bold uppercase tracking-[0.12em] text-panna focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cacao"
          >
            Scopri la nostra storia
            <ArrowRight
              aria-hidden
              strokeWidth={1.8}
              className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
        </div>

        <div className="relative min-h-[34rem] md:min-h-[42rem] lg:min-h-[48rem]">
          <p
            aria-hidden
            className="pointer-events-none absolute -left-[0.08em] -top-[0.28em] z-0 font-insegna text-[clamp(8rem,20vw,22rem)] font-semibold leading-none tracking-[-0.08em] text-mandarino/18 lg:-left-[0.35em]"
          >
            2011
          </p>
          <StoryPreviewMedia
            src={ORIGINI.immagine}
            alt={ORIGINI.alt}
          />
        </div>
      </div>
    </section>
  );
}
