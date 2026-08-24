import {
  TOTALE_SALATI,
  TOTALE_VARIANTI_SALATE,
} from "@/lib/catalog-salati-bento";
import { dizionario } from "@/lib/i18n/dizionario";
import { interpola } from "@/lib/i18n/interpola";
import { fmtNumero, type Lingua } from "@/lib/i18n/lingue";

/** Stessa struttura editoriale dell'intestazione dei dolci. */
export function SavoryCatalogHeading({
  titoloId,
  lingua,
}: {
  titoloId: string;
  lingua: Lingua;
}) {
  const testi = dizionario(lingua).home.salati;
  return (
    <header>
      <div className="grid gap-x-8 gap-y-7 xl:grid-cols-[minmax(0,6fr)_minmax(180px,2fr)_minmax(240px,3fr)] xl:items-end xl:gap-y-0">
        <div>
          <p className="font-tecnico text-[10px] font-semibold uppercase tracking-[0.22em] text-mandarino">
            {testi.eyebrow}
          </p>
          <h2
            id={titoloId}
            className="font-insegna mt-4 text-[clamp(3rem,7vw,8.6rem)] font-extrabold uppercase leading-[0.82] tracking-[-0.055em]"
          >
            {testi.titolo} <span className="text-mandarino">{testi.titoloAccento}</span>
          </h2>
        </div>

        <p className="max-w-[34ch] text-[0.82rem] leading-[1.6] text-inchiostro/85 xl:max-w-[15rem]">
          {testi.promessa}
        </p>

        <div className="xl:justify-self-end">
          <div
            aria-hidden
            className="h-px w-full max-w-[16rem] bg-inchiostro/85 xl:ml-auto"
          />
          <p className="font-tecnico mt-4 text-[11px] font-semibold uppercase tracking-[0.16em] xl:text-right">
            {interpola(testi.tipologie, { n: fmtNumero(TOTALE_SALATI, lingua) })}
            <span className="mx-2.5 text-inchiostro/35">/</span>
            {interpola(testi.varianti, { n: fmtNumero(TOTALE_VARIANTI_SALATE, lingua) })}
          </p>
        </div>
      </div>
    </header>
  );
}
