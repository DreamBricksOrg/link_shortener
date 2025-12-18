from __future__ import annotations

from datetime import datetime, timezone
from typing import Any, Dict, List, Optional

import jwt
import structlog
from fastapi import APIRouter, Depends, HTTPException, Query, Security
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from core.config import settings
from core.db import db
from schemas.dash import (
    AccessLogItem,
    DateRangeOut,
    LinkListItem,
    LinkStatsResponse,
    OverviewResponse,
    PaginatedAccessLogsResponse,
    PaginatedLinksResponse,
    SeriesPoint,
    TopLinkItem,
)
from utils.dash_range import resolve_range

router = APIRouter(prefix="/dash", tags=["dash"])
log = structlog.get_logger()
bearer = HTTPBearer(auto_error=False)


async def admin_required(
    credentials: HTTPAuthorizationCredentials = Security(bearer),
):
    if not credentials or not credentials.credentials:
        raise HTTPException(status_code=401, detail="Credenciais ausentes")

    try:
        payload = jwt.decode(
            credentials.credentials,
            settings.JWT_SECRET,
            algorithms=[settings.JWT_ALGORITHM],
        )
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Token inválido")

    return payload


def _ts_add_fields_stage() -> Dict[str, Any]:
    """
    Converte para Date em campo 'ts' via $dateFromString.
    Assume UTC quando não há timezone explícito.
    """
    return {
        "$addFields": {
            "ts": {
                "$dateFromString": {
                    "dateString": "$timestamp",
                    "onError": None,
                    "onNull": None,
                }
            }
        }
    }


def _ts_match_range_stage(from_utc: datetime, to_utc: datetime) -> Dict[str, Any]:
    return {
        "$match": {
            "ts": {
                "$gte": from_utc,
                "$lte": to_utc,
            }
        }
    }


def _range_out(rr) -> DateRangeOut:
    return DateRangeOut(
        **{
            "from": rr.from_local,
            "to": rr.to_local,
            "tz": rr.tz,
        }
    )


@router.get("/overview", response_model=OverviewResponse, dependencies=[Depends(admin_required)])
async def overview(
    from_: Optional[str] = Query(None, alias="from"),
    to: Optional[str] = Query(None),
    tz: str = Query("America/Sao_Paulo"),
    top: int = Query(10, ge=1, le=50),
):
    rr = resolve_range(from_, to, tz_name=tz, default_days=7)

    # clicks_total + unique_ips
    pipeline_summary = [
        _ts_add_fields_stage(),
        _ts_match_range_stage(rr.from_utc, rr.to_utc),
        {
            "$group": {
                "_id": None,
                "clicks_total": {"$sum": 1},
                "ips": {"$addToSet": "$ip"},
                "last_click": {"$max": "$ts"},
            }
        },
        {
            "$project": {
                "_id": 0,
                "clicks_total": 1,
                "unique_ips": {"$size": "$ips"},
                "last_click": 1,
            }
        },
    ]

    summary = await db.access_logs.aggregate(pipeline_summary).to_list(length=1)
    summary = summary[0] if summary else {"clicks_total": 0, "unique_ips": 0, "last_click": None}

    # links_total / links_active
    links_total = await db.links.count_documents({})
    links_active = await db.links.count_documents({"is_active": True})

    pipeline_series = [
        _ts_add_fields_stage(),
        _ts_match_range_stage(rr.from_utc, rr.to_utc),
        {
            "$group": {
                "_id": {"$dateToString": {"format": "%Y-%m-%d", "date": "$ts"}},
                "clicks": {"$sum": 1},
            }
        },
        {"$sort": {"_id": 1}},
        {"$project": {"_id": 0, "bucket": "$_id", "clicks": 1}},
    ]
    series_docs = await db.access_logs.aggregate(pipeline_series).to_list(length=5000)
    series = [SeriesPoint(**d) for d in series_docs]

    # top_links
    pipeline_top = [
        _ts_add_fields_stage(),
        _ts_match_range_stage(rr.from_utc, rr.to_utc),
        {
            "$group": {
                "_id": "$slug",
                "clicks": {"$sum": 1},
                "last_click": {"$max": "$ts"},
            }
        },
        {"$sort": {"clicks": -1}},
        {"$limit": top},
        {
            "$lookup": {
                "from": "links",
                "localField": "_id",
                "foreignField": "slug",
                "as": "link",
            }
        },
        {"$unwind": {"path": "$link", "preserveNullAndEmptyArrays": True}},
        {
            "$project": {
                "_id": 0,
                "slug": "$_id",
                "clicks": 1,
                "last_click": 1,
                "title": "$link.title",
                "original_url": "$link.original_url",
            }
        },
    ]
    top_docs = await db.access_logs.aggregate(pipeline_top).to_list(length=top)
    top_links = [TopLinkItem(**d) for d in top_docs]

    return OverviewResponse(
        range=_range_out(rr),
        clicks_total=int(summary.get("clicks_total", 0)),
        unique_ips=int(summary.get("unique_ips", 0)),
        links_total=links_total,
        links_active=links_active,
        top_links=top_links,
        series=series,
    )


@router.get("/links", response_model=PaginatedLinksResponse, dependencies=[Depends(admin_required)])
async def list_links(
    from_: Optional[str] = Query(None, alias="from"),
    to: Optional[str] = Query(None),
    tz: str = Query("America/Sao_Paulo"),

    q: Optional[str] = Query(None, description="Busca em slug/title/original_url"),
    tag: Optional[str] = Query(None),
    is_active: Optional[bool] = Query(None),

    sort: str = Query("clicks_desc", pattern="^(clicks_desc|created_desc|last_click_desc)$"),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
):
    rr = resolve_range(from_, to, tz_name=tz, default_days=7)

    filters: Dict[str, Any] = {}

    if is_active is not None:
        filters["is_active"] = is_active
    if tag:
        filters["tags"] = tag
    if q:
        filters["$or"] = [
            {"slug": {"$regex": q, "$options": "i"}},
            {"title": {"$regex": q, "$options": "i"}},
            {"original_url": {"$regex": q, "$options": "i"}},
        ]

    total = await db.links.count_documents(filters)

    skip = (page - 1) * page_size

    sort_stage = {"created_desc": {"created_at": -1}}.get(sort, {"created_at": -1})

    pipeline = [
        {"$match": filters},
        {"$sort": sort_stage},
        {"$skip": skip},
        {"$limit": page_size},
        {
            "$lookup": {
                "from": "access_logs",
                "let": {"slug": "$slug"},
                "pipeline": [
                    _ts_add_fields_stage(),
                    {
                        "$match": {
                            "$expr": {"$eq": ["$slug", "$$slug"]},
                        }
                    },
                    _ts_match_range_stage(rr.from_utc, rr.to_utc),
                    {
                        "$group": {
                            "_id": None,
                            "clicks": {"$sum": 1},
                            "ips": {"$addToSet": "$ip"},
                            "last_click": {"$max": "$ts"},
                        }
                    },
                    {
                        "$project": {
                            "_id": 0,
                            "clicks": 1,
                            "unique_ips": {"$size": "$ips"},
                            "last_click": 1,
                        }
                    },
                ],
                "as": "metrics",
            }
        },
        {"$unwind": {"path": "$metrics", "preserveNullAndEmptyArrays": True}},
        {
            "$addFields": {
                "clicks": {"$ifNull": ["$metrics.clicks", 0]},
                "unique_ips": {"$ifNull": ["$metrics.unique_ips", 0]},
                "last_click": "$metrics.last_click",
            }
        },
        {
            "$project": {
                "_id": 1,
                "slug": 1,
                "original_url": 1,
                "title": 1,
                "notes": 1,
                "tags": 1,
                "is_active": 1,
                "created_at": 1,
                "expires_at": 1,
                "max_clicks": 1,
                "clicks": 1,
                "unique_ips": 1,
                "last_click": 1,
            }
        },
    ]

    docs = await db.links.aggregate(pipeline).to_list(length=page_size)

    items: List[LinkListItem] = []
    for d in docs:
        items.append(
            LinkListItem(
                id=str(d["_id"]),
                slug=d["slug"],
                original_url=d["original_url"],
                title=d.get("title"),
                notes=d.get("notes"),
                tags=d.get("tags", []) or [],
                is_active=bool(d.get("is_active", True)),
                created_at=d["created_at"],
                expires_at=d.get("expires_at"),
                max_clicks=d.get("max_clicks"),
                clicks=int(d.get("clicks", 0) or 0),
                unique_ips=int(d.get("unique_ips", 0) or 0),
                last_click=d.get("last_click"),
            )
        )

    if sort == "clicks_desc":
        items.sort(key=lambda x: x.clicks, reverse=True)
    elif sort == "last_click_desc":
        items.sort(key=lambda x: x.last_click or datetime.min.replace(tzinfo=timezone.utc), reverse=True)

    return PaginatedLinksResponse(
        range=_range_out(rr),
        page=page,
        page_size=page_size,
        total=total,
        data=items,
    )


@router.get("/links/{slug}/stats", response_model=LinkStatsResponse, dependencies=[Depends(admin_required)])
async def link_stats(
    slug: str,
    from_: Optional[str] = Query(None, alias="from"),
    to: Optional[str] = Query(None),
    tz: str = Query("America/Sao_Paulo"),
    group_by: str = Query("day", pattern="^(day|hour)$"),
    top: int = Query(10, ge=1, le=50),
):
    rr = resolve_range(from_, to, tz_name=tz, default_days=7)

    link_doc = await db.links.find_one({"slug": slug})
    link_snapshot = None
    if link_doc:
        link_snapshot = {
            "id": str(link_doc["_id"]),
            "slug": link_doc["slug"],
            "original_url": link_doc.get("original_url"),
            "title": link_doc.get("title"),
            "tags": link_doc.get("tags", []) or [],
            "is_active": bool(link_doc.get("is_active", True)),
            "created_at": link_doc.get("created_at"),
            "expires_at": link_doc.get("expires_at"),
            "max_clicks": link_doc.get("max_clicks"),
        }

    fmt = "%Y-%m-%d" if group_by == "day" else "%Y-%m-%d %H:00"

    pipeline = [
        {"$match": {"slug": slug}},
        _ts_add_fields_stage(),
        _ts_match_range_stage(rr.from_utc, rr.to_utc),
        {
            "$facet": {
                "summary": [
                    {
                        "$group": {
                            "_id": None,
                            "clicks_total": {"$sum": 1},
                            "ips": {"$addToSet": "$ip"},
                            "last_click": {"$max": "$ts"},
                        }
                    },
                    {
                        "$project": {
                            "_id": 0,
                            "clicks_total": 1,
                            "unique_ips": {"$size": "$ips"},
                            "last_click": 1,
                        }
                    },
                ],
                "series": [
                    {
                        "$group": {
                            "_id": {"$dateToString": {"format": fmt, "date": "$ts"}},
                            "clicks": {"$sum": 1},
                        }
                    },
                    {"$sort": {"_id": 1}},
                    {"$project": {"_id": 0, "bucket": "$_id", "clicks": 1}},
                ],
                "browsers": [
                    {"$group": {"_id": "$browser", "count": {"$sum": 1}}},
                    {"$sort": {"count": -1}},
                    {"$limit": top},
                    {"$project": {"_id": 0, "key": "$_id", "count": 1}},
                ],
                "os": [
                    {"$group": {"_id": "$os", "count": {"$sum": 1}}},
                    {"$sort": {"count": -1}},
                    {"$limit": top},
                    {"$project": {"_id": 0, "key": "$_id", "count": 1}},
                ],
                "device_type": [
                    {
                        "$project": {
                            "device_type": {
                                "$switch": {
                                    "branches": [
                                        {"case": {"$eq": ["$is_mobile", True]}, "then": "mobile"},
                                        {"case": {"$eq": ["$is_tablet", True]}, "then": "tablet"},
                                        {"case": {"$eq": ["$is_pc", True]}, "then": "pc"},
                                    ],
                                    "default": "other",
                                }
                            }
                        }
                    },
                    {"$group": {"_id": "$device_type", "count": {"$sum": 1}}},
                    {"$sort": {"count": -1}},
                    {"$project": {"_id": 0, "key": "$_id", "count": 1}},
                ],
                "referers": [
                    {"$group": {"_id": "$referer", "count": {"$sum": 1}}},
                    {"$sort": {"count": -1}},
                    {"$limit": top},
                    {"$project": {"_id": 0, "key": "$_id", "count": 1}},
                ],
                "geo": [
                    {
                        "$group": {
                            "_id": {"country": "$country", "region": "$region", "city": "$city"},
                            "count": {"$sum": 1},
                        }
                    },
                    {"$sort": {"count": -1}},
                    {"$limit": top},
                    {
                        "$project": {
                            "_id": 0,
                            "country": "$_id.country",
                            "region": "$_id.region",
                            "city": "$_id.city",
                            "count": 1,
                        }
                    },
                ],
            }
        },
    ]

    agg = await db.access_logs.aggregate(pipeline).to_list(length=1)
    agg = agg[0] if agg else {}

    summary = (agg.get("summary") or [{}])[0]
    series = agg.get("series") or []
    browsers = agg.get("browsers") or []
    os_ = agg.get("os") or []
    device_type = agg.get("device_type") or []
    referers = agg.get("referers") or []
    geo = agg.get("geo") or []

    return LinkStatsResponse(
        range=_range_out(rr),
        slug=slug,
        link=link_snapshot,
        clicks_total=int(summary.get("clicks_total", 0) or 0),
        unique_ips=int(summary.get("unique_ips", 0) or 0),
        last_click=summary.get("last_click"),
        series=[SeriesPoint(**p) for p in series],
        browsers=browsers,
        os=os_,
        device_type=device_type,
        referers=referers,
        geo=geo,
    )


@router.get("/access-logs", response_model=PaginatedAccessLogsResponse, dependencies=[Depends(admin_required)])
async def access_logs(
    slug: Optional[str] = Query(None),
    from_: Optional[str] = Query(None, alias="from"),
    to: Optional[str] = Query(None),
    tz: str = Query("America/Sao_Paulo"),
    page: int = Query(1, ge=1),
    page_size: int = Query(50, ge=1, le=200),
):
    rr = resolve_range(from_, to, tz_name=tz, default_days=7)

    match_slug = {"slug": slug} if slug else {}

    pipeline_total = [
        {"$match": match_slug} if match_slug else {"$match": {}},
        _ts_add_fields_stage(),
        _ts_match_range_stage(rr.from_utc, rr.to_utc),
        {"$count": "total"},
    ]
    total_doc = await db.access_logs.aggregate(pipeline_total).to_list(length=1)
    total = int(total_doc[0]["total"]) if total_doc else 0

    skip = (page - 1) * page_size

    pipeline_page = [
        {"$match": match_slug} if match_slug else {"$match": {}},
        _ts_add_fields_stage(),
        _ts_match_range_stage(rr.from_utc, rr.to_utc),
        {"$sort": {"ts": -1}},
        {"$skip": skip},
        {"$limit": page_size},
        {
            "$project": {
                "_id": 1,
                "slug": 1,
                "ts": 1,
                "ip": 1,
                "user_agent": 1,
                "referer": 1,
                "browser": 1,
                "os": 1,
                "device": 1,
                "is_mobile": 1,
                "is_tablet": 1,
                "is_pc": 1,
                "country": 1,
                "region": 1,
                "city": 1,
            }
        },
    ]

    docs = await db.access_logs.aggregate(pipeline_page).to_list(length=page_size)

    items: List[AccessLogItem] = []
    for d in docs:
        items.append(
            AccessLogItem(
                id=str(d["_id"]),
                slug=d["slug"],
                timestamp=d["ts"],
                ip=d.get("ip"),
                user_agent=d.get("user_agent"),
                referer=d.get("referer"),
                browser=d.get("browser"),
                os=d.get("os"),
                device=d.get("device"),
                is_mobile=d.get("is_mobile"),
                is_tablet=d.get("is_tablet"),
                is_pc=d.get("is_pc"),
                country=d.get("country"),
                region=d.get("region"),
                city=d.get("city"),
            )
        )

    return PaginatedAccessLogsResponse(
        range=_range_out(rr),
        page=page,
        page_size=page_size,
        total=total,
        data=items,
    )
