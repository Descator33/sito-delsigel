"use client";

import {
  AnimatePresence,
  LayoutGroup,
  MotionConfig,
  motion,
  useReducedMotion,
} from "motion/react";
import { useEffect, useState } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Tipologia } from "@/lib/catalog";
import type { TemaCard } from "@/lib/catalog-bento";
import {
  RESTO_SALATI,
  VETRINA_SALATI_BENTO,
} from "@/lib/catalog-salati-bento";
import { AltreTipologie } from "@/components/catalog/AltreTipologie";
import { CatalogFooterCTA } from "@/components/catalog/CatalogFooterCTA";
import { ProductCard } from "@/components/catalog/ProductCard";
import { ProductQuickView } from "@/components/catalog/ProductQuickView";
import { useTesti } from "@/components/LinguaProvider";

type SchedaSalata = { t: Tipologia; tema: TemaCard };

const LATI_INGRESSO = ["left", "right", "right"] as const;
const ID_CODA = "altri-salati";

/**
 * La stessa composizione dei dolci, ridotta alle tre card di vetrina.
 * La coda mantiene lo stesso modello di tessera, transizione e quick view.
 */
export function SavoryBentoGrid() {
  const testi = useTesti();
  const [scheda, setScheda] = useState<SchedaSalata | null>(null);
  const [coda, setCoda] = useState(false);
  const riduciMovimento = useReducedMotion();

  /* Aprire o chiudere la coda sposta tutto ciò che sta sotto — e sotto
     ci sono le quinte in scrub del ponte e del teaser, che vanno
     rimisurate come fa già la scena Storia → Dolci. Il secondo refresh
     copre la chiusura: la coda lascia il DOM solo a transizione finita
     (0.5s), e misurare al primo frame terrebbe l'altezza vecchia. */
  useEffect(() => {
    const frame = requestAnimationFrame(() => ScrollTrigger.refresh());
    const timer = window.setTimeout(() => ScrollTrigger.refresh(), 620);
    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(timer);
    };
  }, [coda]);

  return (
    <MotionConfig reducedMotion="user">
      <div className="mt-8 grid grid-cols-1 gap-[13px] sm:grid-cols-2 xl:mt-9 xl:grid-cols-12 xl:grid-rows-[clamp(8.5rem,11.1vw,12.5rem)_clamp(8.5rem,11.1vw,12.5rem)]">
        {VETRINA_SALATI_BENTO.map((card, indice) => (
          <motion.div
            key={card.t.code}
            initial={
              riduciMovimento
                ? false
                : {
                    opacity: 0,
                    x: LATI_INGRESSO[indice] === "left" ? -28 : 28,
                    y: 16,
                  }
            }
            whileInView={{ opacity: 1, x: 0, y: 0 }}
            viewport={{ once: true, amount: 0.18 }}
            transition={{
              duration: riduciMovimento ? 0 : 0.62,
              delay: riduciMovimento ? 0 : indice * 0.07,
              ease: [0.16, 1, 0.3, 1],
            }}
            className={`${card.posto} h-full min-w-0`}
          >
            <ProductCard
              card={card}
              onApri={() => setScheda({ t: card.t, tema: card.tema })}
            />
          </motion.div>
        ))}
      </div>

      <LayoutGroup>
        <div id={ID_CODA}>
          <AnimatePresence initial={false}>
            {coda && (
              <motion.div
                key={ID_CODA}
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
                transition={{
                  duration: riduciMovimento ? 0 : 0.5,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <AltreTipologie
                  tipologie={RESTO_SALATI}
                  titolo={testi.catalogo.altriSalati}
                  onApri={(t) => setScheda({ t, tema: "sabbia" })}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <motion.div
          layout
          transition={{
            layout: {
              duration: riduciMovimento ? 0 : 0.48,
              ease: [0.16, 1, 0.3, 1],
            },
          }}
        >
          <CatalogFooterCTA
            aperto={coda}
            onToggle={() => setCoda((stato) => !stato)}
            controlla={ID_CODA}
            etichettaChiusa={testi.catalogo.scopriSalati}
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
