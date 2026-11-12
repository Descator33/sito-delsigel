"use client";

import { type Base, type Prodotto } from "@/lib/configuratore";
import { useLingua } from "@/components/LinguaConfiguratoreProvider";
import { interpola } from "@/lib/i18n-configuratore/interpola";
import type { IdCredenza, IdFarcitura, IdFinitura } from "@/lib/i18n-configuratore/tipi";
import { Condividi } from "./Condividi";

/** Riepilogo della creazione completa, pronta da condividere. */
export function PassoCompleto({ prodotto, base }: { prodotto: Prodotto; base: Base }) {
  const { testi } = useLingua();
  const fin = testi.configuratore.finitura;
  const farcitura =
    testi.prodotti.farciture[prodotto.farcitura as IdFarcitura] ??
    prodotto.farcitura;
  const credenza =
    testi.prodotti.credenza[prodotto.credenza as IdCredenza] ??
    prodotto.credenza;
  const finitura =
    testi.prodotti.finiture[prodotto.finitura as IdFinitura] ??
    prodotto.finitura;

  return (
    <div className="flex flex-col gap-9">
      <div>
        <p className="font-display text-[clamp(1.35rem,2.2vw,1.9rem)] font-extrabold leading-[1.05] tracking-[-0.02em]">
          {interpola(fin.boom, { nome: base.nome })}
        </p>
        <p className="mt-3 max-w-[46ch] text-[14px] leading-relaxed text-inchiostro/70">
          {fin.combo}
        </p>
        <dl className="mt-5 flex flex-wrap gap-x-7 gap-y-2 font-mono text-[13px]">
          <div>
            <dt className="type-label inline text-inchiostro/45">
              {fin.farcitura}{" "}
            </dt>
            <dd className="inline font-bold">{farcitura}</dd>
          </div>
          <div>
            <dt className="type-label inline text-inchiostro/45">
              {fin.credenza}{" "}
            </dt>
            <dd className="inline font-bold">{credenza}</dd>
          </div>
          <div>
            <dt className="type-label inline text-inchiostro/45">
              {fin.finitura}{" "}
            </dt>
            <dd className="inline font-bold">{finitura}</dd>
          </div>
        </dl>

        <Condividi classe="ombra-pop-piccola mt-5 rounded-full bg-inchiostro px-8 py-3.5 text-[11.5px] font-bold uppercase tracking-[0.12em] text-panna transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-corallo-scena" />
      </div>

    </div>
  );
}
