import { Reveal } from "@/components/Reveal";
import { Zigzag } from "@/components/catalog/salati/DecorativeDoodles";

/**
 * La colonna sinistra della chiusura: l'insegna e la promessa.
 *
 * Il messaggio è cambiato rispetto al blocco che c'era prima («Ricette di
 * laboratorio, scala da industria»): lì si parlava di noi, qui si parla a
 * chi guarda, e il soggetto della frase è lui — «crea da solo». Il colore
 * segue il senso: nero il gesto, mandarino l'oggetto del gesto.
 *
 * Server Component: il movimento sta dentro `Reveal`, che è l'unica isola
 * client e ha già la curva del sito (mascheratura di riga, non un fade
 * generico). L'a capo delle tre righe è tipografico, non semantico:
 * letto a voce resta una frase sola.
 */
export function ConfiguratorIntro({ titoloId }: { titoloId: string }) {
  return (
    <div className="relative max-w-[34rem] xl:max-w-none">
      <h2
        id={titoloId}
        /* due scale: sotto xl l'insegna sta su tutta la larghezza, sopra
           xl vive in una colonna stretta. La misura grande di là
           manderebbe «CREA DA SOLO» a capo, che è proprio la riga che
           deve leggersi d'un fiato. */
        className="font-pop text-[clamp(2.9rem,8vw,3.9rem)] font-normal uppercase leading-[0.87] tracking-[-0.02em] xl:text-[clamp(2.3rem,2.95vw,3.7rem)]"
      >
        <Reveal className="text-cacao">Crea da solo</Reveal>
        <Reveal delay={0.08} className="text-mandarino">
          il tuo dolce
        </Reveal>
        <Reveal delay={0.16} className="text-mandarino">
          custom.
        </Reveal>
      </h2>

      <p className="mt-[clamp(1.3rem,2vw,2.2rem)] max-w-[32ch] text-[clamp(0.95rem,1.1vw,1.18rem)] font-medium leading-[1.6] text-cacao/80">
        <Reveal delay={0.24}>
          Scegli base, crema, topping e dettagli. Con il nostro configuratore
          componi il tuo dolce ideale in pochi step. Tutto online, tutto su
          misura, tutto tuo.
        </Reveal>
      </p>

      {/* il segno pop di chiusura: `aria-hidden` sta sul contenitore perché
          i doodle condivisi disegnano solo il tratto, non si annunciano */}
      <span aria-hidden className="mt-[clamp(1.4rem,2vw,2.2rem)] block">
        <Zigzag className="h-auto w-[clamp(44px,3.9vw,64px)] text-fucsia" />
      </span>
    </div>
  );
}
