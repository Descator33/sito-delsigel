/**
 * Le voci tipografiche dei blocchi catalogo (redesign 2026-08-04,
 * addendum salati 2026-08-05).
 *
 * Non sostituiscono la tipografia del sito — Archivo resta l'insegna
 * industriale di hero, manifesto e sub-page, Space Mono le sue etichette.
 * Queste vivono SOLO dentro le sezioni catalogo, che hanno una direzione
 * artistica loro: titolo grottesco stretto, testo neutro, micro-testo
 * tecnico.
 *
 * League Spartan e Inter Tight sono variabili (nessun `weight` da dichiarare,
 * un solo file per famiglia); IBM Plex Mono no, e ne servono due pesi soli.
 */
import {
  Anton,
  Archivo_Black,
  DM_Sans,
  Inter,
  League_Spartan,
  Inter_Tight,
  IBM_Plex_Mono,
} from "next/font/google";

/**
 * Le due voci della hero (refactor 2026-08-12).
 *
 * Archivo Black e non l'Archivo variabile del resto del sito: alla misura
 * del manifesto (oltre 90px) serve un nero disegnato come tale — l'asse
 * `wght` di Archivo si ferma a 900 ma resta un grottesco da testo, con le
 * aste più sottili e le contro-forme più larghe. Anton, l'altra candidata,
 * è condensata e da poster: legge «affissione», non «campagna premium».
 *
 * Inter per descrizione, CTA e navigazione: è la sans neutra che la hero
 * chiede, e non si può usare Inter Tight (già nel bundle) perché a 13px
 * maiuscolo la sua larghezza ridotta stringe la CTA e ne cambia il ritmo.
 */
export const insegnaHero = Archivo_Black({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-archivo-black",
  display: "swap",
});

export const testoHero = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

/** insegna del catalogo: titolo di sezione e nomi prodotto */
export const insegnaCatalogo = League_Spartan({
  subsets: ["latin"],
  variable: "--font-spartan",
  display: "swap",
});

/** testo del catalogo: descrizioni, claim, contenuto delle schede */
export const testoCatalogo = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-tight",
  display: "swap",
});

/** micro-testo tecnico: numerazione card, metadati, CTA */
export const tecnicoCatalogo = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["500", "600"],
  variable: "--font-plex",
  display: "swap",
});

/**
 * Le due voci della sola sezione salati.
 *
 * Anton al posto di League Spartan: il confronto con il riferimento è stato
 * fatto sul titolo «I NOSTRI SALATI», che nel mockup è un grottesco
 * CONDENSATO, altissimo di occhio e senza spalle. League Spartan 800 è
 * geometrico e largo — alla stessa misura la seconda riga esce dal pannello
 * o va rimpicciolita, e l'impatto da manifesto sparisce. Anton ha un peso
 * solo (non è variabile) e serve un titolo solo: costa un file.
 *
 * DM Sans per label, descrizione, CTA e nomi prodotto: le cifre geometriche
 * dei numeri progressivi («01», «08») sono quelle del riferimento, che Inter
 * Tight — più stretta e umanista — non restituisce.
 */
export const insegnaSalati = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-anton",
  display: "swap",
});

export const testoSalati = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

/** da applicare una volta sola, sull'<html> */
export const variabiliCatalogo = [
  insegnaCatalogo.variable,
  testoCatalogo.variable,
  tecnicoCatalogo.variable,
  insegnaSalati.variable,
  testoSalati.variable,
  insegnaHero.variable,
  testoHero.variable,
].join(" ");
