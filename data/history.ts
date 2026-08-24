import type { IdTappaStoria } from "@/lib/i18n/tipi";

/**
 * Le sei tappe del film scroll-driven «La nostra storia» — la sola
 * STRUTTURA: immagini, ordine, loghi delle certificazioni. Tutti i
 * testi (titolo, sottotitolo, descrizione, frase, alt) vivono nei
 * dizionari sotto `chiSiamo.storia.tappe`, agganciati per `id`: è ciò
 * che permette alle cinque lingue di raccontare le stesse immagini.
 *
 * Le immagini sono interpretazioni editoriali generate per la campagna,
 * non fotografie d'archivio né ritratti delle persone reali. Ogni scena
 * ha un taglio orizzontale e un reframe verticale dedicato.
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

export const STORIA: TappaStoria[] = [
  {
    id: "origini",
    numero: "01",
    immagine: "/storia-generated/01-origini-wide.webp",
    immagineVertical: "/storia-generated/01-origini-vertical.webp",
  },
  {
    id: "unione",
    numero: "02",
    immagine: "/storia-generated/02-unione-wide.webp",
    immagineVertical: "/storia-generated/02-unione-vertical.webp",
  },
  {
    id: "qualita",
    numero: "03",
    immagine: "/storia-generated/03-artigianalita-wide.webp",
    immagineVertical: "/storia-generated/03-artigianalita-vertical.webp",
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
    immagine: "/storia-generated/04-crescita-wide.webp",
    immagineVertical: "/storia-generated/04-crescita-vertical.webp",
  },
  {
    id: "generazione",
    numero: "05",
    immagine: "/storia-generated/06-futuro-wide.webp",
    immagineVertical: "/storia-generated/06-futuro-vertical.webp",
  },
  {
    id: "futuro",
    numero: "06",
    immagine: "/storia-generated/05-squadra-wide.webp",
    immagineVertical: "/storia-generated/05-squadra-vertical.webp",
  },
];
