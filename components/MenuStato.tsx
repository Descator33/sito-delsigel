"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";
import { lenisAttivo } from "@/components/SmoothScroll";

/**
 * Lo stato del menu, sopra tutta l'applicazione (2026-08-12).
 *
 * Prima viveva dentro `Header`, e bastava: il menu era un pannello che
 * copriva la pagina, e alla pagina non importava. Ora no — aprendolo la
 * hero si rimpicciolisce e va in un angolo, quindi due componenti lontani
 * (la navigazione e la hero) devono guardare la stessa variabile. Da qui
 * il contesto: NON è una duplicazione della hero, è l'unica hero che
 * cambia impaginato. Con un eventuale video dentro, questa è la sola
 * strada che non lo fa ripartire.
 *
 * Il provider tiene anche i due effetti collaterali dell'apertura, che
 * sono di pagina e non di componente: lo scorrimento fermo e l'uscita con
 * Escape.
 */

type Menu = {
  aperto: boolean;
  commuta: () => void;
  chiudi: () => void;
};

const Contesto = createContext<Menu | null>(null);

export function useMenu(): Menu {
  const menu = useContext(Contesto);
  if (!menu) throw new Error("useMenu va usato dentro <MenuProvider>");
  return menu;
}

export function MenuProvider({ children }: { children: ReactNode }) {
  const percorso = usePathname();

  /* Lo stato non è "aperto sì/no" ma "su quale pagina è stato aperto".
     Costa una riga in più e ne risparmia un effetto: il provider vive nel
     layout e non si smonta cambiando rotta, quindi un booleano resterebbe
     acceso sulla pagina d'arrivo. Così invece la chiusura al cambio di
     rotta non è un effetto che insegue il percorso — è la definizione
     stessa di aperto. */
  const [pagina, setPagina] = useState<string | null>(null);
  const aperto = pagina === percorso;

  const chiudi = useCallback(() => setPagina(null), []);
  const commuta = useCallback(
    () => setPagina((p) => (p === percorso ? null : percorso)),
    [percorso],
  );

  /* Il menu è una pagina sopra la pagina: sotto non si scorre. Lenis
     riscrive lo scroll a ogni frame, quindi non basta `overflow: hidden`
     sul body — va fermato lui, e rimesso in moto alla chiusura.
     La barra di scorrimento che sparisce allargherebbe il viewport e
     farebbe saltare la pagina di quei pixel: li restituiamo come padding
     al body (per il contenuto in flusso) e come `--barra` alla
     navigazione, che è fissa e il padding del body non la tocca. */
  useEffect(() => {
    if (!aperto) return;

    const lenis = lenisAttivo();
    lenis?.stop();

    const barra = window.innerWidth - document.documentElement.clientWidth;
    const { overflow, paddingRight } = document.body.style;
    document.body.style.overflow = "hidden";
    if (barra > 0) {
      document.body.style.paddingRight = `${barra}px`;
      document.documentElement.style.setProperty("--barra", `${barra}px`);
    }

    const tasto = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPagina(null);
    };
    window.addEventListener("keydown", tasto);

    return () => {
      window.removeEventListener("keydown", tasto);
      document.body.style.overflow = overflow;
      document.body.style.paddingRight = paddingRight;
      document.documentElement.style.removeProperty("--barra");
      lenis?.start();
    };
  }, [aperto]);

  const valore = useMemo(() => ({ aperto, commuta, chiudi }), [aperto, commuta, chiudi]);

  return <Contesto.Provider value={valore}>{children}</Contesto.Provider>;
}
