"use client";

/**
 * I pallini sotto la vetrina.
 *
 * Contano gli SCATTI del carosello, non i prodotti: con `containScroll`
 * Embla toglie le posizioni che sfonderebbero il fondo del binario, e i
 * pallini devono dire quante schermate esistono davvero — su un desktop
 * largo i nove salati stanno in cinque scatti, sul telefono in nove.
 * Cambiando larghezza il conto si rifà da solo (`reInit`).
 *
 * Sono pulsanti, non decorazione: si arriva con il tabulatore e si salta
 * al gruppo. Il pallino visibile è 7 px, il bersaglio che lo circonda è
 * alto quanto un dito.
 */

export function CarouselPagination({
  scatti,
  attivo,
  vaiA,
}: {
  scatti: number;
  attivo: number;
  vaiA: (i: number) => void;
}) {
  if (scatti < 2) return null;

  return (
    <div className="mt-[clamp(1.5rem,2.4vw,2.5rem)] flex items-center justify-center gap-1.5">
      {Array.from({ length: scatti }, (_, i) => (
        <button
          key={i}
          type="button"
          onClick={() => vaiA(i)}
          aria-current={i === attivo}
          aria-label={`Vai al gruppo ${i + 1} di ${scatti}`}
          className="salati-pallino grid h-11 w-5 place-items-center"
        >
          <span aria-hidden className="salati-punto" />
        </button>
      ))}
    </div>
  );
}
