"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/** Smooth scroll Lenis, unico per tutto il sito (home e sub-page).
 *  Con `prefers-reduced-motion` non si monta nulla: resta lo scroll nativo. */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({ lerp: 0.09 });
    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);
    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);
  return null;
}
