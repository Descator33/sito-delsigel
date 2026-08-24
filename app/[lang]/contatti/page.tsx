import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ContactPage } from "@/components/contatti/ContactPage";
import { dizionario } from "@/lib/i18n/dizionario";
import { haLingua } from "@/lib/i18n/lingue";
import { alternatesPer } from "@/lib/i18n/sito";

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/contatti">): Promise<Metadata> {
  const { lang } = await params;
  if (!haLingua(lang)) return {};
  const metadata = dizionario(lang).metadata.contatti;
  return {
    title: metadata.titolo,
    description: metadata.descrizione,
    alternates: alternatesPer(lang, "/contatti"),
  };
}

/**
 * Contatti — manifesto pop (redesign 2026-08-05).
 *
 * La rotta tiene solo i metadati e il guscio condiviso del sito: nav
 * flottante, impaginato, chiusura. Tutto il resto sta in
 * `components/contatti/`, e l'unico pezzo che arriva al browser è il form.
 *
 * Gli orari di apertura restano fuori: non sono ancora stati forniti dal
 * committente, e una fascia oraria inventata su una pagina contatti è
 * peggio di una fascia oraria assente.
 */
export default async function ContattiPage({
  params,
}: PageProps<"/[lang]/contatti">) {
  const { lang } = await params;
  if (!haLingua(lang)) notFound();
  const testi = dizionario(lang).contatti;

  return (
    <div className="flex min-h-svh flex-col bg-panna">
      <Header />
      <ContactPage testi={testi} />
      <Footer />
    </div>
  );
}
