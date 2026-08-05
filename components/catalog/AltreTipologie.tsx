"use client";

import Image from "next/image";
import { motion } from "motion/react";
import type { CSSProperties } from "react";
import type { Tipologia } from "@/lib/catalog";
import { RESTO_DOLCI, TEMI, varianti } from "@/lib/catalog-bento";
import { CircleArrowButton } from "./CircleArrowButton";

/**
 * La coda del catalogo, dietro alla CTA: i dolci che la vetrina non
 * mostra, nello stesso linguaggio ma in tono minore — una sola campitura
 * chiara, foto piccola, niente claim. La gerarchia la fa la misura,
 * quindi queste non competono con le sette di punta.
 *
 * Rev 05/08 — la coda era divisa in due gruppi, «dolci» e «salati»:
 * adesso la linea salata ha la sua sezione più in basso e qui resta un
 * elenco solo, che è quello che i dati dicono (`RESTO_DOLCI`). Le tessere
 * aprono la stessa scheda prodotto delle card grandi.
 */
export function AltreTipologie({
  onApri,
}: {
  onApri: (t: Tipologia) => void;
}) {
  if (RESTO_DOLCI.length === 0) return null;

  return (
    <section className="scroll-mt-28">
      <h3 className="font-tecnico mb-3 mt-5 text-[10px] font-semibold uppercase tracking-[0.22em] text-inchiostro/45">
        Altri dolci
        <span className="mx-2.5 text-inchiostro/25">/</span>
        {RESTO_DOLCI.length} tipologie
      </h3>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {RESTO_DOLCI.map((t) => (
          <Tessera key={t.code} t={t} onApri={() => onApri(t)} />
        ))}
      </div>
    </section>
  );
}

function Tessera({ t, onApri }: { t: Tipologia; onApri: () => void }) {
  const n = varianti(t);
  return (
    <motion.article
      onClick={onApri}
      className="card-catalogo min-h-[9.5rem]"
      style={
        {
          "--fondo": TEMI.sabbia.fondo,
          "--testo": TEMI.sabbia.testo,
        } as CSSProperties
      }
      initial="riposo"
      animate="riposo"
      whileHover="attiva"
      variants={{ riposo: { y: 0 }, attiva: { y: -4 } }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
    >
      {t.image && (
        <motion.div
          className="foto-prodotto pointer-events-none absolute bottom-[4%] right-[-1%] h-[72%] w-[41%]"
          style={{ transformOrigin: "72% 100%" }}
          variants={{
            riposo: { scale: 1, rotate: 0 },
            attiva: { scale: 1.06, rotate: 1.5 },
          }}
          transition={{ type: "spring", stiffness: 240, damping: 20 }}
        >
          <Image
            src={t.image}
            alt={`${t.name}: ${t.note ?? "scatto di prodotto"}`}
            fill
            sizes="(max-width: 640px) 45vw, (max-width: 1279px) 22vw, 12vw"
            className="object-contain object-bottom"
          />
        </motion.div>
      )}

      <div className="relative z-[2] flex h-full flex-col items-start p-5">
        <p
          aria-hidden
          className="font-tecnico text-[0.6rem] font-semibold tracking-[0.16em] text-fucsia"
        >
          {t.code.replace(/^N\./, "")}.
        </p>
        <h4 className="font-insegna mt-[0.55em] max-w-[55%] text-[1.25rem] font-extrabold uppercase leading-[0.9] tracking-[-0.04em]">
          {t.name}
        </h4>
        <p className="font-tecnico mt-2 text-[9px] font-semibold uppercase tracking-[0.12em] text-inchiostro/45">
          {n > 1 ? `${n} varianti` : "formato unico"}
        </p>
        <CircleArrowButton
          misura="piccola"
          label={`Apri la scheda di ${t.name}`}
          className="mt-auto pt-4"
        />
      </div>
    </motion.article>
  );
}
