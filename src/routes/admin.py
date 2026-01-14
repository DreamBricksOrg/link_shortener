import jwt
import structlog
import shortuuid
import csv
import io
import os

from typing import List, Optional, Any, Dict
from bson import ObjectId
from datetime import datetime, timezone, date, time

from fastapi import APIRouter, Depends, HTTPException, Query, Path, status, Security, Request, Form, Body
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.responses import StreamingResponse, HTMLResponse
from fastapi.templating import Jinja2Templates

from core.config import settings
from core.db import db
from schemas.shortlink import ShortenResponse
from utils.qr import generate_qr
from schemas.admin import RegenerateQrRequest, RegenerateQrResponse, RegenerateQrResult
from schemas.shortlink import ShortenResponse


router = APIRouter(prefix="/admin", tags=["admin"])
log = structlog.get_logger()
bearer = HTTPBearer(auto_error=False)
templates = Jinja2Templates(directory="src/static/templates")


@router.get("/", response_class=HTMLResponse)
async def index(request: Request):
    return templates.TemplateResponse("admin.html", {"request": request})

@router.get("/form", response_class=HTMLResponse)
async def index(request: Request):
    return templates.TemplateResponse("form.html", {"request": request})

# Admin auth
async def admin_required(
    credentials: HTTPAuthorizationCredentials = Security(bearer)
):
    if not credentials or not credentials.credentials:
        raise HTTPException(401, "Credenciais ausentes")
    try:
        payload = jwt.decode(
            credentials.credentials,
            settings.JWT_SECRET,
            algorithms=[settings.JWT_ALGORITHM],
        )
    except jwt.PyJWTError:
        raise HTTPException(401, "Token inválido")
    return payload

@router.post("/shorten",dependencies=[Depends(admin_required)],response_model=ShortenResponse)
async def shorten_link(
    name: str = Form(...),
    url: str = Form(...),
    callback_url: Optional[str] = Form(None),
    slug: Optional[str] = Form(None),
    notes: Optional[str] = Form(None),
    expires_at: Optional[datetime] = Form(None),
):
    """
    Endpoint de form do admin: cria um link,
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
        "title": name,
        "notes": notes,
        "tags": [],
        "is_active": True,
        "created_at": now,
        "updated_at": None,
        "expires_at": expires_at,
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
    callback_url: Optional[str] = Query(None),
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
    if callback_url:
        filters["callback_url"] = {"$regex": callback_url, "$options": "i"}
    if tag:
        filters["tags"] = tag
    if is_active is not None:
        filters["is_active"] = is_active

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
        results.append(
            {
                "id": str(doc["_id"]),
                "slug": doc.get("slug"),
                "original_url": doc.get("original_url"),
                "title": doc.get("title"),
                "notes": doc.get("notes"),
                "tags": doc.get("tags") or [],
                "is_active": bool(doc.get("is_active")),
                "callback_url": doc.get("callback_url"),
                "status": doc.get("status"),
                "created_at": doc.get("created_at"),
                "updated_at": doc.get("updated_at"),
                "expires_at": doc.get("expires_at"),
                "max_clicks": doc.get("max_clicks"),
                "click_count": doc.get("click_count", 0),
                "qr_png": doc.get("qr_png"),
                "qr_svg": doc.get("qr_svg"),
            }
        )

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
            writer.writerow([
                doc.get("id"),
                doc.get("slug"),
                doc.get("original_url"),
                doc.get("title"),
                doc.get("notes"),
                "|".join(doc.get("tags") or []),
                doc.get("is_active"),
                doc.get("created_at").isoformat() if doc.get("created_at") else "",
                doc.get("updated_at").isoformat() if doc.get("updated_at") else "",
                doc.get("expires_at").isoformat() if doc.get("expires_at") else "",
                doc.get("max_clicks") if doc.get("max_clicks") is not None else "",
                doc.get("click_count", 0),
                doc.get("callback_url") or "",
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

    return { 
        "id": str(doc["_id"]),
        "slug": doc.get("slug"),
        "original_url": doc.get("original_url"),
        "title": doc.get("title"),
        "notes": doc.get("notes"),
        "tags": doc.get("tags") or [],
        "is_active": bool(doc.get("is_active")),
        "callback_url": doc.get("callback_url"),
        "status": doc.get("status"),
        "created_at": doc.get("created_at"),
        "updated_at": doc.get("updated_at"),
        "expires_at": doc.get("expires_at"),
        "max_clicks": doc.get("max_clicks"),
        "click_count": doc.get("click_count", 0),
        "qr_png": doc.get("qr_png"),
        "qr_svg": doc.get("qr_svg"),
    }


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
    return { 
        "id": str(doc["_id"]),
        "slug": doc.get("slug"),
        "original_url": doc.get("original_url"),
        "title": doc.get("title"),
        "notes": doc.get("notes"),
        "tags": doc.get("tags") or [],
        "is_active": bool(doc.get("is_active")),
        "callback_url": doc.get("callback_url"),
        "status": doc.get("status"),
        "created_at": doc.get("created_at"),
        "updated_at": doc.get("updated_at"),
        "expires_at": doc.get("expires_at"),
        "max_clicks": doc.get("max_clicks"),
        "click_count": doc.get("click_count", 0),
        "qr_png": doc.get("qr_png"),
        "qr_svg": doc.get("qr_svg"),
    }


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
        raise HTTPException(status_code=204, detail="Nenhum log encontrado para este link")

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


@router.post("/qr/regenerate", dependencies=[Depends(admin_required)], response_model=RegenerateQrResponse)
async def regenerate_qr_codes(payload: RegenerateQrRequest = Body(...)):
    """
    Regenera QR codes para um ou vários slugs.
    - Cria/overwrite /app/src/static/{slug}.png e .svg
    - Atualiza o link: is_active=true, status=valid, qr_png/qr_svg, updated_at
    """
    if not payload.slug and not payload.slugs:
        raise HTTPException(status_code=400, detail="Provide either 'slug' or 'slugs'.")

    slugs: List[str] = []
    if payload.slug:
        slugs.append(payload.slug)
    if payload.slugs:
        slugs.extend(payload.slugs)

    seen = set()
    slugs = [s for s in slugs if s and not (s in seen or seen.add(s))]

    base_url = settings.BASE_URL.rstrip("/")
    now = datetime.now(timezone.utc)

    updated = 0
    results: List[RegenerateQrResult] = []

    for slug in slugs:
        doc = await db.links.find_one({"slug": slug})
        if not doc:
            results.append(RegenerateQrResult(slug=slug, ok=False, reason="link_not_found"))
            continue

        try:
            png_path = f"/app/src/static/{slug}.png"
            svg_path = f"/app/src/static/{slug}.svg"

            if not payload.force and os.path.exists(png_path) and os.path.exists(svg_path):
                qr_png = f"{base_url}/src/static/{slug}.png"
                qr_svg = f"{base_url}/src/static/{slug}.svg"

                res = await db.links.update_one(
                    {"_id": doc["_id"]},
                    {"$set": {
                        "qr_png": qr_png,
                        "qr_svg": qr_svg,
                        "is_active": True,
                        "status": "valid",
                        "updated_at": now,
                    }},
                )
                if res.modified_count:
                    updated += 1

                results.append(RegenerateQrResult(slug=slug, ok=True, reason="skipped_files_exist", qr_png=qr_png, qr_svg=qr_svg))
                continue

            qr_png_rel, qr_svg_rel = generate_qr(slug)
            if "/" in qr_png_rel:
                qr_png_url = f"{base_url}/{qr_png_rel.lstrip('/')}"
            else:
                qr_png_url = f"{base_url}/{qr_png_rel}"

            if "/" in qr_svg_rel:
                qr_svg_url = f"{base_url}/{qr_svg_rel.lstrip('/')}"
            else:
                qr_svg_url = f"{base_url}/{qr_svg_rel}"

            res = await db.links.update_one(
                {"_id": doc["_id"]},
                {"$set": {
                    "qr_png": qr_png_url,
                    "qr_svg": qr_svg_url,
                    "is_active": True,
                    "status": "valid",
                    "updated_at": now,
                }},
            )

            if res.modified_count:
                updated += 1

            results.append(RegenerateQrResult(slug=slug, ok=True, qr_png=qr_png_url, qr_svg=qr_svg_url))

        except Exception as e:
            results.append(RegenerateQrResult(slug=slug, ok=False, reason=str(e)))

    log.info("admin-qr-regenerate", updated=updated, requested=len(slugs))
    return RegenerateQrResponse(updated=updated, results=results)
