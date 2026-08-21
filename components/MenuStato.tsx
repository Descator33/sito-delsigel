"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";
import { lenisAttivo } from "@/components/SmoothScroll";
import {
  heroGiaVisitata,
  marcaDocumentoDiRitorno,
  ricordaHeroVisitata,
} from "@/lib/hero-visita";

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
  heroDiRitorno: boolean;
  preparaRitornoHome: () => void;
};

const Contesto = createContext<Menu | null>(null);

export function useMenu(): Menu {
  const menu = useContext(Contesto);
  if (!menu) throw new Error("useMenu va usato dentro <MenuProvider>");
  return menu;
}

export function MenuProvider({ children }: { children: ReactNode }) {
  const percorso = usePathname();
  const [heroDiRitorno, setHeroDiRitorno] = useState(false);
  const homeVisitata = useRef(false);
  const percorsoIniziale = useRef(percorso);
  const percorsoPrecedente = useRef(percorso);
  const visitataPrimaDelDocumento = useRef<boolean | null>(null);

  const attivaHeroDiRitorno = useCallback(() => {
    homeVisitata.current = true;
    ricordaHeroVisitata();
    marcaDocumentoDiRitorno();
    setHeroDiRitorno(true);
  }, []);

  /* Sul caricamento completo lo script nel layout ha gia corretto il CSS
     prima del paint; qui si riallinea lo stato React. Il ref conserva il
     valore letto all'avvio anche nel doppio giro degli effect in StrictMode:
     la scrittura della prima visita non puo trasformarla subito in ritorno. */
  useLayoutEffect(() => {
    if (visitataPrimaDelDocumento.current === null) {
      visitataPrimaDelDocumento.current = heroGiaVisitata();
    }

    if (visitataPrimaDelDocumento.current) {
      attivaHeroDiRitorno();
    } else if (percorsoIniziale.current === "/") {
      homeVisitata.current = true;
      ricordaHeroVisitata();
    }
  }, [attivaHeroDiRitorno]);

  /* Il provider vive nel root layout: vede la Home andare via prima che
     torni. Se invece la prima pagina della scheda e una route interna, la
     prima vera apertura della Home conserva regolarmente la moviescroller. */
  useLayoutEffect(() => {
    const precedente = percorsoPrecedente.current;

    if (percorso === "/") {
      if (!homeVisitata.current) {
        homeVisitata.current = true;
        ricordaHeroVisitata();
      } else if (precedente !== "/") {
        attivaHeroDiRitorno();
      }
    } else if (precedente === "/" && homeVisitata.current) {
      attivaHeroDiRitorno();
    }

    percorsoPrecedente.current = percorso;
  }, [attivaHeroDiRitorno, percorso]);

  /* Catalogo e le altre ancore vivono dentro `/`: usePathname non vede il
     fragmento e la Hero non si rimonta. I link Home chiamano questa azione
     soltanto quando stanno davvero riportando l'utente all'inizio. */
  const preparaRitornoHome = useCallback(() => {
    if (!homeVisitata.current) return;
    const staTornando =
      window.location.pathname !== "/" ||
      window.location.hash !== "" ||
      window.scrollY > 1;
    if (staTornando) attivaHeroDiRitorno();
  }, [attivaHeroDiRitorno]);

  /* Copre anche Indietro del browser da /#catalogo a `/`, dove non passa
     alcun Link e il pathname resta invariato. */
  useEffect(() => {
    const dallaCronologia = () => {
      if (
        homeVisitata.current &&
        window.location.pathname === "/" &&
        window.location.hash === ""
      ) {
        attivaHeroDiRitorno();
      }
    };
    window.addEventListener("popstate", dallaCronologia);
    return () => window.removeEventListener("popstate", dallaCronologia);
  }, [attivaHeroDiRitorno]);

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

  const valore = useMemo(
    () => ({ aperto, commuta, chiudi, heroDiRitorno, preparaRitornoHome }),
    [aperto, commuta, chiudi, heroDiRitorno, preparaRitornoHome],
  );

  return <Contesto.Provider value={valore}>{children}</Contesto.Provider>;
}
