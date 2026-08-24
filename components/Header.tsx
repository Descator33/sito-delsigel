"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useMenu } from "@/components/MenuStato";
import { ATTESA_VOCI, EASE_MENU, PASSO_VOCI } from "@/lib/hero-finestra";

const VOCI = [
  ["Home", "/"],
  ["Prodotti", "/#catalogo"],
  ["Configuratore", "/configuratore"],
  ["Chi siamo", "/chi-siamo"],
  ["Contatti", "/contatti"],
] as const;

/* Selettore lingua: per ora è solo la facciata, la traduzione arriverà.
   In lista il nome è nella propria lingua, come ci si aspetta di trovarlo
   quando l'italiano non lo si legge. */
const LINGUE = [
  ["ita", "Italiano"],
  ["eng", "English"],
  ["fra", "Français"],
  ["deu", "Deutsch"],
  ["fin", "Suomi"],
] as const;

type Lingua = (typeof LINGUE)[number][0];

const MOLLA = [0.22, 1, 0.36, 1] as const;

function rottaAttiva(percorso: string, rotta: string) {
  return rotta === "/" ? percorso === "/" : percorso.startsWith(rotta);
}

/**
 * Navigazione fissa: una capsula corta e centrata con le sole route
 * principali e il selettore lingua, staccata dal comando del burger che
 * vive da solo sul bordo destro e apre il livello esteso.
 */
export function Header({ fondo = "chiaro" }: { fondo?: "chiaro" | "scuro" }) {
  const { aperto, commuta, chiudi, preparaRitornoHome } = useMenu();
  const percorso = usePathname();
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
          />

          <button
            ref={comando}
            type="button"
            onClick={commuta}
            data-fondo={fondo}
            data-aperto={aperto || undefined}
            aria-label={aperto ? "Chiudi il menu" : "Apri il menu"}
            aria-expanded={aperto}
            aria-controls="menu-delsigel"
            aria-haspopup="dialog"
            className="hero-comando font-ui col-start-3 flex h-12 min-w-[7.25rem] items-center justify-center gap-3 justify-self-end rounded-full px-4 text-[12px] font-bold uppercase tracking-[0.025em] sm:px-5"
          >
            <span className="hero-burger" data-aperto={aperto} aria-hidden>
              <span />
              <span />
              <span />
            </span>
            <span aria-hidden>{aperto ? "Chiudi" : "Menu"}</span>
          </button>
        </div>
      </motion.header>

      <AnimatePresence>
        {aperto && (
          <motion.div
            ref={pannello}
            id="menu-delsigel"
            role="dialog"
            aria-modal="true"
            aria-label="Menu di navigazione"
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
                percorso === "/"
                  ? "pb-[calc(24svh+max(2.5rem,env(safe-area-inset-bottom)))] sm:pb-[calc(30svh+max(2.5rem,env(safe-area-inset-bottom)))] lg:pb-[10vh]"
                  : "pb-[max(2.5rem,env(safe-area-inset-bottom))]"
              }`}
            >
              <nav aria-label="Navigazione principale" className="self-start">
                <ul>
                  {VOCI.map(([voce, rotta], indice) => {
                    const attiva = rottaAttiva(percorso, rotta);
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
                          href={rotta}
                          onClick={chiudi}
                          onNavigate={
                            rotta === "/" ? preparaRitornoHome : undefined
                          }
                          aria-current={attiva ? "page" : undefined}
                          data-active={attiva || undefined}
                          className="hero-menu-voce type-hero block w-fit py-[0.055em] text-[clamp(2rem,9.3vw,4.1rem)] sm:text-[clamp(2.35rem,9vw,4.1rem)] lg:text-[clamp(3rem,5vw,5.4rem)]"
                        >
                          {voce}
                        </Link>
                      </motion.li>
                    );
                  })}
                </ul>
              </nav>

              <motion.p
                initial={riduciMovimento ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{
                  duration: riduciMovimento ? 0 : 0.5,
                  delay: riduciMovimento
                    ? 0
                    : ATTESA_VOCI + VOCI.length * PASSO_VOCI,
                  ease: EASE_MENU,
                }}
                className="font-ui mt-12 self-end text-[12px] font-medium uppercase tracking-[0.14em] text-cacao/60"
              >
                Delsigel Italia <span className="mx-2 text-fucsia">/</span> dal
                2011
              </motion.p>
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
}: {
  percorso: string;
  aperto: boolean;
  preparaRitornoHome: () => void;
}) {
  return (
    <nav
      aria-label="Navigazione principale"
      inert={aperto ? true : undefined}
      data-menu-open={aperto || undefined}
      className="site-nav-primary col-start-2 hidden h-12 items-center rounded-full p-1 lg:flex"
    >
      {VOCI.map(([voce, rotta], indice) => {
        const attiva = rottaAttiva(percorso, rotta);
        return (
          <Fragment key={voce}>
            {indice > 0 && <span className="site-nav-sep" aria-hidden />}
            <Link
              href={rotta}
              onNavigate={rotta === "/" ? preparaRitornoHome : undefined}
              aria-current={attiva ? "page" : undefined}
              data-active={attiva || undefined}
              className="site-nav-link font-ui inline-flex h-10 items-center whitespace-nowrap rounded-full px-[clamp(0.7rem,1.1vw,1.1rem)] text-[11px] font-bold uppercase tracking-[0.045em] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-fucsia"
            >
              {voce}
            </Link>
          </Fragment>
        );
      })}
      <span className="site-nav-sep" aria-hidden />
      <SelettoreLingua />
    </nav>
  );
}

function SelettoreLingua() {
  const [lingua, setLingua] = useState<Lingua>("ita");
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
        aria-label="Seleziona la lingua del sito"
        className="site-nav-link font-ui inline-flex h-10 items-center gap-2 whitespace-nowrap rounded-full px-[clamp(0.7rem,1.1vw,1.1rem)] text-[11px] font-bold uppercase tracking-[0.045em] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-fucsia"
      >
        <Bandiera lingua={lingua} />
        {lingua}
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
          aria-label="Lingua del sito"
          className="site-nav-lingue absolute right-0 top-[calc(100%+12px)] w-44 rounded-2xl p-1.5"
        >
          {LINGUE.map(([codice, nome]) => (
            <li key={codice}>
              <button
                type="button"
                role="option"
                aria-selected={codice === lingua}
                data-active={codice === lingua || undefined}
                onClick={() => {
                  setLingua(codice);
                  setAperto(false);
                  bottone.current?.focus();
                }}
                className="site-nav-lingua font-ui flex w-full items-center gap-2.5 rounded-full px-3 py-2 text-[12px] font-semibold"
              >
                <Bandiera lingua={codice} />
                {nome}
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
      {lingua === "ita" && (
        <svg viewBox="0 0 3 2" preserveAspectRatio="none">
          <rect width="1" height="2" fill="#009246" />
          <rect x="1" width="1" height="2" fill="#f4f5f0" />
          <rect x="2" width="1" height="2" fill="#ce2b37" />
        </svg>
      )}
      {lingua === "eng" && (
        <svg viewBox="0 0 60 40" preserveAspectRatio="none">
          <rect width="60" height="40" fill="#012169" />
          <path d="M0 0 60 40M60 0 0 40" stroke="#ffffff" strokeWidth="8" />
          <path d="M0 0 60 40M60 0 0 40" stroke="#c8102e" strokeWidth="4" />
          <path d="M30 0v40M0 20h60" stroke="#ffffff" strokeWidth="13" />
          <path d="M30 0v40M0 20h60" stroke="#c8102e" strokeWidth="8" />
        </svg>
      )}
      {lingua === "fra" && (
        <svg viewBox="0 0 3 2" preserveAspectRatio="none">
          <rect width="1" height="2" fill="#0055a4" />
          <rect x="1" width="1" height="2" fill="#ffffff" />
          <rect x="2" width="1" height="2" fill="#ef4135" />
        </svg>
      )}
      {lingua === "deu" && (
        <svg viewBox="0 0 5 3" preserveAspectRatio="none">
          <rect width="5" height="1" fill="#000000" />
          <rect y="1" width="5" height="1" fill="#dd0000" />
          <rect y="2" width="5" height="1" fill="#ffce00" />
        </svg>
      )}
      {lingua === "fin" && (
        <svg viewBox="0 0 18 11" preserveAspectRatio="none">
          <rect width="18" height="11" fill="#ffffff" />
          <rect x="5" width="3" height="11" fill="#003580" />
          <rect y="4" width="18" height="3" fill="#003580" />
        </svg>
      )}
    </span>
  );
}
