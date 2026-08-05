"use client";

import { MotionConfig } from "motion/react";
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
 * `MotionConfig reducedMotion="user"` vale per tutte le card in un colpo:
 * chi ha chiesto meno movimento vede i colori e le foto, non i salti.
 */
export function ProductBentoGrid() {
  const [scheda, setScheda] = useState<{ t: Tipologia; tema: TemaCard } | null>(
    null
  );
  const [coda, setCoda] = useState(false);

  return (
    <MotionConfig reducedMotion="user">
      <div
        id="dolci"
        className="mt-8 grid scroll-mt-28 grid-cols-1 gap-[13px] sm:grid-cols-2 xl:mt-9 xl:grid-cols-12 xl:grid-rows-[clamp(8.5rem,11.1vw,12.5rem)_clamp(8.5rem,11.1vw,12.5rem)_clamp(10rem,12.5vw,14.1rem)]"
      >
        {VETRINA_CATALOGO.map((card) => (
          <ProductCard
            key={card.t.code}
            card={card}
            onApri={() => setScheda({ t: card.t, tema: card.tema })}
          />
        ))}
      </div>

      <div id="altre-tipologie">
        {coda && (
          <AltreTipologie
            onApri={(t) => setScheda({ t, tema: "sabbia" })}
          />
        )}
      </div>

      <CatalogFooterCTA
        aperto={coda}
        onToggle={() => setCoda((v) => !v)}
        controlla="altre-tipologie"
      />

      <ProductQuickView
        aperto={scheda?.t ?? null}
        tema={scheda?.tema}
        onChiudi={() => setScheda(null)}
      />
    </MotionConfig>
  );
}
