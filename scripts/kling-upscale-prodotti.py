"""Upscaling 4K Kling dei prodotti e rifinitura alpha per il catalogo.

Ogni asset viene inviato una sola volta a Kling, in gruppi di tre job
indipendenti. Prima di ogni invio viene controllato il credito; gli ID delle
generazioni completate sono salvati in assets/catalog/kling-4k-manifest.json,
così il processo è riprendibile senza duplicare costi.

Uso:
  PYTHONDONTWRITEBYTECODE=1 uv run --with 'rembg[cpu]' \
    python scripts/kling-upscale-prodotti.py
"""

from __future__ import annotations

import importlib.util
import json
import subprocess
import tempfile
import time
import urllib.request
from dataclasses import dataclass
from pathlib import Path

from PIL import Image
from rembg import new_session, remove


ROOT = Path(__file__).resolve().parents[1]
INPUTS = ROOT / "public" / "products"
OUTPUTS = ROOT / "public" / "products-4k"
MANIFEST = ROOT / "assets" / "catalog" / "kling-4k-manifest.json"
MAX_ACTIVE = 3
MAX_SIDE = 4096
MARGIN_RATIO = 0.07
EXPECTED_CREDITS_PER_IMAGE = 4

KLING = [
    "npm",
    "exec",
    "--yes",
    "--registry=https://registry.npmjs.org",
    "--package=@klingai/cli-global@0.2.0",
    "--",
    "kling",
]
TELEMETRY = ["--skill-name", "kling-ai-cli", "--skill-version", "1.0.5", "--quiet"]

PROMPT = (
    "Use 图片1 as the exact factual source. Upscale only to native 4K and "
    "enhance fine photographic detail without redesigning anything. Preserve "
    "exactly the pastry geometry, braid or fold pattern, crop, camera angle, "
    "perspective, proportions, filling, toppings, sugar grains, colors, "
    "exposure, and silhouette. Keep the complete isolated product centered "
    "with generous clear margin; nothing may touch or cross the canvas edge. "
    "Use a perfectly uniform pure white studio background only, with no floor, "
    "no contact shadow, no border, no text, no logo, and no watermark."
)


@dataclass
class Job:
    slug: str
    generation_id: str
    reference: Path


def load_cutout_helpers():
    spec = importlib.util.spec_from_file_location(
        "scontorna_foto_definitive", ROOT / "scripts" / "scontorna-foto-definitive.py"
    )
    if spec is None or spec.loader is None:
        raise RuntimeError("impossibile caricare le funzioni di scontorno")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module.crop_with_padding, module.refine_edges


CROP_WITH_PADDING, REFINE_EDGES = load_cutout_helpers()


def parse_cli_json(output: str) -> dict:
    for line in reversed(output.splitlines()):
        line = line.strip()
        if not line.startswith("{"):
            continue
        try:
            return json.loads(line)
        except json.JSONDecodeError:
            continue
    raise RuntimeError(f"risposta Kling non interpretabile: {output[-800:]}")


def run_kling(arguments: list[str]) -> dict:
    result = subprocess.run(
        KLING + arguments,
        cwd=ROOT,
        text=True,
        capture_output=True,
        check=False,
    )
    if result.stderr:
        print(result.stderr.rstrip(), flush=True)
    payload = parse_cli_json(result.stdout)
    timed_out = bool((payload.get("body") or {}).get("timedOut"))
    if result.returncode != 0 and not timed_out:
        raise RuntimeError(
            f"Kling CLI exit {result.returncode}:\n{result.stdout}\n{result.stderr}"
        )
    if not payload.get("ok") and not timed_out:
        raise RuntimeError(f"Kling ha restituito un errore: {payload}")
    return payload


def credits_available() -> int:
    payload = run_kling(["account", *TELEMETRY])
    return int(payload["body"]["availableRemainCredits"])


def prepare_reference(source: Path, destination: Path) -> None:
    product = Image.open(source).convert("RGBA")
    alpha_bbox = product.getchannel("A").getbbox()
    if alpha_bbox is None:
        raise RuntimeError(f"{source.name}: alpha vuota")
    product = product.crop(alpha_bbox)

    margin = max(24, round(max(product.size) * MARGIN_RATIO))
    canvas_width = product.width + margin * 2
    canvas_height = product.height + margin * 2

    # Kling accetta riferimenti non più larghi di 2:1.
    if canvas_width / canvas_height > 2:
        canvas_height = (canvas_width + 1) // 2
    if canvas_height / canvas_width > 2:
        canvas_width = (canvas_height + 1) // 2

    canvas = Image.new("RGBA", (canvas_width, canvas_height), (255, 255, 255, 255))
    x = (canvas_width - product.width) // 2
    y = (canvas_height - product.height) // 2
    canvas.alpha_composite(product, (x, y))
    canvas.convert("RGB").save(destination, "PNG", optimize=True)


def submit(slug: str, reference: Path) -> Job:
    credits = credits_available()
    if credits < EXPECTED_CREDITS_PER_IMAGE:
        raise RuntimeError(
            f"crediti insufficienti prima di {slug}: disponibili {credits}"
        )
    print(f"[{slug}] invio a Kling — crediti disponibili: {credits}", flush=True)
    payload = run_kling(
        [
            "image_to_image",
            "--model",
            "kling-image-v3_0_omni",
            "--image",
            str(reference),
            "--img_resolution",
            "4k",
            "--aspect_ratio",
            "auto",
            "--imageCount",
            "1",
            "--story_mode",
            "false",
            "--poll",
            "0",
            "--rationale",
            "Upscale one user-provided pastry catalog asset to 4K while preserving the exact commercial product identity for the Delsigel website catalog.",
            *TELEMETRY,
            PROMPT,
        ]
    )
    body = payload["body"]
    generation_id = body.get("generationId") or body.get("generation_id")
    if not generation_id:
        raise RuntimeError(f"{slug}: invio senza generationId")
    print(
        f"[{slug}] generationId={generation_id} "
        f"crediti={body.get('creditsConsumed') or body.get('credits_consumed')}",
        flush=True,
    )
    return Job(slug=slug, generation_id=generation_id, reference=reference)


def completed_work(job: Job) -> tuple[str, int]:
    while True:
        payload = run_kling(
            ["query_tasks", job.generation_id, "--poll", "60", *TELEMETRY]
        )
        body = payload["body"]
        generations = body.get("generations") or []
        if not generations:
            raise RuntimeError(f"{job.slug}: risposta senza generazione")
        generation = generations[0]
        status = str(generation.get("status", "")).upper()
        if status in {"QUEUING", "QUEUED", "RUNNING", "PROCESSING"}:
            print(f"[{job.slug}] ancora {status.lower()}", flush=True)
            continue
        if status not in {"COMPLETED", "SUCCEEDED", "SUCCESS", "PARTIAL"}:
            raise RuntimeError(f"{job.slug}: generazione terminata con stato {status}")

        result = generation.get("result") or {}
        works = result.get("works") or []
        if not works:
            raise RuntimeError(f"{job.slug}: generazione completata senza output")
        work = works[0]
        url = (
            work.get("urlWithoutWatermark")
            or work.get("url_without_watermark")
            or work.get("url")
        )
        if not url:
            raise RuntimeError(f"{job.slug}: output privo di URL")
        return url, 0


def download(url: str, destination: Path) -> None:
    request = urllib.request.Request(url, headers={"User-Agent": "Delsigel-Kling-4K/1.0"})
    with urllib.request.urlopen(request, timeout=120) as response:
        destination.write_bytes(response.read())


def finalize(raw: Path, destination: Path, session) -> tuple[int, int]:
    source = Image.open(raw).convert("RGB")
    cutout = remove(
        source,
        session=session,
        alpha_matting=True,
        alpha_matting_foreground_threshold=240,
        alpha_matting_background_threshold=12,
        alpha_matting_erode_size=8,
    )
    cutout = CROP_WITH_PADDING(cutout)
    cutout.thumbnail((MAX_SIDE, MAX_SIDE), Image.Resampling.LANCZOS)
    cutout = REFINE_EDGES(cutout)

    margin = max(48, round(max(cutout.size) * MARGIN_RATIO))
    canvas = Image.new(
        "RGBA",
        (cutout.width + margin * 2, cutout.height + margin * 2),
        (0, 0, 0, 0),
    )
    canvas.alpha_composite(cutout, (margin, margin))
    canvas.save(destination, "WEBP", quality=94, method=6, exact=True)
    if canvas.getchannel("A").getextrema() != (0, 255):
        raise RuntimeError(f"{destination.name}: alpha non valida")
    return canvas.size


def load_manifest() -> dict:
    if not MANIFEST.exists():
        return {"model": "kling-image-v3_0_omni", "resolution": "4k", "assets": {}}
    return json.loads(MANIFEST.read_text(encoding="utf-8"))


def save_manifest(manifest: dict) -> None:
    MANIFEST.parent.mkdir(parents=True, exist_ok=True)
    temporary = MANIFEST.with_suffix(".json.tmp")
    temporary.write_text(
        json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    temporary.replace(MANIFEST)


def main() -> None:
    sources = sorted(INPUTS.glob("*.webp"))
    if not sources:
        raise RuntimeError("nessun prodotto trovato")
    OUTPUTS.mkdir(parents=True, exist_ok=True)
    manifest = load_manifest()
    entries = manifest["assets"]
    completed = {
        slug
        for slug, entry in entries.items()
        if entry.get("status", "completed") == "completed"
        and (ROOT / entry["file"]).is_file()
    }
    submitted = {
        slug: entry
        for slug, entry in entries.items()
        if entry.get("status") == "submitted"
    }
    pending = [
        source
        for source in sources
        if source.stem not in completed and source.stem not in submitted
    ]
    print(
        f"Kling 4K: {len(sources)} asset totali, {len(completed)} completati, "
        f"{len(submitted)} già inviati, {len(pending)} da inviare",
        flush=True,
    )
    if not pending and not submitted:
        return

    session = new_session("isnet-general-use")
    with tempfile.TemporaryDirectory(prefix="delsigel-kling-") as temp_name:
        temp = Path(temp_name)

        # Prima recupera i job già pagati ma non ancora scaricati. Non viene
        # mai creata una seconda generazione per lo stesso asset.
        for slug, entry in submitted.items():
            job = Job(slug=slug, generation_id=entry["generationId"], reference=Path())
            url, work_index = completed_work(job)
            raw = temp / f"{slug}-kling.png"
            download(url, raw)
            destination = OUTPUTS / f"{slug}.webp"
            width, height = finalize(raw, destination, session)
            entries[slug] = {
                "status": "completed",
                "generationId": job.generation_id,
                "workIndex": work_index,
                "file": destination.relative_to(ROOT).as_posix(),
                "width": width,
                "height": height,
                "credits": EXPECTED_CREDITS_PER_IMAGE,
            }
            completed.add(slug)
            save_manifest(manifest)
            print(f"[{len(completed):02d}/{len(sources)}] {destination.name} {width}x{height}", flush=True)

        for offset in range(0, len(pending), MAX_ACTIVE):
            batch = pending[offset : offset + MAX_ACTIVE]
            jobs: list[Job] = []

            for source in batch:
                reference = temp / f"{source.stem}-reference.png"
                prepare_reference(source, reference)
                job = submit(source.stem, reference)
                jobs.append(job)
                entries[source.stem] = {
                    "status": "submitted",
                    "generationId": job.generation_id,
                    "file": f"public/products-4k/{source.stem}.webp",
                    "credits": EXPECTED_CREDITS_PER_IMAGE,
                }
                save_manifest(manifest)

            for job in jobs:
                url, work_index = completed_work(job)
                raw = temp / f"{job.slug}-kling.png"
                download(url, raw)
                destination = OUTPUTS / f"{job.slug}.webp"
                width, height = finalize(raw, destination, session)
                entries[job.slug] = {
                    "status": "completed",
                    "generationId": job.generation_id,
                    "workIndex": work_index,
                    "file": destination.relative_to(ROOT).as_posix(),
                    "width": width,
                    "height": height,
                    "credits": EXPECTED_CREDITS_PER_IMAGE,
                }
                completed.add(job.slug)
                save_manifest(manifest)
                print(
                    f"[{len(completed):02d}/{len(sources)}] {destination.name} "
                    f"{width}x{height}",
                    flush=True,
                )

            time.sleep(1)


if __name__ == "__main__":
    main()
