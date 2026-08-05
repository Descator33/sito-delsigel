"use client";

/**
 * Dialog — i pezzi comportamentali di shadcn/ui sopra @radix-ui/react-dialog,
 * scritti a mano invece che con `npx shadcn add`: la CLI avrebbe riscritto
 * globals.css inserendo il suo sistema di token accanto al nostro, che è
 * l'unica cosa che non deve succedere in questo progetto.
 *
 * Qui c'è solo il comportamento (portal, focus trap, Esc, scroll lock,
 * aria) più il minimo di vestizione condivisa: velo e cornice. Lo stile
 * del CONTENUTO lo mette chi lo usa.
 */

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import type { ComponentProps } from "react";

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogClose = DialogPrimitive.Close;

export function DialogOverlay({
  className = "",
  ...props
}: ComponentProps<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      className={`velo-scheda fixed inset-0 z-[100] bg-inchiostro/70 backdrop-blur-[2px] ${className}`}
      {...props}
    />
  );
}

export function DialogContent({
  className = "",
  chiudiLabel = "Chiudi",
  children,
  ...props
}: ComponentProps<typeof DialogPrimitive.Content> & { chiudiLabel?: string }) {
  return (
    <DialogPrimitive.Portal>
      <DialogOverlay />
      <DialogPrimitive.Content
        className={`quadro-scheda fixed left-1/2 top-1/2 z-[101] max-h-[88svh] w-[min(92vw,64rem)] overflow-y-auto rounded-[22px] bg-panna text-inchiostro shadow-[0_40px_90px_-30px_rgb(22_6_1/0.55)] ${className}`}
        {...props}
      >
        {children}
        <DialogPrimitive.Close
          aria-label={chiudiLabel}
          className="absolute right-4 top-4 z-10 grid h-11 w-11 place-items-center rounded-full border border-inchiostro/20 bg-panna/85 text-inchiostro backdrop-blur-sm transition-colors hover:bg-inchiostro hover:text-panna focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fucsia"
        >
          <X aria-hidden strokeWidth={1.6} className="h-[18px] w-[18px]" />
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}

export const DialogTitle = DialogPrimitive.Title;
export const DialogDescription = DialogPrimitive.Description;
