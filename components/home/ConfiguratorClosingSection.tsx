import { fotoStati } from "@/lib/configuratore/foto";
import { DOLCI, type DolceConFoto } from "@/lib/percorso-configuratore";
import { ConfiguratorTeaser } from "./ConfiguratorTeaser";

/**
 * Hero secondaria del configuratore, subito dopo i salati.
 *
 * Refactor architettura 2026-08-12. La vetrina a tre colonne (insegna +
 * percorso di card + pannello mandarino) raccontava il configuratore per
 * esteso; adesso la storia in home fa da penultimo capitolo e questa
 * chiusura deve solo girare il racconto verso chi guarda: il prossimo
 * dolce lo componi tu, si comincia da /configuratore. L'assemblaggio dei
 * tre stati della Nuvola in scrub sta nel teaser (client); qui resta il
 * guscio.
 *
 * Una curva crema sale dentro il fucsia della sezione precedente e prepara
 * il cambio di ritmo senza introdurre un blocco narrativo autonomo.
 *
 * Server Component, e deve restarlo: le foto degli stati del dolce si
 * leggono qui, dal filesystem, con la stessa funzione che usa la pagina
 * del configuratore. La cartella resta il contratto, e l'isola client
 * riceve solo gli URL degli stati che una foto ce l'hanno davvero.
 */
const TITOLO_ID = "crea-il-tuo-dolce-titolo";

export function ConfiguratorClosingSection() {
  const foto = fotoStati();
  const dolci: DolceConFoto[] = DOLCI.map((d) => ({
    ...d,
    foto: foto[d.stato],
  }));

  return (
    <div
      id="crea-il-tuo-dolce"
      className="font-pop-testo scroll-mt-24 bg-crema text-cacao"
    >
      <div
        aria-hidden
        className="configurator-bridge relative h-[clamp(7rem,16vw,14rem)] overflow-hidden bg-fucsia"
      >
        <span className="configurator-bridge__surface absolute -bottom-px left-[-10%] h-[92%] w-[120%] bg-crema" />
      </div>
      <ConfiguratorTeaser dolci={dolci} titoloId={TITOLO_ID} />
    </div>
  );
}
