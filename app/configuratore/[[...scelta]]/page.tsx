import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Configuratore } from "@/components/configuratore/Configuratore";
import {
  DATASET,
  farcituraVoce,
  nomeCommerciale,
  parseScelta,
  toppingVoce,
} from "@/lib/configuratore";
import { fotoFarciture, fotoStati, fotoTopping } from "@/lib/configuratore/foto";

/**
 * Configuratore dolci — route unica con optional catch-all:
 *   /configuratore                    → passo 1 (base)
 *   /configuratore/{base}             → passo 2 (farcitura)
 *   /configuratore/{base}/{farcitura} → passo 3 (finitura, formato, quantità)
 *
 * La pagina server è sottile: valida i segmenti con parseScelta (un solo
 * punto di parsing), normalizza gli URL sporchi con redirect() e monta
 * l'isola client, che poi naviga tra i passi con history.pushState senza
 * altri round-trip. Lo stato prodotto vive nell'URL: una farcitura non può
 * esistere senza la sua base, quindi "cambiare base azzera la farcitura"
 * è un vincolo strutturale, non una regola da ricordare.
 */

type Props = { params: Promise<{ scelta?: string[] }> };

/* Le 43 varianti prerenderizzabili: radice, le 10 basi, 32 SKU. Anche la
   base a farcitura unica ha la sua pagina passo 2: dal 2026-08-02 il
   salto automatico non esiste più, la farcitura si sceglie sempre. */
export function generateStaticParams() {
  return [
    { scelta: [] },
    ...DATASET.basi.map((b) => ({ scelta: [b.id] })),
    ...DATASET.combinazioni.map((c) => ({ scelta: [c.base, c.farcitura] })),
  ];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { scelta } = await params;
  const esito = parseScelta(scelta);

  if (esito.tipo === "render" && esito.comb) {
    const nome = nomeCommerciale(esito.comb);
    const farcitura = farcituraVoce(esito.comb.farcitura);
    const topping = toppingVoce(esito.comb.topping);
    return {
      title: `${nome} · ${farcitura?.nome} · Configuratore Delsigel`,
      description:
        `${nome} con ${farcitura?.nome.toLowerCase()}, finitura ` +
        `${topping?.nome.toLowerCase()}, ${esito.comb.grammatura_gr} g. ` +
        `Configura quantità e richiedi la quotazione.`,
    };
  }
  if (esito.tipo === "render" && esito.base) {
    return {
      title: `${esito.base.nome} · Configuratore Delsigel`,
      description: `Scegli la farcitura per ${esito.base.nome} e componi la tua richiesta.`,
    };
  }
  return {
    title: "Configuratore dolci · Delsigel Italia",
    description:
      "Componi il tuo prodotto: base, farcitura e formato, con la catena logistica e l'ordine minimo dichiarati prima dell'invio.",
  };
}

export default async function ConfiguratorePage({ params }: Props) {
  const { scelta } = await params;
  const esito = parseScelta(scelta);

  if (esito.tipo === "redirect") redirect(esito.destinazione);

  /* overflow-x-clip (mai hidden: romperebbe lo sticky del palco): una
     tessera trascinata oltre il bordo non apre lo scroll orizzontale.
     L'insegna della pagina (l'h1 «Crea il tuo dolce.») non sta più
     qui ma dentro l'isola: dal redesign 2026-08-04 è la prima delle
     tre colonne, e deve stare nella stessa griglia del palco. */
  return (
    <div className="overflow-x-clip bg-panna text-inchiostro">
      <Header />

      {/* le mappe delle foto si leggono dal filesystem qui, lato server:
          le cartelle sono il contratto, l'isola client riceve solo gli
          URL delle voci che una foto ce l'hanno */}
      <Configuratore
        foto={fotoStati()}
        fotoFarciture={fotoFarciture()}
        fotoTopping={fotoTopping()}
      />

      <Footer />
    </div>
  );
}
