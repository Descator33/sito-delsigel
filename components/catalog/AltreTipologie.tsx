"use client";

import Image from "next/image";
import { motion } from "motion/react";
import type { CSSProperties } from "react";
import type { Tipologia } from "@/lib/catalog";
import { RESTO_DOLCI, TEMI, varianti } from "@/lib/catalog-bento";
import { CircleArrowButton } from "./CircleArrowButton";
import { useLingua } from "@/components/LinguaProvider";
import { interpola } from "@/lib/i18n/interpola";
import type { Testi } from "@/lib/i18n/tipi";

/**
 * La coda del catalogo, dietro alla CTA: i dolci che la vetrina non
 * mostra, nello stesso linguaggio ma in tono minore — una sola campitura
 * chiara, foto piccola, niente claim. La gerarchia la fa la misura,
 * quindi queste non competono con le sette di punta.
 *
 * La lista è parametrica: di default mostra `RESTO_DOLCI`, mentre la
 * sezione salata le passa il proprio resto. Le tessere aprono la stessa
 * scheda prodotto delle card grandi in entrambi i capitoli.
 */
export function AltreTipologie({
  onApri,
  tipologie = RESTO_DOLCI,
  titolo,
}: {
  onApri: (t: Tipologia) => void;
  tipologie?: Tipologia[];
  titolo?: string;
}) {
  const { testi } = useLingua();
  if (tipologie.length === 0) return null;

  return (
    <section className="scroll-mt-28">
      <h3 className="font-tecnico mb-3 mt-5 text-[10px] font-semibold uppercase tracking-[0.22em] text-inchiostro/45">
        {titolo ?? testi.catalogo.altriDolci}
        <span className="mx-2.5 text-inchiostro/25">/</span>
        {interpola(testi.catalogo.tipologieCoda, { n: tipologie.length })}
      </h3>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {tipologie.map((t) => (
          <Tessera key={t.code} t={t} onApri={() => onApri(t)} />
        ))}
      </div>
    </section>
  );
}

function Tessera({ t, onApri }: { t: Tipologia; onApri: () => void }) {
  const { testi } = useLingua();
  const n = varianti(t);
  const nota =
    testi.prodotti.note[t.slug as keyof Testi["prodotti"]["note"]] ??
    testi.prodotti.scattoProdotto;
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
          className="foto-prodotto pointer-events-none absolute bottom-[7%] right-[2%] h-[66%] w-[40%]"
          style={{ transformOrigin: "72% 100%" }}
          variants={{
            riposo: { scale: 1, rotate: 0 },
            attiva: { scale: 1.06, rotate: 1.5 },
          }}
          transition={{ type: "spring", stiffness: 240, damping: 20 }}
        >
          <Image
            src={t.image}
            alt={`${t.name}: ${nota}`}
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
          {n > 1
            ? interpola(testi.catalogo.varianti, { n })
            : testi.catalogo.formatoUnico}
        </p>
        <CircleArrowButton
          misura="piccola"
          label={interpola(testi.catalogo.apriScheda, { nome: t.name })}
          className="mt-auto pt-4"
        />
      </div>
    </motion.article>
  );
}
