import os
import argparse
import logging
from datetime import datetime, timezone
from typing import Optional, Dict, Any, List

from dateutil.relativedelta import relativedelta

from core.db import db
from core.config import settings


log = logging.getLogger("qr_cleanup")


def _utcnow() -> datetime:
    return datetime.now(timezone.utc)


def _as_dt(value: Any) -> Optional[datetime]:
    if value is None:
        return None
    if isinstance(value, datetime):
        # garante tz
        return value if value.tzinfo else value.replace(tzinfo=timezone.utc)
    return None


async def _get_last_access_ts(slug: str) -> Optional[datetime]:
    doc = await db.access_logs.find_one(
        {"slug": slug},
        sort=[("ts", -1)],
        projection={"ts": 1},
    )
    if not doc:
        return None
    return _as_dt(doc.get("ts"))


def _qr_paths(slug: str, static_dir: str) -> List[str]:
    return [
        os.path.join(static_dir, f"{slug}.png"),
        os.path.join(static_dir, f"{slug}.svg"),
    ]


async def run(months: int, only_inactive: bool, dry_run: bool, clear_db_fields: bool, static_dir: str):
    cutoff = _utcnow() - relativedelta(months=months)

    query: Dict[str, Any] = {}
    if only_inactive:
        query["is_active"] = False

    cursor = db.links.find(
        query,
        projection={"slug": 1, "created_at": 1, "is_active": 1, "qr_png": 1, "qr_svg": 1},
    )

    scanned = 0
    eligible = 0
    deleted_files = 0
    missing_files = 0
    updated_docs = 0

    async for link in cursor:
        scanned += 1
        slug = link.get("slug")
        if not slug:
            continue

        created_at = _as_dt(link.get("created_at")) or datetime(1970, 1, 1, tzinfo=timezone.utc)

        last_access = await _get_last_access_ts(slug)

        reference_ts = last_access or created_at

        if reference_ts >= cutoff:
            continue

        eligible += 1

        paths = _qr_paths(slug, static_dir)

        for p in paths:
            if os.path.exists(p):
                if dry_run:
                    log.info("[dry-run] would delete file: %s", p)
                else:
                    try:
                        os.remove(p)
                        deleted_files += 1
                        log.info("deleted file: %s", p)
                    except Exception as e:
                        log.warning("failed to delete file: %s (%s)", p, e)
            else:
                missing_files += 1

        if clear_db_fields:
            update = {"$set": {"qr_png": None, "qr_svg": None, "updated_at": _utcnow()}}
            if dry_run:
                log.info("[dry-run] would clear qr fields for slug=%s", slug)
            else:
                res = await db.links.update_one({"_id": link["_id"]}, update)
                if res.modified_count:
                    updated_docs += 1

    log.info(
        "done. scanned=%d eligible=%d deleted_files=%d missing_files=%d updated_docs=%d cutoff=%s dry_run=%s",
        scanned,
        eligible,
        deleted_files,
        missing_files,
        updated_docs,
        cutoff.isoformat(),
        dry_run,
    )


def main():
    parser = argparse.ArgumentParser(description="Cleanup QR files for inactive/unused links.")
    parser.add_argument("--months", type=int, default=3, help="Retention window in months (default: 3)")
    parser.add_argument("--only-inactive", action="store_true", default=True, help="Only process is_active=false (default: true)")
    parser.add_argument("--include-active", action="store_true", help="Also process active links (overrides only-inactive)")
    parser.add_argument("--dry-run", action="store_true", help="Do not delete anything, only log actions")
    parser.add_argument("--no-clear-db", action="store_true", help="Do not clear qr_png/qr_svg fields in Mongo")
    parser.add_argument("--static-dir", default="/app/src/static", help="Static dir inside container (default: /app/src/static)")
    args = parser.parse_args()

    only_inactive = args.only_inactive and not args.include_active
    clear_db_fields = not args.no_clear_db

    logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(name)s - %(message)s")

    import asyncio
    asyncio.run(
        run(
            months=args.months,
            only_inactive=only_inactive,
            dry_run=args.dry_run,
            clear_db_fields=clear_db_fields,
            static_dir=args.static_dir,
        )
    )


if __name__ == "__main__":
    main()
