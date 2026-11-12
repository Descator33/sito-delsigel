"use client";

import { createContext, useContext, useState, useSyncExternalStore, type ReactNode } from "react";
import Link from "next/link";
import { useLingua } from "@/components/LinguaProvider";

const CHIAVE = "delsigel:consenso-cookie-v1";
const DURATA = 183 * 24 * 60 * 60 * 1000;
type Scelta = "accettato" | "rifiutato" | "nessuna";

function leggi(): Scelta {
  try {
    const valore = JSON.parse(localStorage.getItem(CHIAVE) || "null");
    if ((valore?.scelta === "accettato" || valore?.scelta === "rifiutato") && typeof valore.scadenza === "number" && valore.scadenza > Date.now()) return valore.scelta;
  } catch { /* Se lo storage è bloccato la scelta resta non impostata. */ }
  return "nessuna";
}
function ascolta(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener("delsigel-consenso", callback);
  return () => { window.removeEventListener("storage", callback); window.removeEventListener("delsigel-consenso", callback); };
}
function salva(scelta: Exclude<Scelta, "nessuna">) {
  try { localStorage.setItem(CHIAVE, JSON.stringify({ scelta, scadenza: Date.now() + DURATA })); } catch { /* La scelta vale almeno per la pagina corrente. */ }
  window.dispatchEvent(new Event("delsigel-consenso"));
}

type Contesto = { mappa: boolean; imposta: (consenti: boolean) => void; apri: () => void };
const Consenso = createContext<Contesto | null>(null);
export function useConsensoCookie() {
  const valore = useContext(Consenso);
  if (!valore) throw new Error("Provider consenso cookie mancante");
  return valore;
}

export function ConsensoCookieProvider({ children }: { children: ReactNode }) {
  const { lingua, percorso } = useLingua();
  const sceltaSalvata = useSyncExternalStore(ascolta, leggi, () => "nessuna" as Scelta);
  const [temporanea, setTemporanea] = useState<Scelta>("nessuna");
  const [aperto, setAperto] = useState(false);
  const scelta = sceltaSalvata === "nessuna" ? temporanea : sceltaSalvata;
  function imposta(consenti: boolean) {
    const valore = consenti ? "accettato" : "rifiutato";
    salva(valore);
    setTemporanea(valore);
    setAperto(false);
  }
  const t = {
    it: { titolo: "La tua privacy", testo: "Usiamo strumenti tecnici per il funzionamento del sito. Con il tuo consenso attiviamo anche la mappa Google, che può usare cookie e ricevere dati di navigazione.", info: "Informativa cookie", accetta: "Accetta la mappa", rifiuta: "Rifiuta la mappa", chiudi: "Chiudi senza accettare" },
    en: { titolo: "Your privacy", testo: "We use technical storage to operate the site. With your consent we also enable the Google map, which may use cookies and receive browsing data.", info: "Cookie information", accetta: "Accept map", rifiuta: "Reject map", chiudi: "Close without accepting" },
    fr: { titolo: "Votre confidentialité", testo: "Nous utilisons un stockage technique pour le fonctionnement du site. Avec votre accord, nous activons aussi la carte Google, qui peut utiliser des cookies et recevoir des données de navigation.", info: "Informations sur les cookies", accetta: "Accepter la carte", rifiuta: "Refuser la carte", chiudi: "Fermer sans accepter" },
    de: { titolo: "Ihre Privatsphäre", testo: "Wir nutzen technischen Speicher für den Betrieb der Website. Mit Ihrer Zustimmung aktivieren wir auch die Google-Karte, die Cookies verwenden und Navigationsdaten erhalten kann.", info: "Cookie-Informationen", accetta: "Karte akzeptieren", rifiuta: "Karte ablehnen", chiudi: "Ohne Zustimmung schließen" },
    fi: { titolo: "Yksityisyytesi", testo: "Käytämme teknistä tallennusta sivuston toimintaan. Suostumuksellasi otamme käyttöön myös Google-kartan, joka voi käyttää evästeitä ja vastaanottaa selaustietoja.", info: "Evästetiedot", accetta: "Hyväksy kartta", rifiuta: "Hylkää kartta", chiudi: "Sulje hyväksymättä" },
  }[lingua];
  return (
    <Consenso.Provider value={{ mappa: scelta === "accettato", imposta, apri: () => setAperto(true) }}>
      {children}
      {(scelta === "nessuna" || aperto) && (
        <section role="region" aria-label={t.titolo} className="fixed inset-x-3 bottom-3 z-[9999] mx-auto max-w-5xl rounded-2xl border-2 border-inchiostro bg-panna p-5 text-inchiostro shadow-2xl sm:inset-x-6 sm:bottom-6 sm:p-6">
          <button type="button" aria-label={t.chiudi} onClick={() => imposta(false)} className="absolute right-3 top-3 flex h-11 w-11 items-center justify-center rounded-full text-2xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-inchiostro">×</button>
          <h2 className="pr-12 font-hero text-3xl uppercase">{t.titolo}</h2>
          <p className="mt-2 max-w-3xl pr-3 text-sm leading-relaxed sm:text-base">{t.testo} <Link className="font-bold underline underline-offset-4" href={percorso("/cookie")}>{t.info}</Link>.</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <button type="button" onClick={() => imposta(true)} className="min-h-11 rounded-full border-2 border-inchiostro bg-inchiostro px-5 py-2 font-bold text-panna focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-inchiostro">{t.accetta}</button>
            <button type="button" onClick={() => imposta(false)} className="min-h-11 rounded-full border-2 border-inchiostro bg-panna px-5 py-2 font-bold text-inchiostro focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-inchiostro">{t.rifiuta}</button>
          </div>
        </section>
      )}
    </Consenso.Provider>
  );
}
