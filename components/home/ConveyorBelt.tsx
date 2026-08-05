/**
 * Il nastro trasportatore su cui il dolce si compone.
 *
 * È tutto CSS: piano che scorre, corpo con i rulli, testate tonde alle
 * estremità e ombra a terra (vedi `.percorso-nastro` in globals.css).
 * Nessuna immagine e nessun SVG — un PNG di un nastro sarebbe un peso in
 * più da scaricare e, soprattutto, non si allungherebbe con la fila delle
 * tappe: qui il nastro è lungo quanto la griglia, a qualunque larghezza.
 *
 * I rulli sono un gradiente radiale ripetuto in x, non un elemento per
 * rullo: la corsa si anima muovendo la posizione di un solo fondo, e non
 * ci sono venti nodi in più nel DOM.
 *
 * Puramente decorativo: `aria-hidden`, nessun testo, nessun bersaglio.
 * La misura verticale la detta `--nastro`, dichiarata sulla scena.
 */
export function ConveyorBelt() {
  return (
    <div aria-hidden className="percorso-nastro">
      <span className="nastro-piano" />
      <span className="nastro-rulli" />
      <span className="nastro-sostegno nastro-sostegno-sx" />
      <span className="nastro-sostegno nastro-sostegno-dx" />
    </div>
  );
}
