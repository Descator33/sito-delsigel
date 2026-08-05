"use client";

import {
  fmtKg,
  fmtNumero,
  quantita,
  type Base,
  type Combinazione,
} from "@/lib/configuratore";

const INPUT_CLS =
  "w-24 rounded-2xl border border-linea bg-carta px-4 py-3 text-center font-mono text-lg font-bold text-inchiostro outline-none transition-colors focus:border-corallo-scena focus:ring-2 focus:ring-corallo-scena/25";

/**
 * L'unica decisione del passo 3: quante pedane. Il minimo si dichiara
 * PRIMA, in quantità e non in divieto, legato al campo con
 * aria-describedby; la traduzione in cartoni, pezzi e chilogrammi si
 * aggiorna in tempo reale in una regione live cortese — è il modo in cui
 * un buyer verifica l'ordine di grandezza prima di premere invio.
 *
 * Sotto il minimo il messaggio propone la correzione invece di negare, e
 * resta non bloccante fino all'invio: la validazione che conta sta in
 * validaStato, rieseguita nella Server Action.
 */
export function CampoPedane({
  base,
  comb,
  pedane,
  onCambia,
}: {
  base: Base;
  comb: Combinazione;
  pedane: number | "";
  onCambia: (v: number | "") => void;
}) {
  const minimo = comb.ordine_minimo_pedane;
  const valida = typeof pedane === "number" && Number.isInteger(pedane) && pedane >= 1;
  const q = valida ? quantita(comb.base, comb.farcitura, pedane) : null;
  const sottoMinimo = valida && minimo != null && pedane < minimo;

  return (
    <div>
      <h3 className="type-label text-inchiostro/45">La quantità</h3>

      <div className="mt-3 flex flex-wrap items-center gap-4">
        <label htmlFor="pedane" className="text-sm font-semibold">
          Pedane
        </label>
        <input
          id="pedane"
          name="pedane-visibile"
          type="number"
          min={1}
          step={1}
          inputMode="numeric"
          value={pedane}
          onChange={(e) => {
            const v = e.target.value;
            onCambia(v === "" ? "" : Math.floor(Number(v)));
          }}
          aria-describedby={minimo != null ? "vincolo-minimo" : undefined}
          className={INPUT_CLS}
        />
        {/* traduzione live lungo la catena logistica, dalla stessa
            funzione quantita() che comporrà il payload */}
        <p aria-live="polite" className="font-mono text-[13px] text-inchiostro/75">
          {q
            ? `= ${fmtNumero(q.cartoni)} cartoni · ${fmtNumero(q.pezzi)} pezzi · ${fmtKg(q.peso_kg)}`
            : "Indica un numero intero di pedane: è l'unità con cui viaggia il prodotto."}
        </p>
      </div>

      {minimo != null && (
        <p id="vincolo-minimo" className="mt-3 text-[13px] text-inchiostro/65">
          Questa referenza si ordina da <strong>{minimo} pedane</strong>
          {comb.ordine_minimo_pezzi != null &&
            `, pari a ${fmtNumero(comb.ordine_minimo_pezzi)} pezzi`}
          .
        </p>
      )}

      {sottoMinimo && minimo != null && (
        <div
          role="status"
          className="mt-4 rounded-[18px] border border-linea border-l-[4px] border-l-oro bg-carta px-5 py-4 text-[13px] leading-relaxed"
        >
          <p>
            Con {pedane} {pedane === 1 ? "pedana sei" : "pedane sei"} sotto il
            minimo di {minimo}.{" "}
            <button
              type="button"
              onClick={() => onCambia(minimo)}
              className="font-semibold underline decoration-2 underline-offset-2 transition-colors hover:text-corallo-scena focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-corallo-scena"
            >
              Porta a {minimo} pedane
            </button>{" "}
            oppure, se ti serve un quantitativo più piccolo,{" "}
            <a
              href={`mailto:info@delsigel.it?subject=${encodeURIComponent(
                `Quantitativo sotto il minimo — ${base.nome}`
              )}&body=${encodeURIComponent(
                `Sarei interessato a ${base.nome} (${comb.sku}) per un quantitativo` +
                  ` inferiore alle ${minimo} pedane di ordine minimo. È possibile parlarne?`
              )}`}
              className="font-semibold underline decoration-2 underline-offset-2 transition-colors hover:text-corallo-scena focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-corallo-scena"
            >
              scrivi al commerciale
            </a>
            : un contatto vale più di un rifiuto.
          </p>
        </div>
      )}
    </div>
  );
}
