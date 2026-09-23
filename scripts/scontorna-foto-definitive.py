"""Scontorna le foto definitive e genera gli asset WebP del catalogo.

Il prodotto non viene rigenerato: rembg calcola soltanto il canale alpha
partendo dalla fotografia originale. L'alpha matting evita le frange bianche
tipiche degli scatti su fondale chiaro; il ritaglio finale conserva un piccolo
margine trasparente per non mordere zucchero, granella e punte di sfoglia.

Uso (ambiente isolato, nessuna dipendenza aggiunta al progetto):

  uv run --with 'rembg[cpu]' python scripts/scontorna-foto-definitive.py
"""

from pathlib import Path

import numpy as np
from PIL import Image
from rembg import new_session, remove
from scipy.ndimage import (
    binary_erosion,
    distance_transform_edt,
    gaussian_filter,
)


ROOT = Path(__file__).resolve().parents[1]
SOURCES = ROOT / "public" / "Foto definitive"
OUTPUTS = ROOT / "public" / "products"
MAX_SIDE = 1200
PADDING = 12
ALPHA_THRESHOLD = 96
EDGE_EROSION = 1
EDGE_RETOUCH = 4


ASSETS = {
    # Dolci — Bomba fritta
    "bomba-fritta-crema-spaccato": "Dolci/Bomba fritta/Bomba fritta con crema/Bomba fritta con crema_aperta.png",
    "bomba-fritta-crema": "Dolci/Bomba fritta/Bomba fritta con crema/Bomba fritta con crema_chiusa.png",
    "bomba-fritta-semplice-spaccato": "Dolci/Bomba fritta/Bomba fritta semplice/Bomba fritta semplice_aperta.png",
    "bomba-fritta-semplice": "Dolci/Bomba fritta/Bomba fritta semplice/Bomba fritta semplice_chiusa.png",
    # Dolci — Cuore
    "cuore-cioccolato": "Dolci/Cuore/Cuore Nuì.png",
    "cuore-crema": "Dolci/Cuore/Cuore crema e fragola.png",
    "cuore-marmellata": "Dolci/Cuore/Cuore frutti rossi.png",
    "cuore-pistacchio": "Dolci/Cuore/Cuore pistacchio e lampone.png",
    "cuore-semplice": "Dolci/Cuore/Cuore semplice.jpg",
    # Dolci — Frittella
    "frittella-cioccolato": "Dolci/Frittella/Frittella con cioccolato.png",
    "frittella-crema": "Dolci/Frittella/Frittella con crema.png",
    # Dolci — Golosone
    "golosone-cioccolato-spaccato": "Dolci/Golosone /Golosone al cioccolato/Golosone al cioccolato_aperto.png",
    "golosone-cioccolato-granella": "Dolci/Golosone /Golosone al cioccolato/Golosone al cioccolato_chiuso.png",
    "golosone-cioccolato-semplice": "Dolci/Golosone /Golosone al cioccolato/Golosone al cioccolato_semplice.png",
    "golosone-crema-spaccato": "Dolci/Golosone /Golosone alla crema/Golosone alla crema_aperto.png",
    "golosone-crema-granella": "Dolci/Golosone /Golosone alla crema/Golosone alla crema_chiuso.png",
    "golosone-crema-semplice": "Dolci/Golosone /Golosone alla crema/Golosone alla crema_semplice.png",
    # Dolci — Intriko Midi
    "intriko-midi-frutti-rossi": "Dolci/Intriko/Midi/Midi ai frutti rossi.png",
    "intriko-midi-caramello": "Dolci/Intriko/Midi/Midi al caramello.png",
    "intriko-midi-cioccolato": "Dolci/Intriko/Midi/Midi al cioccolato.png",
    "intriko-midi-pistacchio": "Dolci/Intriko/Midi/Midi al pistacchio.png",
    "intriko-midi-crema": "Dolci/Intriko/Midi/Midi alla crema.png",
    "intriko-midi-dulce-de-leche": "Dolci/Intriko/Midi/Midi dulche de leche.png",
    # Dolci — Intriko normale e vuoto
    "intriko-cioccolato": "Dolci/Intriko/Normali/Intriko al cioccolato.png",
    "intriko-crema": "Dolci/Intriko/Normali/Intriko alla crema.png",
    "intriko-frutti-di-bosco": "Dolci/Intriko/Normali/Intriko frutti rossi.png",
    "intriko-pistacchio": "Dolci/Intriko/Normali/Intriko normale pistacchio.png",
    "intriko-tre-cioccolati": "Dolci/Intriko/Normali/Intriko tre cioccolati.png",
    "intriko-vuoto": "Dolci/Intriko/Vuoto/Intriko Vuoto.png",
    # Dolci — Klejner e Lussekatt
    "klejner": "Dolci/Klejner/ Klejner semplice.jpg",
    "klejner-cannella": "Dolci/Klejner/Klejner cannella.png",
    "lusekatt": "Dolci/Lussekatt/Lussekatt.jpg",
    # Dolci — Nuvola
    "nuvola-cioccolato": "Dolci/Nuvola/Nuvola Nuì.png",
    "nuvola-crema": "Dolci/Nuvola/Nuvola crema e fragola.png",
    "nuvola-marmellata": "Dolci/Nuvola/Nuvola frutti rossi.png",
    "nuvola-pistacchio": "Dolci/Nuvola/Nuvola pistacchio e lampone.png",
    "nuvola-semplice": "Dolci/Nuvola/Nuvola semplice.jpg",
    # Dolci — Stella
    "stella-cioccolato": "Dolci/Stella/Stella Nuì.png",
    "stella-crema": "Dolci/Stella/Stella crema e fragola.png",
    "stella-marmellata": "Dolci/Stella/Stella frutti rossi.png",
    "stella-pistacchio": "Dolci/Stella/Stella pistacchio e lampone.png",
    "stella-semplice": "Dolci/Stella/Stella semplice.jpg",
    # Salati — Focaccine
    "focaccina-bianca": "Salati/Focaccine tre gusti/Focaccina Bianca.png",
    "focaccina-curcuma": "Salati/Focaccine tre gusti/Focaccina curcuma.png",
    "focaccina-pomodoro": "Salati/Focaccine tre gusti/Focaccina pomodoro.png",
    "focaccine-miste-tre-gusti": "Salati/Focaccine tre gusti/Focaccine tre gusti insieme.png",
    # Salati — Montanarine
    "montanarina-mozzarella": "Salati/Montanarine/Montanarina con mozzarella.png",
    "montanarina-pomodoro": "Salati/Montanarine/Montanarina pomodoro.png",
    # Salati — Paninetti
    "paninetto-bianco": "Salati/Paninetto colorato tre gusti/Paninetto bianco.png",
    "paninetto-curcuma": "Salati/Paninetto colorato tre gusti/Paninetto curcuma.png",
    "paninetto-pomodoro": "Salati/Paninetto colorato tre gusti/Paninetto pomodoro.png",
    "paninetto-colorato-tre-gusti": "Salati/Paninetto colorato tre gusti/Paninetto colorato tre gusti.png",
    # Salati — Pizzette
    "pizzetta-al-pomodoro": "Salati/Pizzetta al pomodoro/Pizzetta rossa.png",
    "pizzette-al-pomodoro": "Salati/Pizzetta al pomodoro/Pizzette rosse.png",
    "pizzetta-bianca": "Salati/Pizzetta bianca/Pizzetta bianca.png",
    "pizzetta-fritta-media": "Salati/Pizzetta fritta/Pizzetta fritta media.png",
    "pizzetta-fritta-piccola": "Salati/Pizzetta fritta/Pizzetta fritta piccola.png",
    "pizzetta-fantasia-olive": "Salati/Pizzette fantasia/Pizzetta fantasia_olive.png",
    "pizzetta-fantasia-wurstel": "Salati/Pizzette fantasia/Pizzetta fantasia_wurstel.png",
    "pizzetta-fantasia-funghi": "Salati/Pizzette fantasia/Pizzette fantasia_funghi.png",
    "pizzetta-fantasia-verdure": "Salati/Pizzette fantasia/Pizzette fantasia_verdure.png",
    # Salati — Rustici
    "rustici": "Salati/Rustici/Rustici.png",
    "rustico-4-formaggi": "Salati/Rustici/Rustico 4 formaggi.png",
    "rustico-funghi": "Salati/Rustici/Rustico con i funghi.png",
    "rustico-peperoni": "Salati/Rustici/Rustico con peperoni.png",
    "rustico-pizzaiola": "Salati/Rustici/Rustico con pizzaiola.png",
    "rustico-wurstel": "Salati/Rustici/Rustico con wurstel.png",
    "rustico-ricotta-e-spinaci": "Salati/Rustici/rustico con ricotta e spinaci.png",
    # Salati — Vol-au-vent
    "vol-au-vent": "Salati/Vol au vent/Vol au vent.jpg",
}


def crop_with_padding(image: Image.Image) -> Image.Image:
    alpha = image.getchannel("A")
    significant = alpha.point(lambda value: 255 if value > 4 else 0)
    bbox = significant.getbbox()
    if bbox is None:
        raise RuntimeError("nessun soggetto rilevato")

    left, top, right, bottom = bbox
    return image.crop(
        (
            max(0, left - PADDING),
            max(0, top - PADDING),
            min(image.width, right + PADDING),
            min(image.height, bottom + PADDING),
        )
    )


def refine_edges(image: Image.Image) -> Image.Image:
    """Elimina aloni e contaminazioni di fondale lungo il profilo.

    rembg fornisce la sagoma; qui si interviene soltanto sulla fascia
    esterna di pochi pixel. Il matte viene contratto di un pixel e
    ri-antialiasato, mentre il colore del bordo viene ricavato dai pixel
    interni dello stesso prodotto. Anche i pixel trasparenti adiacenti
    ricevono quel colore (alpha bleed): così il ridimensionamento del
    browser non può reintrodurre bordi neri o bianchi.
    """

    rgba = np.asarray(image.convert("RGBA")).copy()
    source_rgb = rgba[:, :, :3].astype(np.float32)
    source_alpha = rgba[:, :, 3]

    mask = source_alpha >= ALPHA_THRESHOLD
    clean_mask = binary_erosion(mask, iterations=EDGE_EROSION)
    if not clean_mask.any():
        return image

    distance_inside = distance_transform_edt(clean_mask)
    core = distance_inside > EDGE_RETOUCH
    if not core.any():
        core = clean_mask

    nearest_core = distance_transform_edt(
        ~core, return_distances=False, return_indices=True
    )
    interior_rgb = source_rgb[nearest_core[0], nearest_core[1]]
    interior_rgb = np.stack(
        [gaussian_filter(interior_rgb[:, :, channel], 0.8) for channel in range(3)],
        axis=2,
    )

    edge_weight = np.clip(
        (EDGE_RETOUCH + 1 - distance_inside) / (EDGE_RETOUCH + 1), 0, 1
    )[:, :, None]
    refined_rgb = source_rgb * (1 - edge_weight) + interior_rgb * edge_weight

    # Colora anche l'area totalmente trasparente con il bordo più vicino:
    # il colore resta invisibile, ma impedisce gli aloni durante lo scaling.
    nearest_subject = distance_transform_edt(
        ~clean_mask, return_distances=False, return_indices=True
    )
    outside = ~clean_mask
    refined_rgb[outside] = refined_rgb[
        nearest_subject[0][outside], nearest_subject[1][outside]
    ]

    refined_alpha = gaussian_filter(clean_mask.astype(np.float32), 0.65) * 255
    refined_alpha[refined_alpha < 5] = 0
    refined_alpha[refined_alpha > 250] = 255

    result = np.dstack(
        [
            np.clip(refined_rgb, 0, 255).astype(np.uint8),
            np.clip(refined_alpha, 0, 255).astype(np.uint8),
        ]
    )
    return Image.fromarray(result, "RGBA")


def main() -> None:
    OUTPUTS.mkdir(parents=True, exist_ok=True)
    missing = [relative for relative in ASSETS.values() if not (SOURCES / relative).is_file()]
    if missing:
        raise FileNotFoundError("Foto mancanti:\n" + "\n".join(missing))

    session = new_session("isnet-general-use")
    total = len(ASSETS)

    for index, (slug, relative) in enumerate(ASSETS.items(), start=1):
        source = Image.open(SOURCES / relative).convert("RGB")
        cutout = remove(
            source,
            session=session,
            alpha_matting=True,
            alpha_matting_foreground_threshold=240,
            alpha_matting_background_threshold=12,
            alpha_matting_erode_size=8,
        )
        cutout = crop_with_padding(cutout)
        cutout.thumbnail((MAX_SIDE, MAX_SIDE), Image.Resampling.LANCZOS)
        cutout = refine_edges(cutout)

        destination = OUTPUTS / f"{slug}.webp"
        cutout.save(destination, "WEBP", quality=90, method=6, exact=True)
        print(
            f"[{index:02d}/{total}] {destination.name} "
            f"{cutout.width}x{cutout.height} {destination.stat().st_size // 1024} KB",
            flush=True,
        )


if __name__ == "__main__":
    main()
