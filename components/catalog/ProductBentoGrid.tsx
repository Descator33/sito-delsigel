"use client";

import {
  AnimatePresence,
  LayoutGroup,
  MotionConfig,
  motion,
  useReducedMotion,
} from "motion/react";
import { useState } from "react";
import type { Tipologia } from "@/lib/catalog";
import { VETRINA_CATALOGO, type TemaCard } from "@/lib/catalog-bento";
import { AltreTipologie } from "./AltreTipologie";
import { CatalogFooterCTA } from "./CatalogFooterCTA";
import { ProductCard } from "./ProductCard";
import { ProductQuickView } from "./ProductQuickView";

export type SchedaCatalogo = { t: Tipologia; tema: TemaCard };

const LATI_INGRESSO = [
  "left",
  "right",
  "right",
  "left",
  "left",
  "right",
  "right",
] as const;

/**
 * La griglia bento e i due stati che possiede: quale scheda è aperta e se
 * la coda del catalogo è distesa. È l'unico Client Component strutturale
 * della sezione — intestazione e involucro restano sul server.
 *
 * Le tre righe di xl sono dichiarate a mano e non con `auto-rows`: nel
 * riferimento la riga bassa NON è la metà di quella alta (le proporzioni
 * sono 24,6% e 13,2% della larghezza del contenitore), e con una traccia
 * sola non tornerebbero. Le misure sono in vw così la griglia scala per
 * proporzione, con un tetto in rem che la ferma quando il contenitore
 * smette di crescere.
 *
 * Il wrapper d'ingresso è separato dall'article che possiede l'hover, così
 * la regia scroll-driven e l'interazione della card non si contendono lo
 * stesso transform.
 *
 * `MotionConfig reducedMotion="user"` vale per card, coda e CTA in un
 * colpo: chi ha chiesto meno movimento vede tutto già composto.
 */
export function CatalogFeaturedGrid({
  onApri,
}: {
  onApri: (scheda: SchedaCatalogo) => void;
}) {
  return (
    <div
      data-scroll-catalog-grid
      className="mt-8 grid grid-cols-1 gap-[13px] sm:grid-cols-2 xl:mt-9 xl:grid-cols-12 xl:grid-rows-[clamp(8.5rem,11.1vw,12.5rem)_clamp(8.5rem,11.1vw,12.5rem)_clamp(10rem,12.5vw,14.1rem)]"
    >
      {VETRINA_CATALOGO.map((card, indice) => (
        <div
          key={card.t.code}
          data-catalog-motion="card"
          data-scene-card
          data-scene-index={indice}
          data-scene-side={LATI_INGRESSO[indice]}
          className={`${card.posto} h-full min-w-0`}
        >
          <ProductCard
            card={card}
            onApri={() => onApri({ t: card.t, tema: card.tema })}
          />
        </div>
      ))}
    </div>
  );
}

export function CatalogContinuation({
  aperto,
  onToggle,
  onApri,
}: {
  aperto: boolean;
  onToggle: () => void;
  onApri: (scheda: SchedaCatalogo) => void;
}) {
  const riduciMovimento = useReducedMotion();

  return (
    <LayoutGroup>
      <div id="altre-tipologie">
        <AnimatePresence initial={false}>
          {aperto && (
            <motion.div
              key="altre-tipologie"
              data-catalog-motion="tail"
              initial={
                riduciMovimento ? false : { opacity: 0, y: 22, scale: 0.99 }
              }
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={
                riduciMovimento
                  ? { opacity: 1 }
                  : { opacity: 0, y: 12, scale: 0.995 }
              }
              transition={
                riduciMovimento
                  ? { duration: 0 }
                  : { duration: 0.5, ease: [0.16, 1, 0.3, 1] }
              }
            >
              <AltreTipologie
                onApri={(t) => onApri({ t, tema: "sabbia" })}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <motion.div
        data-catalog-motion="layout"
        layout
        transition={{
          layout: riduciMovimento
            ? { duration: 0 }
            : { duration: 0.48, ease: [0.16, 1, 0.3, 1] },
        }}
      >
        <CatalogFooterCTA
          aperto={aperto}
          onToggle={onToggle}
          controlla="altre-tipologie"
        />
      </motion.div>
    </LayoutGroup>
  );
}

/**
 * Composizione autonoma mantenuta per gli eventuali usi fuori dalla Home.
 * Nella Home la scena usa separatamente vetrina e continuazione, così la CTA
 * espandibile non entra nel tratto sticky.
 */
export function ProductBentoGrid() {
  const [scheda, setScheda] = useState<SchedaCatalogo | null>(null);
  const [coda, setCoda] = useState(false);

  return (
    <MotionConfig reducedMotion="user">
      <CatalogFeaturedGrid onApri={setScheda} />
      <CatalogContinuation
        aperto={coda}
        onToggle={() => setCoda((v) => !v)}
        onApri={setScheda}
      />

      <ProductQuickView
        aperto={scheda?.t ?? null}
        tema={scheda?.tema}
        onChiudi={() => setScheda(null)}
      />
    </MotionConfig>
  );
}
