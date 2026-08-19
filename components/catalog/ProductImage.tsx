"use client";

import Image from "next/image";
import { motion } from "motion/react";

/**
 * Lo still del prodotto dentro la card. Il riquadro arriva dai dati
 * (`CardCatalogo.foto`) ed è spesso più grande della card: è così che la
 * sagoma esce dai bordi e viene tagliata dall'`overflow: hidden`.
 *
 * `object-contain` e non `cover`: gli still sono scontornati su
 * trasparente, deformarli sarebbe visibile. L'ombra è in `.foto-prodotto`,
 * disegnata in CSS e non incisa nel webp.
 *
 * Le varianti `riposo`/`attiva` non hanno un `whileHover` proprio: le
 * eredita dalla card, che è l'unica a decidere quando si è sopra.
 */
export function ProductImage({
  src,
  alt,
  riquadro,
}: {
  src: string;
  alt: string;
  riquadro: string;
}) {
  return (
    <motion.div
      className={`foto-prodotto pointer-events-none absolute ${riquadro}`}
      style={{ transformOrigin: "72% 100%" }}
      variants={{
        riposo: { scale: 1, rotate: 0 },
        attiva: { scale: 1.025, rotate: 1 },
      }}
      transition={{ type: "spring", stiffness: 240, damping: 20 }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 640px) 60vw, (max-width: 1279px) 40vw, 28vw"
        className="object-contain object-bottom"
      />
    </motion.div>
  );
}
