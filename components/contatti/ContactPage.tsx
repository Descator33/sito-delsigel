import { ContactForm } from "@/components/contatti/ContactForm";
import { ContactGrid } from "@/components/contatti/ContactGrid";
import { ContactHero } from "@/components/contatti/ContactHero";
import { PopDecorations } from "@/components/contatti/PopDecorations";
import { VisitUsBanner } from "@/components/contatti/VisitUsBanner";

/**
 * L'impaginato della sub-page Contatti.
 *
 * Due colonne da `lg` in su e una sola sotto, con l'ordine del sorgente
 * già giusto per il telefono — titolo, promessa, recapiti, invito, form —
 * quindi nessun `order` da riordinare e nessuna divergenza fra l'ordine
 * visivo e quello di tabulazione.
 *
 * La colonna sinistra pesa di più (`1fr` contro `0.86fr`) ma il form ha un
 * pavimento di 520px, e da lì viene la soglia. A `lg` (1024px) il form si
 * prende i suoi 520 e alla colonna sinistra ne restano 360: il titolo si
 * rimpicciolisce da sé, ma le tessere di contatto no — scendono a 170px
 * l'una e l'indirizzo email va a capo a ogni carattere. A `xl` (1280px) la
 * colonna vale 590px, che è la misura in cui la scacchiera 2×2 sta in
 * piedi. Sotto, una colonna sola: a 900px l'impaginato verticale è più
 * leggibile di due colonne strizzate, non un ripiego.
 *
 * Il contenitore è `max-w-[1800px] px-6 md:px-12`, lo stesso di `Header` e
 * `Footer`: a schermo largo il titolo parte esattamente sotto il logo. Con
 * la misura da manifesto di 1500px suggerita in specifica i due si
 * scollerebbero di un centinaio di pixel, e l'allineamento con la nav vale
 * più della larghezza.
 */
export function ContactPage() {
  return (
    <main className="contatti font-pop-testo relative bg-panna text-inchiostro">
      {/* Lo spazio della nav flottante, poi il filo nero che nel
          riferimento corre da un bordo all'altro sotto di essa. */}
      <div aria-hidden className="h-[76px] md:h-[92px]" />
      <div aria-hidden className="pop-filo" />

      {/* `overflow-x: clip` e non `hidden`: i cerchi devono poter uscire
          dal viewport senza generare una barra orizzontale, e `hidden`
          renderebbe l'intera sezione un contenitore di scorrimento —
          rompendo qualunque `sticky` che ci si volesse mettere dentro e
          spostando l'ancora dei salti a #id. */}
      <section className="relative overflow-x-clip pb-24 pt-10 sm:pt-12 md:pb-32 lg:pt-14">
        <PopDecorations />

        <div className="relative mx-auto grid max-w-[1800px] items-start gap-y-14 px-6 md:px-12 xl:grid-cols-[minmax(0,1fr)_minmax(520px,0.86fr)] xl:gap-x-[clamp(2.5rem,4.5vw,5.5rem)]">
          <div className="flex flex-col gap-y-10 sm:gap-y-12">
            <ContactHero />
            <ContactGrid />
            <VisitUsBanner />
          </div>

          <ContactForm />
        </div>
      </section>
    </main>
  );
}
