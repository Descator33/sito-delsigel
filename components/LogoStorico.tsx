import type { CSSProperties } from "react";

/**
 * Marchio storico Delsigel (20/08/2026): l'emblema a mandorla con il
 * vortice e il wordmark "delsigel" del sigillo originale, ricostruiti a
 * 2K dall'unico sorgente esistente (il PNG 114px di delsigel.it).
 *
 * Il PNG è monocromatico e qui fa da *maschera*: il colore lo mette
 * `currentColor`, così il marchio si adatta alla superficie come faceva
 * l'SVG inline — bruno sul panna, panna sul cacao. Gli occhielli sono
 * trasparenti nel raster, quindi si campiscono da soli col fondo.
 *
 * Il colore d'elezione su superfici chiare è il bruno storico
 * (`--bruno`, #56340F), campionato dal PNG originale.
 */
type LogoStoricoProps = {
  variant?: "stacked" | "horizontal" | "emblem";
  className?: string;
  title?: string;
};

const VARIANTI: Record<
  NonNullable<LogoStoricoProps["variant"]>,
  { file: string; ratio: string }
> = {
  stacked: { file: "/brand/logo-storico.png", ratio: "1874 / 1009" },
  horizontal: { file: "/brand/logo-storico-orizzontale.png", ratio: "3301 / 442" },
  emblem: { file: "/brand/logo-storico-emblema.png", ratio: "1826 / 490" },
};

export function LogoStorico({
  variant = "horizontal",
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
