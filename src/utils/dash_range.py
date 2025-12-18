from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime, timedelta, timezone
from typing import Optional

from zoneinfo import ZoneInfo


@dataclass(frozen=True)
class ResolvedRange:
    tz: str
    from_local: datetime
    to_local: datetime
    from_utc: datetime
    to_utc: datetime


def _parse_dt(value: Optional[str], tz: ZoneInfo) -> Optional[datetime]:
    """
    Aceita:
    - YYYY-MM-DD
    - ISO datetime (com ou sem timezone)
    """
    if not value:
        return None

    v = value.strip()

    if len(v) == 10 and v[4] == "-" and v[7] == "-":
        dt = datetime.fromisoformat(v)
        return dt.replace(hour=0, minute=0, second=0, microsecond=0, tzinfo=tz)

    if v.endswith("Z"):
        v = v[:-1] + "+00:00"

    dt = datetime.fromisoformat(v)

    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=tz)

    return dt.astimezone(tz)


def resolve_range(
    from_param: Optional[str],
    to_param: Optional[str],
    tz_name: str = "America/Sao_Paulo",
    default_days: int = 7,
) -> ResolvedRange:
    tz = ZoneInfo(tz_name)
    now_local = datetime.now(tz)

    from_local = _parse_dt(from_param, tz)
    to_local = _parse_dt(to_param, tz)

    if from_local is None and to_local is None:
        to_local = now_local
        from_local = now_local - timedelta(days=default_days)
    elif from_local is None and to_local is not None:
        from_local = to_local - timedelta(days=default_days)
    elif from_local is not None and to_local is None:
        to_local = now_local

    # normaliza ordem
    if from_local > to_local:
        from_local, to_local = to_local, from_local

    from_utc = from_local.astimezone(timezone.utc)
    to_utc = to_local.astimezone(timezone.utc)

    return ResolvedRange(
        tz=tz_name,
        from_local=from_local,
        to_local=to_local,
        from_utc=from_utc,
        to_utc=to_utc,
    )
