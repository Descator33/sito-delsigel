"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Logo } from "@/components/Logo";
import { DESTINAZIONE_CONFIGURATORE } from "@/lib/percorso-configuratore";
import { useScatto } from "@/lib/useScatto";

/* la fascia pop sotto il wordmark, con la palette in sequenza */
const COLORI = ["#fbc50a", "#eb186b", "#a05cd5", "#f76f0b", "#e8442e"];

/**
 * Le colonne di link. Portano tutte da qualche parte che esiste davvero
 * — le sole rotte del sito sono home, chi siamo, contatti e
 * configuratore, più le ancore delle sezioni — quindi non c'è nessuna
 * colonna «Servizi» con voci che aprirebbero il vuoto. Dove il
 * riferimento mostrava quattro colonne di navigazione, qui la terza è il
 * configuratore: è ciò che la home adesso chiede di fare.
 */
const COLONNE: { titolo: string; voci: [string, string][] }[] = [
  {
    titolo: "Delsigel",
    voci: [
      ["Chi siamo", "/chi-siamo"],
      /* la storia vive in homepage dal refactor 12/08 */
      ["La nostra storia", "/#storia"],
      ["Contatti", "/contatti"],
    ],
  },
  {
    titolo: "Prodotti",
    voci: [
      /* Gamma e catalogo stampato sono capitoli della home. */
      ["I nostri dolci", "/#dolci"],
      ["I nostri salati", "/#salati"],
      ["Catalogo 2026/27", "/#catalogo-fisico"],
    ],
  },
  {
    titolo: "Configuratore",
    voci: [
      ["Crea il tuo dolce", DESTINAZIONE_CONFIGURATORE],
      ["Come funziona", "/#come-si-crea"],
      ["Richiedi una quotazione", "/contatti"],
    ],
  },
];

/**
 * Chiusura del sito: campitura cacao, wordmark con la fascia pop, le
 * colonne di navigazione, le coordinate vere e la mappa della sede.
 *
 * Rev 05/08 — riscritto sul riferimento della nuova home. Due cose
 * cambiano rispetto a prima: il fondo passa da inchiostro a cacao (un
 * cioccolato, non un nero — sotto una sezione crema il nero pieno
 * tornava a essere il muro che il redesign ha appena tolto), e i denti a
 * scacchi sul confine spariscono. Erano il morso della vecchia sezione
 * scura sopra: senza quella non mordono più niente.
 *
 * Nell'angolo si sono alternati il francobollo con la foto della
 * squadra (un ricordo), poi il biglietto per il configuratore (un
 * comando, ma il terzo della stessa pagina) e infine — 2026-08-20 — la
 * mappa: l'unica informazione che lì mancava davvero.
 *
 * Il wordmark schiva il cursore come i pezzi del collage; la mappa no,
 * si guarda e si trascina.
 */
export function Footer() {
  const ref = useRef<HTMLElement>(null);

  useScatto(ref);

  return (
    <footer ref={ref} className="font-pop-testo relative bg-cacao text-panna">
      <div className="mx-auto w-full max-w-[1800px] px-6 pb-10 pt-16 md:px-12 md:pt-20">
        <div className="grid items-start gap-x-10 gap-y-12 lg:grid-cols-[minmax(200px,270px)_minmax(0,1fr)] xl:grid-cols-[minmax(200px,270px)_minmax(0,1fr)_auto]">
          {/* logo storto con la fascia pop: lettere panna, occhielli cacao */}
          <div data-scatto className="w-max -rotate-3">
            <Logo
              variant="stacked"
              surface="var(--cacao)"
              className="w-[clamp(150px,12vw,190px)] text-panna"
            />
            <div aria-hidden className="mt-3 flex h-2.5">
              {COLORI.map((c) => (
                <span key={c} className="flex-1" style={{ background: c }} />
              ))}
            </div>
            <p className="mt-4 max-w-[240px] text-[13px] leading-relaxed text-panna/55">
              L&apos;industria artigianale di Sermoneta, dal 2011.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-x-8 gap-y-11 sm:grid-cols-2 lg:grid-cols-4">
            {COLONNE.map((col) => (
              <div key={col.titolo}>
                <ColumnHeading>{col.titolo}</ColumnHeading>
                <ul className="mt-6 space-y-3.5">
                  {col.voci.map(([label, href]) => (
                    <li key={label}>
                      <Link href={href} className="voce-footer">
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <div>
              <ColumnHeading>Contatti</ColumnHeading>
              <ul className="mt-6 space-y-3.5 text-[13px] leading-relaxed text-panna/70">
                <li>
                  Via della Meccanica, 1
                  <br />
                  04013 Sermoneta (LT)
                </li>
                <li>
                  <a href="tel:+390773319437" className="voce-footer">
                    T. +39 0773 319437
                  </a>
                </li>
                <li>
                  <a href="mailto:info@delsigel.it" className="voce-footer">
                    E. info@delsigel.it
                  </a>
                </li>
                <li>
                  <a href="mailto:delsigel@legalmail.it" className="voce-footer">
                    PEC. delsigel@legalmail.it
                  </a>
                </li>
              </ul>
              <div className="mt-6 flex gap-3">
                <a
                  href="https://instagram.com/delsigel_official"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Delsigel su Instagram"
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-panna/35 transition-colors hover:border-panna hover:bg-panna hover:text-cacao focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-panna"
                >
                  <svg
                    aria-hidden
                    viewBox="0 0 24 24"
                    className="h-[18px] w-[18px]"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <rect x="3" y="3" width="18" height="18" rx="4" />
                    <circle cx="12" cy="12" r="4" />
                    <circle
                      cx="17.2"
                      cy="6.8"
                      r="0.9"
                      fill="currentColor"
                      stroke="none"
                    />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          <MappaSede />
        </div>

        {/* barra finale a tre zone */}
        <div className="mt-14 flex flex-col items-center gap-4 border-t border-panna/20 pt-6 text-[12px] text-panna/50 md:mt-16 md:flex-row md:justify-between">
          <p>© 2026 Delsigel Italia S.r.l. · P.IVA 02241670591</p>
          <div className="flex gap-8">
            <a href="#" className="voce-footer">
              Termini
            </a>
            <a href="#" className="voce-footer">
              Privacy
            </a>
            <a href="#" className="voce-footer">
              Cookie
            </a>
          </div>
          <p>Design &amp; Development · Hoverture</p>
        </div>
      </div>
    </footer>
  );
}

function ColumnHeading({ children }: { children: string }) {
  return (
    <h3 className="font-pop text-[clamp(1rem,1.1vw,1.25rem)] font-normal uppercase leading-none tracking-[0.02em] text-panna">
      {children}
    </h3>
  );
}

/** L'indirizzo, scritto una volta sola: lo leggono la mappa (che ci
 *  cerca sopra) e il link che apre Google Maps. */
const SEDE = "Delsigel, Via della Meccanica 1, 04013 Sermoneta LT";

/**
 * La mappa della sede. Prende il posto del biglietto per il
 * configuratore (2026-08-20): al configuratore ci portano già la colonna
 * qui accanto, la CTA del teaser e il menu — tre inviti alla stessa
 * porta, e il quarto era quello che occupava l'angolo. Qui invece manca
 * l'unica cosa che un footer di un'azienda con uno stabilimento deve
 * dare: dove si trova.
 *
 * È l'embed pubblico di Google Maps, senza chiave e senza SDK: un
 * iframe pigro che si scarica solo quando il footer si avvicina. Sopra
 * ci sta un filo panna e sotto l'indirizzo, che resta un link vero — se
 * l'iframe non arriva (blocco di terze parti, rete lenta), la strada per
 * arrivare in via della Meccanica c'è lo stesso.
 *
 * Niente `data-scatto`: la schivata dal cursore ha senso sui pezzi di
 * collage, non su una mappa che si guarda e si trascina.
 */
function MappaSede() {
  return (
    <div className="w-full max-w-[26rem] justify-self-start xl:w-[22rem]">
      <ColumnHeading>Dove siamo</ColumnHeading>

      <div className="mappa-sede mt-6 overflow-hidden rounded-[18px] border border-panna/25">
        <iframe
          title="Mappa: sede Delsigel in via della Meccanica 1, Sermoneta"
          src={`https://www.google.com/maps?q=${encodeURIComponent(SEDE)}&z=15&output=embed`}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="block h-[13.5rem] w-full border-0"
        />
      </div>

      <a
        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(SEDE)}`}
        target="_blank"
        rel="noreferrer"
        className="voce-footer mt-4 inline-flex items-center gap-2 text-[13px]"
      >
        Via della Meccanica, 1 · Sermoneta (LT)
        <ArrowRight aria-hidden strokeWidth={1.8} className="h-4 w-4 flex-none" />
      </a>
    </div>
  );
}
