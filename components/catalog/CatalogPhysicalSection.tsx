import { CatalogCarousel } from "./CatalogCarousel";
import { CatalogPhysicalIntro } from "./CatalogPhysicalIntro";

/**
 * Il catalogo stampato 2026/2027, subito sotto la griglia dei dolci.
 *
 * È l'unica sezione della home tagliata in due campiture piene che vanno da
 * bordo a bordo: blush a sinistra (44%), tortora a destra (56%). Lo
 * stacco dalla griglia prodotti — che vive dentro `max-w-[1800px]` — è
 * voluto: lì si guardano i dolci uno a uno, qui si sfoglia un oggetto.
 *
 * Rev 05/08 — la sezione esce dal panna del sito. Prima il fondo era lo
 * stesso della griglia sopra e le due sembravano una cosa sola: adesso
 * apre una fascia fucsia a tutta larghezza, e sotto il crema vira al
 * rosato. A destra il mandarino ha lasciato il posto al tortora: era
 * l'unico fondo che entrava in conflitto con gli scatti — che hanno
 * campiture gialle, rosse e arancioni — invece di farli staccare.
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

      <div className="grid lg:min-h-[clamp(45rem,84vh,53rem)] lg:grid-cols-[44fr_56fr]">
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
