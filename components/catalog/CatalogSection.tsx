import { CatalogHeading } from "./CatalogHeading";
import { ProductBentoGrid } from "./ProductBentoGrid";
import type { Lingua } from "@/lib/i18n/lingue";

/**
 * Il capitolo dolce del catalogo editoriale.
 *
 * Redesign 2026-08-04: sostituisce i due caroselli orizzontali su fondo
 * panna e la card ottagonale che si apriva a cerchio. La sezione non è
 * più un rullo ma un impaginato — dal 21/08 tre campiture piene in una
 * riga sola — e ha una sua direzione tipografica (League Spartan, Inter
 * Tight, IBM Plex Mono — dal 2026-09-09 tutte ricondotte ad Archivo e
 * Space Mono, vedi gli alias in globals.css) che non tocca il resto del
 * sito, dove comanda Archivo.
 *
 * `font-testo` sta qui, sull'involucro: dentro la sezione il testo di
 * default è Archivo, e insegna e tecnico si chiedono per classe.
 * Server Component: solo la griglia, che ha stato, è client.
 */
export function CatalogSection({ lingua }: { lingua: Lingua }) {
  return (
    <section
      id="catalogo"
      className="font-testo scroll-mt-24 bg-panna text-inchiostro"
    >
      <div className="mx-auto max-w-[1800px] px-6 pb-16 pt-14 md:px-12 md:pb-24 md:pt-20">
        <div id="dolci" className="scroll-mt-24">
          <CatalogHeading lingua={lingua} />
          <ProductBentoGrid />
        </div>
      </div>
    </section>
  );
}
