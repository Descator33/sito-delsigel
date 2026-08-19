import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SmoothScroll } from "@/components/SmoothScroll";
import { CatalogPageIntro } from "@/components/catalog/CatalogPageIntro";
import { CatalogSection } from "@/components/catalog/CatalogSection";
import { SavoryCatalogSection } from "@/components/catalog/salati/SavoryCatalogSection";

export const metadata: Metadata = {
  title: "Catalogo · Delsigel Italia",
  description:
    "Tutta la gamma Delsigel: i dolci del catalogo 2026/27 e la linea salata. Tipologie, varianti e schede prodotto.",
};

/**
 * Catalogo — la pagina della gamma (refactor architettura 2026-08-12).
 *
 * Le due sezioni arrivano dalla homepage così com'erano: la griglia bento
 * dei dolci (con la scheda rapida) e il quadro della linea salata. La
 * home ora racconta, questa pagina fa consultare: intro minima, poi i
 * prodotti — la transizione dolci→salati resta quella dei componenti
 * (panna→fucsia), che qui basta e avanza.
 *
 * La rotta tiene i metadati e il guscio condiviso (nav flottante, smooth
 * scroll, chiusura), come chi-siamo e contatti: il root layout non li
 * monta. `Header` senza `fondo`: il default "chiaro" è per il panna.
 */
export default function CatalogoPage() {
  return (
    <div className="bg-panna text-inchiostro">
      <SmoothScroll />
      <Header />
      <CatalogPageIntro />
      <CatalogSection />
      <SavoryCatalogSection />
      <Footer />
    </div>
  );
}
