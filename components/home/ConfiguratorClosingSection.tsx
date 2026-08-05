import { fotoStati } from "@/lib/configuratore/foto";
import { DOLCI, type DolceConFoto } from "@/lib/percorso-configuratore";
import { ConfiguratorIntro } from "./ConfiguratorIntro";
import { ConfiguratorJourney } from "./ConfiguratorJourney";
import { ConfiguratorCTA } from "./ConfiguratorCTA";

/**
 * «Crea da solo il tuo dolce custom» — la chiusura della home.
 *
 * Prende il posto del vecchio blocco inchiostro «Ricette di laboratorio,
 * scala da industria»: quello era una campitura nera piena che, dopo il
 * redesign del catalogo e della linea salata, arrivava come un muro e
 * parlava di noi proprio dove la pagina deve passare la parola a chi
 * guarda. Qui si resta sul chiaro e si dice una cosa sola: il dolce te lo
 * fai tu, si comincia da qui.
 *
 * Lo stacco da «I nostri salati» non è una fascia scura ma tre segnali
 * piccoli e concordi — il fondo che schiarisce di un grado (panna →
 * crema), un filo di confine, e molto più respiro sopra e sotto.
 *
 * Server Component. Le foto degli stati del dolce si leggono qui, dal
 * filesystem, con la stessa funzione che usa la pagina del configuratore:
 * la cartella resta il contratto, e l'isola client riceve solo gli URL
 * degli stati che una foto ce l'hanno davvero.
 */
const TITOLO_ID = "crea-il-tuo-dolce-titolo";

export function ConfiguratorClosingSection() {
  const foto = fotoStati();
  const dolci: DolceConFoto[] = DOLCI.map((d) => ({
    ...d,
    foto: foto[d.stato],
  }));

  return (
    <section
      id="crea-il-tuo-dolce"
      aria-labelledby={TITOLO_ID}
      className="font-pop-testo scroll-mt-24 border-t border-linea/60 bg-crema text-cacao"
    >
      {/* `overflow-x-clip` (mai `hidden`, che aprirebbe un contenitore di
          scorrimento): il richiamo entra di lato e per un istante sta 28px
          più a destra del suo posto. Su un telefono quei 28px sono scroll
          orizzontale di pagina — qui vengono ritagliati, ed è anche il modo
          giusto di leggere l'entrata: il pannello arriva da fuori. */}
      <div className="mx-auto max-w-[1800px] overflow-x-clip px-6 py-[clamp(4.5rem,7vw,8.5rem)] md:px-12">
        {/* `minmax(0, …)` su tutte le tracce, colonna singola compresa: la
            fila delle tappe è larga 50rem e scorre dentro il suo binario,
            ma senza il minimo a zero è la sua misura a dettare la colonna
            — che sfonderebbe la pagina invece di lasciarla scorrere */}
        <div className="grid grid-cols-[minmax(0,1fr)] gap-y-[clamp(2.5rem,4vw,3.5rem)] xl:grid-cols-[minmax(0,18fr)_minmax(0,61fr)_minmax(16rem,21fr)] xl:gap-x-[clamp(1.5rem,2.2vw,3rem)]">
          <ConfiguratorIntro titoloId={TITOLO_ID} />
          <ConfiguratorJourney dolci={dolci} />
          <ConfiguratorCTA />
        </div>
      </div>
    </section>
  );
}
