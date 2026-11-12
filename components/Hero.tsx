"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useEffect, useRef, type ReactNode } from "react";
import { animate, motion, useMotionValue, useReducedMotion } from "motion/react";
import { LogoStorico } from "@/components/LogoStorico";
import { useMenu } from "@/components/MenuStato";
import { usePreloader } from "@/components/Preloader";
import { useTesti } from "@/components/LinguaProvider";
import { HERO_IMAGE } from "@/lib/hero-image";
import {
  DURATA_MENU,
  EASE_MENU,
  RITARDO_FINESTRA,
  finestraHero,
} from "@/lib/hero-finestra";

gsap.registerPlugin(useGSAP);

/** riga dell'insegna: la maschera sta sul blocco, il testo ci sale dentro.
 *  `data-hero-uscita` resta sulla maschera come aggancio stabile per
 *  la timeline d'ingresso. Nessuna riga usa dissolvenze.
 *
 *  L'ARIA SOPRA LE MAIUSCOLE ACCENTATE. Con `line-height: 0.88` il box
 *  della riga è più corto dei glifi: una E maiuscola ci sta con 0.071em
 *  d'avanzo, ma È, Ä e Ö portano l'accento 0.114em SOPRA il bordo, e la
 *  maschera — che deve restare `overflow-hidden` per l'ingresso — lo
 *  tagliava («È INNOVAZIONE», «KÄSITYÖ»). Il padding apre la finestra
 *  quel tanto, il margine negativo lo restituisce al flusso: l'interlinea
 *  e la posizione dell'insegna non cambiano di un pixel. Sotto invece non
 *  sfora niente (il maiuscolo non ha discendenti), quindi `pb` resta
 *  quello che era. */
function Riga({
  indice,
  children,
}: {
  indice: number;
  children: ReactNode;
}) {
  return (
    <span
      className="block overflow-hidden pt-[0.14em] -mt-[0.14em] pb-[0.06em]"
      data-hero-uscita={indice}
    >
      <span
        data-hero-caption
        className="block text-hero-panna"
      >
        {children}
      </span>
    </span>
  );
}

/**
 * LA FINESTRA (2026-08-12). La hero non è più solo il primo viewport: è
 * anche il secondo attore del menu. Aprendolo, tutto quello che sta qui
 * dentro — fotografia, veli, insegna, marchio — smette di riempire lo
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
  const testi = useTesti();
  const ridotto = useReducedMotion();
  const { aperto, heroDiRitorno } = useMenu();
  const { pronto: preloaderPronto } = usePreloader();
  const heroStatica = Boolean(ridotto) || heroDiRitorno;

  const racconto = useRef<HTMLElement>(null);
  const palco = useRef<HTMLDivElement>(null);
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

  // Le scritte entrano subito dopo il caricamento della fotografia.
  useGSAP(
    () => {
      if (!preloaderPronto || !racconto.current) return;
      const righe = gsap.utils.toArray<HTMLElement>("[data-hero-caption]", racconto.current);
      const logo = racconto.current.querySelector<HTMLElement>("[data-hero-caption-logo]");
      if (heroStatica) {
        gsap.set([logo, ...righe].filter(Boolean), { transform: "none" });
        return;
      }
      gsap.to(righe, { transform: "translateY(0%)", duration: 0.55, stagger: 0.1, ease: "power3.out" });
      if (logo) gsap.to(logo, { transform: "translateY(0%)", duration: 0.55, delay: 0.35, ease: "power3.out" });
    },
    { scope: racconto, dependencies: [heroStatica, preloaderPronto], revertOnUpdate: true },
  );

  useEffect(() => {
    const sez = palco.current;
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

  return (
    <section
      ref={racconto}
      data-hero-static={heroDiRitorno || undefined}
      /* niente `isolate`: creerebbe un contesto di impilamento e la
         finestra fissa, per quanto alta, resterebbe sotto il pannello del
         menu. Il z-index se lo prende lei quando serve. */
      className="hero-scena relative w-full bg-cacao"
    >
      {/* Un solo viewport, niente track di scrub: il palco È la sezione,
          e conserva il rettangolo 100svh che la macchina del menu misura
          e trasforma. z-index e overflow erano già suoi, solo inline. */}
      <div ref={palco} className="hero-palco relative z-[70] h-[100svh] w-full overflow-hidden">
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
          <div className="hero-scatto">
            {/* La fotografia originale viene servita direttamente, senza ridimensionamenti. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={HERO_IMAGE}
              alt={testi.hero.alt}
              fetchPriority="high"
              decoding="async"
              draggable={false}
              className="hero-foto absolute inset-0 h-full w-full object-cover"
            />
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
        <div className="hero-impaginato relative flex h-full flex-col justify-end px-[clamp(20px,5vw,96px)] pb-[calc(15vh+88px)] sm:pb-[calc(15vh+96px)] orizzontale:justify-center orizzontale:pb-0">
          {/* Il blocco è ancorato al bordo del viewport, non a una colonna
              centrata: oltre i 2000px una `max-width` lo spingerebbe verso
              il centro, cioè addosso al soggetto — la fotografia non si
              sposta con la colonna. Il tetto di 6rem sull'insegna serve
              allo stesso scopo sugli ultra-larghi.
              In orizzontale il blocco non è centrato ma alzato: il suo
              centro ottico sta sopra la metà dell'altezza, non al 50% —
              sotto deve restare aria, sopra c'è la navigazione.
              L'alzata (qui e nel `pb` verticale) serve anche a togliere
              l'ultima riga di dosso all'Intriko: sovrapposta al dolce la
              scritta perdeva contrasto e si leggeva a fatica.

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
            <div className="w-fit orizzontale:-translate-y-[10vh]">
              {/* Le righe vengono dal dizionario: ogni lingua decide i
                  propri a-capo, la maschera resta per riga. */}
              <h1 className="hero-titolo type-hero text-[clamp(2.3rem,9.6vw,3.4rem)] sm:text-[clamp(2.8rem,6.6vw,4.4rem)] lg:text-[clamp(3.2rem,4.62vw,6rem)]">
                {testi.hero.insegna.map((riga, indice) => (
                  <Riga key={riga.testo} indice={indice}>
                    {riga.testo}
                  </Riga>
                ))}
              </h1>
            </div>
          </motion.div>

          {/* Il marchio non chiude più il blocco di testo: sta nell'angolo
              in basso a sinistra del palco, ancorato al bordo come una
              firma. Entra da una maschera come il titolo, un passo dopo,
              e condivide scala e origine con la caption così che a menu
              aperto rimpicciolisca restando incollato al suo angolo. */}
          <motion.div
            className="absolute bottom-[clamp(20px,5vh,56px)] left-[clamp(20px,5vw,96px)]"
            style={{ scale: scala, opacity: velo, transformOrigin: "left bottom" }}
          >
            <div className="overflow-hidden">
              <div data-hero-caption-logo>
                <LogoStorico
                  variant="stacked"
                  className="h-[60px] text-hero-panna sm:h-[68px] lg:h-[80px]"
                />
              </div>
            </div>
          </motion.div>
        </div>

        </motion.div>
      </div>
    </section>
  );
}
