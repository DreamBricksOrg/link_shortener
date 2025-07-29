import jwt
import structlog
import csv
import io
from typing import Optional, Any
from bson import ObjectId

from fastapi import APIRouter, Depends, HTTPException, Query, Path, status, Security, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.responses import StreamingResponse, HTMLResponse
from fastapi.templating import Jinja2Templates

from datetime import datetime, timezone, date, time
from core.config import settings
from core.db import db


router = APIRouter(prefix="/admin")
log = structlog.get_logger()
bearer = HTTPBearer(auto_error=False)
templates = Jinja2Templates(directory="src/static/templates")


@router.get("/", response_class=HTMLResponse)
async def index(request: Request):
    return templates.TemplateResponse("admin.html", {"request": request})

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
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="ID inválido")
    doc = await db.links.find_one({'_id': oid})
    if not doc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Link Encurtado não encontrada")
    doc['id'] = str(doc['_id'])
    return doc

@router.patch("/links/{link_id}")
async def update_shortlink(
    link_id: str = Path(..., title="Id do link encurtado"),
    description: Optional[str] = Query(None),
    original_url: Optional[str] = Query(None),
    callback_url: Optional[str] = Query(None)
):
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
        {"_id": link_id},
        {"$set": update_fields}
    )
    if result.modified_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Link encurtado não encontrado ou sem alterações"
        )

    doc = await db.links.find_one({"_id": link_id})
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

@router.delete("/links/{link_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_link(
    link_id: str = Path(..., description="ID do link encurtado a ser excluída")
):
    result = await db.links.delete_one({"_id": link_id})
    if result.deleted_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Link encurtado não encontrado"
        )
    log.info("link-deleted", id=link_id)
    return  # 204 No Content

@router.get("/links/{slug}/logs", dependencies=[Depends(admin_required)])
async def get_link_access_logs(slug: str, limit: int = 3):
    try:
        cursor = db.access_logs.find({"slug": slug}).sort("timestamp", -1).limit(limit + 1)
        result = []
        async for log in cursor:
            log["_id"] = str(log["_id"])
            result.append(log)

        if not result:
            raise HTTPException(status_code=404, detail="Nenhum log de acesso encontrado para este link.")

        return result

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