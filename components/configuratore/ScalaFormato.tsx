"use client";

import {
  fmtKg,
  fmtNumero,
  type Base,
  type Combinazione,
} from "@/lib/configuratore";

/**
 * La catena logistica tradotta in una scala leggibile, dal pezzo alla
 * pedana, con i pesi calcolati sulla grammatura di quella farcitura.
 * Nessuna grafica: 3 o 4 righe in monospaziato, il carattere che tutto il
 * sito usa per i dati tecnici. Dove il vassoio non esiste (Intriko Midi,
 * Lussekatt, Klejner) la scala ha tre righe e non si inventa nulla.
 */
export function ScalaFormato({
  base,
  comb,
}: {
  base: Base;
  comb: Combinazione;
}) {
  const p = base.packaging;

  const righe: [string, string][] = [];

  if (p.vassoi_per_cartone != null && p.pezzi_per_vassoio != null) {
    righe.push(["1 vassoio", `${p.pezzi_per_vassoio} pezzi`]);
  }

  righe.push([
    "1 cartone",
    [
      p.vassoi_per_cartone != null ? `${p.vassoi_per_cartone} vassoi` : null,
      `${fmtNumero(p.pezzi_per_cartone)} pezzi`,
      fmtKg(comb.peso_cartone_kg),
    ]
      .filter(Boolean)
      .join(" · "),
  ]);

  righe.push([
    "1 pedana",
    [
      `${p.cartoni_per_pedana} cartoni` +
        (p.strati_per_pedana != null && p.cartoni_per_strato != null
          ? ` su ${p.strati_per_pedana} strati da ${p.cartoni_per_strato}`
          : ""),
      `${fmtNumero(p.pezzi_per_pedana)} pezzi`,
      fmtKg(comb.peso_pedana_kg),
    ].join(" · "),
  ]);

  return (
    <div>
      <h3 className="type-label text-inchiostro/45">Il formato</h3>
      <dl className="mt-3 border-t border-linea font-mono text-[13px] leading-relaxed">
        {righe.map(([unita, dettaglio]) => (
          <div
            key={unita}
            className="grid grid-cols-[90px_1fr] gap-4 border-b border-linea py-2.5"
          >
            <dt className="font-bold">{unita}</dt>
            <dd className="text-inchiostro/75">{dettaglio}</dd>
          </div>
        ))}
      </dl>
      {p.cartone_dichiarato_a_peso && p.peso_cartone_kg != null && (
        <p className="mt-2 text-[13px] text-inchiostro/55">
          Il listino dichiara il cartone a peso ({fmtKg(p.peso_cartone_kg)}):
          il conteggio dei pezzi è derivato dai vassoi.
        </p>
      )}
      <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.08em] text-inchiostro/35">
        Dal listino: “{p.testo_originale}”
      </p>
    </div>
  );
}
