/**
 * Un campo del form: etichetta, controllo, errore.
 *
 * Un componente solo per input e textarea, distinti da `multiriga`: due
 * componenti gemelli si sarebbero già disallineati sul primo ritocco agli
 * stati di errore, che è il punto in cui il disallineamento fa danno.
 *
 * L'accessibilità è tutta qui dentro e non a carico di chi lo usa:
 * l'`htmlFor` è legato all'`id`, `aria-invalid` marca il controllo,
 * `aria-describedby` punta al testo dell'errore quando c'è (e sparisce
 * quando non c'è — un `aria-describedby` che indica un nodo assente viene
 * semplicemente ignorato, ma sporca il DOM e confonde chi legge il codice).
 *
 * L'errore non è affidato al colore: c'è sempre il testo, e il bordo si
 * ispessisce oltre a virare al rosso (`.pop-campo[aria-invalid]`).
 */
type Comune = {
  id: string;
  nome: string;
  etichetta: string;
  segnaposto: string;
  errore?: string;
  richiesto?: boolean;
  autoComplete?: string;
  maxLength?: number;
  /**
   * Il valore rimandato indietro dall'action dopo un errore. Serve a
   * sopravvivere al reset automatico che React 19 fa sui form non
   * controllati appena l'action finisce — vedi `ContactForm`.
   */
  defaultValue?: string;
  /** per spegnere l'errore appena la persona ricomincia a scrivere */
  onInput?: () => void;
};

type Props =
  | (Comune & { multiriga?: false; tipo?: "text" | "email" })
  | (Comune & { multiriga: true; righe?: number });

export function FormField(props: Props) {
  const {
    id,
    nome,
    etichetta,
    segnaposto,
    errore,
    richiesto,
    autoComplete,
    maxLength,
    defaultValue,
    onInput,
  } = props;
  const idErrore = `${id}-errore`;

  const comuni = {
    id,
    name: nome,
    placeholder: segnaposto,
    required: richiesto,
    autoComplete,
    maxLength,
    defaultValue,
    onInput,
    "aria-invalid": errore ? (true as const) : undefined,
    "aria-describedby": errore ? idErrore : undefined,
    className: "pop-campo",
  };

  return (
    <div className="grid gap-2">
      {/* 14px fin sotto i 768px, 12px sopra: il riferimento vuole
          un'etichetta minuta, ma su uno schermo da telefono un
          maiuscoletto spaziato sotto i 14px smette di essere leggibile.
          La soglia è `md` e non `sm` perché è a 768px che la pagina
          smette di essere «telefono». */}
      <label
        htmlFor={id}
        className="text-[14px] font-bold uppercase tracking-[0.06em] text-inchiostro md:text-[12px]"
      >
        {etichetta}
        {!richiesto && (
          <span className="ml-1.5 font-normal normal-case tracking-normal text-inchiostro/45">
            (facoltativo)
          </span>
        )}
      </label>

      {props.multiriga ? (
        <textarea {...comuni} rows={props.righe ?? 5} />
      ) : (
        <input {...comuni} type={props.tipo ?? "text"} />
      )}

      {errore && (
        <p id={idErrore} className="text-[14px] font-semibold leading-snug text-rosso">
          {errore}
        </p>
      )}
    </div>
  );
}
