/**
 * Homepage: un'esperienza continua, non una fila di sezioni.
 *
 * Rev 27/07 — rimosso il film scroll-driven "La Caduta": niente canvas, niente
 * sequenza di 361 frame, niente card volante che atterrava nel primo slot del
 * catalogo. Il Golosone vive nella sua card come tutte le altre tipologie.
 *
 * Rev 05/08 — rimossa anche la porta d'ingresso: niente contatore 000→100,
 * niente montaggio d'apertura, niente CTA "Take yours". Il sito parte dritto
 * dalla hero, senza pedaggi.
 *
 * Rev 12/08 — refactor della hero: fotografia pulita, insegna di quattro
 * righe costruita in HTML e nessuna fascia sotto.
 *
 * REFACTOR ARCHITETTURA 12/08 — la home cambia racconto:
 *
 *   HERO → CATALOGO 2026/27 → LA NOSTRA STORIA → IL FUTURO → CREA IL TUO DOLCE
 *
 * La griglia dei dolci e la linea salata sono uscite dalla home e vivono su
 * /catalogo; la storia è arrivata qui da /chi-siamo (stesso componente,
 * nessuna copia); la chiusura configuratore è diventata un teaser. I confini
 * tra le sezioni sono passaggi di scena, non bordi: l'apertura tiene la hero
 * in quinta mentre entra il primo scatto del catalogo, lo stacco di capitolo
 * porta il buio della storia sopra la coda del catalogo, il ponte gira il
 * racconto dal passato al futuro. La regia sta in components/home/*.
 *
 * Questo file resta un Server Component: i pezzi di regia sono client per
 * conto loro, e la storia va montata come figlia DIRETTA del flusso — il suo
 * pin (620vh, pinSpacing:false) non tollera involucri trasformati.
 * `catalogoFisico` e `teaser` restano props: impaginarli in app/page.tsx
 * tiene il teaser vicino alle foto che legge dal filesystem.
 */

import { type ReactNode } from "react";
import { SmoothScroll } from "@/components/SmoothScroll";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AperturaEditoriale } from "@/components/home/AperturaEditoriale";
import { StaccoCapitolo } from "@/components/home/StaccoCapitolo";
import { PonteFuturo } from "@/components/home/PonteFuturo";
import { HistoryJourney } from "@/components/chi-siamo/history/HistoryJourney";

export default function Experience({
  catalogoFisico,
  teaser,
}: {
  /** il catalogo stampato 2026/27: seconda scena della home */
  catalogoFisico: ReactNode;
  /** «Ora tocca a te»: arriva da app/page.tsx perché legge le foto
   *  degli stati del dolce dal filesystem e deve restare Server Component */
  teaser: ReactNode;
}) {
  return (
    <div className="bg-panna text-inchiostro">
      <SmoothScroll />

      <Header fondo="scuro" />

      {/* ------------------- HERO → CATALOGO (apertura) ------------------- */}
      <AperturaEditoriale />

      {/* ---------------------- CATALOGO FISICO 2026/27 -------------------- */}
      {catalogoFisico}

      {/* ------------------- CATALOGO → STORIA (capitolo) ------------------ */}
      <StaccoCapitolo />

      {/* --------------------------- LA STORIA ----------------------------- */}
      <HistoryJourney />

      {/* -------------------- STORIA → FUTURO (ponte) ---------------------- */}
      <PonteFuturo />

      {/* ---------------------- TEASER CONFIGURATORE ----------------------- */}
      {teaser}

      <Footer />
    </div>
  );
}
