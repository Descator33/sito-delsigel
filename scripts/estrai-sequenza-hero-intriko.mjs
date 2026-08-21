/**
 * Deriva la moviescroller della hero Intriko da un master video 4K.
 *
 * Il frame sorgente 144 (l'ultimo del master Kling) viene escluso di
 * proposito: in chiusura la UI mostra la still approvata, non un fotogramma
 * ricompresso del video.
 *
 * Uso:
 *   node scripts/estrai-sequenza-hero-intriko.mjs /percorso/master.mp4
 */
import { execFileSync } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { basename, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const SORGENTE = process.argv[2];
const DESTINAZIONE = join(ROOT, "public", "hero", "sequence", "intriko-v1");
const TEMPORANEA = mkdtempSync(join(tmpdir(), "delsigel-intriko-sequence-"));

if (!SORGENTE || !existsSync(SORGENTE)) {
  console.error(
    "Indica il master video esistente: node scripts/estrai-sequenza-hero-intriko.mjs /percorso/video.mp4",
  );
  process.exit(1);
}

const varianti = [
  {
    id: "desktop",
    fps: 15,
    frames: 90,
    width: 1920,
    height: 1080,
    quality: 82,
    filtro:
      "trim=end_frame=144,setpts=PTS-STARTPTS,fps=15,scale=1920:1080:flags=lanczos",
  },
  {
    id: "mobile",
    fps: 12,
    frames: 72,
    width: 810,
    height: 1440,
    quality: 80,
    filtro:
      "trim=end_frame=144,setpts=PTS-STARTPTS,fps=12,crop=1215:2160:2100:0,scale=810:1440:flags=lanczos",
  },
];

async function converti(variante) {
  const pngDir = join(TEMPORANEA, variante.id);
  const webpDir = join(DESTINAZIONE, variante.id);
  mkdirSync(pngDir, { recursive: true });
  mkdirSync(webpDir, { recursive: true });

  console.log(`${variante.id}: estrazione ${variante.width}x${variante.height}…`);
  execFileSync(
    "ffmpeg",
    [
      "-hide_banner",
      "-loglevel",
      "error",
      "-i",
      SORGENTE,
      "-an",
      "-vf",
      variante.filtro,
      "-fps_mode",
      "passthrough",
      join(pngDir, "frame-%04d.png"),
    ],
    { stdio: "inherit" },
  );

  const png = readdirSync(pngDir)
    .filter((file) => file.endsWith(".png"))
    .sort();

  if (png.length !== variante.frames) {
    throw new Error(
      `${variante.id}: attesi ${variante.frames} frame, trovati ${png.length}`,
    );
  }

  let cursore = 0;
  const lavoratori = Array.from({ length: 6 }, async () => {
    while (cursore < png.length) {
      const indice = cursore++;
      const ingresso = join(pngDir, png[indice]);
      const uscita = join(
        webpDir,
        `${basename(png[indice], ".png")}.webp`,
      );
      await sharp(ingresso)
        .webp({
          quality: variante.quality,
          effort: 4,
          smartSubsample: true,
        })
        .toFile(uscita);
    }
  });

  await Promise.all(lavoratori);
}

try {
  const radiceConsentita = join(ROOT, "public", "hero", "sequence");
  if (dirname(DESTINAZIONE) !== radiceConsentita) {
    throw new Error("Destinazione della pipeline non valida");
  }

  rmSync(DESTINAZIONE, { recursive: true, force: true });
  mkdirSync(DESTINAZIONE, { recursive: true });

  for (const variante of varianti) {
    await converti(variante);
  }

  writeFileSync(
    join(DESTINAZIONE, "manifest.json"),
    `${JSON.stringify(
      {
        version: "intriko-v1",
        source: basename(SORGENTE),
        sourceFrames: 145,
        excludedSourceFrame: 144,
        endFrame: "/hero/hero-intriko-vortice.webp",
        variants: Object.fromEntries(
          varianti.map((variante) => [
            variante.id,
            {
              frames: variante.frames,
              fps: variante.fps,
              width: variante.width,
              height: variante.height,
              format: "webp",
            },
          ]),
        ),
      },
      null,
      2,
    )}\n`,
  );

  console.log(`Sequenza pronta in ${DESTINAZIONE}`);
} finally {
  rmSync(TEMPORANEA, { recursive: true, force: true });
}
