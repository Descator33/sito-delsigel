"use client";

import { Asterisco, GhirigoroFreccia, Scintilla, SottolineaturaOro } from "./Decori";
import { ComeFunziona } from "./ComeFunziona";

/**
 * La colonna introduttiva: l'insegna della pagina. Titolo su tre
 * righe, «dolce» in corallo col punto nero e la sottolineatura
 * disegnata, poche righe di testo, il pulsante «come funziona» e i
 * segni che accompagnano lo sguardo verso il palco.
 *
 * Il titolo NON usa la voce display del sito (Archivo esteso e tutto
 * maiuscolo, l'insegna industriale delle altre pagine): qui va in
 * tondo, alto e stretto di crenatura, come nella reference. È
 * l'unica deroga, ed è deliberata — la famiglia resta Archivo, e con
 * essa il resto del marchio.
 */
export function Intro() {
  return (
    <div className="relative xl:pt-8">
      <Asterisco className="mb-3 w-8 text-oro sm:mb-4 sm:w-9" />

      <h1 className="font-display text-[clamp(3.1rem,5.6vw,5.6rem)] font-extrabold leading-[0.87] tracking-[-0.035em]">
        Crea
        <br />
        il tuo
        <br />
        <span className="relative inline-block">
          <span className="text-corallo-scena">dolce</span>
          <SottolineaturaOro className="absolute -bottom-[0.05em] left-0 h-[0.13em] w-full" />
        </span>
        .
      </h1>

      <p className="mt-8 max-w-[31ch] text-[15px] leading-[1.65] text-inchiostro/75 sm:text-base">
        Libera la fantasia, noi lo rendiamo speciale. Scegli la base perfetta e
        costruisci il tuo dolce, step dopo step: trascinalo sul palco, o
        toccalo — fa lo stesso.
      </p>

      <ComeFunziona />

      {/* i segni finali: il ghirigoro punta al palco, la stellina
          chiude il blocco in basso */}
      <div aria-hidden className="pointer-events-none relative mt-8 h-16">
        <GhirigoroFreccia className="absolute left-[38%] top-0 w-[150px] text-inchiostro xl:left-[46%]" />
        <Scintilla className="absolute left-[26%] top-10 w-4 text-corallo-scena" />
      </div>
    </div>
  );
}
