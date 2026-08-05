"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { CircleAlert, CircleCheck, Mail } from "lucide-react";
import { inviaRichiesta } from "@/app/contatti/actions";
import { FormField } from "@/components/contatti/FormField";
import { SubmitButton } from "@/components/contatti/SubmitButton";
import { FrecciaCurva } from "@/components/contatti/PopDecorations";
import { Scintilla } from "@/components/catalog/salati/DecorativeDoodles";
import {
  BOZZA_VUOTA,
  LIMITI,
  STATO_INIZIALE,
  validaContatto,
  type BozzaContatto,
  type ErroriContatto,
  type StatoContatto,
} from "@/lib/contatti";

/**
 * La scheda del form: l'unico pezzo interattivo della pagina, e l'unico
 * che arriva al client.
 *
 * Due validazioni, due scopi. Quella in `onSubmit` gira qui e serve alla
 * persona che sta scrivendo: ferma l'invio prima del giro sul server e
 * accende gli errori sotto i campi. Quella nella Server Action gira sul
 * server ed è l'unica che conta davvero — una Server Action è un endpoint
 * POST pubblico, e il client può essere aggirato. Le due chiamano la
 * stessa `validaContatto`, quindi non possono divergere.
 *
 * Il form funziona anche senza JavaScript: `<form action={azione}>` con
 * una Server Action è progressivamente migliorabile: senza JS il browser
 * fa un POST normale e la pagina torna con lo stato. Ciò che si perde è
 * solo la validazione immediata.
 *
 * Sul reset: React 19 svuota da sé un form non controllato appena l'action
 * finisce. È il comportamento giusto dopo un invio riuscito e disastroso
 * dopo un errore, quindi l'action rimanda indietro `valori` e i campi li
 * usano come `defaultValue` — il reset di React riporta al `defaultValue`
 * corrente, e il testo appena scritto resta dov'è.
 */
export function ContactForm() {
  const [stato, azione, inCorso] = useActionState(
    inviaRichiesta,
    STATO_INIZIALE
  );

  /* Gli errori trovati qui sul client. Sono separati da quelli dell'action
     perché hanno vite diverse: questi si spengono appena la persona
     ricomincia a scrivere, quelli arrivano e restano fino al prossimo
     invio. */
  const [erroriClient, setErroriClient] = useState<ErroriContatto>({});

  const apertura = useRef<HTMLInputElement>(null);

  /* Il momento in cui il form è comparso, scritto dal client dopo
     l'idratazione: metterlo nel markup renderizzato dal server darebbe un
     mismatch di idratazione, e il valore sarebbe comunque quello della
     build su una pagina statica. */
  useEffect(() => {
    if (apertura.current) apertura.current.value = String(Date.now());
  }, [stato]);

  /* Gli errori mostrati sono la somma dei due, con i locali sopra: dopo
     una correzione il campo si spegne subito anche se il server aveva
     detto la stessa cosa un attimo prima.
     Dopo un invio riuscito `erroriClient` è già vuoto — `controlla` lo
     azzera quando la validazione passa, che è la condizione perché
     l'action parta — quindi non serve nessun effetto a ripulirlo. */
  const erroriServer = stato.stato === "errore" ? stato.campi : {};
  const errori: ErroriContatto = { ...erroriServer, ...erroriClient };
  const precedenti: BozzaContatto =
    stato.stato === "errore" ? stato.valori : BOZZA_VUOTA;

  function controlla(evento: React.FormEvent<HTMLFormElement>) {
    const dati = new FormData(evento.currentTarget);
    const bozza: BozzaContatto = {
      nome: String(dati.get("nome") ?? ""),
      azienda: String(dati.get("azienda") ?? ""),
      email: String(dati.get("email") ?? ""),
      messaggio: String(dati.get("messaggio") ?? ""),
    };

    const trovati = validaContatto(bozza);
    setErroriClient(trovati);

    /* `preventDefault` in `onSubmit` impedisce a React di far partire
       l'action: è il modo per fermarsi senza toccare il server. */
    if (Object.keys(trovati).length > 0) {
      evento.preventDefault();
      /* Il primo campo in errore prende il fuoco: chi naviga da tastiera
         non deve andarselo a cercare, e chi usa uno screen reader sente
         subito il messaggio via `aria-describedby`. */
      const primo = (
        ["nome", "azienda", "email", "messaggio"] as const
      ).find((campo) => trovati[campo]);
      if (primo) document.getElementById(primo)?.focus();
    }
  }

  /* Se la persona corregge un campo, il suo errore sparisce subito: farlo
     restare acceso fino al prossimo invio è il difetto che fa sembrare
     rotto un form che funziona. */
  function ripulisci(campo: keyof ErroriContatto) {
    setErroriClient((precedente) =>
      precedente[campo] ? { ...precedente, [campo]: undefined } : precedente
    );
  }

  return (
    <div className="pop-scheda relative">
      {/* il contenuto sale sopra i due strati della scheda (profilo nero e
          campitura crema), che sono pseudo-elementi a z-index 0 */}
      <div className="relative z-10 p-6 pb-8 sm:p-9 sm:pb-10 lg:p-11 lg:pb-12">
        <div className="relative">
          <h2 className="font-pop text-[clamp(2.9rem,5vw,5.5rem)] font-normal uppercase leading-[0.9] tracking-[-0.02em]">
            Scrivici<span className="-ml-[0.1em] text-rosso">.</span>
          </h2>
          {/* i tre raggi del riferimento, appoggiati in alto a destra */}
          <Scintilla className="absolute -top-2 right-0 hidden h-9 w-9 text-inchiostro sm:block" />
        </div>

        <form
          action={azione}
          onSubmit={controlla}
          noValidate
          className="mt-7 sm:mt-9"
        >
          {/* Il campo trappola: fuori dallo schermo, fuori dal giro di
              tabulazione e fuori dall'albero di accessibilità. Non è
              `display:none` di proposito — i compilatori automatici
              saltano i campi nascosti così, e questo deve invece essere
              trovato e riempito. */}
          <div
            aria-hidden
            className="pointer-events-none absolute left-[-9999px] h-px w-px overflow-hidden opacity-0"
          >
            <label htmlFor="sito_web">Sito web</label>
            <input
              id="sito_web"
              name="sito_web"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              defaultValue=""
            />
          </div>
          <input ref={apertura} type="hidden" name="aperto_il" defaultValue="" />

          <div className="grid gap-5 sm:grid-cols-2">
            <FormField
              id="nome"
              nome="nome"
              etichetta="Nome e cognome"
              segnaposto="Es. Piera Ollearo"
              autoComplete="name"
              maxLength={LIMITI.nome.max}
              richiesto
              errore={errori.nome}
              defaultValue={precedenti.nome}
              onInput={() => ripulisci("nome")}
            />
            <FormField
              id="azienda"
              nome="azienda"
              etichetta="Azienda"
              segnaposto="Panetteria, bar, distribuzione..."
              autoComplete="organization"
              maxLength={LIMITI.azienda.max}
              errore={errori.azienda}
              defaultValue={precedenti.azienda}
              onInput={() => ripulisci("azienda")}
            />
          </div>

          <div className="mt-5">
            <FormField
              id="email"
              nome="email"
              tipo="email"
              etichetta="Email"
              segnaposto="nome@azienda.it"
              autoComplete="email"
              maxLength={LIMITI.email.max}
              richiesto
              errore={errori.email}
              defaultValue={precedenti.email}
              onInput={() => ripulisci("email")}
            />
          </div>

          <div className="mt-5">
            <FormField
              id="messaggio"
              nome="messaggio"
              multiriga
              righe={5}
              etichetta="Messaggio"
              segnaposto="Raccontaci cosa ti serve: referenze, quantità, zona di consegna..."
              maxLength={LIMITI.messaggio.max}
              richiesto
              errore={errori.messaggio}
              defaultValue={precedenti.messaggio}
              onInput={() => ripulisci("messaggio")}
            />
          </div>

          <Esito stato={stato} />

          <div className="mt-7">
            <SubmitButton inCorso={inCorso} riuscito={stato.stato === "ok"} />
          </div>
        </form>
      </div>

      {/* La freccia curva del riferimento, appoggiata al bordo destro. Da
          `2xl` in su e non prima: sporge di 32px oltre la scheda, e sotto
          i 1536px quei 32px cadono fuori dal viewport — la sezione li
          taglia (`overflow-x: clip`) e resterebbe mezza freccia. */}
      <FrecciaCurva className="pointer-events-none absolute -right-8 bottom-[14%] z-10 hidden h-auto w-[clamp(70px,6vw,108px)] text-inchiostro 2xl:block" />
    </div>
  );
}

/**
 * L'esito dell'invio: una regione `aria-live` sempre presente nel DOM.
 *
 * Montarla solo quando c'è qualcosa da dire è l'errore classico — molti
 * screen reader non annunciano una regione live che compare insieme al suo
 * contenuto. Il contenitore c'è dal primo render, dentro cambia il testo.
 *
 * `polite` e non `assertive`: la persona ha appena premuto un pulsante e
 * sta aspettando: non serve interrompere ciò che sta leggendo.
 */
function Esito({ stato }: { stato: StatoContatto }) {
  return (
    <div role="status" aria-live="polite" className="empty:hidden">
      {stato.stato === "ok" && (
        <p className="mt-6 flex items-start gap-3 border-2 border-inchiostro bg-acido/35 p-4 text-[14px] font-semibold leading-snug">
          <CircleCheck
            aria-hidden
            strokeWidth={2.3}
            className="mt-px h-5 w-5 flex-none"
          />
          {stato.messaggio}
        </p>
      )}

      {stato.stato === "errore" && (
        <div className="mt-6 border-2 border-rosso bg-rosso/10 p-4">
          <p className="flex items-start gap-3 text-[14px] font-semibold leading-snug text-inchiostro">
            <CircleAlert
              aria-hidden
              strokeWidth={2.3}
              className="mt-px h-5 w-5 flex-none text-rosso"
            />
            {stato.messaggio}
          </p>

          {stato.ripiego && (
            <a
              href={stato.ripiego}
              className="mt-3 inline-flex min-h-[44px] items-center gap-2 border-2 border-inchiostro bg-crema px-4 text-[14px] font-bold uppercase tracking-[0.04em] transition-colors hover:bg-inchiostro hover:text-panna focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-inchiostro"
            >
              <Mail aria-hidden strokeWidth={2.3} className="h-4 w-4" />
              Apri nel programma di posta
            </a>
          )}
        </div>
      )}
    </div>
  );
}
