# Delsigel

Sito del laboratorio Delsigel: vetrina della gamma dolce e salata, catalogo
stampato 2026/2027 da sfogliare, e un configuratore che lascia comporre al
cliente il proprio vassoio e mandarne la richiesta di quotazione.

Next.js 16 (App Router) · React 19 · Tailwind CSS 4 · TypeScript.

## Avvio

```bash
npm install
npm run dev
```

Il sito è su http://localhost:3000.

Per il form contatti serve una configurazione: senza, la pagina **non finge**
di aver spedito — valida, dichiara che il canale non è attivo e offre un
`mailto:` già compilato. Le variabili vanno in `.env.local` (non versionato):

| Variabile | Obbligatoria | Cosa contiene |
| --- | --- | --- |
| `RESEND_API_KEY` | sì | chiave API del progetto Resend |
| `CONTATTI_MITTENTE` | sì | mittente su un dominio **verificato** in Resend |
| `CONTATTI_DESTINATARIO` | no | dove arrivano le richieste (default `info@delsigel.it`) |

Il dettaglio — difese antispam, come cambiare provider — sta in
[`docs/contatti.md`](docs/contatti.md).

## Comandi

| Comando | Cosa fa |
| --- | --- |
| `npm run dev` | server di sviluppo |
| `npm run build` | build di produzione. Il `prebuild` valida il dataset del configuratore: se un conto non chiude, il build fallisce e non pubblica |
| `npm start` | serve la build |
| `npm run lint` | ESLint |

## Le pagine

| Rotta | Contenuto |
| --- | --- |
| `/` | home: gamma dolce, catalogo stampato, linea salata, invito al configuratore |
| `/chi-siamo` | la storia del laboratorio e la squadra |
| `/configuratore/[[...scelta]]` | composizione del vassoio, un passo per segmento di URL |
| `/contatti` | form con invio server-side |

## Com'è organizzato

```
app/          rotte App Router, Server Action di contatti e configuratore
components/   UI per sezione (catalog/, chi-siamo/, configuratore/, contatti/, home/)
lib/          modelli dati e hook: catalogo, configuratore, contatti
scripts/      pipeline immagini e validazione dataset (Node, eseguiti a mano)
assets/       sorgenti del catalogo prodotti, fuori da public/
public/       ciò che il sito serve davvero
docs/         note di progetto
```

Due cose non ovvie:

- **Il catalogo nasce da un manifest.** `assets/catalog/manifest.json` è la
  fonte di verità dell'albero prodotti; [`lib/catalog.ts`](lib/catalog.ts) ne
  deriva il modello UI, distinguendo le viste fotografiche (aperto/chiuso) dai
  prodotti veri e dai set a tre gusti.
- **Le foto dei prodotti sono generate.** Gli still in `public/products/` sono
  relight degli scatti reali, scontornati su trasparente: sulla card il dolce
  galleggia sopra la campitura d'accento.

## Gli script

Non girano nel build (tranne il primo) e vanno lanciati a mano quando arriva
materiale nuovo. Ognuno ha in testa al file la spiegazione delle sue scelte.

| Script | A cosa serve |
| --- | --- |
| `valida-configuratore.mjs` | verifica `lib/configuratore/dati-dolci.json` contro la specifica. Gira come `prebuild` |
| `normalizza-scala-foto.mjs` | porta le foto del configuratore alla stessa scala visiva. Idempotente |
| `scaffold-catalog.mjs` | crea l'albero di `assets/catalog/` e il manifest. Idempotente |
| `product-variants.mjs` | manifest delle varianti da generare, una riga per immagine |
| `cut-product.mjs` | scontorna il render su fondo nero → WebP con alpha in `public/products/` |
| `extract-pop-frames.mjs` | estrae i frame del footage pop (richiede `ffmpeg`) |
| `cut-card.mjs` | dal frame finale ricava card, piatto e metadati della sequenza pop |

I media sorgente della pipeline pop — il footage e i frame estratti — non sono
versionati: sono file di lavorazione, non prodotto. Chi deve rigenerarli parte
dall'originale.

## Convenzioni

Il codice è commentato in italiano e i commenti spiegano il *perché* di una
scelta, non cosa fa la riga sotto. Nomi di dominio in italiano (`Alzata`,
`Riepilogo`, `PassoFarcitura`), API e primitive in inglese.

Prima di scrivere codice leggi [`AGENTS.md`](AGENTS.md): questa versione di
Next.js ha API e convenzioni che differiscono da quelle più diffuse, e la
documentazione di riferimento è quella dentro `node_modules/next/dist/docs/`.
