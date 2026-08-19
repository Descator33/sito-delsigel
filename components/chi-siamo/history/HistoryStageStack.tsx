import Image from "next/image";
import type { CSSProperties } from "react";
import { OGGETTI_POP, STORIA } from "@/data/history";
import { HistoryStage } from "./HistoryStage";
import { PALCO } from "./palco";

/**
 * Il palco: la pila delle sei fasce e, in un livello a parte sopra di
 * lei, i ritagli pop.
 *
 * La pila è più alta del palco — sei fasce da `--fascia-h` che si
 * sovrappongono di `--fascia-sovrapposta` — e la differenza è tutto lo
 * spazio in cui deriva mentre si scorre. Le due misure stanno qui e
 * solo qui; la corsa che ne consegue è annotata in
 * `HistoryParallaxSection` (costante `CORSA`), che è l'unico punto in
 * cui i due numeri vanno riconciliati se si cambia l'altezza.
 *
 * I due livelli sono fratelli e non annidati: così i ritagli pop stanno
 * sopra il pannello di sinistra — come nel mockup, dove uno scavalca la
 * linea del tempo — mentre le fasce gli restano sotto.
 */
export function HistoryStageStack({ attiva }: { attiva: number }) {
  return (
    <>
      <div className={`${PALCO} z-0`}>
        <ol
          data-pila
          className="absolute inset-x-0 top-0 [--fascia-h:22vh] [--fascia-sovrapposta:-4vh] lg:[--fascia-h:24vh] lg:[--fascia-sovrapposta:-5vh]"
        >
          {STORIA.map((tappa, i) => (
            <HistoryStage key={tappa.id} tappa={tappa} indice={i} attiva={attiva} />
          ))}
        </ol>
      </div>

      <div aria-hidden className={`${PALCO} pointer-events-none z-20`}>
        {OGGETTI_POP.map((o) => (
          <span
            key={o.src}
            data-pop
            data-profondita={o.profondita}
            className="storia-pop absolute block drop-shadow-[0_18px_30px_rgba(0,0,0,0.6)]"
            style={
              {
                top: o.top,
                left: o.left,
                width: `${o.larghezza}vw`,
                rotate: `${o.rotazione}deg`,
              } as CSSProperties
            }
          >
            <Image
              src={o.src}
              alt=""
              width={o.w}
              height={o.h}
              loading="lazy"
              sizes="12vw"
              className="h-auto w-full"
            />
          </span>
        ))}
      </div>
    </>
  );
}
