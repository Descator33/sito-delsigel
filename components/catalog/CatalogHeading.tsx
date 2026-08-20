import { TOTALE_TIPOLOGIE, TOTALE_VARIANTI } from "@/lib/catalog-bento";
import { CatalogRevealSequence } from "./CatalogMotion";

/**
 * L'intestazione del catalogo: tre aree appoggiate alla stessa linea di
 * base — insegna, promessa, conto. Da xl in giù la griglia collassa e le
 * tre aree si impilano nell'ordine di lettura.
 *
 * Il conto («9 tipologie / 30 varianti») non è scritto: lo conta il
 * catalogo. Dal 05/08 conta i soli dolci — le linee erano due finché la
 * salata stava qui dentro, adesso ha una sezione sua e al suo posto il
 * secondo numero dice la gamma.
 *
 * Resta un Server Component: il piccolo wrapper client orchestra soltanto
 * l'ingresso delle tre aree quando l'intestazione arriva in viewport.
 */
export function CatalogHeading() {
  return (
    <header>
      <CatalogRevealSequence
        className="grid gap-x-8 gap-y-7 xl:grid-cols-[minmax(0,6fr)_minmax(180px,2fr)_minmax(240px,3fr)] xl:items-end xl:gap-y-0"
        classiElementi={["", "", "xl:justify-self-end"]}
      >
        <div>
          <p className="font-tecnico text-[10px] font-semibold uppercase tracking-[0.22em] text-fucsia">
            Catalogo 2026/27
          </p>
          <h2 className="font-insegna mt-4 text-[clamp(3rem,7vw,8.6rem)] font-extrabold uppercase leading-[0.82] tracking-[-0.055em]">
            I nostri <span className="text-fucsia">dolci.</span>
          </h2>
        </div>

        <p className="max-w-[34ch] text-[0.82rem] leading-[1.6] text-inchiostro/85 xl:max-w-[15rem]">
          Ricette semplici, ingredienti selezionati e tanta passione. Ogni
          giorno, dolci buoni per davvero.
        </p>

        <div>
          <div
            aria-hidden
            className="h-px w-full max-w-[16rem] bg-inchiostro/85 xl:ml-auto"
          />
          <p className="font-tecnico mt-4 text-[11px] font-semibold uppercase tracking-[0.16em] xl:text-right">
            {TOTALE_TIPOLOGIE} tipologie
            <span className="mx-2.5 text-inchiostro/35">/</span>
            {TOTALE_VARIANTI} varianti
          </p>
        </div>
      </CatalogRevealSequence>
    </header>
  );
}
