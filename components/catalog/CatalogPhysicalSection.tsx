import { CatalogCarousel } from "./CatalogCarousel";
import { CatalogPhysicalIntro } from "./CatalogPhysicalIntro";

/**
 * Il catalogo stampato 2026/2027, ultimo capitolo editoriale della Home.
 *
 * È tagliata in due campiture piene che vanno da bordo a bordo: blush a
 * sinistra (44%), tortora a destra (56%). Un bordo organico fa salire il
 * blush dal crema del configuratore, senza fascia o separatore rigido.
 *
 * A destra il tortora è l'unico fondo che non
 * litigava con gli scatti (campiture gialle, rosse e arancioni).
 *
 * Sotto lg le due campiture si impilano nell'ordine di lettura: prima il
 * testo, poi la galleria.
 *
 * Server Component: lo stato sta nelle due metà, che sono client.
 */

const TITOLO_ID = "catalogo-fisico-titolo";

export function CatalogPhysicalSection() {
  return (
    <section
      id="catalogo-fisico"
      aria-labelledby={TITOLO_ID}
      className="font-testo scroll-mt-24 bg-blush text-inchiostro"
    >
      <CatalogPhysicalBridge />

      <div
        data-quadro-catalogo
        className="grid lg:min-h-[clamp(45rem,84vh,53rem)] lg:grid-cols-[44fr_56fr]"
      >
        <CatalogPhysicalIntro titoloId={TITOLO_ID} />
        <CatalogCarousel />
      </div>
    </section>
  );
}

function CatalogPhysicalBridge() {
  return (
    <div
      aria-hidden
      className="relative h-[clamp(7rem,15vw,13rem)] overflow-hidden bg-crema"
    >
      <span className="catalog-physical-bridge__surface absolute -bottom-px left-[-5%] h-[88%] w-[110%] bg-blush" />
      <span className="absolute bottom-[8%] right-[8%] h-[clamp(2rem,4vw,4.5rem)] w-[clamp(2rem,4vw,4.5rem)] rotate-12 bg-fucsia" />
    </div>
  );
}
