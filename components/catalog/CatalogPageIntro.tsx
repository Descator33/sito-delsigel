import { ArrowDown } from "lucide-react";
import { TOTALE_TIPOLOGIE, TOTALE_VARIANTI } from "@/lib/catalog-bento";
import { SALATI } from "@/lib/catalog";

/**
 * L'ingresso della pagina Catalogo (refactor architettura 2026-08-12).
 *
 * Non è una seconda homepage: è il frontespizio di una pagina di
 * consultazione. Un occhiello, l'insegna, una riga di promessa e i due
 * salti rapidi alle sezioni — dolci e salati — con il conto vero della
 * gamma, contato dai dati come fa già CatalogHeading.
 *
 * La voce è quella del catalogo (League Spartan / Inter Tight / IBM Plex
 * Mono, vedi app/fonts.ts): la pagina È il mondo-catalogo, e l'insegna
 * grande qui sostituisce l'emozione che in home fanno le fotografie.
 *
 * Il padding alto tiene conto della navigazione flottante, che non ha
 * campitura: `pt` largo, non un offset magico.
 *
 * Server Component — qui non succede niente.
 */
export function CatalogPageIntro() {
  return (
    <header className="font-testo bg-panna text-inchiostro">
      <div className="mx-auto max-w-[1800px] px-6 pb-2 pt-32 md:px-12 md:pt-40">
        <p className="font-tecnico text-[10px] font-semibold uppercase tracking-[0.22em] text-fucsia">
          La gamma Delsigel
        </p>

        <h1 className="font-insegna mt-4 text-[clamp(2.8rem,9vw,8rem)] font-extrabold uppercase leading-[0.84] tracking-[-0.05em]">
          Tutto il
          <br />
          catalogo<span className="text-fucsia">.</span>
        </h1>

        <div className="mt-7 flex flex-col gap-7 md:mt-9 md:flex-row md:items-end md:justify-between">
          <p className="max-w-[44ch] text-[clamp(0.95rem,1.05vw,1.15rem)] leading-[1.6] text-inchiostro/85">
            Dolci e salati da laboratorio, prodotti su scala. Sfoglia le
            tipologie, apri le schede, personalizza dal configuratore.
          </p>

          {/* i due salti rapidi: ancore vere, non una nav — la pagina è
              corta e si legge dall'alto, questi servono a chi arriva
              cercando una delle due linee */}
          <nav aria-label="Le sezioni del catalogo" className="flex gap-3">
            <SaltoRapido
              href="#dolci"
              etichetta="I dolci"
              conto={`${TOTALE_TIPOLOGIE} tipologie · ${TOTALE_VARIANTI} varianti`}
            />
            <SaltoRapido
              href="#salati"
              etichetta="I salati"
              conto={`${SALATI.length} tipologie`}
            />
          </nav>
        </div>
      </div>
    </header>
  );
}

/** salto di sezione: pillola col filo, si accende d'inchiostro all'hover
 *  (stessa meccanica delle pillole del sito, nessun segno nuovo) */
function SaltoRapido({
  href,
  etichetta,
  conto,
}: {
  href: string;
  etichetta: string;
  conto: string;
}) {
  return (
    <a
      href={href}
      className="group flex items-center gap-3 rounded-full border border-inchiostro/20 py-2.5 pl-5 pr-3 transition-colors duration-300 hover:border-inchiostro hover:bg-inchiostro hover:text-panna focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-inchiostro"
    >
      <span className="leading-tight">
        <span className="font-tecnico block text-[11px] font-semibold uppercase tracking-[0.14em]">
          {etichetta}
        </span>
        <span className="font-tecnico block text-[9px] font-semibold uppercase tracking-[0.1em] opacity-55">
          {conto}
        </span>
      </span>
      <span
        aria-hidden
        className="grid h-9 w-9 flex-none place-items-center rounded-full border border-current/30"
      >
        <ArrowDown
          strokeWidth={1.5}
          className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-[2px]"
        />
      </span>
    </a>
  );
}
