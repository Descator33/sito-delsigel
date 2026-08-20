"use client";

import { useCallback, useEffect, useRef, type ReactNode } from "react";
import { animate, motion, useMotionValue, useReducedMotion } from "motion/react";
import { ArrowDown } from "lucide-react";
import { LogoStorico } from "@/components/LogoStorico";
import { useMenu } from "@/components/MenuStato";
import { lenisAttivo } from "@/components/SmoothScroll";
import {
  DURATA_MENU,
  EASE_MENU,
  RITARDO_FINESTRA,
  finestraHero,
} from "@/lib/hero-finestra";

/**
 * Hero "Vortice Intriko" (2026-08-20).
 *
 * Il prodotto di punta è il soggetto, non un accessorio: un Intriko
 * monumentale occupa la metà destra e il nastro corallo riprende la
 * torsione della sfoglia. A sinistra il blocco brand: il marchio storico
 * Delsigel sopra l'insegna, poi copy e invito — tutti in HTML, mai
 * stampati nel raster, così marchio e parole restano esatti.
 *
 * Anche il telefono ha una regia propria: il prodotto vive nella metà alta
 * e il set scende nel cacao per lasciare un campo leggibile alla copy. Non
 * è il ritaglio del desktop. Il `<picture>` sceglie quattro esportazioni:
 *
 *   orizzontale  1920×1080 (148 KB)  ·  3840×2160 (382 KB)
 *   verticale    1080×1920 (107 KB)  ·  2160×3840 (279 KB)
 *
 * Per questo qui c'è un `<picture>` e non `next/image`: ritaglio per
 * media query e `srcSet` a densità, che `next/image` non lascia scrivere
 * (genera il suo, per larghezze). Non serve nemmeno l'ottimizzatore — i
 * quattro webp sono già tarati a mano, e ripassarli vorrebbe dire
 * ricomprimerli. `fetchPriority="high"` perché è l'elemento LCP: sta in
 * cima all'HTML, il preload scanner lo trova subito.
 */
export const HERO_IMAGE = "/hero/hero-intriko-vortice.webp";
export const HERO_IMAGE_2X = "/hero/hero-intriko-vortice@2x.webp";
export const HERO_IMAGE_VERT = "/hero/hero-intriko-vortice-mobile.webp";
export const HERO_IMAGE_VERT_2X = "/hero/hero-intriko-vortice-mobile@2x.webp";

const MOLLA = [0.22, 1, 0.36, 1] as const;

/** dove porta l'invito: il primo capitolo della gamma, in Home */
const DESTINAZIONE = "catalogo";

/* Le quattro righe entrano scaglionate da sotto una finestra ritagliata;
   descrizione e invito le seguono a distanza fissa. */
const ATTESA_RIGA = 0.12;
const PASSO_RIGA = 0.075;
const ATTESA_DESCRIZIONE = ATTESA_RIGA + 3 * PASSO_RIGA + 0.15;
const ATTESA_INVITO = ATTESA_DESCRIZIONE + 0.1;

/** riga dell'insegna: la maschera sta sul blocco, il testo ci sale dentro.
 *  `data-hero-uscita` resta sulla maschera come aggancio stabile per
 *  eventuali regie esterne, senza contendere a Motion il nodo animato. */
function Riga({
  indice,
  accento,
  ridotto,
  children,
}: {
  indice: number;
  accento?: boolean;
  ridotto: boolean | null;
  children: ReactNode;
}) {
  return (
    <span className="block overflow-hidden pb-[0.06em]" data-hero-uscita={indice}>
      <motion.span
        className={`block ${
          accento ? "text-corallo" : "text-hero-panna orizzontale:text-cacao"
        }`}
        initial={ridotto ? false : { y: "45%", opacity: 0 }}
        animate={{ y: "0%", opacity: 1 }}
        transition={{
          duration: 0.8,
          delay: ATTESA_RIGA + indice * PASSO_RIGA,
          ease: MOLLA,
        }}
      >
        {children}
      </motion.span>
    </span>
  );
}

/**
 * LA FINESTRA (2026-08-12). La hero non è più solo il primo viewport: è
 * anche il secondo attore del menu. Aprendolo, tutto quello che sta qui
 * dentro — fotografia, veli, insegna, invito — smette di riempire lo
 * schermo e si raccoglie in un rettangolo appoggiato all'angolo in basso
 * a destra, mentre il campo POP della navigazione resta in primo piano.
 *
 * Come, in quattro righe:
 *
 *   1. la `<section>` resta in flusso e tiene la sua altezza (è il
 *      segnaposto: sotto non si muove niente, nessun salto);
 *   2. il suo unico figlio — la finestra — passa da `absolute inset-0` a
 *      `position: fixed` PARTENDO dalla misura reale della sezione, letta
 *      al volo. Nessun frame di sfasamento: al momento dello stacco il
 *      rettangolo fisso coincide con quello che c'era prima;
 *   3. da lì anima il proprio rettangolo — top, left, width, height — e
 *      non uno `scale`, che sfonderebbe il ritaglio e stirerebbe l'insegna;
 *   4. alla chiusura il rettangolo torna sulla misura della sezione,
 *      ri-letta in quel momento, e solo a corsa finita il fisso viene
 *      tolto. Il ritorno è al pixel per costruzione.
 *
 * Tutto questo NON passa dallo stato di React. L'unica cosa che cambia è
 * `aperto`, che arriva dal contesto: da lì in poi si lavora sul nodo, con
 * `animate()` di Motion. È voluto — una macchina a stati (fissa? in volo?
 * atterrata?) vorrebbe due render in più per ogni apertura, e li vorrebbe
 * proprio nei frame in cui l'animazione sta partendo.
 *
 * Il `<picture>` non viene mai smontato: la stessa immagine (o, domani,
 * lo stesso video) attraversa l'animazione senza ricaricarsi. Il ritaglio
 * `object-fit: cover` si riadatta da solo al nuovo formato — l'immagine
 * non si deforma mai, cambia solo quanto se ne vede.
 *
 * Misure, tempi ed ease stanno tutti in lib/hero-finestra.ts.
 */

/** il rettangolo a riposo: con `position: absolute` vale `inset: 0` */
const RIPOSO = { top: "0px", left: "0px", larghezza: "100%", altezza: "100%" } as const;

/** la finestra tocca il viewport? se no, il volo diventa una comparsa */
function inQuadro(r: DOMRect) {
  return r.bottom > 0 && r.top < window.innerHeight;
}

export function Hero() {
  const ridotto = useReducedMotion();
  const { aperto } = useMenu();

  const sezione = useRef<HTMLElement>(null);
  const finestra = useRef<HTMLDivElement>(null);

  /* IL RETTANGOLO DELLA FINESTRA, come quattro valori animati.
     Non si anima il nodo con `animate(elemento, …)`: Motion terrebbe quei
     numeri nel proprio stato e li riscriverebbe al primo render utile,
     anche molto dopo che la finestra è tornata in flusso. Con dei valori
     invece il riposo è un valore come un altro — `0px / 0px / 100% / 100%`
     che su un elemento assoluto È il pieno schermo — e non resta mai
     niente da ripulire. */
  const alto = useMotionValue<string>(RIPOSO.top);
  const sinistra = useMotionValue<string>(RIPOSO.left);
  const larghezza = useMotionValue<string>(RIPOSO.larghezza);
  const altezza = useMotionValue<string>(RIPOSO.altezza);

  /* la scala dell'impaginato: un valore animato, non uno stato — cambiarlo
     non fa ridisegnare il componente */
  const scala = useMotionValue(1);
  const velo = useMotionValue(1);
  /** serve solo alla comparsa e alla sparizione fuori campo */
  const trasparenza = useMotionValue(1);

  useEffect(() => {
    const sez = sezione.current;
    const fin = finestra.current;
    if (!sez || !fin) return;

    const durata = ridotto ? 0 : DURATA_MENU;
    const corse: { stop: () => void; finished: Promise<unknown> }[] = [];

    /* I quattro valori vanno scritti anche a mano sul nodo, oltre che nel
       loro MotionValue: `set()` arriva al DOM al prossimo frame, e in
       questo la finestra sta già cambiando `position`. Un frame di
       sfasamento, su un salto da schermo pieno a un angolo, si vede. */
    const posa = (t: string, s: string, l: string, a: string) => {
      alto.set(t);
      sinistra.set(s);
      larghezza.set(l);
      altezza.set(a);
      fin.style.top = t;
      fin.style.left = s;
      fin.style.width = l;
      fin.style.height = a;
    };

    /* ---------------------------- apertura ---------------------------- */
    if (aperto) {
      const meta = finestraHero();

      /* Lo stacco. Se la finestra è già libera (riapertura al volo, mentre
         stava tornando a schermo pieno) si riparte da dove si trova: le
         inline ci sono già e `animate` legge lo stato corrente.

         IL MENU SI APRE ANCHE A PAGINA SCORSA, e lì la hero è lontana
         sopra il bordo alto: farla volare dentro da meno duemila pixel
         sarebbe una cometa, non una ricomposizione. In quel caso la
         finestra non viaggia — compare al suo posto, di un soffio più
         larga, e si posa. */
      const partenza = sez.getBoundingClientRect();
      const viaggio = fin.dataset.libera ? true : inQuadro(partenza);

      if (!fin.dataset.libera) {
        /* la comparsa parte da un rettangolo del 6% più largo, centrato
           sul punto d'arrivo: è un posarsi, non un ingresso */
        const largo = viaggio ? partenza.width : meta.width * 1.06;
        const alta = viaggio ? partenza.height : meta.height * 1.06;
        fin.dataset.libera = "si";
        fin.style.position = "fixed";
        fin.style.zIndex = "70";
        posa(
          `${viaggio ? partenza.top : meta.top - (alta - meta.height) / 2}px`,
          `${viaggio ? partenza.left : meta.left - (largo - meta.width) / 2}px`,
          `${largo}px`,
          `${alta}px`,
        );
        if (!viaggio) trasparenza.set(0);
      }
      if (meta.testo) delete fin.dataset.soloFoto;
      else fin.dataset.soloFoto = "si";

      const opzioni = {
        duration: viaggio ? durata : durata * 0.7,
        delay: ridotto ? 0 : RITARDO_FINESTRA,
        ease: EASE_MENU,
      };
      fin.dataset.inVolo = "si";
      corse.push(
        animate(alto, `${meta.top}px`, opzioni),
        animate(sinistra, `${meta.left}px`, opzioni),
        animate(larghezza, `${meta.width}px`, opzioni),
        animate(altezza, `${meta.height}px`, opzioni),
        animate(trasparenza, 1, opzioni),
        animate(scala, meta.scala, opzioni),
        animate(velo, meta.testo ? 1 : 0, opzioni),
      );
      Promise.all(corse.map((c) => c.finished))
        .then(() => {
          delete fin.dataset.inVolo;
        })
        .catch(() => {});

      /* Ruotare il telefono a menu aperto cambia il rettangolo d'arrivo:
         lo si riallinea di netto, inseguire un resize con un'animazione
         non serve a nessuno. */
      const suMisura = () => {
        const nuova = finestraHero();
        corse.forEach((c) => c.stop());
        delete fin.dataset.inVolo;
        posa(`${nuova.top}px`, `${nuova.left}px`, `${nuova.width}px`, `${nuova.height}px`);
        scala.set(nuova.scala);
        velo.set(nuova.testo ? 1 : 0);
        if (nuova.testo) delete fin.dataset.soloFoto;
        else fin.dataset.soloFoto = "si";
      };
      window.addEventListener("resize", suMisura);

      return () => {
        corse.forEach((c) => c.stop());
        delete fin.dataset.inVolo;
        window.removeEventListener("resize", suMisura);
      };
    }

    /* ---------------------------- chiusura ---------------------------- */
    /* al primo montaggio, e ogni volta che il menu è già chiuso, non c'è
       nessuna finestra staccata: niente da riportare a casa */
    if (!fin.dataset.libera) return;

    const r = sez.getBoundingClientRect();
    const opzioni = { duration: durata, ease: EASE_MENU };
    fin.dataset.inVolo = "si";

    if (inQuadro(r)) {
      corse.push(
        animate(alto, `${r.top}px`, opzioni),
        animate(sinistra, `${r.left}px`, opzioni),
        animate(larghezza, `${r.width}px`, opzioni),
        animate(altezza, `${r.height}px`, opzioni),
        animate(scala, 1, opzioni),
        animate(velo, 1, opzioni),
      );
    } else {
      /* La hero è fuori campo: non c'è niente da riespandere sotto gli
         occhi di nessuno. Si dissolve dietro la campitura del menu. */
      corse.push(animate(trasparenza, 0, { duration: durata * 0.45, ease: EASE_MENU }));
      scala.set(1);
      velo.set(1);
    }

    let vivo = true;
    Promise.all(corse.map((c) => c.finished))
      .then(() => {
        /* Atterrata sulla misura della sezione. Il rettangolo in pixel e
           il rettangolo a riposo ora dicono la stessa cosa — `0px` e
           `100%` di un elemento assoluto sono esattamente il rettangolo
           della sezione — quindi si può cambiare vocabolario nello stesso
           frame in cui si toglie il fisso: nessun salto, e soprattutto
           niente pixel congelati addosso alla finestra. */
        if (!vivo) return;
        delete fin.dataset.inVolo;
        delete fin.dataset.libera;
        delete fin.dataset.soloFoto;
        fin.style.removeProperty("position");
        fin.style.removeProperty("z-index");
        posa(RIPOSO.top, RIPOSO.left, RIPOSO.larghezza, RIPOSO.altezza);
        trasparenza.set(1);
      })
      .catch(() => {});

    return () => {
      vivo = false;
      corse.forEach((c) => c.stop());
      delete fin.dataset.inVolo;
    };
  }, [aperto, ridotto, alto, sinistra, larghezza, altezza, scala, velo, trasparenza]);

  /* L'invito resta nella pagina e porta al primo capitolo del catalogo.
     Lenis gestisce la corsa quando è attivo; con reduced motion rimane lo
     scroll nativo. */
  const scorriAlCatalogo = useCallback(() => {
    const meta = document.getElementById(DESTINAZIONE);
    if (!meta) return;

    const lenis = lenisAttivo();
    if (lenis) {
      lenis.scrollTo(meta, {
        duration: 1.25,
        easing: (t: number) => 1 - Math.pow(1 - t, 3),
      });
      return;
    }
    meta.scrollIntoView({
      block: "start",
      behavior: ridotto ? "auto" : "smooth",
    });
  }, [ridotto]);

  return (
    <section
      ref={sezione}
      /* niente `isolate`: creerebbe un contesto di impilamento e la
         finestra fissa, per quanto alta, resterebbe sotto il pannello del
         menu. Il z-index se lo prende lei quando serve. */
      className="relative min-h-[100svh] w-full overflow-hidden bg-cacao"
    >
      <motion.div
        ref={finestra}
        data-compatta={aperto || undefined}
        /* `absolute` senza `inset-0`: il rettangolo lo dicono i quattro
           valori qui sotto, che a riposo valgono per l'appunto inset 0 */
        style={{
          opacity: trasparenza,
          top: alto,
          left: sinistra,
          width: larghezza,
          height: altezza,
        }}
        className="hero-finestra absolute overflow-hidden"
      >
        {/* Lo scatto. Il ritaglio non è uno solo: su schermi larghi sta al
            centro (la fotografia è 16:9, il taglio è minimo), in verticale
            si sposta sul soggetto — vedi `.hero-scatto` in globals.css. */}
        <div className="hero-scatto">
          <picture>
            {/* la stessa soglia 5/4 delle varianti `verticale:`/`orizzontale:` */}
            <source
              media="(max-aspect-ratio: 5/4)"
              srcSet={`${HERO_IMAGE_VERT} 1x, ${HERO_IMAGE_VERT_2X} 2x`}
            />
            <img
              src={HERO_IMAGE}
              srcSet={`${HERO_IMAGE} 1x, ${HERO_IMAGE_2X} 2x`}
              alt="Intriko, il dolce di punta Delsigel, tra un nastro corallo e un set color cacao."
              fetchPriority="high"
              decoding="async"
              draggable={false}
              className="hero-foto absolute inset-0 h-full w-full object-cover"
            />
          </picture>
        </div>

        {/* velo quasi impercettibile sulla sola colonna del testo */}
        <div
          aria-hidden
          className="hero-velo pointer-events-none absolute inset-0 hidden orizzontale:block"
        />

        {/* in piedi: la fotografia si dissolve nel proprio arancio sotto */}
        <div
          aria-hidden
          className="hero-sfumatura pointer-events-none absolute inset-x-0 bottom-0 top-0 orizzontale:hidden"
        />

        {/* `h-full` e non più `min-h-[100svh]`: l'altezza la dà la finestra,
            che a menu aperto non è più il viewport. L'impaginato dentro non
            cambia — si accorcia il contenitore e il blocco si ricolloca da
            sé, che è esattamente ciò che si vuole vedere. */}
        <div className="hero-impaginato relative flex h-full flex-col justify-end px-[clamp(20px,5vw,96px)] pb-[9vh] orizzontale:justify-center orizzontale:pb-0">
          {/* Il blocco è ancorato al bordo del viewport, non a una colonna
              centrata: oltre i 2000px una `max-width` lo spingerebbe verso
              il centro, cioè addosso al soggetto — la fotografia non si
              sposta con la colonna. Il tetto di 6rem sull'insegna serve
              allo stesso scopo sugli ultra-larghi.
              In orizzontale il blocco non è centrato ma alzato: nel mockup
              il suo centro ottico sta al 43% dell'altezza, non al 50% —
              sotto deve restare aria, sopra c'è la navigazione.

              A menu aperto l'unica cosa che cambia è la SCALA: la stessa
              insegna, gli stessi rapporti, vista più piccola. Rifluire il
              testo in una gerarchia diversa lo farebbe leggere come un
              altro blocco — così invece si legge come la stessa hero, in
              una finestra più piccola. L'origine in basso a sinistra la
              tiene incollata al suo angolo mentre rimpicciolisce.
              Sul telefono la finestra è una striscia: il testo esce del
              tutto (`soloFoto`) invece di ridursi a un francobollo. */}
          <motion.div
            className="w-full"
            style={{ scale: scala, opacity: velo, transformOrigin: "left bottom" }}
          >
            <div className="w-fit orizzontale:-translate-y-[7vh]">
              {/* il marchio apre il blocco: entra per primo, con la stessa
                  molla delle righe. Bruno storico sul campo crema, panna
                  quando la copy poggia sul cacao (telefono in piedi). */}
              <motion.div
                initial={ridotto ? false : { y: 18, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.7, delay: ATTESA_RIGA * 0.5, ease: MOLLA }}
                className="mb-6 sm:mb-7"
              >
                <LogoStorico
                  variant="horizontal"
                  className="h-[26px] text-hero-panna sm:h-[30px] lg:h-[34px] orizzontale:text-bruno"
                />
              </motion.div>
              <h1 className="type-hero text-[clamp(2.3rem,9.6vw,3.4rem)] sm:text-[clamp(2.8rem,6.6vw,4.4rem)] lg:text-[clamp(3.2rem,4.62vw,6rem)]">
                <Riga indice={0} ridotto={ridotto}>
                  L&rsquo;industria
                </Riga>
                <Riga indice={1} ridotto={ridotto}>
                  artigianale.
                </Riga>
                <Riga indice={2} accento ridotto={ridotto}>
                  Innovativa e
                </Riga>
                <Riga indice={3} accento ridotto={ridotto}>
                  Buona per{" "}
                  <br className="sm:hidden" />
                  tutti.
                </Riga>
              </h1>

              {/* i due involucri `data-hero-uscita` (4 e 5): stessi motivi
                  della maschera delle righe — l'uscita in scrub lavora sul
                  contenitore, l'entrata di Motion resta sul figlio */}
              <div data-hero-uscita={4}>
                <motion.p
                  initial={ridotto ? false : { y: 18, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{
                    duration: 0.7,
                    delay: ATTESA_DESCRIZIONE,
                    ease: MOLLA,
                  }}
                  className="font-ui mt-6 max-w-[320px] text-[15px] font-medium leading-[1.3] tracking-[-0.015em] text-hero-panna sm:mt-7 sm:text-[16px] orizzontale:text-hero-nero"
                >
                  Dolci e salati da laboratorio,
                  <br />
                  prodotti su scala.
                  <br />
                  Catalogo 2026/27.
                </motion.p>
              </div>

              <div data-hero-uscita={5}>
                <motion.div
                  initial={ridotto ? false : { y: 18, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.7, delay: ATTESA_INVITO, ease: MOLLA }}
                  className="mt-7 sm:mt-8"
                >
                  <button
                    type="button"
                    onClick={scorriAlCatalogo}
                    /* a menu aperto la hero è un'anteprima, non una
                       destinazione: l'invito si vede ma non si preme, e
                       soprattutto non risponde al TAB dentro il menu */
                    tabIndex={aperto ? -1 : undefined}
                    className="hero-cta font-ui inline-flex h-[52px] w-[220px] items-center justify-between rounded-full border border-[rgb(23_21_18/0.08)] bg-hero-panna pl-[26px] pr-[22px] text-[13px] font-extrabold uppercase tracking-[0.03em] text-hero-nero"
                  >
                    Esplora il catalogo
                    {/* la freccia respira in giù: è il verso dello scroll,
                        non quello di un link. Il rimbalzo sta su questo
                        involucro e l'hover sull'icona (globals.css) —
                        due transform sullo stesso nodo si pesterebbero. */}
                    <motion.span
                      aria-hidden
                      className="flex"
                      animate={ridotto || aperto ? { y: 0 } : { y: [0, 3.5, 0] }}
                      transition={
                        ridotto || aperto
                          ? { duration: 0 }
                          : {
                              duration: 1.6,
                              repeat: Infinity,
                              repeatDelay: 0.6,
                              ease: "easeInOut",
                            }
                      }
                    >
                      <ArrowDown size={16} strokeWidth={2.6} />
                    </motion.span>
                  </button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
