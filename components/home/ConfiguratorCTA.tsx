"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, MonitorCog } from "lucide-react";
import { Scintilla } from "@/components/catalog/salati/DecorativeDoodles";
import {
  ANCORA_PERCORSO,
  DESTINAZIONE_CONFIGURATORE,
} from "@/lib/percorso-configuratore";

/**
 * Il richiamo al configuratore: la campitura mandarino della chiusura.
 *
 * È l'unico blocco pieno della sezione ed è voluto — tutto il resto è
 * chiaro e leggero, quindi l'occhio ci finisce sopra senza che serva
 * gridare. Due comandi soli e una gerarchia netta: il primo porta dentro
 * al configuratore, il secondo riporta al percorso qui accanto per chi
 * prima vuole capire (sul telefono, dove le tappe stanno sopra, è un
 * ritorno vero; sul desktop il salto è corto perché la spiegazione è già
 * in campo).
 *
 * Entrambi sono elementi di navigazione veri — `Link` e `a` — non
 * pulsanti con un `onClick`: funzionano col tasto centrale, si aprono in
 * una scheda nuova, si copiano. Un `div` cliccabile non fa niente di
 * tutto questo.
 */

export function ConfiguratorCTA() {
  const ridotto = useReducedMotion();

  return (
    <motion.aside
      initial={ridotto ? { opacity: 0 } : { opacity: 0, x: 28 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="cta-configuratore relative flex flex-col overflow-hidden p-[clamp(1.6rem,2.2vw,2.7rem)] text-panna md:flex-row md:items-end md:justify-between md:gap-10 xl:flex-col xl:items-stretch xl:justify-between"
    >
      <Decori />

      <div className="relative">
        <span
          aria-hidden
          className="grid h-[clamp(2.9rem,3.4vw,3.8rem)] w-[clamp(2.9rem,3.4vw,3.8rem)] place-items-center rounded-[clamp(10px,0.9vw,14px)] border border-panna/45"
        >
          <MonitorCog
            strokeWidth={1.5}
            className="h-[clamp(1.35rem,1.7vw,1.9rem)] w-[clamp(1.35rem,1.7vw,1.9rem)]"
          />
        </span>

        <h3 className="font-pop mt-[clamp(1.1rem,1.6vw,1.8rem)] text-[clamp(2.1rem,6.5vw,2.7rem)] font-normal uppercase leading-[0.9] tracking-[-0.02em] md:text-[clamp(2rem,3.4vw,2.6rem)] xl:text-[clamp(1.95rem,2.6vw,3.15rem)]">
          <span className="block text-inchiostro">Entra nel</span>
          <span className="block text-panna">Configuratore</span>
        </h3>

        <p className="mt-[clamp(0.9rem,1.25vw,1.3rem)] max-w-[30ch] text-[clamp(0.85rem,0.96vw,1.05rem)] font-medium leading-[1.55] text-panna/90">
          Componi il tuo dolce personalizzato in pochi step. Facile, veloce,
          tuo.
        </p>
      </div>

      <div className="relative mt-[clamp(1.6rem,2.2vw,2.4rem)] flex flex-col gap-3 md:mt-0 md:w-[20rem] md:flex-none xl:mt-[clamp(1.6rem,2.2vw,2.6rem)] xl:w-auto">
        <Link
          href={DESTINAZIONE_CONFIGURATORE}
          className="cta-azione group flex min-h-[3.35rem] items-center justify-between gap-3 rounded-full bg-inchiostro py-[0.3rem] pl-[clamp(0.8rem,1.1vw,1.4rem)] pr-[0.3rem] text-[clamp(9px,0.68vw,11.5px)] font-bold uppercase leading-none tracking-[0.07em] text-panna"
        >
          Vai al configuratore
          <span
            aria-hidden
            className="grid h-[clamp(2.25rem,2.45vw,2.6rem)] w-[clamp(2.25rem,2.45vw,2.6rem)] flex-none place-items-center rounded-full bg-panna text-inchiostro"
          >
            <ArrowRight strokeWidth={1.8} className="h-[1.05rem] w-[1.05rem]" />
          </span>
        </Link>

        <a
          href={`#${ANCORA_PERCORSO}`}
          className="cta-azione cta-azione-vuota group flex min-h-[3.35rem] items-center justify-between gap-3 rounded-full border border-panna/55 py-[0.3rem] pl-[clamp(0.8rem,1.1vw,1.4rem)] pr-[0.3rem] text-[clamp(9px,0.68vw,11.5px)] font-bold uppercase leading-none tracking-[0.07em] text-panna"
        >
          Scopri come funziona
          <span
            aria-hidden
            className="grid h-[clamp(2.25rem,2.45vw,2.6rem)] w-[clamp(2.25rem,2.45vw,2.6rem)] flex-none place-items-center rounded-full border border-panna/55"
          >
            <ArrowRight strokeWidth={1.8} className="h-[1.05rem] w-[1.05rem]" />
          </span>
        </a>
      </div>
    </motion.aside>
  );
}

/** i segni pop agli angoli: gli stessi della copertina salati, in panna */
function Decori() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      <Scintilla className="absolute right-[7%] top-[5%] h-[clamp(16px,1.4vw,22px)] w-[clamp(16px,1.4vw,22px)] text-panna/85" />
      {/* il secondo segno sta in mezzo, non in basso: sotto finirebbe
          addosso ai due comandi, e un decoro che tocca un bersaglio
          smette di essere un decoro */}
      <Scintilla className="absolute right-[8%] top-[52%] h-[clamp(13px,1.1vw,17px)] w-[clamp(13px,1.1vw,17px)] text-panna/55 md:top-[16%] md:right-[46%] xl:right-[8%] xl:top-[52%]" />
    </div>
  );
}
