"use client";

import { motion } from "motion/react";
import type { CSSProperties } from "react";
import { TEMI, type CardCatalogo, type VarianteCard } from "@/lib/catalog-bento";
import { CircleArrowButton } from "./CircleArrowButton";
import { ProductBadge } from "./ProductBadge";
import { ProductImage } from "./ProductImage";

/**
 * La card del catalogo. Una sola composizione — numero, nome, claim,
 * freccia in colonna a sinistra, prodotto a destra — che le tre varianti
 * riscalano: cambia la misura, non l'ordine di lettura.
 *
 *   hero        l'Intriko: prodotto enorme, tagliato dallo spigolo
 *   grande      testo a sinistra, prodotto dominante a destra
 *   compatta    la riga bassa: tutto più piccolo, prodotto di fianco
 *
 * Il tema entra come tre variabili CSS e non come classi: la stessa
 * card serve cinque campiture (vedi TEMI in lib/catalog-bento.ts).
 *
 * Interazione: `whileHover` sta solo qui e scende ai figli per varianti
 * — la foto cresce e ruota, la freccia si riempie (CSS). Col mouse
 * tutta la campitura è cliccabile; da tastiera e per gli screen reader
 * il comando è il solo bottone della freccia.
 *
 * L'entrata (`nascosta` → `riposo`) non è comandata qui: la sfalsa la
 * griglia, che orchestra le sette card con uno `staggerChildren`. Così
 * il ritardo vale una volta sola, all'ingresso in viewport, e non torna
 * a ogni uscita dall'hover — che è pur sempre un ritorno a `riposo`.
 */

type Misure = {
  guscio: string;
  padding: string;
  numero: string;
  nome: string;
  claim: string;
  testo: string;
  freccia: "grande" | "piccola";
  spazio: string;
  /** il ritaglio della foto sotto xl, dove la griglia è una colonna sola:
   *  i ritagli dei dati valgono da xl in su e qui non arriverebbero, ma
   *  la hero deve restare la card più forte anche sul telefono */
  foto: string;
};

const MISURE: Record<VarianteCard, Misure> = {
  hero: {
    guscio: "min-h-[20rem] sm:min-h-[24rem] xl:min-h-0",
    padding: "p-5 sm:p-6 xl:p-[clamp(1.1rem,1.55vw,1.8rem)]",
    numero: "text-[0.66rem] xl:text-[clamp(0.58rem,0.68vw,0.8rem)]",
    nome: "text-[2rem] sm:text-[2.4rem] xl:text-[clamp(1.9rem,2.9vw,3.4rem)]",
    claim: "text-[0.7rem] xl:text-[clamp(0.6rem,0.72vw,0.86rem)]",
    testo: "max-w-[62%] sm:max-w-[54%] xl:max-w-[58%]",
    freccia: "grande",
    spazio: "mt-6 xl:mt-[clamp(1rem,1.6vw,1.9rem)]",
    foto: "bottom-[-6%] right-[-5%] h-[64%] w-[76%]",
  },
  grande: {
    guscio: "min-h-[18rem] sm:min-h-[24rem] xl:min-h-0",
    padding: "p-5 sm:p-6 xl:p-[clamp(1.1rem,1.5vw,1.7rem)]",
    numero: "text-[0.66rem] xl:text-[clamp(0.58rem,0.66vw,0.78rem)]",
    nome: "text-[1.8rem] sm:text-[2.1rem] xl:text-[clamp(1.7rem,2.5vw,3rem)]",
    claim: "text-[0.7rem] xl:text-[clamp(0.6rem,0.7vw,0.84rem)]",
    testo: "max-w-[60%] xl:max-w-[54%]",
    freccia: "grande",
    spazio: "mt-6 xl:mt-[clamp(1rem,1.5vw,1.8rem)]",
    foto: "bottom-[2%] right-[1%] h-[78%] w-[52%]",
  },
  compatta: {
    guscio: "min-h-[13rem] xl:min-h-0",
    padding: "p-5 xl:p-[clamp(0.95rem,1.28vw,1.45rem)]",
    numero: "text-[0.62rem] xl:text-[clamp(0.54rem,0.6vw,0.72rem)]",
    nome: "text-[1.5rem] xl:text-[clamp(1.2rem,1.62vw,1.95rem)]",
    claim: "text-[0.66rem] xl:text-[clamp(0.5rem,0.62vw,0.74rem)]",
    testo: "max-w-[56%] xl:max-w-[62%]",
    freccia: "piccola",
    spazio: "mt-auto pt-4 xl:pt-[clamp(0.5rem,0.9vw,1.1rem)]",
    foto: "bottom-[2%] right-[1%] h-[78%] w-[48%]",
  },
};

export function ProductCard({
  card,
  onApri,
}: {
  card: CardCatalogo;
  onApri: () => void;
}) {
  const { t, indice, claim, variante, tema, badge, posto, foto } = card;
  const m = MISURE[variante];
  const colori = TEMI[tema];

  return (
    <motion.article
      onClick={onApri}
      className={`card-catalogo ${posto} ${m.guscio}`}
      style={
        {
          "--fondo": colori.fondo,
          "--testo": colori.testo,
          "--numero": colori.numero,
        } as CSSProperties
      }
      whileHover="attiva"
      variants={{
        nascosta: { opacity: 0, y: 20 },
        riposo: { opacity: 1, y: 0 },
        attiva: { opacity: 1, y: -6 },
      }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
    >
      {t.image && (
        <ProductImage
          src={t.image}
          alt={`${t.name}: ${t.note ?? "scatto di prodotto"}`}
          riquadro={`z-0 ${m.foto} ${foto}`}
        />
      )}

      {badge && (
        <ProductBadge
          righe={["BEST", "SELLER"]}
          className="right-[5%] top-[7%] z-[1] h-[clamp(3.2rem,4.6vw,5.1rem)] w-[clamp(3.2rem,4.6vw,5.1rem)]"
        />
      )}

      <div
        className={`relative z-[2] flex h-full flex-col items-start ${m.padding}`}
      >
        <p
          aria-hidden
          className={`font-tecnico font-semibold tracking-[0.16em] ${m.numero}`}
          style={{ color: colori.numero }}
        >
          {indice}
        </p>

        <div className={m.testo}>
          <h3
            className={`font-insegna mt-[0.55em] font-extrabold uppercase leading-[0.88] tracking-[-0.045em] ${m.nome}`}
          >
            {t.name}
          </h3>
          <p
            className={`mt-[0.85em] font-semibold uppercase leading-[1.5] tracking-[0.06em] ${colori.claim} ${m.claim}`}
          >
            {claim[0]}
            <br />
            {claim[1]}
          </p>
        </div>

        {/* nessun onClick proprio: il click (anche quello sintetico che il
            browser genera premendo Invio sul bottone) risale all'<article>,
            così il comando resta uno solo e non si sdoppia */}
        <CircleArrowButton
          misura={m.freccia}
          label={`Apri la scheda di ${t.name}`}
          className={m.spazio}
        />
      </div>
    </motion.article>
  );
}
