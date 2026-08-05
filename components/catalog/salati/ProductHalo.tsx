"use client";

import { motion } from "motion/react";

/**
 * L'ovale che tiene il prodotto, più l'ombra su cui appoggia.
 *
 * Sono due segni soli: un filo mandarino molto smorzato e una macchia
 * ellittica sfumata sotto il dolce. Non è una card — niente fondo, niente
 * riquadro, niente ombra portata dal contenitore: nel riferimento il
 * prodotto galleggia dentro l'ovale, e appena si aggiunge una campitura
 * l'effetto sparisce.
 *
 * L'ovale è un `border-radius: 50%` e non un `<ellipse>`: così segue da
 * solo le proporzioni del contenitore a ogni misura, senza un viewBox da
 * tenere in accordo con il clamp della larghezza.
 *
 * Ruota di un grado e mezzo quando l'elemento è in evidenza. La rotazione
 * arriva per varianti dal padre (`riposo` / `attiva`), quindi qui non c'è
 * nessuno stato: `MotionConfig reducedMotion="user"`, più in alto, la
 * spegne per chi ha chiesto meno movimento.
 */

const GIRO = {
  riposo: { rotate: 0 },
  attiva: { rotate: -1.5 },
};

export function ProductHalo() {
  return (
    <>
      <motion.span
        aria-hidden
        variants={GIRO}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="salati-anello absolute inset-0"
      />
      <span
        aria-hidden
        className="salati-ombra absolute bottom-[16%] left-1/2 h-[7%] w-[62%] -translate-x-1/2 rounded-[50%]"
      />
    </>
  );
}
