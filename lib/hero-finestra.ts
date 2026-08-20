/**
 * La geometria del menu che ricompone la pagina (2026-08-12).
 *
 * Aprendo il menu la home non riceve un pannello sopra: cambia
 * composizione. La hero smette di essere il primo viewport e diventa una
 * finestra appoggiata all'angolo in basso a destra, mentre il menu usa la
 * campitura POP del sito. Chiudendo, la finestra torna
 * esattamente dov'era — al pixel, perché il punto di partenza non è un
 * numero scritto qui ma la misura reale della sezione (`getBoundingClientRect`
 * in Hero.tsx): la hero non "sa" di essere a tutto schermo, ci torna.
 *
 * QUI si cambiano le due sole cose che decidono l'effetto: la misura della
 * finestra a menu aperto e il tempo dell'animazione. Nient'altro nel
 * codice conosce questi numeri.
 */

/** Durata della ricomposizione, in secondi. Sotto i 0.7 sembra un menu,
 *  sopra 1.1 sembra lento: 0.9 è il passo "editoriale" del riferimento. */
export const DURATA_MENU = 0.9;

/** La finestra parte un soffio dopo la campitura del menu: è quel
 *  ritardo minimo a far leggere l'ordine degli eventi invece di uno stacco. */
export const RITARDO_FINESTRA = 0.05;

/** Ease deciso, senza rimbalzo: parte lenta, prende velocità in mezzo,
 *  si posa. Un `spring` qui darebbe l'overshoot che non vogliamo. */
export const EASE_MENU = [0.76, 0, 0.24, 1] as const;

/** Le voci del menu entrano scaglionate di questo passo (secondi). */
export const PASSO_VOCI = 0.05;
/** ...e non prima che la finestra si sia mossa. */
export const ATTESA_VOCI = 0.15;

export type Finestra = {
  /** rettangolo in pixel, coordinate viewport (position: fixed) */
  top: number;
  left: number;
  width: number;
  height: number;
  /** quanto rimpicciolire insegna, descrizione e invito dentro la finestra */
  scala: number;
  /** se false la finestra resta la sola fotografia: non c'è spazio per il testo */
  testo: boolean;
};

/**
 * Il rettangolo della hero a menu aperto, misurato sul viewport corrente.
 *
 * Sempre a filo dei bordi destro e basso — è l'asimmetria a fare l'effetto:
 * la finestra non è una card centrata, è la pagina che si è spostata in un
 * angolo. Il vuoto in alto a sinistra è la navigazione.
 *
 * Tre tagli, per forma dello schermo e non per moda:
 *
 *   ≥1024  52vw × 56vh — il menu tiene la metà sinistra, come nel mockup
 *    ≥640  62vw × 30vh — su tablet resta una fascia fotografica e il
 *                        menu esteso conserva il proprio spazio di lettura
 *    <640  100vw × 24vh — sul telefono non esiste una "metà sinistra": il
 *                        menu prende tutto e la hero resta una striscia di
 *                        anteprima sul fondo, senza testo (non ci sta, e
 *                        rimpicciolito sarebbe illeggibile)
 */
export function finestraHero(): Finestra {
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  if (vw >= 1024) {
    const width = vw * 0.52;
    const corta = vh < 700;
    const height = vh * (corta ? 0.42 : 0.56);
    return {
      top: vh - height,
      left: vw - width,
      width,
      height,
      scala: corta ? 0.48 : 0.56,
      testo: !corta,
    };
  }

  if (vw >= 640) {
    const width = vw * 0.62;
    const height = vh * 0.3;
    return {
      top: vh - height,
      left: vw - width,
      width,
      height,
      scala: 0.5,
      testo: false,
    };
  }

  const height = vh * 0.24;
  return { top: vh - height, left: 0, width: vw, height, scala: 0.42, testo: false };
}
