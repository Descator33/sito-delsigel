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
 * Refactor architettura 2026-08-20 (ponte 21/08):
 *
 *   HERO → STORIA BREVE → DOLCI → SALATI → PONTE → CONFIGURATORE → CATALOGO FISICO
 *
 * La storia completa vive su /chi-siamo. Qui resta un invito breve che usa
 * gli stessi dati e asset. Dolci e salati riusano invece lo stesso modello
 * editoriale del catalogo: heading, tre card e coda espandibile.
 *
 * La `lingua` scende come prop nei soli Server Component (le pagine non
 * hanno contesto); l'albero client la legge dal LinguaProvider.
 */

import { SmoothScroll } from "@/components/SmoothScroll";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { CatalogHeading } from "@/components/catalog/CatalogHeading";
import { CatalogPhysicalSection } from "@/components/catalog/CatalogPhysicalSection";
import { ConfiguratorClosingSection } from "@/components/home/ConfiguratorClosingSection";
import { PonteFuturo } from "@/components/home/PonteFuturo";
import { ProductCatalog } from "@/components/home/ProductCatalog";
import { StoryPreview } from "@/components/home/StoryPreview";
import { StorySweetsScene } from "@/components/home/StorySweetsScene";
import type { Lingua } from "@/lib/i18n/lingue";

export default function Experience({ lingua }: { lingua: Lingua }) {
  return (
    <div data-home-experience className="bg-panna text-inchiostro">
      <SmoothScroll />
      <Header fondo="scuro" />

      <main id="contenuto-principale">
        <Hero />
        <StorySweetsScene
          story={<StoryPreview lingua={lingua} />}
          heading={<CatalogHeading lingua={lingua} />}
        />
        <ProductCatalog lingua={lingua} />
        <PonteFuturo />
        <ConfiguratorClosingSection />
        <CatalogPhysicalSection />
      </main>

      <Footer />
    </div>
  );
}
