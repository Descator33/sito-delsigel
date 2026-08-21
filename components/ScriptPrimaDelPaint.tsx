"use client";

/**
 * Gli script aggiunti da una navigazione client non vengono eseguiti. Sul
 * primo HTML, invece, questo nodo resta sincrono e puo correggere il documento
 * prima del paint. `text/plain` evita che React tenti di rieseguirlo durante
 * l'idratazione; il codice e gia passato dal parser del browser.
 */
export function ScriptPrimaDelPaint({ codice }: { codice: string }) {
  return (
    <script
      type={typeof window === "undefined" ? "text/javascript" : "text/plain"}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: codice }}
    />
  );
}
