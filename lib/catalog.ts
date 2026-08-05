/**
 * Catalogo 2026/2027 — modello UI derivato dall'albero prodotti
 * (albero_prodotti_delsigel.html → assets/catalog/manifest.json).
 *
 * Semantica (decisa in sessione, 23/07):
 *  - le foglie "APERTA/APERTO/CHIUSA" dell'albero NON sono prodotti: sono
 *    viste fotografiche → `views` ("spaccato" = il dolce aperto a metà);
 *  - i "TRE GUSTI" (focaccine, paninetto) sono venduti come set → `set`,
 *    la card usa lo scatto di gruppo, i gusti sono contenuto non selettore;
 *  - tutto il resto è gamma vera → `axes` (gusto / farcitura / finitura /
 *    formato), che la card mostra come pallini colorati.
 *
 * `image` = still generato (public/products/<slug>.webp): finché è assente
 * la card mostra il placeholder 2D.
 *
 * Gli still sono relight Kling degli scatti in public/DOLCI e public/SALATI,
 * scontornati su trasparente: sulla card il dolce galleggia sopra la
 * campitura d'accento, come il ritaglio del film. `variants` mappa il valore
 * di un asse al suo scatto, così passando sui pallini la card cambia foto.
 */

export type Axis = { label: string; values: string[] };

export type Tipologia = {
  code: string;
  name: string;
  macro: "dolci" | "salati";
  slug: string;
  note?: string;
  price?: string;
  axes?: Axis[];
  set?: string[];
  views?: "spaccato"[];
  /** still generato, quando esiste; altrimenti placeholder */
  image?: string;
  /** valore d'asse → still: la card lo mostra al passaggio sul pallino */
  variants?: Record<string, string>;
  /** still del prodotto aperto, per le tipologie con `views: ["spaccato"]` */
  spaccato?: string;
};

/** tutti gli still stanno in public/products/<slug>.webp */
const img = (slug: string) => `/products/${slug}.webp`;

export const CATALOG: Tipologia[] = [
  // ------------------------------- DOLCI --------------------------------
  {
    code: "N.01",
    name: "Golosone",
    macro: "dolci",
    slug: "golosone",
    note: "Lievitato farcito, glassa satinata e granella fondente.",
    price: "€ 6",
    axes: [
      { label: "Farcitura", values: ["cioccolato", "crema"] },
      { label: "Finitura", values: ["granella", "semplice"] },
    ],
    views: ["spaccato"],
    image: img("golosone-crema-granella"),
    variants: {
      cioccolato: img("golosone-cioccolato-granella"),
      crema: img("golosone-crema-granella"),
      granella: img("golosone-crema-granella"),
      semplice: img("golosone-crema-semplice"),
    },
    spaccato: img("golosone-crema-spaccato"),
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
    name: "Frittella",
    macro: "dolci",
    slug: "frittella",
    note: "Il fritto morbido da banco, in due gusti.",
    axes: [{ label: "Gusto", values: ["cioccolato", "crema"] }],
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
    note: "Treccia di sfoglia farcita, quattro varianti più la versione vuota.",
    axes: [
      {
        label: "Gusto",
        values: [
          "cioccolato",
          "frutti di bosco",
          "pistacchio",
          "tre cioccolati",
          "vuoto",
        ],
      },
    ],
    image: img("intriko-pistacchio"),
    variants: {
      cioccolato: img("intriko-cioccolato"),
      "frutti di bosco": img("intriko-frutti-di-bosco"),
      pistacchio: img("intriko-pistacchio"),
      "tre cioccolati": img("intriko-tre-cioccolati"),
      vuoto: img("intriko-vuoto"),
    },
  },
  {
    code: "N.06",
    name: "Lusekatt",
    macro: "dolci",
    slug: "lusekatt",
    note: "La girella nordica allo zafferano.",
    image: img("lusekatt"),
  },
  {
    code: "N.07",
    name: "Nuvola",
    macro: "dolci",
    slug: "nuvola",
    note: "Il lievitato più leggero della gamma, cinque gusti.",
    axes: [
      {
        label: "Gusto",
        values: ["cioccolato", "crema", "marmellata", "pistacchio", "semplice"],
      },
    ],
    image: img("nuvola-pistacchio"),
    variants: {
      cioccolato: img("nuvola-cioccolato"),
      crema: img("nuvola-crema"),
      marmellata: img("nuvola-marmellata"),
      pistacchio: img("nuvola-pistacchio"),
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
    note: "Il nodo fritto della tradizione nordica, senza farcitura.",
    image: img("klejner"),
  },
  // ------------------------------- SALATI -------------------------------
  {
    code: "N.09",
    name: "Focaccine Miste",
    macro: "salati",
    slug: "focaccine-miste-tre-gusti",
    note: "Set da tre gusti, pronto per il banco.",
    set: ["bianca", "curcuma", "pomodoro"],
    image: img("focaccina-curcuma"),
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
    note: "La base fritta napoletana, due condimenti.",
    axes: [{ label: "Gusto", values: ["mozzarella", "pomodoro"] }],
    image: img("montanarina-pomodoro"),
    variants: {
      mozzarella: img("montanarina-mozzarella"),
      pomodoro: img("montanarina-pomodoro"),
    },
  },
  {
    code: "N.11",
    name: "Paninetto Colorato",
    macro: "salati",
    slug: "paninetto-colorato-tre-gusti",
    note: "Tre impasti colorati, un unico formato.",
    set: ["bianco", "curcuma", "pomodoro"],
    image: img("paninetto-curcuma"),
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
    note: "Il formato classico da rosticceria.",
    image: img("pizzetta-al-pomodoro"),
  },
  {
    code: "N.13",
    name: "Pizzetta Bianca",
    macro: "salati",
    slug: "pizzetta-bianca",
    note: "Olio e sale, formato classico.",
    image: img("pizzetta-bianca"),
  },
  {
    code: "N.14",
    name: "Pizzetta Fritta",
    macro: "salati",
    slug: "pizzetta-fritta",
    note: "Due formati per il banco caldo.",
    axes: [{ label: "Formato", values: ["piccola", "media"] }],
    // la piccola è identica alla media a meno del diametro: stesso scatto
    image: img("pizzetta-fritta-media"),
  },
  {
    code: "N.15",
    name: "Pizzette Fantasia",
    macro: "salati",
    slug: "pizzette-fantasia",
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
    image: img("rustico-wurstel"),
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
    code: "N.17",
    name: "Vol-au-vent",
    macro: "salati",
    slug: "vol-au-vent",
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
  semplice: "#fff4e6",
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
