"use client";

import { motion } from "motion/react";
import type { CSSProperties } from "react";
import { TEMI, type CardCatalogo, type VarianteCard } from "@/lib/catalog-bento";
import { CircleArrowButton } from "./CircleArrowButton";
import { ProductBadge } from "./ProductBadge";
import { ProductImage } from "./ProductImage";

/**
 * La card del catalogo. Una sola composizione — numero, nome, claim,
 * freccia in colonna a sinistra, prodotto a destra — che le quattro
 * varianti riscalano: cambia la misura, non l'ordine di lettura.
 *
 *   hero        il Golosone: prodotto enorme, tagliato dal fondo card
 *   grande      testo a sinistra, prodotto dominante a destra, intero
 *   verticale   colonna stretta, prodotto largo appoggiato in basso
 *   compatta    la riga bassa: tutto più piccolo, prodotto di fianco
 *
 * Il tema entra come tre variabili CSS e non come classi: la stessa
 * card serve cinque campiture (vedi TEMI in lib/catalog-bento.ts).
 *
 * Interazione: `whileHover` sta solo qui e scende ai figli per varianti
 * — la foto cresce e ruota, la freccia si riempie (CSS). Col mouse
 * tutta la campitura è cliccabile; da tastiera e per gli screen reader
 * il comando è il solo bottone della freccia.
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
  },
  verticale: {
    guscio: "min-h-[18rem] sm:min-h-[24rem] xl:min-h-0",
    padding: "p-5 sm:p-6 xl:p-[clamp(1rem,1.4vw,1.6rem)]",
    numero: "text-[0.66rem] xl:text-[clamp(0.58rem,0.66vw,0.78rem)]",
    nome: "text-[1.8rem] sm:text-[2.1rem] xl:text-[clamp(1.6rem,2.4vw,2.9rem)]",
    claim: "text-[0.7rem] xl:text-[clamp(0.58rem,0.68vw,0.82rem)]",
    testo: "max-w-[60%] xl:max-w-[92%]",
    freccia: "grande",
    spazio: "mt-6 xl:mt-[clamp(0.9rem,1.4vw,1.7rem)]",
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
      initial="riposo"
      animate="riposo"
      whileHover="attiva"
      variants={{ riposo: { y: 0 }, attiva: { y: -6 } }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
    >
      {t.image && (
        <ProductImage
          src={t.image}
          alt={`${t.name}: ${t.note ?? "scatto di prodotto"}`}
          riquadro={`bottom-[2%] right-[1%] z-0 h-[78%] w-[48%] ${foto}`}
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
