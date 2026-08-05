"use client";

import Image from "next/image";

/**
 * Hero: una sola fotografia a tutto schermo (rev 27/07 — sostituisce il film
 * scroll-driven "La Caduta": niente canvas, niente sequenza di frame).
 *
 * Lo scatto porta già il wordmark stampato nella campitura arancio, quindi la
 * copy in overlay resta bassa e leggera: etichetta, titolo e un solo invito al
 * catalogo, appoggiati sullo scrim che scurisce il fondo dell'immagine.
 * `fill` + `sizes="100vw"` lasciano a next/image la scaletta responsive;
 * `preload` perché è l'elemento LCP della pagina.
 */
export const HERO_IMAGE = "/hero/hero-delsigel.webp";

export function Hero() {
  return (
    <section className="relative flex h-[100svh] min-h-[34rem] flex-col justify-end overflow-hidden bg-mandarino text-panna">
      <Image
        src={HERO_IMAGE}
        alt="Fondo arancio con il marchio Delsigel a tutta larghezza: al centro una ragazza addenta una bomba farcita, due mani entrano dai lati reggendone altre due."
        fill
        sizes="100vw"
        preload
        className="object-cover object-center"
      />

      {/* scrim solo sul fondo: tiene la copy leggibile senza spegnere l'arancio */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[62%] bg-gradient-to-t from-inchiostro/85 via-inchiostro/35 to-transparent"
      />

      <div className="relative mx-auto w-full max-w-[1800px] px-6 pb-[8vh] md:px-12">
        <p className="type-label text-panna/75">Delsigel Italia · dal 2011</p>
        {/* titolo contenuto: il wordmark grande è già nello scatto, la copy
            resta nella colonna di sinistra e non attraversa il soggetto */}
        <h1 className="type-display mt-4 max-w-2xl text-[clamp(2rem,4.6vw,3.4rem)] leading-[0.95]">
          L&apos;industria <span className="text-acido">artigianale.</span>
        </h1>
        <p className="mt-5 max-w-md text-[0.95rem] font-medium text-panna/90 md:text-base">
          Dolci e salati da laboratorio, prodotti su scala. Catalogo 2026/27.
        </p>
        <a
          href="#catalogo"
          className="mt-8 inline-flex items-center gap-3 rounded-full bg-panna px-6 py-3 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-inchiostro transition-colors hover:bg-acido focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-panna"
        >
          Scopri il catalogo <span aria-hidden>↓</span>
        </a>
      </div>
    </section>
  );
}
