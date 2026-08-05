import { ArrowRight, Check, LoaderCircle } from "lucide-react";

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
}: {
  inCorso: boolean;
  riuscito: boolean;
}) {
  return (
    <button
      type="submit"
      disabled={inCorso}
      className="pop-invio font-pop text-[clamp(0.95rem,1.15vw,1.15rem)] uppercase tracking-[0.02em]"
    >
      <span>
        {inCorso
          ? "Invio in corso..."
          : riuscito
            ? "Richiesta inviata"
            : "Invia la richiesta"}
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
