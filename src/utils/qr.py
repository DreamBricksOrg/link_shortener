import segno
from pathlib import Path

from core.config import settings

def generate_qr(slug: str):
    url = f"{settings.BASE_URL}/{slug}"

    STATIC_PATH = Path("src/static/qrs")

    png_path = STATIC_PATH / f"{slug}.png"
    svg_path = STATIC_PATH / f"{slug}.svg"

    qr = segno.make(url)
    qr.save(png_path, kind='png', scale=60)
    qr.save(svg_path, kind='svg', scale=60)

    return str(png_path), str(svg_path)
