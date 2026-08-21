"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { MotionConfig, motion, type Variants } from "motion/react";
import { DESTINAZIONE_CATALOGO } from "@/lib/catalogo-fisico";
import { STELLA } from "./ProductBadge";

/**
 * La metà crema della sezione: insegna, promessa, CTA, sigillo.
 *
 * Tutta la caption usa le stesse maschere della hero: occhiello, tre righe,
 * promessa e CTA scorrono in campo senza alcuna variazione di opacità.
 *
 * `MotionConfig reducedMotion="user"` spegne in un colpo tutte le entrate
 * di questo blocco per chi ha chiesto meno movimento: restano testo,
 * colori e comandi, che è tutto ciò che serve per usarlo.
 */

const EASE_CAPTION = [0.16, 1, 0.3, 1] as const;
const CAPTION_COPY: Variants = {
  nascosta: { y: "115%" },
  visibile: { y: "0%" },
};
const CAPTION_TITOLO: Variants = {
  nascosta: { y: "165%" },
  visibile: { y: "0%" },
};
const CAPTION_CTA: Variants = {
  nascosta: { x: "-110%" },
  visibile: { x: "0%" },
};

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
          <motion.div
            data-home-caption-mask
            initial="nascosta"
            whileInView="visibile"
            viewport={{ once: true, amount: 0.6 }}
            className="overflow-hidden"
          >
            <motion.p
              data-catalog-motion="reveal"
              variants={CAPTION_COPY}
              transition={{ duration: 0.7, ease: EASE_CAPTION }}
              className="font-tecnico text-[10px] font-semibold uppercase tracking-[0.22em] text-fucsia"
            >
              Catalogo fisico 2026/27
            </motion.p>
          </motion.div>
          <div aria-hidden className="mt-3 h-[2px] w-10 bg-fucsia" />

          <h2
            id={titoloId}
            className="font-insegna mt-4 text-[clamp(2.7rem,9vw,5rem)] font-extrabold uppercase leading-[0.86] tracking-[-0.045em] lg:mt-6 lg:text-[clamp(3rem,5.2vw,6.6rem)]"
          >
            <motion.span
              data-home-caption-mask
              initial="nascosta"
              whileInView="visibile"
              viewport={{ once: true, amount: 0.6 }}
              className="block overflow-hidden pb-[0.05em]"
            >
              <motion.span
                data-catalog-motion="reveal"
                variants={CAPTION_TITOLO}
                transition={{ duration: 0.72, delay: 0.06, ease: EASE_CAPTION }}
                className="block"
              >
                Il catalogo
              </motion.span>
            </motion.span>
            <motion.span
              data-home-caption-mask
              initial="nascosta"
              whileInView="visibile"
              viewport={{ once: true, amount: 0.6 }}
              className="block overflow-hidden pb-[0.05em]"
            >
              <motion.span
                data-catalog-motion="reveal"
                variants={CAPTION_TITOLO}
                transition={{ duration: 0.72, delay: 0.1, ease: EASE_CAPTION }}
                className="block text-fucsia"
              >
                2026/2027
              </motion.span>
            </motion.span>
            <motion.span
              data-home-caption-mask
              initial="nascosta"
              whileInView="visibile"
              viewport={{ once: true, amount: 0.6 }}
              className="block overflow-hidden pb-[0.05em]"
            >
              <motion.span
                data-catalog-motion="reveal"
                variants={CAPTION_TITOLO}
                transition={{ duration: 0.72, delay: 0.14, ease: EASE_CAPTION }}
                className="block"
              >
                Da sfogliare<span className="text-fucsia">.</span>
              </motion.span>
            </motion.span>
          </h2>

          <SigilloNovita />
        </div>

        <motion.div
          data-home-caption-mask
          initial="nascosta"
          whileInView="visibile"
          viewport={{ once: true, amount: 0.5 }}
          className="mt-7 overflow-hidden lg:mt-8"
        >
          <motion.p
            data-catalog-motion="reveal"
            variants={CAPTION_COPY}
            transition={{ duration: 0.68, delay: 0.2, ease: EASE_CAPTION }}
            className="max-w-[38ch] text-[clamp(0.95rem,1.05vw,1.15rem)] leading-[1.6] text-inchiostro/85"
          >
            Ispirazioni, tendenze e tutte le novità Delsigel.
            <br className="hidden sm:inline" /> Un mondo di dolcezza, tutto da
            scoprire.
          </motion.p>
        </motion.div>

        <motion.div
          data-home-caption-mask
          initial="nascosta"
          whileInView="visibile"
          viewport={{ once: true, amount: 0.45 }}
          className="mt-9 overflow-hidden lg:mt-11"
        >
          <motion.div
            data-catalog-motion="reveal"
            variants={CAPTION_CTA}
            transition={{ duration: 0.7, delay: 0.28, ease: EASE_CAPTION }}
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
