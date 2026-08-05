/**
 * Homepage: hero fotografico a tutto schermo, poi marquee e catalogo.
 *
 * Rev 27/07 — rimosso il film scroll-driven "La Caduta": niente canvas, niente
 * sequenza di 361 frame, niente card volante che atterrava nel primo slot del
 * catalogo. Il Golosone vive nella sua card come tutte le altre tipologie.
 *
 * Rev 05/08 — rimossa anche la porta d'ingresso: niente contatore 000→100,
 * niente montaggio d'apertura, niente CTA "Take yours". Il sito parte dritto
 * dalla hero, senza pedaggi: nessuno stato da commutare, nessuno scroll da
 * bloccare e rilasciare. Resta il solo smooth scroll Lenis, che ora arriva da
 * `SmoothScroll` come nelle altre pagine.
 *
 * Senza la porta qui non c'è più nulla di client: il file torna Server
 * Component. `catalogo` e `chiusura` restano props — impaginarli in
 * app/page.tsx tiene la chiusura vicina alle foto che legge dal filesystem.
 */

import { type ReactNode } from "react";
import { SmoothScroll } from "@/components/SmoothScroll";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Marquee } from "@/components/Marquee";
import { Footer } from "@/components/Footer";

export default function Experience({
  catalogo,
  chiusura,
}: {
  catalogo: ReactNode;
  /** «Crea da solo il tuo dolce custom»: arriva da app/page.tsx perché
   *  legge le foto dal filesystem e deve restare un Server Component */
  chiusura: ReactNode;
}) {
  return (
    <div className="bg-panna text-inchiostro">
      <SmoothScroll />

      <Header />

      {/* ------------------------------ HERO ------------------------------ */}
      <Hero />

      {/* ----------------------------- MARQUEE ----------------------------- */}
      <Marquee />

      {/* --------------------------- CATALOGO ---------------------------- */}
      {catalogo}

      {/* --------------------------- CHIUSURA ---------------------------- */}
      {chiusura}
      <Footer />
    </div>
  );
}
