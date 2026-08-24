/**
 * L'apertura della pagina: il titolo che comanda tutto e la promessa.
 *
 * «CONTATTI» resta il titolo principale ma non deve più occupare quasi
 * tutta la colonna. La misura è comunque in `cqi` e non in `vw`: la colonna
 * sinistra è `1fr` accanto a un form che ha un pavimento di 520px, quindi
 * a 1024px vale 370px e a 1660px ne vale 790. Una misura in `vw` è cieca a
 * quella differenza — tarata sul largo sfonda la colonna al medio, tarata
 * sul medio non domina più niente al largo.
 *
 * 14cqi conserva una gerarchia netta senza l'effetto manifesto del vecchio
 * 29cqi. Il tetto di 6.5rem tiene il titolo composto anche sugli schermi larghi.
 *
 * Il contenitore di query è il `div` qui sotto (`@container`): senza,
 * `cqi` cadrebbe sul viewport e tanto varrebbe usare `vw`.
 *
 * Archivo Black è già la voce premium della hero; qui sostituisce Anton,
 * più condensato e pubblicitario, senza aggiungere un nuovo download.
 */
export function ContactHero() {
  return (
    <div className="@container">
      <h1 className="font-hero text-[clamp(3.15rem,14cqi,6.5rem)] font-normal uppercase leading-[0.9] tracking-[-0.045em]">
        Contatti
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
