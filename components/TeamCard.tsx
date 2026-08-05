export type TeamMember = {
  name: string;
  role: string;
  reparto: string;
  anni: number;
  /* accento della card (hex della palette): scacchi, numeri, dettagli */
  accent: string;
  /* ritratto al lavoro */
  image: string;
};

/**
 * Targa grande della squadra, alla maniera delle cornici da fiera: piastra
 * panna con doppia cornice, nome a insegna, fascia a scacchi nell'accento
 * della card sopra il ritratto, due dati e la fascia ruolo scritta a mano.
 */
export function TeamCard({ m }: { m: TeamMember }) {
  return (
    <article className="border-[3px] border-inchiostro bg-panna p-3 text-inchiostro shadow-[0_24px_60px_rgba(22,6,1,0.45)]">
      <div className="border-2 border-inchiostro/50 p-4 md:p-5">
        <h3 className="type-display pb-4 text-center text-2xl leading-none md:text-3xl">
          {m.name}
        </h3>
        <div className="relative">
          <div
            aria-hidden
            className="absolute inset-x-8 top-0 z-10 h-7 border-2 border-inchiostro/60"
            style={{
              backgroundImage: `repeating-conic-gradient(${m.accent} 0% 25%, #fff4e6 0% 50%)`,
              backgroundSize: "24px 24px",
            }}
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={m.image}
            alt={`${m.name}, ${m.role} Delsigel`}
            loading="lazy"
            className="aspect-square w-full border-2 border-inchiostro/60 object-cover"
            draggable={false}
          />
        </div>
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 py-5">
          <div className="text-center">
            <p className="type-display text-4xl leading-none">{m.anni}</p>
            <p className="mt-1.5 text-xs font-semibold text-inchiostro/60">
              anni in Delsigel
            </p>
          </div>
          <div className="h-12 w-px bg-inchiostro/20" />
          <div className="text-center">
            <p className="type-display text-4xl leading-none">{m.reparto}</p>
            <p className="mt-1.5 text-xs font-semibold text-inchiostro/60">
              reparto
            </p>
          </div>
        </div>
        <div className="bg-inchiostro py-2.5 text-center">
          <p className="type-scritta text-2xl leading-none text-panna">
            {m.role}
          </p>
        </div>
      </div>
    </article>
  );
}
