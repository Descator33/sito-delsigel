/**
 * L'apertura della pagina: il titolo che comanda tutto e la promessa.
 *
 * «CONTATTI.» deve riempire la colonna, non una frazione del viewport, ed
 * è il motivo per cui la misura è in `cqi` e non in `vw`: la colonna
 * sinistra è `1fr` accanto a un form che ha un pavimento di 520px, quindi
 * a 1024px vale 370px e a 1660px ne vale 790. Una misura in `vw` è cieca a
 * quella differenza — tarata sul largo sfonda la colonna al medio, tarata
 * sul medio non domina più niente al largo.
 *
 * 29cqi è il numero che fa toccare quasi il bordo: nove caratteri in Anton
 * occupano circa 3,4 volte il corpo, e 0,29 × 3,4 ≈ 0,99 della colonna.
 * Il tetto di 15rem esiste perché oltre i ~240px il titolo comincia a
 * sfondare l'altezza dello schermo prima che la colonna finisca.
 *
 * Il contenitore di query è il `div` qui sotto (`@container`): senza,
 * `cqi` cadrebbe sul viewport e tanto varrebbe usare `vw`.
 *
 * Il punto finale è un `<span>` rosso e non un carattere colorato per
 * caso: è il segno che ricorre nei titoli di tutto il sito.
 */
export function ContactHero() {
  return (
    <div className="@container">
      <h1 className="font-pop text-[clamp(3.2rem,29cqi,15rem)] font-normal uppercase leading-[0.82] tracking-[-0.025em]">
        Contatti<span className="-ml-[0.1em] text-rosso">.</span>
      </h1>

      <p className="mt-6 max-w-[52ch] text-[clamp(1rem,1.25vw,1.25rem)] leading-relaxed text-inchiostro/85 sm:mt-7">
        Un listino, una campionatura, una visita in linea:
        <br className="hidden sm:block" />{" "}
        <strong className="font-bold text-inchiostro">
          scrivici e rispondiamo{" "}
          <span className="pop-evidenziato">entro un giorno lavorativo.</span>
        </strong>
      </p>
    </div>
  );
}
