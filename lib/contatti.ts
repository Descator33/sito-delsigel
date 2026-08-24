/**
 * I dati e le regole della sub-page Contatti.
 *
 * Sta qui — e non dentro i componenti — perché gli stessi recapiti li
 * usano la griglia, il banner «vieni a trovarci» e il ripiego mailto: del
 * form quando il canale di posta non è configurato. Averli in un posto
 * solo è ciò che impedisce che il numero di telefono cambi in tre file su
 * quattro.
 *
 * La validazione è scritta a mano, come `validaStato` nel configuratore:
 * il progetto non ha zod fra le dipendenze e quattro campi non giustificano
 * di introdurlo, ma soprattutto la stessa funzione deve girare identica sul
 * client (per l'errore immediato) e nella Server Action (dove è l'unico
 * controllo che conta). Un modulo neutro, importabile da entrambi.
 */

import { interpola } from "@/lib/i18n/interpola";
import type { Testi } from "@/lib/i18n/tipi";

/* Le coordinate reali dello stabilimento. Il link Maps è costruito sulla
   query testuale e non su un place-id: sopravvive a un cambio di scheda
   dell'attività, che il place-id non farebbe. */
export const INDIRIZZO = {
  via: "Via della Meccanica, 1",
  citta: "04013 Sermoneta (LT)",
} as const;

export const MAPPA =
  "https://www.google.com/maps/search/?api=1&query=" +
  encodeURIComponent(`Delsigel, ${INDIRIZZO.via}, ${INDIRIZZO.citta}`);

export const EMAIL = "info@delsigel.it";
export const PEC = "delsigel@legalmail.it";
export const TELEFONO = "+39 0773 319437";

/** il numero senza spazi né prefissi parlati: `tel:` non tollera altro */
const TELEFONO_HREF = "tel:+390773319437";

export type Accento = "rosso" | "acido";

export type Recapito = {
  /** chiave stabile per il `key` di React e per l'icona */
  id: "email" | "telefono" | "pec" | "stabilimento";
  label: string;
  /** una o due righe: lo stabilimento ne ha due, gli altri una */
  righe: readonly [string] | readonly [string, string];
  href: string;
  /** solo lo stabilimento esce dal sito */
  esterno?: boolean;
  accento: Accento;
  /** l'etichetta letta dagli screen reader al posto di «freccia» */
  azione: string;
};

/* L'alternanza rosso/acido non è casuale: segue la lettura a Z della
   griglia 2×2, così le due campiture non finiscono mai adiacenti in
   diagonale e la scacchiera si legge. */
export function recapiti(testi: Testi["contatti"]): readonly Recapito[] {
  return [
    {
      id: "email",
      ...testi.recapiti.email,
      righe: [EMAIL],
      href: `mailto:${EMAIL}`,
      accento: "rosso",
    },
    {
      id: "telefono",
      ...testi.recapiti.telefono,
      righe: [TELEFONO],
      href: TELEFONO_HREF,
      accento: "acido",
    },
    {
      id: "pec",
      ...testi.recapiti.pec,
      righe: [PEC],
      href: `mailto:${PEC}`,
      accento: "rosso",
    },
    {
      id: "stabilimento",
      ...testi.recapiti.stabilimento,
      righe: [INDIRIZZO.via, INDIRIZZO.citta],
      href: MAPPA,
      esterno: true,
      accento: "acido",
    },
  ];
}

/* ------------------------------ il form ------------------------------ */

export const ID_REPARTI_INTERESSE = [
  "commerciale-distribuzione",
  "prodotti-personalizzazioni",
  "qualita-certificazioni",
  "amministrazione-contabilita",
  "lavora-con-noi",
  "altro",
] as const;

export type IdRepartoInteresse = (typeof ID_REPARTI_INTERESSE)[number];

export function repartiInteresse(testi: Testi["contatti"]) {
  return ID_REPARTI_INTERESSE.map((valore) => ({
    valore,
    etichetta: testi.reparti[valore],
  }));
}

export type CampoTestoContatto =
  | "nome"
  | "cognome"
  | "telefono"
  | "email"
  | "azienda"
  | "ruolo"
  | "reparto"
  | "messaggio";

export type CampoContatto = CampoTestoContatto | "privacy";

export type BozzaContatto = Record<CampoTestoContatto, string> & {
  privacy: boolean;
};

export type ErroriContatto = Partial<Record<CampoContatto, string>>;

/** limiti larghi: servono a fermare gli abusi, non a correggere le persone */
export const LIMITI = {
  nome: { min: 2, max: 70 },
  cognome: { min: 2, max: 90 },
  telefono: { minCifre: 7, max: 30 },
  email: { max: 180 },
  azienda: { min: 2, max: 140 },
  ruolo: { min: 2, max: 120 },
  messaggio: { min: 20, max: 4000 },
} as const;

/* Nessuna regex «perfetta» per le email: non esiste, e quelle che ci
   provano rifiutano indirizzi validi. Si controlla la forma minima
   (qualcosa @ qualcosa . qualcosa, senza spazi) e si lascia che sia la
   consegna a dire la verità. */
const FORMA_EMAIL = /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/;
const FORMA_TELEFONO = /^\+?[\d\s()./-]+$/;

/**
 * Valida la bozza e restituisce SOLO i campi in errore.
 * Un oggetto vuoto significa che si può inviare.
 */
export function validaContatto(
  bozza: BozzaContatto,
  testi: Testi["contatti"],
): ErroriContatto {
  const errori: ErroriContatto = {};
  const nome = bozza.nome.trim();
  const cognome = bozza.cognome.trim();
  const telefono = bozza.telefono.trim();
  const email = bozza.email.trim();
  const azienda = bozza.azienda.trim();
  const ruolo = bozza.ruolo.trim();
  const reparto = bozza.reparto.trim();
  const messaggio = bozza.messaggio.trim();

  if (nome.length < LIMITI.nome.min)
    errori.nome = testi.errori.nomeCorto;
  else if (nome.length > LIMITI.nome.max)
    errori.nome = interpola(testi.errori.nomeLungo, { max: LIMITI.nome.max });

  if (cognome.length < LIMITI.cognome.min)
    errori.cognome = testi.errori.cognomeCorto;
  else if (cognome.length > LIMITI.cognome.max)
    errori.cognome = interpola(testi.errori.cognomeLungo, {
      max: LIMITI.cognome.max,
    });

  const cifreTelefono = telefono.replace(/\D/g, "");
  if (!telefono) errori.telefono = testi.errori.telefonoMancante;
  else if (
    !FORMA_TELEFONO.test(telefono) ||
    cifreTelefono.length < LIMITI.telefono.minCifre ||
    telefono.length > LIMITI.telefono.max
  )
    errori.telefono = testi.errori.telefonoErrato;

  if (!email) errori.email = testi.errori.emailMancante;
  else if (email.length > LIMITI.email.max)
    errori.email = interpola(testi.errori.emailLunga, { max: LIMITI.email.max });
  else if (!FORMA_EMAIL.test(email))
    errori.email = testi.errori.emailErrata;

  if (azienda.length < LIMITI.azienda.min)
    errori.azienda = testi.errori.aziendaCorta;
  else if (azienda.length > LIMITI.azienda.max)
    errori.azienda = interpola(testi.errori.aziendaLunga, {
      max: LIMITI.azienda.max,
    });

  if (ruolo.length < LIMITI.ruolo.min)
    errori.ruolo = testi.errori.ruoloCorto;
  else if (ruolo.length > LIMITI.ruolo.max)
    errori.ruolo = interpola(testi.errori.ruoloLungo, { max: LIMITI.ruolo.max });

  if (!ID_REPARTI_INTERESSE.some((valore) => valore === reparto))
    errori.reparto = testi.errori.repartoMancante;

  if (messaggio.length < LIMITI.messaggio.min)
    errori.messaggio = interpola(testi.errori.messaggioCorto, {
      min: LIMITI.messaggio.min,
    });
  else if (messaggio.length > LIMITI.messaggio.max)
    errori.messaggio = interpola(testi.errori.messaggioLungo, {
      max: LIMITI.messaggio.max,
    });

  if (!bozza.privacy) errori.privacy = testi.errori.privacyMancante;

  return errori;
}

export function etichettaReparto(
  valore: string,
  testi: Testi["contatti"],
): string {
  return ID_REPARTI_INTERESSE.includes(valore as IdRepartoInteresse)
    ? testi.reparti[valore as IdRepartoInteresse]
    : valore;
}

/**
 * Il ripiego: un mailto: già scritto, da offrire quando la consegna
 * server-side non è disponibile. Non è un invio riuscito travestito —
 * la UI lo presenta come tale, cioè come «apri il tuo client di posta».
 */
export function mailtoDiRipiego(
  bozza: BozzaContatto,
  testi: Testi["contatti"],
): string {
  const mail = testi.mailRipiego;
  const nominativo = `${bozza.nome.trim()} ${bozza.cognome.trim()}`.trim();
  const oggetto = interpola(mail.oggetto, {
    nome: nominativo || mail.contatto,
  });
  const corpo = [
    `${mail.nome}: ${bozza.nome.trim()}`,
    `${mail.cognome}: ${bozza.cognome.trim()}`,
    `${mail.telefono}: ${bozza.telefono.trim()}`,
    `${mail.email}: ${bozza.email.trim()}`,
    `${mail.azienda}: ${bozza.azienda.trim()}`,
    `${mail.ruolo}: ${bozza.ruolo.trim()}`,
    `${mail.reparto}: ${etichettaReparto(bozza.reparto, testi)}`,
    "",
    bozza.messaggio.trim(),
  ].join("\n");

  return `mailto:${EMAIL}?subject=${encodeURIComponent(oggetto)}&body=${encodeURIComponent(corpo)}`;
}

/* ------------------------- lo stato dell'invio ------------------------- */

/**
 * L'esito della Server Action, come unione discriminata: la UI guarda
 * `stato` e disegna, senza incrociare flag.
 *
 * Vive qui e non accanto all'action perché un modulo `"use server"` può
 * esportare solo funzioni asincrone — `STATO_INIZIALE` lì dentro sarebbe
 * un errore di compilazione, e separare il tipo dal suo valore iniziale
 * per aggirarlo sarebbe peggio del male.
 */
export type StatoContatto =
  | { stato: "iniziale" }
  | {
      stato: "errore";
      /** errori per campo: la UI li appende sotto l'input giusto */
      campi: ErroriContatto;
      /** il messaggio d'insieme, letto dalla regione aria-live */
      messaggio: string;
      /** valorizzato solo quando ha senso proporre il client di posta */
      ripiego?: string;
      /**
       * Ciò che la persona aveva scritto, rimandato indietro.
       *
       * Non è un vezzo: React 19 svuota da sé un form non controllato
       * appena l'action finisce, quindi senza questi valori un errore di
       * validazione cancellerebbe il messaggio appena scritto. La UI li
       * rimette come `defaultValue` — il reset di React riporta al
       * `defaultValue` corrente, quindi il testo resta dov'era.
       */
      valori: BozzaContatto;
    }
  | { stato: "ok"; messaggio: string };

export const STATO_INIZIALE: StatoContatto = { stato: "iniziale" };

export const BOZZA_VUOTA: BozzaContatto = {
  nome: "",
  cognome: "",
  telefono: "",
  email: "",
  azienda: "",
  ruolo: "",
  reparto: "",
  messaggio: "",
  privacy: false,
};
