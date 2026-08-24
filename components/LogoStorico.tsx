import type { CSSProperties } from "react";

/**
 * Marchio ufficiale Delsigel (21/08/2026): l'emblema a mandorla con il
 * vortice e il wordmark "delsigel" sotto, rasterizzati a 600dpi dal
 * vettoriale ufficiale (Logo_Delsigel_Vett.pdf). Il lockup ufficiale è
 * solo quello impilato: la vecchia composizione orizzontale con la
 * scritta a destra non esiste nel manuale ed è stata ritirata.
 *
 * Il PNG è monocromatico e qui fa da *maschera*: il colore lo mette
 * `currentColor`, così il marchio si adatta alla superficie come faceva
 * l'SVG inline — bruno sul panna, panna sul cacao. Gli occhielli sono
 * trasparenti nel raster, quindi si campiscono da soli col fondo.
 *
 * Il colore d'elezione su superfici chiare è il bruno storico
 * (`--bruno`, #56340F).
 */
type LogoStoricoProps = {
  variant?: "stacked" | "emblem";
  className?: string;
  title?: string;
};

const VARIANTI: Record<
  NonNullable<LogoStoricoProps["variant"]>,
  { file: string; ratio: string }
> = {
  stacked: { file: "/brand/logo-storico.png", ratio: "2415 / 1264" },
  emblem: { file: "/brand/logo-storico-emblema.png", ratio: "2415 / 663" },
};

export function LogoStorico({
  variant = "stacked",
  className,
  title = "Delsigel",
}: LogoStoricoProps) {
  const { file, ratio } = VARIANTI[variant];
  const maschera: CSSProperties = {
    aspectRatio: ratio,
    backgroundColor: "currentColor",
    maskImage: `url(${file})`,
    maskSize: "contain",
    maskRepeat: "no-repeat",
    maskPosition: "center",
    WebkitMaskImage: `url(${file})`,
    WebkitMaskSize: "contain",
    WebkitMaskRepeat: "no-repeat",
    WebkitMaskPosition: "center",
  };
  return (
    <span
      role="img"
      aria-label={title}
      className={`block ${className ?? ""}`}
      style={maschera}
    />
  );
}
