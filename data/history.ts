/**
 * Le sei tappe della storia Delsigel — la sorgente unica dei contenuti
 * della sezione «La nostra storia» (in homepage dal refactor 12/08;
 * prima viveva su Chi siamo, i componenti sono gli stessi).
 *
 * Qui dentro si cambiano testi, fotografie e colori senza mai toccare la
 * logica GSAP: i componenti leggono questo file e basta.
 *
 * `posizione` è l'`object-position` della foto dentro la fascia: le
 * fasce sono strette e larghe, quindi il soggetto va alzato o abbassato
 * a mano (le fotografie dell'album sono quasi tutte quadrate, 900×900).
 *
 * `colore` è l'accento della tappa: marker della timeline, velo sulla
 * fotografia e filo del titolo. Sono i colori della palette del sito
 * (globals.css) nell'ordine del mockup — con una sola eccezione, la
 * salvia della quarta tappa: il mockup lì chiede un verde e la palette
 * pop non ne ha uno. Resta confinato qui, non diventa un token globale.
 */

export type OggettoPop = {
  /** ritaglio scontornato da public/products */
  src: string;
  /** dimensioni vere del file: servono a next/image per la proporzione */
  w: number;
  h: number;
  /** larghezza in vw sul desktop */
  larghezza: number;
  /** posizione dentro il palco, in percentuale */
  top: string;
  left: string;
  /** inclinazione a riposo, in gradi */
  rotazione: number;
  /** quanto si muove col parallasse: 1 sta sul fondo, 3 sta davanti */
  profondita: number;
};

export type TappaStoria = {
  /** ancora e chiave React */
  id: string;
  /** progressivo mostrato nel marker: "01" … "06" */
  numero: string;
  /** la riga grande dentro la fascia: anno o parola-chiave */
  titolo: string;
  /** la riga bold sotto il titolo */
  sottotitolo: string;
  /** le due righe del marker nella timeline verticale */
  etichetta: [string, string];
  /** il testo breve dentro la fascia: due o tre righe, non di più */
  descrizione: string;
  /** frase secca che accompagna la tappa nel pannello di sinistra */
  frase: string;
  /** fotografia dell'album di stabilimento (public/chi-siamo/album) */
  immagine: string;
  /** testo alternativo descrittivo */
  alt: string;
  /** object-position del ritaglio dentro la fascia */
  posizione: string;
  /** accento della tappa */
  colore: string;
};

export const STORIA: TappaStoria[] = [
  {
    id: "origini",
    numero: "01",
    titolo: "2011",
    sottotitolo: "Le origini",
    etichetta: ["2011", "Le origini"],
    descrizione:
      "Nasce Delsigel in un piccolo laboratorio con un grande sogno: creare dolci unici, buoni per tutti.",
    frase: "Tutto comincia da un forno acceso.",
    immagine: "/chi-siamo/album/fondatori-sfogliatrice.webp",
    alt: "I due fondatori Delsigel sorridono accanto alla sfogliatrice del laboratorio",
    posizione: "52% 62%",
    colore: "#f76f0b",
  },
  {
    id: "unione",
    numero: "02",
    titolo: "L'unione",
    sottotitolo: "Del Monte e Siani",
    etichetta: ["L'unione", "Del Monte e Siani"],
    descrizione:
      "Due storie, una visione. L'unione che ha dato forma a un nuovo inizio.",
    frase: "Due nomi, un solo laboratorio.",
    immagine: "/chi-siamo/album/abbraccio-fondatori.webp",
    alt: "I due fondatori Delsigel si abbracciano tra i carrelli dei vassoi in laboratorio",
    posizione: "50% 46%",
    colore: "#a05cd5",
  },
  {
    id: "artigianalita",
    numero: "03",
    titolo: "Artigianalità",
    sottotitolo: "e ricette",
    etichetta: ["Artigianalità", "e ricette"],
    descrizione:
      "Mani esperte, ingredienti selezionati, ricette che raccontano la nostra terra e il nostro tempo.",
    frase: "Il gesto non si automatizza.",
    immagine: "/chi-siamo/album/linea-sfoglia-mani.webp",
    alt: "Le mani di due pasticceri Delsigel formano la pasta sfoglia sul banco infarinato",
    posizione: "50% 58%",
    colore: "#e8442e",
  },
  {
    id: "crescita",
    numero: "04",
    titolo: "Crescita",
    sottotitolo: "e innovazione",
    etichetta: ["Crescita", "e innovazione"],
    descrizione:
      "Investiamo in tecnologia e persone, mantenendo intatta l'anima artigianale che ci distingue.",
    frase: "Più grandi, mai più veloci del giusto.",
    immagine: "/chi-siamo/album/linea-macchina.webp",
    alt: "Due tecnici Delsigel regolano insieme la macchina della linea di produzione",
    posizione: "50% 20%",
    colore: "#6f7a3a",
  },
  {
    id: "oggi",
    numero: "05",
    titolo: "Oggi",
    sottotitolo: "La squadra",
    etichetta: ["Oggi", "La squadra"],
    descrizione:
      "Siamo una squadra che cresce ogni giorno, con la stessa passione di sempre e lo sguardo rivolto avanti.",
    frase: "Ventuno volti, un solo standard.",
    immagine: "/chi-siamo/album/hero-fritti.webp",
    alt: "Una collega Delsigel sorride accanto ai vassoi dei fritti dolci appena zuccherati",
    posizione: "48% 8%",
    colore: "#eb186b",
  },
  {
    id: "futuro",
    numero: "06",
    titolo: "Il futuro",
    sottotitolo: "Il passaggio alla figlia",
    etichetta: ["Il futuro", "Il passaggio alla figlia"],
    descrizione:
      "La nostra storia continua con una nuova generazione, custode dei valori di ieri e creatrice di domani.",
    frase: "Il forno resta acceso.",
    immagine: "/chi-siamo/album/ufficio-comunicazione.webp",
    alt: "Una giovane collega Delsigel alla scrivania degli uffici, la nuova generazione",
    posizione: "52% 50%",
    colore: "#fbc50a",
  },
];

/**
 * Gli oggetti pop che galleggiano sul palco: ritagli scontornati del
 * catalogo, non icone. Sono quattro e bastano — il mockup li usa come
 * punteggiatura, non come decorazione diffusa. `profondita` decide di
 * quanto si muovono col parallasse: più è alta, più stanno «davanti».
 *
 * `top` e `left` sono in coordinate del palco, non della scena, e stanno
 * tutti sul bordo destro. Due ragioni: la metà sinistra di ogni fascia è
 * il corridoio del testo, e il centro è dove cadono i volti degli
 * scatti — un ritaglio lì sopra non è più punteggiatura, è un ostacolo.
 * Sul bordo invece entrano in campo per metà, che è come stanno nel
 * mockup.
 */
export const OGGETTI_POP: OggettoPop[] = [
  {
    src: "/products/pizzetta-fantasia-olive.webp",
    w: 900,
    h: 760,
    larghezza: 9.5,
    top: "1%",
    left: "78%",
    rotazione: -12,
    profondita: 2.6,
  },
  {
    src: "/products/intriko-pistacchio.webp",
    w: 900,
    h: 680,
    larghezza: 8,
    top: "36%",
    left: "92%",
    rotazione: 9,
    profondita: 3,
  },
  {
    src: "/products/klejner.webp",
    w: 900,
    h: 750,
    larghezza: 7,
    top: "68%",
    left: "86%",
    rotazione: 16,
    profondita: 1.4,
  },
  {
    src: "/products/stella-crema.webp",
    w: 900,
    h: 848,
    larghezza: 6.5,
    top: "90%",
    left: "66%",
    rotazione: -8,
    profondita: 2,
  },
];

/** L'intestazione della scena: la parte che non cambia con lo scroll.
 *  L'eyebrow non dice più «Chi siamo» — la scena sta in homepage — e il
 *  CTA della squadra porta alla pagina delle persone, non a un'ancora
 *  locale che qui non esiste più. */
export const INTESTAZIONE = {
  eyebrow: "Delsigel · dal 2011",
  titolo: ["La nostra", "storia"],
  sottotitolo: "Un viaggio immersivo tra memoria, passione e innovazione.",
  testo: [
    "Scorri la storia come se fosse un racconto.",
    "Ogni tappa è un'emozione, ogni cambio di prospettiva è ciò che ci ha portati fin qui.",
  ],
  invito: "Scorri per vivere il viaggio",
  azione: { testo: "Conosci la squadra", href: "/chi-siamo#squadra" },
};

/** La chiusura: si apre sull'ultima tappa e introduce «La squadra». */
export const FINALE = {
  eyebrow: "La storia continua",
  frase: ["Cambiano le mani.", "Non cambia la cura."],
  coda: "Dal 2011, a Sermoneta.",
};
