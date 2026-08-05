/**
 * L'ultimo tratto del form contatti: la consegna vera del messaggio.
 *
 * Il sito non ha ancora un backend di posta — il configuratore lo dice a
 * chiare lettere in `app/configuratore/actions.ts` e si arrangia con un
 * mailto:. Qui la scelta è diversa perché il form contatti è il canale
 * principale: la richiesta parte dal server, quindi arriva anche a chi non
 * ha un client di posta configurato sulla macchina.
 *
 * Il trasporto è Resend via REST, chiamato con `fetch` e basta: l'SDK
 * ufficiale è un wrapper attorno a questa singola POST e non vale una
 * dipendenza in più. Se domani il committente porta un altro provider si
 * riscrive `spedisci` e nient'altro.
 *
 * Senza le variabili d'ambiente la funzione NON finge di aver spedito:
 * restituisce `NON_CONFIGURATO`, e la pagina propone il mailto: di ripiego
 * dicendo che cos'è. Un falso «messaggio inviato» sarebbe la peggiore
 * delle rese — il cliente aspetterebbe una risposta che nessuno ha letto.
 *
 * Variabili richieste (vedi docs/contatti.md):
 *   RESEND_API_KEY          — la chiave del progetto Resend
 *   CONTATTI_MITTENTE       — un indirizzo su un dominio verificato in Resend
 *   CONTATTI_DESTINATARIO   — opzionale, default info@delsigel.it
 *
 * Nessun `import "server-only"`: il pacchetto non è fra le dipendenze del
 * progetto e questo modulo ha un solo importatore, la Server Action, che è
 * già una frontiera server. Se un domani il modulo venisse importato
 * altrove, aggiungere il guardiano prima di farlo.
 */

import { EMAIL, type BozzaContatto } from "@/lib/contatti";

export type EsitoConsegna =
  | { ok: true }
  | { ok: false; motivo: "NON_CONFIGURATO" | "PROVIDER" };

type Busta = BozzaContatto & {
  /** l'IP di chi ha scritto, per l'eventuale segnalazione abusi */
  origine: string;
};

/** l'unico punto in cui si legge l'ambiente: a runtime, mai al build */
function configurazione() {
  const chiave = process.env.RESEND_API_KEY;
  const mittente = process.env.CONTATTI_MITTENTE;
  if (!chiave || !mittente) return null;
  return {
    chiave,
    mittente,
    destinatario: process.env.CONTATTI_DESTINATARIO || EMAIL,
  };
}

/** true quando il canale è pronto: serve alla pagina per non promettere troppo */
export function consegnaConfigurata(): boolean {
  return configurazione() !== null;
}

/* Il corpo del messaggio è testo semplice, non HTML: chi lo riceve è il
   commerciale, che risponde dal suo client. Un template HTML qui sarebbe
   solo un'occasione in più di sbagliare l'escaping. */
function corpo(b: Busta): string {
  return [
    "Nuova richiesta dal form contatti del sito.",
    "",
    `Nome e cognome: ${b.nome.trim()}`,
    `Azienda: ${b.azienda.trim() || "—"}`,
    `Email: ${b.email.trim()}`,
    "",
    "Messaggio:",
    b.messaggio.trim(),
    "",
    "—",
    `Origine: ${b.origine}`,
  ].join("\n");
}

export async function spedisci(busta: Busta): Promise<EsitoConsegna> {
  const conf = configurazione();
  if (!conf) return { ok: false, motivo: "NON_CONFIGURATO" };

  try {
    /* Timeout esplicito: senza, una Resend lenta tiene appesa la Server
       Action fino al limite della piattaforma e l'utente vede una rotella
       che non finisce mai. */
    const stop = AbortSignal.timeout(10_000);

    const risposta = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${conf.chiave}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: conf.mittente,
        to: [conf.destinatario],
        /* la risposta del commerciale torna al cliente, non al mittente
           tecnico: è il motivo per cui reply_to non è un dettaglio */
        reply_to: busta.email.trim(),
        subject: `Richiesta dal sito — ${busta.nome.trim()}${
          busta.azienda.trim() ? ` · ${busta.azienda.trim()}` : ""
        }`,
        text: corpo(busta),
      }),
      signal: stop,
    });

    if (!risposta.ok) {
      /* Il corpo dell'errore non torna al client (potrebbe contenere
         dettagli dell'account): resta nei log del server. */
      console.error(
        "[contatti] Resend ha rifiutato la richiesta",
        risposta.status,
        await risposta.text().catch(() => "")
      );
      return { ok: false, motivo: "PROVIDER" };
    }

    return { ok: true };
  } catch (errore) {
    console.error("[contatti] consegna fallita", errore);
    return { ok: false, motivo: "PROVIDER" };
  }
}
