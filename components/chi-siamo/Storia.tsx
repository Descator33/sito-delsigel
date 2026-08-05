"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from "motion/react";

export type Tappa = {
  anno: string;
  /* campitura piena della tappa (hex della palette) */
  colore: string;
  /* tono del testo sulla campitura */
  tone: "scuro" | "chiaro";
  titolo: string;
  testo: string;
};

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

function TappaLayer({
  t,
  i,
  n,
  progress,
}: {
  t: Tappa;
  i: number;
  n: number;
  progress: MotionValue<number>;
}) {
  const s = i / n;
  const e = (i + 1) / n;
  /* forma funzionale: mantiene il calcolo sul main thread, la mappatura
     accelerata (ScrollTimeline) applicava finestre sbagliate ai layer */
  const opacity = useTransform(() => {
    const p = progress.get();
    const rise =
      i === 0 ? 1 : clamp01((p - (s + 0.02)) / 0.05);
    const fall =
      i === n - 1 ? 0 : clamp01((p - (e - 0.07)) / 0.05);
    return rise * (1 - fall);
  });
  const y = useTransform(() => {
    const p = progress.get();
    const from = i === 0 ? 0 : 60;
    return from + clamp01((p - s) / (e - s)) * (-60 - from);
  });
  const testo =
    t.tone === "scuro" ? "text-inchiostro" : "text-panna";
  const testoDim =
    t.tone === "scuro" ? "text-inchiostro/75" : "text-panna/80";
  return (
    <motion.div
      style={{ opacity, y }}
      className="absolute inset-0 flex items-center"
    >
      <div className="mx-auto grid w-full max-w-[1800px] items-center gap-6 px-6 md:grid-cols-[auto_1fr] md:gap-16 md:px-12">
        <p
          className={`type-display -skew-x-6 text-[clamp(5rem,16vw,14rem)] leading-none ${testo}`}
        >
          {t.anno}
        </p>
        <div className="max-w-xl">
          <h3 className={`type-display text-2xl md:text-4xl ${testo}`}>
            {t.titolo}
          </h3>
          <p className={`mt-3 text-base leading-relaxed md:text-lg ${testoDim}`}>
            {t.testo}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

/**
 * La storia come scrolltelling pinnato: la sezione resta ferma e lo scroll
 * attraversa le epoche, con la campitura che muta colore come la caduta
 * della home. Fallback statico a righe sotto reduced-motion.
 */
export function Storia({ tappe }: { tappe: Tappa[] }) {
  const reduce = useReducedMotion();
  const wrap = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: wrap,
    offset: ["start start", "end end"],
  });

  const n = tappe.length;
  const mid = tappe.map((_, i) => (i + 0.5) / n);
  const bg = useTransform(scrollYProgress, mid, tappe.map((t) => t.colore));
  const labelColor = useTransform(
    scrollYProgress,
    mid,
    tappe.map((t) => (t.tone === "scuro" ? "#160601" : "#fff4e6"))
  );

  if (reduce) {
    return (
      <section id="storia" className="mx-auto max-w-[1800px] scroll-mt-24 px-6 py-24 md:px-12">
        <h2 className="type-display text-[clamp(2.2rem,5vw,4rem)] leading-none">
          La storia.
        </h2>
        <div className="mt-10 border-t-2 border-inchiostro/15">
          {tappe.map((t) => (
            <div
              key={t.anno}
              className="grid items-start gap-5 border-b-2 border-inchiostro/15 py-8 md:grid-cols-[minmax(200px,auto)_1fr] md:gap-12"
            >
              <p
                className={`type-display inline-block w-fit -skew-x-6 px-4 py-1 text-[clamp(2.4rem,5vw,4.2rem)] leading-none ${
                  t.tone === "scuro" ? "text-inchiostro" : "text-panna"
                }`}
                style={{ backgroundColor: t.colore }}
              >
                {t.anno}
              </p>
              <div className="max-w-xl">
                <h3 className="type-display text-xl md:text-2xl">{t.titolo}</h3>
                <p className="mt-2 text-base leading-relaxed text-inchiostro/65">
                  {t.testo}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section
      ref={wrap}
      id="storia"
      className="relative border-y-4 border-inchiostro"
      style={{ height: `${n * 100}vh` }}
    >
      <motion.div
        style={{ backgroundColor: bg }}
        className="sticky top-0 h-screen overflow-hidden"
      >
        <motion.h2
          style={{ color: labelColor }}
          className="type-label absolute left-6 top-24 md:left-12"
        >
          La storia
        </motion.h2>

        {tappe.map((t, i) => (
          <TappaLayer key={t.anno} t={t} i={i} n={n} progress={scrollYProgress} />
        ))}

        {/* avanzamento della storia */}
        <div className="absolute inset-x-6 bottom-10 h-1 bg-inchiostro/15 md:inset-x-12">
          <motion.div
            style={{ scaleX: scrollYProgress }}
            className="h-full origin-left bg-inchiostro"
          />
        </div>
      </motion.div>
    </section>
  );
}
