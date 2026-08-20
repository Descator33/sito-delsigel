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
 * La griglia orchestra anche l'entrata, ma ogni card osserva il proprio
 * ingresso. Sul desktop il risultato resta una sequenza editoriale; sul
 * telefono le card più in basso non partono prima che l'utente le veda.
 * Il wrapper d'ingresso è separato dall'article che possiede l'hover, così
 * i due movimenti non si contendono lo stesso transform.
 *
 * `MotionConfig reducedMotion="user"` vale per card, coda e CTA in un
 * colpo: chi ha chiesto meno movimento vede tutto già composto.
 */
export function ProductBentoGrid() {
  const [scheda, setScheda] = useState<{ t: Tipologia; tema: TemaCard } | null>(
    null
  );
  const [coda, setCoda] = useState(false);
  const riduciMovimento = useReducedMotion();

  return (
    <MotionConfig reducedMotion="user">
      <div className="mt-8 grid grid-cols-1 gap-[13px] sm:grid-cols-2 xl:mt-9 xl:grid-cols-12 xl:grid-rows-[clamp(8.5rem,11.1vw,12.5rem)_clamp(8.5rem,11.1vw,12.5rem)_clamp(10rem,12.5vw,14.1rem)]">
        {VETRINA_CATALOGO.map((card, indice) => (
          <motion.div
            key={card.t.code}
            data-catalog-motion="card"
            className={`${card.posto} h-full min-w-0`}
            initial={{ opacity: 0, y: 26, scale: 0.985 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.18 }}
            transition={{
              opacity: {
                duration: 0.52,
                delay: Math.min(indice * 0.045, 0.22),
                ease: [0.16, 1, 0.3, 1],
              },
              y: { duration: 0.66, ease: [0.16, 1, 0.3, 1] },
              scale: { duration: 0.66, ease: [0.16, 1, 0.3, 1] },
            }}
          >
            <ProductCard
              card={card}
              onApri={() => setScheda({ t: card.t, tema: card.tema })}
            />
          </motion.div>
        ))}
      </div>

      <LayoutGroup>
        <div id="altre-tipologie">
          <AnimatePresence initial={false}>
            {coda && (
              <motion.div
                key="altre-tipologie"
                data-catalog-motion="tail"
                initial={
                  riduciMovimento
                    ? false
                    : { opacity: 0, y: 22, scale: 0.99 }
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
                  onApri={(t) => setScheda({ t, tema: "sabbia" })}
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
            aperto={coda}
            onToggle={() => setCoda((v) => !v)}
            controlla="altre-tipologie"
          />
        </motion.div>
      </LayoutGroup>

      <ProductQuickView
        aperto={scheda?.t ?? null}
        tema={scheda?.tema}
        onChiudi={() => setScheda(null)}
      />
    </MotionConfig>
  );
}
