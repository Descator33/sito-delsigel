"use client";

/**
 * Lo stato di un carosello Embla, staccato dalla sua presentazione.
 *
 * Frecce, pagination e vetrina hanno bisogno delle stesse quattro cose —
 * quale scatto è selezionato, quanti ne esistono, se si può andare avanti,
 * se si può tornare indietro — e nessuna di queste è una decisione grafica.
 * Sta qui perché il componente della vetrina resti impaginazione e nient'altro.
 *
 * `scatti` NON è il numero dei prodotti: con `containScroll: "trimSnaps"`
 * Embla toglie le posizioni che sfonderebbero il fondo del binario, quindi
 * gli scatti sono quanti gruppi si possono davvero mostrare — ed è quello
 * che i pallini devono contare. Si aggiorna anche a `reInit`, cioè a ogni
 * ridimensionamento: cambiando larghezza cambiano i prodotti in campo e con
 * loro il numero di pallini.
 */

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import type { EmblaOptionsType } from "embla-carousel";

export function useCarosello(opzioni: EmblaOptionsType = {}) {
  const [carosello, api] = useEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps",
    dragFree: false,
    loop: false,
    ...opzioni,
  });

  const [attivo, setAttivo] = useState(0);
  const [scatti, setScatti] = useState(0);
  const [puoiPrima, setPuoiPrima] = useState(false);
  const [puoiDopo, setPuoiDopo] = useState(false);

  useEffect(() => {
    if (!api) return;
    const leggi = () => {
      setAttivo(api.selectedScrollSnap());
      setScatti(api.scrollSnapList().length);
      setPuoiPrima(api.canScrollPrev());
      setPuoiDopo(api.canScrollNext());
    };
    leggi();
    api.on("select", leggi).on("reInit", leggi);
    return () => {
      api.off("select", leggi).off("reInit", leggi);
    };
  }, [api]);

  const prima = useCallback(() => api?.scrollPrev(), [api]);
  const dopo = useCallback(() => api?.scrollNext(), [api]);
  const vaiA = useCallback((i: number) => api?.scrollTo(i), [api]);

  return { carosello, api, attivo, scatti, puoiPrima, puoiDopo, prima, dopo, vaiA };
}
