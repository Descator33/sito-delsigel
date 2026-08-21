import Link from "next/link";
import { ArrowDown, ArrowRight } from "lucide-react";
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
      id="storia"
      aria-labelledby="storia-preview-titolo"
      className="story-preview relative isolate min-h-[100svh] overflow-clip bg-cacao text-panna"
    >
      <StoryPreviewMedia
        src={ORIGINI.immagine}
        srcVertical={ORIGINI.immagineVertical}
        videoSrc="/storia-generated/01-origini-home-lenta.mp4"
        videoSrcMobile="/storia-generated/01-origini-home-lenta-mobile.mp4"
        alt={ORIGINI.alt}
      />
      <span
        aria-hidden
        className="story-preview__scrim pointer-events-none absolute inset-0 z-[1]"
      />

      <div className="relative z-10 mx-auto flex min-h-[100svh] w-full max-w-[1800px] flex-col justify-between px-6 pb-7 pt-[clamp(6.5rem,10vh,9rem)] md:px-12 md:pb-10">
        <div className="flex items-center justify-between gap-6">
          <div data-home-caption-mask className="overflow-hidden">
            <p
              data-home-caption="eyebrow"
              className="font-mono text-[10px] font-bold uppercase tracking-[0.28em] text-panna/80"
            >
              La nostra storia
            </p>
          </div>
          <div
            data-home-caption-mask
            aria-hidden
            className="hidden overflow-hidden md:block"
          >
            <p
              data-home-caption="eyebrow"
              className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-panna/55"
            >
              Delsigel · Sermoneta
            </p>
          </div>
        </div>

        <div className="grid items-end gap-12 pb-[clamp(1rem,4vh,3rem)] lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-16">
          <div className="max-w-[64rem]">
            <h2
              id="storia-preview-titolo"
              className="max-w-[10.5ch] text-balance font-insegna text-[clamp(3.45rem,8.1vw,9.4rem)] font-semibold leading-[0.82] tracking-[-0.065em]"
            >
              <span
                data-home-caption-mask
                className="block overflow-hidden pb-[0.06em]"
              >
                <span data-home-caption="title" className="block">
                  Un forno acceso,
                </span>
              </span>
              <span
                data-home-caption-mask
                className="block overflow-hidden pb-[0.06em]"
              >
                <span data-home-caption="title" className="block">
                  13 milioni di dolci dopo.
                </span>
              </span>
            </h2>
            <div
              data-home-caption-mask
              className="mt-7 overflow-hidden md:mt-8"
            >
              <p
                data-home-caption="copy"
                className="max-w-[46ch] text-pretty text-[clamp(1rem,1.18vw,1.2rem)] leading-[1.55] text-panna/78"
              >
                Nel 2011 l&apos;incontro tra Del Monte e Siani. Oggi
                un&apos;industria artigianale certificata IFS Food, Rainforest
                Alliance e RSPO, una nuova generazione al banco e un piano per
                raddoppiare.
              </p>
            </div>
            <div
              data-home-caption-mask
              className="mt-8 w-fit overflow-hidden md:mt-9"
            >
              <div data-home-caption="cta">
                <Link
                  href="/chi-siamo#storia"
                  className="story-preview__cta group inline-flex min-h-12 items-center gap-5 rounded-full bg-fucsia px-6 text-[11px] font-bold uppercase tracking-[0.12em] text-panna focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-panna"
                >
                  Scopri la nostra storia
                  <ArrowRight
                    aria-hidden
                    strokeWidth={1.8}
                    className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                  />
                </Link>
              </div>
            </div>
          </div>

          <div
            data-home-caption-mask
            className="overflow-hidden lg:mb-1 lg:justify-self-end"
          >
            <div data-home-caption="cta">
              <Link
                href="#catalogo"
                aria-label="Continua al catalogo 2026/27"
                className="story-preview__catalog-cue group flex w-fit items-center gap-4 text-panna"
              >
                <span>
                  <span className="block font-mono text-[9px] font-semibold uppercase tracking-[0.24em] text-panna/55">
                    Prossimo capitolo
                  </span>
                  <span className="mt-1.5 block text-sm font-semibold tracking-[-0.01em]">
                    Catalogo 2026/27
                  </span>
                </span>
                <span className="story-preview__catalog-arrow flex h-11 w-11 items-center justify-center rounded-full border border-panna/45">
                  <ArrowDown aria-hidden className="h-4 w-4" strokeWidth={2} />
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
