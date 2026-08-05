"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ArrowLeft, ArrowRight, Pointer } from "lucide-react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { CATALOG_SLIDES, type CatalogSlide } from "@/lib/catalogo-fisico";

/**
 * Il set fotografico: le pagine del catalogo stampato, da trascinare.
 *
 * Non è un rullo automatico. Si sfoglia — trascinando, con le frecce o da
 * tastiera — e si ferma dove lo lasci. Nessun autoplay, per scelta.
 *
 * Rev 05/08 — `align: "center"` al posto di `"start"`: la pagina in campo
 * sta al centro del set e le due vicine sconfinano dai bordi, così si
 * capisce che il catalogo continua da entrambe le parti. Le frecce sono
 * uscite dalla riga dei comandi e stanno ai due fianchi della pagina
 * attiva, dove cade la mano.
 *
 * Scala, scivolamento e inclinazione stanno in CSS (`.cf-slide`), non in
 * Motion: sono transizioni che partono da un data-attribute, quindi
 * durante il trascinamento non si ridisegna nulla.
 */

/**
 * Larghezza della slide. Le frecce vanno tenute in coppia con questi
 * valori: il loro scarto dal bordo è `(100 - larghezza) / 2`, cioè
 * esattamente il fianco della pagina centrata.
 */
const MISURA_SLIDE =
  "flex-[0_0_84%] px-[clamp(0.35rem,0.7vw,0.85rem)] md:flex-[0_0_70%] lg:flex-[0_0_56%]";
const SCARTO_FRECCE = {
  prima: "left-[8%] -translate-x-1/2 md:left-[15%] lg:left-[22%]",
  dopo: "right-[8%] translate-x-1/2 md:right-[15%] lg:right-[22%]",
};

const NUMERO = (i: number) => String(i + 1).padStart(2, "0");

export function CatalogCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "center",
    loop: true,
    dragFree: false,
    skipSnaps: false,
  });
  const [attiva, setAttiva] = useState(0);

  const pannello = useRef<HTMLDivElement>(null);
  const menoMoto = useReducedMotion();

  /* Il respiro verticale della galleria mentre la sezione attraversa lo
     schermo: pochi pixel, quanto basta a staccarla dalla colonna blush. */
  const { scrollYProgress } = useScroll({
    target: pannello,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [34, -34]);

  useEffect(() => {
    if (!emblaApi) return;
    const leggi = () => setAttiva(emblaApi.selectedScrollSnap());
    leggi();
    emblaApi.on("select", leggi).on("reInit", leggi);
    return () => {
      emblaApi.off("select", leggi).off("reInit", leggi);
    };
  }, [emblaApi]);

  const prima = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const dopo = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const totale = CATALOG_SLIDES.length;

  return (
    <div
      ref={pannello}
      className="cf-set relative flex flex-col overflow-hidden text-inchiostro"
    >
      {/* ---------------------------- INTESTAZIONE ---------------------------- */}
      <div className="pl-6 pt-10 sm:pl-10 lg:pl-[clamp(1rem,1.6vw,2.25rem)] lg:pt-[clamp(2.5rem,3.6vw,4rem)]">
        <div className="ml-auto w-[clamp(11rem,16vw,16.5rem)]">
          <p className="font-tecnico pr-6 text-[10px] font-semibold uppercase leading-[1.7] tracking-[0.2em] sm:pr-10 lg:pr-[clamp(1.5rem,2.6vw,3rem)]">
            Edizione stampata
            <br />
            da collezione
          </p>
          <div aria-hidden className="mt-3 h-px w-full bg-inchiostro/20" />
        </div>
      </div>

      {/* ------------------------------ GALLERIA ------------------------------ */}
      {/* Le frecce stanno qui e non dentro il blocco che respira: devono
          restare ferme mentre le pagine scorrono sotto. */}
      <div className="relative flex min-h-0 flex-1 items-center py-9 lg:py-[clamp(1.5rem,2.4vw,3rem)]">
        <motion.div
          style={menoMoto ? undefined : { y }}
          className="cf-parallasse w-full"
        >
          <div
            className="cf-viewport"
            ref={emblaRef}
            role="group"
            aria-roledescription="carosello"
            aria-label="Fotografie del catalogo stampato 2026/2027"
          >
            <div className="cf-track">
              {CATALOG_SLIDES.map((slide, i) => (
                <Diapositiva
                  key={slide.src}
                  slide={slide}
                  indice={i}
                  totale={totale}
                  attiva={i === attiva}
                />
              ))}
            </div>
          </div>
        </motion.div>

        <BottoneTondo
          label="Fotografia precedente"
          onClick={prima}
          icona="prima"
          className={SCARTO_FRECCE.prima}
        />
        <BottoneTondo
          label="Fotografia successiva"
          onClick={dopo}
          icona="dopo"
          className={SCARTO_FRECCE.dopo}
        />
      </div>

      {/* ------------------------------ COMANDI ------------------------------- */}
      <div className="px-6 pb-10 sm:px-10 lg:px-[clamp(1.5rem,3vw,3.75rem)] lg:pb-[clamp(2rem,3.2vw,3.5rem)]">
        <div
          aria-hidden
          className="font-tecnico mx-auto flex w-full max-w-[34rem] items-center gap-5 text-[10px] font-semibold tracking-[0.16em]"
        >
          <span className="flex-none text-fucsia">{NUMERO(attiva)}</span>

          <div className="relative h-[3px] flex-1 overflow-hidden rounded-full bg-inchiostro/16">
            <span
              className="cf-avanzamento absolute inset-y-0 left-0 rounded-full bg-fucsia"
              style={{ width: `${((attiva + 1) / totale) * 100}%` }}
            />
          </div>

          <span className="flex-none text-inchiostro/50">
            {NUMERO(totale - 1)}
          </span>
        </div>

        <p className="font-tecnico mt-6 flex items-center justify-center gap-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-inchiostro/70">
          <Pointer aria-hidden strokeWidth={1.5} className="h-[18px] w-[18px]" />
          Trascina per esplorare
        </p>

        {/* Il conto visibile è decorativo: l'annuncio è questo, ed è
            l'unico modo per sapere dove si è arrivati usando le frecce
            da tastiera. */}
        <p className="sr-only" aria-live="polite">
          Fotografia {attiva + 1} di {totale}: {CATALOG_SLIDES[attiva].label}
        </p>
      </div>
    </div>
  );
}

/**
 * Una pagina del catalogo. Il riquadro è 4:5 e la foto lo riempie: gli
 * scatti sono quadrati, il taglio toglie un decimo per lato e i soggetti
 * sono tutti al centro (dove non lo sono c'è `objectPosition` nei dati).
 *
 * La didascalia sta in basso, piccola, sopra una sfumatura corta: serve a
 * leggerla, non a velare la foto — sul tortora è la fotografia il punto
 * più acceso della campitura e deve restare tale.
 */
function Diapositiva({
  slide,
  indice,
  totale,
  attiva,
}: {
  slide: CatalogSlide;
  indice: number;
  totale: number;
  attiva: boolean;
}) {
  return (
    <div
      className={`cf-slide ${MISURA_SLIDE}`}
      data-attiva={attiva}
      role="group"
      aria-roledescription="diapositiva"
      aria-label={`${indice + 1} di ${totale}`}
    >
      <div className="cf-card relative aspect-[4/5] w-full overflow-hidden rounded-[18px] bg-tortora">
        <Image
          src={slide.src}
          alt={slide.alt}
          fill
          /* La sezione è ben sotto la piega: caricarle avide toglierebbe
             banda all'hero. Restano pigre — la prima con priorità alta
             quando tocca a lei (`priority` è deprecato da Next 16). */
          fetchPriority={indice === 0 ? "high" : "auto"}
          sizes="(max-width: 767px) 86vw, (max-width: 1023px) 72vw, 34vw"
          style={{ objectPosition: slide.objectPosition ?? "center" }}
          className="select-none object-cover"
          draggable={false}
        />

        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[22%] bg-gradient-to-t from-inchiostro/45 to-transparent"
        />
        <p className="font-tecnico absolute bottom-4 left-4 right-4 text-[10px] font-semibold uppercase tracking-[0.16em] text-panna">
          <span className="text-panna/65">{NUMERO(indice)}</span>
          <span className="mx-2 text-panna/45">/</span>
          {slide.label}
        </p>
      </div>
    </div>
  );
}

function BottoneTondo({
  label,
  onClick,
  icona,
  className,
}: {
  label: string;
  onClick: () => void;
  icona: "prima" | "dopo";
  className: string;
}) {
  const Segno = icona === "prima" ? ArrowLeft : ArrowRight;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={`cf-comando absolute top-1/2 z-10 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full lg:h-[clamp(3rem,3.4vw,3.5rem)] lg:w-[clamp(3rem,3.4vw,3.5rem)] ${className}`}
    >
      <Segno aria-hidden strokeWidth={1.5} className="h-[18px] w-[18px]" />
    </button>
  );
}
