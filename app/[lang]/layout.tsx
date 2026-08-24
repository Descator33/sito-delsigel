import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Archivo, Space_Mono, Caveat } from "next/font/google";
import { variabiliCatalogo } from "../fonts";
import { LinguaProvider } from "@/components/LinguaProvider";
import { MenuProvider } from "@/components/MenuStato";
import { PreloaderProvider } from "@/components/Preloader";
import { ScriptPrimaDelPaint } from "@/components/ScriptPrimaDelPaint";
import {
  fotoFarciture,
  fotoStati,
  fotoTopping,
} from "@/lib/configuratore/foto";
import { dizionario } from "@/lib/i18n/dizionario";
import { LINGUE, haLingua, type Lingua } from "@/lib/i18n/lingue";
import { BASE_SITO, alternatesPer } from "@/lib/i18n/sito";
import {
  ATTRIBUTO_HERO_DI_RITORNO,
  CHIAVE_HERO_VISITATA,
} from "@/lib/hero-visita";
import {
  ATTRIBUTO_PORTA_DI_RITORNO,
  CHIAVE_PORTA_ATTRAVERSATA,
} from "@/lib/porta-visita";
import "../globals.css";

/* `sessionStorage` non esiste durante il render server. Questo script gira
 * mentre l'HTML viene parsato e applica lo stato finale prima del primo
 * paint: anche dopo un refresh non compare per un frame il poster iniziale.
 * Lo stesso vale per la porta d'ingresso: se in questa scheda e gia stata
 * attraversata, il documento nasce sbloccato e la campitura non si vede. */
const PREPARA_HERO_VISITATA = `(function(){try{var d=document.documentElement;if(sessionStorage.getItem(${JSON.stringify(
  CHIAVE_HERO_VISITATA,
)})==="1")d.setAttribute(${JSON.stringify(
  ATTRIBUTO_HERO_DI_RITORNO,
)},"");if(sessionStorage.getItem(${JSON.stringify(
  CHIAVE_PORTA_ATTRAVERSATA,
)})==="1"){d.removeAttribute("data-preloader-attivo");d.setAttribute(${JSON.stringify(
  ATTRIBUTO_PORTA_DI_RITORNO,
)},"")}}catch(e){}})()`;

/* Una sola famiglia (Archivo variable, asse wdth) declinata in due voci:
 * display esteso per l'insegna, larghezza normale per il testo.
 * Space Mono è riservato a codici, prezzi ed etichette tecniche.
 * Il subset "latin" copre tutte e cinque le lingue del sito: à/è/ù
 * italiane e francesi, ä/ö finlandesi, ß tedesca e œ francese stanno
 * tutte nel suo unicode-range. */
const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  axes: ["wdth"],
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

/* corsivo a mano, solo per le annotazioni-collage (hero Chi siamo) */
const caveat = Caveat({
  variable: "--font-scritta",
  subsets: ["latin"],
  weight: ["600", "700"],
});

/* Le cinque lingue si prerenderizzano tutte: il contenuto è statico
 * per lingua, non per visitatore. */
export function generateStaticParams() {
  return LINGUE.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!haLingua(lang)) return {};
  const testi = dizionario(lang);
  return {
    metadataBase: BASE_SITO,
    title: testi.metadata.home.titolo,
    description: testi.metadata.home.descrizione,
    alternates: alternatesPer(lang, "/"),
  };
}

export default async function RootLayout({
  children,
  params,
}: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!haLingua(lang)) notFound();
  const lingua: Lingua = lang;
  const testi = dizionario(lingua);

  const assetsConfiguratore = [
    ...Object.values(fotoStati()),
    ...Object.values(fotoFarciture()),
    ...Object.values(fotoTopping()),
  ].filter((url, posizione, tutti) => tutti.indexOf(url) === posizione);

  return (
    <html
      lang={lingua}
      data-preloader-attivo=""
      suppressHydrationWarning
      className={`${archivo.variable} ${spaceMono.variable} ${caveat.variable} ${variabiliCatalogo} h-full antialiased`}
    >
      <head>
        <ScriptPrimaDelPaint codice={PREPARA_HERO_VISITATA} />
      </head>
      {/* I provider globali gestiscono la porta d'ingresso e il menu senza
          trasformare questo layout in un Client Component. La lingua entra
          per prima: preloader e menu leggono i testi da lei. */}
      <body className="min-h-full flex flex-col">
        <LinguaProvider lingua={lingua} testi={testi}>
          <PreloaderProvider assetsConfiguratore={assetsConfiguratore}>
            <MenuProvider>{children}</MenuProvider>
          </PreloaderProvider>
        </LinguaProvider>
      </body>
    </html>
  );
}
