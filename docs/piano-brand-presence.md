# Piano brand presence — Delsigel ovunque, non solo negli slogan

*Redatto il 20/08/2026, dopo l'audit completo del sito. Obiettivo: il visitatore
deve sapere in ogni momento che sta parlando con Delsigel Italia — oggi il
brand compare quasi solo in metadata, aria-label e footer.*

## Il logo

Decisione 20/08: si torna al **marchio storico Delsigel** (emblema a mandorla
con vortice + wordmark "delsigel", marrone `#56340F`), ripulito a 2K
dall'originale 114px di delsigel.it. Il logo "Vortice Corallo" 2026
(`components/Logo.tsx` + `logo-paths.ts`) viene sostituito nelle superfici del
sito; l'asset resta nel repo come archivio.

Asset nuovi in `public/brand/`:
- `logo-storico.png` — RGBA 2K, marrone brand, sfondo trasparente
- il colore si adatta al contesto via CSS `mask-image` + `currentColor`
  (componente `LogoStorico`), come faceva l'SVG inline.

## Fase 1 — Hero (si parte da qui)

La hero è il buco più grave: zero occorrenze del brand, e il commento in
`components/Hero.tsx:19-22` promette un logo che non c'è. La metà sinistra
della foto è un campo crema pensato apposta per il blocco brand.

1. **Logo nella hero** sopra l'H1: marchio storico, entra con la stessa
   regia scaglionata delle righe (indice −1), cacao su desktop, panna su
   mobile (campo scuro).
2. **Header**: logo da 13–15px → almeno 22–26px, marchio storico.
3. L'alt della foto hero cita il prodotto ma non il brand → riscrivere.

## Fase 2 — Identità tecnica (SEO/social, mezza giornata)

Oggi ogni condivisione WhatsApp/LinkedIn è muta e il favicon `.ico` è quello
di default di create-next-app.

- `metadataBase` + `openGraph` completo + `twitter` card in `app/layout.tsx`
- `opengraph-image` (logo storico su campo panna) per tutte le route
- sostituire `app/favicon.ico` e allineare `app/icon.svg` al marchio storico
- JSON-LD `Organization`/`LocalBusiness` — i dati sono già in `lib/contatti.ts`
- `sitemap.ts`, `robots.ts`, `manifest.webmanifest`

## Fase 3 — Il nome in pagina (1 giorno)

- **StoryPreview**: oggi contiene l'unica menzione visibile di "Delsigel" in
  home, in un corpo testo. Alzarla: eyebrow "Delsigel · dal 2011" o wordmark
  nel titolo.
- **Marquee brandizzato** (`components/Marquee.tsx`): esiste già, è montato
  solo su /chi-siamo. Portarlo in home tra catalogo e chiusura.
- **Catalogo**: il brand c'è solo in un `aria-label`. Intestare i capitoli
  "I dolci Delsigel" / "I salati Delsigel" o sigillo-emblema sulle card.
- **Footer**: già buono, passa al marchio storico. Fix link rotti
  (`/#storia` → `/#storia-preview`, `/#come-si-crea` inesistente).
- **/contatti**: hero "Contatti." anonima → "Parliamo. — Delsigel Italia".

## Fase 4 — Brand system (2–3 giorni, da discutere)

- L'accento primario della UI è `--fucsia`, che non è un colore del marchio:
  decidere se il marrone storico entra nel sistema (es. `--bruno: #56340F`)
  e dove sostituisce cacao/corallo.
- Sigillo/emblema come elemento ricorrente: watermark nelle sezioni, timbro
  sulle card prodotto, chiusura delle pagine ("firma" a fine scroll).
- Pagine legali placeholder (`href="#"`) e nomi team placeholder su
  /chi-siamo: da riempire, sono parte della credibilità del brand.
- Vettorializzare il logo storico (il PNG 2K va bene per web, un SVG serve
  per stampa/insegne).

## Metriche di verifica

Dopo la fase 3, in ogni viewport-schermata della home deve esserci almeno
una occorrenza visibile del marchio (logo, wordmark o nome nel testo).
Oggi: 1 su ~7.
