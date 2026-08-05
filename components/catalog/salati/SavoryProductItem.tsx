"use client";

import Image from "next/image";
import { motion } from "motion/react";
import type { VoceSalata } from "@/lib/catalog-salati";
import { ProductHalo } from "./ProductHalo";

/**
 * Un salato nella vetrina: ovale, fotografia, numero, nome.
 *
 * La misura della diapositiva sta qui e non nel carosello, perché è la
 * sola cosa che decide quanti prodotti si vedono a ogni larghezza: 1,35 sul
 * telefono (si capisce a colpo d'occhio che la fila continua), 2 e mezzo
 * sul tablet, da 3 a 5 sul desktop man mano che la vetrina cresce.
 *
 * Tutto l'elemento è un `<button>` solo: un bersaglio, uno stop di
 * tabulazione, e la scheda prodotto che si apre — la stessa delle card dei
 * dolci. Il numero è marcato `aria-hidden` e il nome accessibile lo dà
 * `aria-label`: letto ad alta voce, «01 Focaccine Miste» non aggiunge nulla.
 *
 * L'immagine vive in un riquadro di misura fissa con `object-contain`:
 * gli still hanno proporzioni molto diverse fra loro (la pizzetta è larga,
 * il vol-au-vent è piccolo) e questo è ciò che tiene la fila allineata
 * senza tagliare nessun prodotto e senza far ballare l'impaginato.
 */

const MISURA_SLIDE =
  "flex-[0_0_74%] sm:flex-[0_0_46%] md:flex-[0_0_34%] lg:flex-[0_0_33.333%] xl:flex-[0_0_25%] 2xl:flex-[0_0_20%]";

/* Le tre parti del movimento: l'elemento sale, la foto cresce appena,
   l'ovale si inclina (la rotazione è dentro ProductHalo). Corte e
   asciutte, come chiede il resto del sito. */
const SALTO = { riposo: { y: 0 }, attiva: { y: -8 } };
const ZOOM = { riposo: { scale: 1 }, attiva: { scale: 1.05 } };
const TEMPO = { duration: 0.25, ease: "easeOut" } as const;

export function SavoryProductItem({
  voce,
  posizione,
  totale,
  onApri,
}: {
  voce: VoceSalata;
  /** posto nella fila, per l'annuncio «3 di 9» */
  posizione: number;
  totale: number;
  onApri: () => void;
}) {
  const { t, indice, alt } = voce;

  return (
    <div
      className={`${MISURA_SLIDE} min-w-0 px-[clamp(0.5rem,0.9vw,1rem)]`}
      role="group"
      aria-roledescription="diapositiva"
      aria-label={`${posizione} di ${totale}`}
    >
      <motion.button
        type="button"
        onClick={onApri}
        aria-label={`Apri la scheda di ${t.name}`}
        initial="riposo"
        animate="riposo"
        whileHover="attiva"
        whileFocus="attiva"
        variants={SALTO}
        transition={TEMPO}
        className="salati-prodotto mx-auto flex w-full max-w-[10.25rem] flex-col items-center pb-1 text-center"
      >
        <span className="relative block aspect-[7/10] w-full">
          <ProductHalo />
          <ProductImage src={t.image} alt={alt} iniziale={t.name.charAt(0)} />
        </span>

        <ProductNumber>{indice}</ProductNumber>
        <ProductName>{t.name}</ProductName>
      </motion.button>
    </div>
  );
}

function ProductImage({
  src,
  alt,
  iniziale,
}: {
  src?: string;
  alt: string;
  iniziale: string;
}) {
  if (!src) {
    return (
      <span
        aria-hidden
        className="font-insegna-salati absolute inset-0 grid place-items-center text-[3.5rem] uppercase leading-none text-mandarino/25"
      >
        {iniziale}
      </span>
    );
  }

  return (
    <motion.span
      variants={ZOOM}
      transition={TEMPO}
      className="salati-foto absolute inset-x-[8%] top-[16%] block h-[60%]"
    >
      <Image
        src={src}
        alt={alt}
        fill
        /* la sezione è molto sotto la piega: le foto restano pigre */
        sizes="(max-width: 640px) 42vw, (max-width: 1279px) 22vw, 170px"
        className="select-none object-contain"
        draggable={false}
      />
    </motion.span>
  );
}

function ProductNumber({ children }: { children: string }) {
  return (
    <span
      aria-hidden
      className="mt-[clamp(0.7rem,1vw,1.15rem)] block text-[clamp(1.2rem,1.45vw,1.7rem)] font-bold leading-none tracking-[-0.02em] text-mandarino tabular-nums"
    >
      {children}
    </span>
  );
}

function ProductName({ children }: { children: string }) {
  return (
    <span className="salati-nome mt-[0.55rem] block text-[13px] font-bold uppercase leading-[1.1] tracking-[-0.02em] text-cacao sm:text-[14px]">
      {children}
    </span>
  );
}
