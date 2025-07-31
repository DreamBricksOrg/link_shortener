import jwt
import structlog
import shortuuid
import csv
import io
import os

from typing import Optional, Any
from bson import ObjectId
from datetime import datetime, timezone, date, time

from fastapi import APIRouter, Depends, HTTPException, Query, Path, status, Security, Request, Form
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.responses import StreamingResponse, HTMLResponse
from fastapi.templating import Jinja2Templates

from core.config import settings
from core.db import db
from schemas.shortlink import ShortenResponse
from utils.qr import generate_qr

router = APIRouter(prefix="/admin")
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

@router.post("/shorten", dependencies=[Depends(admin_required)], response_model=ShortenResponse)
async def shorten_link(
    name: str = Form(...),
    url: str = Form(...),
    callback_url: str = Form(None),
    slug: str = Form(None),
):
    slug = slug or shortuuid.uuid()[:6]
    if await db.links.find_one({"slug": slug}):
        raise HTTPException(status_code=409, detail="Slug já está em uso.")
    qr_png_path, qr_svg_path = generate_qr(slug)
    base_url = settings.BASE_URL
    qr_png =f"{base_url}/{qr_png_path}"
    qr_svg =f"{base_url}/{qr_svg_path}"
    await db.links.insert_one({
        "slug": slug,
        "original_url": url,
        "description": name,
        "callback_url": callback_url,
        "createdAt": datetime.now().isoformat(),
        "qr_png": qr_png,
        "qr_svg": qr_svg,
        "status": "valid"
    })

    log.info("Link created", slug=slug, url=url)
    return ShortenResponse(
        slug=slug,
        qr_png=qr_png,
        qr_svg=qr_svg
    )

@router.get("/links", dependencies=[Depends(admin_required)], response_model=Any)
async def list_shortlinks(
    slug: Optional[str] = Query(None),
    description: Optional[str] = Query(None),
    original_url: Optional[str] = Query(None),
    callback_url: Optional[str] = Query(None),
    date_from: Optional[date] = Query(None),
    date_to: Optional[date] = Query(None),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
) -> Any:
    filters: dict = {}

    if slug:
        filters["slug"] = {"$regex": slug, "$options": "i"}
    if description:
        filters["description"] = {"$regex": description, "$options": "i"}
    if original_url:
        filters["original_url"] = {"$regex": original_url, "$options": "i"}
    if callback_url:
        filters["callback_url"] = {"$regex": callback_url, "$options": "i"}

    if date_from or date_to:
        dt_filter: dict = {}
        if date_from:
            start = datetime.combine(date_from, time.min).replace(tzinfo=timezone.utc)
            dt_filter["$gte"] = start
        if date_to:
            end = datetime.combine(date_to, time.max).replace(tzinfo=timezone.utc)
            dt_filter["$lte"] = end
        filters["createdAt"] = dt_filter

    skip = (page - 1) * page_size

    cursor = (
        db.links
        .find(filters)
        .sort("createdAt", -1)
        .skip(skip)
        .limit(page_size)
    )

    results = []
    async for doc in cursor:
        results.append({
            "id": str(doc["_id"]),
            "description": doc["description"],
            "slug": doc["slug"],
            "original_url": doc["original_url"],
            "callback_url": doc.get("callback_url"),
            "status": doc["status"],
            "createdAt": doc["createdAt"],
            "qr_png": doc.get("qr_png"),
            "qr_svg": doc.get("qr_svg"),
        })

    total = await db.registrations.count_documents(filters)

    return {
        "data": results,
        "page": page,
        "page_size": page_size,
        "total": total
    }

@router.get("/links/export", response_class=StreamingResponse)
async def export_shortlinks(
    slug: Optional[str] = Query(None),
    description: Optional[str] = Query(None),
    original_url: Optional[str] = Query(None),
    callback_url: Optional[str] = Query(None),
    date_from: Optional[date] = Query(None),
    date_to: Optional[date] = Query(None),
):
    filters: dict = {}

    if slug:
        filters["slug"] = {"$regex": slug, "$options": "i"}
    if description:
        filters["description"] = {"$regex": description, "$options": "i"}
    if original_url:
        filters["original_url"] = {"$regex": original_url, "$options": "i"}
    if callback_url:
        filters["callback_url"] = {"$regex": callback_url, "$options": "i"}

    if date_from or date_to:
        dtf: dict = {}
        if date_from:
            dtf["$gte"] = datetime.combine(date_from, time.min).replace(tzinfo=timezone.utc)
        if date_to:
            dtf["$lte"] = datetime.combine(date_to, time.max).replace(tzinfo=timezone.utc)
        filters["createdAt"] = dtf

    cursor = db.links.find(filters).sort("createdAt", -1)

    async def csv_generator():
        buf = io.StringIO()
        writer = csv.writer(buf)
        # cabeçalho
        writer.writerow([
            "id", "description", "slug", "original_url", "callback_url",
            "status", "createdAt", "qr_png", "qr_svg"
        ])
        yield buf.getvalue()
        buf.seek(0); buf.truncate(0)

        async for doc in cursor:
            writer.writerow([
                str(doc["_id"]),
                doc.get("description", ""),
                doc.get("slug", ""),
                doc.get("original_url", ""),
                doc.get("callback_url", ""),
                doc.get("status", ""),
                doc.get("createdAt"),
                doc.get("qr_png", ""),
                doc.get("qr_svg", "")
            ])
            yield buf.getvalue()
            buf.seek(0); buf.truncate(0)

    now = datetime.now().strftime("%Y%m%d-%H%M")
    filename = f"shortlinks-{slug}-{now}.csv"

    headers = {
        "Content-Disposition": f"attachment;filename={filename}",
        "Content-Type": "text/csv; charset=utf-8"
    }
    log.info("links-exported", filters=filters)
    return StreamingResponse(csv_generator(), headers=headers)

@router.get("/links/{link_id}", dependencies=[Depends(admin_required)])
async def get_shortlink(
    link_id: str = Path(..., title="ID do link encurtado")
):
    """ Get all shortlink details."""
    try:
        oid = ObjectId(link_id)
    except Exception:
        raise HTTPException(status_code=400, detail="ID inválido")
    doc = await db.links.find_one({'_id': oid})
    if not doc:
        raise HTTPException(status_code=404, detail="Link Encurtado não encontrada")
    doc['id'] = str(doc['_id'])
    return doc

@router.patch("/links/{link_id}")
async def update_shortlink(
    link_id: str = Path(..., title="Id do link encurtado"),
    description: Optional[str] = Query(None),
    original_url: Optional[str] = Query(None),
    callback_url: Optional[str] = Query(None)
):
    try:
        oid = ObjectId(link_id)
    except Exception:
        raise HTTPException(status_code=400, detail="ID inválido")
    
    update_fields = {
        "status": "modified",
        "reviewedAt": datetime.now(timezone.utc),
    }
    if description is not None:
        update_fields["description"] = description

    if original_url is not None:
        update_fields["original_url"] = original_url

    if callback_url is not None:
        update_fields["callback_url"] = callback_url

    result = await db.links.update_one(
        {"_id": oid},
        {"$set": update_fields}
    )
    if result.modified_count == 0:
        raise HTTPException(
            status_code=404,
            detail="Link encurtado não encontrado ou sem alterações"
        )

    doc = await db.links.find_one({"_id": oid})
    if not doc:
        raise HTTPException(500, "Documento não existe")

    log.info("link-updated", id=link_id, updates=update_fields)
    return {
        "id": str(doc["_id"]),
        "description": doc["description"],
        "slug": doc["slug"],
        "original_url": doc["original_url"],
        "callback_url": doc.get("callback_url"),
        "status": doc["status"],
        "createdAt": doc["createdAt"],
        "reviewedAt": doc["reviewedAt"],
        "qr_png": doc.get("qr_png"),
        "qr_svg": doc.get("qr_svg"),
    }

@router.delete("/links/{link_id}", status_code=204)
async def delete_link(
    link_id: str = Path(..., description="ID do link encurtado a ser excluído")
):
    try:
        oid = ObjectId(link_id)
    except Exception:
        raise HTTPException(status_code=400, detail="ID inválido")
    link = await db.links.find_one({"_id": oid})
    if not link:
        raise HTTPException(
            status_code=404,
            detail="Link encurtado não encontrado"
        )

    slug = link["slug"]
    timestamp = datetime.now().strftime("%Y-%m-%d")
    new_slug = f"{slug}_deleted_{timestamp}"

    # Atualizar os access_logs com o novo slug
    await db.access_logs.update_many(
        {"slug": slug},
        {"$set": {"slug": new_slug}}
    )

    await db.links.delete_one({"_id": oid})

    # Remover arquivos QR da pasta /src/static
    for ext in ["png", "svg"]:
        path = f"./src/static/{slug}.{ext}"
        try:
            os.remove(path)
            log.info("qr-code-deleted", path=path)
        except FileNotFoundError:
            log.warning("qr-code-not-found", path=path)

    log.info("link-deleted", id=link_id, slug=slug)
    return  # 204 No Content

@router.get("/links/{slug}/logs", dependencies=[Depends(admin_required)])
async def get_link_access_logs(slug: str, limit: int = 3):
    try:
        logs_cursor = db.access_logs.find({"slug": slug}).sort("timestamp", -1).limit(limit + 1)
        logs = []
        async for log_doc in logs_cursor:
            log_doc["_id"] = str(log_doc["_id"])
            logs.append(log_doc)

        if not logs:
            raise HTTPException(status_code=404, detail="Nenhum log de acesso encontrado para este link.")

        return logs

    except Exception as e:
        log.error("Erro ao buscar logs", error=str(e))
        raise HTTPException(status_code=500, detail="Erro interno ao buscar logs.")

@router.get("/links/{slug}/logs/export", dependencies=[Depends(admin_required)])
async def export_access_logs(slug: str):
    logs_cursor = db.access_logs.find({"slug": slug}).sort("timestamp", -1)
    logs = []
    async for log in logs_cursor:
        logs.append(log)

    if not logs:
        raise HTTPException(status_code=404, detail="Nenhum log encontrado")

    output = io.StringIO()
    writer = csv.DictWriter(output, fieldnames=logs[0].keys())
    writer.writeheader()
    writer.writerows(logs)

    now = datetime.now().strftime("%Y%m%d-%H%M")
    filename = f"accesslog-{slug}-{now}.csv"

    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )