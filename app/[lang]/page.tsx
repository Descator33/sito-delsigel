import { notFound } from "next/navigation";
import Experience from "@/components/Experience";
import { haLingua } from "@/lib/i18n/lingue";

/** La composizione della Home vive in un solo Server Component. */
export default async function Home({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!haLingua(lang)) notFound();
  return <Experience lingua={lang} />;
}
