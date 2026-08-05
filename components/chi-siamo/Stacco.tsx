/* la palette pop, in sequenza */
const COLORI = ["#fbc50a", "#eb186b", "#a05cd5", "#f76f0b", "#e8442e"];

function Fila({ reverse = false, offset = 0 }: { reverse?: boolean; offset?: number }) {
  return (
    <div className="marquee">
      <div
        className={`marquee-track ${reverse ? "marquee-reverse" : ""}`}
        style={{ animationDuration: "30s" }}
      >
        {[0, 1].map((k) => (
          <span key={k} className="flex shrink-0 gap-3 pr-3">
            {Array.from({ length: 36 }, (_, i) => (
              <span
                key={i}
                className="h-5 w-16 shrink-0"
                style={{ background: COLORI[(i + offset) % COLORI.length] }}
              />
            ))}
          </span>
        ))}
      </div>
    </div>
  );
}

/**
 * Semischacchiera colorata: due file sfalsate di tasselli pop che scorrono
 * in direzioni opposte. È lo stacco tra la lettera e la squadra.
 */
export function Stacco() {
  return (
    <div aria-hidden className="space-y-2.5 border-y-4 border-inchiostro bg-inchiostro py-3">
      <Fila />
      <Fila reverse offset={2} />
    </div>
  );
}
