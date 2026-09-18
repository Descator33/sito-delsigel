"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useMenu } from "@/components/MenuStato";
import { ricordaLingua, useLingua } from "@/components/LinguaProvider";
import {
  ETICHETTE_LINGUE,
  LINGUE,
  cambiaLinguaNelPercorso,
  èHome,
  type Lingua,
} from "@/lib/i18n/lingue";
import { ATTESA_VOCI, EASE_MENU, PASSO_VOCI } from "@/lib/hero-finestra";
import type { Testi } from "@/lib/i18n/tipi";

/** Le rotte, senza prefisso lingua: il prefisso lo mette `percorso()`. */
const ROTTE: readonly (readonly [keyof Testi["comune"]["voci"], string])[] = [
  ["home", "/"],
  ["prodotti", "/#catalogo"],
  ["configuratore", "/configuratore"],
  ["chiSiamo", "/chi-siamo"],
  ["contatti", "/contatti"],
] as const;

const MOLLA = [0.22, 1, 0.36, 1] as const;

/** Confronto senza il segmento lingua: /fi/contatti ↔ /contatti. */
function rottaAttiva(
  percorso: string,
  rotta: string,
  prodottiInVista = false,
) {
  const home = èHome(percorso);
  if (rotta === "/") return home && !prodottiInVista;
  if (rotta === "/#catalogo") return home && prodottiInVista;

  const segmenti = percorso.split("/").filter(Boolean);
  const nudo = `/${segmenti.slice(1).join("/")}`;
  return nudo.startsWith(rotta);
}

/**
 * La home contiene anche la destinazione della voce «Prodotti»: il suo
 * pathname resta quello della home, quindi il pathname da solo non può
 * distinguere i due stati. Il punto di lettura è nel primo terzo del
 * viewport: così l'indicatore segue sia lo scroll nativo sia Lenis, senza
 * aggiornare l'URL a ogni pixel.
 */
function useProdottiInVista(percorso: string) {
  const [attivo, setAttivo] = useState(false);

  useEffect(() => {
    if (!èHome(percorso)) {
      return;
    }

    const catalogo = document.getElementById("catalogo");
    const salati = document.getElementById("salati");
    if (!catalogo || !salati) return;

    let frame: number | null = null;

    const aggiorna = () => {
      frame = null;
      const puntoDiLettura = window.innerHeight * 0.34;
      const inProdotti =
        catalogo.getBoundingClientRect().top <= puntoDiLettura &&
        salati.getBoundingClientRect().bottom > puntoDiLettura;
      setAttivo((precedente) =>
        precedente === inProdotti ? precedente : inProdotti,
      );
    };

    const programmaAggiornamento = () => {
      if (frame !== null) return;
      frame = window.requestAnimationFrame(aggiorna);
    };

    window.addEventListener("scroll", programmaAggiornamento, {
      passive: true,
    });
    window.addEventListener("resize", programmaAggiornamento);

    /* Le scene scroll-driven possono cambiare altezza dopo il primo paint:
       in quel caso lo stato va ricalcolato anche senza un nuovo scroll. */
    const osservatore =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(programmaAggiornamento)
        : null;
    osservatore?.observe(catalogo);
    osservatore?.observe(salati);
    programmaAggiornamento();

    return () => {
      window.removeEventListener("scroll", programmaAggiornamento);
      window.removeEventListener("resize", programmaAggiornamento);
      osservatore?.disconnect();
      if (frame !== null) window.cancelAnimationFrame(frame);
    };
  }, [percorso]);

  return attivo;
}

function ariaCurrentPer(rotta: string, attiva: boolean) {
  if (!attiva) return undefined;
  return rotta.startsWith("/#") ? "location" : "page";
}

/**
 * Navigazione fissa: una capsula corta e centrata con le sole route
 * principali e il selettore lingua, staccata dal comando del burger che
 * vive da solo sul bordo destro e apre il livello esteso.
 */
export function Header({ fondo = "chiaro" }: { fondo?: "chiaro" | "scuro" }) {
  const { aperto, commuta, chiudi, preparaRitornoHome } = useMenu();
  const { testi, percorso: localizza } = useLingua();
  const percorso = usePathname();
  const prodottiInVistaHome = useProdottiInVista(percorso);
  const prodottiInVista = èHome(percorso) && prodottiInVistaHome;
  const riduciMovimento = useReducedMotion();
  const intestazione = useRef<HTMLElement>(null);
  const pannello = useRef<HTMLDivElement>(null);
  const comando = useRef<HTMLButtonElement>(null);

  /* Il fuoco entra nel menu e ci resta. Main e footer diventano davvero
     inert, non soltanto coperti, e recuperano il loro stato alla chiusura. */
  useEffect(() => {
    if (!aperto) return;

    const radice = intestazione.current?.parentElement;
    const sotto = radice
      ? Array.from(radice.children).filter(
          (nodo): nodo is HTMLElement =>
            nodo instanceof HTMLElement &&
            nodo !== intestazione.current &&
            nodo !== pannello.current,
        )
      : [];
    const statiInert = sotto.map((nodo) => nodo.inert);
    sotto.forEach((nodo) => {
      nodo.inert = true;
    });

    const fuocabili = () =>
      [intestazione.current, pannello.current]
        .flatMap((contenitore) =>
          contenitore
            ? Array.from(
                contenitore.querySelectorAll<HTMLElement>(
                  "a[href], button:not([disabled])",
                ),
              )
            : [],
        )
        .filter((elemento) => !elemento.closest("[inert]"));

    pannello.current?.querySelector<HTMLElement>("a[href]")?.focus({
      preventScroll: true,
    });

    const trappola = (evento: KeyboardEvent) => {
      if (evento.key !== "Tab") return;
      const nodi = fuocabili();
      if (nodi.length === 0) return;
      const primo = nodi[0];
      const ultimo = nodi[nodi.length - 1];
      const attivo = document.activeElement;

      if (
        evento.shiftKey &&
        (attivo === primo || !nodi.includes(attivo as HTMLElement))
      ) {
        evento.preventDefault();
        ultimo.focus();
      } else if (!evento.shiftKey && attivo === ultimo) {
        evento.preventDefault();
        primo.focus();
      }
    };

    const bottone = comando.current;
    document.addEventListener("keydown", trappola);
    return () => {
      document.removeEventListener("keydown", trappola);
      sotto.forEach((nodo, indice) => {
        nodo.inert = statiInert[indice];
      });
      if (bottone?.isConnected) bottone.focus({ preventScroll: true });
    };
  }, [aperto]);

  return (
    <>
      <motion.header
        ref={intestazione}
        initial={riduciMovimento ? false : { opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={
          riduciMovimento
            ? { duration: 0 }
            : { duration: 0.7, delay: 0.1, ease: MOLLA }
        }
        className="fixed inset-x-0 top-0 z-[80] px-[clamp(14px,3vw,48px)] pt-3 md:pt-5"
      >
        {/* Le colonne esterne uguali tengono la capsula davvero al centro
            della pagina, qualunque larghezza abbia il comando a destra. */}
        <div className="mx-auto grid max-w-[1800px] grid-cols-[1fr_auto_1fr] items-center">
          <DesktopNavigation
            percorso={percorso}
            aperto={aperto}
            preparaRitornoHome={preparaRitornoHome}
            prodottiInVista={prodottiInVista}
          />

          <div className="col-start-3 flex items-center gap-2 justify-self-end">
            {/* Sotto lg la capsula centrale non esiste: il selettore vive
                in una capsula sua accanto al burger, sempre nella barra. */}
            <div
              inert={aperto ? true : undefined}
              data-menu-open={aperto || undefined}
              className="site-nav-primary flex h-12 items-center rounded-full p-1 lg:hidden"
            >
              <SelettoreLingua />
            </div>

            <button
              ref={comando}
              type="button"
              onClick={commuta}
              data-fondo={fondo}
              data-aperto={aperto || undefined}
              aria-label={
                aperto ? testi.comune.menu.chiudi : testi.comune.menu.apri
              }
              aria-expanded={aperto}
              aria-controls="menu-delsigel"
              aria-haspopup="dialog"
              className="hero-comando font-ui flex h-12 min-w-[7.25rem] items-center justify-center gap-3 rounded-full px-4 text-[12px] font-bold uppercase tracking-[0.025em] sm:px-5"
            >
              <span className="hero-burger" data-aperto={aperto} aria-hidden>
                <span />
                <span />
                <span />
              </span>
              <span aria-hidden>
                {aperto
                  ? testi.comune.menu.etichettaChiudi
                  : testi.comune.menu.etichettaMenu}
              </span>
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {aperto && (
          <motion.div
            ref={pannello}
            id="menu-delsigel"
            role="dialog"
            aria-modal="true"
            aria-label={testi.comune.menu.pannello}
            initial={riduciMovimento ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{
              opacity: 0,
              transition: {
                duration: riduciMovimento ? 0 : 0.34,
                delay: riduciMovimento ? 0 : 0.12,
                ease: EASE_MENU,
              },
            }}
            transition={{
              duration: riduciMovimento ? 0 : 0.34,
              ease: EASE_MENU,
            }}
            className="fixed inset-0 z-[60] overflow-y-auto bg-acido text-cacao"
          >
            <div
              className={`grid min-h-full px-[clamp(20px,5vw,96px)] pt-[clamp(7.5rem,16vh,10rem)] ${
                rottaAttiva(percorso, "/", prodottiInVista)
                  ? "pb-[calc(24svh+max(2.5rem,env(safe-area-inset-bottom)))] sm:pb-[calc(30svh+max(2.5rem,env(safe-area-inset-bottom)))] lg:pb-[10vh]"
                  : "pb-[max(2.5rem,env(safe-area-inset-bottom))]"
              }`}
            >
              <nav
                aria-label={testi.comune.menu.navPrincipale}
                className="self-start"
              >
                <ul>
                  {ROTTE.map(([voce, rotta], indice) => {
                    const attiva = rottaAttiva(percorso, rotta, prodottiInVista);
                    return (
                      <motion.li
                        key={voce}
                        initial={
                          riduciMovimento ? false : { opacity: 0, y: 30 }
                        }
                        animate={{ opacity: 1, y: 0 }}
                        exit={{
                          opacity: 0,
                          y: riduciMovimento ? 0 : 12,
                          transition: {
                            duration: riduciMovimento ? 0 : 0.18,
                            ease: EASE_MENU,
                          },
                        }}
                        transition={{
                          duration: riduciMovimento ? 0 : 0.58,
                          delay: riduciMovimento
                            ? 0
                            : ATTESA_VOCI + indice * PASSO_VOCI,
                          ease: EASE_MENU,
                        }}
                      >
                        <Link
                          href={localizza(rotta)}
                          onClick={chiudi}
                          onNavigate={
                            rotta === "/" ? preparaRitornoHome : undefined
                          }
                          aria-current={ariaCurrentPer(rotta, attiva)}
                          data-active={attiva || undefined}
                          className="hero-menu-voce type-hero block w-fit py-[0.055em] text-[clamp(2rem,9.3vw,4.1rem)] sm:text-[clamp(2.35rem,9vw,4.1rem)] lg:text-[clamp(3rem,5vw,5.4rem)]"
                        >
                          {testi.comune.voci[voce]}
                        </Link>
                      </motion.li>
                    );
                  })}
                </ul>
              </nav>

              <motion.div
                initial={riduciMovimento ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{
                  duration: riduciMovimento ? 0 : 0.5,
                  delay: riduciMovimento
                    ? 0
                    : ATTESA_VOCI + ROTTE.length * PASSO_VOCI,
                  ease: EASE_MENU,
                }}
                className="mt-12 self-end"
              >
                <p className="font-ui text-[12px] font-medium uppercase tracking-[0.14em] text-cacao/60">
                  {testi.comune.menu.firma[0]}
                  <span className="mx-2 text-fucsia">/</span>
                  {testi.comune.menu.firma[1]}
                </p>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function DesktopNavigation({
  percorso,
  aperto,
  preparaRitornoHome,
  prodottiInVista,
}: {
  percorso: string;
  aperto: boolean;
  preparaRitornoHome: () => void;
  prodottiInVista: boolean;
}) {
  const { testi, percorso: localizza } = useLingua();

  return (
    <nav
      aria-label={testi.comune.menu.navPrincipale}
      inert={aperto ? true : undefined}
      data-menu-open={aperto || undefined}
      className="site-nav-primary col-start-2 hidden h-12 items-center rounded-full p-1 lg:flex"
    >
      {ROTTE.map(([voce, rotta], indice) => {
        const attiva = rottaAttiva(percorso, rotta, prodottiInVista);
        return (
          <Fragment key={voce}>
            {indice > 0 && <span className="site-nav-sep" aria-hidden />}
            <Link
              href={localizza(rotta)}
              onNavigate={rotta === "/" ? preparaRitornoHome : undefined}
              aria-current={ariaCurrentPer(rotta, attiva)}
              data-active={attiva || undefined}
              className="site-nav-link font-ui inline-flex h-10 items-center whitespace-nowrap rounded-full px-[clamp(0.7rem,1.1vw,1.1rem)] text-[11px] font-bold uppercase tracking-[0.045em] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-fucsia"
            >
              {testi.comune.voci[voce]}
            </Link>
          </Fragment>
        );
      })}
      <span className="site-nav-sep" aria-hidden />
      <SelettoreLingua />
    </nav>
  );
}

/** Cambio lingua: stesso percorso, prefisso nuovo, scelta nel cookie
 *  (così il proxy la rispetta alla prossima visita senza prefisso). */
function useCambioLingua() {
  const router = useRouter();
  const percorso = usePathname();

  return (nuova: Lingua) => {
    ricordaLingua(nuova);
    /* usePathname non contiene la query: la riprendiamo dall'URL al
       momento del click. L'hash invece resta fuori apposta, e lo scroll
       è disattivato: cambiare lingua non è andare da qualche parte — la
       pagina non si muove di un pixel, qualunque sezione sia in vista. */
    const suffisso = window.location.search;
    router.push(`${cambiaLinguaNelPercorso(percorso, nuova)}${suffisso}`, {
      scroll: false,
    });
  };
}

function SelettoreLingua() {
  const { lingua, testi } = useLingua();
  const cambia = useCambioLingua();
  const [aperto, setAperto] = useState(false);
  const contenitore = useRef<HTMLDivElement>(null);
  const bottone = useRef<HTMLButtonElement>(null);

  /* La tendina si chiude da sola: un tocco fuori la congeda, Escape la
     chiude e restituisce il fuoco al bottone. */
  useEffect(() => {
    if (!aperto) return;

    const fuori = (evento: PointerEvent) => {
      if (!contenitore.current?.contains(evento.target as Node)) {
        setAperto(false);
      }
    };
    const tasto = (evento: KeyboardEvent) => {
      if (evento.key !== "Escape") return;
      evento.stopPropagation();
      setAperto(false);
      bottone.current?.focus();
    };

    document.addEventListener("pointerdown", fuori);
    document.addEventListener("keydown", tasto);
    return () => {
      document.removeEventListener("pointerdown", fuori);
      document.removeEventListener("keydown", tasto);
    };
  }, [aperto]);

  return (
    <div ref={contenitore} className="relative">
      <button
        ref={bottone}
        type="button"
        onClick={() => setAperto((stato) => !stato)}
        aria-expanded={aperto}
        aria-haspopup="listbox"
        aria-label={testi.comune.lingua.selettore}
        className="site-nav-link font-ui inline-flex h-10 items-center gap-2 whitespace-nowrap rounded-full px-[clamp(0.7rem,1.1vw,1.1rem)] text-[11px] font-bold uppercase tracking-[0.045em] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-fucsia"
      >
        <Bandiera lingua={lingua} />
        {ETICHETTE_LINGUE[lingua].sigla}
        <svg
          viewBox="0 0 10 6"
          aria-hidden
          className={`w-2.5 transition-transform duration-200 ${aperto ? "rotate-180" : ""}`}
        >
          <path
            d="M1 1l4 4 4-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {aperto && (
        <ul
          role="listbox"
          aria-label={testi.comune.lingua.lista}
          className="site-nav-lingue absolute right-0 top-[calc(100%+12px)] w-44 rounded-2xl p-1.5"
        >
          {LINGUE.map((codice) => (
            <li key={codice}>
              <button
                type="button"
                role="option"
                aria-selected={codice === lingua}
                data-active={codice === lingua || undefined}
                lang={codice}
                onClick={() => {
                  setAperto(false);
                  if (codice !== lingua) cambia(codice);
                  else bottone.current?.focus();
                }}
                className="site-nav-lingua font-ui flex w-full items-center gap-2.5 rounded-full px-3 py-2 text-[12px] font-semibold"
              >
                <Bandiera lingua={codice} />
                {ETICHETTE_LINGUE[codice].nome}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* Bandierine disegnate a mano: gli emoji su Windows diventano sigle di
   testo, un rettangolo SVG resta un rettangolo ovunque. Tutte stirate
   nella stessa scatola 3:2 dal preserveAspectRatio. */
function Bandiera({ lingua }: { lingua: Lingua }) {
  return (
    <span className="site-nav-bandiera" aria-hidden>
      {lingua === "it" && (
        <svg viewBox="0 0 3 2" preserveAspectRatio="none">
          <rect width="1" height="2" fill="#009246" />
          <rect x="1" width="1" height="2" fill="#f4f5f0" />
          <rect x="2" width="1" height="2" fill="#ce2b37" />
        </svg>
      )}
      {lingua === "en" && (
        <svg viewBox="0 0 60 40" preserveAspectRatio="none">
          <rect width="60" height="40" fill="#012169" />
          <path d="M0 0 60 40M60 0 0 40" stroke="#ffffff" strokeWidth="8" />
          <path d="M0 0 60 40M60 0 0 40" stroke="#c8102e" strokeWidth="4" />
          <path d="M30 0v40M0 20h60" stroke="#ffffff" strokeWidth="13" />
          <path d="M30 0v40M0 20h60" stroke="#c8102e" strokeWidth="8" />
        </svg>
      )}
      {lingua === "fr" && (
        <svg viewBox="0 0 3 2" preserveAspectRatio="none">
          <rect width="1" height="2" fill="#0055a4" />
          <rect x="1" width="1" height="2" fill="#ffffff" />
          <rect x="2" width="1" height="2" fill="#ef4135" />
        </svg>
      )}
      {lingua === "de" && (
        <svg viewBox="0 0 5 3" preserveAspectRatio="none">
          <rect width="5" height="1" fill="#000000" />
          <rect y="1" width="5" height="1" fill="#dd0000" />
          <rect y="2" width="5" height="1" fill="#ffce00" />
        </svg>
      )}
      {lingua === "fi" && (
        <svg viewBox="0 0 18 11" preserveAspectRatio="none">
          <rect width="18" height="11" fill="#ffffff" />
          <rect x="5" width="3" height="11" fill="#003580" />
          <rect y="4" width="18" height="3" fill="#003580" />
        </svg>
      )}
    </span>
  );
}
