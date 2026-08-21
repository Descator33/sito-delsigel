import gsap from "gsap";

export type GruppoCaptionHome = {
  occhielli: HTMLElement[];
  titoli: HTMLElement[];
  copy: HTMLElement[];
  cta: HTMLElement[];
  tutti: HTMLElement[];
};

type TimelineGSAP = ReturnType<typeof gsap.timeline>;

const SELETTORE = "[data-home-caption]";
const TABINDEX_ORIGINALE = "data-home-caption-tabindex-originale";

/** Raccoglie soltanto i target interni alle maschere della sezione. */
export function raccogliCaptionHome(scope: ParentNode): GruppoCaptionHome {
  const raccogli = (tipo: string) =>
    gsap.utils.toArray<HTMLElement>(
      `[data-home-caption="${tipo}"]`,
      scope,
    );

  const occhielli = raccogli("eyebrow");
  const titoli = raccogli("title");
  const copy = raccogli("copy");
  const cta = raccogli("cta");

  return {
    occhielli,
    titoli,
    copy,
    cta,
    tutti: gsap.utils.toArray<HTMLElement>(SELETTORE, scope),
  };
}

/**
 * Lo stato iniziale è lo stesso della hero: il testo vive già nel DOM ma
 * parte sotto la finestra ritagliata. Nessuna opacity o visibility.
 */
export function preparaCaptionHome(gruppo: GruppoCaptionHome) {
  gsap.set([...gruppo.occhielli, ...gruppo.copy], {
    transform: "translateY(115%)",
    force3D: true,
  });
  gsap.set(gruppo.titoli, {
    transform: "translateY(165%)",
    force3D: true,
  });
  gsap.set(gruppo.cta, {
    transform: "translateX(-110%)",
    force3D: true,
  });
}

/** Inserisce la grammatica della hero in una timeline scroll-driven. */
export function aggiungiCaptionHome(
  timeline: TimelineGSAP,
  gruppo: GruppoCaptionHome,
  inizio = 0,
) {
  if (gruppo.occhielli.length) {
    timeline.to(
      gruppo.occhielli,
      {
        transform: "translateY(0%)",
        duration: 0.13,
        stagger: 0.025,
        ease: "power3.out",
      },
      inizio,
    );
  }

  if (gruppo.titoli.length) {
    timeline.to(
      gruppo.titoli,
      {
        transform: "translateY(0%)",
        duration: 0.18,
        stagger: 0.035,
        ease: "power3.out",
      },
      inizio + 0.045,
    );
  }

  if (gruppo.copy.length) {
    timeline.to(
      gruppo.copy,
      {
        transform: "translateY(0%)",
        duration: 0.15,
        stagger: 0.03,
        ease: "power3.out",
      },
      inizio + 0.15,
    );
  }

  if (gruppo.cta.length) {
    timeline.to(
      gruppo.cta,
      {
        transform: "translateX(0%)",
        duration: 0.16,
        stagger: 0.035,
        ease: "power3.out",
      },
      inizio + 0.23,
    );
  }

  return timeline;
}

/**
 * I link dentro una CTA mascherata non devono ricevere focus prima che la
 * caption sia leggibile. Il valore originario viene conservato e ripristinato.
 */
export function abilitaInterattiviCaption(
  gruppo: GruppoCaptionHome,
  abilitati: boolean,
) {
  const interattivi = gruppo.cta.flatMap((contenitore) => [
    ...(contenitore.matches("a, button, input, select, textarea, [tabindex]")
      ? [contenitore]
      : []),
    ...contenitore.querySelectorAll<HTMLElement>(
      "a, button, input, select, textarea, [tabindex]",
    ),
  ]);

  for (const elemento of interattivi) {
    if (!elemento.hasAttribute(TABINDEX_ORIGINALE)) {
      elemento.setAttribute(
        TABINDEX_ORIGINALE,
        elemento.getAttribute("tabindex") ?? "",
      );
    }

    if (!abilitati) {
      elemento.tabIndex = -1;
      continue;
    }

    const originale = elemento.getAttribute(TABINDEX_ORIGINALE);
    if (originale) elemento.setAttribute("tabindex", originale);
    else elemento.removeAttribute("tabindex");
  }
}
