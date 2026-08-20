"use client";

import Image from "next/image";
import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";

/** Movimento leggero e isolato: rivela il visual e gli dà profondità. */
export function StoryPreviewMedia({ src, alt }: { src: string; alt: string }) {
  const figura = useRef<HTMLElement>(null);
  const riduciMovimento = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: figura,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-3%", "3%"]);

  return (
    <motion.figure
      ref={figura}
      initial={
        riduciMovimento
          ? false
          : { opacity: 0, clipPath: "inset(12% 0 10% 18%)" }
      }
      whileInView={{ opacity: 1, clipPath: "inset(0% 0 0% 0%)" }}
      viewport={{ once: true, amount: 0.18 }}
      transition={
        riduciMovimento
          ? { duration: 0 }
          : { duration: 0.9, ease: [0.16, 1, 0.3, 1] }
      }
      className="absolute inset-y-0 left-0 right-[-6vw] z-[1] overflow-hidden bg-mandarino lg:left-[4%]"
    >
      <motion.div
        className="absolute -inset-y-[4%] inset-x-0"
        style={{ y: riduciMovimento ? 0 : y }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 1023px) 100vw, 58vw"
          className="object-cover object-center"
        />
      </motion.div>
      <span
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(180deg,transparent_55%,rgb(43_29_22_/_0.2)_100%)]"
      />
    </motion.figure>
  );
}
