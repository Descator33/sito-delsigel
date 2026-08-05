import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ContactPage } from "@/components/contatti/ContactPage";

export const metadata: Metadata = {
  title: "Contatti · Delsigel Italia",
  description:
    "Richiedi il listino, prenota una visita in stabilimento o scrivi a Delsigel. Sermoneta (LT), dal 2011.",
};

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
export default function ContattiPage() {
  return (
    <div className="flex min-h-svh flex-col bg-panna">
      <Header />
      <ContactPage />
      <Footer />
    </div>
  );
}
