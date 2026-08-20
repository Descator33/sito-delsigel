"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

/**
 * La sosta del catalogo (rev 20/08).
 *
 * Prima il catalogo stampato passava e basta: chi scorreva di slancio
 * dall'apertura si ritrovava dentro il film della storia senza aver
 * guardato una sola fotografia. Qui la scena si ferma un attimo — la
 * pagina continua a scorrere, il quadro no — e solo dopo lascia entrare
 * la storia.
 *
 * È l'unico punto della home dove serve un `pin` vero e non una quinta
 * `sticky` come altrove: la sezione del catalogo è un Server Component
 * riusabile e non va incartata in un involucro alto solo per la home.
 * Il pin lavora da fuori, senza toccare il markup della sezione.
 *
 * Due regolazioni importanti:
 *
 *   `start` è una funzione perché il fermo-immagine deve mostrare le
 *   FOTO. Quando la sezione sta nel viewport (desktop, due campiture
 *   affiancate) si blocca con il bordo alto allineato; quando è più alta
 *   dello schermo — sotto lg le campiture si impilano e la galleria
 *   finisce in fondo — si blocca sul bordo basso, che è dove stanno gli
 *   scatti. Bloccarla in cima lì significherebbe tenere ferma la colonna
 *   di testo.
 *
 *   `refreshPriority` più alto della guida di scroll: la sosta allunga la
 *   pagina, e le tacche del rail (components/home/HomeScrollGuide) vanno
 *   misurate DOPO che lo spazio del pin è stato aggiunto, altrimenti il
 *   capitolo "Storia" resterebbe segnato dov'era prima.
 *
 * Con `prefers-reduced-motion` non si monta niente: la home torna a
 * scorrere liscia, come tutte le altre scene.
 */

/** quanto dura il fermo, in frazione di viewport. Sul touch è più corta:
 *  lo scroll a strappi rende ogni fermo più lungo di quanto misuri. */
const CORSA_SOSTA = { puntatore: 0.7, dito: 0.45 } as const;

export function SostaCatalogo() {
  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger);

    const sezione = document.getElementById("catalogo-fisico");
    if (!sezione) return;

    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const dito = window.matchMedia("(pointer: coarse)").matches;
      const corsa = dito ? CORSA_SOSTA.dito : CORSA_SOSTA.puntatore;

      const sosta = ScrollTrigger.create({
        trigger: sezione,
        /* più alta dello schermo → si ferma sul bordo basso (le foto),
           altrimenti sul bordo alto (la sezione intera) */
        start: () =>
          sezione.offsetHeight > window.innerHeight ? "bottom bottom" : "top top",
        end: () => `+=${Math.round(window.innerHeight * corsa)}`,
        pin: true,
        pinSpacing: true,
        /* Lenis interpola: senza anticipo il pin scatta un frame tardi e
           si vede come un sussulto del quadro */
        anticipatePin: 0.5,
        invalidateOnRefresh: true,
        refreshPriority: 1,
      });

      return () => sosta.kill();
    });

    return () => mm.revert();
  }, []);

  return null;
}
