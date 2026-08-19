"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, type ElementType } from "react";
import { ArrowRight } from "lucide-react";
import { gustoColor, type Tipologia } from "@/lib/catalog";
import { TEMI, type TemaCard } from "@/lib/catalog-bento";
import { schedaDi } from "@/lib/catalog-scheda";
import { useMediaQuery } from "@/lib/useMediaQuery";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
} from "@/components/ui/drawer";

/**
 * La scheda prodotto del catalogo: Dialog da 768 px in su, Drawer sotto.
 *
 * Eredita dalla vecchia card la cosa che valeva la pena tenere — passando
 * su una variante la foto cambia, così la gamma si sfoglia senza uscire
 * dalla scheda — e ci aggiunge quello che nella card non entrava: formato,
 * peso, pezzi per cartone e il salto al configuratore. Tutti dati veri:
 * quel che il foglio non dice, la scheda non lo scrive (lib/catalog-scheda).
 *
 * Quello che la scheda NON è: un configuratore in miniatura. Mostra i
 * prodotti finiti a listino e basta — niente finiture, niente topping,
 * niente farciture componibili. Chi vuole comporre passa dal pulsante.
 */

/* La scheda resta montata mentre si chiude, altrimenti Radix non ha nulla
   su cui far girare l'animazione d'uscita: `ultimo` tiene l'ultima
   tipologia aperta finché non se ne apre un'altra. */
export function ProductQuickView({
  aperto,
  tema = "sabbia",
  onChiudi,
}: {
  aperto: Tipologia | null;
  tema?: TemaCard;
  onChiudi: () => void;
}) {
  const [ultimo, setUltimo] = useState<Tipologia | null>(null);
  if (aperto && aperto !== ultimo) setUltimo(aperto); // stato derivato da prop
  const t = aperto ?? ultimo;

  const desktop = useMediaQuery("(min-width: 768px)");
  const chiudi = (stato: boolean) => {
    if (!stato) onChiudi();
  };

  if (!t) return null;

  if (desktop) {
    return (
      <Dialog open={!!aperto} onOpenChange={chiudi}>
        <DialogContent chiudiLabel={`Chiudi la scheda di ${t.name}`}>
          <Scheda
            key={t.slug}
            t={t}
            tema={tema}
            Titolo={DialogTitle}
            Descrizione={DialogDescription}
          />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={!!aperto} onOpenChange={chiudi}>
      <DrawerContent>
        <Scheda
          key={t.slug}
          t={t}
          tema={tema}
          Titolo={DrawerTitle}
          Descrizione={DrawerDescription}
        />
      </DrawerContent>
    </Drawer>
  );
}

function Scheda({
  t,
  tema,
  Titolo,
  Descrizione,
}: {
  t: Tipologia;
  tema: TemaCard;
  /* Dialog e Drawer hanno titolo e descrizione propri: la scheda è la
     stessa, glieli passa chi la monta */
  Titolo: ElementType;
  Descrizione: ElementType;
}) {
  const s = schedaDi(t);
  const [mostrato, setMostrato] = useState<string | null>(null);
  const variante = s.gamma
    .flatMap((g) => g.varianti)
    .find((v) => v.id === mostrato);
  const still =
    (mostrato === "spaccato"
      ? t.spaccato
      : variante && t.variants?.[variante.chiave]) ?? t.image;

  const specifiche = [
    s.formato && { voce: "Formato", valore: s.formato },
    /* scelto un prodotto finito, il peso è il suo, non più l'intervallo */
    (variante?.peso ?? s.peso) && {
      voce: "Peso",
      valore: variante?.peso ?? s.peso!,
    },
    s.pezziPerCartone && {
      voce: "Per cartone",
      valore: `${s.pezziPerCartone} pz`,
    },
  ].filter(Boolean) as { voce: string; valore: string }[];

  return (
    <div className="font-testo grid md:grid-cols-[minmax(0,0.95fr)_minmax(0,1fr)]">
      {/* -------------------------- la fotografia -------------------------- */}
      <div
        className="relative min-h-[15rem] md:min-h-[30rem]"
        style={{ background: TEMI[tema].fondo }}
      >
        {still ? (
          <Image
            key={still}
            src={still}
            alt={
              variante
                ? `${t.name} ${variante.nome.toLowerCase()}`
                : mostrato === "spaccato"
                  ? `${t.name} tagliato a metà`
                  : `${t.name}: ${t.note ?? "scatto di prodotto"}`
            }
            fill
            sizes="(max-width: 767px) 92vw, 30vw"
            className="foto-prodotto object-contain p-8 md:p-10"
          />
        ) : (
          <span
            aria-hidden
            className="font-insegna absolute inset-0 grid place-items-center text-[8rem] font-extrabold uppercase leading-none"
            style={{ color: TEMI[tema].testo, opacity: 0.16 }}
          >
            {t.name.charAt(0)}
          </span>
        )}

        {t.views?.includes("spaccato") && t.spaccato && (
          <button
            type="button"
            onClick={() =>
              setMostrato((m) => (m === "spaccato" ? null : "spaccato"))
            }
            aria-pressed={mostrato === "spaccato"}
            className="font-tecnico absolute bottom-4 left-4 min-h-11 rounded-full border px-4 text-[10px] font-semibold uppercase tracking-[0.14em] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
            style={
              mostrato === "spaccato"
                ? {
                    color: TEMI[tema].fondo,
                    borderColor: TEMI[tema].testo,
                    background: TEMI[tema].testo,
                  }
                : {
                    color: TEMI[tema].testo,
                    borderColor: TEMI[tema].testo,
                    background: "transparent",
                  }
            }
          >
            {mostrato === "spaccato" ? "Vedi intero" : "Vedi lo spaccato"}
          </button>
        )}
      </div>

      {/* --------------------------- le specifiche -------------------------- */}
      <div className="p-6 pb-8 md:p-9 md:pr-14">
        <p className="font-tecnico text-[10px] font-semibold uppercase tracking-[0.22em] text-fucsia">
          {t.code} · {s.linea}
        </p>

        <Titolo asChild>
          <h2 className="font-insegna mt-3 text-[clamp(2rem,5vw,2.8rem)] font-extrabold uppercase leading-[0.88] tracking-[-0.045em]">
            {t.name}
          </h2>
        </Titolo>

        {t.note ? (
          <Descrizione asChild>
            <p className="mt-3 max-w-md text-[0.95rem] leading-relaxed text-inchiostro/70">
              {t.note}
            </p>
          </Descrizione>
        ) : (
          <Descrizione className="sr-only">
            Scheda della tipologia {t.name}.
          </Descrizione>
        )}

        {specifiche.length > 0 && (
          <dl className="mt-7 grid grid-cols-3 gap-4 border-y border-inchiostro/12 py-5">
            {specifiche.map((r) => (
              <div key={r.voce}>
                <dt className="font-tecnico text-[9px] font-semibold uppercase tracking-[0.16em] text-inchiostro/45">
                  {r.voce}
                </dt>
                <dd className="mt-1.5 text-base font-semibold">{r.valore}</dd>
              </div>
            ))}
          </dl>
        )}

        {s.gamma.map((g) => (
          <div key={g.label} className="mt-6">
            <p className="font-tecnico text-[9px] font-semibold uppercase tracking-[0.16em] text-inchiostro/45">
              {g.label}
            </p>
            <ul className="mt-2.5 flex flex-wrap gap-1.5">
              {g.varianti.map((v) => {
                const sfogliabile = Boolean(t.variants?.[v.chiave]);
                return (
                  <li key={v.id}>
                    <button
                      type="button"
                      disabled={!sfogliabile}
                      onClick={() =>
                        setMostrato((m) => (m === v.id ? null : v.id))
                      }
                      aria-pressed={sfogliabile ? mostrato === v.id : undefined}
                      className={`inline-flex min-h-9 items-center gap-2 rounded-full border py-1.5 pl-2 pr-3.5 text-[11px] font-semibold uppercase tracking-[0.04em] transition-colors ${
                        mostrato === v.id
                          ? "border-inchiostro bg-inchiostro text-panna"
                          : "border-inchiostro/20 text-inchiostro/80"
                      } ${
                        sfogliabile
                          ? "hover:border-inchiostro focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fucsia"
                          : "cursor-default"
                      }`}
                    >
                      <span
                        aria-hidden
                        className="h-2.5 w-2.5 rounded-full ring-1 ring-inchiostro/20"
                        style={{ backgroundColor: gustoColor(v.chiave) }}
                      />
                      {v.nome}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}

        {s.modalitaUso && (
          <p className="font-tecnico mt-6 text-[10px] uppercase leading-relaxed tracking-[0.1em] text-inchiostro/45">
            {s.modalitaUso}
          </p>
        )}

        <div className="mt-8 flex flex-wrap gap-2.5">
          {s.configuratore && (
            <Link
              href={s.configuratore}
              className="font-tecnico inline-flex min-h-11 items-center gap-2.5 rounded-full bg-fucsia px-5 text-[10px] font-semibold uppercase tracking-[0.14em] text-panna transition-colors hover:bg-inchiostro focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fucsia"
            >
              Personalizza questo dolce
              <ArrowRight aria-hidden strokeWidth={1.6} className="h-4 w-4" />
            </Link>
          )}
          <Link
            href="/contatti"
            className="font-tecnico inline-flex min-h-11 items-center gap-2.5 rounded-full border border-inchiostro/25 px-5 text-[10px] font-semibold uppercase tracking-[0.14em] transition-colors hover:border-inchiostro hover:bg-inchiostro hover:text-panna focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fucsia"
          >
            Richiedi informazioni
          </Link>
        </div>
      </div>
    </div>
  );
}
