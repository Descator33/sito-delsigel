/**
 * Come la moviescroller, la porta d'ingresso si attraversa una sola volta
 * per scheda. `sessionStorage` conserva il passaggio anche dopo un refresh,
 * senza trasformarlo in una preferenza permanente come farebbe localStorage.
 */
export const CHIAVE_PORTA_ATTRAVERSATA = "delsigel:porta-attraversata-v1";
export const ATTRIBUTO_PORTA_DI_RITORNO = "data-porta-di-ritorno";

export function portaGiaAttraversata() {
  if (typeof window === "undefined") return false;

  try {
    return window.sessionStorage.getItem(CHIAVE_PORTA_ATTRAVERSATA) === "1";
  } catch {
    /* Storage puo essere negato (privacy mode, policy aziendali). In quel
       caso resta il ripiego in memoria dentro il PreloaderProvider. */
    return false;
  }
}

export function ricordaPortaAttraversata() {
  if (typeof window === "undefined") return;

  try {
    window.sessionStorage.setItem(CHIAVE_PORTA_ATTRAVERSATA, "1");
  } catch {
    /* Il ripiego in memoria vive nel PreloaderProvider. */
  }
}
