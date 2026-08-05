"use client";

import { motion, type Variants } from "motion/react";
import { ChevronRight } from "lucide-react";
import type { TappaPercorso } from "@/lib/percorso-configuratore";
import { Scintilla } from "@/components/catalog/salati/DecorativeDoodles";
import { ICONE } from "./IconePercorso";

/**
 * Una tappa del percorso: pallino numerato, icona, titolo, testo.
 *
 * Non è una card da cruscotto, e la differenza la fanno tre cose: il
 * fondo panna su sezione crema (due caldi vicini, non bianco su grigio),
 * il segno pop che sborda dall'angolo alto, e il pallino colorato che è
 * l'unico pieno della composizione. Il colore arriva come variabile CSS
 * dai dati e si applica in linea: in Tailwind v4 le classi non si
 * compongono a runtime, e una classe scritta a mano per
 * tappa sarebbe un'occasione in più di scollarsi dai dati.
 *
 * La freccia verso la tappa seguente sta QUI e non fra una card e
 * l'altra: messa nel vuoto della griglia occuperebbe una colonna e
 * romperebbe l'allineamento con i dolci sul nastro, che dividono le
 * stesse quattro colonne.
 */

export function ConfiguratorStepCard({
  tappa,
  indice,
  varianti,
  ridotto,
  ultima,
}: {
  tappa: TappaPercorso;
  indice: number;
  varianti: Variants;
  /** movimento ridotto: niente sollevamento, restano bordo e ombra */
  ridotto: boolean;
  /** l'ultima non ha nessuno a cui passare la mano: niente freccia */
  ultima: boolean;
}) {
  const Icona = ICONE[indice];

  return (
    <motion.li
      variants={varianti}
      whileHover={ridotto ? undefined : { y: -4 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      /* il fondo tiene molto più aria del resto della card: è la fascia
         in cui sale il dolce dal nastro, e il testo non deve mai finirci
         sotto */
      className="percorso-tappa relative flex flex-col rounded-[clamp(16px,1.4vw,22px)] border border-linea bg-panna p-[clamp(1.05rem,1.3vw,1.55rem)] pb-[clamp(3.4rem,4.3vw,5.4rem)]"
    >
      {/* il segno pop dell'angolo, nel colore della tappa */}
      <span
        aria-hidden
        className="pointer-events-none absolute -right-1.5 -top-3"
        style={{ color: tappa.colore }}
      >
        <Scintilla className="h-[clamp(17px,1.35vw,23px)] w-[clamp(17px,1.35vw,23px)]" />
      </span>

      <div className="flex items-start justify-between gap-2">
        <span
          aria-hidden
          className="grid h-[clamp(1.9rem,2.3vw,2.5rem)] w-[clamp(1.9rem,2.3vw,2.5rem)] flex-none place-items-center rounded-full text-[clamp(10px,0.8vw,13px)] font-bold leading-none text-panna tabular-nums"
          style={{ background: tappa.colore }}
        >
          {tappa.numero}
        </span>
        <Icona className="h-[clamp(1.8rem,2.2vw,2.4rem)] w-[clamp(1.8rem,2.2vw,2.4rem)] flex-none text-cacao" />
      </div>

      <h3 className="mt-[clamp(1.5rem,2.2vw,2.6rem)] text-[clamp(12.5px,0.95vw,16px)] font-bold uppercase leading-[1.2] tracking-[-0.01em] text-cacao">
        {tappa.titolo}
      </h3>
      <p className="mt-[clamp(0.55rem,0.8vw,0.95rem)] text-[clamp(11.5px,0.86vw,14.5px)] font-medium leading-[1.45] text-cacao/70">
        {tappa.testo}
      </p>

      {!ultima && (
        <span
          aria-hidden
          className="percorso-freccia absolute top-[42%] text-cacao/35"
        >
          <ChevronRight strokeWidth={2} className="h-[clamp(16px,1.3vw,22px)] w-[clamp(16px,1.3vw,22px)]" />
        </span>
      )}
    </motion.li>
  );
}
