/**
 * Manifest varianti: una riga per immagine da generare.
 *
 *  slug     → public/products/<slug>.webp
 *  subject  → descrizione letterale del prodotto, dettata dalle foto: è la
 *             parte del prompt che tiene Kling ancorato al prodotto vero
 *  angle    → 'tre-quarti' (lievitati alti), 'alto' (prodotti piatti, la
 *             sagoma è l'identità), 'spaccato' (frontale, si legge il ripieno)
 *  pass     → 1 = una variante per tipologia, così ogni card ha la sua foto
 *             prima che i crediti finiscano; 2 = il resto della gamma
 *  done     → già generata in fase pilota, non va rifatta
 */
export const VARIANTS = [
  // ============================ DOLCI ============================
  {
    slug: "bomba-fritta-crema", tipologia: "bomba-fritta", variante: "crema",
    angle: "tre-quarti", pass: 1,
    dir: "DOLCI/BOMBA FRITTA/BOMBA FRITTA CON CREMA /BOMBA FRITTA CON CREMA - CHIUSA",
    subject: "a round Italian fried doughnut (bombolone), its whole surface coated in coarse granulated sugar, with one small round filling hole on top; no glaze, no icing sugar, no decoration",
  },
  {
    slug: "bomba-fritta-crema-spaccato", tipologia: "bomba-fritta", variante: "crema",
    vista: "spaccato", angle: "spaccato", pass: 2,
    dir: "DOLCI/BOMBA FRITTA/BOMBA FRITTA CON CREMA /BOMBA FRITTA CON CREMA - APERTA",
    subject: "a round sugar-coated fried doughnut cut cleanly in half, the two halves standing upright side by side with the cut faces towards the camera, showing a generous pale-yellow vanilla custard filling inside the airy white crumb",
  },
  {
    slug: "bomba-fritta-semplice", tipologia: "bomba-fritta", variante: "semplice",
    angle: "tre-quarti", pass: 2,
    dir: "DOLCI/BOMBA FRITTA/BOMBA FRITTA SEMPLICE/BOMBA FRITTA SEMPLICE - CHIUSA",
    subject: "a round Italian fried doughnut (bombolone) coated all over in coarse granulated sugar, completely plain: no filling hole, no glaze, no icing sugar, no decoration",
  },
  {
    slug: "bomba-fritta-semplice-spaccato", tipologia: "bomba-fritta", variante: "semplice",
    vista: "spaccato", angle: "spaccato", pass: 2,
    dir: "DOLCI/BOMBA FRITTA/BOMBA FRITTA SEMPLICE/BOMBA FRITTA SEMPLICE - APERTA",
    subject: "a round sugar-coated fried doughnut cut cleanly in half, the two halves standing upright side by side with the cut faces towards the camera, showing the plain airy white crumb with no filling at all",
  },
  {
    slug: "cuore-cioccolato", tipologia: "cuore", variante: "cioccolato",
    angle: "alto", pass: 2, dir: "DOLCI/CUORE/CUORE AL CIOCCOLATO",
    subject: "a heart-shaped fried pastry, flat and low, dusted with icing sugar, with a piped swirl of glossy chocolate hazelnut cream in a well at the centre and one single fresh raspberry resting on the swirl",
  },
  {
    slug: "cuore-pistacchio", tipologia: "cuore", variante: "pistacchio",
    angle: "alto", pass: 1, dir: "DOLCI/CUORE/CUORE AL PISTACCHIO",
    subject: "a heart-shaped fried pastry, flat and low, dusted with icing sugar, with a piped swirl of pale green pistachio cream in a well at the centre and one single fresh raspberry resting on the swirl",
  },
  {
    slug: "cuore-marmellata", tipologia: "cuore", variante: "marmellata",
    angle: "alto", pass: 2, dir: "DOLCI/CUORE/CUORE ALLA MARMELLATA",
    subject: "a heart-shaped fried pastry, flat and low, dusted with icing sugar, with a well at the centre filled with glossy dark red berry jam and a few whole redcurrants on top",
  },
  {
    slug: "cuore-crema", tipologia: "cuore", variante: "crema",
    angle: "alto", pass: 2, dir: "DOLCI/CUORE/CUORE CON LA CREMA",
    subject: "a heart-shaped fried pastry, flat and low, dusted with icing sugar, with a well at the centre filled with pale yellow vanilla custard and one slice of fresh strawberry standing on it",
  },
  {
    slug: "cuore-semplice", tipologia: "cuore", variante: "semplice",
    angle: "alto", pass: 2, dir: "DOLCI/CUORE/CUORE SEMPLICE",
    subject: "a plain heart-shaped fried pastry, deep golden-orange, completely bare: no icing sugar, no cream, no fruit, with a small heart-shaped imprint pressed into the centre",
  },
  {
    slug: "frittella-cioccolato", tipologia: "frittella", variante: "cioccolato",
    angle: "tre-quarti", pass: 2, dir: "DOLCI/FRITTELLA/FRITTELLA CIOCCOLATO",
    subject: "a small round fried doughnut coated in granulated sugar, with a piped swirl of glossy chocolate hazelnut cream sitting in a well at the centre",
  },
  {
    slug: "frittella-crema", tipologia: "frittella", variante: "crema",
    angle: "tre-quarti", pass: 1, dir: "DOLCI/FRITTELLA/FRITTELLA CREMA",
    subject: "a small round fried doughnut coated in granulated sugar, with a piped swirl of pale yellow vanilla custard sitting in a well at the centre",
  },
  {
    slug: "golosone-cioccolato-granella", tipologia: "golosone", variante: "cioccolato+granella",
    angle: "tre-quarti", pass: 2,
    dir: "DOLCI/GOLOSONE/GOLOSONE CON CIOCCOLATO/GOLOSONE AL CIOCCOLATO - CON GRANELLA",
    subject: "a round flat filled bun with a smooth satin apricot-gold glazed top scattered with dark chocolate granules, the dark chocolate filling showing as a line along the seam between the two halves",
  },
  {
    slug: "golosone-cioccolato-semplice", tipologia: "golosone", variante: "cioccolato+semplice",
    angle: "tre-quarti", pass: 2,
    dir: "DOLCI/GOLOSONE/GOLOSONE CON CIOCCOLATO/GOLOSONE CIOCCOLATO - SEMPLICE",
    subject: "a round flat filled bun with a smooth satin apricot-gold glazed top, completely bare with no granules or decoration, the dark chocolate filling showing as a line along the seam between the two halves",
  },
  {
    slug: "golosone-cioccolato-spaccato", tipologia: "golosone", variante: "cioccolato",
    vista: "spaccato", angle: "spaccato", pass: 2,
    dir: "DOLCI/GOLOSONE/GOLOSONE CON CIOCCOLATO/GOLOSONE CON CIOCCOLATO - APERTO",
    subject: "a round glazed bun topped with dark chocolate granules, cut in half, the two halves standing upright side by side with the cut faces to the camera, showing a thick marbled chocolate filling swirled through the pale crumb",
  },
  {
    slug: "golosone-crema-granella", tipologia: "golosone", variante: "crema+granella",
    angle: "tre-quarti", pass: 1,
    dir: "DOLCI/GOLOSONE/GOLOSONE CON CREMA/GOLOSONE CON CREMA - GRANELLA",
    subject: "a round flat filled bun with a smooth satin apricot-gold glazed top scattered with white pearl sugar grains, the pale custard filling showing along the seam between the two halves",
  },
  {
    slug: "golosone-crema-semplice", tipologia: "golosone", variante: "crema+semplice",
    angle: "tre-quarti", pass: 2,
    dir: "DOLCI/GOLOSONE/GOLOSONE CON CREMA/GOLOSONE CON CREMA - SEMPLICE",
    subject: "a round flat filled bun with a smooth satin apricot-gold glazed top, completely bare with no grains or decoration, the pale custard filling showing along the seam between the two halves",
  },
  {
    slug: "golosone-crema-spaccato", tipologia: "golosone", variante: "crema",
    vista: "spaccato", angle: "spaccato", pass: 2,
    dir: "DOLCI/GOLOSONE/GOLOSONE CON CREMA/GOLOSONE CON CREMA - APERTO",
    subject: "a round glazed bun topped with white pearl sugar grains, cut in half, the two halves standing upright side by side with the cut faces to the camera, showing a thick pale yellow custard filling in the crumb",
  },
  {
    slug: "intriko-cioccolato", tipologia: "intriko", variante: "cioccolato",
    angle: "tre-quarti", pass: 2, dir: "DOLCI/INTRIKO/INTRIKO - CIOCCOLATO",
    subject: "an elongated twisted rope of golden baked dough, dusted with fine sugar, with a dark chocolate filling visible as a spiral line running along the twist",
  },
  {
    slug: "intriko-frutti-di-bosco", tipologia: "intriko", variante: "frutti di bosco",
    angle: "tre-quarti", pass: 2, dir: "DOLCI/INTRIKO/INTRIKO - FRUTTI DI BOSCO",
    subject: "an elongated twisted rope of golden baked dough with a red berry filling visible as a spiral line along the twist and scattered red berry specks on the surface",
  },
  {
    slug: "intriko-pistacchio", tipologia: "intriko", variante: "pistacchio",
    angle: "tre-quarti", pass: 1, dir: "DOLCI/INTRIKO/INTRIKO - PISTACCHIO",
    subject: "an elongated twisted rope of pale golden baked dough with a green pistachio filling visible as a spiral line running along the twist",
  },
  {
    slug: "intriko-tre-cioccolati", tipologia: "intriko", variante: "tre cioccolati",
    angle: "tre-quarti", pass: 2, dir: "DOLCI/INTRIKO/INTRIKO - TRE CIOCCOLATI",
    subject: "an elongated twisted rope of baked dough glazed and scattered with dark chocolate chips and white chocolate flakes, with chocolate filling in the twist",
  },
  {
    slug: "intriko-vuoto", tipologia: "intriko", variante: "vuoto",
    angle: "tre-quarti", pass: 2, dir: "DOLCI/INTRIKO/INTRIKO VUOTO",
    subject: "an elongated twisted rope of plain golden baked dough, completely unfilled and undecorated, showing only the folds of the twist",
  },
  {
    slug: "klejner", tipologia: "klejner", variante: null,
    angle: "alto", pass: 1, dir: "DOLCI/KLEJNER",
    subject: "a traditional Nordic klejner: a small rectangle of fried dough knotted through a slit in its middle, pale golden, with no topping, no sugar and no filling",
  },
  {
    slug: "lusekatt", tipologia: "lusekatt", variante: null,
    angle: "alto", pass: 1, dir: "DOLCI/LUSEKATT",
    subject: "a Nordic saffron bun shaped like a figure of eight with two coiled spirals, deep golden-orange saffron crumb, with dark raisins nestled in the centre of each coil and white pearl sugar scattered on top",
  },
  {
    slug: "nuvola-cioccolato", tipologia: "nuvola", variante: "cioccolato",
    angle: "tre-quarti", pass: 2, dir: "DOLCI/NUVOLA/NUVOLA CON CIOCCOLATO",
    subject: "a round flat filled doughnut with a wide shallow well in the centre, dusted with icing sugar, with a piped swirl of glossy chocolate hazelnut cream in the well and one fresh raspberry on top",
  },
  {
    slug: "nuvola-crema", tipologia: "nuvola", variante: "crema",
    angle: "tre-quarti", pass: 2, dir: "DOLCI/NUVOLA/NUVOLA CON CREMA",
    subject: "a round flat filled doughnut with a wide shallow well in the centre, dusted with icing sugar, with pale yellow vanilla custard in the well and one slice of fresh strawberry standing on it",
  },
  {
    slug: "nuvola-marmellata", tipologia: "nuvola", variante: "marmellata",
    angle: "tre-quarti", pass: 2, dir: "DOLCI/NUVOLA/NUVOLA CON MARMELLATA",
    subject: "a round flat filled doughnut with a wide shallow well in the centre, dusted with icing sugar, the well filled with glossy dark red berry jam and a few whole redcurrants on top",
  },
  {
    slug: "nuvola-pistacchio", tipologia: "nuvola", variante: "pistacchio",
    angle: "tre-quarti", pass: 1, dir: "DOLCI/NUVOLA/NUVOLA CON PISTACCHIO",
    subject: "a round flat filled doughnut with a wide shallow well in the centre, dusted with icing sugar, with a piped swirl of pale green pistachio cream in the well and one fresh raspberry on top",
  },
  {
    slug: "nuvola-semplice", tipologia: "nuvola", variante: "semplice",
    angle: "tre-quarti", pass: 2, dir: "DOLCI/NUVOLA/NUVOLA SEMPLICE",
    subject: "a plain round fried doughnut with a wide shallow well in the centre, deep golden-orange, completely bare: no icing sugar, no cream, no fruit, no filling",
  },
  {
    slug: "stella-cioccolato", tipologia: "stella", variante: "cioccolato",
    angle: "alto", pass: 2, dir: "DOLCI/STELLA/STELLA CON CIOCCOLATO",
    subject: "a five-pointed star-shaped fried pastry, flat and low with sharp defined points, dusted with icing sugar, with a piped swirl of chocolate hazelnut cream in the centre and one fresh raspberry on top",
  },
  {
    slug: "stella-crema", tipologia: "stella", variante: "crema",
    angle: "alto", pass: 2, dir: "DOLCI/STELLA/STELLA CON CREMA",
    subject: "a five-pointed star-shaped fried pastry, flat and low with sharp defined points, dusted with icing sugar, with pale yellow vanilla custard in the centre and one slice of fresh strawberry standing on it",
  },
  {
    slug: "stella-marmellata", tipologia: "stella", variante: "marmellata",
    angle: "alto", pass: 2, dir: "DOLCI/STELLA/STELLA CON MARMELLATA",
    subject: "a five-pointed star-shaped fried pastry, flat and low with sharp defined points, dusted with icing sugar, with glossy dark red berry jam in the centre well and a few whole redcurrants on top",
  },
  {
    slug: "stella-pistacchio", tipologia: "stella", variante: "pistacchio",
    angle: "alto", pass: 1, done: "v2-flash", dir: "DOLCI/STELLA/STELLA CON PISTACCHIO",
    subject: "a five-pointed star-shaped fried pastry, flat and low with sharp defined points, dusted with icing sugar, with a piped swirl of pale green pistachio cream in the centre and one fresh raspberry on top",
  },
  {
    slug: "stella-semplice", tipologia: "stella", variante: "semplice",
    angle: "alto", pass: 2, dir: "DOLCI/STELLA/STELLA SEMPLICE",
    subject: "a plain five-pointed star-shaped fried pastry, deep golden-orange, completely bare with no sugar and no filling, with a round pale imprint in the centre",
  },

  // =========================== SALATI ============================
  {
    slug: "focaccina-bianca", tipologia: "focaccine-miste-tre-gusti", variante: "bianca",
    angle: "tre-quarti", pass: 2, dir: "SALATI/FOCACCINE MISTE TRE GUSTI/FOCACCINA BIANCA",
    subject: "two small round flat focaccia buns with plain pale wheat crust: one lying flat and one cut in half leaning against it so the white airy crumb of the cut face is visible",
  },
  {
    slug: "focaccina-curcuma", tipologia: "focaccine-miste-tre-gusti", variante: "curcuma",
    angle: "tre-quarti", pass: 1, dir: "SALATI/FOCACCINE MISTE TRE GUSTI/FOCACCINA CURCUMA",
    subject: "two small round flat focaccia buns of vivid turmeric-yellow dough: one lying flat and one cut in half leaning against it so the yellow airy crumb of the cut face is visible",
  },
  {
    slug: "focaccina-pomodoro", tipologia: "focaccine-miste-tre-gusti", variante: "pomodoro",
    angle: "tre-quarti", pass: 2, dir: "SALATI/FOCACCINE MISTE TRE GUSTI/FOCACCINA POMODORO",
    subject: "two small round flat focaccia buns of orange tomato dough: one lying flat and one cut in half leaning against it so the orange airy crumb of the cut face is visible",
  },
  {
    slug: "montanarina-mozzarella", tipologia: "montanarina", variante: "mozzarella",
    angle: "alto", pass: 2, dir: "SALATI/MONTANARINA /MONTANARINA CON MOZZARELLA",
    subject: "a small round Neapolitan fried pizza base, puffy and pale golden, topped in the centre with a spoonful of tomato sauce and a few strips of white mozzarella",
  },
  {
    slug: "montanarina-pomodoro", tipologia: "montanarina", variante: "pomodoro",
    angle: "alto", pass: 1, dir: "SALATI/MONTANARINA /MONTANARINA CON POMODORO",
    subject: "a small round Neapolitan fried pizza base, puffy and pale golden, topped in the centre with a single spoonful of tomato sauce and nothing else",
  },
  {
    slug: "paninetto-bianco", tipologia: "paninetto-colorato-tre-gusti", variante: "bianco",
    angle: "tre-quarti", pass: 2, dir: "SALATI/PANINETTO COLORATO TRE GUSTI/PANINETTO COLORATO BIANCO",
    subject: "a small dome-shaped bread roll with a smooth pale golden crust, plain and undecorated",
  },
  {
    slug: "paninetto-curcuma", tipologia: "paninetto-colorato-tre-gusti", variante: "curcuma",
    angle: "tre-quarti", pass: 1, dir: "SALATI/PANINETTO COLORATO TRE GUSTI/PANINETTO COLORATO CURCUMA",
    subject: "a small dome-shaped bread roll with a smooth vivid turmeric-yellow crust, plain and undecorated",
  },
  {
    slug: "paninetto-pomodoro", tipologia: "paninetto-colorato-tre-gusti", variante: "pomodoro",
    angle: "tre-quarti", pass: 2, dir: "SALATI/PANINETTO COLORATO TRE GUSTI/PANINETTO AL POMODORO",
    subject: "a small dome-shaped bread roll with a smooth warm orange tomato-dough crust, plain and undecorated",
  },
  {
    slug: "pizzetta-al-pomodoro", tipologia: "pizzetta-al-pomodoro", variante: null,
    angle: "alto", pass: 1, done: "pilot-pizzetta", dir: "SALATI/PIZZETTA AL POMODORO",
    subject: "a small round puff-pastry pizzetta with golden flaky layered edges and a spoonful of tomato sauce in the centre",
  },
  {
    slug: "pizzetta-bianca", tipologia: "pizzetta-bianca", variante: null,
    angle: "alto", pass: 1, dir: "SALATI/PIZZETTA BIANCA",
    subject: "a small oval flat white pizza base, pale and barely coloured, with a blistered bubbly surface, brushed with oil, with no tomato and no topping at all",
  },
  {
    slug: "pizzetta-fritta-piccola", tipologia: "pizzetta-fritta", variante: "piccola",
    angle: "alto", pass: 2, dir: "SALATI/PIZZETTA FRITTA/PIZZETTA FRITTA PICCOLA",
    subject: "a very small round fried pizza base, pale golden and puffy, with a single small round spoonful of tomato sauce in the centre",
  },
  {
    slug: "pizzetta-fritta-media", tipologia: "pizzetta-fritta", variante: "media",
    angle: "alto", pass: 1, dir: "SALATI/PIZZETTA FRITTA/PIZZETTA PICCOLA MEDIA",
    subject: "a small round fried pizza base, pale golden and puffy, with a round spoonful of tomato sauce in the centre",
  },
  {
    slug: "pizzetta-fantasia-funghi", tipologia: "pizzette-fantasia", variante: "funghi",
    angle: "alto", pass: 2, dir: "SALATI/PIZZETTE FANTASIA/PIZZETTA FANTASIA FUNGHI",
    subject: "a small round puff-pastry pizzetta with a golden flaky raised rim, topped with tomato sauce and sliced mushrooms",
  },
  {
    slug: "pizzetta-fantasia-olive", tipologia: "pizzette-fantasia", variante: "olive",
    angle: "alto", pass: 2, dir: "SALATI/PIZZETTE FANTASIA/PIZZETTA FANTASIA OLIVE",
    subject: "a small round puff-pastry pizzetta with a golden flaky raised rim, topped with tomato sauce and whole green olives",
  },
  {
    slug: "pizzetta-fantasia-verdure", tipologia: "pizzette-fantasia", variante: "verdure",
    angle: "alto", pass: 2, dir: "SALATI/PIZZETTE FANTASIA/PIZZETTA FANTASIA VERDURE",
    subject: "a small round puff-pastry pizzetta with a golden flaky raised rim, topped with tomato sauce and diced mixed vegetables including red pepper, yellow pepper and capers",
  },
  {
    slug: "pizzetta-fantasia-wurstel", tipologia: "pizzette-fantasia", variante: "wurstel",
    angle: "alto", pass: 1, dir: "SALATI/PIZZETTE FANTASIA/PIZZETTA FANTASIA WURSTEL",
    subject: "a small round puff-pastry pizzetta with a golden flaky raised rim, topped with tomato sauce and slices of frankfurter sausage",
  },
  {
    slug: "rustico-4-formaggi", tipologia: "rustici", variante: "4 formaggi",
    angle: "tre-quarti", pass: 2, dir: "SALATI/RUSTICI/RUSTICO AI 4 FORMAGGI",
    subject: "a small rectangular puff-pastry parcel, pale golden with flaky layers, with pale melted cheese filling just visible at the open ends",
  },
  {
    slug: "rustico-funghi", tipologia: "rustici", variante: "funghi",
    angle: "tre-quarti", pass: 2, dir: "SALATI/RUSTICI/RUSTICO CON I FUNGHI",
    subject: "a small rectangular puff-pastry parcel, golden with flaky layers, with a brown mushroom filling visible at the open ends",
  },
  {
    slug: "rustico-peperoni", tipologia: "rustici", variante: "peperoni",
    angle: "tre-quarti", pass: 2, dir: "SALATI/RUSTICI/RUSTICO CON I PEPERONI",
    subject: "a small rectangular puff-pastry parcel, golden with flaky layers, with an orange-red pepper filling visible at the open ends",
  },
  {
    slug: "rustico-pizzaiola", tipologia: "rustici", variante: "pizzaiola",
    angle: "tre-quarti", pass: 2, dir: "SALATI/RUSTICI/RUSTICO CON PIZZAIOLA",
    subject: "a small rectangular puff-pastry parcel, golden with flaky layers, with a red tomato pizzaiola filling visible at the open ends",
  },
  {
    slug: "rustico-ricotta-e-spinaci", tipologia: "rustici", variante: "ricotta e spinaci",
    angle: "tre-quarti", pass: 2, dir: "SALATI/RUSTICI/RUSTICO CON RICOTTA E SPINACI",
    subject: "a small rectangular puff-pastry parcel, golden with flaky layers, with a green spinach and white ricotta filling visible at the open ends",
  },
  {
    slug: "rustico-wurstel", tipologia: "rustici", variante: "wurstel",
    angle: "tre-quarti", pass: 1, dir: "SALATI/RUSTICI/RUSTICO CON WURSTEL",
    subject: "a small puff-pastry roll wrapped around a frankfurter sausage, the round cut end of the sausage showing at the open end of the golden flaky pastry",
  },
  {
    slug: "vol-au-vent", tipologia: "vol-au-vent", variante: null,
    angle: "tre-quarti", pass: 1, dir: "SALATI/VOL AU VENT",
    subject: "an empty round puff-pastry vol-au-vent case, pale golden with a raised rim and a small round well in the centre, unfilled",
  },
];

/** ordine di lavorazione: prima una variante per tipologia, poi la gamma */
export const QUEUE = [...VARIANTS]
  .filter((v) => !v.done)
  .sort((a, b) => a.pass - b.pass);
