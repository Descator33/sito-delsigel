import { CatalogHeading } from "./CatalogHeading";
import { ProductBentoGrid } from "./ProductBentoGrid";

/**
 * Il catalogo editoriale, subito sotto la fascia marquee.
 *
 * Redesign 2026-08-04: sostituisce i due caroselli orizzontali su fondo
 * panna e la card ottagonale che si apriva a cerchio. La sezione non è
 * più un rullo ma un impaginato — sette campiture piene, sette misure
 * diverse — e ha una sua direzione tipografica (League Spartan, Inter
 * Tight, IBM Plex Mono; vedi app/fonts.ts) che non tocca il resto del
 * sito, dove comanda Archivo.
 *
 * `font-testo` sta qui, sull'involucro: dentro la sezione il testo di
 * default è Inter Tight, e insegna e tecnico si chiedono per classe.
 * Server Component: solo la griglia, che ha stato, è client.
 */
export function CatalogSection() {
  return (
    <section
      id="catalogo"
      className="font-testo scroll-mt-24 bg-panna text-inchiostro"
    >
      <div className="mx-auto max-w-[1800px] px-6 pb-16 pt-14 md:px-12 md:pb-24 md:pt-20">
        <div id="dolci" className="scroll-mt-24">
          <CatalogHeading />
          <ProductBentoGrid />
        </div>
      </div>
    </section>
  );
}
