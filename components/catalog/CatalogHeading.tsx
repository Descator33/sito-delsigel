import { TOTALE_TIPOLOGIE, TOTALE_VARIANTI } from "@/lib/catalog-bento";

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
 * Resta un Server Component. I tre wrapper dichiarano alla scena della Home
 * quali blocchi rivelare; fuori da quella scena sono normali elementi statici.
 */
export function CatalogHeading() {
  return (
    <header>
      <div className="grid gap-x-8 gap-y-7 xl:grid-cols-[minmax(0,6fr)_minmax(180px,2fr)_minmax(240px,3fr)] xl:items-end xl:gap-y-0">
        <div>
          <div data-home-caption-mask className="overflow-hidden">
            <p
              data-home-caption="eyebrow"
              className="font-tecnico text-[10px] font-semibold uppercase tracking-[0.22em] text-fucsia"
            >
              Catalogo 2026/27
            </p>
          </div>
          <h2 className="font-insegna mt-4 text-[clamp(3rem,7vw,8.6rem)] font-extrabold uppercase leading-[0.82] tracking-[-0.055em]">
            <span
              data-home-caption-mask
              className="block overflow-hidden pb-[0.06em]"
            >
              <span data-home-caption="title" className="block">
                I nostri <span className="text-fucsia">dolci.</span>
              </span>
            </span>
          </h2>
        </div>

        <div data-home-caption-mask className="overflow-hidden">
          <p
            data-home-caption="copy"
            className="max-w-[34ch] text-[0.82rem] leading-[1.6] text-inchiostro/85 xl:max-w-[15rem]"
          >
            Ricette semplici, ingredienti selezionati e tanta passione. Ogni
            giorno, dolci buoni per davvero.
          </p>
        </div>

        <div className="xl:justify-self-end">
          <div
            aria-hidden
            className="h-px w-full max-w-[16rem] bg-inchiostro/85 xl:ml-auto"
          />
          <div data-home-caption-mask className="mt-4 overflow-hidden">
            <p
              data-home-caption="copy"
              className="font-tecnico text-[11px] font-semibold uppercase tracking-[0.16em] xl:text-right"
            >
              {TOTALE_TIPOLOGIE} tipologie
              <span className="mx-2.5 text-inchiostro/35">/</span>
              {TOTALE_VARIANTI} varianti
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
