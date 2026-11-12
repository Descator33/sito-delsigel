/**
 * Catalogo 2026/2027 — modello UI derivato dall'albero prodotti
 * (albero_prodotti_delsigel.html → assets/catalog/manifest.json).
 *
 * Semantica (decisa in sessione, 23/07):
 *  - le foglie "APERTA/APERTO/CHIUSA" dell'albero NON sono prodotti: sono
 *    viste fotografiche → `views` ("spaccato" = il dolce aperto a metà);
 *  - i "TRE GUSTI" (focaccine, paninetto) sono venduti come set → `set`,
 *    mentre i singoli gusti restano sfogliabili nella scheda;
 *  - tutto il resto è gamma vera → `axes` (gusto / farcitura / finitura /
 *    formato), che la card mostra come pallini colorati.
 *
 * `image` = still 4K scontornato (public/products-4k/<slug>.webp): finché è assente
 * la card mostra il placeholder 2D.
 *
 * Gli still derivano pixel per pixel dalle foto definitive e hanno fondo
 * trasparente: sulla card il prodotto galleggia sopra la campitura d'accento.
 * `variants` mappa il valore di un asse al suo scatto, così passando sui
 * pallini la card cambia foto.
 */

export type Axis = { label: string; values: string[] };

export type Tipologia = {
  code: string;
  name: string;
  macro: "dolci" | "salati";
  slug: string;
  note?: string;
  price?: string;
  /** Peso unitario in grammi, quando dichiarato nel listino. */
  pesoGr?: number;
  /** Peso unitario delle singole varianti, in grammi. */
  pesiVariantiGr?: Record<string, number>;
  dimensioniCm?: number[];
  dimensioniVariantiCm?: Record<string, number[]>;
  /** Formati dichiarati a peso: i pezzi si stimano dal peso unitario. */
  cartoniKg?: number[];
  pezziPerCartone?: number;
  pezziPerCartoneVarianti?: Record<string, number>;
  axes?: Axis[];
  set?: string[];
  views?: "spaccato"[];
  /** usa la gamma fotografica dichiarata qui anche quando esiste una base
   * tecnica nel configuratore (serve per varianti di catalogo più ampie). */
  catalogGamma?: boolean;
  /** still scontornato, quando esiste; altrimenti placeholder */
  image?: string;
  /** still compatto per la tessera; la scheda può usare una composizione
   * di gruppo più larga senza rimpicciolire il prodotto nel carosello. */
  cardImage?: string;
  /** valore d'asse → still: la card lo mostra al passaggio sul pallino */
  variants?: Record<string, string>;
  /** still del prodotto aperto, per le tipologie con `views: ["spaccato"]` */
  spaccato?: string;
  /** variante selezionata → still aperto; evita di mostrare lo spaccato
   * della crema quando l'utente sta guardando cioccolato o semplice. */
  spaccati?: Record<string, string>;
};

/**
 * Tutti gli still stanno in public/products-4k/<slug>.webp. La revisione forza
 * browser e ottimizzatore Next a non riutilizzare le vecchie sagome in cache
 * quando i file vengono sostituiti mantenendo lo stesso nome.
 */
const PRODUCT_IMAGE_REVISION = "2026-10-29-intriko-alpha-1";
const img = (slug: string) =>
  `/products-4k/${slug}.webp?v=${PRODUCT_IMAGE_REVISION}`;

export const CATALOG: Tipologia[] = [
  // ------------------------------- DOLCI --------------------------------
  {
    code: "N.01",
    name: "Golosone",
    macro: "dolci",
    slug: "golosone",
    note: "Lievitato farcito, glassa satinata e granella fondente.",
    price: "€ 6",
    axes: [{
      label: "Variante",
      values: [
        "cioccolato con granella",
        "cioccolato semplice",
        "crema con granella",
        "crema semplice",
      ],
    }],
    catalogGamma: true,
    views: ["spaccato"],
    image: img("golosone-crema-granella"),
    variants: {
      "cioccolato con granella": img("golosone-cioccolato-granella"),
      "cioccolato semplice": img("golosone-cioccolato-semplice"),
      "crema con granella": img("golosone-crema-granella"),
      "crema semplice": img("golosone-crema-semplice"),
    },
    spaccato: img("golosone-crema-spaccato"),
    spaccati: {
      "cioccolato con granella": img("golosone-cioccolato-spaccato"),
      "crema con granella": img("golosone-crema-spaccato"),
    },
  },
  {
    code: "N.02",
    name: "Bomba Fritta",
    macro: "dolci",
    slug: "bomba-fritta",
    note: "Il lievitato fritto della tradizione, farcito o semplice.",
    axes: [{ label: "Farcitura", values: ["crema", "semplice"] }],
    views: ["spaccato"],
    image: img("bomba-fritta-crema"),
    variants: {
      crema: img("bomba-fritta-crema"),
      semplice: img("bomba-fritta-semplice"),
    },
    spaccato: img("bomba-fritta-crema-spaccato"),
    spaccati: {
      crema: img("bomba-fritta-crema-spaccato"),
      semplice: img("bomba-fritta-semplice-spaccato"),
    },
  },
  {
    code: "N.03",
    name: "Cuore",
    macro: "dolci",
    slug: "cuore",
    note: "Sfoglia a cuore, cinque farciture a gamma.",
    axes: [
      {
        label: "Gusto",
        values: ["cioccolato", "pistacchio", "marmellata", "crema", "semplice"],
      },
    ],
    image: img("cuore-pistacchio"),
    variants: {
      cioccolato: img("cuore-cioccolato"),
      pistacchio: img("cuore-pistacchio"),
      marmellata: img("cuore-marmellata"),
      crema: img("cuore-crema"),
      semplice: img("cuore-semplice"),
    },
  },
  {
    code: "N.04",
    name: "Mini Nuvola",
    macro: "dolci",
    pesoGr: 28,
    slug: "frittella",
    note: "Il fritto morbido da banco, in due varianti.",
    axes: [{
      label: "Variante",
      values: ["cioccolato", "crema"],
    }],
    catalogGamma: true,
    image: img("frittella-crema"),
    variants: {
      cioccolato: img("frittella-cioccolato"),
      crema: img("frittella-crema"),
    },
  },
  {
    code: "N.05",
    name: "Intriko",
    macro: "dolci",
    slug: "intriko",
    note: "Treccia di sfoglia farcita, cinque varianti più la versione vuota.",
    axes: [
      {
        label: "Gusto",
        values: [
          "cioccolato",
          "crema",
          "frutti di bosco",
          "pistacchio",
          "tre cioccolati",
          "vuoto",
        ],
      },
    ],
    image: img("intriko-tre-cioccolati"),
    variants: {
      cioccolato: img("intriko-cioccolato"),
      crema: img("intriko-crema"),
      "frutti di bosco": img("intriko-frutti-di-bosco"),
      pistacchio: img("intriko-pistacchio"),
      "tre cioccolati": img("intriko-tre-cioccolati"),
      vuoto: img("intriko-vuoto"),
    },
  },
  {
    code: "N.19",
    name: "Intriko Midi",
    macro: "dolci",
    slug: "intriko-midi",
    note: "Intriko in formato midi, sei farciture a gamma.",
    axes: [
      {
        label: "Gusto",
        values: [
          "caramello",
          "cioccolato",
          "crema",
          "pistacchio",
          "frutti di bosco",
          "dulce de leche",
        ],
      },
    ],
    image: img("intriko-midi-cioccolato"),
    variants: {
      caramello: img("intriko-midi-caramello"),
      cioccolato: img("intriko-midi-cioccolato"),
      crema: img("intriko-midi-crema"),
      pistacchio: img("intriko-midi-pistacchio"),
      "frutti di bosco": img("intriko-midi-frutti-rossi"),
      "dulce de leche": img("intriko-midi-dulce-de-leche"),
    },
  },
  {
    code: "N.06",
    name: "Lussekatt",
    macro: "dolci",
    slug: "lusekatt",
    note: "La nostra rivisitazione della girella nordica.",
    image: img("lusekatt"),
  },
  {
    code: "N.07",
    name: "Nuvola",
    macro: "dolci",
    pesiVariantiGr: { cioccolato: 75 },
    slug: "nuvola",
    note: "Il lievitato più leggero della gamma.",
    axes: [
      {
        label: "Gusto",
        values: [
          "cioccolato",
          "crema",
        ],
      },
    ],
    catalogGamma: true,
    image: img("nuvola-crema-semplice"),
    variants: {
      Nuì: img("nuvola-nui"),
      cioccolato: img("nuvola-cioccolato-semplice"),
      "crema e fragola": img("nuvola-crema-e-fragola"),
      crema: img("nuvola-crema-semplice"),
      "frutti rossi": img("nuvola-frutti-rossi"),
      "pistacchio e lampone": img("nuvola-pistacchio-e-lampone"),
      semplice: img("nuvola-semplice"),
    },
  },
  {
    code: "N.08",
    name: "Stella",
    macro: "dolci",
    slug: "stella",
    note: "Sfoglia a stella, cinque varianti.",
    axes: [
      {
        label: "Gusto",
        values: ["cioccolato", "crema", "marmellata", "pistacchio", "semplice"],
      },
    ],
    image: img("stella-pistacchio"),
    variants: {
      cioccolato: img("stella-cioccolato"),
      crema: img("stella-crema"),
      marmellata: img("stella-marmellata"),
      pistacchio: img("stella-pistacchio"),
      semplice: img("stella-semplice"),
    },
  },
  {
    code: "N.18",
    name: "Klejner",
    macro: "dolci",
    slug: "klejner",
    note: "Il nodo fritto della tradizione nordica, semplice o alla cannella.",
    axes: [{ label: "Gusto", values: ["semplice", "cannella"] }],
    image: img("klejner-cannella"),
    variants: {
      semplice: img("klejner"),
      cannella: img("klejner-cannella"),
    },
  },
  // ------------------------------- SALATI -------------------------------
  {
    code: "N.09",
    name: "Focaccine Miste",
    macro: "salati",
    slug: "focaccine-miste-tre-gusti",
    dimensioniCm: [7, 3.5],
    pezziPerCartone: 90,
    pesoGr: 40,
    note: "Set da tre gusti, pronto per il banco.",
    set: ["bianca", "curcuma", "pomodoro"],
    image: img("focaccine-miste-tre-gusti"),
    cardImage: img("focaccina-curcuma"),
    variants: {
      bianca: img("focaccina-bianca"),
      curcuma: img("focaccina-curcuma"),
      pomodoro: img("focaccina-pomodoro"),
    },
  },
  {
    code: "N.10",
    name: "Montanarina",
    macro: "salati",
    slug: "montanarina",
    dimensioniVariantiCm: { classica: [6, 3], "mini montanarina": [5, 3] },
    pezziPerCartoneVarianti: { classica: 80, "mini montanarina": 100 },
    note: "La base fritta napoletana, nei formati classico e mini.",
    axes: [{ label: "Formato", values: ["classica", "mini montanarina"] }],
    pesiVariantiGr: { classica: 30, "mini montanarina": 20 },
    image: img("montanarina-pomodoro"),
    variants: {
      classica: img("montanarina-pomodoro"),
      "mini montanarina": img("montanarina-pomodoro"),
    },
  },
  {
    code: "N.11",
    name: "Paninetto Colorato",
    macro: "salati",
    slug: "paninetto-colorato-tre-gusti",
    dimensioniCm: [4, 3],
    pezziPerCartone: 120,
    pesoGr: 16,
    note: "Tre impasti colorati, un unico formato.",
    set: ["bianco", "curcuma", "pomodoro"],
    image: img("paninetto-colorato-tre-gusti"),
    variants: {
      bianco: img("paninetto-bianco"),
      curcuma: img("paninetto-curcuma"),
      pomodoro: img("paninetto-pomodoro"),
    },
  },
  {
    code: "N.12",
    name: "Pizzetta al Pomodoro",
    macro: "salati",
    slug: "pizzetta-al-pomodoro",
    cartoniKg: [3, 6],
    dimensioniCm: [8],
    pesoGr: 28,
    note: "Il formato classico da rosticceria.",
    image: img("pizzetta-al-pomodoro"),
  },
  {
    code: "N.14",
    name: "Pizzetta Fritta",
    macro: "salati",
    pesoGr: 40,
    slug: "pizzetta-fritta",
    cartoniKg: [3],
    dimensioniCm: [7],
    note: "Soffice e dorata, pronta da gustare.",
    image: img("pizzetta-fritta-piccola"),
  },
  {
    code: "N.15",
    name: "Pizzette Fantasia",
    macro: "salati",
    slug: "pizzette-fantasia",
    cartoniKg: [6],
    dimensioniCm: [8],
    pesoGr: 45,
    note: "Quattro condimenti a rotazione stagionale.",
    axes: [
      { label: "Gusto", values: ["funghi", "olive", "verdure", "wurstel"] },
    ],
    image: img("pizzetta-fantasia-wurstel"),
    variants: {
      funghi: img("pizzetta-fantasia-funghi"),
      olive: img("pizzetta-fantasia-olive"),
      verdure: img("pizzetta-fantasia-verdure"),
      wurstel: img("pizzetta-fantasia-wurstel"),
    },
  },
  {
    code: "N.16",
    name: "Rustici",
    macro: "salati",
    slug: "rustici",
    cartoniKg: [3, 6],
    dimensioniCm: [5, 3],
    pesoGr: 18,
    note: "Sei ripieni su base sfoglia.",
    axes: [
      {
        label: "Gusto",
        values: [
          "4 formaggi",
          "funghi",
          "peperoni",
          "pizzaiola",
          "ricotta e spinaci",
          "wurstel",
        ],
      },
    ],
    image: img("rustici"),
    cardImage: img("rustico-wurstel"),
    variants: {
      "4 formaggi": img("rustico-4-formaggi"),
      funghi: img("rustico-funghi"),
      peperoni: img("rustico-peperoni"),
      pizzaiola: img("rustico-pizzaiola"),
      "ricotta e spinaci": img("rustico-ricotta-e-spinaci"),
      wurstel: img("rustico-wurstel"),
    },
  },
  {
    code: "N.16+1",
    name: "Vol-au-vent",
    macro: "salati",
    slug: "vol-au-vent",
    dimensioniCm: [4, 3],
    pezziPerCartone: 120,
    pesoGr: 16,
    note: "La sfoglia monoporzione da farcire.",
    image: img("vol-au-vent"),
  },
];

/**
 * Le due linee, derivate dall'unica fonte.
 *
 * Rev 05/08 — la home separa i dolci dai salati: la griglia bento mostra
 * solo `DOLCI`, la sezione «I nostri salati» solo `SALATI`. Sono viste su
 * `CATALOG`, non copie: una tipologia si sposta di linea cambiandole
 * `macro` qui sopra, e le due sezioni si aggiornano da sole senza che
 * nessun elenco vada tenuto allineato a mano.
 */
export const DOLCI: Tipologia[] = CATALOG.filter((t) => t.macro === "dolci");
export const SALATI: Tipologia[] = CATALOG.filter((t) => t.macro === "salati");

/**
 * Colore fisso per gusto, identico in tutto il sito: l'asse dei gusti si
 * ripete su mezzo catalogo e l'utente lo impara una volta sola.
 */
const GUSTO_COLORS: Record<string, string> = {
  cioccolato: "#7a4a26",
  "tre cioccolati": "#54301a",
  crema: "#fbc50a",
  pistacchio: "#7fc25b",
  marmellata: "#eb186b",
  "frutti di bosco": "#a05cd5",
  caramello: "#c98b4a",
  "dulce de leche": "#b9783d",
  cannella: "#a56638",
  semplice: "#fff4e6",
  Nuì: "#7a4a26",
  "cioccolato semplice": "#7a4a26",
  "cioccolato con granella": "#54301a",
  "crema semplice": "#fbc50a",
  "crema con granella": "#e7cf93",
  "crema e fragola": "#f29a8a",
  "frutti rossi": "#eb186b",
  "pistacchio e lampone": "#7fc25b",
  "senza zucchero": "#d49b55",
  vuota: "#e4ae69",
  granella: "#54301a",
  // salati
  mozzarella: "#fff4e6",
  pomodoro: "#e8442e",
  bianca: "#fff4e6",
  bianco: "#fff4e6",
  curcuma: "#fbc50a",
  funghi: "#b09070",
  olive: "#7a8c3f",
  verdure: "#7fc25b",
  wurstel: "#d98a66",
  peperoni: "#e8442e",
  pizzaiola: "#e8442e",
  "4 formaggi": "#f6e7c8",
  "ricotta e spinaci": "#7fc25b",
  piccola: "#fff4e6",
  media: "#fbc50a",
};

export function gustoColor(v: string): string {
  return GUSTO_COLORS[v] ?? "#fff4e6";
}
