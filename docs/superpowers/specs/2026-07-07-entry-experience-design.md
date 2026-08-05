# Entry experience + video quality recovery — design

Data: 2026-07-07 · Stato: approvato dall'utente in sessione

## Obiettivi

1. **Entry gate cinematografico**: all'ingresso, schermo nero con contatore 0→100%
   (progresso reale di caricamento), poi scritta grande "READY TO CRAFT?"; si entra
   con click/tap/Invio. Appare a ogni visita.
2. **Recupero qualità video**: la sorgente hero (video.mp4) è nativamente 1280×720;
   upscale AI a 2K via Higgsfield, ri-estrazione frame a 1920×1080, qualità WebP
   più alta, tetto DPR alzato.

## Decisioni prese con l'utente

| Tema | Decisione |
|---|---|
| Qualità video | Upscale AI Higgsfield a 2K, frame 1080p (peso stimato 50-60MB, accettato) |
| Contatore | Progresso reale, non durata fissa |
| Ingresso | Click / tasto (gate esplicito), scritta con pulsazione sottile |
| Frequenza | Ogni visita (nessun sessionStorage) |
| Copy | "READY TO CRAFT?" in inglese |

## Definizione di 100% ("scrub-ready")

Il 100% non è l'intera sequenza (~50-60MB) ma lo stato in cui lo scrub è fluido:

- prime **due** passate della scala di caricamento del FrameStore (stride 24 + stride 6,
  ~25% dei byte)
- tutte le 16 sprite trasparenti della card
- immagine statica dello slot N.01

Il resto continua a scaricarsi in background dopo l'ingresso. È progresso misurato,
mai simulato.

## Componente EntryGate (dentro Experience)

Stati: `loading → ready → leaving → done`.

- Overlay fixed inset-0 z-60, sfondo `#050304` (più profondo del nero pagina).
- **loading**: percentuale grande (Syne bold), hairline di progresso amber→cyan,
  etichetta mono "CALIBRAZIONE SALA DI CONTROLLO".
- **ready**: contatore si dissolve, "READY TO CRAFT?" clamp fino a ~7vw, Syne 800,
  "CRAFT?" in caramello, pulsazione sottile; hint mono "click per entrare".
  L'intero overlay è un button; focus programmatico, Enter/Space nativi.
- **leaving**: scala leggera + dissolvenza ~700ms, poi unmount (`done`).
- Scroll bloccato finché attivo: `lenis.stop()` + `body overflow hidden` +
  `scrollRestoration manual` con reset a 0; sblocco all'ingresso.
- Sostituisce il velo "Preparazione della sequenza".
- Modalità statica (reduced-motion/mobile): stesso gate, il contatore traccia solo
  il poster; le animazioni sono azzerate dalla media query globale già presente.

## Pipeline qualità (una tantum)

1. `video.mp4` → Higgsfield `upscale_video` (2K) → `public/video-2k.mp4`.
2. `extract-frames.mjs`: hero dal file 2K a 1920×1080; fade da `card.mp4` nativo
   1080p (rimosso il downscale); WebP q84 (da tarare misurando il peso reale).
3. Sprite card: invariate (già estratte dal 1080p nativo).
4. `Experience.tsx`: tetto DPR 1.75 → 2.
5. `lib/sequence.ts`: invariato (SOURCE già 1920×1080).

## Verifica

Playwright + Chrome: gate al load con contatore reale, stato ready, ingresso con
click e con Invio, scroll bloccato prima / fluido dopo, scrub e landing invariati,
percorso reduced-motion, zero errori console. Confronto visivo nitidezza frame.

## Note

- Nessun repo git inizializzato nel progetto: spec non committata (file su disco).
- Approcci scartati: splash a livello route (il preload partirebbe troppo tardi);
  libreria animazioni (dipendenza non necessaria).
