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

export const Drawer = DrawerPrimitive.Root;
export const DrawerTrigger = DrawerPrimitive.Trigger;
export const DrawerClose = DrawerPrimitive.Close;
export const DrawerTitle = DrawerPrimitive.Title;
export const DrawerDescription = DrawerPrimitive.Description;

export function DrawerContent({
  className = "",
  children,
  ...props
}: ComponentProps<typeof DrawerPrimitive.Content>) {
  return (
    <DrawerPrimitive.Portal>
      <DrawerPrimitive.Overlay className="fixed inset-0 z-[100] bg-inchiostro/70" />
      <DrawerPrimitive.Content
        className={`fixed inset-x-0 bottom-0 z-[101] flex max-h-[92svh] flex-col overflow-hidden rounded-t-[22px] bg-panna text-inchiostro outline-none ${className}`}
        {...props}
      >
        <div
          aria-hidden
          className="mx-auto mt-3 h-1.5 w-11 shrink-0 rounded-full bg-inchiostro/20"
        />
        {/* il foglio è alto al massimo 92svh: quel che avanza scorre qui
            dentro, non sotto il bordo — `overscroll-contain` impedisce che
            arrivato in fondo lo scroll passi alla pagina sotto */}
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
          {children}
        </div>
      </DrawerPrimitive.Content>
    </DrawerPrimitive.Portal>
  );
}
