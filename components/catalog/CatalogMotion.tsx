"use client";

import { Children, useRef, type ReactNode } from "react";
import {
  motion,
  useScroll,
  useTransform,
  type Variants,
} from "motion/react";

const EASE = [0.16, 1, 0.3, 1] as const;

const ELEMENTO: Variants = {
  nascosta: { y: "115%" },
  visibile: {
    y: "0%",
    transition: { duration: 0.72, ease: EASE },
  },
};

/**
 * Reveal editoriale per gruppi brevi. Ogni figlio conserva la propria
 * semantica; il wrapper aggiunge soltanto il ritmo d'ingresso.
 */
export function CatalogRevealSequence({
  children,
  className = "",
  classiElementi = [],
  alCaricamento = false,
  ritardo = 0,
}: {
  children: ReactNode;
  className?: string;
  classiElementi?: string[];
  alCaricamento?: boolean;
  ritardo?: number;
}) {
  const elementi = Children.toArray(children);
  const sequenza: Variants = {
    nascosta: {},
    visibile: {
      transition: {
        delayChildren: 0.06 + ritardo,
        staggerChildren: 0.075,
      },
    },
  };

  return (
    <motion.div
      className={className}
      variants={sequenza}
      initial="nascosta"
      animate={alCaricamento ? "visibile" : undefined}
      whileInView={alCaricamento ? undefined : "visibile"}
      viewport={{ once: true, amount: 0.24 }}
    >
      {elementi.map((elemento, indice) => (
        <div
          key={indice}
          data-home-caption-mask
          className={`overflow-hidden ${classiElementi[indice] ?? ""}`}
        >
          <motion.div data-catalog-motion="reveal" variants={ELEMENTO}>
            {elemento}
          </motion.div>
        </div>
      ))}
    </motion.div>
  );
}

/** Un ingresso autonomo per le due metà del quadro salato. */
export function CatalogSurfaceReveal({
  children,
  direzione,
  className = "",
  ritardo = 0,
}: {
  children: ReactNode;
  direzione: "sinistra" | "destra";
  className?: string;
  ritardo?: number;
}) {
  const x = direzione === "sinistra" ? -24 : 24;

  return (
    <motion.div
      className={className}
      data-catalog-motion="surface"
      initial={{ x, y: 18 }}
      whileInView={{ x: 0, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 0.78, delay: ritardo, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Il passaggio panna-fucsia prepara il cambio di linguaggio fra gamma
 * dolce e salata. Muove solo transform e si compatta con reduced motion.
 */
export function CatalogFlavorTransition() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 0.58, 1], ["68%", "0%", "0%"]);
  const scaleX = useTransform(scrollYProgress, [0, 0.58, 1], [0.62, 1.04, 1]);
  const scaleY = useTransform(scrollYProgress, [0, 0.58, 1], [0.45, 1.02, 1]);

  return (
    <div
      ref={ref}
      aria-hidden
      data-catalog-motion="flavor-transition"
      className="relative h-[22svh] overflow-hidden bg-panna md:h-[30svh] lg:h-[34svh]"
    >
      <motion.div
        data-catalog-motion="flavor-layer"
        className="absolute -bottom-1 left-[-15%] h-[126%] w-[130%] origin-bottom rounded-t-[50%] bg-fucsia"
        style={{ y, scaleX, scaleY }}
      />
    </div>
  );
}
