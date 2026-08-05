/* biglietto con gli angoli tagliati, come i ticket del riferimento */
const TICKET =
  "polygon(16px 0, calc(100% - 16px) 0, 100% 16px, 100% calc(100% - 16px), calc(100% - 16px) 100%, 16px 100%, 0 calc(100% - 16px), 0 16px)";

/* l'album dello stabilimento: gli scatti veri della squadra al lavoro */
const SCATTI = [
  "linea-sfoglia-mani",
  "saluto-assi",
  "sorriso-fritti",
  "posa-pistolero",
  "risata-carrelli",
  "doppio-ok",
  "coppia-cella",
  "guardiano-meno-venti",
  "abbraccio-fondatori",
  "sorriso-dolci",
];

/**
 * Carosello lento di card-biglietto tra l'hero e la lettera: l'album dello
 * stabilimento, uno scatto per biglietto. Scorrimento continuo, senza fine.
 */
export function Biglietti() {
  return (
    <div className="bg-panna py-16 md:py-20">
      <p className="text-center font-mono text-[13px] font-bold text-inchiostro/55">
        L&apos;album dello stabilimento:
      </p>
      <div aria-hidden className="marquee mt-9">
        <div className="marquee-track" style={{ animationDuration: "55s" }}>
          {[0, 1].map((k) => (
            <span key={k} className="flex shrink-0 gap-6 pr-6">
              {SCATTI.map((slug) => (
                <span
                  key={slug}
                  className="h-[130px] w-[280px] shrink-0 overflow-hidden bg-panna-dim"
                  style={{ clipPath: TICKET }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`/chi-siamo/album/${slug}.webp`}
                    alt=""
                    className="h-full w-full object-cover"
                    loading="lazy"
                    draggable={false}
                  />
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
