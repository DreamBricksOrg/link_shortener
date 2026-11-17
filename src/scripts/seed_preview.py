"""Populate the isolated local preview database with fictional links and visits."""

from datetime import datetime, timedelta, timezone
import os
from pathlib import Path
from urllib.parse import urlsplit

import bcrypt
from pymongo import MongoClient
import segno


def main() -> None:
    uri = os.getenv("MONGO_URI", "mongodb://127.0.0.1:27022")
    database_name = os.getenv("MONGO_DB", "link_shortener_preview")
    password = os.getenv("PREVIEW_PASSWORD")
    parsed = urlsplit(uri)

    if parsed.scheme != "mongodb" or parsed.hostname not in {"127.0.0.1", "localhost"} or parsed.port != 27022:
        raise SystemExit("O seed só pode usar o MongoDB local de preview na porta 27022.")
    if database_name != "link_shortener_preview":
        raise SystemExit("O seed só pode usar a base link_shortener_preview.")
    if not password:
        raise SystemExit("Defina PREVIEW_PASSWORD antes de executar o seed.")

    client = MongoClient(uri, serverSelectionTimeoutMS=5000)
    client.admin.command("ping")
    db = client[database_name]

    if db.users.count_documents({"username": "preview"}) == 0:
        db.users.insert_one({
            "username": "preview",
            "password": bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode(),
            "role": "admin",
        })

    now = datetime.now(timezone.utc)
    base_url = os.getenv("BASE_URL", "http://127.0.0.1:5000").rstrip("/")
    qr_dir = Path(__file__).resolve().parents[1] / "static" / "qrs"
    qr_dir.mkdir(parents=True, exist_ok=True)
    samples = [
        ("lancamento-2026", "Lançamento DreamBricks", "https://example.com/lancamento", "Campanha principal", True, 22),
        ("guia-produto", "Guia do produto", "https://example.com/guia", "Material de apoio", True, 18),
        ("evento-tech", "Evento de tecnologia", "https://example.com/evento", "Divulgação do evento", True, 15),
        ("newsletter", "Newsletter", "https://example.com/newsletter", "Cadastro de interessados", True, 12),
        ("portfolio", "Portfólio", "https://example.com/portfolio", "Projetos em destaque", True, 9),
        ("suporte", "Central de ajuda", "https://example.com/ajuda", "Atendimento", True, 7),
        ("campanha-antiga", "Campanha anterior", "https://example.com/arquivo", "Campanha encerrada", False, 5),
    ]

    added_links = 0
    added_logs = 0
    for index, (slug, title, url, notes, active, clicks) in enumerate(samples):
        qr = segno.make(f"{base_url}/{slug}")
        qr.save(qr_dir / f"{slug}.png", kind="png", scale=8)
        qr.save(qr_dir / f"{slug}.svg", kind="svg", scale=8)
        qr_png = f"{base_url}/src/static/qrs/{slug}.png"
        qr_svg = f"{base_url}/src/static/qrs/{slug}.svg"
        result = db.links.update_one(
            {"slug": slug},
            {"$setOnInsert": {
                "slug": slug,
                "title": title,
                "original_url": url,
                "notes": notes,
                "callback_url": None,
                "tags": [],
                "is_active": active,
                "status": "valid" if active else "inactive",
                "created_at": now - timedelta(days=14 + index * 2),
                "click_count": clicks,
                "qr_png": qr_png,
                "qr_svg": qr_svg,
            }},
            upsert=True,
        )
        db.links.update_one({"slug": slug}, {"$set": {"qr_png": qr_png, "qr_svg": qr_svg}})
        if result.upserted_id is None:
            continue
        added_links += 1
        logs = []
        for click in range(clicks):
            moment = now - timedelta(days=click % 7, hours=click + index)
            logs.append({
                "slug": slug,
                "timestamp": moment.isoformat(),
                "ip": f"198.51.100.{20 + click % 5}",
                "browser": ["Chrome", "Firefox", "Safari"][click % 3],
                "os": ["Windows", "Android", "iOS"][click % 3],
                "device": ["Desktop", "Celular", "Tablet"][click % 3],
                "is_mobile": click % 3 == 1,
                "is_tablet": click % 3 == 2,
                "is_pc": click % 3 == 0,
                "referer": "https://example.com",
                "country": "Brasil",
                "region": "São Paulo",
                "city": "São Paulo",
            })
        db.access_logs.insert_many(logs)
        added_logs += len(logs)

    print(f"Base: {database_name}; links novos: {added_links}; acessos novos: {added_logs}")
    print("Login de preview: preview (senha definida em PREVIEW_PASSWORD)")


if __name__ == "__main__":
    main()
