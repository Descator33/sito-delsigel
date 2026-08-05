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
export const RECAPITI: readonly Recapito[] = [
  {
    id: "email",
    label: "Email",
    righe: [EMAIL],
    href: `mailto:${EMAIL}`,
    accento: "rosso",
    azione: "Scrivi a Delsigel",
  },
  {
    id: "telefono",
    label: "Telefono",
    righe: [TELEFONO],
    href: TELEFONO_HREF,
    accento: "acido",
    azione: "Chiama Delsigel",
  },
  {
    id: "pec",
    label: "PEC",
    righe: [PEC],
    href: `mailto:${PEC}`,
    accento: "rosso",
    azione: "Scrivi alla PEC Delsigel",
  },
  {
    id: "stabilimento",
    label: "Stabilimento",
    righe: [INDIRIZZO.via, INDIRIZZO.citta],
    href: MAPPA,
    esterno: true,
    accento: "acido",
    azione: "Apri lo stabilimento su Google Maps",
  },
] as const;

/* ------------------------------ il form ------------------------------ */

export type CampoContatto = "nome" | "azienda" | "email" | "messaggio";

export type BozzaContatto = Record<CampoContatto, string>;

export type ErroriContatto = Partial<Record<CampoContatto, string>>;

/** limiti larghi: servono a fermare gli abusi, non a correggere le persone */
export const LIMITI = {
  nome: { min: 2, max: 120 },
  azienda: { max: 140 },
  email: { max: 180 },
  messaggio: { min: 20, max: 4000 },
} as const;

/* Nessuna regex «perfetta» per le email: non esiste, e quelle che ci
   provano rifiutano indirizzi validi. Si controlla la forma minima
   (qualcosa @ qualcosa . qualcosa, senza spazi) e si lascia che sia la
   consegna a dire la verità. */
const FORMA_EMAIL = /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/;

/**
 * Valida la bozza e restituisce SOLO i campi in errore.
 * Un oggetto vuoto significa che si può inviare.
 */
export function validaContatto(bozza: BozzaContatto): ErroriContatto {
  const errori: ErroriContatto = {};
  const nome = bozza.nome.trim();
  const azienda = bozza.azienda.trim();
  const email = bozza.email.trim();
  const messaggio = bozza.messaggio.trim();

  if (nome.length < LIMITI.nome.min)
    errori.nome = "Serve un nome per sapere con chi stiamo parlando.";
  else if (nome.length > LIMITI.nome.max)
    errori.nome = `Il nome non può superare i ${LIMITI.nome.max} caratteri.`;

  if (azienda.length > LIMITI.azienda.max)
    errori.azienda = `L'azienda non può superare i ${LIMITI.azienda.max} caratteri.`;

  if (!email) errori.email = "Senza un'email non possiamo risponderti.";
  else if (email.length > LIMITI.email.max)
    errori.email = `L'email non può superare i ${LIMITI.email.max} caratteri.`;
  else if (!FORMA_EMAIL.test(email))
    errori.email = "Controlla l'indirizzo: manca la chiocciola o il dominio.";

  if (messaggio.length < LIMITI.messaggio.min)
    errori.messaggio = `Scrivi almeno ${LIMITI.messaggio.min} caratteri: cosa ti serve, e in che quantità.`;
  else if (messaggio.length > LIMITI.messaggio.max)
    errori.messaggio = `Il messaggio non può superare i ${LIMITI.messaggio.max} caratteri.`;

  return errori;
}

/**
 * Il ripiego: un mailto: già scritto, da offrire quando la consegna
 * server-side non è disponibile. Non è un invio riuscito travestito —
 * la UI lo presenta come tale, cioè come «apri il tuo client di posta».
 */
export function mailtoDiRipiego(bozza: BozzaContatto): string {
  const oggetto = `Richiesta dal sito — ${bozza.nome.trim() || "contatto"}`;
  const corpo = [
    `Nome e cognome: ${bozza.nome.trim()}`,
    bozza.azienda.trim() ? `Azienda: ${bozza.azienda.trim()}` : null,
    `Email: ${bozza.email.trim()}`,
    "",
    bozza.messaggio.trim(),
  ]
    .filter((riga): riga is string => riga !== null)
    .join("\n");

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
  azienda: "",
  email: "",
  messaggio: "",
};
