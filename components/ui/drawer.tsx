"use client";

/**
 * Drawer — la controparte da telefono del Dialog, sopra `vaul` (la stessa
 * base che usa shadcn/ui). Stessa scelta del Dialog: si scrive il wrapper
 * a mano per non far riscrivere globals.css alla CLI di shadcn.
 *
 * Il trascinamento e la chiusura per gesto li fa vaul; qui si vestono
 * solo velo, foglio e maniglia.
 */

import { Drawer as DrawerPrimitive } from "vaul";
import type { ComponentProps } from "react";
import { X } from "lucide-react";

export const Drawer = DrawerPrimitive.Root;
export const DrawerTrigger = DrawerPrimitive.Trigger;
export const DrawerClose = DrawerPrimitive.Close;
export const DrawerTitle = DrawerPrimitive.Title;
export const DrawerDescription = DrawerPrimitive.Description;

export function DrawerContent({
  className = "",
  chiudiLabel = "Chiudi",
  children,
  ...props
}: ComponentProps<typeof DrawerPrimitive.Content> & { chiudiLabel?: string }) {
  return (
    <DrawerPrimitive.Portal>
      <DrawerPrimitive.Overlay className="fixed inset-0 z-[100] bg-inchiostro/70" />
      <DrawerPrimitive.Content
        className={`fixed inset-x-0 bottom-0 z-[101] flex max-h-[92svh] flex-col overflow-hidden rounded-t-[22px] bg-panna text-inchiostro outline-none ${className}`}
        {...props}
      >
        <div className="relative flex h-14 shrink-0 items-center justify-center border-b border-inchiostro/10">
          <div aria-hidden className="h-1.5 w-11 rounded-full bg-inchiostro/20" />
          <DrawerPrimitive.Close
            aria-label={chiudiLabel}
            className="absolute right-3 top-1.5 grid h-11 w-11 place-items-center rounded-full border border-inchiostro/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fucsia"
          >
            <X aria-hidden className="h-5 w-5" />
          </DrawerPrimitive.Close>
        </div>
        {/* il foglio è alto al massimo 92svh: quel che avanza scorre qui
            dentro, non sotto il bordo — `overscroll-contain` impedisce che
            arrivato in fondo lo scroll passi alla pagina sotto */}
        <div data-lenis-prevent className="min-h-0 flex-1 overflow-y-auto overscroll-contain pb-[env(safe-area-inset-bottom)]">
          {children}
        </div>
      </DrawerPrimitive.Content>
    </DrawerPrimitive.Portal>
  );
}
