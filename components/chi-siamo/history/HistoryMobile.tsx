"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import type { CSSProperties } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FINALE, INTESTAZIONE, STORIA } from "@/data/history";

/**
 * La stessa storia, in colonna: è la versione per telefono ed è anche
 * quella che vede chi ha chiesto meno movimento.
 *
 * Niente pin, niente sei fasce compresse: una tappa per schermata,
 * fotografia a tutta larghezza col bordo strappato delle fasce e il
 * testo sotto. La barra in alto resta appiccicata e dice a che punto si
 * è; i sei numeri sono pulsanti veri e portano alla tappa.
 *
 * Lo scorrimento resta quello del dito: nessun gesto viene rubato, e i
 * blocchi sono nel flusso — chi ha `prefers-reduced-motion` li vede
 * tutti, senza parallasse e senza niente da aspettare. L'unico GSAP che
 * resta acceso in quel caso è quello che aggiorna la tappa corrente:
 * non muove nulla, dice soltanto dove siamo.
 */
export function HistoryMobile() {
  const sezione = useRef<HTMLElement>(null);
  const [attiva, setAttiva] = useState(0);

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);
      const scope = sezione.current;
      if (!scope) return;

      const blocchi = gsap.utils.toArray<HTMLElement>("[data-blocco]", scope);

      blocchi.forEach((blocco, i) => {
        ScrollTrigger.create({
          trigger: blocco,
          start: "top 62%",
          end: "bottom 62%",
          onToggle: (self) => {
            if (self.isActive) setAttiva((prec) => (prec === i ? prec : i));
          },
        });
      });

      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        blocchi.forEach((blocco) => {
          const foto = blocco.querySelector<HTMLElement>("[data-foto]");
          if (!foto) return;
          gsap.fromTo(
            foto,
            { yPercent: -5 },
            {
              yPercent: 5,
              ease: "none",
              scrollTrigger: {
                trigger: blocco,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            }
          );
        });
      });

      return () => mm.revert();
    },
    { scope: sezione }
  );

  const vaiA = (id: string) => {
    sezione.current
      ?.querySelector(`#storia-${id}`)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section
      ref={sezione}
      id="storia"
      aria-labelledby="storia-titolo"
      className="storia-scena relative scroll-mt-20 pb-24 pt-16"
    >
      <header className="relative z-10 mx-auto max-w-[860px] px-6">
        <p className="type-label text-panna/45">{INTESTAZIONE.eyebrow}</p>
        <h2
          id="storia-titolo"
          className="type-display mt-4 text-[clamp(2.1rem,10vw,3.4rem)] leading-[0.9] text-panna"
        >
          {INTESTAZIONE.titolo[0]}
          <br />
          {INTESTAZIONE.titolo[1]}
          <span className="text-corallo">.</span>
        </h2>
        <p className="mt-5 max-w-[26ch] text-[15px] leading-snug text-acido">
          {INTESTAZIONE.sottotitolo}
        </p>
        <div className="mt-5 space-y-2 text-[14px] leading-relaxed text-panna/60">
          {INTESTAZIONE.testo.map((riga) => (
            <p key={riga}>{riga}</p>
          ))}
        </div>
      </header>

      {/* la barra dell'avanzamento: resta in vista sotto l'header del sito */}
      <div className="sticky top-[68px] z-30 mt-10 border-y border-panna/12 bg-inchiostro/92 backdrop-blur-sm">
        <div className="mx-auto flex max-w-[860px] items-center gap-4 px-6 py-3">
          <p className="type-display shrink-0 text-lg leading-none text-panna">
            {STORIA[attiva].numero}
            <span className="text-panna/35">
              {" "}
              / {STORIA[STORIA.length - 1].numero}
            </span>
          </p>
          <nav
            aria-label="Le tappe della storia"
            className="flex flex-1 items-center justify-between gap-1.5"
          >
            {STORIA.map((t, i) => (
              <button
                key={t.id}
                type="button"
                onClick={() => vaiA(t.id)}
                aria-current={i === attiva ? "step" : undefined}
                aria-label={`Tappa ${t.numero}: ${t.titolo} — ${t.sottotitolo}`}
                className="group flex flex-1 flex-col items-center gap-1.5 rounded-sm py-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-panna"
              >
                <span
                  className="h-[3px] w-full transition-opacity duration-500"
                  style={{
                    backgroundColor: t.colore,
                    opacity: i <= attiva ? 1 : 0.22,
                  }}
                />
                <span
                  className="font-mono text-[10px] font-bold text-panna transition-opacity duration-500"
                  style={{ opacity: i === attiva ? 1 : 0.4 }}
                >
                  {t.numero}
                </span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      <ol className="relative z-10 mx-auto max-w-[860px] px-6">
        {STORIA.map((t, i) => (
          <li
            key={t.id}
            id={`storia-${t.id}`}
            data-blocco
            aria-current={i === attiva ? "step" : undefined}
            className="scroll-mt-32 pb-6 pt-14"
            style={{ "--accento": t.colore } as CSSProperties}
          >
            <figure className="relative">
              {/* il 4:5 è la proporzione del telefono; da tablet in su
                  questa versione la vede solo chi ha chiesto meno
                  movimento, e a quella larghezza un ritratto alto
                  costringerebbe a scorrere una foto per volta */}
              <div className="storia-scatto relative aspect-[4/5] w-full overflow-hidden bg-cacao sm:aspect-[16/10]">
                <div data-foto className="absolute inset-x-0 -inset-y-[7%]">
                  <Image
                    src={t.immagine}
                    alt={t.alt}
                    fill
                    loading="lazy"
                    sizes="(min-width: 860px) 812px, 100vw"
                    className="object-cover"
                    style={{ objectPosition: t.posizione }}
                  />
                </div>
                {/* lo stesso velo del desktop, appoggiato dal basso:
                    in verticale il testo sta sotto, non a fianco */}
                <span
                  aria-hidden
                  className="absolute inset-0 bg-gradient-to-t"
                  style={{
                    backgroundImage: `linear-gradient(0deg, color-mix(in srgb, ${t.colore} 88%, #160601) 0%, color-mix(in srgb, ${t.colore} 40%, transparent) 34%, transparent 68%)`,
                  }}
                />
              </div>
              <figcaption className="type-label absolute bottom-5 left-5 text-panna">
                {t.numero} · {t.titolo}
              </figcaption>
            </figure>

            <div className="mt-8">
              <h3 className="type-display text-[clamp(1.4rem,6vw,2rem)] leading-[1] text-panna">
                {t.titolo}
                <span className="block text-[0.62em] text-panna/70">
                  {t.sottotitolo}
                </span>
              </h3>
              <p className="mt-3 text-[15px] leading-relaxed text-panna/70">
                {t.descrizione}
              </p>
              <p className="type-scritta mt-5 -rotate-1 text-2xl leading-none text-panna/85">
                {t.frase}
              </p>
            </div>
          </li>
        ))}
      </ol>

      <div className="relative mx-auto mt-16 max-w-[860px] px-6">
        <span aria-hidden className="storia-alba absolute inset-0" />
        <p className="relative">
          <span className="type-label text-corallo">{FINALE.eyebrow}</span>
          <span className="type-display mt-4 block text-[clamp(1.7rem,7vw,2.6rem)] leading-[0.98] text-panna">
            {FINALE.frase[0]}
            <br />
            <span className="text-corallo">{FINALE.frase[1]}</span>
          </span>
          <span className="mt-4 block font-mono text-[11px] uppercase tracking-[0.28em] text-panna/50">
            {FINALE.coda}
          </span>
        </p>
      </div>
    </section>
  );
}
