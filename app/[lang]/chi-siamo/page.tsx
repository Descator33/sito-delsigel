import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Marquee } from "@/components/Marquee";
import { SmoothScroll } from "@/components/SmoothScroll";
import { Intro } from "@/components/chi-siamo/Intro";
import { Biglietti } from "@/components/chi-siamo/Biglietti";
import { Nastri } from "@/components/chi-siamo/Nastri";
import { Squadra } from "@/components/chi-siamo/Squadra";
import { Linea } from "@/components/chi-siamo/Linea";
import { HistoryJourney } from "@/components/chi-siamo/history/HistoryJourney";
import type { TeamMember } from "@/components/TeamCard";
import { dizionario } from "@/lib/i18n/dizionario";
import { haLingua } from "@/lib/i18n/lingue";
import { alternatesPer } from "@/lib/i18n/sito";

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/chi-siamo">): Promise<Metadata> {
  const { lang } = await params;
  if (!haLingua(lang)) return {};
  const metadata = dizionario(lang).metadata.chiSiamo;
  return {
    title: metadata.titolo,
    description: metadata.descrizione,
    alternates: alternatesPer(lang, "/chi-siamo"),
  };
}

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

/* La narrazione completa vive qui; la Home ne mostra soltanto un'anteprima. */
export default async function ChiSiamoPage({
  params,
}: PageProps<"/[lang]/chi-siamo">) {
  const { lang } = await params;
  if (!haLingua(lang)) notFound();
  const testi = dizionario(lang).chiSiamo;
  const team: TeamMember[] = PERSONE.map(({ slug, ...persona }, i) => ({
    ...persona,
    role: testi.squadra.ruoli[persona.role] ?? persona.role,
    reparto: testi.squadra.reparti[persona.reparto] ?? persona.reparto,
    accent: ACCENTI[i % ACCENTI.length],
    image: `/chi-siamo/squadra/${slug}.webp`,
  }));

  return (
    <div className="bg-panna text-inchiostro">
      <SmoothScroll />
      <Header />
      <Intro />
      <HistoryJourney />
      <Biglietti etichetta={testi.album} />
      <Marquee testo={testi.marquee} />
      <Squadra team={team} />
      <Nastri voci={testi.nastri} />
      <Linea />
      <Footer />
    </div>
  );
}
