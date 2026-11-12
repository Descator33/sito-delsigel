/* eslint-disable @typescript-eslint/no-require-imports -- Harness CommonJS per eseguire e isolare i moduli server TypeScript. */
const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs"),
  ts = require("typescript"),
  Module = require("node:module"),
  path = require("node:path");
// Esegue i moduli condivisi senza avviare Next o inviare email reali.
const resolve = Module._resolveFilename,
  load = Module._load;
Module._resolveFilename = function (id, parent, ...args) {
  return resolve.call(
    this,
    id.startsWith("@/") ? path.resolve(__dirname, "..", id.slice(2)) : id,
    parent,
    ...args,
  );
};
Module._load = function (id, ...args) {
  if (id === "next/headers")
    return {
      headers: async () =>
        new Headers({ origin: "https://configuratore.example" }),
    };
  return load.call(this, id, ...args);
};
require.extensions[".ts"] = (m, f) =>
  m._compile(
    ts.transpileModule(fs.readFileSync(f, "utf8"), {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2020,
        esModuleInterop: true,
      },
    }).outputText,
    f,
  );
const c = require("../lib/configuratore.ts");
test("tutte le ricette, prefissi e lingue restano coerenti", () => {
  for (const ricetta of c.DATASET.combinazioni) {
    const a = [
      ricetta.base,
      ricetta.farcitura,
      ricetta.credenza,
      ricetta.finitura,
    ];
    for (let n = 0; n <= 4; n++)
      assert.equal(c.parseScelta(a.slice(0, n)).tipo, "render");
    for (const lang of ["it", "en", "fr", "de", "fi"])
      assert.equal(
        c.statoDaPathname("/" + lang + "/configuratore/" + a.join("/")).prodotto
          .sku,
        a.join("--"),
      );
    assert.equal(c.validaStato({ ...ricetta, pedane: 1 }).ok, true);
  }
});
test("mantiene ingredienti compatibili e include le opzioni uniche", () => {
  assert.deepEqual(c.sceltaCompatibile([]), ["nuvola"]);
  assert.deepEqual(
    c.sceltaCompatibile(["nuvola", "cioccolato", "fragola", "zucchero-a-velo"]),
    ["nuvola", "cioccolato", "fragola", "zucchero-a-velo"],
  );
  assert.deepEqual(
    c.sceltaCompatibile([
      "nuvola",
      "cioccolato",
      "kinder-bueno-dark",
      "zucchero-a-velo",
    ]),
    ["nuvola", "cioccolato"],
  );
  assert.deepEqual(c.sceltaCompatibile(["nuvola", "crema", "fragola"]), [
    "nuvola",
    "crema",
    "fragola",
    "zucchero-a-velo",
  ]);
});
test("peso preciso e quantità non valida respinta", () => {
  assert.equal(c.quantita("nuvola", 1).peso_kg, 235.2);
  assert.equal(c.quantita("nuvola", 3).peso_kg, 705.6);
  for (const pedane of [0, -1, 1.5, Infinity, 10001])
    assert.equal(
      c.validaStato({ ...c.DATASET.combinazioni[0], pedane }).errore,
      "QUANTITA_NON_VALIDA",
    );
});
test("precaricamento: richieste condivise e riprova dopo errore", async () => {
  const {
    scaricaFoto,
    preparaFoto,
  } = require("../lib/configuratore/caricamento.ts");
  const oldFetch = global.fetch,
    oldImage = global.Image;
  let chiamate = 0,
    decodifiche = 0;
  global.fetch = async () => {
    chiamate++;
    return new Response("image", { status: 200 });
  };
  global.Image = class {
    async decode() {
      assert.equal(this.src, "/decode.webp");
      decodifiche++;
    }
  };
  try {
    await Promise.all([
      scaricaFoto("/condivisa.webp"),
      scaricaFoto("/condivisa.webp"),
    ]);
    assert.equal(chiamate, 1);
    global.fetch = async () => {
      chiamate++;
      throw new Error("offline");
    };
    await assert.rejects(scaricaFoto("/riprova.webp"));
    global.fetch = async () => {
      chiamate++;
      return new Response("image", { status: 200 });
    };
    await scaricaFoto("/riprova.webp");
    assert.equal(chiamate, 3);
    await preparaFoto("/decode.webp");
    assert.equal(decodifiche, 1);
  } finally {
    global.fetch = oldFetch;
    global.Image = oldImage;
  }
});

test("i cinque dizionari coprono il catalogo e i controlli nuovi", () => {
  const { dizionario } = require("../lib/i18n-configuratore/dizionario.ts");
  for (const lingua of ["it", "en", "fr", "de", "fi"]) {
    const d = dizionario(lingua);
    assert.ok(d.configuratore.esperienza.caricamento);
    assert.ok(d.configuratore.esperienza.invioFallito);
    for (const gruppo of ["farciture", "credenza", "finiture"])
      for (const voce of c.DATASET[gruppo])
        assert.ok(d.prodotti[gruppo][voce.id]);
    assert.ok(
      !JSON.stringify(d.configuratore.comeFunziona).includes("pistacchio"),
    );
  }
});
