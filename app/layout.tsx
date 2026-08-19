import type { Metadata } from "next";
import { Archivo, Space_Mono, Caveat } from "next/font/google";
import { variabiliCatalogo } from "./fonts";
import { MenuProvider } from "@/components/MenuStato";
import "./globals.css";

/* Una sola famiglia (Archivo variable, asse wdth) declinata in due voci:
 * display esteso per l'insegna, larghezza normale per il testo.
 * Space Mono è riservato a codici, prezzi ed etichette tecniche. */
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

export const metadata: Metadata = {
  title: "Delsigel Italia · L'industria artigianale",
  description:
    "Delsigel, l'industria artigianale: innovativa e buona per tutti. Dolci e salati da laboratorio, prodotti su scala, dal 2011. Scopri il catalogo 2026/27.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="it"
      className={`${archivo.variable} ${spaceMono.variable} ${caveat.variable} ${variabiliCatalogo} h-full antialiased`}
    >
      {/* Il provider avvolge solo `children` e non l'intero documento: è
          l'unico pezzo di client qui dentro, e serve perché navigazione e
          hero leggano lo stesso stato del menu (vedi components/MenuStato.tsx). */}
      <body className="min-h-full flex flex-col">
        <MenuProvider>{children}</MenuProvider>
      </body>
    </html>
  );
}
