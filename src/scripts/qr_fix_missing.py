import os
import argparse
import logging
from datetime import datetime, timezone
from typing import Any, Dict

from core.db import db

log = logging.getLogger("qr_fix_missing")


def _utcnow():
    return datetime.now(timezone.utc)


def _paths(slug: str, static_dir: str):
    return (
        os.path.join(static_dir, f"{slug}.png"),
        os.path.join(static_dir, f"{slug}.svg"),
    )


async def run(static_dir: str, dry_run: bool, only_active: bool):
    query: Dict[str, Any] = {
        "$or": [{"qr_png": {"$ne": None}}, {"qr_svg": {"$ne": None}}],
        "slug": {"$type": "string"},
    }
    if only_active:
        query["is_active"] = True

    cursor = db.links.find(query, projection={"slug": 1, "qr_png": 1, "qr_svg": 1, "is_active": 1})

    scanned = 0
    fixed = 0

    async for doc in cursor:
        scanned += 1
        slug = doc.get("slug")
        if not slug:
            continue

        png_path, svg_path = _paths(slug, static_dir)
        png_ok = os.path.exists(png_path)
        svg_ok = os.path.exists(svg_path)

        if not (png_ok and svg_ok):
            log.info(
                "missing-qr",
                extra={
                    "slug": slug,
                    "png_ok": png_ok,
                    "svg_ok": svg_ok,
                    "png_path": png_path,
                    "svg_path": svg_path,
                },
            )

            if dry_run:
                continue

            update = {
                "$set": {
                    "qr_png": None,
                    "qr_svg": None,
                    "is_active": False,
                    "updated_at": _utcnow(),
                }
            }
            res = await db.links.update_one({"_id": doc["_id"]}, update)
            if res.modified_count:
                fixed += 1

    log.info("done", extra={"scanned": scanned, "fixed": fixed, "dry_run": dry_run, "static_dir": static_dir})


def main():
    parser = argparse.ArgumentParser(description="Disable links that have missing QR files on disk.")
    parser.add_argument("--static-dir", default="/app/src/static", help="Static dir path inside container")
    parser.add_argument("--dry-run", action="store_true", help="Only log what would be changed")
    parser.add_argument("--only-active", action="store_true", help="Only scan links where is_active=true")
    args = parser.parse_args()

    logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(name)s - %(message)s")

    import asyncio
    asyncio.run(run(static_dir=args.static_dir, dry_run=args.dry_run, only_active=args.only_active))


if __name__ == "__main__":
    main()
