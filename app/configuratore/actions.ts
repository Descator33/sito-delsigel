"use server";

/**
 * Server Action del configuratore: la validazione lato server richiesta
 * dalla spec. Le actions viaggiano in POST e sono raggiungibili anche con
 * POST diretti, quindi qui si riesegue validaStato con lo stesso modulo e
 * lo stesso dataset del client: un URL forgiato, una quantità manomessa o
 * un client rimasto aperto attraverso un deploy non passano.
 *
 * Trasporto provvisorio: il sito non ha ancora un backend di posta (il
 * form contatti è un mailto:), e la scelta quotazione/ordine con il suo
 * destinatario è un punto aperto con il committente. La action valida e
 * compone la richiesta; la consegna passa dal client di posta dell'utente
 * con un mailto: precompilato. Quando arriverà il canale definitivo
 * (casella commerciale o gestionale), si sostituisce solo l'ultimo tratto.
 */

import {
  DATASET,
  baseDi,
  combinazione,
  farcituraVoce,
  fmtKg,
  fmtNumero,
  nomeCommerciale,
  toppingVoce,
  validaStato,
  type Quantita,
} from "@/lib/configuratore";

const DESTINATARIO = "info@delsigel.it";

export type StatoInvio =
  | null
  | {
      ok: false;
      errore:
        | "CAMPI_MANCANTI"
        | "COMBINAZIONE_INESISTENTE"
        | "QUANTITA_NON_VALIDA"
        | "SOTTO_ORDINE_MINIMO"
        | "VERSIONE_OBSOLETA";
      messaggio: string;
      minimoPedane?: number;
      minimoPezzi?: number | null;
    }
  | {
      ok: true;
      sku: string;
      quantita: Quantita;
      mailto: string;
    };

export async function richiediQuotazione(
  _prev: StatoInvio,
  formData: FormData
): Promise<StatoInvio> {
  const testo = (campo: string) => String(formData.get(campo) ?? "").trim();

  const base = testo("base");
  const farcitura = testo("farcitura");
  const pedane = Number(testo("pedane"));
  const versione = testo("versione_listino");
  const cliente = {
    ragione_sociale: testo("ragione_sociale"),
    canale: testo("canale"),
    email: testo("email"),
    telefono: testo("telefono"),
    note: testo("note"),
  };

  if (!cliente.ragione_sociale || !cliente.email || !cliente.canale) {
    return {
      ok: false,
      errore: "CAMPI_MANCANTI",
      messaggio:
        "Per rispondere con il listino giusto servono ragione sociale, canale ed email.",
    };
  }

  /* Il dataset è cambiato mentre la pagina era aperta: si chiede una
     riconferma invece di mandare al commerciale un prodotto che non si
     fa più. Client e action viaggiano con lo stesso deploy, quindi una
     differenza qui significa un deploy avvenuto a sessione aperta. */
  if (versione !== DATASET.versione) {
    return {
      ok: false,
      errore: "VERSIONE_OBSOLETA",
      messaggio:
        "Il listino è stato aggiornato mentre la pagina era aperta. Ricarica la pagina e riconferma la configurazione.",
    };
  }

  const esito = validaStato({ base, farcitura, pedane });

  if (!esito.ok) {
    if (esito.errore === "COMBINAZIONE_INESISTENTE")
      return {
        ok: false,
        errore: esito.errore,
        messaggio:
          "Questa combinazione non è più a listino. Torna alla scelta della farcitura per vedere quelle disponibili.",
      };
    if (esito.errore === "QUANTITA_NON_VALIDA")
      return {
        ok: false,
        errore: esito.errore,
        messaggio:
          "La quantità va espressa in pedane intere, almeno una: è l'unità con cui viaggia il prodotto.",
      };
    /* SOTTO_ORDINE_MINIMO: non un rifiuto ma una deviazione — il client
       propone la correzione o il contatto con il commerciale. */
    return {
      ok: false,
      errore: esito.errore,
      messaggio:
        `Questa referenza si ordina da ${esito.minimo_pedane} pedane` +
        (esito.minimo_pezzi != null
          ? `, pari a ${fmtNumero(esito.minimo_pezzi)} pezzi.`
          : "."),
      minimoPedane: esito.minimo_pedane,
      minimoPezzi: esito.minimo_pezzi,
    };
  }

  const comb = combinazione(base, farcitura)!;
  const laBase = baseDi(base)!;
  const laFarcitura = farcituraVoce(farcitura)!;
  const ilTopping = toppingVoce(comb.topping)!;
  const nomeProdotto = nomeCommerciale(comb);
  const p = laBase.packaging;
  const q = esito.quantita;

  /* Il payload del contratto dati: il prodotto per intero (topping incluso
     benché derivato), le quantità già convertite in tutte le unità — chi
     riceve lavora con l'unità del suo gestionale, e ricalcolare a mano è
     il punto in cui si sbaglia — e la versione di listino. */
  const payload = {
    linea: DATASET.linea,
    sku: comb.sku,
    base: comb.base,
    farcitura: comb.farcitura,
    topping: comb.topping,
    grammatura_gr: comb.grammatura_gr,
    quantita: q,
    packaging: {
      pezzi_per_cartone: p.pezzi_per_cartone,
      cartoni_per_pedana: p.cartoni_per_pedana,
      cartoni_per_strato: p.cartoni_per_strato,
      strati_per_pedana: p.strati_per_pedana,
    },
    ordine_minimo_pedane: comb.ordine_minimo_pedane,
    ordine_minimo_rispettato: true,
    cliente,
    versione_listino: DATASET.versione,
  };

  const oggetto = `Richiesta quotazione — ${nomeProdotto} · ${laFarcitura.nome} — ${q.pedane} pedane`;
  const corpo = [
    "Richiesta di quotazione dal configuratore Delsigel",
    "",
    `Prodotto: ${nomeProdotto} · ${laFarcitura.nome}`,
    `Finitura: ${ilTopping.nome}`,
    `SKU: ${comb.sku}`,
    `Grammatura: ${comb.grammatura_gr} g · Diametro: ${laBase.diametro_cm} cm`,
    "",
    `Quantità richiesta: ${q.pedane} pedane`,
    `= ${fmtNumero(q.cartoni)} cartoni · ${fmtNumero(q.pezzi)} pezzi · ${fmtKg(q.peso_kg)}`,
    comb.ordine_minimo_pedane != null
      ? `Ordine minimo: ${comb.ordine_minimo_pedane} pedane — rispettato`
      : "Ordine minimo: non previsto per questa referenza",
    "",
    `Cliente: ${cliente.ragione_sociale} (${cliente.canale})`,
    `Email: ${cliente.email}${cliente.telefono ? ` · Telefono: ${cliente.telefono}` : ""}`,
    cliente.note ? `Note: ${cliente.note}` : null,
    "",
    `Versione listino: ${payload.versione_listino}`,
    `Riferimento: /configuratore/${comb.base}/${comb.farcitura}`,
  ]
    .filter((r): r is string => r !== null)
    .join("\n");

  const mailto = `mailto:${DESTINATARIO}?subject=${encodeURIComponent(oggetto)}&body=${encodeURIComponent(corpo)}`;

  return { ok: true, sku: comb.sku, quantita: q, mailto };
}
