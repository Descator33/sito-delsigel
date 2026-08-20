"use client";

import { useEffect, useRef, useState } from "react";
import {
  farcituraVoce,
  nomeCommerciale,
  toppingVoce,
  type Base,
  type Combinazione,
  type FotoTopping,
} from "@/lib/configuratore";
import { CampoPedane } from "./CampoPedane";
import { IconaLink, IconaSpunta } from "./Decori";
import { ImmagineProdotto } from "./ImmagineProdotto";
import { ModuloQuotazione } from "./ModuloQuotazione";
import { GrigliaTessere } from "./Selettore";
import { SegnaPosto, TesseraScelta, type VoloTessera } from "./TesseraScelta";
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
 * incompleto: niente formato, niente quantità, niente CTA. La tessera
 * mostra la finitura DA SOLA (cartelle di
 * public/img/configuratore/topping/): è la cosa che si trascina, non
 * il dolce finito.
 *
 * POI i numeri: applicata la finitura, arrivano gli attributi tecnici,
 * il formato letto dalla catena logistica e la quantità in pedane,
 * l'unica decisione numerica. La foto del prodotto non sta qui: è sul
 * palco, che in questa fase resta la colonna accanto.
 */
export function PassoFinitura({
  base,
  comb,
  fotoTopping,
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
  fotoTopping: FotoTopping;
  finituraApplicata: boolean;
  onApplicaFinitura: (volo?: VoloTessera) => void;
  drag?: DragPasso;
  pedane: number | "";
  onCambiaPedane: (v: number | "") => void;
  moduloAperto: boolean;
  onApriModulo: () => void;
}) {
  const farcitura = farcituraVoce(comb.farcitura)!;
  const topping = toppingVoce(comb.topping)!;
  const nome = nomeCommerciale(comb);
  /* la finitura da sola, come l'ingrediente al passo 2: cartella vuota →
     resa tipografica, mai la foto del prodotto completo (mostrerebbe il
     risultato prima del gesto) */
  const fotoT = fotoTopping[topping.id];

  if (!finituraApplicata) {
    return (
      <div>
        <p className="mb-6 max-w-[42ch] text-[14px] leading-relaxed text-inchiostro/70">
          {/* lo spazio esplicito: il testo che segue va a capo nel sorgente e
              il compilatore JSX lo mangerebbe, incollando «lamponeprevede» */}
          La ricetta di {nome} · {farcitura.nome.toLowerCase()}{" "}
          prevede una finitura precisa. Mettila tu: è l&apos;ultimo tocco del
          dolce.
        </p>
        <GrigliaTessere>
          <li>
            <TesseraScelta
              titolo={topping.nome}
              sotto="dalla ricetta"
              onScegli={(quadro) =>
                onApplicaFinitura(
                  quadro && {
                    quadro,
                    foto: fotoT ?? null,
                    iniziale: topping.nome.charAt(0),
                  }
                )
              }
              drag={
                drag
                  ? {
                      onSposta: drag.onSposta,
                      onRilascia: (p) => drag.onRilascia(topping.id, p),
                    }
                  : null
              }
            >
              {fotoT ? (
                <ImmagineProdotto
                  sorgenti={[fotoT]}
                  alt={topping.nome}
                  iniziale={topping.nome.charAt(0)}
                />
              ) : (
                <SegnaPosto testo={topping.nome} />
              )}
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

        <CopiaLink />
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

/**
 * «Copia il link del tuo dolce»: l'URL è già lo stato del prodotto
 * (base e farcitura, cioè lo SKU), quindi condividere la scheda è
 * copiare l'indirizzo — pensato per il buyer che gira la combinazione
 * a un collega. La finitura, di proposito, non viaggia: chi apre il
 * link rifà il gesto (decisione 2026-08-02, nessun automatismo).
 *
 * Si copia il pathname ricostruito, non l'href: eventuali query o
 * hash di sessione non appartengono al dolce. Il ripiego col textarea
 * copre i contesti senza Clipboard API (http, browser vecchi).
 */
function CopiaLink() {
  const [copiato, setCopiato] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);

  const copia = async () => {
    const url = window.location.origin + window.location.pathname;
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = url;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.append(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
    setCopiato(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopiato(false), 2400);
  };

  return (
    <button
      type="button"
      onClick={copia}
      className="mt-5 inline-flex w-fit items-center gap-2 rounded-full text-[12px] font-semibold text-inchiostro/60 underline decoration-inchiostro/25 underline-offset-2 transition-colors hover:text-corallo-scena focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-corallo-scena"
    >
      {copiato ? (
        <IconaSpunta className="h-3.5 w-3.5 text-corallo-scena" />
      ) : (
        <IconaLink className="h-3.5 w-3.5" />
      )}
      {copiato ? "Link copiato!" : "Copia il link del tuo dolce"}
      {/* l'esito anche a chi non vede il cambio di etichetta */}
      <span aria-live="polite" className="sr-only">
        {copiato ? "Link copiato negli appunti" : ""}
      </span>
    </button>
  );
}
