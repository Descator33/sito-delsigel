"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { MotionConfig, motion } from "motion/react";
import { Reveal } from "@/components/Reveal";
import { DESTINAZIONE_CATALOGO } from "@/lib/catalogo-fisico";
import { STELLA } from "./ProductBadge";

/**
 * La metà crema della sezione: insegna, promessa, CTA, sigillo.
 *
 * Le tre righe del titolo salgono una dopo l'altra con `Reveal` — la stessa
 * apertura in uso nel resto del sito — e il colore sta sulle righe, non
 * sulle parole: nero, fucsia, nero col punto fucsia, come nel riferimento.
 *
 * `MotionConfig reducedMotion="user"` spegne in un colpo tutte le entrate
 * di questo blocco per chi ha chiesto meno movimento: restano testo,
 * colori e comandi, che è tutto ciò che serve per usarlo.
 */

/** entrata comune a promessa, CTA e coda: sale di poco, una volta sola */
const SALE = {
  initial: { opacity: 0, y: 22 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.4 },
} as const;

export function CatalogPhysicalIntro({ titoloId }: { titoloId: string }) {
  return (
    <MotionConfig reducedMotion="user">
      <div className="relative flex flex-col justify-center px-6 py-16 sm:px-10 lg:py-[clamp(3rem,4.6vw,5rem)] lg:pl-[clamp(2rem,3.8vw,4.6rem)] lg:pr-[clamp(2rem,3.4vw,4rem)]">
        {/* Insegna e sigillo stanno nello stesso riquadro: il sigillo si
            appoggia alla riga dell'occhiello, come nel riferimento, e resta
            lì qualunque altezza prenda la colonna. Il margine negativo gli
            ridà il rientro destro della colonna: nel riferimento il sigillo
            arriva quasi a toccare la campitura arancione. */}
        <div className="relative max-w-[42rem] lg:max-w-none lg:-mr-[clamp(2rem,3.4vw,4rem)]">
          <p className="font-tecnico text-[10px] font-semibold uppercase tracking-[0.22em] text-fucsia">
            Catalogo fisico 2026/27
          </p>
          <div aria-hidden className="mt-3 h-[2px] w-10 bg-fucsia" />

          <h2
            id={titoloId}
            className="font-insegna mt-4 text-[clamp(2.7rem,9vw,5rem)] font-extrabold uppercase leading-[0.86] tracking-[-0.045em] lg:mt-6 lg:text-[clamp(3rem,5.2vw,6.6rem)]"
          >
            <Reveal>Il catalogo</Reveal>
            <Reveal delay={0.08}>
              <span className="text-fucsia">2026/2027</span>
            </Reveal>
            <Reveal delay={0.16}>
              Da sfogliare<span className="text-fucsia">.</span>
            </Reveal>
          </h2>

          <SigilloNovita />
        </div>

        <motion.p
          {...SALE}
          transition={{ duration: 0.6, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className="mt-7 max-w-[38ch] text-[clamp(0.95rem,1.05vw,1.15rem)] leading-[1.6] text-inchiostro/85 lg:mt-8"
        >
          Ispirazioni, tendenze e tutte le novità Delsigel.
          <br className="hidden sm:inline" /> Un mondo di dolcezza, tutto da
          scoprire.
        </motion.p>

        <motion.div
          {...SALE}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="mt-9 lg:mt-11"
        >
          <Link
            href={DESTINAZIONE_CATALOGO}
            className="cf-cta font-tecnico group inline-flex w-full max-w-[24rem] items-center justify-between gap-6 rounded-full bg-fucsia py-[0.45rem] pl-[clamp(1.4rem,2.1vw,2.2rem)] pr-[0.45rem] text-[11px] font-semibold uppercase tracking-[0.18em] text-panna sm:w-auto"
          >
            Scopri la nuova edizione
            <span
              aria-hidden
              className="grid h-11 w-11 flex-none place-items-center rounded-full border border-panna/55 lg:h-[clamp(2.5rem,3vw,3.1rem)] lg:w-[clamp(2.5rem,3vw,3.1rem)]"
            >
              <ArrowRight strokeWidth={1.5} className="h-[18px] w-[18px]" />
            </span>
          </Link>
        </motion.div>

      </div>
    </MotionConfig>
  );
}

/**
 * Il sigillo dentellato «Novità 2026/2027»: stessa stella a 22 punte delle
 * card prodotto (`ProductBadge`), ribaltata di colore — fucsia pieno, testo
 * inchiostro — e inclinata come nel riferimento. Sta fermo: la sezione ha
 * già la galleria che si muove.
 */
function SigilloNovita() {
  return (
    <motion.div
      aria-hidden
      initial={{ opacity: 0, scale: 0.8, rotate: -18 }}
      whileInView={{ opacity: 1, scale: 1, rotate: -8 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.55, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="pointer-events-none absolute -top-3 right-0 h-[5.25rem] w-[5.25rem] lg:-top-5 lg:right-[clamp(0.75rem,1.4vw,2rem)] lg:h-[clamp(4.5rem,7.2vw,7.6rem)] lg:w-[clamp(4.5rem,7.2vw,7.6rem)]"
    >
      <svg viewBox="0 0 100 100" className="h-full w-full">
        <path d={STELLA} fill="var(--fucsia)" />
        <text
          x="50"
          y="41"
          textAnchor="middle"
          fill="var(--inchiostro)"
          className="font-tecnico"
          fontSize="10.5"
          fontWeight="600"
          letterSpacing="0.6"
        >
          NOVITÀ
        </text>
        <text
          x="50"
          y="57"
          textAnchor="middle"
          fill="var(--inchiostro)"
          className="font-tecnico"
          fontSize="14"
          fontWeight="600"
          letterSpacing="0.2"
        >
          2026
        </text>
        <text
          x="50"
          y="71"
          textAnchor="middle"
          fill="var(--inchiostro)"
          className="font-tecnico"
          fontSize="14"
          fontWeight="600"
          letterSpacing="0.2"
        >
          /2027
        </text>
      </svg>
    </motion.div>
  );
}
