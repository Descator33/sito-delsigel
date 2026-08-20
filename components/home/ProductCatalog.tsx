import { MotionConfig } from "motion/react";
import { CatalogSection } from "@/components/catalog/CatalogSection";
import { CatalogFlavorTransition } from "@/components/catalog/CatalogMotion";
import { SavoryCatalogSection } from "@/components/catalog/salati/SavoryCatalogSection";

/** I due capitoli della gamma condividono dati, ritmo e passaggio cromatico. */
export function ProductCatalog() {
  return (
    <MotionConfig reducedMotion="user">
      <div
        aria-label="Catalogo prodotti Delsigel"
        className="relative bg-panna"
      >
        <CatalogSection />
        <CatalogFlavorTransition />
        <SavoryCatalogSection />
      </div>
    </MotionConfig>
  );
}
