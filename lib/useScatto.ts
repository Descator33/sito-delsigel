"use client";

import type { RefObject } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { CustomEase } from "gsap/CustomEase";

gsap.registerPlugin(useGSAP, CustomEase);

const DART = 0.2; /* fuga: rapida e decisa */
const RETURN = 1.2; /* rientro: lento */
const MAX_ROT = 14; /* deg */

/**
 * Reazione "schiva" per i pezzi del collage `[data-scatto]` dentro lo scope:
 * appena il cursore li tocca scattano dalla parte opposta ruotando attorno a
 * un pivot fisso — tocco a destra → fuga a sinistra — e quando il cursore li
 * lascia rientrano lentamente nella posizione di partenza. Solo desktop
 * (>1024px) e solo senza prefers-reduced-motion.
 *
 * Fuga e rientro hanno durate diverse, quindi niente quickTo: i tween nascono
 * sugli eventi enter/move/leave (non a ogni frame) con overwrite automatico.
 */
export function useScatto(scope: RefObject<HTMLElement | null>) {
  useGSAP(
    () => {
      if (!CustomEase.get("brand")) {
        CustomEase.create("brand", "0.525, 0, 0, 1");
      }

      const mm = gsap.matchMedia();
      mm.add(
        "(min-width: 1025px) and (prefers-reduced-motion: no-preference)",
        () => {
          const pieces = gsap.utils.toArray<HTMLElement>(
            "[data-scatto]",
            scope.current,
          );

          const cleanups = pieces.map((el) => {
            /* pivot fisso della rotazione; i pezzi molto larghi (i nastri)
               possono attenuarla con data-scatto-rot="<deg>" */
            gsap.set(el, { transformOrigin: "50% 50%" });
            const maxRot = Number(el.dataset.scattoRot) || MAX_ROT;

            const dart = (e: MouseEvent) => {
              const r = el.getBoundingClientRect();
              /* direzione di fuga: dal cursore verso il centro del pezzo */
              let dx = r.left + r.width / 2 - e.clientX;
              let dy = r.top + r.height / 2 - e.clientY;
              const len = Math.hypot(dx, dy) || 1;
              dx /= len;
              dy /= len;
              /* il lato toccato decide il verso della rotazione */
              const nx = (e.clientX - r.left) / r.width - 0.5;
              const dist = gsap.utils.clamp(
                28,
                64,
                Math.min(r.width, r.height) * 0.45,
              );
              el.style.willChange = "transform";
              gsap.to(el, {
                x: dx * dist,
                y: dy * dist,
                rotation: -nx * 2 * maxRot,
                duration: DART,
                ease: "brand",
                overwrite: "auto",
              });
            };

            const back = () => {
              gsap.to(el, {
                x: 0,
                y: 0,
                rotation: 0,
                duration: RETURN,
                ease: "brand",
                overwrite: "auto",
                onComplete: () => {
                  el.style.willChange = "";
                },
              });
            };

            el.addEventListener("mouseenter", dart);
            el.addEventListener("mousemove", dart);
            el.addEventListener("mouseleave", back);
            return () => {
              el.removeEventListener("mouseenter", dart);
              el.removeEventListener("mousemove", dart);
              el.removeEventListener("mouseleave", back);
              el.style.willChange = "";
            };
          });

          return () => cleanups.forEach((fn) => fn());
        },
      );
    },
    { scope },
  );
}
