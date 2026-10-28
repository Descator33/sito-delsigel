import type { IdTappaStoria } from "@/lib/i18n/tipi";

/**
 * Le sei tappe del film scroll-driven «La nostra storia» — la sola
 * STRUTTURA: fotografie, ordine, loghi delle certificazioni. Tutti i
 * testi (titolo, sottotitolo, descrizione, frase, alt) vivono nei
 * dizionari sotto `chiSiamo.storia.tappe`, agganciati per `id`: è ciò
 * che permette alle cinque lingue di raccontare le stesse immagini.
 *
 * Le fotografie originali ricevute per la pagina vivono in public. Lo stesso
 * scatto è usato a ogni breakpoint: l'elemento picture mantiene comunque il
 * reframe con object-cover nella composizione responsive.
 */

export type Certificazione = {
  /** chiave dell'alt nel dizionario (chiSiamo.storia.certificazioni) */
  chiave: "ifs" | "rainforest" | "rspo";
  /** nome dell'ente o dello standard — proprio, uguale in ogni lingua */
  nome: string;
  /** logo ufficiale, in public/brand/certificazioni */
  logo: string;
};

export type TappaStoria = {
  /** ancora, chiave React e chiave dei testi nel dizionario */
  id: IdTappaStoria;
  /** progressivo mostrato nell'indicatore: "01" … "06" */
  numero: string;
  /** immagine editoriale generata, taglio orizzontale */
  immagine: string;
  /** reframe verticale per telefono */
  immagineVertical: string;
  /** loghi ufficiali mostrati sotto il testo della tappa */
  certificazioni?: Certificazione[];
};

const CARTELLA_STORIA =
  "/wetransfer_13-milioni-3-jpg_2026-10-26_1056";

export const IMMAGINI_STORIA = {
  intro: {
    immagine: `${CARTELLA_STORIA}/la nostra storia 2.jpg`,
    immagineVertical: `${CARTELLA_STORIA}/la nostra storia.jpg`,
  },
  titolo: {
    immagine: `${CARTELLA_STORIA}/la nostra storia.jpg`,
    immagineVertical: `${CARTELLA_STORIA}/la nostra storia.jpg`,
  },
} as const;

export const STORIA: TappaStoria[] = [
  {
    id: "origini",
    numero: "01",
    immagine: `${CARTELLA_STORIA}/2011 (3).jpg`,
    immagineVertical: `${CARTELLA_STORIA}/2011 (3).jpg`,
  },
  {
    id: "unione",
    numero: "02",
    immagine: `${CARTELLA_STORIA}/l'ossimoro.jpg`,
    immagineVertical: `${CARTELLA_STORIA}/l'ossimoro.jpg`,
  },
  {
    id: "qualita",
    numero: "03",
    immagine: `${CARTELLA_STORIA}/la qualità.jpg`,
    immagineVertical: `${CARTELLA_STORIA}/la qualità.jpg`,
    certificazioni: [
      { chiave: "ifs", nome: "IFS Food", logo: "/brand/certificazioni/ifs.svg" },
      {
        chiave: "rainforest",
        nome: "Rainforest Alliance",
        logo: "/brand/certificazioni/rainforest-alliance.svg",
      },
      { chiave: "rspo", nome: "RSPO", logo: "/brand/certificazioni/rspo.svg" },
    ],
  },
  {
    id: "traguardo",
    numero: "04",
    immagine: `${CARTELLA_STORIA}/13 milioni (3).jpg`,
    immagineVertical: `${CARTELLA_STORIA}/13 milioni (3).jpg`,
  },
  {
    id: "generazione",
    numero: "05",
    immagine: `${CARTELLA_STORIA}/2026.jpg`,
    immagineVertical: `${CARTELLA_STORIA}/2026.jpg`,
  },
  {
    id: "futuro",
    numero: "06",
    immagine: `${CARTELLA_STORIA}/28 milioni.jpg`,
    immagineVertical: `${CARTELLA_STORIA}/28 milioni.jpg`,
  },
];
