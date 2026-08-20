/**
 * Homepage: un'esperienza continua, non una fila di sezioni.
 *
 * Rev 27/07 — rimosso il film scroll-driven "La Caduta": niente canvas, niente
 * sequenza di 361 frame, niente card volante che atterrava nel primo slot del
 * catalogo. Il Golosone vive nella sua card come tutte le altre tipologie.
 *
 * Rev 05/08 — rimossa anche la porta d'ingresso: niente contatore 000→100,
 * niente montaggio d'apertura, niente CTA "Take yours". Il sito parte dritto
 * dalla hero, senza pedaggi.
 *
 * Rev 12/08 — refactor della hero: fotografia pulita, insegna di quattro
 * righe costruita in HTML e nessuna fascia sotto.
 *
 * Refactor architettura 2026-08-20:
 *
 *   HERO → STORIA BREVE → DOLCI → SALATI → CONFIGURATORE → CATALOGO FISICO
 *
 * La storia completa vive su /chi-siamo. Qui resta un invito breve che usa
 * gli stessi dati e asset. Dolci e salati riusano invece i componenti del
 * catalogo, compresa la transizione cromatica che li lega.
 */

import { SmoothScroll } from "@/components/SmoothScroll";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { CatalogHeading } from "@/components/catalog/CatalogHeading";
import { CatalogPhysicalSection } from "@/components/catalog/CatalogPhysicalSection";
import { ConfiguratorClosingSection } from "@/components/home/ConfiguratorClosingSection";
import { ProductCatalog } from "@/components/home/ProductCatalog";
import { StoryPreview } from "@/components/home/StoryPreview";
import { StorySweetsScene } from "@/components/home/StorySweetsScene";

export default function Experience() {
  return (
    <div data-home-experience className="bg-panna text-inchiostro">
      <SmoothScroll />
      <Header fondo="scuro" />

      <main id="contenuto-principale">
        <Hero />
        <StorySweetsScene
          story={<StoryPreview />}
          heading={<CatalogHeading />}
        />
        <ProductCatalog />
        <ConfiguratorClosingSection />
        <CatalogPhysicalSection />
      </main>

      <Footer />
    </div>
  );
}
