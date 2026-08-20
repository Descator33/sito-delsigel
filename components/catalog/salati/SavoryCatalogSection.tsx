import { SavoryEditorialPanel } from "./SavoryEditorialPanel";
import { SavoryProductShowcase } from "./SavoryProductShowcase";
import { CatalogSurfaceReveal } from "@/components/catalog/CatalogMotion";

/**
 * «I nostri salati», secondo capitolo della gamma prodotti.
 *
 * Si stacca dai dolci senza uscire dal linguaggio del sito: è un quadro
 * unico, chiuso da un filo crema e appoggiato su una campitura fucsia.
 * Il taglio interno
 * è quello del riferimento: copertina mandarino a sinistra (31%),
 * vetrina crema a destra (69%), niente cesura in mezzo.
 *
 * Sotto lg le due metà si impilano nell'ordine di lettura — prima la
 * copertina, poi i prodotti — che è l'unico modo di non comprimere né il
 * titolo né la fila.
 *
 * Server Component: lo stato vive nella vetrina, che è client.
 */

const TITOLO_ID = "salati-titolo";

export function SavoryCatalogSection() {
  return (
    <section
      id="salati"
      aria-labelledby={TITOLO_ID}
      className="font-testo-salati scroll-mt-24 bg-fucsia text-cacao"
    >
      <div className="mx-auto max-w-[1800px] px-6 py-14 md:px-12 md:py-20">
        {/* `minmax(0, …)` su tutte e due le tracce: senza il minimo a zero
            la colonna prende come misura minima il contenuto (il binario
            del carosello, che è lungo quanto tutti i prodotti in fila) e
            sfonda il quadro. Vale anche per la colonna singola sotto lg. */}
        <div className="salati-quadro grid grid-cols-[minmax(0,1fr)] lg:min-h-[clamp(33rem,40vw,38.75rem)] lg:grid-cols-[minmax(0,31fr)_minmax(0,69fr)]">
          <CatalogSurfaceReveal
            direzione="sinistra"
            className="relative z-[1] min-w-0 lg:h-full"
          >
            <SavoryEditorialPanel titoloId={TITOLO_ID} />
          </CatalogSurfaceReveal>
          <CatalogSurfaceReveal
            direzione="destra"
            ritardo={0.08}
            className="min-w-0 lg:h-full"
          >
            <SavoryProductShowcase />
          </CatalogSurfaceReveal>
        </div>
      </div>
    </section>
  );
}
