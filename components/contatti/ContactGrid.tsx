import { ContactCard } from "@/components/contatti/ContactCard";
import { RECAPITI } from "@/lib/contatti";

/**
 * La scacchiera dei recapiti: 2×2 quando c'è spazio, una colonna quando
 * non c'è.
 *
 * La soglia è sulla larghezza del CONTENITORE (`@min-[500px]`) e non su
 * quella del viewport, ed è l'unica che funziona: questa griglia vive
 * dentro la colonna sinistra di un impaginato a due colonne, quindi a
 * 1280px di finestra ha 590px e a 900px ne ha 800. Con un `sm:` — che
 * legge il viewport — a schermo largo ma colonna stretta le due tessere
 * affiancate scendono sotto i 180px, l'indirizzo email va a capo a ogni
 * carattere e la griglia si sfascia. 500px è il doppio della misura sotto
 * la quale una tessera (cerchio 54 + recapito + freccia + padding) smette
 * di stare su una riga.
 *
 * Le righe sono `auto-rows-fr` e non `auto`: la tessera «Stabilimento» ha
 * due righe di indirizzo e senza questo sarebbe più alta della sua vicina,
 * che è esattamente il difetto che rende storto un impaginato altrimenti
 * squadrato. L'`items-stretch` è implicito nella griglia — le tessere si
 * allungano da sole.
 *
 * Il `gap` tiene conto dell'ombra: 6px di sbalzo più il respiro, altrimenti
 * l'ombra di una tessera tocca il bordo di quella accanto.
 */
export function ContactGrid() {
  return (
    /* Il contenitore di query è il `div`, non la `ul`: una container query
       interroga sempre un ANTENATO, mai l'elemento su cui è dichiarata —
       `@container` e `@min-[...]` sullo stesso nodo non si vedono, e la
       griglia resterebbe a una colonna per sempre. */
    <div className="@container">
      <ul className="grid auto-rows-fr grid-cols-1 gap-5 @min-[500px]:grid-cols-2 @min-[860px]:gap-6">
        {RECAPITI.map((recapito, i) => (
          /* la voce di lista resta la casella della griglia (niente
             `display: contents`, che su alcuni browser toglie l'elemento
             dall'albero di accessibilità): è la tessera dentro a
             occuparla tutta in altezza */
          <li key={recapito.id}>
            <ContactCard recapito={recapito} indice={i} />
          </li>
        ))}
      </ul>
    </div>
  );
}
