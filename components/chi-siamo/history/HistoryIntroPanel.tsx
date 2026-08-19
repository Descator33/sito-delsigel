import { INTESTAZIONE, type TappaStoria } from "@/data/history";

/**
 * La colonna di sinistra: l'intestazione della sezione, che non cambia,
 * e in fondo il piede che invece cambia.
 *
 * Finché il viaggio non è cominciato in fondo si legge l'invito a
 * scorrere; appena si entra nel primo capitolo quel blocco lascia il
 * posto alla frase della tappa attiva. È l'unico scambio governato da
 * React in tutta la scena — una volta per tappa, non per pixel — e
 * l'entrata è una transizione CSS, non una timeline.
 *
 * Il titolo porta l'`id` a cui la sezione si intitola: sta qui perché è
 * qui che vive, e non in un `aria-label` scollegato dal testo.
 */
export function HistoryIntroPanel({
  tappa,
  fase,
}: {
  tappa: TappaStoria;
  fase: "intro" | "storia";
}) {
  return (
    <div className="relative z-20 flex h-full w-[38%] shrink-0 flex-col justify-between py-[12vh] pl-6 pr-8 md:pl-10 lg:w-[32%] lg:pl-14 lg:pr-10">
      {/* il sipario: le fasce passano dietro, la copy resta leggibile
          senza spostare la composizione */}
      <div
        aria-hidden
        className="storia-sipario absolute inset-y-0 -left-[30%] right-[-14%]"
      />

      <div className="relative">
        <p className="type-label text-panna/45">{INTESTAZIONE.eyebrow}</p>

        <h2
          id="storia-titolo"
          className="type-display mt-5 text-[clamp(1.9rem,3.6vw,3.4rem)] leading-[0.9] text-panna"
        >
          {INTESTAZIONE.titolo[0]}
          <br />
          {INTESTAZIONE.titolo[1]}
          <span className="text-corallo">.</span>
        </h2>

        <p className="mt-5 max-w-[24ch] text-[clamp(13px,1.05vw,15px)] leading-snug text-acido">
          {INTESTAZIONE.sottotitolo}
        </p>

        <div className="mt-6 hidden max-w-[32ch] space-y-2 text-[13px] leading-relaxed text-panna/60 lg:block">
          {INTESTAZIONE.testo.map((riga) => (
            <p key={riga}>{riga}</p>
          ))}
        </div>

        <a
          href={INTESTAZIONE.azione.href}
          className="type-label pointer-events-auto mt-8 hidden border border-panna/30 px-6 py-4 text-panna transition-colors duration-300 hover:border-panna hover:bg-panna hover:text-inchiostro focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-panna lg:inline-block"
        >
          {INTESTAZIONE.azione.testo}
        </a>
      </div>

      {/* il piede: l'invito a scorrere finché la storia non parte, poi
          la frase della tappa. Le due versioni si sovrappongono nello
          stesso spazio, così il blocco non cambia altezza. */}
      <div className="relative mt-10 grid min-h-[6.5rem] items-end">
        <p
          className={`type-label col-start-1 row-start-1 flex items-center gap-3 text-panna/55 transition-opacity duration-500 ${
            fase === "intro" ? "opacity-100" : "opacity-0"
          }`}
        >
          <span aria-hidden className="h-1.5 w-1.5 shrink-0 rounded-full bg-corallo" />
          {INTESTAZIONE.invito}
          <span
            aria-hidden
            className="h-8 w-px bg-gradient-to-b from-panna/40 to-transparent"
          />
        </p>

        <p
          aria-hidden={fase === "intro"}
          className={`type-scritta col-start-1 row-start-1 -rotate-1 text-[clamp(1.15rem,1.9vw,1.75rem)] leading-tight text-panna/85 transition-all duration-500 ${
            fase === "intro"
              ? "translate-y-2 opacity-0"
              : "translate-y-0 opacity-100"
          }`}
        >
          {tappa.frase}
        </p>
      </div>
    </div>
  );
}
