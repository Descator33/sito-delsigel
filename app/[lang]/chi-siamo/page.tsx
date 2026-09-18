import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Marquee } from "@/components/Marquee";
import { SmoothScroll } from "@/components/SmoothScroll";
import { Intro } from "@/components/chi-siamo/Intro";
import { Biglietti } from "@/components/chi-siamo/Biglietti";
import { Squadra } from "@/components/chi-siamo/Squadra";
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

/* Ritratti reali dei dipendenti, con i nomignoli e i ruoli veri presi dal
   documento aziendale «Nomignoli»: una targa per foto, nell'ordine del
   documento.

   Tre ritratti (svizzero, franco, erode) sono gli scatti originali interi,
   solo ridimensionati: niente relight né scontorno come gli altri.
   Accenti a rotazione di palette. */
const ACCENTI = ["#fbc50a", "#a05cd5", "#f76f0b", "#e8442e"];

const PERSONE = [
  { name: "Pocket coffee", role: "Ufficio commerciale", slug: "giulia" },
  { name: "Il canadese", role: "Responsabile ufficio acquisti e personale", slug: "andrea" },
  { name: "Il pantera", role: "Responsabile di magazzino", slug: "luca" },
  { name: "Goran Pandev", role: "Responsabile di magazzino", slug: "tommaso" },
  { name: "Lo svizzero", role: "Autista", slug: "svizzero" },
  { name: "Direttò", role: "Direttore stabilimento e manutentore", slug: "franco" },
  { name: "A bombazza", role: "Linea produttiva", slug: "anna" },
  { name: "Spiraletto", role: "Responsabile impasti", slug: "augusto" },
  { name: "Burritos", role: "Impasto e piega", slug: "sandro" },
  { name: "Friggitelo", role: "Responsabile friggitrice", slug: "ivan" },
  { name: "La rottermaier", role: "Responsabile produzione", slug: "silvia" },
  { name: "Er piega", role: "Responsabile impasti", slug: "marco" },
  { name: "La comare datterina", role: "Linea produttiva", slug: "lucia" },
  { name: "Lady sorriso", role: "Linea di confezionamento", slug: "carmela" },
  { name: "La mina", role: "Lavorazione pasta", slug: "gino" },
  { name: "La zia rustichella", role: "Linea produttiva", slug: "rosa" },
  { name: "Grammetto", role: "Linea produttiva", slug: "dario" },
  { name: "Nuvoletta", role: "Linea di confezionamento", slug: "elisa" },
  { name: "Sfoglia bella", role: "Linea di confezionamento", slug: "paola" },
  { name: "Speedy twister", role: "Linea produttiva", slug: "fabio" },
  { name: "Erode", role: "Autista", slug: "erode" },
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
    accent: ACCENTI[i % ACCENTI.length],
    image: `/chi-siamo/squadra/${slug}.webp`,
  }));

  return (
    <div className="bg-panna text-inchiostro">
      <SmoothScroll />
      <Header />
      <HistoryJourney />
      <Biglietti etichetta={testi.album} />
      <Marquee testo={testi.marquee} />
      <Intro />
      <Squadra team={team} />
      <Footer />
    </div>
  );
}
