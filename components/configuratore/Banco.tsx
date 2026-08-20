"use client";

import type { Ref } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  farcituraVoce,
  nomeCommerciale,
  type Base,
  type Combinazione,
  type FotoStati,
} from "@/lib/configuratore";
import { Alzata } from "./Alzata";
import { Asterisco, FrecciaGiu, IconaMano, Scintilla, Smile } from "./Decori";
import { ImmagineProdotto } from "./ImmagineProdotto";

/**
 * Il palco del pasticcere: la vetrina su cui il dolce si compone, e il
 * bersaglio del drag & drop. Il ref esposto serve al Configuratore per
 * il hit-test del rilascio; `sopra` accende tutta la scena attraverso
 * l'unico data-attribute `data-sopra` (stili in «Configuratore: il
 * palco» di globals.css) — cornice, cerchio, alone e scintille
 * rispondono da soli, senza che una prop scenda fino alle foglie e
 * senza far ridisegnare la griglia dei prodotti a ogni pixel di drag.
 *
 * Geometria: tutto è in percentuale del palco, tranne il dolce, che è
 * in percentuale dell'ALZATA — deve poggiare sul piano, e il piano è
 * alto quanto è larga l'alzata, non quanto è alto il palco. Il piano
 * sta al 13% dell'altezza dell'SVG (vedi Alzata): da lì il
 * `bottom-[87%]` del prodotto.
 *
 * Il dolce è COMPLETO solo quando la finitura è stata applicata dal
 * gesto dell'utente (decisione 2026-08-02: niente automatismi, mai):
 * fino a quel momento il bersaglio resta acceso. Le foto vengono dalle
 * cartelle di stato (prop `foto`, scoperta dal server): a ogni fase la
 * sua — base → farcito senza finitura → completo — e dove la foto non
 * è ancora arrivata si ripiega sullo stato precedente, che è onesto
 * perché mostra sempre MENO del configurato, mai un'altra farcitura.
 */
export function Banco({
  base,
  comb,
  foto,
  finituraApplicata,
  sopra,
  passo,
  apriPasso,
  onRicomincia,
  ref,
}: {
  base: Base | null;
  comb: Combinazione | null;
  /** stato → URL foto dalle cartelle di public/img/configuratore/prodotti */
  foto: FotoStati;
  /** la finitura è stata trascinata (o toccata) dall'utente */
  finituraApplicata: boolean;
  /** una tessera in trascinamento è sopra il palco */
  sopra: boolean;
  passo: 1 | 2 | 3;
  apriPasso: (passo: 1 | 2) => void;
  onRicomincia: () => void;
  ref?: Ref<HTMLDivElement>;
}) {
  const riduci = useReducedMotion();
  const farcitura = comb ? farcituraVoce(comb.farcitura) : null;
  const completato = Boolean(comb) && finituraApplicata;
  const vuoto = !base;

  /* le tre cartelle di stato del prodotto corrente */
  const fotoCompleta = comb ? foto[`${comb.sku}--${comb.topping}`] : undefined;
  const fotoFarcito = comb ? foto[comb.sku] : undefined;
  const fotoBase = base ? foto[base.id] : undefined;

  /* la chiave governa il crossfade: cambia quando cambia ciò che si
     vede — sempre al gesto della finitura (spolverata compresa), alla
     scelta della farcitura solo se la foto del farcito esiste davvero
     (senza, resterebbe la stessa base: niente ricaduta a vuoto) */
  const chiave = completato
    ? `${comb!.sku}--finito`
    : fotoFarcito
      ? comb!.sku
      : (base?.id ?? "vuoto");

  /* finché il dolce non è completo c'è sempre qualcosa da trascinare:
     una base, una farcitura o la finitura */
  const dropAttivo = !completato;

  const cosaManca =
    passo === 1 ? "la tua base" : passo === 2 ? "la farcitura" : "la finitura";

  const nomeInScena = comb
    ? `${nomeCommerciale(comb)} · ${farcitura!.nome.toLowerCase()}`
    : (base?.nome ?? "");

  return (
    <motion.div
      ref={ref}
      role="region"
      aria-label={
        vuoto
          ? "Palco del configuratore, vuoto: trascina o tocca una base per posarla sull'alzata"
          : `Palco del configuratore: ${nomeInScena} sull'alzata${
              dropAttivo ? `. Manca ${cosaManca}` : ""
            }`
      }
      data-sopra={dropAttivo && sopra ? "true" : "false"}
      className="palco ombra-pop aspect-[93/100] min-h-[500px] w-full sm:min-h-[560px]"
      animate={
        riduci ? undefined : dropAttivo && sopra ? { scale: 1.012, y: -4 } : { scale: 1, y: 0 }
      }
      transition={{ type: "spring", stiffness: 320, damping: 26 }}
    >
      <span aria-hidden className="palco-cornice" />

      {/* --- i decori: leggeri, mai sopra a qualcosa da leggere -----
          Sfoltiti il 2026-08-19: restano i due segni agli angoli, fermi.
          L'adesivo «il tuo dolce, la tua storia», il fumetto col cuore e
          le scintille immobili sono usciti di scena — il centro del
          palco è del dolce. */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <Smile className="absolute -right-[3%] -top-[3.5%] w-[11%] min-w-[58px]" />
        <Asterisco className="absolute -bottom-[2%] -left-[1.5%] w-[9%] min-w-[46px] text-corallo-scena" />

        {/* queste tre esistono solo durante il sorvolo */}
        <Scintilla className="scintilla-drag absolute left-[30%] top-[36%] w-[3%] min-w-[13px] text-oro" />
        <Scintilla className="scintilla-drag absolute right-[31%] top-[43%] w-[3.4%] min-w-[15px] text-oro" />
        <Scintilla className="scintilla-drag absolute left-[44%] top-[12%] w-[2.6%] min-w-[12px] text-corallo-scena" />
      </div>

      {/* --- l'invito: la scritta e la freccia -----------------------
          Il cerchio tratteggiato è uscito il 2026-08-19 e per un po'
          sopra l'alzata è restata la sola freccia: puntava al piano
          senza dire che farne, e il palco vuoto si leggeva come un
          decoro (rilievo 2026-08-20). Torna una scritta, ma sopra la
          freccia e a mano: dice il gesto («trascina qui») e la via
          alternativa per chi è sul touch, dove il drag non è ovvio.

          Le quote restano sul palco, non su una scatola — 44.1% = 20%
          + 71% di 34%, 5.85% = 16% di 34% di altezza riportato in
          larghezza (il palco è 93/100). La scritta è ancorata alla
          stessa quota della freccia e sale della propria altezza: se
          la copy cambia, la freccia non si muove.

          Tutto aria-hidden: la scena si racconta una volta sola,
          nell'aria-label del palco. */}
      {dropAttivo && vuoto && (
        <>
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-[44.1%] flex -translate-y-[calc(100%+12px)] flex-col items-center gap-1 px-[12%] text-center"
          >
            <span
              className={`type-scritta -rotate-2 text-[22px] leading-tight transition-colors duration-200 sm:text-[28px] ${
                sopra ? "text-corallo-scena" : "text-inchiostro/85"
              }`}
            >
              {sopra ? (
                "Perfetto, lascia qui!"
              ) : (
                <>
                  <span className="invito-mouse">Trascina qui la tua base</span>
                  <span className="invito-touch">Tocca una base per iniziare</span>
                </>
              )}
            </span>
            {/* la seconda via serve a chi non ha ancora cominciato:
                mentre la tessera è in volo sarebbe un consiglio dato
                troppo tardi */}
            {!sopra && (
              <span className="flex items-center gap-1.5 text-inchiostro/45">
                <IconaMano className="h-3.5 w-3.5" />
                <span className="type-label text-[9px] sm:text-[10px]">
                  <span className="invito-mouse">o toccala nella lista</span>
                  <span className="invito-touch">o trascinala fin qui</span>
                </span>
              </span>
            )}
          </div>

          <motion.span
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-[44.1%] block w-[5.85%] min-w-[32px] -translate-x-1/2 text-corallo-scena"
            animate={riduci || sopra ? { y: 0 } : { y: [0, 5, 0] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          >
            <FrecciaGiu className="w-full" />
          </motion.span>
        </>
      )}

      {/* --- l'alzata e il dolce ------------------------------------- */}
      <motion.div
        className="absolute inset-x-0 bottom-[16%] mx-auto w-[79%]"
        animate={riduci ? undefined : sopra && dropAttivo ? { y: -10 } : { y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 22 }}
      >
        <Alzata className="block w-full" />

        <AnimatePresence mode="wait">
          {base && (
            <motion.div
              key={chiave}
              /* il bordo inferiore cade sulla quota di appoggio del
                 piano (13% dell'altezza dell'SVG): il dolce poggia,
                 non fluttua */
              className="absolute bottom-[87%] left-[24%] h-[133%] w-[52%]"
              initial={riduci ? { opacity: 0 } : { y: -26, scale: 0.92, opacity: 0 }}
              animate={riduci ? { opacity: 1 } : { y: 0, scale: 1, opacity: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.95, transition: { duration: 0.18 } }}
              transition={{ type: "spring", stiffness: 300, damping: 22 }}
            >
              <ImmagineProdotto
                sorgenti={
                  completato
                    ? [fotoCompleta, fotoFarcito, fotoBase]
                    : comb
                      ? [fotoFarcito, fotoBase]
                      : [fotoBase]
                }
                alt={
                  comb
                    ? `${nomeCommerciale(comb)} con ${farcitura!.nome.toLowerCase()}`
                    : base.nome
                }
                iniziale={base.nome.charAt(0)}
                notaRipiego={
                  completato ? "Foto senza finitura — descritta accanto" : undefined
                }
                classe="absolute inset-0 h-full w-full object-contain object-bottom"
              />
            </motion.div>
          )}
        </AnimatePresence>

        {completato && !riduci && (
          <div
            aria-hidden
            className="pointer-events-none absolute bottom-[87%] left-[24%] h-[133%] w-[52%]"
          >
            <Spolverata key={comb!.sku} />
          </div>
        )}
      </motion.div>

      {/* --- la pillola di stato, con le azioni discrete -------------
          A palco vuoto non c'è: l'istruzione la dà l'invito sopra la
          freccia, e ripeterla anche qui sotto (2026-08-20) faceva tre
          righe di testo su una scena che ne chiede una. La pillola
          torna quando c'è un dolce da nominare e da correggere. */}
      {!vuoto && (
        <div className="absolute inset-x-0 bottom-[5%] flex justify-center px-[8%]">
          <div className="flex max-w-full flex-wrap items-center justify-center gap-x-2.5 gap-y-1 rounded-full border border-linea bg-carta px-4 py-2.5 shadow-[0_2px_10px_rgba(107,60,30,0.06)] sm:px-5">
            <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-corallo-scena" />
            <span className="text-[12px] font-bold text-inchiostro sm:text-[13px]">
              {nomeInScena}
            </span>
            <span aria-hidden className="text-inchiostro/25">
              ·
            </span>
            <button
              type="button"
              onClick={() => apriPasso(passo === 3 ? 2 : 1)}
              className="rounded-full text-[12px] text-inchiostro/60 underline decoration-inchiostro/25 underline-offset-2 transition-colors hover:text-corallo-scena focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-corallo-scena"
            >
              {passo === 3 ? "Cambia farcitura" : "Cambia base"}
            </button>
            <button
              type="button"
              onClick={onRicomincia}
              className="rounded-full text-[12px] text-inchiostro/60 underline decoration-inchiostro/25 underline-offset-2 transition-colors hover:text-corallo-scena focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-corallo-scena"
            >
              Ricomincia
            </button>
            <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-corallo-scena" />
          </div>
        </div>
      )}
    </motion.div>
  );
}

/** La spolverata della finitura: quattordici grani che cadono sul
 *  dolce, sfalsati e di misura diversa, uno dorato ogni cinque. Tutto
 *  derivato dall'indice: la scena è identica a ogni replay. */
function Spolverata() {
  const grani = Array.from({ length: 14 }, (_, i) => ({
    sx: 16 + ((i * 47) % 68),
    ritardo: (i % 7) * 0.055,
    durata: 0.7 + (i % 4) * 0.09,
    misura: 3 + (i % 3),
    oro: i % 5 === 0,
  }));
  return (
    <div className="absolute inset-0">
      {grani.map((g, i) => (
        <motion.span
          key={i}
          className={`absolute rounded-full ${g.oro ? "bg-oro" : "bg-white"}`}
          style={{ left: `${g.sx}%`, width: g.misura, height: g.misura }}
          initial={{ top: "4%", opacity: 0 }}
          animate={{ top: "62%", opacity: [0, 1, 1, 0] }}
          transition={{ duration: g.durata, delay: 0.15 + g.ritardo, ease: "easeIn" }}
        />
      ))}
    </div>
  );
}
