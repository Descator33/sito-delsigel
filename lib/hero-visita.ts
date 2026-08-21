/**
 * La moviescroller e una porta d'ingresso: si attraversa una sola volta per
 * scheda. `sessionStorage` conserva questa intenzione anche dopo un refresh,
 * senza trasformarla in una preferenza permanente come farebbe localStorage.
 */
export const CHIAVE_HERO_VISITATA = "delsigel:hero-visitata-v1";
export const ATTRIBUTO_HERO_DI_RITORNO = "data-hero-di-ritorno";

export function heroGiaVisitata() {
  if (typeof window === "undefined") return false;

  try {
    return window.sessionStorage.getItem(CHIAVE_HERO_VISITATA) === "1";
  } catch {
    /* Storage puo essere negato (privacy mode, policy aziendali). In quel
       caso resta comunque valido lo stato del provider finche la pagina vive. */
    return false;
  }
}

export function ricordaHeroVisitata() {
  if (typeof window === "undefined") return;

  try {
    window.sessionStorage.setItem(CHIAVE_HERO_VISITATA, "1");
  } catch {
    /* Il fallback in memoria vive nel MenuProvider. */
  }
}

export function marcaDocumentoDiRitorno() {
  if (typeof document === "undefined") return;
  document.documentElement.setAttribute(ATTRIBUTO_HERO_DI_RITORNO, "");
}
