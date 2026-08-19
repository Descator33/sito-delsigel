import Image from "next/image";
import type { CSSProperties } from "react";
import type { TappaStoria } from "@/data/history";

/**
 * Una fascia narrativa: la scena di una singola tappa.
 *
 * È fatta di quattro strati sovrapposti, dal fondo alla superficie —
 * la fotografia, il fondino scuro che le toglie luce, il velo nel
 * colore della tappa e il testo. Il bordo strappato è un clip-path
 * parametrico (`.storia-fascia` in globals.css): gli otto vertici
 * arrivano da qui, così le sei fasce non sono mai identiche.
 *
 * Il componente non sa nulla dello scroll: espone solo gli agganci che
 * la timeline GSAP va a cercare (`data-fascia`, `data-foto`, `data-velo`,
 * `data-testo`) e si limita a disegnare lo stato di riposo.
 */

/* Lo scarto orizzontale di ogni fascia. È quel che rompe il bordo di
   sinistra e fa leggere la pila come un collage invece che come una
   colonna: nel mockup nessuna fascia comincia dove comincia l'altra.
   Le fasce sono più larghe del palco (`w-[112%]`), quindi anche la più
   arretrata continua a sbordare a destra. */
const SCARTI = ["0%", "3%", "-3%", "2%", "-4%", "4%"];

/* i profili strappati: otto quote per fascia, scelte a mano e ferme.
   Una sequenza casuale cambierebbe a ogni render e con il server non
   tornerebbe. */
const PROFILI = [
  { t0: "3%", t1: "0%", t2: "4%", t3: "1%", b0: "97%", b1: "100%", b2: "96%", b3: "99%" },
  { t0: "0%", t1: "3%", t2: "1%", t3: "4%", b0: "100%", b1: "96%", b2: "99%", b3: "95%" },
  { t0: "4%", t1: "1%", t2: "3%", t3: "0%", b0: "96%", b1: "99%", b2: "100%", b3: "97%" },
  { t0: "1%", t1: "4%", t2: "0%", t3: "3%", b0: "99%", b1: "95%", b2: "98%", b3: "100%" },
  { t0: "2%", t1: "0%", t2: "4%", t3: "2%", b0: "98%", b1: "100%", b2: "95%", b3: "98%" },
  { t0: "0%", t1: "2%", t2: "1%", t3: "4%", b0: "100%", b1: "97%", b2: "99%", b3: "96%" },
];

export function HistoryStage({
  tappa,
  indice,
  attiva,
}: {
  tappa: TappaStoria;
  indice: number;
  /** quale tappa comanda ora: decide solo l'ordine di impilamento */
  attiva: number;
}) {
  const p = PROFILI[indice % PROFILI.length];

  return (
    <li
      data-fascia
      aria-current={indice === attiva ? "step" : undefined}
      className="storia-fascia storia-spessore relative w-[112%] list-none"
      style={
        {
          "--accento": tappa.colore,
          "--t0": p.t0,
          "--t1": p.t1,
          "--t2": p.t2,
          "--t3": p.t3,
          "--b0": p.b0,
          "--b1": p.b1,
          "--b2": p.b2,
          "--b3": p.b3,
          height: "var(--fascia-h)",
          /* le fasce si sovrappongono di un filo: è quel che le fa
             leggere impilate invece che affiancate */
          marginTop: indice === 0 ? undefined : "var(--fascia-sovrapposta)",
          marginLeft: SCARTI[indice % SCARTI.length],
          /* la fascia attiva viene davanti: cresce di scala e non deve
             finire sotto il bordo di quella dopo. È un cambio per tappa,
             non per pixel — lo tiene React, non la timeline. */
          zIndex: indice === attiva ? 20 : indice + 1,
        } as CSSProperties
      }
    >
      {/* la fotografia sborda in verticale: è lo spazio in cui si muove
          il parallasse interno */}
      <div className="absolute inset-0 overflow-hidden">
        <div data-foto className="absolute inset-x-0 -inset-y-[14%]">
          <Image
            src={tappa.immagine}
            alt={tappa.alt}
            fill
            loading="lazy"
            sizes="(min-width: 1024px) 64vw, (min-width: 768px) 78vw, 100vw"
            className="object-cover"
            style={{ objectPosition: tappa.posizione }}
          />
        </div>
      </div>

      <span aria-hidden className="storia-fondino absolute inset-0" />
      <span aria-hidden data-velo className="storia-velo absolute inset-0" />

      {/* il testo della tappa: sta sul lato pieno del velo, dove il
          contrasto regge */}
      <div className="relative flex h-full flex-col justify-center px-6 md:px-8 lg:px-12">
        <div className="max-w-[30ch]">
          <h3
            data-testo
            className="type-display text-[clamp(1.35rem,2.6vw,2.5rem)] leading-[0.98] text-panna"
          >
            {tappa.titolo}
          </h3>
          <p
            data-testo
            className="type-display mt-1 text-[clamp(0.8rem,1.15vw,1.05rem)] leading-tight text-panna/85"
          >
            {tappa.sottotitolo}
          </p>
          <p
            data-testo
            className="mt-2.5 max-w-[34ch] text-[clamp(11px,0.85vw,13.5px)] leading-[1.55] text-panna/75"
          >
            {tappa.descrizione}
          </p>
        </div>
      </div>
    </li>
  );
}
