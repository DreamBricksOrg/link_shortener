import qrcode
import segno
from pathlib import Path

def generate_qr(slug: str):
    url = f"https://yourdomain.com/{slug}"
    static_dir = Path("static")
    static_dir.mkdir(exist_ok=True)

    png_path = static_dir / f"{slug}.png"
    svg_path = static_dir / f"{slug}.svg"

    # PNG with qrcode
    img = qrcode.make(url)
    img.save(png_path)

    # SVG with segno
    qr = segno.make(url)
    qr.save(svg_path, kind='svg')

    return str(png_path), str(svg_path)
