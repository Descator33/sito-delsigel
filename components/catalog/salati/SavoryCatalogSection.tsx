import { SavoryBentoGrid } from "./SavoryBentoGrid";
import { SavoryCatalogHeading } from "./SavoryCatalogHeading";

/**
 * «I nostri salati», secondo capitolo della gamma prodotti.
 *
 * Riprende struttura, tipografia e interazione del capitolo dolce: heading
 * editoriale, tre card di vetrina e coda espandibile sotto una CTA a pillola.
 * Server Component: lo stato resta confinato nella griglia client.
 */

const TITOLO_ID = "salati-titolo";

export function SavoryCatalogSection() {
  return (
    <section
      id="salati"
      aria-labelledby={TITOLO_ID}
      className="font-testo scroll-mt-24 bg-panna text-inchiostro"
    >
      <div className="mx-auto max-w-[1800px] px-6 pb-16 pt-14 md:px-12 md:pb-24 md:pt-20">
        <SavoryCatalogHeading titoloId={TITOLO_ID} />
        <SavoryBentoGrid />
      </div>
    </section>
  );
}
