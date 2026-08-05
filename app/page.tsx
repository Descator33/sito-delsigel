import Experience from "@/components/Experience";
import { CatalogSection } from "@/components/catalog/CatalogSection";
import { CatalogPhysicalSection } from "@/components/catalog/CatalogPhysicalSection";
import { SavoryCatalogSection } from "@/components/catalog/salati/SavoryCatalogSection";
import { ConfiguratorClosingSection } from "@/components/home/ConfiguratorClosingSection";

/* Catalogo e chiusura si montano qui e non dentro Experience: quello è
   "use client" (porta d'ingresso e Lenis) e trascinerebbe sul client
   anche intestazione e involucro delle sezioni, che non hanno stato —
   e la chiusura, che le foto degli stati del dolce le legge dal
   filesystem, sul client non potrebbe proprio starci.
   Quattro blocchi in fila: le card dei dolci, il catalogo stampato, la
   linea salata, il configuratore. L'ordine è quello del racconto — la
   gamma dolce, l'oggetto da sfogliare, l'altra metà del laboratorio, e
   infine la parola a chi guarda: il dolce se lo fa lui. */
export default function Home() {
  return (
    <Experience
      catalogo={
        <>
          <CatalogSection />
          <CatalogPhysicalSection />
          <SavoryCatalogSection />
        </>
      }
      chiusura={<ConfiguratorClosingSection />}
    />
  );
}
