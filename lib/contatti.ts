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

export const REPARTI_INTERESSE = [
  { valore: "commerciale-distribuzione", etichetta: "Commerciale / Distribuzione" },
  { valore: "prodotti-personalizzazioni", etichetta: "Prodotti / Personalizzazioni" },
  { valore: "qualita-certificazioni", etichetta: "Qualità / Certificazioni" },
  { valore: "amministrazione-contabilita", etichetta: "Amministrazione / Contabilità" },
  { valore: "lavora-con-noi", etichetta: "Lavora con noi" },
  { valore: "altro", etichetta: "Altro" },
] as const;

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
export function validaContatto(bozza: BozzaContatto): ErroriContatto {
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
    errori.nome = "Serve un nome per sapere con chi stiamo parlando.";
  else if (nome.length > LIMITI.nome.max)
    errori.nome = `Il nome non può superare i ${LIMITI.nome.max} caratteri.`;

  if (cognome.length < LIMITI.cognome.min)
    errori.cognome = "Inserisci il cognome.";
  else if (cognome.length > LIMITI.cognome.max)
    errori.cognome = `Il cognome non può superare i ${LIMITI.cognome.max} caratteri.`;

  const cifreTelefono = telefono.replace(/\D/g, "");
  if (!telefono) errori.telefono = "Inserisci un numero di telefono.";
  else if (
    !FORMA_TELEFONO.test(telefono) ||
    cifreTelefono.length < LIMITI.telefono.minCifre ||
    telefono.length > LIMITI.telefono.max
  )
    errori.telefono = "Controlla il numero di telefono e il prefisso.";

  if (!email) errori.email = "Senza un'email non possiamo risponderti.";
  else if (email.length > LIMITI.email.max)
    errori.email = `L'email non può superare i ${LIMITI.email.max} caratteri.`;
  else if (!FORMA_EMAIL.test(email))
    errori.email = "Controlla l'indirizzo: manca la chiocciola o il dominio.";

  if (azienda.length < LIMITI.azienda.min)
    errori.azienda = "Inserisci il nome dell'azienda.";
  else if (azienda.length > LIMITI.azienda.max)
    errori.azienda = `L'azienda non può superare i ${LIMITI.azienda.max} caratteri.`;

  if (ruolo.length < LIMITI.ruolo.min)
    errori.ruolo = "Inserisci il tuo ruolo in azienda.";
  else if (ruolo.length > LIMITI.ruolo.max)
    errori.ruolo = `Il ruolo non può superare i ${LIMITI.ruolo.max} caratteri.`;

  if (!REPARTI_INTERESSE.some((opzione) => opzione.valore === reparto))
    errori.reparto = "Seleziona il reparto a cui vuoi inviare la richiesta.";

  if (messaggio.length < LIMITI.messaggio.min)
    errori.messaggio = `Scrivi almeno ${LIMITI.messaggio.min} caratteri: cosa ti serve, e in che quantità.`;
  else if (messaggio.length > LIMITI.messaggio.max)
    errori.messaggio = `Il messaggio non può superare i ${LIMITI.messaggio.max} caratteri.`;

  if (!bozza.privacy)
    errori.privacy = "Devi accettare l'informativa privacy per inviare la richiesta.";

  return errori;
}

export function etichettaReparto(valore: string): string {
  return (
    REPARTI_INTERESSE.find((opzione) => opzione.valore === valore)?.etichetta ??
    valore
  );
}

/**
 * Il ripiego: un mailto: già scritto, da offrire quando la consegna
 * server-side non è disponibile. Non è un invio riuscito travestito —
 * la UI lo presenta come tale, cioè come «apri il tuo client di posta».
 */
export function mailtoDiRipiego(bozza: BozzaContatto): string {
  const nominativo = `${bozza.nome.trim()} ${bozza.cognome.trim()}`.trim();
  const oggetto = `Richiesta dal sito — ${nominativo || "contatto"}`;
  const corpo = [
    `Nome: ${bozza.nome.trim()}`,
    `Cognome: ${bozza.cognome.trim()}`,
    `Telefono: ${bozza.telefono.trim()}`,
    `Email: ${bozza.email.trim()}`,
    `Azienda: ${bozza.azienda.trim()}`,
    `Ruolo: ${bozza.ruolo.trim()}`,
    `Reparto di interesse: ${etichettaReparto(bozza.reparto)}`,
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
