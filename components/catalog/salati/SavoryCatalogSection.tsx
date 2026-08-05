import { SavoryEditorialPanel } from "./SavoryEditorialPanel";
import { SavoryProductShowcase } from "./SavoryProductShowcase";

/**
 * «I nostri salati» — la sezione della linea salata, subito dopo il
 * catalogo stampato 2026/2027.
 *
 * È il terzo capitolo della home e deve staccarsi dal secondo senza
 * uscire dal linguaggio del sito: il catalogo stampato è due campiture
 * piene che vanno da bordo a bordo, questo è un quadro solo — chiuso da
 * un filo crema, angoli larghi — che torna dentro il container. Il
 * fondo su cui il quadro è appoggiato esce dal panna della pagina (rev
 * 2026-08-05): è lo stesso fucsia con cui è scritto «2026/2027» nel
 * catalogo stampato, così i due capitoli si rispondono e la card
 * chiara stacca invece di sciogliersi nella pagina. Il taglio interno
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
          <SavoryEditorialPanel titoloId={TITOLO_ID} />
          <SavoryProductShowcase />
        </div>
      </div>
    </section>
  );
}
