/**
 * Le sei tappe del film scroll-driven «La nostra storia».
 *
 * Le immagini sono interpretazioni editoriali generate per la campagna,
 * non fotografie d'archivio né ritratti delle persone reali. Ogni scena
 * ha un taglio orizzontale e un reframe verticale dedicato.
 */

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
};

export const STORIA: TappaStoria[] = [
  {
    id: "origini",
    numero: "01",
    titolo: "2011",
    sottotitolo: "Le origini",
    descrizione:
      "Nasce Delsigel in un piccolo laboratorio con un grande sogno: creare dolci unici, buoni per tutti.",
    frase: "Tutto comincia da un forno acceso.",
    immagine: "/storia-generated/01-origini-wide.webp",
    immagineVertical: "/storia-generated/01-origini-vertical.webp",
    alt: "Composizione editoriale evocativa di un pasticcere che apre il forno all'alba",
  },
  {
    id: "unione",
    numero: "02",
    titolo: "L'unione",
    sottotitolo: "Del Monte e Siani",
    descrizione:
      "Due storie, una visione. L'unione che ha dato forma a un nuovo inizio.",
    frase: "Due nomi, un solo laboratorio.",
    immagine: "/storia-generated/02-unione-wide.webp",
    immagineVertical: "/storia-generated/02-unione-vertical.webp",
    alt: "Composizione editoriale evocativa di due pasticceri che uniscono le mani sul banco",
  },
  {
    id: "artigianalita",
    numero: "03",
    titolo: "Artigianalità",
    sottotitolo: "e ricette",
    descrizione:
      "Mani esperte, ingredienti selezionati, ricette che raccontano la nostra terra e il nostro tempo.",
    frase: "Il gesto non si automatizza.",
    immagine: "/storia-generated/03-artigianalita-wide.webp",
    immagineVertical: "/storia-generated/03-artigianalita-vertical.webp",
    alt: "Composizione editoriale evocativa di mani che piegano la sfoglia sul banco infarinato",
  },
  {
    id: "crescita",
    numero: "04",
    titolo: "Crescita",
    sottotitolo: "e innovazione",
    descrizione:
      "Investiamo in tecnologia e persone, mantenendo intatta l'anima artigianale che ci distingue.",
    frase: "Più grandi, mai più veloci del giusto.",
    immagine: "/storia-generated/04-crescita-wide.webp",
    immagineVertical: "/storia-generated/04-crescita-vertical.webp",
    alt: "Composizione editoriale evocativa di un pasticcere che controlla una linea moderna",
  },
  {
    id: "oggi",
    numero: "05",
    titolo: "Oggi",
    sottotitolo: "La squadra",
    descrizione:
      "Siamo una squadra che cresce ogni giorno, con la stessa passione di sempre e lo sguardo rivolto avanti.",
    frase: "Ventuno volti, un solo standard.",
    immagine: "/storia-generated/05-squadra-wide.webp",
    immagineVertical: "/storia-generated/05-squadra-vertical.webp",
    alt: "Composizione editoriale evocativa di una squadra di pasticceri al lavoro",
  },
  {
    id: "futuro",
    numero: "06",
    titolo: "Il futuro",
    sottotitolo: "Il passaggio alla figlia",
    descrizione:
      "La nostra storia continua con una nuova generazione, custode dei valori di ieri e creatrice di domani.",
    frase: "Il forno resta acceso.",
    immagine: "/storia-generated/06-futuro-wide.webp",
    immagineVertical: "/storia-generated/06-futuro-vertical.webp",
    alt: "Composizione editoriale evocativa del passaggio di un ricettario tra due generazioni",
  },
];

/** L'intestazione della scena: la parte che non cambia con lo scroll. */
export const INTESTAZIONE = {
  eyebrow: "Delsigel · dal 2011",
  titolo: ["La nostra", "storia"],
  sottotitolo: "Un viaggio immersivo tra memoria, passione e innovazione.",
  testo: [
    "Scorri la storia come se fosse un racconto.",
    "Ogni tappa è un'emozione, ogni cambio di prospettiva è ciò che ci ha portati fin qui.",
  ],
  invito: "Scorri per vivere il viaggio",
  azione: { testo: "Conosci la squadra", href: "#squadra" },
};

/** La chiusura: si apre sull'ultima tappa e introduce «La squadra». */
export const FINALE = {
  eyebrow: "La storia continua",
  frase: ["Cambiano le mani.", "Non cambia la cura."],
  coda: "Dal 2011, a Sermoneta.",
};
