import type { CSSProperties } from "react";
import type { TappaStoria } from "@/data/history";

/**
 * La linea del tempo verticale: sei marker numerati appesi a un filo
 * sottile, tra il pannello di sinistra e il palco.
 *
 * Il filo è doppio — quello spento resta sempre, quello acceso si
 * scopre dall'alto mentre si avanza (`scaleY` da GSAP, origine in
 * alto). Lo stato dei marker (attivo, fatto, futuro) arriva da React e
 * cambia una volta per tappa; l'avanzamento continuo lo scrive la
 * timeline.
 *
 * I marker sono pulsanti veri: portano allo scroll del capitolo. È
 * l'unico modo per raggiungere una tappa senza scorrere tutto — conta
 * per chi naviga da tastiera.
 */
export function HistoryTimeline({
  tappe,
  attiva,
  onVai,
}: {
  tappe: TappaStoria[];
  attiva: number;
  onVai: (i: number) => void;
}) {
  return (
    <nav
      aria-label="Le tappe della storia"
      className="pointer-events-auto relative flex h-full w-12 shrink-0 flex-col justify-center py-[12vh] lg:w-52"
    >
      {/* il filo: parte dal primo marker e muore sotto l'ultimo */}
      <div aria-hidden className="absolute bottom-[14vh] left-4 top-[14vh] w-px">
        <span className="absolute inset-0 bg-panna/15" />
        <span
          data-filo
          className="absolute inset-0 origin-top bg-gradient-to-b from-mandarino via-rosso to-acido"
        />
        {/* la punta della freccia: dice da che parte si va */}
        <span className="absolute -bottom-2 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 border-b border-r border-panna/25" />
      </div>

      <ol className="relative flex flex-1 flex-col justify-between">
        {tappe.map((t, i) => {
          const stato = i === attiva ? "attiva" : i < attiva ? "fatta" : "futura";
          return (
            <li
              key={t.id}
              className={`storia-tappa storia-tappa--${stato}`}
              style={{ "--accento": t.colore } as CSSProperties}
            >
              <button
                type="button"
                onClick={() => onVai(i)}
                aria-current={i === attiva ? "step" : undefined}
                className="flex items-center gap-3 text-left"
              >
                <span className="storia-marker shrink-0 font-mono text-[10px] font-bold">
                  {t.numero}
                </span>
                <span className="storia-etichetta hidden transition-opacity duration-500 lg:block">
                  <span className="storia-etichetta-titolo type-display block text-[11px] leading-tight text-panna transition-colors duration-500">
                    {t.etichetta[0]}
                  </span>
                  <span className="mt-0.5 block max-w-[19ch] font-mono text-[9px] uppercase leading-[1.35] tracking-[0.14em] text-panna/70">
                    {t.etichetta[1]}
                  </span>
                </span>
                {/* su tablet restano i soli numeri: l'etichetta è qui
                    per chi non la vede */}
                <span className="sr-only lg:hidden">
                  {t.etichetta[0]} — {t.etichetta[1]}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
