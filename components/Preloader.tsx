"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import Image from "next/image";
import { PreloaderLogo3D } from "@/components/PreloaderLogo3D";
import { useTesti } from "@/components/LinguaProvider";
import { interpola } from "@/lib/i18n/interpola";
import {
  portaGiaAttraversata,
  ricordaPortaAttraversata,
} from "@/lib/porta-visita";

const BASE_HERO = "/hero/sequence/intriko-v1";
const ATTRIBUTO = "data-preloader-attivo";
const DURATA_MINIMA = 5_000;
const ATTESA_USCITA = 260;
const DURATA_USCITA = 720;
const TIMEOUT_GLOBALE = 45_000;

type StatoPreloader = { pronto: boolean };

/* `true` come ripiego tiene i componenti riusabili anche fuori dal root
   layout (test, Storybook, render isolati): nel sito il provider sovrascrive
   sempre questo valore. */
const Contesto = createContext<StatoPreloader>({ pronto: true });

export function usePreloader() {
  return useContext(Contesto);
}

type Props = {
  assetsConfiguratore: string[];
  children: ReactNode;
};

type Fase = "caricamento" | "uscita" | "finito";

/* Il layout di [lang] rimonta a ogni cambio lingua, ma la porta si
   attraversa una volta sola per scheda. Lo scope di modulo copre i remount
   client-side (e fa da ripiego quando lo storage e negato); sessionStorage
   estende il passaggio oltre il refresh. Sul server entrambi valgono
   false, quindi l'HTML iniziale contiene sempre la porta. */
let attraversataInMemoria = false;

function giaAttraversata() {
  return attraversataInMemoria || portaGiaAttraversata();
}

function frame(cartella: "desktop" | "mobile", indice: number) {
  return `${BASE_HERO}/${cartella}/frame-${String(indice + 1).padStart(4, "0")}.webp`;
}

/** Prima gli anchor del film e le foto del configuratore, poi i frame
 * intermedi: così nessuna famiglia di asset aspetta che l'altra finisca. */
function listaAssets(assetsConfiguratore: string[]) {
  const verticale = window.matchMedia("(max-aspect-ratio: 5/4)").matches;
  const cartella = verticale ? "mobile" : "desktop";
  const totale = verticale ? 72 : 90;
  const anchor = [
    0,
    totale - 1,
    ...Array.from({ length: Math.ceil(totale / 8) }, (_, i) =>
      Math.min(totale - 1, i * 8),
    ),
  ].filter((valore, posizione, tutti) => tutti.indexOf(valore) === posizione);
  const setAnchor = new Set(anchor);
  const intermedi = Array.from({ length: totale }, (_, i) => i).filter(
    (i) => !setAnchor.has(i),
  );
  const still = verticale
    ? [
        "/hero/hero-intriko-vortice-mobile.webp",
        "/hero/hero-intriko-vortice-mobile@2x.webp",
      ]
    : [
        "/hero/hero-intriko-vortice.webp",
        "/hero/hero-intriko-vortice@2x.webp",
      ];

  return [
    ...still,
    ...anchor.map((i) => frame(cartella, i)),
    ...assetsConfiguratore,
    ...intermedi.map((i) => frame(cartella, i)),
  ].filter((url, posizione, tutti) => tutti.indexOf(url) === posizione);
}

async function consuma(
  url: string,
  signal: AbortSignal,
  aggiorna: (quota: number) => void,
) {
  const risposta = await fetch(url, { cache: "force-cache", signal });
  if (!risposta.ok) throw new Error(`${url}: HTTP ${risposta.status}`);

  const totale = Number(risposta.headers.get("content-length")) || 0;
  if (!risposta.body) {
    await risposta.blob();
    aggiorna(1);
    return;
  }

  const lettore = risposta.body.getReader();
  let ricevuti = 0;
  while (true) {
    const { done, value } = await lettore.read();
    if (done) break;
    ricevuti += value.byteLength;
    if (totale > 0) aggiorna(Math.min(0.99, ricevuti / totale));
  }
  aggiorna(1);
}

export function PreloaderProvider({ assetsConfiguratore, children }: Props) {
  const testi = useTesti();
  /* L'iniziale legge solo la memoria, mai sessionStorage: durante
     l'idratazione il render deve combaciare con l'HTML del server, che la
     porta la contiene sempre. Il ritorno dopo un refresh lo congeda
     l'effetto qui sotto, con la porta gia nascosta dallo script prima
     del paint. */
  const [fase, setFase] = useState<Fase>(
    attraversataInMemoria ? "finito" : "caricamento",
  );
  const [progressoAssets, setProgressoAssets] = useState(0);
  const [progressoModello, setProgressoModello] = useState(0);
  const [progressoTemporale, setProgressoTemporale] = useState(0);
  const [assetsPronti, setAssetsPronti] = useState(false);
  const [modelloPronto, setModelloPronto] = useState(false);
  const avvio = useRef<number | null>(null);

  useEffect(() => {
    if (giaAttraversata()) setFase("finito");
  }, []);

  useEffect(() => {
    if (giaAttraversata()) return;
    if (avvio.current === null) avvio.current = Date.now();
    let vivo = true;
    let pubblicazione = 0;
    const controller = new AbortController();
    const urls = listaAssets(assetsConfiguratore);
    const quote = new Float32Array(urls.length);
    let prossimo = 0;

    const pubblica = () => {
      pubblicazione = 0;
      if (!vivo) return;
      let somma = 0;
      for (const quota of quote) somma += quota;
      setProgressoAssets(urls.length === 0 ? 1 : somma / urls.length);
    };

    const aggiorna = (indice: number, quota: number) => {
      quote[indice] = Math.max(quote[indice], quota);
      if (!pubblicazione) pubblicazione = requestAnimationFrame(pubblica);
    };

    const lavora = async () => {
      while (vivo) {
        const indice = prossimo++;
        if (indice >= urls.length) return;
        try {
          await consuma(urls[indice], controller.signal, (quota) =>
            aggiorna(indice, quota),
          );
        } catch {
          /* Un file mancante non trasforma la porta in una trappola: il
             componente che lo usa ha già il proprio ripiego. */
          aggiorna(indice, 1);
        }
      }
    };

    const timeout = window.setTimeout(() => controller.abort(), TIMEOUT_GLOBALE);
    const concorrenza = window.matchMedia("(max-width: 700px)").matches ? 4 : 6;
    void Promise.all(Array.from({ length: concorrenza }, lavora)).finally(() => {
      if (!vivo) return;
      window.clearTimeout(timeout);
      if (pubblicazione) cancelAnimationFrame(pubblicazione);
      setProgressoAssets(1);
      setAssetsPronti(true);
    });

    return () => {
      vivo = false;
      controller.abort();
      window.clearTimeout(timeout);
      if (pubblicazione) cancelAnimationFrame(pubblicazione);
    };
  }, [assetsConfiguratore]);

  /* Anche con gli asset gia in cache la porta resta leggibile per almeno
     cinque secondi. Il limite temporale governa anche la barra, quindi non
     arriva subito al 100% per poi restare immobile. Se invece la rete e piu
     lenta, dopo i cinque secondi prevale ancora il progresso dei download. */
  useEffect(() => {
    if (giaAttraversata()) return;
    const iniziato = avvio.current ?? Date.now();
    avvio.current = iniziato;

    const aggiorna = () => {
      const quota = Math.min(1, (Date.now() - iniziato) / DURATA_MINIMA);
      setProgressoTemporale(quota);
      return quota;
    };

    aggiorna();
    const intervallo = window.setInterval(() => {
      if (aggiorna() >= 1) window.clearInterval(intervallo);
    }, 50);
    return () => window.clearInterval(intervallo);
  }, []);

  const aggiornaModello = useCallback((valore: number) => {
    setProgressoModello((corrente) => Math.max(corrente, valore));
  }, []);
  const completaModello = useCallback(() => setModelloPronto(true), []);

  useEffect(() => {
    if (!assetsPronti || !modelloPronto || fase !== "caricamento") return;

    const trascorso = Date.now() - (avvio.current ?? Date.now());
    const attesa = Math.max(0, DURATA_MINIMA - trascorso) + ATTESA_USCITA;
    const esci = window.setTimeout(() => setFase("uscita"), attesa);
    return () => window.clearTimeout(esci);
  }, [assetsPronti, fase, modelloPronto]);

  useEffect(() => {
    if (fase !== "uscita") return;
    const termina = window.setTimeout(() => setFase("finito"), DURATA_USCITA);
    return () => window.clearTimeout(termina);
  }, [fase]);

  useEffect(() => {
    if (fase === "finito") {
      attraversataInMemoria = true;
      ricordaPortaAttraversata();
      document.documentElement.removeAttribute(ATTRIBUTO);
      return;
    }

    /* Porta di ritorno: il documento e gia sbloccato dallo script prima
       del paint, e il commit intermedio in "caricamento" non deve
       richiudere lo scroll per un frame. */
    if (giaAttraversata()) return;

    document.documentElement.setAttribute(ATTRIBUTO, "");
    const { overflow, paddingRight } = document.body.style;
    const barra = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    if (barra > 0) document.body.style.paddingRight = `${barra}px`;
    return () => {
      document.body.style.overflow = overflow;
      document.body.style.paddingRight = paddingRight;
    };
  }, [fase]);

  const progressoReale = progressoAssets * 0.9 + progressoModello * 0.1;
  const puoMostrareCento =
    assetsPronti && modelloPronto && progressoTemporale >= 1;
  const percentuale = Math.round(
    Math.min(
      puoMostrareCento ? 1 : 0.99,
      progressoReale,
      progressoTemporale,
    ) * 100,
  );
  /* Al 100% l'hero puo partire dietro la porta. Ha cosi i 260 ms di
     tenuta piu l'intera uscita per essere gia in movimento quando la
     pagina diventa visibile. */
  const heroPronto = puoMostrareCento || fase !== "caricamento";
  const valore = useMemo(() => ({ pronto: heroPronto }), [heroPronto]);

  return (
    <Contesto.Provider value={valore}>
      {children}

      {fase !== "finito" && (
        <div
          className="preloader-porta"
          data-fase={fase}
          role="status"
          aria-live="polite"
          aria-label={interpola(testi.comune.preloader.stato, { pct: percentuale })}
        >
          <div className="preloader-grana" aria-hidden="true" />
          <div className="preloader-contenuto">
            <PreloaderLogo3D
              onProgress={aggiornaModello}
              onReady={completaModello}
              onError={completaModello}
            />

            <Image
              src="/brand/logo-storico-wordmark.png"
              alt="Delsigel"
              width={2010}
              height={647}
              draggable={false}
              loading="eager"
              fetchPriority="high"
              unoptimized
              className="preloader-wordmark"
            />

            <div className="preloader-avanzamento">
              <div
                className="preloader-barra"
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={percentuale}
              >
                <span style={{ transform: `scaleX(${percentuale / 100})` }} />
              </div>
              <p className="preloader-stato">
                {percentuale}% <span aria-hidden="true">—</span>{" "}
                {testi.comune.preloader.caricamento}
              </p>
            </div>
          </div>
        </div>
      )}
    </Contesto.Provider>
  );
}
