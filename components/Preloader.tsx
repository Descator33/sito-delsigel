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
import { HERO_IMAGE } from "@/lib/hero-image";
import { PreloaderLogo3D } from "@/components/PreloaderLogo3D";
import { useTesti } from "@/components/LinguaProvider";
import { interpola } from "@/lib/i18n/interpola";
import {
  portaGiaAttraversata,
  ricordaPortaAttraversata,
} from "@/lib/porta-visita";

const ATTRIBUTO = "data-preloader-attivo";
const DURATA_MINIMA = 1_500;
const ATTESA_USCITA = 260;
const DURATA_USCITA = 720;
const TIMEOUT_GLOBALE = 8_000;

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

/** La fotografia originale è l'unico asset della hero da precaricare. */
function listaAssetsIniziali() {
  return [HERO_IMAGE];
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
    if (!giaAttraversata()) return;
    let attivo = true;
    queueMicrotask(() => { if (attivo) setFase("finito"); });
    return () => { attivo = false; };
  }, []);

  useEffect(() => {
    if (avvio.current === null) avvio.current = Date.now();
    let vivo = true;
    let pubblicazione = 0;
    const controller = new AbortController();
    const urls = listaAssetsIniziali();
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

    // Anche un modello 3D o una richiesta bloccata non trattiene la porta.
    const timeout = window.setTimeout(() => {
      setAssetsPronti(true);
      setModelloPronto(true);
    }, TIMEOUT_GLOBALE);
    const concorrenza = window.matchMedia("(max-width: 700px)").matches ? 4 : 6;
    void Promise.all(Array.from({ length: concorrenza }, lavora)).finally(() => {
      if (!vivo) return;
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
  }, []);

  // Il resto non compete con l'apertura: due download alla volta, a bassa
  // priorità, solo dopo l'uscita. Le foto della storia usano next/image lazy.
  useEffect(() => {
    if (fase !== "finito") return;
    const rete = navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } };
    if (rete.connection?.saveData || /(^|-)2g$/.test(rete.connection?.effectiveType ?? "")) return;
    const controller = new AbortController();
    let indice = 0;
    let attivo = true;
    const lavora = async () => {
      while (attivo && indice < assetsConfiguratore.length) {
        const url = assetsConfiguratore[indice++];
        try {
          const risposta = await fetch(url, { cache: "force-cache", priority: "low", signal: AbortSignal.any([controller.signal, AbortSignal.timeout(15000)]) });
          if (risposta.ok) await risposta.arrayBuffer();
        } catch { /* Il caricamento normale della pagina resta il ripiego. */ }
      }
    };
    void Promise.all([lavora(), lavora()]);
    return () => { attivo = false; controller.abort(); };
  }, [assetsConfiguratore, fase]);

  /* Anche con gli asset gia in cache la porta resta leggibile per almeno
     un breve intervallo. Il limite temporale governa anche la barra, quindi non
     arriva subito al 100% per poi restare immobile. Se invece la rete e piu
     lenta prevale ancora il progresso dei download. */
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
