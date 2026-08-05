# Refactor hero — da "Sala di Controllo" a POP

Data: 2026-07-22 · Stato: piano di migrazione, decisioni prese in autonomia su mandato dell'utente

## Sintesi

La homepage abbandona il registro "laboratorio di precisione scuro" e passa a uno stile
**pop ad alta saturazione** (vermiglio / mandarino / giallo acido). La meccanica resta
identica: un'unica sequenza di frame scrubbata dallo scroll che termina con un dolce che
cade e **diventa** la card N.01 del catalogo.

Il primo passo della migrazione è la **generazione del nuovo hero video**: tutto il resto
(palette, copy, CSS, ritaratura delle didascalie) dipende dai pixel che ne escono.

---

## Decisioni prese

| Tema | Decisione | Motivo |
|---|---|---|
| Atterraggio card | **Conservato** | È il pezzo di ingegneria più prezioso del progetto |
| Colore di handoff | **Inchiostro `#1a0a06`** (non arancione) | La matte di luminanza di `matte-card.mjs` richiede un fondo scuro; un fondo saturo la inverte |
| Concept del film | **Caduta attraverso campiture di colore** | Scroll ↓ = caduta ↓: gesto utente e gesto del film coincidono. Zero stacchi = scrub senza singhiozzi |
| Sigillo | **Duotono vermiglio ↔ giallo acido** | Complementari caldi, alto contrasto sull'inchiostro; sostituisce ambra/ghiaccio |
| Soggetto | **Resta la tortina pistacchio e lampone** | Verde pistacchio + rosso lampone sono i due colori che tengono contro l'arancione; evita di rifare foto e copy dello slot N.01 |
| Durata hero scroll | **620vh → 520vh** | I benchmark di scroll-scrub moderni collocano la soglia di fatica intorno ai 5 schermate; la caduta continua regge meglio un range più corto e denso |
| Entry gate | **Conservato, ristilizzato** | Serve tecnicamente (precarica i frame); il pop lo assorbe come contatore giallo su vermiglio |
| Catalogo | **Resta su fondo scuro (inchiostro)** | Arco cromatico caldo → inchiostro sul momento di massima attenzione; i sigilli risaltano |

### Architettura cromatica — AGGIORNATA al footage (take 1, 22/07)

Inversione della logica attuale: da *fondo scuro + accenti caldi* a *campiture calde +
inchiostro come accento strutturale*. **I valori sono campionati dai pixel del video
definitivo** (`public/video.mp4`): il footage è la fonte di verità, la UI si adatta.

```
--fucsia:     #eb186b   /* campitura "calda" del film — sostituisce il vermiglio */
--mandarino:  #f76f0b   /* strato intermedio della caduta, hover */
--acido:      #fbc50a   /* campitura d'apertura + accento UI (sostituisce --ghiaccio) */
--panna:      #fff4e6   /* testo su fucsia/inchiostro */
--inchiostro: #160601   /* bg catalogo + colore di handoff (campionato dal frame 0) */
```

Il vermiglio previsto è uscito **fucsia** in generazione: accolto (vedi Addendum). Nota
tecnica a favore: vermiglio e mandarino sarebbero stati quasi indistinguibili sul bordo
netto del wipe; fucsia/mandarino dà il contrasto che il montaggio-per-colore richiede.
Sigillo ottagonale duotone: **fucsia ↔ acido**. `--ghiaccio` e `--caramello` spariscono.

---

## FASE 1 — Generazione del nuovo hero video

Un'unica generazione Seedance 2.0, **15s, 16:9, 2K, senza audio** (la sequenza vive come
frame). Un solo movimento continuo, nessuno stacco.

### Vincoli tecnici non negoziabili

1. Il dolce nell'ultimo frame deve essere **centrato orizzontalmente** (oggi
   `CARD_CROP` è centrato: 616 + 742/2 ≈ 960 su 1920) e **immobile** nell'ultimo secondo.
2. Il fondo degli ultimi ~3 secondi deve arrivare a **inchiostro piatto e uniforme**,
   senza vignettatura, senza gradiente, senza particelle luminose sul bordo.
3. Il dolce **non si sposta** tra il blocco `fade` e il blocco `card`: `CARD_CROP` è un
   rettangolo fisso.
4. Nessun testo, logo, watermark: il testo è tutto DOM.

### Prompt EN

```
Style & Mood: Pop-art food commercial, flat saturated color-blocking, no photographic environment at all. Background is a pure flat field of color that changes by hard vertical wipes as the subject falls: acid yellow, then tangerine orange, then vermilion red, then deep ink brown-black. High-key hard key light from front-left plus a crisp rim, punchy contrast, ultra-saturated grade, zero haze, no cast shadows on the backdrop. Clean 50mm rendering, deep focus, fine 35mm grain. One single continuous shot, no cuts. Dynamic Description: Vertical tracking shot falling with the subject, medium scale — a glossy pistachio-and-raspberry tartlet tumbles slowly downward through empty flat color, rotating gently on its own axis, mirror glaze catching hard speculars, raspberry seeds and pistachio crumb reading sharp. Halved raspberries, pistachio shards and dark chocolate curls fall alongside it at different speeds, drifting in and out of the edges of the frame in parallax, never touching the tartlet. The flat background wipes from acid yellow to tangerine as the fall continues, then to vermilion, each change a hard horizontal edge sweeping upward past the tartlet. The fall decelerates: the loose ingredients drift out of the bottom of frame and are gone, the vermilion field darkens and collapses inward to a flat deep ink brown-black, the tartlet slowing to a dead stop dead-center of frame, upright, no longer rotating. A thin octagonal frame of light draws itself around the motionless tartlet, vermilion along its left half and acid yellow along its right half, closing edge by edge until the outline is complete and a soft glow of the same two colors settles around it. The tartlet holds perfectly still, centered, against the flat ink field for the final second. Static Description: No room, no table, no props, no surface — only flat color fields, the tartlet, and the falling ingredients. Negative constraints: no watermarks, no subtitles, no text overlays, no logos, no hands, no people, no vignette, no lens flare, no gradient in the background, no camera shake at the end.
```

### Prompt ZH

```
风格与氛围：波普风美食广告，高饱和平涂色块，完全不出现写实环境。背景为纯平涂色场，随主体下落以硬边横向扫切依次更替：柠檬黄、橘橙、朱红，最后转为深墨褐黑。高调硬光自左前方打入，配锐利轮廓光，对比强烈，色彩浓艳，无雾无霾，背景不落投影。50mm干净成像，大景深，细腻胶片颗粒。全片一镜到底，无剪辑。动态描述：垂直跟拍随主体下坠，中景——一枚镜面开心果覆盆子小塔在空无一物的平涂色场中缓缓翻落，绕自身轴线轻微自转，镜面淋面反射硬质高光，覆盆子籽粒与开心果碎清晰可辨。半颗覆盆子、开心果碎与黑巧克力卷以不同速度伴随下落，在画面边缘以视差进出，始终不与小塔接触。平涂背景随下落由柠檬黄扫切为橘橙，再转朱红，每次更替都是一道硬边自下而上掠过小塔。坠势渐缓：散落食材漂出画面下缘消失，朱红色场变暗并向内收拢为平涂深墨褐黑，小塔减速直至完全静止于画面正中，端正竖立，不再自转。一道细窄八边形光边在静止的小塔周围自行描绘成形，左半朱红、右半柠檬黄，逐边闭合直至轮廓完整，同色柔光在其四周缓缓沉降。小塔完全静止居中，衬于平涂墨色场，保持最后一秒。静态描述：无房间，无桌面，无道具，无承载面——画面只有平涂色场、小塔与下落的食材。负面约束：无水印、无字幕、无文字叠加、无标志、无人手、无人物、无暗角、无镜头光晕、背景无渐变、结尾无镜头抖动。
```

### Criteri di accettazione del render

Prima di passare alla fase 2, verificare sul file generato:

- [ ] ultimo secondo **immobile**, dolce centrato, fondo inchiostro uniforme
- [ ] nessuna vignettatura né particella luminosa negli ultimi 3s (romperebbe la matte)
- [ ] contorno ottagonale del sigillo leggibile e **chiuso** nell'ultimo frame
- [ ] nessuna mano, nessun testo
- [ ] i wipe di colore sono a bordo netto, non gradienti

Se il render non passa, rigenerare — **non** correggere a valle: ogni difetto qui si
moltiplica per 500 frame.

---

## FASE 2 — Pipeline asset

1. Upscale a 2K (Higgsfield `upscale_video`) → `public/hero-pop-2k.mp4`.
2. Segmentazione del nuovo film nei tre blocchi che `sequence.ts` si aspetta:

   | Blocco | Sorgente | Frame attesi | Ruolo |
   |---|---|---|---|
   | `hero/` | 0 → ~10.5s | ~315 | la caduta attraverso i colori |
   | `fade/` | ~10.5 → ~13.5s | ~90 | collasso del colore verso l'inchiostro |
   | `card/` | ~13.5 → 15s | 16 (sottocampionati) | chiusura del sigillo, fondo inchiostro |

3. `extract-frames.mjs`: aggiornare i tagli temporali e il nome del file sorgente.
4. Job Higgsfield di background-removal sui frame del blocco `card`, poi
   `matte-card.mjs` invariato → nuovi sprite trasparenti + `meta.json`.
5. Riportare il nuovo `CARD_CROP` da `meta.json` in `lib/sequence.ts`.
6. Aggiornare `HERO_FRAMES` / `FADE_FRAMES`; ricalcolare `FULL_PORTION`
   (= `FULL_FRAMES / (FULL_FRAMES + CARD_SPRITES)` arrotondato come oggi a ~0.94).

**Rischio principale:** se il glow del sigillo è troppo tenue, la matte di luminanza lo
perde e il bordo neon sparisce dagli sprite. Mitigazione: nel prompt il glow è esplicito
("soft glow settles around it"); in caso di perdita, alzare la soglia luma in
`matte-card.mjs` invece di rigenerare il video.

---

## FASE 3 — Design system

1. `globals.css`: nuova palette in `:root` e `@theme inline`; rimozione di `--ghiaccio`,
   `--caramello`, `--nero`, `--marmo*` (o loro rimappatura).
2. `.holo-seal::before`: duotono vermiglio → acido al posto di caramello → ghiaccio.
3. `.holo-glow`: le due radiali passano a vermiglio / acido.
4. `.holo-media img`: rivedere il `mask-image` radiale — le foto prodotto sono su nero,
   l'inchiostro è leggermente più caldo.
5. `::selection`: acido su inchiostro.
6. **Aggiunta pop:** overlay grana/halftone leggerissimo a livello `body` — è ciò che
   separa un pop-art credibile da un semplice fondo colorato.

Tipografia invariata (Syne / Grotesk / IBM Plex Mono): Syne in `font-black` con tracking
negativo è già un display pop. Cambia l'uso, non il font.

---

## FASE 4 — Codice

1. `Experience.tsx:198` — costante `NERO` → `INCHIOSTRO = "#1a0a06"` (il canvas deve
   restare indistinguibile dal fondo pagina).
2. `Experience.tsx:463` — `h-[620vh]` → `h-[520vh]`.
3. `Experience.tsx:301` — rivedere `landY = slotDocTop - vh * 0.32` dopo il cambio di
   altezza: è la quota a cui la card si posa nello slot.
4. Ritaratura delle finestre `in`/`out` delle didascalie sui nuovi beat della caduta
   (le fasi del vecchio film non esistono più).
5. Entry gate: fondo `#050304` → vermiglio pieno; hairline di progresso vermiglio→acido
   → **acido su vermiglio**; contatore in `font-black`.

Non si tocca: `FrameStore`, la logica di scrub, l'interpolazione del rect, Lenis,
`matte-card.mjs`, la struttura di `extract-frames.mjs`.

---

## FASE 5 — Copy

Il registro "laboratorio di precisione" è nemico del pop: va riscritto, non ritinteggiato.

| Dove | Oggi | Direzione |
|---|---|---|
| `Experience.tsx:425` | "Calibrazione sala di controllo" | conto alla rovescia secco, mono, tutto maiuscolo |
| `Experience.tsx:449` | "READY TO CRAFT?" | claim pop corto, imperativo |
| `Experience.tsx:476-485` | "Sala di controllo · Delsigel Italia" / "Il dolce, orchestrato." | h1 breve, verbo d'azione, niente subordinate |
| `Experience.tsx:47-92` | 4 didascalie "Fase 01 · Selezione"… | 3 didascalie sui beat della caduta (giallo / arancio / sigillo) |
| `Experience.tsx:616-631` | Calibrazione / Composizione / Sigillo | tre parole sole, senza spiegazione tecnica |
| `lib/products.ts` | "Chantilly al caramello, scaglie di cioccolato fondente" | note brevi, dirette, senza lessico da menu stellato |

Le sigle `N.01…N.06` restano: la numerazione seriale è pop quanto è tecnica.

**Aggiunta ad alto impatto:** una fascia marquee a scorrimento infinito (acido su
vermiglio) tra hero e catalogo. È l'elemento che, nei siti pop contemporanei, fa più
lavoro per unità di codice.

---

## FASE 6 — Mobile (da valutare a valle)

Oggi mobile e reduced-motion ricevono un poster statico (`StaticHero`). Con una hero
così centrale, vale la pena valutare una sequenza mobile ridotta (~60 frame, 720p
verticale) invece di un fermo immagine. Fuori dallo scope del primo giro, ma da non
perdere di vista: è la metà del traffico.

---

## ADDENDUM 22/07 sera — Take 1 accettato con workaround

Il video definitivo è `public/video.mp4` (1920×1080, 24fps, **361 frame**, 15.04s),
generato su fal.ai come **ascesa** dal master still
(`assets/catalog/dolci/golosone/golosone-con-cioccolato/golosone-al-cioccolato-con-granella/master.png`,
frame 0 pinnato al pixel) e riprodotto **al
contrario** dal sito. Non è rigenerabile a breve: i tre difetti del take si gestiscono
in pipeline. Questo addendum **sostituisce** i punti 2-6 di FASE 2.

### Difetti e workaround

1. **Morph "ciambella col buco" nella fase centrale (gen t≈7-12).** Il dolce pieno
   diventa un ring donut a metà film. Workaround, combinati:
   - **Curva di scrub non lineare**: la mappa progress→frame diventa piecewise-linear
     (`FRAME_CURVE` in `sequence.ts`); la finestra incriminata riceve ~metà dei pixel
     di scroll che riceverebbe in mappatura uniforme — passa in fretta sotto il dito.
   - **Copertura editoriale**: la didascalia grande della fase mandarino è posizionata
     centrale/ingombrante, per catturare l'occhio nella finestra debole.
   - **Riframing narrativo**: in playback il buco *si chiude* durante la caduta — il
     dolce "si completa mentre cade". Il registro pop tollera il morph; l'identità è
     perfetta dove conta (dolce grande, arresto, card).
2. **Magenta al posto del vermiglio.** Accolto e promosso a scelta di palette
   (`--fucsia #eb186b`, campionato). La UI non era ancora stata scritta: costo zero.
3. **Hold iniziale ~1s invece di 2s.** Non-problema: la curva di scrub pinna l'ultimo
   ~8% del range hero sul frame finale (= master still); il sigillo ottagonale si
   disegna in quel tratto. Nessuna duplicazione di file necessaria.

### Pipeline semplificata (sostituisce FASE 2 punti 2-6)

- **Un solo blocco** di 361 frame WebP in `public/frames/pop/`, numerati in **ordine di
  playback** (playback k = gen 362−k): `f_0001` = giallo/dolce piccolo, `f_0361` =
  master still su inchiostro. Estrazione: `scripts/extract-pop-frames.mjs`.
- I blocchi `fade/` e `card/` **spariscono** (il vecchio `hero/fade/card` resta su disco
  finché il refactor di `Experience` non atterra, poi si elimina).
- `matte-card.mjs` e il job di background-removal: **eliminati**. Lo sprite della card è
  **uno solo**: ritaglio del frame 361 (fondo inchiostro scuro → matte di luminanza
  banale). `CARD_CROP` si calcola dal bbox del ritaglio + margine glow.
- Il sigillo ottagonale è **disegnato dal codice** (stroke `--fucsia`↔`--acido` sulla
  geometria del clip-path già esistente), sia sulla card volante sia nella griglia.
- `POSTER` (statico/reduced-motion) = `f_0361`.
- 24fps ≠ 30fps del vecchio film: irrilevante, lo scrub è position-driven.

## Ordine di esecuzione

```
1. Generare il video          ← BLOCCANTE, tutto dipende da qui
2. Validare i criteri di accettazione
3. Pipeline asset → frame + sprite + CARD_CROP
4. Palette + CSS (parallelizzabile con 3)
5. Costanti + ritaratura scrub
6. Copy (parallelizzabile con 5)
7. QA scrub: avanti/indietro, resize, DPR, reduced-motion
```

Le fasi 4 e 6 non dipendono dal video e possono partire subito.
