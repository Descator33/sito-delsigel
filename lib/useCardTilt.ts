"use client";

import type { RefObject } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { CustomEase } from "gsap/CustomEase";

gsap.registerPlugin(useGSAP, CustomEase);

/* ampiezze piene: la posizione normalizzata va da -0.5 a +0.5 */
const SHIFT = 40; /* ±20px sul wrapper */
const TILT = 28; /* ±14deg sul contenuto */

/**
 * Tilt che insegue il puntatore su ogni card `[data-tilt]` dentro lo scope:
 * il wrapper trasla veloce (0.2s), il contenuto `[data-tilt-inner]` ruota in
 * 3D più lento (0.45s) — è lo sfasamento a dare profondità. Solo desktop
 * (>1024px) e solo senza prefers-reduced-motion.
 */
export function useCardTilt(scope: RefObject<HTMLElement | null>) {
  useGSAP(
    () => {
      if (!CustomEase.get("brand")) {
        CustomEase.create("brand", "0.525, 0, 0, 1");
      }

      const mm = gsap.matchMedia();
      mm.add(
        "(min-width: 1025px) and (prefers-reduced-motion: no-preference)",
        () => {
          const cards = gsap.utils.toArray<HTMLElement>(
            "[data-tilt]",
            scope.current,
          );

          const cleanups = cards.map((card) => {
            const inner = card.querySelector<HTMLElement>("[data-tilt-inner]");
            if (!inner) return () => {};

            gsap.set(inner, {
              transformPerspective: 1000,
              transformStyle: "preserve-3d",
            });

            /* quickTo: un solo tween riusato, mai ricreato nel mousemove */
            const x = gsap.quickTo(card, "x", { duration: 0.2, ease: "brand" });
            const y = gsap.quickTo(card, "y", { duration: 0.2, ease: "brand" });
            const rx = gsap.quickTo(inner, "rotationX", {
              duration: 0.45,
              ease: "brand",
            });
            const ry = gsap.quickTo(inner, "rotationY", {
              duration: 0.45,
              ease: "brand",
            });

            let release: gsap.core.Tween | null = null;
            const setWillChange = (v: string) => {
              card.style.willChange = v;
              inner.style.willChange = v;
            };

            const onEnter = () => {
              release?.kill();
              release = null;
              setWillChange("transform");
            };

            const onMove = (e: MouseEvent) => {
              const r = card.getBoundingClientRect();
              const nx = (e.clientX - r.left) / r.width - 0.5;
              const ny = (e.clientY - r.top) / r.height - 0.5;
              x(nx * SHIFT);
              y(ny * SHIFT);
              ry(nx * TILT);
              rx(-ny * TILT);
            };

            const onLeave = () => {
              x(0);
              y(0);
              rx(0);
              ry(0);
              /* will-change solo durante l'hover: via a rientro concluso */
              release = gsap.delayedCall(0.45, () => setWillChange(""));
            };

            card.addEventListener("mouseenter", onEnter);
            card.addEventListener("mousemove", onMove);
            card.addEventListener("mouseleave", onLeave);
            return () => {
              card.removeEventListener("mouseenter", onEnter);
              card.removeEventListener("mousemove", onMove);
              card.removeEventListener("mouseleave", onLeave);
              release?.kill();
              setWillChange("");
            };
          });

          return () => cleanups.forEach((fn) => fn());
        },
      );
    },
    { scope },
  );
}
