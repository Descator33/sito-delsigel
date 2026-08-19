import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Marquee } from "@/components/Marquee";
import { SmoothScroll } from "@/components/SmoothScroll";
import { Intro } from "@/components/chi-siamo/Intro";
import { Biglietti } from "@/components/chi-siamo/Biglietti";
import { Nastri } from "@/components/chi-siamo/Nastri";
import { Squadra } from "@/components/chi-siamo/Squadra";
import { Linea } from "@/components/chi-siamo/Linea";
import type { TeamMember } from "@/components/TeamCard";

export const metadata: Metadata = {
  title: "Chi siamo · Delsigel Italia",
  description:
    "Il team Delsigel e la linea produttiva: l'industria artigianale di Sermoneta, dal 2011.",
};

/* Ritratti reali dei dipendenti (da public/dipendenti, uniformati con
   Higgsfield: sfondo panna, quadrato, mezzobusto). Nomi e ruoli sono
   placeholder da sostituire con quelli veri; "anni" tarati sull'azienda
   reale (fondata nel 2011, quindi max ~15). Accenti a rotazione di palette. */
const ACCENTI = ["#fbc50a", "#a05cd5", "#f76f0b", "#e8442e"];

const PERSONE = [
  { name: "Sandro Meli", role: "Fornaio", reparto: "Forni", anni: 12, slug: "sandro" },
  { name: "Paola Grimaldi", role: "Decoratrice", reparto: "Dolci", anni: 8, slug: "paola" },
  { name: "Marco Vellutini", role: "Impastatore", reparto: "Farina", anni: 9, slug: "marco" },
  { name: "Rosa Petrucci", role: "Sfoglina", reparto: "Farina", anni: 13, slug: "rosa" },
  { name: "Gino Barile", role: "Pasticcere", reparto: "Dolci", anni: 7, slug: "gino" },
  { name: "Carmela Iodice", role: "Farcitrice", reparto: "Dolci", anni: 10, slug: "carmela" },
  { name: "Elisa Montefiori", role: "Addetta linea", reparto: "Linea", anni: 3, slug: "elisa" },
  { name: "Anna Delsante", role: "L'anima del lab", reparto: "Lab", anni: 15, slug: "anna" },
  { name: "Fabio Terenzi", role: "Controllo qualità", reparto: "Lab", anni: 11, slug: "fabio" },
  { name: "Augusto Ferri", role: "Mastro fornaio", reparto: "Forni", anni: 15, slug: "augusto" },
  { name: "Lucia Mancuso", role: "Glassatrice", reparto: "Dolci", anni: 6, slug: "lucia" },
  { name: "Dario Colnaghi", role: "Addetto linea", reparto: "Linea", anni: 2, slug: "dario" },
  { name: "Silvia Bonetto", role: "Capo turno", reparto: "Linea", anni: 12, slug: "silvia" },
  { name: "Ivan Roversi", role: "Manutentore", reparto: "Motori", anni: 8, slug: "ivan" },
  { name: "Franco Alberici", role: "Mulettista", reparto: "Scorte", anni: 14, slug: "franco" },
  { name: "Il Guardiano", role: "Custode dei -20°", reparto: "Cella", anni: 13, slug: "guardiano" },
  { name: "Piero Lanzetta", role: "Capo produzione", reparto: "Linea", anni: 13, slug: "piero" },
  { name: "Tommaso Ricciardi", role: "Logistica", reparto: "Scorte", anni: 6, slug: "tommaso" },
  { name: "Luca Serrano", role: "Apprendista", reparto: "Farina", anni: 1, slug: "luca" },
  { name: "Giulia Farnese", role: "Comunicazione", reparto: "Uffici", anni: 4, slug: "giulia" },
  { name: "Andrea Bellotti", role: "Commerciale", reparto: "Uffici", anni: 9, slug: "andrea" },
];

const TEAM: TeamMember[] = PERSONE.map(({ slug, ...p }, i) => ({
  ...p,
  accent: ACCENTI[i % ACCENTI.length],
  image: `/chi-siamo/squadra/${slug}.webp`,
}));

/* Refactor architettura 12/08 — «La nostra storia» è passata alla
   homepage (components/chi-siamo/history, montata da Experience): qui
   restano le persone e la linea. Con la storia se n'è andato anche lo
   Stacco che la separava dalla squadra: senza i 620vh scuri in mezzo,
   Marquee e Stacco sarebbero stati due stacchi appiccicati — la fascia
   acida da sola fa il cambio di capitolo verso il blocco scuro. */
export default function ChiSiamoPage() {
  return (
    <div className="bg-panna text-inchiostro">
      <SmoothScroll />
      <Header />
      <Intro />
      <Biglietti />
      <Marquee />
      <Squadra team={TEAM} />
      <Nastri
        voci={[
          "Dal sacco di farina al sigillo",
          "Cinque stazioni · un solo standard",
          "Nessuna scorciatoia ★★★★★",
        ]}
      />
      <Linea />
      <Footer />
    </div>
  );
}
