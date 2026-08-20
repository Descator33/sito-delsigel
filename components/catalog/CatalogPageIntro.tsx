import Image from "next/image";
import { ArrowDown } from "lucide-react";
import { CATALOG, SALATI, type Tipologia } from "@/lib/catalog";
import { TOTALE_TIPOLOGIE, TOTALE_VARIANTI } from "@/lib/catalog-bento";
import { CatalogProductPortal } from "./CatalogMotion";

/**
 * L'ingresso del catalogo è un portale di prodotto, non un secondo
 * frontespizio tipografico. I tre still arrivano dalla stessa fonte delle
 * card: se un'immagine cambia nel catalogo, cambia anche qui.
 */
export function CatalogPageIntro() {
  return (
    <header className="font-testo bg-panna text-inchiostro">
      <CatalogProductPortal
        occhiello="La gamma Delsigel"
        principale={
          <ImmaginePortale prodotto={PRODOTTI_PORTALE.principale} principale />
        }
        dolce={<ImmaginePortale prodotto={PRODOTTI_PORTALE.dolce} />}
        salato={<ImmaginePortale prodotto={PRODOTTI_PORTALE.salato} />}
        descrizione={
          <p className="max-w-[40ch] text-[clamp(0.92rem,1.05vw,1.12rem)] leading-[1.55] text-inchiostro/82">
            Dolci e salati da laboratorio, prodotti su scala. Sfoglia le
            tipologie, apri le schede, personalizza dal configuratore.
          </p>
        }
        navigazione={
          <nav
            aria-label="Le sezioni del catalogo"
            className="grid w-full grid-cols-2 lg:w-[min(42rem,46vw)]"
          >
            <SaltoRapido
              href="#dolci"
              etichetta="Dolci"
              linea="dolci"
              conto={`${TOTALE_TIPOLOGIE} tipologie / ${TOTALE_VARIANTI} varianti`}
            />
            <SaltoRapido
              href="#salati"
              etichetta="Salati"
              linea="salati"
              conto={`${SALATI.length} tipologie`}
            />
          </nav>
        }
      />
    </header>
  );
}

function prodottoPortale(slug: string): Tipologia & { image: string } {
  const prodotto = CATALOG.find((voce) => voce.slug === slug);
  if (!prodotto?.image) {
    throw new Error(
      `CatalogPageIntro: il prodotto «${slug}» non ha uno still per il portale`,
    );
  }
  return prodotto as Tipologia & { image: string };
}

const PRODOTTI_PORTALE = {
  principale: prodottoPortale("intriko"),
  dolce: prodottoPortale("golosone"),
  salato: prodottoPortale("pizzetta-al-pomodoro"),
};

function ImmaginePortale({
  prodotto,
  principale = false,
}: {
  prodotto: Tipologia & { image: string };
  principale?: boolean;
}) {
  return (
    <Image
      src={prodotto.image}
      alt=""
      fill
      draggable={false}
      loading={principale ? "eager" : "lazy"}
      fetchPriority={principale ? "high" : "auto"}
      sizes={
        principale
          ? "(max-width: 767px) 100vw, (max-width: 1023px) 62vw, 50vw"
          : "(max-width: 767px) 1vw, (max-width: 1023px) 24vw, 22vw"
      }
      className="catalog-portal__image object-contain"
    />
  );
}

/**
 * Link editoriale di capitolo: l'intera riga è il bersaglio, mentre la
 * freccia conserva il vocabolario dei comandi già presenti nel catalogo.
 */
function SaltoRapido({
  href,
  etichetta,
  linea,
  conto,
}: {
  href: string;
  etichetta: string;
  linea: "dolci" | "salati";
  conto: string;
}) {
  return (
    <a
      href={href}
      data-catalog-linea={linea}
      className="catalog-portal__link group relative grid min-h-[4.75rem] grid-cols-[1fr_auto] items-center gap-x-3 overflow-hidden px-3 py-3 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-inchiostro sm:min-h-[5.4rem] sm:px-5"
    >
      <span className="relative z-[1] min-w-0 leading-tight">
        <span className="font-insegna block text-[clamp(1.15rem,1.8vw,1.65rem)] font-extrabold uppercase tracking-[-0.035em]">
          {etichetta}
        </span>
        <span className="font-tecnico mt-1 block text-[8px] font-semibold uppercase leading-[1.35] tracking-[0.08em] opacity-60 sm:text-[9px] sm:tracking-[0.1em]">
          {conto}
        </span>
      </span>
      <span
        aria-hidden
        className="relative z-[1] grid h-9 w-9 flex-none place-items-center rounded-full border border-current/30 sm:h-10 sm:w-10"
      >
        <ArrowDown
          strokeWidth={1.5}
          className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-[2px]"
        />
      </span>
    </a>
  );
}
