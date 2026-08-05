"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

/**
 * Line-mask reveal: il contenuto sale da sotto una finestra ritagliata.
 * L'osservazione viewport sta sul wrapper statico (il figlio traslato è
 * clippato dall'overflow e non intersecherebbe mai); `onMount` anima subito.
 */
export function Reveal({
  children,
  delay = 0,
  onMount = false,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  onMount?: boolean;
  className?: string;
}) {
  return (
    <motion.span
      className={`block overflow-hidden ${className}`}
      initial="hidden"
      {...(onMount
        ? { animate: "visible" }
        : { whileInView: "visible", viewport: { once: true, amount: 0.6 } })}
    >
      <motion.span
        className="block"
        variants={{
          hidden: { y: "115%", opacity: 0 },
          visible: { y: "0%", opacity: 1 },
        }}
        transition={{ duration: 0.75, delay, ease: [0.16, 1, 0.3, 1] }}
      >
        {children}
      </motion.span>
    </motion.span>
  );
}
