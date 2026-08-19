"use client";

import { useMediaQuery } from "@/lib/useMediaQuery";
import { HistoryParallaxSection } from "./HistoryParallaxSection";
import { HistoryMobile } from "./HistoryMobile";

/**
 * L'ingresso della sezione «La nostra storia»: sceglie quale delle due
 * esperienze montare.
 *
 * Da 768px in su, e solo se il movimento è gradito, va in scena il palco
 * agganciato con le sei fasce scroll-driven. Sotto quella misura — o con
 * `prefers-reduced-motion` — la storia scorre in colonna: stesso testo,
 * stesse fotografie, niente agganci né parallasse.
 *
 * La scelta passa da `useMediaQuery` (uno `useSyncExternalStore`): al
 * primo render del client il ramo è già quello giusto, senza il
 * fotogramma sbagliato in mezzo.
 */
export function HistoryJourney() {
  const grande = useMediaQuery("(min-width: 768px)");
  const ridotto = useMediaQuery("(prefers-reduced-motion: reduce)");

  if (!grande || ridotto) return <HistoryMobile />;
  return <HistoryParallaxSection />;
}
