"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { lenisAttivo } from "@/components/SmoothScroll";
import { STORIA } from "@/data/history";
import { HistoryIntroPanel } from "./HistoryIntroPanel";
import { HistoryTimeline } from "./HistoryTimeline";
import { HistoryStageStack } from "./HistoryStageStack";
import { HistoryFinale } from "./HistoryFinale";

/**
 * «La nostra storia»: una scena alta un viewport, agganciata allo scroll
 * dentro un wrapper alto sei.
 *
 * Una sola timeline GSAP in scrub muove tutto — deriva della pila,
 * accensione della fascia attiva, parallasse delle fotografie e dei
 * ritagli pop, riempimento della linea del tempo, finale. React tiene
 * due sole informazioni, quale tappa comanda e se il viaggio è
 * cominciato, e le aggiorna al cambio di capitolo: non a ogni pixel.
 *
 * L'unità di tempo della timeline è il capitolo. La tappa i-esima è al
 * centro della scena a `t = i`, comincia ad accendersi a `i - ANTICIPO`
 * e si spegne a `i + CONGEDO`. Da lì escono sia la mappatura tra
 * avanzamento e capitolo attivo sia i punti di aggancio.
 *
 * Quel che si muove a ogni frame è solo transform e opacity. I `filter`
 * cambiano nei passaggi di tappa — tween brevi — e mai in continuo.
 */

const N = STORIA.length;
const ANTICIPO = 0.5; /* di quanto la fascia precede il suo capitolo */
const CONGEDO = 0.5; /* di quanto la fascia sopravvive al suo capitolo */
const TOT = N + 0.35; /* durata: DEVE coprire l'ultimo tween del finale */
const ALTEZZA = 620; /* vh del wrapper: 520 di scorrimento + la scena */

/* La corsa della pila, per larghezza di schermo. Sono la differenza tra
   l'altezza della pila (sei fasce meno le sovrapposizioni, vedi
   HistoryStageStack) e il viewport, più un po' d'aria in cima perché la
   prima fascia non nasca incollata al bordo. */
const CORSA = {
  tablet: { da: 5, a: -17 }, /* pila 112vh */
  desktop: { da: 6, a: -25 }, /* pila 119vh */
};

/* I tre stati di una fascia. Il velo non arriva mai a coprire del tutto
   la fotografia nemmeno sulle tappe che devono ancora arrivare: nel
   mockup si vede sempre che sotto il colore c'è uno scatto, ed è quello
   che tiene la scena lontana dal muro di campiture piene. */
const VELO = { futura: 0.92, attiva: 0.62, passata: 0.85 };
const FOTO = {
  futura: "saturate(0.55) brightness(0.78)",
  attiva: "saturate(1.1) brightness(1.02)",
  passata: "saturate(0.62) brightness(0.74)",
};
/* il testo delle tappe già passate resta come eco, non come seconda
   voce: sopra 0.2 comincia a contendere la scena a quella attiva */
const TESTO_PASSATO = 0.18;

const SNAP = [...STORIA.map((_, i) => i / TOT), 1];
/* oltre questa distanza dal capitolo più vicino non si aggancia niente:
   lo snap accompagna, non decide al posto di chi legge */
const RAGGIO_SNAP = 0.04;

/**
 * Uno scorrimento programmato che lo smooth scroll non contrasti.
 *
 * Lenis riscrive `scrollTop` a ogni frame: sia lo snap interno di
 * ScrollTrigger sia un `window.scrollTo` fluido verrebbero ripresi
 * indietro. Quando c'è, quindi, si chiede a lui; il nativo resta come
 * riserva per chi lo smooth scroll non ce l'ha.
 */
function scorriA(y: number, durata: number) {
  const lenis = lenisAttivo();
  if (lenis) {
    lenis.scrollTo(y, { duration: durata });
    return;
  }
  window.scrollTo({ top: y, behavior: "smooth" });
}

export function HistoryParallaxSection() {
  const wrapper = useRef<HTMLElement>(null);
  const scena = useRef<HTMLDivElement>(null);
  const vai = useRef<(i: number) => void>(() => {});
  const [attiva, setAttiva] = useState(0);
  const [fase, setFase] = useState<"intro" | "storia">("intro");

  useGSAP(
    () => {
      /* il plugin si registra qui: il modulo viene valutato anche sul
         server, ScrollTrigger serve solo al client */
      gsap.registerPlugin(ScrollTrigger);

      const scope = scena.current;
      const sezione = wrapper.current;
      if (!scope || !sezione) return;

      const fasce = gsap.utils.toArray<HTMLElement>("[data-fascia]", scope);
      const foto = gsap.utils.toArray<HTMLElement>("[data-foto]", scope);
      const veli = gsap.utils.toArray<HTMLElement>("[data-velo]", scope);
      const pop = gsap.utils.toArray<HTMLElement>("[data-pop]", scope);
      const pila = scope.querySelector<HTMLElement>("[data-pila]");
      const filo = scope.querySelector<HTMLElement>("[data-filo]");
      const alba = scope.querySelector<HTMLElement>("[data-alba]");
      const buio = scope.querySelector<HTMLElement>("[data-buio]");
      const finale = scope.querySelector<HTMLElement>("[data-finale]");

      const mm = gsap.matchMedia();

      mm.add(
        {
          tablet: "(min-width: 768px) and (max-width: 1023.98px)",
          desktop: "(min-width: 1024px)",
        },
        (ctx) => {
          const corsa = ctx.conditions?.tablet ? CORSA.tablet : CORSA.desktop;

          /* stato di riposo: tutto spento, la prima fascia esclusa —
             se la scena viene raggiunta già a metà, il primo frame
             dello scrub la porta comunque al punto giusto */
          const testi = fasce.map((f) =>
            gsap.utils.toArray<HTMLElement>("[data-testo]", f)
          );

          gsap.set(pila, { y: `${corsa.da}vh` });
          gsap.set(veli, { opacity: VELO.futura });
          gsap.set(foto, { filter: FOTO.futura });
          gsap.set(fasce, { xPercent: 3, scale: 0.985 });
          testi.forEach((t) => gsap.set(t, { opacity: 0, y: 14 }));
          if (filo) gsap.set(filo, { scaleY: 0 });
          if (alba) gsap.set(alba, { opacity: 0 });
          if (buio) gsap.set(buio, { opacity: 0 });
          if (finale) gsap.set(finale, { opacity: 0, y: 24 });

          const tl = gsap.timeline({ defaults: { ease: "none" }, paused: true });

          /* la deriva della pila: una sola corsa continua da cima a
             fondo, il respiro di tutta la scena */
          if (pila) {
            tl.fromTo(
              pila,
              { y: `${corsa.da}vh` },
              { y: `${corsa.a}vh`, duration: TOT },
              0
            );
          }

          STORIA.forEach((_, i) => {
            const entra = Math.max(0, i - ANTICIPO);

            /* la tappa entra: il velo si alleggerisce, la fotografia
               riprende luce, la fascia avanza e cresce di un soffio */
            tl.to(veli[i], { opacity: VELO.attiva, duration: 0.5, ease: "power1.out" }, entra)
              .to(foto[i], { filter: FOTO.attiva, duration: 0.5, ease: "power1.out" }, entra)
              .to(
                fasce[i],
                { xPercent: 0, scale: 1.035, duration: 0.55, ease: "power2.out" },
                entra
              )
              .to(
                testi[i],
                { opacity: 1, y: 0, duration: 0.4, stagger: 0.06, ease: "power2.out" },
                entra + 0.12
              );

            /* la tappa resta in scena, ma smette di comandare. L'ultima
               no: da lì si va dritti al finale. */
            if (i < N - 1) {
              const esce = i + CONGEDO;
              tl.to(veli[i], { opacity: VELO.passata, duration: 0.45 }, esce)
                .to(foto[i], { filter: FOTO.passata, duration: 0.45 }, esce)
                .to(
                  fasce[i],
                  { xPercent: -1, scale: 1, duration: 0.45, ease: "power2.in" },
                  esce
                )
                .to(testi[i], { opacity: TESTO_PASSATO, duration: 0.35 }, esce);
            }

            /* parallasse interno: la fotografia scorre dentro la fascia,
               non insieme a lei, e ogni tappa va a una velocità sua */
            const ampiezza = 7 + (i % 3) * 2.5;
            tl.fromTo(
              foto[i],
              { yPercent: -ampiezza },
              { yPercent: ampiezza, duration: TOT },
              0
            );
          });

          /* i ritagli pop: stessa corsa, profondità diverse. È quel che
             dà spessore allo spazio tra le fasce e l'occhio. */
          pop.forEach((o) => {
            const prof = Number(o.dataset.profondita ?? 1);
            tl.fromTo(
              o,
              { y: `${6 * prof}vh`, rotation: -3 * prof },
              { y: `${-9 * prof}vh`, rotation: 3 * prof, duration: TOT },
              0
            );
          });

          if (filo) {
            tl.fromTo(filo, { scaleY: 0 }, { scaleY: 1, duration: N - 0.6 }, 0.3);
          }

          /* il finale: il palco arretra e si spegne, l'alba lo riscalda
             da dentro, la frase sale */
          if (buio) tl.to(buio, { opacity: 0.86, duration: 0.8, ease: "power1.out" }, N - 0.6);
          if (pila) tl.to(pila, { scale: 0.955, duration: 0.9, ease: "power2.out" }, N - 0.45);
          if (alba) tl.to(alba, { opacity: 1, duration: 0.85, ease: "power1.out" }, N - 0.55);
          if (finale) {
            tl.to(
              finale,
              { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
              N - 0.2
            );
          }

          /* finestra di silenzio dopo uno scorrimento pilotato: è una
             scadenza e non un flag, così se chi legge interrompe la
             corsa (Lenis in quel caso non chiama la fine) l'aggancio non
             resta disarmato per sempre */
          let zitto = 0;
          const taci = (secondi: number) => {
            zitto = performance.now() + secondi * 1000;
          };
          const pilotato = () => performance.now() < zitto;

          /**
           * Lo snap sui capitoli, fatto in casa.
           *
           * Quello di ScrollTrigger non entra mai in funzione qui:
           * aspetta un istante di scroll fermo, e con Lenis che riscrive
           * la posizione a ogni frame quell'istante non arriva. Allora
           * si conta il tempo da soli — un ritardo che riparte a ogni
           * aggiornamento — e ci si aggancia solo se il capitolo più
           * vicino è già a un passo: sopra quella distanza comanda il
           * dito.
           */
          const attesa = gsap.delayedCall(0.45, () => {
            if (pilotato() || !st.isActive) return;
            const p = st.progress;
            const meta = SNAP.reduce((a, b) =>
              Math.abs(b - p) < Math.abs(a - p) ? b : a
            );
            if (Math.abs(meta - p) > RAGGIO_SNAP) return;
            const y = st.start + (st.end - st.start) * meta;
            if (Math.abs(y - window.scrollY) < 8) return;
            taci(0.8);
            scorriA(y, 0.5);
          });
          attesa.pause();

          const st = ScrollTrigger.create({
            animation: tl,
            trigger: sezione,
            start: "top top",
            end: "bottom bottom",
            pin: scope,
            pinSpacing: false,
            anticipatePin: 1,
            scrub: 1,
            invalidateOnRefresh: true,
            onToggle: (self) => {
              scope.classList.toggle("storia-scena--viva", self.isActive);
            },
            onUpdate: (self) => {
              const t = self.progress * TOT;
              const i = gsap.utils.clamp(0, N - 1, Math.round(t));
              setAttiva((prec) => (prec === i ? prec : i));
              setFase((prec) => (t > 0.6 ? "storia" : t < 0.35 ? "intro" : prec));
              if (!pilotato()) attesa.restart(true);
            },
          });

          /* i marker della linea del tempo sono pulsanti veri: portano
             allo scroll del capitolo */
          vai.current = (i: number) => {
            taci(1.3);
            scorriA(st.start + (st.end - st.start) * (i / TOT), 1);
          };

          return () => {
            attesa.kill();
            vai.current = () => {};
            scope.classList.remove("storia-scena--viva");
          };
        }
      );

      /* le misure non dipendono dalle fotografie (la scena è alta un
         viewport), ma font e immagini possono arrivare dopo il primo
         calcolo: una passata di refresh quando la pagina è completa */
      let vivo = true;
      const rimisura = () => {
        if (vivo) ScrollTrigger.refresh();
      };
      if (document.readyState !== "complete") {
        window.addEventListener("load", rimisura, { once: true });
      }
      document.fonts?.ready.then(rimisura);

      return () => {
        vivo = false;
        window.removeEventListener("load", rimisura);
        mm.revert();
      };
    },
    { scope: scena }
  );

  return (
    <section
      ref={wrapper}
      id="storia"
      aria-labelledby="storia-titolo"
      className="relative scroll-mt-24 bg-inchiostro"
      style={{ height: `${ALTEZZA}vh` }}
    >
      <div
        ref={scena}
        className="storia-scena relative h-screen w-full overflow-hidden"
      >
        <HistoryStageStack attiva={attiva} />

        {/* z-10: sopra le fasce, sotto i ritagli pop — uno dei quali
            deve scavalcare la linea del tempo, com'è nel mockup */}
        <div className="pointer-events-none relative z-10 flex h-full">
          <HistoryIntroPanel tappa={STORIA[attiva]} fase={fase} />
          <HistoryTimeline
            tappe={STORIA}
            attiva={attiva}
            onVai={(i) => vai.current(i)}
          />
        </div>

        <HistoryFinale />
      </div>
    </section>
  );
}
