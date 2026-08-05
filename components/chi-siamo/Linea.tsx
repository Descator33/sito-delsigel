"use client";

import { useRef } from "react";
import { useScatto } from "@/lib/useScatto";

/* biglietto ritagliato per il CTA, come nell'hero */
const TICKET =
  "polygon(2% 8%, 98% 0, 100% 42%, 97% 100%, 3% 94%, 0 55%)";

const PANNA = "#fff4e6";

/* Le cinque stazioni della linea, in sequenza: dalla sfoglia alla spedizione.
   Ogni stazione ha il suo accento di palette per la fascia a scacchi. */
const STAZIONI = [
  {
    n: "01",
    label: "Sfoglia",
    img: "linea-macchina",
    accent: "#fbc50a",
    alt: "Un operatore Delsigel regola la sfogliatrice al pannello di controllo",
  },
  {
    n: "02",
    label: "Formatura",
    img: "linea-formatrice",
    accent: "#eb186b",
    alt: "Un'addetta Delsigel forma i dolci alla macchina della linea",
  },
  {
    n: "03",
    label: "Cottura in linea",
    img: "linea-fritti",
    accent: "#f76f0b",
    alt: "I fritti dolci Delsigel avanzano dorati sul nastro di cottura",
  },
  {
    n: "04",
    label: "Confezionamento",
    img: "linea-vassoi",
    accent: "#a05cd5",
    alt: "Il carico dei vassoi sui carrelli della linea Delsigel",
  },
  {
    n: "05",
    label: "Spedizione",
    img: "mulettista",
    accent: "#e8442e",
    alt: "Il mulettista Delsigel movimenta i pallet pronti alla spedizione",
  },
];

function StazioneCard({ s }: { s: (typeof STAZIONI)[number] }) {
  return (
    <article
      data-scatto
      className="border-[3px] border-inchiostro bg-panna p-2.5 text-inchiostro shadow-[0_18px_40px_rgba(0,0,0,0.4)]"
    >
      <div className="relative">
        <div
          aria-hidden
          className="absolute inset-x-3 top-0 z-10 h-5 border-2 border-inchiostro/60"
          style={{
            backgroundImage: `repeating-conic-gradient(${s.accent} 0% 25%, ${PANNA} 0% 50%)`,
            backgroundSize: "20px 20px",
          }}
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`/chi-siamo/album/${s.img}.webp`}
          alt={s.alt}
          loading="lazy"
          className="aspect-square w-full border-2 border-inchiostro/60 object-cover"
          draggable={false}
        />
      </div>
      <div className="flex flex-col gap-0.5 px-1 pb-1 pt-3 sm:flex-row sm:items-baseline sm:justify-between sm:gap-2">
        <span className="type-label text-inchiostro/50">Staz. {s.n}</span>
        <span className="type-scritta text-xl leading-none">{s.label}</span>
      </div>
    </article>
  );
}

function Dato({
  big,
  small,
  bg,
  fg,
}: {
  big: string;
  small: string;
  bg: string;
  fg: string;
}) {
  return (
    <div
      data-scatto
      className={`flex flex-col items-center justify-center border-[3px] border-inchiostro px-5 py-8 text-center shadow-[0_18px_40px_rgba(0,0,0,0.4)] ${bg} ${fg}`}
    >
      <p className="type-display text-5xl leading-none md:text-6xl">{big}</p>
      <p className="mt-2.5 font-mono text-[11px] font-bold uppercase tracking-[0.16em]">
        {small}
      </p>
    </div>
  );
}

/**
 * La linea produttiva come cuore tecnologico dell'azienda: sezione scura per
 * staccarla dal resto della pagina, la linea raccontata come mappa a cinque
 * stazioni — dalla sfoglia alla spedizione — con card vere e incorniciate, le
 * tessere-dato della palette e la scheda-spec chiara che spiega perché la
 * consegna arriva quando promesso.
 */
export function Linea() {
  const ref = useRef<HTMLElement>(null);

  useScatto(ref);

  return (
    <section
      ref={ref}
      className="relative overflow-hidden border-t-4 border-inchiostro bg-inchiostro py-24 text-panna md:py-32"
    >
      {/* fascia a scacchi in cima, motivo di raccordo del brand */}
      <div
        aria-hidden
        data-scatto
        data-scatto-rot="3"
        className="absolute inset-x-0 top-0 h-3"
        style={{
          backgroundImage: `repeating-conic-gradient(${PANNA} 0% 25%, transparent 0% 50%)`,
          backgroundSize: "22px 22px",
        }}
      />

      <div className="mx-auto w-full max-w-[1500px] px-6 md:px-12">
        {/* riga 1 — intestazione + due tessere-dato */}
        <div className="grid grid-cols-2 gap-4 md:gap-5 lg:grid-cols-4">
          <div
            data-scatto
            data-scatto-rot="4"
            className="col-span-2 flex flex-col justify-between border-[3px] border-inchiostro bg-acido p-8 text-inchiostro shadow-[0_18px_40px_rgba(0,0,0,0.4)] md:p-10"
          >
            <p className="type-label">Il cuore tech · Sermoneta</p>
            <div className="mt-10 md:mt-14">
              <h2 className="type-display text-[clamp(2.2rem,4vw,3.6rem)] leading-[0.92]">
                La linea
                <br />
                produttiva<span className="text-fucsia">.</span>
              </h2>
              <p className="mt-5 max-w-md font-mono text-[13px] leading-relaxed">
                Cinque stazioni in linea, un solo standard su ogni lotto: è la
                parte tecnologica dell&apos;azienda, quella che tiene insieme
                qualità costante e consegne puntuali.
              </p>
            </div>
          </div>
          <Dato big="5" small="stazioni in linea" bg="bg-fucsia" fg="text-panna" />
          <Dato big="IFS" small="certificato · ogni lotto" bg="bg-viola" fg="text-inchiostro" />
        </div>

        {/* riga 2 — le prime quattro stazioni */}
        <div className="mt-4 grid grid-cols-2 gap-4 md:mt-5 md:gap-5 lg:grid-cols-4">
          {STAZIONI.slice(0, 4).map((s) => (
            <StazioneCard key={s.n} s={s} />
          ))}
        </div>

        {/* riga 3 — scheda-spec, la quinta stazione, il CTA */}
        <div className="mt-4 grid grid-cols-2 gap-4 md:mt-5 md:gap-5 lg:grid-cols-4">
          <div
            data-scatto
            data-scatto-rot="4"
            className="col-span-2 border-[3px] border-panna/25 bg-panna p-7 text-inchiostro shadow-[0_18px_40px_rgba(0,0,0,0.4)] md:p-9"
          >
            <p className="type-label text-inchiostro/50">Come funziona</p>
            <ul className="mt-5 space-y-3 font-mono text-[13px] leading-relaxed">
              <li className="flex gap-3">
                <span className="text-fucsia">→</span> Farine selezionate e impasti
                riposati in cella a temperatura controllata.
              </li>
              <li className="flex gap-3">
                <span className="text-fucsia">→</span> Creme e ripieni dosati una
                referenza alla volta, senza compromessi.
              </li>
              <li className="flex gap-3">
                <span className="text-fucsia">→</span> Forni in linea con la stessa
                curva di cottura su ogni lotto.
              </li>
              <li className="flex gap-3">
                <span className="text-fucsia">→</span> Verifica finale e sigillo
                prima della partenza per il banco.
              </li>
              <li className="flex gap-3">
                <span className="text-fucsia">→</span> Consegne puntuali, tracciate
                lotto per lotto: cambia la scala, mai il gesto.
              </li>
            </ul>
          </div>

          <StazioneCard s={STAZIONI[4]} />

          <a
            href="/contatti"
            data-scatto
            className="group flex flex-col items-center justify-center gap-3 border-[3px] border-inchiostro bg-mandarino p-6 text-center text-inchiostro shadow-[0_18px_40px_rgba(0,0,0,0.4)]"
          >
            <span className="type-label">Vieni a vederla</span>
            <span
              className="bg-inchiostro px-6 py-3 transition-transform group-hover:scale-[1.04]"
              style={{ clipPath: TICKET }}
            >
              <span className="type-scritta text-2xl leading-none text-panna">
                Vieni a trovarci
              </span>
            </span>
            <span className="font-mono text-[11px] font-bold uppercase tracking-[0.14em]">
              Sermoneta · il forno è acceso
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
