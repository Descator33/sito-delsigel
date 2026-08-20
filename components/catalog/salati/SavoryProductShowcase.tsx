"use client";

import { useState } from "react";
import { MotionConfig } from "motion/react";
import type { Tipologia } from "@/lib/catalog";
import { VETRINA_SALATI } from "@/lib/catalog-salati";
import { useCarosello } from "@/lib/useCarosello";
import { ProductQuickView } from "@/components/catalog/ProductQuickView";
import { CarouselArrows } from "./CarouselArrows";
import { CarouselPagination } from "./CarouselPagination";
import { DecorativeDoodles } from "./DecorativeDoodles";
import { SavoryProductsCarousel } from "./SavoryProductsCarousel";

/**
 * La metà crema del quadro: la vetrina della linea salata.
 *
 * È l'unico Client Component strutturale della sezione — copertina e
 * involucro restano sul server — e possiede le due cose che hanno stato:
 * la posizione del carosello (dal gancio, che la tiene separata dalla
 * grafica) e quale scheda prodotto è aperta.
 *
 * La scheda è la stessa delle card dei dolci (`ProductQuickView`): finché
 * i salati stavano nella coda della griglia era da lì che si aprivano, e
 * spostare la linea non doveva far perdere formato, peso e gamma. Il tema
 * è `sabbia` e non `arancio` perché la scheda ha già la sua campitura
 * dietro alla foto: sul mandarino i salati — che sono dorati e rossi —
 * smetterebbero di staccare.
 *
 * Nessun autoplay, per scelta: la fila si muove solo quando la si muove.
 *
 * `MotionConfig reducedMotion="user"` vale per tutti i prodotti in un
 * colpo: chi ha chiesto meno movimento vede le foto, non i salti.
 */

export function SavoryProductShowcase() {
  const { carosello, attivo, scatti, puoiPrima, puoiDopo, prima, dopo, vaiA } =
    useCarosello();
  const [scheda, setScheda] = useState<Tipologia | null>(null);

  return (
    <MotionConfig reducedMotion="user">
      <div className="relative flex h-full min-w-0 flex-col justify-center px-[clamp(1.25rem,2.2vw,2.5rem)] py-[clamp(2.5rem,3.6vw,3.5rem)]">
        {/* la corsia delle frecce: da md in su la fila si stringe di
            quanto basta a farle stare fuori dagli ovali */}
        <div className="relative md:px-[3.25rem]">
          <SavoryProductsCarousel
            carosello={carosello}
            voci={VETRINA_SALATI}
            onApri={setScheda}
          />
          <CarouselArrows
            puoiPrima={puoiPrima}
            puoiDopo={puoiDopo}
            prima={prima}
            dopo={dopo}
          />
        </div>

        <CarouselPagination scatti={scatti} attivo={attivo} vaiA={vaiA} />

        {/* Il conto visibile è nei pallini, che sono decorativi per chi
            legge con lo schermo: questo è l'unico modo di sapere dove si è
            arrivati usando le frecce da tastiera. */}
        <p className="sr-only" aria-live="polite">
          Gruppo {attivo + 1} di {scatti}
        </p>

        <DecorativeDoodles zona="vetrina" />
      </div>

      <ProductQuickView
        aperto={scheda}
        tema="sabbia"
        onChiudi={() => setScheda(null)}
      />
    </MotionConfig>
  );
}
