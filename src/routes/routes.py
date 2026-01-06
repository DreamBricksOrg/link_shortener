import csv
import io
import jwt
import os
import shortuuid
import structlog

from typing import Optional, Any, Dict, List
from bson import ObjectId
from datetime import datetime, timezone, date, time

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    Query,
    Path,
    Security,
    Request,
    Form,
)
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.responses import StreamingResponse, HTMLResponse
from fastapi.templating import Jinja2Templates

from core.config import settings
from core.db import db
from schemas.shortlink import ShortenResponse
from utils.qr import generate_qr

router = APIRouter(prefix="/admin", tags=["admin"])
log = structlog.get_logger()
bearer = HTTPBearer(auto_error=False)
templates = Jinja2Templates(directory="src/static/templates")


@router.get("/", response_class=HTMLResponse)
async def admin_index(request: Request):
    return templates.TemplateResponse("admin.html", {"request": request})


@router.get("/form", response_class=HTMLResponse)
async def admin_form(request: Request):
    return templates.TemplateResponse("form.html", {"request": request})


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


def _safe_dt(value: Any) -> Optional[datetime]:
    """
    Suporta:
    - datetime
    - string isoformat
    - None
    """
    if value is None:
        return None
    if isinstance(value, datetime):
        return value
    if isinstance(value, str):
        v = value.strip()
        if not v:
            return None
        # suporta "Z"
        if v.endswith("Z"):
            v = v[:-1] + "+00:00"
        try:
            dt = datetime.fromisoformat(v)
            if dt.tzinfo is None:
                dt = dt.replace(tzinfo=timezone.utc)
            return dt.astimezone(timezone.utc)
        except Exception:
            return None
    return None


def _serialize_link(doc: Dict[str, Any]) -> Dict[str, Any]:
    """
    Normaliza doc (novo + legado) em uma saída consistente para admin.
    """
    created_at = (
        _safe_dt(doc.get("created_at"))
        or _safe_dt(doc.get("createdAt"))
        or datetime.now(timezone.utc)
    )

    updated_at = _safe_dt(doc.get("updated_at")) or _safe_dt(doc.get("reviewedAt"))
    expires_at = _safe_dt(doc.get("expires_at"))
    title = doc.get("title")
    notes = doc.get("notes")
    tags = doc.get("tags") or []
    is_active = doc.get("is_active")
    description = doc.get("description")
    status = doc.get("status")

    if is_active is None and status is not None:
        is_active = (status == "valid")
    if is_active is None:
        is_active = True

    return {
        "id": str(doc["_id"]),
        "slug": doc.get("slug"),
        "original_url": doc.get("original_url"),
        "title": title,
        "description": description,
        "notes": notes,
        "tags": tags,
        "is_active": bool(is_active),
        "callback_url": doc.get("callback_url"),
        "status": status,
        "created_at": created_at,
        "updated_at": updated_at,
        "expires_at": expires_at,
        "max_clicks": doc.get("max_clicks"),
        "click_count": doc.get("click_count", 0),
        "qr_png": doc.get("qr_png"),
        "qr_svg": doc.get("qr_svg"),
    }


@router.post(
    "/shorten",
    dependencies=[Depends(admin_required)],
    response_model=ShortenResponse,
)
async def shorten_link(
    name: str = Form(...),
    url: str = Form(...),
    callback_url: Optional[str] = Form(None),
    slug: Optional[str] = Form(None),
):
    """
    Endpoint de form do admin: cria um link (modelo novo),
    e gera QR (mantendo o retorno ShortenResponse).
    """
    slug = slug or shortuuid.uuid()[:6]
    if await db.links.find_one({"slug": slug}):
        raise HTTPException(status_code=409, detail="Slug já está em uso.")

    qr_png_path, qr_svg_path = generate_qr(slug)
    base_url = settings.BASE_URL.rstrip("/")
    qr_png = f"{base_url}/{qr_png_path}"
    qr_svg = f"{base_url}/{qr_svg_path}"

    now = datetime.now(timezone.utc)

    doc = {
        "slug": slug,
        "original_url": url,

        # novo schema
        "title": name,
        "notes": None,
        "tags": [],
        "is_active": True,
        "created_at": now,
        "updated_at": None,
        "expires_at": None,
        "max_clicks": None,
        "click_count": 0,
        "callback_url": callback_url,
        "qr_png": qr_png,
        "qr_svg": qr_svg,
        "status": "valid",
    }

    await db.links.insert_one(doc)

    log.info("admin-link-created", slug=slug, original_url=url)
    return ShortenResponse(slug=slug, qr_png=qr_png, qr_svg=qr_svg)


@router.get(
    "/links",
    dependencies=[Depends(admin_required)],
    response_model=Any,
)
async def list_links(
    slug: Optional[str] = Query(None),
    title: Optional[str] = Query(None),
    original_url: Optional[str] = Query(None),
    tag: Optional[str] = Query(None),
    is_active: Optional[bool] = Query(None),
    date_from: Optional[date] = Query(None),
    date_to: Optional[date] = Query(None),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
) -> Any:
    filters: Dict[str, Any] = {}

    if slug:
        filters["slug"] = {"$regex": slug, "$options": "i"}
    if title:
        filters["title"] = {"$regex": title, "$options": "i"}
    if original_url:
        filters["original_url"] = {"$regex": original_url, "$options": "i"}
    if tag:
        filters["tags"] = tag
    if is_active is not None:
        filters["is_active"] = is_active

    # Range: created_at (novo). Se ainda tiver legado, isso não filtra os velhos — ok por agora.
    if date_from or date_to:
        dt_filter: Dict[str, Any] = {}
        if date_from:
            start = datetime.combine(date_from, time.min).replace(tzinfo=timezone.utc)
            dt_filter["$gte"] = start
        if date_to:
            end = datetime.combine(date_to, time.max).replace(tzinfo=timezone.utc)
            dt_filter["$lte"] = end
        filters["created_at"] = dt_filter

    skip = (page - 1) * page_size

    cursor = (
        db.links
        .find(filters)
        .sort("created_at", -1)
        .skip(skip)
        .limit(page_size)
    )

    results: List[Dict[str, Any]] = []
    async for doc in cursor:
        results.append(_serialize_link(doc))

    total = await db.links.count_documents(filters)

    return {
        "data": results,
        "page": page,
        "page_size": page_size,
        "total": total,
    }


@router.get(
    "/links/export",
    dependencies=[Depends(admin_required)],
    response_class=StreamingResponse,
)
async def export_links(
    slug: Optional[str] = Query(None),
    title: Optional[str] = Query(None),
    original_url: Optional[str] = Query(None),
    tag: Optional[str] = Query(None),
    is_active: Optional[bool] = Query(None),
    date_from: Optional[date] = Query(None),
    date_to: Optional[date] = Query(None),
):
    filters: Dict[str, Any] = {}

    if slug:
        filters["slug"] = {"$regex": slug, "$options": "i"}
    if title:
        filters["title"] = {"$regex": title, "$options": "i"}
    if original_url:
        filters["original_url"] = {"$regex": original_url, "$options": "i"}
    if tag:
        filters["tags"] = tag
    if is_active is not None:
        filters["is_active"] = is_active

    if date_from or date_to:
        dt_filter: Dict[str, Any] = {}
        if date_from:
            dt_filter["$gte"] = datetime.combine(date_from, time.min).replace(tzinfo=timezone.utc)
        if date_to:
            dt_filter["$lte"] = datetime.combine(date_to, time.max).replace(tzinfo=timezone.utc)
        filters["created_at"] = dt_filter

    cursor = db.links.find(filters).sort("created_at", -1)

    async def csv_generator():
        buf = io.StringIO()
        writer = csv.writer(buf)

        writer.writerow([
            "id",
            "slug",
            "original_url",
            "title",
            "notes",
            "tags",
            "is_active",
            "created_at",
            "updated_at",
            "expires_at",
            "max_clicks",
            "click_count",
            "callback_url",
        ])
        yield buf.getvalue()
        buf.seek(0); buf.truncate(0)

        async for doc in cursor:
            s = _serialize_link(doc)
            writer.writerow([
                s.get("id"),
                s.get("slug"),
                s.get("original_url"),
                s.get("title"),
                s.get("notes"),
                "|".join(s.get("tags") or []),
                s.get("is_active"),
                s.get("created_at").isoformat() if s.get("created_at") else "",
                s.get("updated_at").isoformat() if s.get("updated_at") else "",
                s.get("expires_at").isoformat() if s.get("expires_at") else "",
                s.get("max_clicks") if s.get("max_clicks") is not None else "",
                s.get("click_count", 0),
                s.get("callback_url") or "",
            ])
            yield buf.getvalue()
            buf.seek(0); buf.truncate(0)

    now = datetime.now().strftime("%Y%m%d-%H%M")
    filename = f"links-{now}.csv"

    headers = {
        "Content-Disposition": f"attachment;filename={filename}",
        "Content-Type": "text/csv; charset=utf-8",
    }

    log.info("admin-links-exported", filters=filters)
    return StreamingResponse(csv_generator(), headers=headers)


@router.get(
    "/links/{link_id}",
    dependencies=[Depends(admin_required)],
)
async def get_link(link_id: str = Path(..., title="ID do link")):
    try:
        oid = ObjectId(link_id)
    except Exception:
        raise HTTPException(status_code=400, detail="ID inválido")

    doc = await db.links.find_one({"_id": oid})
    if not doc:
        raise HTTPException(status_code=404, detail="Link não encontrado")

    return _serialize_link(doc)


@router.patch(
    "/links/{link_id}",
    dependencies=[Depends(admin_required)],
)
async def update_link(
    link_id: str = Path(..., title="ID do link"),
    title: Optional[str] = Query(None),
    original_url: Optional[str] = Query(None),
    notes: Optional[str] = Query(None),
    tags: Optional[str] = Query(None, description="Tags separadas por vírgula"),
    is_active: Optional[bool] = Query(None),
    callback_url: Optional[str] = Query(None),
):
    try:
        oid = ObjectId(link_id)
    except Exception:
        raise HTTPException(status_code=400, detail="ID inválido")

    update_fields: Dict[str, Any] = {
        "updated_at": datetime.now(timezone.utc),
    }

    if title is not None:
        update_fields["title"] = title
    if original_url is not None:
        update_fields["original_url"] = original_url
    if notes is not None:
        update_fields["notes"] = notes
    if tags is not None:
        parsed = [t.strip() for t in tags.split(",") if t.strip()]
        update_fields["tags"] = parsed
    if is_active is not None:
        update_fields["is_active"] = is_active
    if callback_url is not None:
        update_fields["callback_url"] = callback_url

    result = await db.links.update_one({"_id": oid}, {"$set": update_fields})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Link não encontrado")

    doc = await db.links.find_one({"_id": oid})
    if not doc:
        raise HTTPException(status_code=500, detail="Documento não existe após update")

    log.info("admin-link-updated", id=link_id, updates=list(update_fields.keys()))
    return _serialize_link(doc)


@router.delete(
    "/links/{link_id}",
    dependencies=[Depends(admin_required)],
    status_code=204,
)
async def delete_link(link_id: str = Path(..., description="ID do link a ser excluído")):
    """
    Renomeia o slug nos access_logs e remove o link.
    """
    try:
        oid = ObjectId(link_id)
    except Exception:
        raise HTTPException(status_code=400, detail="ID inválido")

    link = await db.links.find_one({"_id": oid})
    if not link:
        raise HTTPException(status_code=404, detail="Link não encontrado")

    slug = link.get("slug")
    if not slug:
        raise HTTPException(status_code=400, detail="Documento sem slug")

    timestamp = datetime.now().strftime("%Y-%m-%d")
    new_slug = f"{slug}_deleted_{timestamp}"

    await db.access_logs.update_many({"slug": slug}, {"$set": {"slug": new_slug}})

    await db.links.delete_one({"_id": oid})

    for ext in ["png", "svg"]:
        path = f"./src/static/{slug}.{ext}"
        try:
            os.remove(path)
            log.info("qr-code-deleted", path=path)
        except FileNotFoundError:
            pass

    log.info("admin-link-deleted", id=link_id, slug=slug, new_slug=new_slug)
    return


@router.get(
    "/links/{slug}/logs",
    dependencies=[Depends(admin_required)],
)
async def get_link_access_logs(slug: str, limit: int = 50):
    """
    Lista logs do slug.
    """
    sort_field = "ts"
    cursor = (
        db.access_logs
        .find({"slug": slug})
        .sort(sort_field, -1)
        .limit(limit)
    )

    logs_out: List[Dict[str, Any]] = []
    async for doc in cursor:
        doc["_id"] = str(doc["_id"])
        # normaliza timestamp de saída
        if doc.get("ts") and isinstance(doc["ts"], datetime):
            doc["timestamp"] = doc["ts"].isoformat()
        logs_out.append(doc)

    if not logs_out:
        raise HTTPException(status_code=404, detail="Nenhum log encontrado para este link")

    return logs_out


@router.get(
    "/links/{slug}/logs/export",
    dependencies=[Depends(admin_required)],
)
async def export_access_logs(slug: str):
    cursor = db.access_logs.find({"slug": slug}).sort("ts", -1)

    docs: List[Dict[str, Any]] = []
    async for doc in cursor:
        doc["_id"] = str(doc["_id"])
        if doc.get("ts") and isinstance(doc["ts"], datetime):
            doc["timestamp"] = doc["ts"].isoformat()
        docs.append(doc)

    if not docs:
        raise HTTPException(status_code=404, detail="Nenhum log encontrado")

    output = io.StringIO()
    fieldnames = sorted({k for d in docs for k in d.keys()})

    writer = csv.DictWriter(output, fieldnames=fieldnames)
    writer.writeheader()
    writer.writerows(docs)

    now = datetime.now().strftime("%Y%m%d-%H%M")
    filename = f"accesslog-{slug}-{now}.csv"

    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename={filename}"},
    )
