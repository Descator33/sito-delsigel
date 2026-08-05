import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { DESTINAZIONE_CATALOGO } from "@/lib/catalogo-fisico";
import { DecorativeDoodles, Rosetta } from "./DecorativeDoodles";

/**
 * La copertina della linea salata: la metà mandarino del quadro.
 *
 * Deve leggersi come la prima pagina di un capitolo — occhiello, insegna a
 * due righe, promessa breve, un comando solo — e non come una card
 * commerciale: per questo non ha bordi propri, non ha ombre e il titolo
 * arriva a toccare quasi il taglio della campitura.
 *
 * Server Component: qui non c'è stato. Il sollevamento della freccia e il
 * riempimento del cerchio sono transizioni CSS (`.salati-cta`), non Motion.
 */

export function SavoryEditorialPanel({ titoloId }: { titoloId: string }) {
  return (
    /* z-[1]: il ghirigoro sconfina sulla vetrina, che nel DOM viene dopo e
       altrimenti lo coprirebbe. Il pannello non ha overflow proprio,
       quindi a tagliare il sconfinamento è il bordo del quadro. */
    <div className="salati-pannello relative z-[1] flex min-w-0 flex-col justify-center px-[clamp(1.5rem,2.6vw,2.85rem)] py-[clamp(2.4rem,4vw,3.75rem)]">
      <SectionEyebrow />
      <DisplayHeading id={titoloId} />
      <Description />
      <CatalogButton />
      <DecorativeDoodles zona="pannello" />
    </div>
  );
}

function SectionEyebrow() {
  return (
    <p className="flex items-center gap-3 text-[clamp(9px,0.62vw,11px)] font-bold uppercase tracking-[0.22em] text-panna">
      <Rosetta className="h-[clamp(16px,1.3vw,20px)] w-[clamp(16px,1.3vw,20px)] flex-none" />
      Catalogo salati
    </p>
  );
}

/**
 * «I NOSTRI / SALATI»: due righe, una sopra l'altra, in Anton.
 *
 * L'a capo è tipografico e non semantico — per chi legge con lo schermo il
 * titolo resta la frase intera — quindi le due righe sono `<span>` a
 * blocco e non due elementi separati.
 */
function DisplayHeading({ id }: { id: string }) {
  return (
    <h2
      id={id}
      /* due scale diverse perché sotto lg il pannello è a tutta larghezza
         e sopra lg è una colonna stretta: la stessa formula darebbe un
         titolo minuscolo sul tablet o un titolo che sfonda la colonna */
      className="font-insegna-salati mt-[clamp(1.1rem,1.8vw,1.8rem)] text-[clamp(2.9rem,10vw,4.5rem)] font-normal uppercase leading-[0.88] tracking-[-0.02em] text-cacao lg:text-[clamp(3.2rem,6.1vw,6.25rem)]"
    >
      <span className="block">I nostri</span>
      <span className="block">Salati</span>
    </h2>
  );
}

function Description() {
  return (
    <p className="mt-[clamp(1.1rem,1.6vw,1.6rem)] max-w-[34ch] text-[clamp(0.9rem,1.05vw,1.05rem)] font-medium leading-[1.55] text-cacao/85">
      Tradizione, gusto e creatività in ogni ricetta.
      <br className="hidden sm:inline" /> Sfoglia il catalogo e lasciati
      ispirare.
    </p>
  );
}

/**
 * «Vedi il catalogo». Porta dove porta già la CTA del catalogo stampato
 * (`DESTINAZIONE_CATALOGO`): il catalogo sfogliabile non esiste ancora nel
 * progetto e la richiesta di listino e campionatura si fa dal modulo
 * contatti. Quando ci sarà una pagina dedicata basta cambiare quella
 * costante e cambiano entrambe le sezioni — qui non c'è un secondo
 * indirizzo da tenere allineato.
 */
function CatalogButton() {
  return (
    <div className="mt-[clamp(1.75rem,2.6vw,2.5rem)]">
      <Link
        href={DESTINAZIONE_CATALOGO}
        className="salati-cta group inline-flex min-h-14 w-full max-w-[22rem] items-center justify-between gap-5 rounded-full bg-cacao py-[0.4rem] pl-[clamp(1.25rem,1.8vw,1.9rem)] pr-[0.4rem] text-[clamp(10px,0.72vw,12px)] font-bold uppercase tracking-[0.16em] text-panna sm:w-auto"
      >
        Vedi il catalogo
        <span
          aria-hidden
          className="grid h-11 w-11 flex-none place-items-center rounded-full border border-panna/55"
        >
          <ArrowRight strokeWidth={1.6} className="h-[18px] w-[18px]" />
        </span>
      </Link>
    </div>
  );
}
