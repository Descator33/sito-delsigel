"use client";

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";

const BASE = "/hero/sequence/intriko-v1";

const VARIANTI = {
  desktop: {
    cartella: `${BASE}/desktop`,
    frames: 90,
    decodificheParallele: 3,
    cacheDecodificata: 8,
    precaricamentiParalleli: 2,
  },
  mobile: {
    cartella: `${BASE}/mobile`,
    frames: 72,
    decodificheParallele: 2,
    cacheDecodificata: 6,
    precaricamentiParalleli: 2,
  },
} as const;

type Variante = (typeof VARIANTI)[keyof typeof VARIANTI];

type Fotogramma = {
  fonte: CanvasImageSource;
  larghezza: number;
  altezza: number;
  chiudi: () => void;
};

type Deposito = {
  mostra: (progresso: number) => void;
  distruggi: () => void;
};

export type HeroFrameSequenceHandle = {
  mostra: (progresso: number) => void;
};

function percorsoFrame(variante: Variante, indice: number) {
  return `${variante.cartella}/frame-${String(indice + 1).padStart(4, "0")}.webp`;
}

async function decodifica(blob: Blob): Promise<Fotogramma> {
  if ("createImageBitmap" in window) {
    const bitmap = await createImageBitmap(blob);
    return {
      fonte: bitmap,
      larghezza: bitmap.width,
      altezza: bitmap.height,
      chiudi: () => bitmap.close(),
    };
  }

  const url = URL.createObjectURL(blob);
  const immagine = new Image();
  immagine.decoding = "async";
  immagine.src = url;
  try {
    await immagine.decode();
  } catch (errore) {
    immagine.src = "";
    URL.revokeObjectURL(url);
    throw errore;
  }

  return {
    fonte: immagine,
    larghezza: immagine.naturalWidth,
    altezza: immagine.naturalHeight,
    chiudi: () => {
      immagine.src = "";
      URL.revokeObjectURL(url);
    },
  };
}

/** Disegna come `object-fit: cover`, ma senza riallocare più del necessario. */
function disegnaCover(canvas: HTMLCanvasElement, frame: Fotogramma) {
  const cssWidth = Math.max(1, window.innerWidth);
  const cssHeight = Math.max(1, window.innerHeight);
  const dpr = Math.min(
    window.devicePixelRatio || 1,
    1.5,
    frame.larghezza / cssWidth,
    frame.altezza / cssHeight,
  );
  const larghezza = Math.max(1, Math.round(cssWidth * dpr));
  const altezza = Math.max(1, Math.round(cssHeight * dpr));

  if (canvas.width !== larghezza || canvas.height !== altezza) {
    canvas.width = larghezza;
    canvas.height = altezza;
  }

  const contesto = canvas.getContext("2d", { alpha: false });
  if (!contesto) return;

  const scala = Math.max(
    larghezza / frame.larghezza,
    altezza / frame.altezza,
  );
  const sorgenteLarghezza = larghezza / scala;
  const sorgenteAltezza = altezza / scala;
  const sorgenteX = (frame.larghezza - sorgenteLarghezza) / 2;
  const sorgenteY = (frame.altezza - sorgenteAltezza) / 2;

  contesto.imageSmoothingEnabled = true;
  contesto.imageSmoothingQuality = "high";
  contesto.drawImage(
    frame.fonte,
    sorgenteX,
    sorgenteY,
    sorgenteLarghezza,
    sorgenteAltezza,
    0,
    0,
    larghezza,
    altezza,
  );
}

/**
 * Il browser conserva i WebP nella HTTP cache; qui resta soltanto una piccola
 * finestra di bitmap decodificate. Un'intera sequenza 1080p in RGBA supererebbe
 * facilmente i 700 MB: coda limitata e `ImageBitmap.close()` sono parte della
 * fluidità, non dettagli di implementazione.
 */
function creaDeposito(
  variante: Variante,
  pronto: (frame: Fotogramma, indice: number) => void,
): Deposito {
  const controller = new AbortController();
  const scaricamenti = new Map<number, Promise<Blob>>();
  const decodificati = new Map<number, Fotogramma>();
  const inPreparazione = new Set<number>();
  let codaDecodifica: number[] = [];
  let decodificheAttive = 0;
  let distrutto = false;
  let desiderato = 0;
  let precedente = 0;
  let visualizzato = -1;
  let precaricamentoAvviato = false;
  let timerPrecaricamento = 0;
  let precaricamentiAttivi = 0;
  let codaPrecaricamento: number[] = [];
  const inCodaPrecaricamento = new Set<number>();
  const precaricati = new Set<number>();

  const scarica = (indice: number) => {
    const inCorso = scaricamenti.get(indice);
    if (inCorso) return inCorso;

    const richiesta = fetch(percorsoFrame(variante, indice), {
      cache: "force-cache",
      signal: controller.signal,
    })
      .then((risposta) => {
        if (!risposta.ok) {
          throw new Error(`Frame ${indice}: HTTP ${risposta.status}`);
        }
        return risposta.blob();
      })
      .finally(() => scaricamenti.delete(indice));

    scaricamenti.set(indice, richiesta);
    return richiesta;
  };

  const pubblica = (frame: Fotogramma, indice: number) => {
    if (visualizzato === indice) return;
    visualizzato = indice;
    pronto(frame, indice);
  };

  const ripulisci = () => {
    if (decodificati.size <= variante.cacheDecodificata) return;

    const lontani = [...decodificati.keys()].sort(
      (a, b) => Math.abs(b - desiderato) - Math.abs(a - desiderato),
    );
    while (decodificati.size > variante.cacheDecodificata) {
      const indice = lontani.shift();
      if (indice === undefined) break;
      if (indice === desiderato || indice === visualizzato) continue;
      decodificati.get(indice)?.chiudi();
      decodificati.delete(indice);
    }
  };

  const pompaDecodifica = () => {
    if (distrutto) return;

    codaDecodifica.sort(
      (a, b) => Math.abs(a - desiderato) - Math.abs(b - desiderato),
    );

    while (
      decodificheAttive < variante.decodificheParallele &&
      codaDecodifica.length > 0
    ) {
      const indice = codaDecodifica.shift();
      if (indice === undefined) break;
      if (decodificati.has(indice)) {
        inPreparazione.delete(indice);
        continue;
      }

      decodificheAttive += 1;
      void scarica(indice)
        .then(decodifica)
        .then((frame) => {
          if (distrutto) {
            frame.chiudi();
            return;
          }
          decodificati.set(indice, frame);
          ripulisci();
          if (indice === desiderato) pubblica(frame, indice);
        })
        .catch(() => {})
        .finally(() => {
          decodificheAttive -= 1;
          inPreparazione.delete(indice);
          pompaDecodifica();
        });
    }
  };

  const prepara = (indice: number) => {
    if (decodificati.has(indice) || inPreparazione.has(indice)) return;
    inPreparazione.add(indice);
    codaDecodifica.push(indice);
    pompaDecodifica();
  };

  const piuVicino = (indice: number) => {
    let scelto: { distanza: number; frame: Fotogramma; indice: number } | null =
      null;
    for (const [candidato, frame] of decodificati) {
      const distanza = Math.abs(candidato - indice);
      if (!scelto || distanza < scelto.distanza) {
        scelto = { distanza, frame, indice: candidato };
      }
    }
    return scelto;
  };

  const connessione = (
    navigator as Navigator & { connection?: { saveData?: boolean } }
  ).connection;
  const risparmioDati = Boolean(connessione?.saveData);

  const pompaPrecaricamento = () => {
    if (distrutto || risparmioDati || document.hidden) return;

    while (
      precaricamentiAttivi < variante.precaricamentiParalleli &&
      codaPrecaricamento.length > 0
    ) {
      const indice = codaPrecaricamento.shift();
      if (indice === undefined) break;
      precaricamentiAttivi += 1;

      void scarica(indice)
        .then(() => precaricati.add(indice))
        .catch(() => {})
        .finally(() => {
          precaricamentiAttivi -= 1;
          inCodaPrecaricamento.delete(indice);
          pompaPrecaricamento();
        });
    }
  };

  const accodaPrecaricamento = (indici: number[]) => {
    if (distrutto || risparmioDati) return;
    for (const indice of indici) {
      if (precaricati.has(indice) || inCodaPrecaricamento.has(indice)) continue;
      inCodaPrecaricamento.add(indice);
      codaPrecaricamento.push(indice);
    }
    pompaPrecaricamento();
  };

  /* Dopo il load si scaldano soltanto gli anchor. Il resto parte al primo
     scroll reale: così LCP, font e still finale non competono con 90 fetch. */
  const anchor = Array.from(
    { length: Math.ceil(variante.frames / 8) },
    (_, indice) => Math.min(variante.frames - 1, indice * 8),
  );
  const ordineAnchor = [
    0,
    variante.frames - 1,
    ...anchor,
  ].filter((indice, posizione, tutti) => tutti.indexOf(indice) === posizione);

  const pianificaAnchor = () => {
    window.clearTimeout(timerPrecaricamento);
    timerPrecaricamento = window.setTimeout(
      () => accodaPrecaricamento(ordineAnchor),
      450,
    );
  };

  const avviaPrecaricamentoCompleto = () => {
    if (precaricamentoAvviato || risparmioDati) return;
    precaricamentoAvviato = true;
    const ordine = Array.from(
      { length: variante.frames },
      (_, indice) => indice,
    ).sort(
      (a, b) => Math.abs(a - desiderato) - Math.abs(b - desiderato),
    );
    accodaPrecaricamento(ordine);
  };

  const mostra = (progresso: number) => {
    const limitato = Math.max(0, Math.min(1, progresso));
    const indice = Math.round(limitato * (variante.frames - 1));
    const giaCorrente = indice === desiderato && decodificati.has(indice);

    precedente = desiderato;
    desiderato = indice;
    if (limitato > 0.002) avviaPrecaricamentoCompleto();
    if (giaCorrente) return;

    const presente = decodificati.get(indice);
    if (presente) pubblica(presente, indice);
    else {
      const vicino = piuVicino(indice);
      if (vicino) pubblica(vicino.frame, vicino.indice);
    }

    const direzione = indice >= precedente ? 1 : -1;
    const scarti =
      indice === 0 && limitato === 0
        ? [0, 1, 2]
        : [0, 1, 2, 3, 4, -1, -2, -3];
    const priorita = scarti
      .map((scarto) => indice + scarto * direzione)
      .filter((candidato) => candidato >= 0 && candidato < variante.frames);
    const necessari = new Set(priorita);

    /* I lavori ancora in coda seguono il nuovo playhead. Restano attive al
       massimo due o tre decodifiche già iniziate; tutto il resto si riordina. */
    codaDecodifica = codaDecodifica.filter((candidato) => {
      if (necessari.has(candidato)) return true;
      inPreparazione.delete(candidato);
      return false;
    });
    for (const candidato of priorita) prepara(candidato);
    pompaDecodifica();
  };

  const alCambioVisibilita = () => pompaPrecaricamento();
  if (document.readyState === "complete") pianificaAnchor();
  else window.addEventListener("load", pianificaAnchor, { once: true });
  document.addEventListener("visibilitychange", alCambioVisibilita);

  mostra(0);

  return {
    mostra,
    distruggi: () => {
      distrutto = true;
      window.clearTimeout(timerPrecaricamento);
      window.removeEventListener("load", pianificaAnchor);
      document.removeEventListener("visibilitychange", alCambioVisibilita);
      controller.abort();
      codaDecodifica = [];
      codaPrecaricamento = [];
      inPreparazione.clear();
      inCodaPrecaricamento.clear();
      for (const frame of decodificati.values()) frame.chiudi();
      decodificati.clear();
    },
  };
}

export const HeroFrameSequence = forwardRef<
  HeroFrameSequenceHandle,
  { disabilitata: boolean }
>(function HeroFrameSequence({ disabilitata }, ref) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const deposito = useRef<Deposito | null>(null);
  const progresso = useRef(0);
  const ultimo = useRef<{ frame: Fotogramma; indice: number } | null>(null);

  useImperativeHandle(
    ref,
    () => ({
      mostra: (valore) => {
        progresso.current = valore;
        deposito.current?.mostra(valore);
      },
    }),
    [],
  );

  useEffect(() => {
    if (disabilitata) return;

    const media = window.matchMedia("(max-aspect-ratio: 5/4)");
    let resizeFrame = 0;

    const avvia = () => {
      deposito.current?.distruggi();
      ultimo.current = null;
      const variante = media.matches ? VARIANTI.mobile : VARIANTI.desktop;
      deposito.current = creaDeposito(variante, (frame, indice) => {
        if (!canvas.current) return;
        ultimo.current = { frame, indice };
        disegnaCover(canvas.current, frame);
      });
      deposito.current.mostra(progresso.current);
    };

    const ridimensiona = () => {
      cancelAnimationFrame(resizeFrame);
      resizeFrame = requestAnimationFrame(() => {
        const corrente = ultimo.current;
        const elemento = canvas.current;
        if (!corrente || !elemento || elemento.closest("[data-libera]")) return;
        disegnaCover(elemento, corrente.frame);
      });
    };

    avvia();
    media.addEventListener("change", avvia);
    window.addEventListener("resize", ridimensiona, { passive: true });

    return () => {
      cancelAnimationFrame(resizeFrame);
      media.removeEventListener("change", avvia);
      window.removeEventListener("resize", ridimensiona);
      deposito.current?.distruggi();
      deposito.current = null;
      ultimo.current = null;
    };
  }, [disabilitata]);

  return (
    <div className="hero-sequenza absolute inset-0" aria-hidden="true">
      <picture className="hero-sequenza-poster absolute inset-0">
        <source
          media="(max-aspect-ratio: 5/4)"
          srcSet={`${VARIANTI.mobile.cartella}/frame-0001.webp`}
        />
        <img
          src={`${VARIANTI.desktop.cartella}/frame-0001.webp`}
          alt=""
          fetchPriority="high"
          decoding="sync"
          draggable={false}
          className="absolute inset-0 h-full w-full object-cover"
        />
      </picture>
      <canvas ref={canvas} className="hero-frame-canvas absolute inset-0 h-full w-full" />
    </div>
  );
});
