import { MotionConfig } from "motion/react";
import { SavoryCatalogSection } from "@/components/catalog/salati/SavoryCatalogSection";
import { dizionario } from "@/lib/i18n/dizionario";
import type { Lingua } from "@/lib/i18n/lingue";

/** La coda della gamma: il capitolo dolce ora vive nella scena Storia → Dolci. */
export function ProductCatalog({ lingua }: { lingua: Lingua }) {
  return (
    <MotionConfig reducedMotion="user">
      <div
        aria-label={dizionario(lingua).home.gammaAria}
        className="relative bg-panna"
      >
        <SavoryCatalogSection lingua={lingua} />
      </div>
    </MotionConfig>
  );
}
