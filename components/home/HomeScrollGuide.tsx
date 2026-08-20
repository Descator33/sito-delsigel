"use client";

import { useRef } from "react";
import { ArrowDown } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

const CAPITOLI = [
  { selettore: ".apertura", etichetta: "Apertura" },
  { selettore: "#catalogo-fisico", etichetta: "Catalogo" },
  { selettore: "#storia", etichetta: "Storia" },
  { selettore: ".ponte-futuro", etichetta: "Futuro" },
  { selettore: "#crea-il-tuo-dolce", etichetta: "Crea" },
] as const;

const limita = (valore: number) => Math.min(1, Math.max(0, valore));

/**
 * La bussola della home: una piccola isola client che osserva lo stesso
 * scroll nativo usato da Lenis e ScrollTrigger, senza introdurre un secondo
 * ciclo di animazione. Il rail misura la distanza reale della pagina: le
 * tacche non sono equidistanti perché i capitoli non hanno la stessa durata.
 */
export function HomeScrollGuide() {
  const guida = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);

      const elemento = guida.current;
      const radice = elemento?.closest<HTMLElement>("[data-home-experience]");
      const guscio = elemento?.querySelector<HTMLElement>("[data-home-scroll-shell]");
      const riempimento = elemento?.querySelector<HTMLElement>("[data-home-scroll-fill]");
      const numero = elemento?.querySelector<HTMLElement>("[data-home-scroll-current]");
      const etichetta = elemento?.querySelector<HTMLElement>("[data-home-scroll-label]");
      const tacche = elemento
        ? Array.from(elemento.querySelectorAll<HTMLElement>("[data-home-scroll-marker]"))
        : [];

      if (!elemento || !radice || !guscio || !riempimento || !numero || !etichetta) {
        return;
      }

      // Il footer del sito è figlio diretto della Experience. La storia usa
      // a sua volta un <footer> interno, che non deve chiudere la guida.
      const footerSito = Array.from(radice.children).find(
        (figlio): figlio is HTMLElement => figlio instanceof HTMLElement && figlio.tagName === "FOOTER"
      );
      const sezioni = CAPITOLI.map(({ selettore }) =>
        radice.querySelector<HTMLElement>(selettore)
      );
      const sequenzaStoria = radice.querySelector<HTMLElement>("[data-story-sequence]");

      if (
        !footerSito ||
        tacche.length !== CAPITOLI.length ||
        sezioni.some((sezione) => !sezione)
      ) {
        return;
      }

      const capitoli = sezioni as HTMLElement[];
      const impostaProgresso = gsap.quickSetter(riempimento, "scaleY");
      let iniziCapitoli: number[] = [];
      let inizioSequenza = Number.POSITIVE_INFINITY;
      let fineSequenza = Number.NEGATIVE_INFINITY;
      let capitoloAttivo = -1;
      let guidaQuiet = false;

      const posizioneAssoluta = (nodo: HTMLElement) =>
        nodo.getBoundingClientRect().top + window.scrollY;

      const impostaCapitolo = (indice: number) => {
        if (indice === capitoloAttivo) return;
        capitoloAttivo = indice;
        numero.textContent = String(indice + 1).padStart(2, "0");
        etichetta.textContent = CAPITOLI[indice].etichetta;
        tacche.forEach((tacca, indiceTacca) => {
          tacca.toggleAttribute("data-active", indiceTacca === indice);
        });
      };

      const misura = () => {
        const inizioHome = posizioneAssoluta(radice);
        const fineHome = posizioneAssoluta(footerSito) - window.innerHeight;
        const distanza = Math.max(1, fineHome - inizioHome);

        iniziCapitoli = capitoli.map(posizioneAssoluta);
        tacche.forEach((tacca, indice) => {
          const posizione = limita((iniziCapitoli[indice] - inizioHome) / distanza);
          tacca.style.setProperty("--home-scroll-marker", `${posizione * 100}%`);
        });

        if (sequenzaStoria) {
          inizioSequenza = posizioneAssoluta(sequenzaStoria);
          fineSequenza = inizioSequenza + sequenzaStoria.offsetHeight;
        }
      };

      const aggiornaStato = (scroll: number) => {
        const puntoLettura = scroll + window.innerHeight * 0.46;
        let prossimo = 0;

        iniziCapitoli.forEach((inizio, indice) => {
          if (puntoLettura >= inizio) prossimo = indice;
        });
        impostaCapitolo(prossimo);

        const quiet = puntoLettura >= inizioSequenza && puntoLettura < fineSequenza;
        if (quiet !== guidaQuiet) {
          guidaQuiet = quiet;
          elemento.toggleAttribute("data-quiet", quiet);
        }
      };

      misura();
      impostaCapitolo(0);

      const avanzamento = ScrollTrigger.create({
        trigger: radice,
        start: "top top",
        endTrigger: footerSito,
        end: "top bottom",
        invalidateOnRefresh: true,
        onRefresh(self) {
          misura();
          impostaProgresso(self.progress);
          aggiornaStato(self.scroll());
        },
        onUpdate(self) {
          impostaProgresso(self.progress);
          aggiornaStato(self.scroll());
        },
      });

      const media = gsap.matchMedia();
      media.add("(prefers-reduced-motion: no-preference)", () => {
        const uscita = gsap.to(guscio, {
          autoAlpha: 0,
          y: 10,
          ease: "none",
          scrollTrigger: {
            trigger: footerSito,
            start: "top bottom",
            end: "top 82%",
            scrub: true,
            invalidateOnRefresh: true,
          },
        });
        return () => uscita.kill();
      });
      media.add("(prefers-reduced-motion: reduce)", () => {
        const uscita = ScrollTrigger.create({
          trigger: footerSito,
          start: "top bottom",
          onEnter: () => gsap.set(guscio, { autoAlpha: 0 }),
          onLeaveBack: () => gsap.set(guscio, { autoAlpha: 1 }),
        });
        return () => uscita.kill();
      });

      return () => {
        avanzamento.kill();
        media.revert();
      };
    },
    { scope: guida }
  );

  return (
    <aside ref={guida} className="home-scroll-guide" aria-hidden="true">
      <div data-home-scroll-shell className="home-scroll-guide__shell">
        <span className="home-scroll-guide__prompt">Scorri</span>

        <span className="home-scroll-guide__counter">
          <span data-home-scroll-current>01</span>
          <span className="home-scroll-guide__total">/05</span>
        </span>

        <span className="home-scroll-guide__track">
          <span data-home-scroll-fill className="home-scroll-guide__fill" />
          {CAPITOLI.map(({ etichetta }, indice) => (
            <span
              key={etichetta}
              data-home-scroll-marker
              data-active={indice === 0 ? "" : undefined}
              className="home-scroll-guide__marker"
            />
          ))}
        </span>

        <span data-home-scroll-label className="home-scroll-guide__label">
          Apertura
        </span>
        <ArrowDown className="home-scroll-guide__arrow" strokeWidth={2.2} />
      </div>
    </aside>
  );
}
