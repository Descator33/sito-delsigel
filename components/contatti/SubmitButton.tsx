import { ArrowRight, Check, LoaderCircle } from "lucide-react";
import type { Testi } from "@/lib/i18n/tipi";

/**
 * Il comando del form, nei suoi tre volti visibili: riposo, invio in
 * corso, riuscito.
 *
 * Errore e `disabled` non sono volti a parte per scelta: dopo un errore il
 * pulsante torna al suo stato di riposo perché la cosa da fare È riprovare
 * — un pulsante rosso «errore» che non si può premere è un vicolo cieco —
 * e l'errore vero lo racconta la regione `aria-live` sotto il form.
 * `disabled` esiste solo durante l'invio, per non spedire due volte.
 *
 * Il testo cambia insieme all'icona: chi non distingue la rotella dalla
 * freccia legge comunque «Invio in corso...».
 */
export function SubmitButton({
  inCorso,
  riuscito,
  testi,
}: {
  inCorso: boolean;
  riuscito: boolean;
  testi: Testi["contatti"]["form"];
}) {
  return (
    <button
      type="submit"
      disabled={inCorso}
      className="pop-invio font-ui text-[clamp(0.85rem,1vw,1rem)] font-extrabold uppercase tracking-[0.055em]"
    >
      <span>
        {inCorso
          ? testi.invioInCorso
          : riuscito
            ? testi.inviata
            : testi.invia}
      </span>

      {inCorso ? (
        <LoaderCircle
          aria-hidden
          strokeWidth={2.4}
          className="h-5 w-5 flex-none motion-safe:animate-spin"
        />
      ) : riuscito ? (
        <Check aria-hidden strokeWidth={2.8} className="h-5 w-5 flex-none" />
      ) : (
        <ArrowRight
          aria-hidden
          strokeWidth={2.4}
          className="pop-freccia-lunga h-5 w-5 flex-none"
        />
      )}
    </button>
  );
}
