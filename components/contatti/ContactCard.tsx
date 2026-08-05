import { ArrowRight, FileText, Factory, Mail, Phone } from "lucide-react";
import { Sottolineatura } from "@/components/contatti/FettaDiTorta";
import type { Recapito } from "@/lib/contatti";

/**
 * Una tessera di contatto: cerchio colorato, etichetta, recapito, segno
 * di pennarello sotto.
 *
 * La tessera intera È il link — non c'è un titolo cliccabile dentro un
 * riquadro cliccabile. Un solo stop di tabulazione, un solo bersaglio per
 * il dito, e l'`aria-label` dice che cosa succede («Chiama Delsigel»)
 * invece di far indovinare da un numero letto cifra per cifra.
 *
 * Le icone sono tutte lucide, con lo stesso tratto: mescolare due set si
 * vede subito dentro cerchi di 52px.
 */
const ICONE = {
  email: Mail,
  telefono: Phone,
  pec: FileText,
  stabilimento: Factory,
} as const;

/* Il cerchio dell'icona: rosso con segno panna, acido con segno
   inchiostro. Il giallo con un'icona bianca sopra non arriva al
   contrasto, e questo è l'unico motivo per cui i due accenti non hanno lo
   stesso colore di segno. */
const CAMPITURE: Record<Recapito["accento"], string> = {
  rosso: "bg-rosso text-panna",
  acido: "bg-acido text-inchiostro",
};

export function ContactCard({
  recapito,
  indice,
}: {
  recapito: Recapito;
  indice: number;
}) {
  const Icona = ICONE[recapito.id];

  return (
    <a
      href={recapito.href}
      aria-label={recapito.azione}
      {...(recapito.esterno
        ? { target: "_blank", rel: "noreferrer" }
        : undefined)}
      className="pop-tessera flex h-full min-h-[104px] items-center gap-4 p-4 sm:gap-5 sm:p-5"
    >
      <span
        className={`pop-icona grid h-12 w-12 flex-none place-items-center rounded-full sm:h-[54px] sm:w-[54px] ${CAMPITURE[recapito.accento]}`}
      >
        <Icona
          aria-hidden
          strokeWidth={2.1}
          className="h-[22px] w-[22px] sm:h-6 sm:w-6"
        />
      </span>

      <span className="min-w-0 flex-1">
        <span className="font-pop block text-[clamp(1.15rem,1.7vw,1.55rem)] uppercase leading-none tracking-[0.005em]">
          {recapito.label}
        </span>
        <span className="relative mt-1.5 block">
          {recapito.righe.map((riga) => (
            <span
              key={riga}
              className="block break-words text-[clamp(0.9rem,1.05vw,1.05rem)] leading-snug text-inchiostro/80"
            >
              {riga}
            </span>
          ))}
          {/* il pennarello: largo quanto il testo, mai quanto la tessera */}
          <Sottolineatura
            variante={indice}
            className="mt-0.5 h-[9px] w-[min(100%,150px)] text-inchiostro"
          />
        </span>
      </span>

      <ArrowRight
        aria-hidden
        strokeWidth={2.4}
        className="pop-freccia h-[18px] w-[18px] flex-none self-center"
      />
    </a>
  );
}
