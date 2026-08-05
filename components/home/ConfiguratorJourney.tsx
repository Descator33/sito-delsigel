"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import {
  ANCORA_PERCORSO,
  PERCORSO,
  type DolceConFoto,
} from "@/lib/percorso-configuratore";
import { ConfiguratorStepCard } from "./ConfiguratorStepCard";
import { ConveyorBelt } from "./ConveyorBelt";

/**
 * Il percorso: quattro tappe in fila, il nastro che ci passa dietro e i
 * tre stati del dolce che ci scorrono sopra.
 *
 * Le due file NON sono la stessa griglia, ed è voluto: le tappe sono
 * quattro colonne, i dolci tre, distribuiti proporzionalmente sulla
 * stessa larghezza. Sono due ritmi sovrapposti — il dolce non
 * «appartiene» a una tappa, attraversa la fila mentre si compone, che è
 * quello che fa su un nastro vero. L'incolonnamento uno a uno
 * costringerebbe a ripetere una fotografia, e sul nastro una foto
 * ripetuta si legge come un errore.
 *
 * Le frecce non sono una terza fila: vivono dentro la card e si spostano
 * nel vuoto alla loro destra, così non occupano colonne.
 *
 * Sotto xl la fila esce dalla colonna e diventa un binario a scorrimento
 * con l'aggancio: quattro card minuscole su un telefono non le legge
 * nessuno, e comprimere il nastro lo farebbe sparire. Lo scorrimento è
 * confinato qui — la pagina non si muove mai in orizzontale.
 *
 * Isola client: qui vivono l'ingresso scaglionato e la lettura della
 * preferenza di movimento. I dati arrivano già risolti dal server.
 */

/* le due entrate possibili: con e senza movimento. Non è una scelta
   estetica ma la stessa informazione detta in due modi — chi ha chiesto
   di non avere animazioni vede comparire, non salire. */
const FERMO = { riposo: { opacity: 0 }, entra: { opacity: 1 } };
const SALITA = { riposo: { opacity: 0, y: 22 }, entra: { opacity: 1, y: 0 } };

export function ConfiguratorJourney({ dolci }: { dolci: DolceConFoto[] }) {
  const ridotto = useReducedMotion();
  const varianti = ridotto ? FERMO : SALITA;

  return (
    /* `min-w-0`: senza, la misura minima di questa colonna la detta la
       fila (50rem) e non il binario che la contiene */
    <div id={ANCORA_PERCORSO} className="min-w-0 scroll-mt-28">
      {/* `tabIndex` sul binario: una regione che scorre deve poterlo fare
          anche da tastiera, e qui dentro non c'è nulla di focalizzabile
          che ci arrivi da solo */}
      <div
        tabIndex={0}
        role="group"
        aria-label="Le quattro tappe del configuratore"
        className="no-scrollbar percorso-binario -mx-6 overflow-x-auto px-6 pb-8 pt-4 md:-mx-12 md:px-12 xl:mx-0 xl:overflow-x-visible xl:px-0"
      >
        <div className="percorso-scena min-w-[50rem] xl:min-w-0">
          <ConveyorBelt />

          <motion.ol
            initial="riposo"
            whileInView="entra"
            viewport={{ once: true, amount: 0.3 }}
            variants={{ entra: { transition: { staggerChildren: 0.07 } } }}
            className="percorso-fila relative z-10"
          >
            {PERCORSO.map((tappa, i) => (
              <ConfiguratorStepCard
                key={tappa.numero}
                tappa={tappa}
                indice={i}
                varianti={varianti}
                ridotto={!!ridotto}
                ultima={i === PERCORSO.length - 1}
              />
            ))}
          </motion.ol>

          {/* i dolci vengono dopo le card nel documento: è l'ordine di
              sovrapposizione che serve (il dolce sta davanti alla card che
              gli sta sopra, il nastro dietro a tutto), e non serve nessuno
              z-index acrobatico per ottenerlo */}
          <div className="percorso-dolci relative z-20">
            {dolci.map((dolce, i) => (
              <DolceSulNastro
                key={dolce.stato}
                dolce={dolce}
                indice={i}
                fermo={!!ridotto}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Uno stato del dolce appoggiato sul nastro.
 *
 * La foto è `alt=""`: il dolce ripete visivamente ciò che le tappe
 * accanto dicono a parole, e leggerne tre descrizioni di fila non
 * aggiunge niente a chi ascolta la pagina. Il nome vero resta comunque
 * nel `title` per chi passa col mouse.
 *
 * L'ondeggiamento è CSS e sposta solo il `transform` (nessun ricalcolo di
 * impaginato); lo sfasamento per indice evita che i dolci si muovano
 * all'unisono, che è ciò che farebbe sembrare il tutto una GIF.
 */
function DolceSulNastro({
  dolce,
  indice,
  fermo,
}: {
  dolce: DolceConFoto;
  indice: number;
  fermo: boolean;
}) {
  return (
    <div
      className="percorso-dolce relative"
      style={fermo ? undefined : { animationDelay: `${indice * 0.55}s` }}
    >
      <span
        aria-hidden
        className="percorso-ombra absolute bottom-[3%] left-1/2 h-[16%] w-[64%] -translate-x-1/2"
      />
      {dolce.foto ? (
        <Image
          src={dolce.foto}
          alt=""
          title={dolce.alt}
          fill
          /* molto sotto la piega: nessun preload, resta pigra */
          sizes="(max-width: 1279px) 180px, 13vw"
          className="percorso-foto select-none object-contain object-bottom"
          draggable={false}
        />
      ) : (
        /* la foto di quello stato non è ancora in cartella: al suo posto
           un disco muto, che tiene il passo sul nastro senza mentire */
        <span
          aria-hidden
          className="absolute inset-x-[22%] bottom-0 h-[38%] rounded-full border border-dashed border-cacao/25 bg-cacao/5"
        />
      )}
    </div>
  );
}
