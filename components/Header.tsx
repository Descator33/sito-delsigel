"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { Logo } from "@/components/Logo";
import { useMenu } from "@/components/MenuStato";
import { ATTESA_VOCI, EASE_MENU, PASSO_VOCI } from "@/lib/hero-finestra";

/** Le rotte del sito, che dal 2026-08-20 vivono solo dentro il menu.
 *  «Home» apre la fila: il marchio in alto a sinistra ci porta, ma è una
 *  convenzione, non una voce — e in un menu che è l'unica navigazione la
 *  pagina della hero non può mancare dall'elenco. Dal refactor 12/08
 *  «Catalogo» è una rotta vera (/catalogo, dolci + salati), non più
 *  un'ancora della home. */
const VOCI = [
  ["Home", "/"],
  ["Catalogo", "/catalogo"],
  ["Configuratore", "/configuratore"],
  ["Chi siamo", "/chi-siamo"],
  ["Contatti", "/contatti"],
] as const;

const MOLLA = [0.22, 1, 0.36, 1] as const;

/**
 * Navigazione flottante sopra la pagina (refactor hero 2026-08-12).
 *
 * Non è una barra: è un lockup appoggiato sul contenuto — pillola del
 * marchio a sinistra, comando del menu a destra, niente campitura dietro.
 * Le due pillole restano leggibili su qualunque fondo (la fotografia
 * arancio della home, il panna delle sub-page).
 *
 * Il lockup è ancorato ai bordi del viewport e non più a una colonna di
 * 1800px: sulla home deve stare a filo con l'insegna della hero, che segue
 * la fotografia e non una colonna. Sopra i 2000px questo lo porta più a
 * sinistra del contenuto delle sub-page — è il comportamento di una nav
 * flottante, ed è voluto.
 *
 * Le quattro pillole delle rotte, visibili da `lg` in su, sono uscite di
 * scena il 2026-08-20: duplicavano il menu e affollavano l'angolo alto
 * della hero. Il menu resta il sistema di navigazione unico a ogni misura,
 * e il comando che lo apre ha preso il peso che gli tocca — pillola piena
 * con la parola «MENU» accanto alle linee, non più un cerchio vuoto.
 *
 * `fondo` dice su cosa galleggia: "scuro" (la fotografia della home) lo
 * vuole panna col segno nero, "chiaro" (il panna delle sub-page) lo vuole
 * nero col segno panna. Gli stili stanno in globals.css.
 *
 * IL MENU NON È UN PANNELLO SOPRA LA PAGINA (rev 2026-08-12). Aprendolo la
 * pagina cambia composizione: il campo nero prende il posto del contenuto,
 * le voci si impaginano grandi nella metà sinistra e la hero — che vive in
 * un altro componente — si raccoglie in una finestra in basso a destra
 * (vedi components/Hero.tsx). Da qui l'ordine dei piani:
 *
 *   z-80  questa barra: logo e comando restano sopra a tutto, e il burger
 *         si trasforma in X restando dov'è invece di essere sostituito da
 *         un secondo pulsante dentro il pannello;
 *   z-70  la finestra della hero, quando è staccata dal flusso;
 *   z-60  il campo nero con le voci.
 *
 * Lo stato non è più locale: lo tiene `MenuProvider` nel layout, perché
 * anche la hero deve leggerlo.
 */
export function Header({ fondo = "chiaro" }: { fondo?: "chiaro" | "scuro" }) {
  const { aperto, commuta } = useMenu();
  const intestazione = useRef<HTMLElement>(null);
  const pannello = useRef<HTMLDivElement>(null);
  const comando = useRef<HTMLButtonElement>(null);

  /* Il fuoco entra nel menu e ci resta finché è aperto: il TAB gira fra la
     barra e le voci senza scappare sulla pagina sotto, che è coperta. Alla
     chiusura torna al comando, da dove era partito. */
  useEffect(() => {
    if (!aperto) return;

    const fuocabili = () =>
      [intestazione.current, pannello.current]
        .flatMap((radice) =>
          radice
            ? Array.from(
                radice.querySelectorAll<HTMLElement>("a[href], button:not([disabled])"),
              )
            : [],
        )
        .filter((el) => !el.closest("[inert]"));

    pannello.current?.querySelector<HTMLElement>("a[href]")?.focus({ preventScroll: true });

    const trappola = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const nodi = fuocabili();
      if (nodi.length === 0) return;
      const primo = nodi[0];
      const ultimo = nodi[nodi.length - 1];
      const attivo = document.activeElement;
      if (e.shiftKey && (attivo === primo || !nodi.includes(attivo as HTMLElement))) {
        e.preventDefault();
        ultimo.focus();
      } else if (!e.shiftKey && attivo === ultimo) {
        e.preventDefault();
        primo.focus();
      }
    };

    const bottone = comando.current;
    document.addEventListener("keydown", trappola);
    return () => {
      document.removeEventListener("keydown", trappola);
      /* il fuoco torna da dove era partito — a meno che il menu si sia
         chiuso perché si è cambiato pagina, e quel bottone non ci sia più */
      if (bottone?.isConnected) bottone.focus({ preventScroll: true });
    };
  }, [aperto]);

  return (
    <>
      <motion.header
        ref={intestazione}
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.1, ease: MOLLA }}
        /* `--barra` compensa la sparizione della scrollbar a menu aperto:
           il body la recupera col padding, questa è fissa e no (vedi
           components/MenuStato.tsx) */
        className="fixed inset-x-0 top-0 z-[80] pl-[clamp(20px,5vw,96px)] pr-[calc(clamp(20px,5vw,96px)+var(--barra,0px))] pt-5 md:pt-8"
      >
        <div className="flex items-center justify-between gap-2">
          <Link
            href="/"
            aria-label="Delsigel — home"
            className="flex h-11 items-center rounded-full bg-[rgb(255_248_237/0.94)] px-4 backdrop-blur-[8px] sm:px-[18px]"
          >
            <Logo
              variant="horizontal"
              surface="var(--hero-panna)"
              className="h-[13px] w-auto text-cacao sm:h-[15px]"
            />
          </Link>

          <nav className="flex items-center">
            {/* Un solo comando per aprire e chiudere: le tre linee ruotano
                in croce sul posto (vedi `.hero-burger` in globals.css).
                Le quattro pillole delle rotte sono uscite di scena il
                2026-08-20: le stesse voci vivono dentro il menu, e il
                lockup torna a essere due soli pesi — marchio a sinistra,
                comando a destra. La parola accanto alle linee non è un
                vezzo: ora quel bottone è l'unica porta del sito. */}
            <button
              ref={comando}
              type="button"
              onClick={commuta}
              data-fondo={aperto ? "scuro" : fondo}
              data-aperto={aperto}
              aria-expanded={aperto}
              aria-controls="menu-delsigel"
              className="hero-comando font-ui flex h-11 items-center gap-2.5 rounded-full pl-[18px] pr-5 text-[12px] font-bold uppercase tracking-[0.025em]"
            >
              <span className="hero-burger" data-aperto={aperto} aria-hidden>
                <span />
                <span />
                <span />
              </span>
              <span aria-hidden>{aperto ? "Chiudi" : "Menu"}</span>
              <span className="sr-only">{aperto ? "Chiudi il menu" : "Apri il menu"}</span>
            </button>
          </nav>
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            /* in chiusura il nero non se ne va subito: aspetta che la
               finestra della hero sia ripartita verso il pieno schermo,
               altrimenti per mezzo secondo si vedrebbe la pagina sotto con
               una scheda che ci vola sopra */
            exit={{ opacity: 0, transition: { duration: 0.5, delay: 0.25, ease: EASE_MENU } }}
            transition={{ duration: 0.34, ease: EASE_MENU }}
            className="fixed inset-0 z-[60] bg-hero-nero text-hero-panna"
          >
            {/* La composizione è volutamente sbilanciata: le voci tengono
                la sinistra e l'alto, il vuoto è la parte grossa, e l'angolo
                in basso a destra è occupato dalla hero rimpicciolita — che
                non sta qui dentro, ci arriva da sola. Sotto `lg` la hero è
                una striscia sul fondo: il padding basso le lascia il posto. */}
            <div className="flex h-full flex-col px-[clamp(20px,5vw,96px)] pb-[38svh] pt-[19vh] sm:pb-[50svh] lg:pb-[10vh] lg:pt-[23vh]">
              <nav aria-label="Navigazione principale" className="lg:max-w-[46vw]">
                <ul>
                  {VOCI.map(([voce, rotta], i) => (
                    <motion.li
                      key={voce}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{
                        opacity: 0,
                        y: 12,
                        transition: { duration: 0.22, ease: EASE_MENU },
                      }}
                      transition={{
                        duration: 0.6,
                        delay: ATTESA_VOCI + i * PASSO_VOCI,
                        ease: EASE_MENU,
                      }}
                    >
                      <Link
                        href={rotta}
                        /* cambiando rotta il menu si chiude da solo (lo fa
                           il provider, che ascolta il percorso); il click
                           sulla voce della pagina corrente non cambia
                           rotta, e lo chiude qui */
                        onClick={commuta}
                        className="hero-menu-voce type-hero block py-[0.06em] text-[clamp(2.2rem,8.4vw,3.4rem)] lg:text-[clamp(2.4rem,4.4vw,4.6rem)]"
                      >
                        {voce}
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </nav>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.2 } }}
                transition={{
                  duration: 0.5,
                  delay: ATTESA_VOCI + VOCI.length * PASSO_VOCI,
                  ease: EASE_MENU,
                }}
                className="font-ui mt-auto w-full text-[12px] font-medium uppercase tracking-[0.14em] text-hero-panna/55"
              >
                Delsigel Italia · dal 2011
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
