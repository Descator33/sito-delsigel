import { MotionConfig } from "motion/react";
import { CatalogFlavorTransition } from "@/components/catalog/CatalogMotion";
import { SavoryCatalogSection } from "@/components/catalog/salati/SavoryCatalogSection";

/** La coda della gamma: il capitolo dolce ora vive nella scena Storia → Dolci. */
export function ProductCatalog() {
  return (
    <MotionConfig reducedMotion="user">
      <div
        aria-label="Catalogo prodotti Delsigel"
        className="relative bg-panna"
      >
        <CatalogFlavorTransition />
        <SavoryCatalogSection />
      </div>
    </MotionConfig>
  );
}
