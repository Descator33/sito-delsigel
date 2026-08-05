import { PackageOpen } from "lucide-react";

/**
 * Le quattro icone del percorso: tratto lineare, spessore unico, nessun
 * riempimento. Una arriva da Lucide (la scatola, che nel set c'è ed è
 * giusta), tre no — una base di pasta, una ciotola con la frusta e un
 * cucchiaio che versa non esistono in nessun set generico, e sostituirle
 * con simboli approssimati farebbe scivolare le card verso il look da
 * dashboard che questa sezione deve evitare.
 *
 * Tutte disegnano su `currentColor` a 24×24 con `strokeWidth` 1.6: la
 * stessa griglia di Lucide, così le quattro stanno in fila senza che una
 * pesi più delle altre.
 */

type Props = { className?: string };

const COMUNI = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  "aria-hidden": true,
} as const;

/** 01 — la base: un disco visto di tre quarti, il gesto del «da qui si parte» */
function IconaBase({ className }: Props) {
  return (
    <svg {...COMUNI} className={`mano-libera ${className ?? ""}`}>
      <ellipse cx="12" cy="8.6" rx="8.2" ry="3.6" />
      <path d="M3.8 8.6v5.2c0 2 3.67 3.6 8.2 3.6s8.2-1.6 8.2-3.6V8.6" />
      <path d="M7.6 12.6c1.3.5 2.8.8 4.4.8s3.1-.3 4.4-.8" />
    </svg>
  );
}

/** 02 — la farcitura: ciotola e frusta, il gesto del montare */
function IconaFarcitura({ className }: Props) {
  return (
    <svg {...COMUNI} className={`mano-libera ${className ?? ""}`}>
      <path d="M2.8 13.4h13.4a6.7 6.7 0 0 1-13.4 0Z" />
      <path d="M2.8 13.4h13.4" />
      <path d="M18.4 3.2 15 9.6" />
      <path d="M16.9 5.6c1.5-.6 2.9-.2 3.4.9s-.2 2.4-1.6 3.2" />
      <path d="M15.6 8.1c1.2.4 2.1 1.2 2.3 2.1" />
    </svg>
  );
}

/** 03 — il topping: il cucchiaio che cola sulla ciotola */
function IconaTopping({ className }: Props) {
  return (
    <svg {...COMUNI} className={`mano-libera ${className ?? ""}`}>
      <path d="M3.2 14.6h12.2a6.1 6.1 0 0 1-12.2 0Z" />
      <path d="M3.2 14.6h12.2" />
      <ellipse cx="18.4" cy="5.2" rx="2.6" ry="3.4" transform="rotate(28 18.4 5.2)" />
      <path d="M16.3 7.9 13.4 11" />
      <path d="M12.9 12.2v1.4" />
      <path d="M9.6 11.4v2.2" />
    </svg>
  );
}

export const ICONE = [
  IconaBase,
  IconaFarcitura,
  IconaTopping,
  /* la scatola aperta: il dolce che esce dal laboratorio e arriva */
  ({ className }: Props) => (
    <PackageOpen aria-hidden strokeWidth={1.6} className={className} />
  ),
] as const;
