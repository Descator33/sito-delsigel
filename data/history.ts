/**
 * Le sei tappe del film scroll-driven «La nostra storia».
 *
 * Le immagini sono interpretazioni editoriali generate per la campagna,
 * non fotografie d'archivio né ritratti delle persone reali. Ogni scena
 * ha un taglio orizzontale e un reframe verticale dedicato.
 */

export type Certificazione = {
  /** nome dell'ente o dello standard */
  nome: string;
  /** logo ufficiale, in public/brand/certificazioni */
  logo: string;
  /** testo alternativo descrittivo */
  alt: string;
};

export type TappaStoria = {
  /** ancora e chiave React */
  id: string;
  /** progressivo mostrato nell'indicatore: "01" … "06" */
  numero: string;
  /** anno o parola-chiave */
  titolo: string;
  /** contesto breve sopra il titolo */
  sottotitolo: string;
  /** testo breve del capitolo */
  descrizione: string;
  /** frase principale che accompagna la tappa */
  frase: string;
  /** immagine editoriale generata, taglio orizzontale */
  immagine: string;
  /** reframe verticale per telefono */
  immagineVertical: string;
  /** testo alternativo descrittivo */
  alt: string;
  /** loghi ufficiali mostrati sotto il testo della tappa */
  certificazioni?: Certificazione[];
};

export const STORIA: TappaStoria[] = [
  {
    id: "origini",
    numero: "01",
    titolo: "2011",
    sottotitolo: "L'incontro",
    descrizione:
      "Del Monte, maestra dei fritti dolci. Siani, casa della pasta sfoglia. Nel 2011 due aziende dolciarie affermate uniscono ricette e mestiere: nasce Delsigel, a Sermoneta.",
    frase: "Due mestieri, un forno solo.",
    immagine: "/storia-generated/01-origini-wide.webp",
    immagineVertical: "/storia-generated/01-origini-vertical.webp",
    alt: "Composizione editoriale evocativa di un pasticcere che apre il forno all'alba",
  },
  {
    id: "unione",
    numero: "02",
    titolo: "L'ossimoro",
    sottotitolo: "Industria artigianale",
    descrizione:
      "Ricette tradizionali, lavorazione semi-artigianale, impianti di ultima generazione. Ci chiamano ossimoro; per noi è un pensiero: fare in grande ciò che pochi sanno ancora fare a mano.",
    frase: "Mani d'artigiano, passo d'industria.",
    immagine: "/storia-generated/02-unione-wide.webp",
    immagineVertical: "/storia-generated/02-unione-vertical.webp",
    alt: "Composizione editoriale evocativa di due pasticceri che uniscono le mani sul banco",
  },
  {
    id: "qualita",
    numero: "03",
    titolo: "La qualità",
    sottotitolo: "Certificata, ogni giorno",
    descrizione:
      "Materie prime selezionate e processi verificati da chi non fa sconti: IFS Food per la sicurezza alimentare, Rainforest Alliance e RSPO per ingredienti che rispettano chi li coltiva. Non promesse: verifiche.",
    frase: "La cura, messa nero su bianco.",
    immagine: "/storia-generated/03-artigianalita-wide.webp",
    immagineVertical: "/storia-generated/03-artigianalita-vertical.webp",
    alt: "Composizione editoriale evocativa di mani che piegano la sfoglia sul banco infarinato",
    certificazioni: [
      {
        nome: "IFS Food",
        logo: "/brand/certificazioni/ifs.svg",
        alt: "Logo della certificazione IFS Food — International Featured Standards",
      },
      {
        nome: "Rainforest Alliance",
        logo: "/brand/certificazioni/rainforest-alliance.svg",
        alt: "Logo Rainforest Alliance, People & Nature",
      },
      {
        nome: "RSPO",
        logo: "/brand/certificazioni/rspo.svg",
        alt: "Marchio RSPO — Certified Sustainable Palm Oil",
      },
    ],
  },
  {
    id: "traguardo",
    numero: "04",
    titolo: "13 milioni",
    sottotitolo: "2025 · Intriko",
    descrizione:
      "Nel 2025 firmiamo tredici milioni di Intriko e le linee toccano il loro limite. Un traguardo che diventa subito una domanda: come crescere senza perdere la mano?",
    frase: "Tredici milioni di volte, lo stesso gesto.",
    immagine: "/storia-generated/04-crescita-wide.webp",
    immagineVertical: "/storia-generated/04-crescita-vertical.webp",
    alt: "Composizione editoriale evocativa di un pasticcere che controlla una linea moderna",
  },
  {
    id: "generazione",
    numero: "05",
    titolo: "2026",
    sottotitolo: "La nuova generazione",
    descrizione:
      "Il socio fondatore Del Monte passa il timone e sceglie il mare, dopo una vita di farina. Al banco arrivano Gaia e una squadra giovane, con la regola imparata il primo giorno: fai il tuo lavoro con passione.",
    frase: "Il timone passa. La rotta resta.",
    immagine: "/storia-generated/06-futuro-wide.webp",
    immagineVertical: "/storia-generated/06-futuro-vertical.webp",
    alt: "Composizione editoriale evocativa del passaggio di un ricettario tra due generazioni",
  },
  {
    id: "futuro",
    numero: "06",
    titolo: "25 milioni",
    sottotitolo: "Il piano 2026–27",
    descrizione:
      "Nuovi spazi entro il 2026, nuove linee nel 2027: la capacità raddoppia, fino a venticinque milioni di pezzi. E le Nuvole — soffice fritto, farcitura a vista, decoro a mano — hanno già il sapore del domani.",
    frase: "Il forno resta acceso. E raddoppia.",
    immagine: "/storia-generated/05-squadra-wide.webp",
    immagineVertical: "/storia-generated/05-squadra-vertical.webp",
    alt: "Composizione editoriale evocativa di una squadra di pasticceri al lavoro",
  },
];

/** L'intestazione della scena: la parte che non cambia con lo scroll. */
export const INTESTAZIONE = {
  eyebrow: "Delsigel · dal 2011",
  titolo: ["La nostra", "storia"],
  sottotitolo: "Quindici anni, sei capitoli, tredici milioni di dolci.",
  testo: [
    "Non una cronologia: sei capitoli con dentro numeri veri e mani vere.",
    "E una promessa che non cambia: fare del nostro meglio, ogni giorno.",
  ],
  invito: "Scorri per vivere il viaggio",
  azione: { testo: "Conosci la squadra", href: "#squadra" },
};

/** La chiusura: si apre sull'ultima tappa e introduce «La squadra». */
export const FINALE = {
  eyebrow: "La storia continua",
  frase: ["Cambiano le mani.", "Non cambia la cura."],
  coda: "Dal 2011, a Sermoneta · del nostro meglio, ogni giorno",
};
