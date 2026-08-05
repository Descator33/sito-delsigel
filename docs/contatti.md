# Contatti — configurazione dell'invio

La pagina `/contatti` spedisce il form dal server, non dal browser. Finché
le variabili qui sotto non sono impostate il form **non finge**: valida,
poi dice che il canale non è attivo e offre un `mailto:` già compilato.

## Variabili d'ambiente

| Variabile | Obbligatoria | Cosa contiene |
| --- | --- | --- |
| `RESEND_API_KEY` | sì | la chiave API del progetto Resend |
| `CONTATTI_MITTENTE` | sì | il mittente, su un dominio **verificato** in Resend (es. `sito@delsigel.it`) |
| `CONTATTI_DESTINATARIO` | no | dove arrivano le richieste. Default: `info@delsigel.it` |

In locale vanno in `.env.local`, che non è versionato. In produzione, fra
le variabili d'ambiente della piattaforma.

Senza `CONTATTI_MITTENTE` su un dominio verificato Resend rifiuta la
richiesta: è il primo posto da guardare se le mail non partono.

## Cambiare provider

Il trasporto è isolato in [`lib/contatti/consegna.ts`](../lib/contatti/consegna.ts):
una sola `fetch` verso l'API di Resend. Per passare a un altro servizio
(SMTP, SendGrid, il gestionale) si riscrive `spedisci` e nient'altro —
la Server Action, la validazione e la UI non la conoscono, vedono solo
`{ ok: true }` o `{ ok: false, motivo }`.

## Difese contro lo spam

Tre, in ordine di efficacia:

1. **Honeypot** (`sito_web`): campo fuori schermo, fuori dal giro di
   tabulazione e `aria-hidden`. Se arriva compilato la richiesta viene
   scartata in silenzio e all'invio si risponde `ok` — dire «sei un bot»
   insegna al bot come non esserlo.
2. **Tempo minimo di compilazione** (2,5 s), misurato fra il render del
   form e l'invio. È un indizio, non una prova: il valore lo scrive il
   client.
3. **Rate limit**, 3 invii ogni 5 minuti per IP. È una `Map` in memoria
   di processo, quindi **vale per istanza** e si azzera a ogni deploy o
   cold start. Su una piattaforma serverless non è una difesa forte: è il
   tappo contro il click ripetuto. Se in futuro l'infrastruttura offre
   uno storage condiviso (Redis, Vercel KV), si sostituisce il
   contenitore in `app/contatti/actions.ts` e basta.

La validazione server-side gira comunque, sempre, con lo stesso modulo
del client (`validaContatto` in `lib/contatti.ts`): una Server Action è un
endpoint POST pubblico, e il client si aggira.

## Cosa manca

Gli **orari di apertura** non sono ancora stati forniti dal committente,
quindi la pagina non li mostra. Quando arrivano, il posto è
`lib/contatti.ts` accanto a `INDIRIZZO`.
