import Link from "next/link";
import { Logo } from "@/components/Logo";

/**
 * Nav fissa sopra il canvas: le pillole restano leggibili su qualunque
 * campitura del footage (acido, fucsia, inchiostro) e su base panna.
 * La pillola del marchio è panna piena: gli occhielli del logo la
 * campiscono in tinta e il lockup resta pulito anche sul footage.
 */
export function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="mx-auto flex max-w-[1800px] items-center justify-between gap-2 px-3 pt-4 md:px-12 md:pt-5">
        <Link
          href="/"
          aria-label="Delsigel — home"
          className="rounded-full bg-panna px-3 py-1.5 sm:px-5 sm:py-2.5"
        >
          <Logo
            variant="horizontal"
            surface="var(--panna)"
            className="h-[13px] w-auto text-cacao sm:h-4"
          />
        </Link>
        <nav className="flex gap-1 sm:gap-2">
          {(
            [
              ["Catalogo", "/#catalogo"],
              ["Configuratore", "/configuratore"],
              ["Chi siamo", "/chi-siamo"],
              ["Contatti", "/contatti"],
            ] as const
          ).map(([label, href]) => (
            <Link
              key={label}
              href={href}
              className="whitespace-nowrap rounded-full bg-panna/80 px-2.5 py-1.5 text-[9px] font-semibold uppercase tracking-[0.08em] text-inchiostro backdrop-blur-sm transition-colors hover:bg-inchiostro hover:text-panna sm:px-4 sm:py-2 sm:text-[11px]"
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
