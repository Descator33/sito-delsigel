"use server";

/**
 * La Server Action del form contatti.
 *
 * Una Server Action viaggia in POST ed è raggiungibile con POST diretti,
 * quindi qui non si dà per buono niente di ciò che il client ha già
 * controllato: si rivalida con lo stesso modulo (`validaContatto`), si
 * legge l'honeypot, si conta la frequenza per IP. La validazione del
 * client serve alla persona che scrive, questa serve alla casella di posta
 * del commerciale.
 *
 * Lo stato di ritorno è un'unione discriminata: la UI non deve dedurre
 * nulla incrociando flag, guarda `stato` e disegna.
 */

import { headers } from "next/headers";
import {
  mailtoDiRipiego,
  validaContatto,
  type BozzaContatto,
  type StatoContatto,
} from "@/lib/contatti";
import { spedisci } from "@/lib/contatti/consegna";
import { dizionario } from "@/lib/i18n/dizionario";
import {
  LINGUA_PREDEFINITA,
  haLingua,
} from "@/lib/i18n/lingue";

/* Un client onesto impiega qualche secondo a compilare quattro campi;
   uno script no. Sotto questa soglia la richiesta è quasi certamente
   automatica. */
const ATTESA_MINIMA_MS = 2_500;

/* Freno per IP: tre invii ogni cinque minuti.
   È una Map in memoria di processo, quindi il conteggio è per istanza e
   si azzera a ogni deploy o cold start — su una piattaforma serverless
   non è una difesa forte, ed è deliberato: il vero freno è l'honeypot,
   questo è il tappo contro il click ripetuto e il ciclo banale. Se il
   sito finirà su un'infrastruttura con storage condiviso (Redis, KV), è
   qui che si sostituisce il contenitore e basta. */
const FINESTRA_MS = 5 * 60 * 1000;
const INVII_PER_FINESTRA = 3;
const registro = new Map<string, number[]>();

function troppiInvii(ip: string, adesso: number): boolean {
  const recenti = (registro.get(ip) ?? []).filter(
    (t) => adesso - t < FINESTRA_MS
  );
  if (recenti.length >= INVII_PER_FINESTRA) {
    registro.set(ip, recenti);
    return true;
  }
  recenti.push(adesso);
  registro.set(ip, recenti);

  /* potatura opportunistica: senza, la Map cresce per tutta la vita del
     processo su un sito che riceve traffico automatico */
  if (registro.size > 500) {
    for (const [chiave, tempi] of registro) {
      if (tempi.every((t) => adesso - t >= FINESTRA_MS)) registro.delete(chiave);
    }
  }
  return false;
}

async function ipDellaRichiesta(): Promise<string> {
  const h = await headers();
  const inoltrato = h.get("x-forwarded-for");
  /* x-forwarded-for è una catena: il primo elemento è il client, il resto
     sono i proxy attraversati */
  return inoltrato?.split(",")[0]?.trim() || h.get("x-real-ip") || "ignoto";
}

export async function inviaRichiesta(
  _precedente: StatoContatto,
  dati: FormData
): Promise<StatoContatto> {
  const testo = (campo: string) => String(dati.get(campo) ?? "");
  const linguaRichiesta = testo("lingua");
  const lingua = haLingua(linguaRichiesta)
    ? linguaRichiesta
    : LINGUA_PREDEFINITA;
  const testi = dizionario(lingua).contatti;

  const bozza: BozzaContatto = {
    nome: testo("nome"),
    cognome: testo("cognome"),
    telefono: testo("telefono"),
    email: testo("email"),
    azienda: testo("azienda"),
    ruolo: testo("ruolo"),
    reparto: testo("reparto"),
    messaggio: testo("messaggio"),
    privacy: dati.get("privacy") === "on",
  };

  /* L'honeypot: un campo che nessun essere umano vede e che i compilatori
     automatici riempiono comunque. Si risponde `ok` senza spedire — dire
     «sei un bot» insegnerebbe al bot come non esserlo. */
  if (testo("sito_web").trim() !== "") {
    return {
      stato: "ok",
      messaggio: testi.esiti.ricevuto,
    };
  }

  /* Secondo filtro senza attrito: il tempo trascorso fra il render del
     form e l'invio. Il campo è scritto dal client, quindi vale come
     indizio e non come prova — infatti non blocca da solo, si somma
     all'honeypot. */
  const apertura = Number(testo("aperto_il"));
  if (Number.isFinite(apertura) && apertura > 0) {
    if (Date.now() - apertura < ATTESA_MINIMA_MS) {
      return {
        stato: "errore",
        campi: {},
        messaggio: testi.esiti.troppoInFretta,
        valori: bozza,
      };
    }
  }

  const campi = validaContatto(bozza, testi);
  if (Object.keys(campi).length > 0) {
    return {
      stato: "errore",
      campi,
      messaggio: testi.esiti.controllaCampi,
      valori: bozza,
    };
  }

  const ip = await ipDellaRichiesta();
  if (troppiInvii(ip, Date.now())) {
    return {
      stato: "errore",
      campi: {},
      messaggio: testi.esiti.troppiInvii,
      valori: bozza,
    };
  }

  const esito = await spedisci({ ...bozza, origine: ip });

  if (esito.ok) {
    return {
      stato: "ok",
      messaggio: testi.esiti.ricevuto,
    };
  }

  /* Le due rese sono diverse e vanno dette diverse: il canale non c'è
     ancora, oppure c'è e ha fallito. In entrambi i casi si consegna alla
     persona una strada che funziona subito. */
  return {
    stato: "errore",
    campi: {},
    messaggio:
      esito.motivo === "NON_CONFIGURATO"
        ? testi.esiti.canaleAssente
        : testi.esiti.invioFallito,
    ripiego: mailtoDiRipiego(bozza, testi),
    valori: bozza,
  };
}
