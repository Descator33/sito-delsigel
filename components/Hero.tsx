"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useCallback, useEffect, useRef, type ReactNode } from "react";
import { animate, motion, useMotionValue, useReducedMotion } from "motion/react";
import { ArrowDown } from "lucide-react";
import {
  HeroFrameSequence,
  type HeroFrameSequenceHandle,
} from "@/components/HeroFrameSequence";
import { LogoStorico } from "@/components/LogoStorico";
import { useMenu } from "@/components/MenuStato";
import { lenisAttivo } from "@/components/SmoothScroll";
import {
  DURATA_MENU,
  EASE_MENU,
  RITARDO_FINESTRA,
  finestraHero,
} from "@/lib/hero-finestra";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * Hero "Vortice Intriko" (2026-08-20).
 *
 * Il prodotto di punta è il soggetto, non un accessorio: un Intriko
 * monumentale occupa la metà destra e il nastro corallo riprende la
 * torsione della sfoglia. A sinistra il blocco brand: il marchio storico
 * Delsigel sopra l'insegna, poi copy e invito — tutti in HTML, mai
 * stampati nel raster, così marchio e parole restano esatti.
 *
 * La prima visita è una moviescroller: 90 WebP desktop o 72 mobile, sempre
 * con una finestra decodificata piccola in memoria. Lo scroll allarga la
 * macro fino al set completo; l'ultimo frame del video non viene servito.
 * Al suo posto entra, con una maschera, il `<picture>` approvato:
 *
 *   orizzontale  1920×1080 (148 KB)  ·  3840×2160 (382 KB)
 *   verticale    1080×1920 (107 KB)  ·  2160×3840 (279 KB)
 *
 * Il frame iniziale della sequenza è l'LCP. Il picture finale usa ritaglio
 * e `srcSet` a densità; i quattro WebP sono già tarati a mano e non vanno
 * ricompressi dall'ottimizzatore.
 */
export const HERO_IMAGE = "/hero/hero-intriko-vortice.webp";
export const HERO_IMAGE_2X = "/hero/hero-intriko-vortice@2x.webp";
export const HERO_IMAGE_VERT = "/hero/hero-intriko-vortice-mobile.webp";
export const HERO_IMAGE_VERT_2X = "/hero/hero-intriko-vortice-mobile@2x.webp";

/** dove porta l'invito: il primo capitolo della gamma, in Home */
const DESTINAZIONE = "catalogo";

/** riga dell'insegna: la maschera sta sul blocco, il testo ci sale dentro.
 *  `data-hero-uscita` resta sulla maschera come aggancio stabile per
 *  la timeline scroll-driven. Nessuna riga usa dissolvenze. */
function Riga({
  indice,
  accento,
  children,
}: {
  indice: number;
  accento?: boolean;
  children: ReactNode;
}) {
  return (
    <span className="block overflow-hidden pb-[0.06em]" data-hero-uscita={indice}>
      <span
        data-hero-caption
        className={`block ${
          accento ? "text-corallo" : "text-hero-panna orizzontale:text-cacao"
        }`}
      >
        {children}
      </span>
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
  const { aperto, heroDiRitorno } = useMenu();
  const heroStatica = Boolean(ridotto) || heroDiRitorno;

  const racconto = useRef<HTMLElement>(null);
  const palco = useRef<HTMLDivElement>(null);
  const finestra = useRef<HTMLDivElement>(null);
  const sequenza = useRef<HeroFrameSequenceHandle>(null);
  const frameFinale = useRef<HTMLDivElement>(null);
  const invito = useRef<HTMLButtonElement>(null);
  const progressoScroll = useRef(0);

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

  /* La timeline possiede soltanto il playhead, le maschere della still e
     le trasformazioni delle caption. Motion resta l'unico proprietario
     del rettangolo della finestra usato dal menu. */
  useGSAP(
    () => {
      const track = racconto.current;
      const finale = frameFinale.current;
      if (!track || !finale) return;

      const righe = gsap.utils.toArray<HTMLElement>("[data-hero-caption]", track);
      const logo = track.querySelector<HTMLElement>("[data-hero-caption-logo]");
      const descrizione = gsap.utils.toArray<HTMLElement>(
        "[data-hero-caption-copy]",
        track,
      );
      const cta = track.querySelector<HTMLElement>("[data-hero-caption-cta]");
      const cue = track.querySelector<HTMLElement>("[data-hero-scroll-cue]");
      const barra = track.querySelector<HTMLElement>("[data-hero-progress]");

      if (heroStatica) {
        progressoScroll.current = 1;
        gsap.set(finale, { clipPath: "inset(0 0 0 0)" });
        gsap.set([logo, ...righe, ...descrizione, cta].filter(Boolean), {
          transform: "none",
        });
        if (barra) gsap.set(barra, { scaleX: 1 });
        if (invito.current) invito.current.tabIndex = 0;
        return;
      }

      const playhead = { valore: 0 };
      gsap.set(finale, { clipPath: "inset(0 100% 0 0)" });
      if (logo) gsap.set(logo, { transform: "translateY(115%)" });
      gsap.set(righe, { transform: "translateY(165%)" });
      gsap.set(descrizione, { transform: "translateY(115%)" });
      if (cta) gsap.set(cta, { transform: "translateX(-110%)" });
      if (barra) gsap.set(barra, { scaleX: 0, transformOrigin: "left center" });

      const timeline = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: track,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.12,
          invalidateOnRefresh: true,
          onUpdate: ({ progress }) => {
            progressoScroll.current = progress;
            if (invito.current) {
              invito.current.tabIndex = progress >= 0.93 ? 0 : -1;
            }
          },
        },
      });

      timeline
        .to(
          playhead,
          {
            valore: 1,
            duration: 0.7,
            onUpdate: () => sequenza.current?.mostra(playhead.valore),
          },
          0,
        )
        .to(
          cue,
          { yPercent: 155, duration: 0.055, ease: "power3.in" },
          0.025,
        )
        .to(barra, { scaleX: 1, duration: 1 }, 0)
        /* È la still approvata a chiudere il film. Entra a tendina: nessuna
           dissolvenza e nessun uso dell'ultimo frame Kling. */
        .to(
          finale,
          {
            clipPath: "inset(0 0% 0 0)",
            duration: 0.045,
            ease: "power2.inOut",
          },
          0.7,
        );

      if (logo) {
        timeline.to(
          logo,
          { transform: "translateY(0%)", duration: 0.055, ease: "power3.out" },
          0.755,
        );
      }
      timeline.to(
        righe,
        {
          transform: "translateY(0%)",
          duration: 0.06,
          stagger: 0.02,
          ease: "power3.out",
        },
        0.79,
      );
      timeline.to(
        descrizione,
        {
          transform: "translateY(0%)",
          duration: 0.055,
          stagger: 0.018,
          ease: "power3.out",
        },
        0.89,
      );
      if (cta) {
        timeline.to(
          cta,
          { transform: "translateX(0%)", duration: 0.06, ease: "power3.out" },
          0.94,
        );
      }

      sequenza.current?.mostra(0);
    },
    { scope: racconto, dependencies: [heroStatica], revertOnUpdate: true },
  );

  /* Quando il ritorno avviene dentro la stessa pagina (Catalogo -> Home),
     la track passa da 440/400svh a un viewport. Le scene successive devono
     ricalcolare i propri punti dopo che layout e scroll si sono assestati. */
  useEffect(() => {
    if (!heroDiRitorno) return;
    let secondoFrame = 0;
    const primoFrame = requestAnimationFrame(() => {
      secondoFrame = requestAnimationFrame(() => ScrollTrigger.refresh());
    });
    return () => {
      cancelAnimationFrame(primoFrame);
      cancelAnimationFrame(secondoFrame);
    };
  }, [heroDiRitorno]);

  /* Il CTA non deve ricevere focus mentre è ancora sotto la maschera; il
     menu può aprirsi e chiudersi senza muovere lo scroll, quindi riallinea
     qui il tabindex anche in assenza di un nuovo update di ScrollTrigger. */
  useEffect(() => {
    if (!invito.current) return;
    invito.current.tabIndex =
      aperto || (!heroStatica && progressoScroll.current < 0.93) ? -1 : 0;
  }, [aperto, heroStatica]);

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
      ref={racconto}
      data-hero-static={heroDiRitorno || undefined}
      /* niente `isolate`: creerebbe un contesto di impilamento e la
         finestra fissa, per quanto alta, resterebbe sotto il pannello del
         menu. Il z-index se lo prende lei quando serve. */
      className="hero-scroll-track relative w-full bg-cacao"
    >
      <div ref={palco} className="hero-scroll-stage sticky top-0 h-[100svh] w-full">
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
            {!heroDiRitorno && (
              <HeroFrameSequence
                ref={sequenza}
                disabilitata={Boolean(ridotto)}
              />
            )}

            {/* Non è il frame 145 del video: è il key visual 4K approvato,
                art-directed anche in verticale. La timeline lo svela a
                tendina prima di far entrare qualsiasi caption. */}
            <div ref={frameFinale} className="hero-frame-finale absolute inset-0">
              <picture>
                <source
                  media="(max-aspect-ratio: 5/4)"
                  srcSet={`${HERO_IMAGE_VERT} 1x, ${HERO_IMAGE_VERT_2X} 2x`}
                />
                <img
                  src={HERO_IMAGE}
                  srcSet={`${HERO_IMAGE} 1x, ${HERO_IMAGE_2X} 2x`}
                  alt="Intriko, il dolce di punta Delsigel, tra un nastro corallo e un set color cacao."
                  fetchPriority={heroDiRitorno ? "high" : "low"}
                  decoding="async"
                  draggable={false}
                  className="hero-foto absolute inset-0 h-full w-full object-cover"
                />
              </picture>
            </div>
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
            <div className="w-fit orizzontale:-translate-y-[2vh]">
              {/* Ogni elemento entra da una maschera: nessuna opacity e
                  quindi nessuna dissolvenza tipografica. */}
              <div className="mb-6 overflow-hidden sm:mb-7">
                <div data-hero-caption-logo>
                  <LogoStorico
                    variant="horizontal"
                    className="h-[26px] text-hero-panna sm:h-[30px] lg:h-[34px] orizzontale:text-bruno"
                  />
                </div>
              </div>
              <h1 className="type-hero text-[clamp(2.3rem,9.6vw,3.4rem)] sm:text-[clamp(2.8rem,6.6vw,4.4rem)] lg:text-[clamp(3.2rem,4.62vw,6rem)]">
                <Riga indice={0}>L&rsquo;industria</Riga>
                <Riga indice={1}>artigianale.</Riga>
                <Riga indice={2} accento>
                  Innovazione e
                </Riga>
                <Riga indice={3} accento>
                  Tradizione.
                </Riga>
              </h1>

              {/* Descrizione e invito arrivano solo dopo la still. */}
              <div data-hero-uscita={4}>
                <p className="font-ui mt-6 max-w-[320px] text-[15px] font-medium leading-[1.3] tracking-[-0.015em] text-hero-panna sm:mt-7 sm:text-[16px] orizzontale:text-hero-nero">
                  <span className="block overflow-hidden">
                    <span className="block" data-hero-caption-copy>
                      Dolci e salati da laboratorio,
                    </span>
                  </span>
                  <span className="block overflow-hidden">
                    <span className="block" data-hero-caption-copy>
                      prodotti su scala.
                    </span>
                  </span>
                  <span className="block overflow-hidden">
                    <span className="block" data-hero-caption-copy>
                      Catalogo 2026/27.
                    </span>
                  </span>
                </p>
              </div>

              <div className="overflow-hidden" data-hero-uscita={5}>
                <div data-hero-caption-cta className="mt-7 sm:mt-8">
                  <button
                    ref={invito}
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
                </div>
              </div>
            </div>
          </motion.div>
        </div>

          {/* L'istruzione è letterale, non affidata alla sola icona. Esce
              scorrendo verso il basso; la barra resta a mostrare quanto
              manca alla composizione finale. */}
          <div
            className="pointer-events-none absolute bottom-[clamp(28px,4vh,52px)] left-1/2 z-20 -translate-x-1/2"
            aria-hidden="true"
          >
            <div
              data-hero-scroll-cue
              className="hero-scroll-cue font-ui flex items-center gap-3 whitespace-nowrap rounded-full bg-cacao px-5 py-3 text-[11px] font-extrabold uppercase tracking-[0.11em] text-panna shadow-[0_16px_44px_rgb(43_29_22/0.3)] sm:px-6 sm:text-[12px]"
            >
              Scorri fino alla fine
              <motion.span
                className="flex"
                animate={heroStatica ? { y: 0 } : { y: [0, 4, 0] }}
                transition={
                  heroStatica
                    ? { duration: 0 }
                    : { duration: 1.25, repeat: Infinity, ease: "easeInOut" }
                }
              >
                <ArrowDown size={16} strokeWidth={2.7} />
              </motion.span>
            </div>
          </div>
          <span className="sr-only">
            Scorri fino alla fine della sequenza per leggere la presentazione Delsigel.
          </span>

          <div
            className="hero-scroll-progress pointer-events-none absolute inset-x-0 bottom-0 z-20 h-1 bg-[rgb(255_248_237/0.28)]"
            aria-hidden="true"
          >
            <span
              data-hero-progress
              className="block h-full w-full origin-left scale-x-0 bg-corallo"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
