"use client";

import {
  Children,
  memo,
  useRef,
  type MouseEvent,
  type ReactNode,
} from "react";
import {
  MotionConfig,
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type Variants,
} from "motion/react";
import { lenisAttivo } from "@/components/SmoothScroll";

const EASE = [0.16, 1, 0.3, 1] as const;

const ELEMENTO: Variants = {
  nascosta: { opacity: 0, y: 28 },
  visibile: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.72, ease: EASE },
  },
};

/**
 * La regia della pagina catalogo. I tre capitoli restano Server Component:
 * arrivano qui come slot già renderizzati e questo piccolo confine client si
 * occupa soltanto di scroll progress, salto alle ancore con Lenis e ponte
 * cromatico fra i due cataloghi.
 */
export function CatalogJourney({
  intro,
  dolci,
  salati,
}: {
  intro: ReactNode;
  dolci: ReactNode;
  salati: ReactNode;
}) {
  const riduciMovimento = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const avanzamento = useSpring(scrollYProgress, {
    stiffness: 150,
    damping: 28,
    mass: 0.24,
  });

  const saltaAllaSezione = (evento: MouseEvent<HTMLElement>) => {
    if (
      evento.defaultPrevented ||
      evento.button !== 0 ||
      evento.metaKey ||
      evento.ctrlKey ||
      evento.shiftKey ||
      evento.altKey
    )
      return;
    if (!(evento.target instanceof Element)) return;
    const ancora = evento.target.closest<HTMLAnchorElement>('a[href^="#"]');
    if (
      !ancora ||
      !ancora.hash ||
      ancora.hasAttribute("download") ||
      (ancora.target && ancora.target !== "_self")
    )
      return;

    const id = decodeURIComponent(ancora.hash.slice(1));
    const destinazione = document.getElementById(id);
    if (!destinazione) return;

    evento.preventDefault();
    if (window.location.hash !== ancora.hash) {
      window.history.pushState(null, "", ancora.hash);
    }

    if (riduciMovimento) {
      destinazione.scrollIntoView({ behavior: "auto", block: "start" });
      return;
    }

    const lenis = lenisAttivo();
    if (lenis) {
      lenis.scrollTo(destinazione, {
        offset: -88,
        duration: 0.78,
      });
      return;
    }

    destinazione.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <MotionConfig reducedMotion="user">
      <motion.div
        aria-hidden
        data-catalog-motion="progress"
        className="pointer-events-none fixed inset-x-0 top-0 z-[55] h-[3px] origin-left bg-fucsia"
        style={{ scaleX: avanzamento }}
      />

      <main onClick={saltaAllaSezione}>
        {intro}
        {dolci}
        <CatalogFlavorTransition />
        {salati}
      </main>
    </MotionConfig>
  );
}

/**
 * Il primo viewport del catalogo. La pista e la quinta non ricevono mai un
 * transform: lo sticky resta stabile e ogni livello mobile possiede il suo
 * solo movimento. Sotto i 1024px, sui viewport bassi e con reduced motion,
 * il CSS ricompone lo stesso DOM come una cover statica.
 */
export const CatalogProductPortal = memo(function CatalogProductPortal({
  occhiello,
  descrizione,
  navigazione,
  principale,
  dolce,
  salato,
}: {
  occhiello: string;
  descrizione: ReactNode;
  navigazione: ReactNode;
  principale: ReactNode;
  dolce: ReactNode;
  salato: ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const copyY = useTransform(scrollYProgress, [0, 0.58, 1], [0, 0, -18]);
  const copyOpacity = useTransform(
    scrollYProgress,
    [0, 0.62, 1],
    [1, 1, 0.82],
  );
  const footerY = useTransform(scrollYProgress, [0, 0.58, 1], [0, 0, -12]);
  const footerOpacity = useTransform(
    scrollYProgress,
    [0, 0.64, 1],
    [1, 1, 0.76],
  );

  const aperturaY = useTransform(scrollYProgress, [0, 1], [4, -4]);
  const aperturaScale = useTransform(scrollYProgress, [0, 1], [0.97, 1.035]);
  const principaleX = useTransform(scrollYProgress, [0, 1], [0, -32]);
  const principaleY = useTransform(scrollYProgress, [0, 1], [12, -18]);
  const principaleScale = useTransform(
    scrollYProgress,
    [0, 1],
    [0.985, 1.025],
  );
  const principaleRotate = useTransform(scrollYProgress, [0, 1], [-2, 1]);
  const dolceY = useTransform(scrollYProgress, [0, 1], [-5, 9]);
  const dolceRotate = useTransform(scrollYProgress, [0, 1], [4, 2]);
  const salatoY = useTransform(scrollYProgress, [0, 1], [7, -7]);
  const salatoRotate = useTransform(scrollYProgress, [0, 1], [-4, -1]);

  return (
    <section ref={ref} className="catalog-portal relative isolate">
      <div className="catalog-portal__sticky relative min-h-[100svh]">
        <div className="catalog-portal__viewport absolute inset-0 overflow-clip">
          <div
            aria-hidden="true"
            className="catalog-portal__visual pointer-events-none absolute inset-0"
          >
            <motion.div
              data-catalog-motion="portal-scroll"
              className="catalog-portal__aperture absolute"
              style={{ y: aperturaY, scale: aperturaScale }}
            >
              <motion.div
                data-catalog-motion="portal-enter"
                initial={{ opacity: 0, y: 72, scale: 0.76, rotate: -8 }}
                animate={{ opacity: 1, y: 0, scale: 1, rotate: 7 }}
                transition={{ duration: 0.88, delay: 0.08, ease: EASE }}
                className="h-full w-full"
              >
                <span className="block h-full w-full rounded-[50%] border-[clamp(1.35rem,3.8vw,4.25rem)] border-fucsia" />
              </motion.div>
            </motion.div>

            <motion.div
              data-catalog-motion="portal-scroll"
              data-portal-product="principale"
              className="catalog-portal__product catalog-portal__product--principale absolute"
              style={{
                x: principaleX,
                y: principaleY,
                scale: principaleScale,
                rotate: principaleRotate,
              }}
            >
              <motion.div
                data-catalog-motion="portal-enter"
                initial={{ opacity: 1, y: 42, scale: 0.92, rotate: -13 }}
                animate={{ opacity: 1, y: 0, scale: 1, rotate: -8 }}
                transition={{ duration: 0.88, delay: 0.28, ease: EASE }}
                className="relative h-full w-full"
              >
                {principale}
              </motion.div>
            </motion.div>

            <motion.div
              data-catalog-motion="portal-scroll"
              data-portal-product="dolce"
              className="catalog-portal__product catalog-portal__product--dolce absolute hidden md:block"
              style={{ y: dolceY, rotate: dolceRotate }}
            >
              <motion.div
                data-catalog-motion="portal-enter"
                initial={{ opacity: 0, y: 58, scale: 0.78, rotate: -3 }}
                animate={{ opacity: 1, y: 0, scale: 1, rotate: 7 }}
                transition={{ duration: 0.78, delay: 0.43, ease: EASE }}
                className="relative h-full w-full"
              >
                {dolce}
              </motion.div>
            </motion.div>

            <motion.div
              data-catalog-motion="portal-scroll"
              data-portal-product="salato"
              className="catalog-portal__product catalog-portal__product--salato absolute hidden md:block"
              style={{ y: salatoY, rotate: salatoRotate }}
            >
              <motion.div
                data-catalog-motion="portal-enter"
                initial={{ opacity: 0, y: 64, scale: 0.76, rotate: 3 }}
                animate={{ opacity: 1, y: 0, scale: 1, rotate: -8 }}
                transition={{ duration: 0.8, delay: 0.5, ease: EASE }}
                className="relative h-full w-full"
              >
                {salato}
              </motion.div>
            </motion.div>
          </div>
        </div>

        <div className="relative z-20 mx-auto flex min-h-[100svh] max-w-[1800px] flex-col px-6 pb-5 pt-[clamp(6.5rem,14svh,9rem)] md:px-12 md:pb-8 lg:pt-[clamp(7rem,13svh,10rem)]">
          <motion.div
            data-catalog-motion="portal-scroll"
            style={{ y: copyY, opacity: copyOpacity }}
            className="relative z-20 max-w-[min(75rem,82vw)]"
          >
            <motion.p
              data-catalog-motion="portal-enter"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.12, ease: EASE }}
              className="font-tecnico text-[10px] font-semibold uppercase tracking-[0.22em] text-fucsia"
            >
              {occhiello}
            </motion.p>

            <h1 className="font-insegna mt-3 text-[clamp(3.05rem,9.4vw,10.5rem)] font-extrabold uppercase leading-[0.79] tracking-[-0.06em]">
              <span className="block overflow-clip pb-[0.06em]">
                <motion.span
                  data-catalog-motion="portal-enter"
                  initial={{ y: "108%" }}
                  animate={{ y: "0%" }}
                  transition={{ duration: 0.82, delay: 0.18, ease: EASE }}
                  className="block whitespace-nowrap"
                >
                  Tutto il
                </motion.span>
              </span>
              <span className="block overflow-clip pb-[0.08em] md:ml-[6vw]">
                <motion.span
                  data-catalog-motion="portal-enter"
                  initial={{ y: "108%" }}
                  animate={{ y: "0%" }}
                  transition={{ duration: 0.86, delay: 0.26, ease: EASE }}
                  className="block whitespace-nowrap"
                >
                  Catalogo
                  <motion.span
                    data-catalog-motion="portal-enter"
                    initial={{ opacity: 0, scale: 0.3 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.68, ease: EASE }}
                    className="inline-block origin-center text-fucsia"
                  >
                    .
                  </motion.span>
                </motion.span>
              </span>
            </h1>
          </motion.div>

          <motion.div
            data-catalog-motion="portal-scroll"
            style={{ y: footerY, opacity: footerOpacity }}
            className="relative z-40 mt-auto grid items-end gap-5 pt-5 lg:grid-cols-[minmax(16rem,1fr)_auto] lg:gap-12"
          >
            <motion.div
              data-catalog-motion="portal-enter"
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.54, ease: EASE }}
            >
              {descrizione}
            </motion.div>
            <motion.div
              data-catalog-motion="portal-enter"
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.72, delay: 0.62, ease: EASE }}
              className="lg:justify-self-end"
            >
              {navigazione}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
});

/**
 * Reveal editoriale per gruppi brevi. Ogni figlio conserva la propria
 * semantica; il wrapper aggiunge soltanto il ritmo d'ingresso.
 */
export function CatalogRevealSequence({
  children,
  className = "",
  classiElementi = [],
  alCaricamento = false,
  ritardo = 0,
}: {
  children: ReactNode;
  className?: string;
  classiElementi?: string[];
  alCaricamento?: boolean;
  ritardo?: number;
}) {
  const elementi = Children.toArray(children);
  const sequenza: Variants = {
    nascosta: {},
    visibile: {
      transition: {
        delayChildren: 0.06 + ritardo,
        staggerChildren: 0.075,
      },
    },
  };

  return (
    <motion.div
      className={className}
      variants={sequenza}
      initial="nascosta"
      animate={alCaricamento ? "visibile" : undefined}
      whileInView={alCaricamento ? undefined : "visibile"}
      viewport={{ once: true, amount: 0.24 }}
    >
      {elementi.map((elemento, indice) => (
        <motion.div
          key={indice}
          data-catalog-motion="reveal"
          className={classiElementi[indice]}
          variants={ELEMENTO}
        >
          {elemento}
        </motion.div>
      ))}
    </motion.div>
  );
}

/** Un ingresso autonomo per le due metà del quadro salato. */
export function CatalogSurfaceReveal({
  children,
  direzione,
  className = "",
  ritardo = 0,
}: {
  children: ReactNode;
  direzione: "sinistra" | "destra";
  className?: string;
  ritardo?: number;
}) {
  const x = direzione === "sinistra" ? -24 : 24;

  return (
    <motion.div
      className={className}
      data-catalog-motion="surface"
      initial={{ opacity: 0, x, y: 18 }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 0.78, delay: ritardo, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Il passaggio panna-fucsia non introduce un quarto capitolo: è una breve
 * tenda elastica che prepara il cambio di linguaggio prima dei salati.
 * Muove solo transform e sparisce quasi del tutto con reduced motion.
 */
function CatalogFlavorTransition() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 0.58, 1], ["68%", "0%", "0%"]);
  const scaleX = useTransform(scrollYProgress, [0, 0.58, 1], [0.62, 1.04, 1]);
  const scaleY = useTransform(scrollYProgress, [0, 0.58, 1], [0.45, 1.02, 1]);

  return (
    <div
      ref={ref}
      aria-hidden
      data-catalog-motion="flavor-transition"
      className="relative h-[22svh] overflow-hidden bg-panna md:h-[30svh] lg:h-[34svh]"
    >
      <motion.div
        data-catalog-motion="flavor-layer"
        className="absolute -bottom-1 left-[-15%] h-[126%] w-[130%] origin-bottom rounded-t-[50%] bg-fucsia"
        style={{ y, scaleX, scaleY }}
      />
    </div>
  );
}
