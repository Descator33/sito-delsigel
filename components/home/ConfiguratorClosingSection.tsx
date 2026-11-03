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
 * Il fondo non ha più la fascia con la curva crema: la transizione È il
 * ponte narrativo che sta sopra (components/home/PonteFuturo, «Il
 * prossimo sei tu»), il cui sipario crema consegna direttamente a questo
 * crema — una fascia qui sotto tornerebbe a essere un secondo confine.
 *
 * La home usa copie dedicate, scontornate sul nastro scuro; le foto del
 * configuratore restano indipendenti.
 */
const TITOLO_ID = "crea-il-tuo-dolce-titolo";
const FOTO_HOME: Record<string, string> = {
  nuvola: "/img/home-configuratore/nuvola.png",
  "nuvola--crema": "/img/home-configuratore/nuvola-crema.png",
  "nuvola--crema--fragola--zucchero-a-velo": "/img/home-configuratore/nuvola-fragola.png",
};

export function ConfiguratorClosingSection() {
  const dolci: DolceConFoto[] = DOLCI.map((d) => ({
    ...d,
    foto: FOTO_HOME[d.stato],
  }));

  return (
    <section
      id="crea-il-tuo-dolce"
      aria-labelledby={TITOLO_ID}
      className="font-pop-testo scroll-mt-24 bg-crema text-cacao"
    >
      <ConfiguratorTeaser dolci={dolci} titoloId={TITOLO_ID} />
    </section>
  );
}
