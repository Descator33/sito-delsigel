"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let istanza: Lenis | null = null;

/**
 * L'istanza viva dello smooth scroll, per chi deve pilotarlo invece di
 * subirlo. Serve alla scena della storia (ora in home): Lenis riscrive la
 * posizione a ogni frame, quindi uno `scrollTo` programmato va chiesto a
 * lui — altrimenti se lo riprende indietro. `null` quando lo scroll
 * morbido non è montato (reduced motion): in quel caso vale il nativo.
 */
export function lenisAttivo() {
  return istanza;
}

/** Smooth scroll Lenis, unico per tutto il sito (home e sub-page).
 *  Con `prefers-reduced-motion` non si monta nulla: resta lo scroll nativo.
 *
 *  Rev refactor home — il ponte con ScrollTrigger. Da quando la regia
 *  della home è scroll-driven (apertura, stacchi, teaser) i trigger non
 *  possono più affidarsi al solo evento nativo: Lenis interpola la
 *  posizione per qualche frame DOPO l'ultimo evento, e uno scrub non
 *  aggiornato in quei frame si vede come un trascinamento in ritardo.
 *  `lenis.on("scroll", ScrollTrigger.update)` fa battere i trigger a
 *  ogni frame interpolato. Il resto non cambia: il rAF resta di Lenis. */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({ lerp: 0.09 });
    istanza = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);
    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      if (istanza === lenis) istanza = null;
    };
  }, []);
  return null;
}
