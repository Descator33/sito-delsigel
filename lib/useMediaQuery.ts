"use client";

import { useSyncExternalStore } from "react";

/**
 * Media query come sorgente esterna, non come stato in un effetto: così
 * il valore è già giusto al primo render del client e non c'è il frame
 * intermedio in cui la UI sceglie il ramo sbagliato.
 *
 * Sul server risponde sempre `false` — il mobile-first è l'ipotesi meno
 * costosa se sbagliata — ma nel catalogo non si vede: la scheda prodotto
 * nasce chiusa e si monta solo dopo un click, quando il client comanda.
 */
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (notifica) => {
      const mq = window.matchMedia(query);
      mq.addEventListener("change", notifica);
      return () => mq.removeEventListener("change", notifica);
    },
    () => window.matchMedia(query).matches,
    () => false
  );
}
