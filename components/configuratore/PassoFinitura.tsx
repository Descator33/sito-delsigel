"use client";

import {
  farcituraVoce,
  nomeCommerciale,
  toppingVoce,
  type Base,
  type Combinazione,
} from "@/lib/configuratore";
import { CampoPedane } from "./CampoPedane";
import { ModuloQuotazione } from "./ModuloQuotazione";
import { GrigliaTessere } from "./Selettore";
import { SegnaPosto, TesseraScelta } from "./TesseraScelta";
import { ScalaFormato } from "./ScalaFormato";
import type { DragPasso } from "./PassoBase";

/**
 * Passo 3 — in due tempi.
 *
 * PRIMA il gesto: la ricetta decide QUALE finitura, ma non la applica
 * mai da sola (decisione del 2026-08-02, che supera la spec: una
 * scelta fatta al posto dell'utente peggiora la UX anche quando
 * l'opzione è una). La finitura è una tessera come le altre — si
 * trascina sul palco o si tocca — e finché non atterra il dolce resta
 * incompleto: niente formato, niente quantità, niente CTA.
 *
 * POI i numeri: applicata la finitura, arrivano gli attributi tecnici,
 * il formato letto dalla catena logistica e la quantità in pedane,
 * l'unica decisione numerica. La foto del prodotto non sta qui: è sul
 * palco, che in questa fase resta la colonna accanto.
 */
export function PassoFinitura({
  base,
  comb,
  finituraApplicata,
  onApplicaFinitura,
  drag,
  pedane,
  onCambiaPedane,
  moduloAperto,
  onApriModulo,
}: {
  base: Base;
  comb: Combinazione;
  finituraApplicata: boolean;
  onApplicaFinitura: () => void;
  drag?: DragPasso;
  pedane: number | "";
  onCambiaPedane: (v: number | "") => void;
  moduloAperto: boolean;
  onApriModulo: () => void;
}) {
  const farcitura = farcituraVoce(comb.farcitura)!;
  const topping = toppingVoce(comb.topping)!;
  const nome = nomeCommerciale(comb);

  if (!finituraApplicata) {
    return (
      <div>
        <p className="mb-6 max-w-[42ch] text-[14px] leading-relaxed text-inchiostro/70">
          La ricetta di {nome} · {farcitura.nome.toLowerCase()} prevede una
          finitura precisa. Mettila tu: è l&apos;ultimo tocco del dolce.
        </p>
        <GrigliaTessere>
          <li>
            <TesseraScelta
              titolo={topping.nome}
              sotto="dalla ricetta"
              onScegli={onApplicaFinitura}
              drag={
                drag
                  ? {
                      onSposta: drag.onSposta,
                      onRilascia: (p) => drag.onRilascia(topping.id, p),
                    }
                  : null
              }
            >
              <SegnaPosto testo={topping.nome} />
            </TesseraScelta>
          </li>
        </GrigliaTessere>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-9">
      <div>
        <p className="font-display text-[clamp(1.35rem,2.2vw,1.9rem)] font-extrabold leading-[1.05] tracking-[-0.02em]">
          {nome} · {farcitura.nome} è completo, con{" "}
          <span className="text-corallo-scena">{topping.nome.toLowerCase()}</span>.
        </p>
        <p className="mt-3 max-w-[46ch] text-[14px] leading-relaxed text-inchiostro/70">
          La finitura è quella che la ricetta prevede per questa combinazione:
          l&apos;hai messa tu.
        </p>
        <dl className="mt-5 flex flex-wrap gap-x-7 gap-y-2 font-mono text-[13px]">
          <div>
            <dt className="type-label inline text-inchiostro/45">Grammatura </dt>
            <dd className="inline font-bold">{comb.grammatura_gr} g</dd>
          </div>
          <div>
            <dt className="type-label inline text-inchiostro/45">Diametro </dt>
            <dd className="inline font-bold">{base.diametro_cm} cm</dd>
          </div>
          <div className="basis-full">
            <dt className="type-label inline text-inchiostro/45">
              Modalità d&apos;uso{" "}
            </dt>
            <dd className="inline">{base.modalita_uso.toLowerCase()}</dd>
          </div>
        </dl>
      </div>

      <ScalaFormato base={base} comb={comb} />

      <CampoPedane
        base={base}
        comb={comb}
        pedane={pedane}
        onCambia={onCambiaPedane}
      />

      {!moduloAperto ? (
        <button
          type="button"
          onClick={onApriModulo}
          className="ombra-pop-piccola w-fit rounded-full bg-inchiostro px-8 py-3.5 text-[11.5px] font-bold uppercase tracking-[0.12em] text-panna transition-transform hover:-translate-y-0.5 active:translate-y-0 focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-corallo-scena motion-reduce:transition-none motion-reduce:hover:translate-y-0"
        >
          Richiedi la quotazione →
        </button>
      ) : (
        <ModuloQuotazione comb={comb} pedane={pedane} />
      )}
    </div>
  );
}
