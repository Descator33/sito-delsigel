"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from "motion/react";
import { LogoStorico } from "@/components/LogoStorico";
import { useMenu } from "@/components/MenuStato";
import { ATTESA_VOCI, EASE_MENU, PASSO_VOCI } from "@/lib/hero-finestra";

const VOCI = [
  ["Home", "/"],
  ["Catalogo", "/#catalogo"],
  ["Configuratore", "/configuratore"],
  ["Chi siamo", "/chi-siamo"],
  ["Contatti", "/contatti"],
] as const;

const APPROFONDIMENTI = [
  ["I nostri dolci", "/#dolci"],
  ["I nostri salati", "/#salati"],
  ["Catalogo fisico", "/#catalogo-fisico"],
  ["Come si crea", "/#come-si-crea"],
] as const;

const MOLLA = [0.22, 1, 0.36, 1] as const;

function rottaAttiva(percorso: string, rotta: string) {
  return rotta === "/" ? percorso === "/" : percorso.startsWith(rotta);
}

/**
 * Navigazione fissa: le route principali sono sempre visibili su desktop,
 * mentre il burger apre il livello esteso con ancore e percorsi secondari.
 */
export function Header({ fondo = "chiaro" }: { fondo?: "chiaro" | "scuro" }) {
  const { aperto, commuta, chiudi, preparaRitornoHome } = useMenu();
  const percorso = usePathname();
  const riduciMovimento = useReducedMotion();
  const { scrollY } = useScroll();
  const [scorsa, setScorsa] = useState(false);
  const intestazione = useRef<HTMLElement>(null);
  const pannello = useRef<HTMLDivElement>(null);
  const comando = useRef<HTMLButtonElement>(null);

  useMotionValueEvent(scrollY, "change", (valore) => {
    const prossima = valore > 28;
    setScorsa((corrente) => (corrente === prossima ? corrente : prossima));
  });

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
        <div
          data-fondo={fondo}
          data-scrolled={scorsa || undefined}
          data-menu-open={aperto || undefined}
          className="site-nav-shell mx-auto grid max-w-[1800px] grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2 rounded-full p-1.5"
        >
          <Link
            href="/"
            onNavigate={preparaRitornoHome}
            aria-label="Delsigel, home"
            className="site-nav-logo col-start-1 flex h-12 items-center rounded-full px-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fucsia sm:px-[18px]"
          >
            {/* marchio storico, e più grande dei 13px di prima: in un
                sito che deve dire "Delsigel" il logo non è un timbro */}
            <LogoStorico
              variant="horizontal"
              className="h-[20px] text-bruno sm:h-[23px]"
            />
          </Link>

          <DesktopNavigation
            percorso={percorso}
            inert={aperto}
            preparaRitornoHome={preparaRitornoHome}
          />

          <button
            ref={comando}
            type="button"
            onClick={commuta}
            data-fondo={scorsa ? "chiaro" : fondo}
            data-aperto={aperto || undefined}
            aria-label={aperto ? "Chiudi il menu" : "Apri il menu"}
            aria-expanded={aperto}
            aria-controls="menu-delsigel"
            aria-haspopup="dialog"
            className="hero-comando font-ui col-start-3 flex h-12 min-w-[7.25rem] items-center justify-center gap-3 rounded-full px-4 text-[12px] font-bold uppercase tracking-[0.025em] sm:px-5"
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
            className="expanded-menu fixed inset-0 z-[60] overflow-y-auto bg-acido text-cacao"
          >
            <div
              className={`relative z-10 grid min-h-full px-[clamp(20px,5vw,96px)] pt-[clamp(7.5rem,16vh,10rem)] lg:grid-cols-[minmax(0,0.9fr)_minmax(18rem,0.55fr)] lg:gap-[8vw] ${
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

              <motion.div
                initial={riduciMovimento ? false : { opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: riduciMovimento ? 0 : 0.55,
                  delay: riduciMovimento
                    ? 0
                    : ATTESA_VOCI + VOCI.length * PASSO_VOCI,
                  ease: EASE_MENU,
                }}
                className="mt-6 self-start lg:mt-3 lg:pt-2"
              >
                <p className="font-ui text-[11px] font-bold uppercase tracking-[0.18em] text-cacao/60">
                  Esplora Delsigel
                </p>
                <nav aria-label="Navigazione di approfondimento" className="mt-3">
                  <ul className="grid grid-cols-2 gap-x-8 gap-y-2.5">
                    {APPROFONDIMENTI.map(([voce, rotta]) => (
                      <li key={voce}>
                        <Link
                          href={rotta}
                          onClick={chiudi}
                          className="expanded-menu__secondary font-ui inline-flex min-h-11 items-center text-[clamp(0.95rem,1.3vw,1.15rem)] font-semibold"
                        >
                          {voce}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
                <a
                  href="https://instagram.com/delsigel_official"
                  target="_blank"
                  rel="noreferrer"
                  className="expanded-menu__instagram font-ui mt-8 inline-flex min-h-11 items-center border-b-2 border-cacao text-[12px] font-bold uppercase tracking-[0.14em]"
                >
                  Instagram
                </a>
              </motion.div>

              <motion.p
                initial={riduciMovimento ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{
                  duration: riduciMovimento ? 0 : 0.5,
                  delay: riduciMovimento
                    ? 0
                    : ATTESA_VOCI + (VOCI.length + 1) * PASSO_VOCI,
                  ease: EASE_MENU,
                }}
                className="font-ui mt-12 self-end text-[12px] font-medium uppercase tracking-[0.14em] text-cacao/60 lg:col-span-2"
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
  inert,
  preparaRitornoHome,
}: {
  percorso: string;
  inert: boolean;
  preparaRitornoHome: () => void;
}) {
  return (
    <nav
      aria-label="Navigazione principale"
      inert={inert ? true : undefined}
      className="site-nav-primary col-start-2 mx-auto hidden h-12 items-center rounded-full p-1 lg:flex"
    >
      {VOCI.map(([voce, rotta]) => {
        const attiva = rottaAttiva(percorso, rotta);
        return (
          <Link
            key={voce}
            href={rotta}
            onNavigate={rotta === "/" ? preparaRitornoHome : undefined}
            aria-current={attiva ? "page" : undefined}
            data-active={attiva || undefined}
            className="site-nav-link font-ui inline-flex h-10 items-center whitespace-nowrap rounded-full px-[clamp(0.7rem,1.15vw,1.2rem)] text-[11px] font-bold uppercase tracking-[0.045em] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-fucsia"
          >
            {voce}
          </Link>
        );
      })}
    </nav>
  );
}
