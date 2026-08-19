import Experience from "@/components/Experience";
import { CatalogPhysicalSection } from "@/components/catalog/CatalogPhysicalSection";
import { ConfiguratorClosingSection } from "@/components/home/ConfiguratorClosingSection";

/* Le due sezioni si montano qui e non dentro Experience per lo stesso
   motivo di sempre: il teaser legge le foto degli stati del dolce dal
   filesystem e deve restare un Server Component, vicino a ciò che legge.

   Refactor architettura 12/08 — la home è il racconto, non la gamma:
   hero, il catalogo stampato 2026/27, la storia (arrivata da Chi siamo),
   il teaser del configuratore. La griglia dei dolci e la linea salata
   vivono su /catalogo, il configuratore vero su /configuratore. */
export default function Home() {
  return (
    <Experience
      catalogoFisico={<CatalogPhysicalSection />}
      teaser={<ConfiguratorClosingSection />}
    />
  );
}
