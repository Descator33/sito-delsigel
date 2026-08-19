import { FINALE } from "@/data/history";
import { PALCO_PIENO } from "./palco";

/**
 * La chiusura del viaggio: si apre sull'ultima tappa, quando la pila
 * delle fasce arretra e il palco si schiarisce.
 *
 * Tre strati, tutti pilotati dalla timeline: il buio, che toglie voce
 * alle fasce; l'alba — un alone caldo di corallo e oro, il colore nuovo
 * del marchio — che le riscalda da dentro; la frase, che sale di poco
 * mentre compare. A riposo è tutto invisibile e fuori dal flusso del
 * puntatore: finché il finale non arriva, non esiste.
 *
 * Il finale copre il palco e solo il palco. Il pannello di sinistra
 * resta acceso: lì c'è già la frase dell'ultima tappa («Il forno resta
 * acceso»), e spegnerla per illuminare questa vorrebbe dire buttare via
 * la battuta migliore del capitolo.
 *
 * Il testo resta nel DOM anche prima di comparire, quindi chi legge con
 * uno screen reader trova la chiusura insieme al resto della storia
 * invece che al momento buono per chi guarda.
 */
export function HistoryFinale() {
  return (
    <div className={`${PALCO_PIENO} pointer-events-none z-30`}>
      <span
        aria-hidden
        data-buio
        className="absolute inset-0 bg-inchiostro opacity-0"
      />
      <span
        aria-hidden
        data-alba
        className="storia-alba absolute inset-0 opacity-0"
      />

      <div
        data-finale
        className="absolute inset-0 flex flex-col items-center justify-center px-10 text-center opacity-0"
      >
        <p className="type-label text-corallo">{FINALE.eyebrow}</p>
        <p className="type-display mt-6 text-[clamp(1.5rem,3.4vw,3rem)] leading-[0.95] text-panna">
          {FINALE.frase[0]}
          <br />
          <span className="text-corallo">{FINALE.frase[1]}</span>
        </p>
        <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.28em] text-panna/50">
          {FINALE.coda}
        </p>
      </div>
    </div>
  );
}
