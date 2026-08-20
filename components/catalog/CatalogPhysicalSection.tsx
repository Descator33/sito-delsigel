import { CatalogCarousel } from "./CatalogCarousel";
import { CatalogPhysicalIntro } from "./CatalogPhysicalIntro";

/**
 * Il catalogo stampato 2026/2027 — il secondo capitolo della home, subito
 * dopo la hero (refactor architettura 2026-08-12: la griglia dei dolci e
 * la linea salata sono uscite dalla home e vivono su /catalogo).
 *
 * È l'unica sezione della home tagliata in due campiture piene che vanno
 * da bordo a bordo: blush a sinistra (44%), tortora a destra (56%).
 * L'arrivo dalla hero non è uno stacco netto: il primo scatto della
 * galleria entra in campo già durante l'uscita della hero (vedi
 * components/home/AperturaEditoriale) e qui "trova il suo posto" come
 * pagina attiva del carosello.
 *
 * Rev 05/08 — la fascia fucsia a tutta larghezza apre la sezione, sotto
 * il crema vira al rosato. A destra il tortora: era l'unico fondo che non
 * litigava con gli scatti (campiture gialle, rosse e arancioni).
 *
 * Sotto lg le due campiture si impilano nell'ordine di lettura: prima il
 * testo, poi la galleria. La fascia resta in cima a ogni misura.
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
      <FasciaStacco />

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

/**
 * Il taglio fra i due capitoli della pagina: una riga fucsia piena, alta
 * quanto una fascia di testata, con l'ombra corta che le tiene sotto il
 * bordo della sezione chiara precedente. Non è decorazione — è il segnale
 * che qui comincia un'altra cosa.
 *
 * Il testo è marcato `aria-hidden`: dice quello che il titolo qui sotto
 * dice già, e ripeterlo agli screen reader sarebbe solo rumore.
 */
function FasciaStacco() {
  return (
    <div className="flex h-[clamp(2.5rem,3.2vw,3.5rem)] items-center justify-center overflow-hidden bg-fucsia px-4 shadow-[0_8px_30px_rgb(27_16_10_/_0.08)]">
      <p
        aria-hidden
        className="font-tecnico whitespace-nowrap text-[9px] font-semibold uppercase tracking-[0.26em] text-white sm:text-[10px] sm:tracking-[0.42em]"
      >
        Delsigel <Punto /> Sweet Jewels <Punto /> Catalogo 2026/27
      </p>
    </div>
  );
}

const Punto = () => <span className="mx-2 text-white/60 sm:mx-3">•</span>;
