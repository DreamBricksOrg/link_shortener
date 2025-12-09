import structlog
import shortuuid
import httpx

from datetime import datetime, timezone
from urllib.parse import urlparse, urlunparse, parse_qsl, urlencode

from fastapi import APIRouter, HTTPException, Request, Form
from fastapi.responses import RedirectResponse, HTMLResponse
from fastapi.templating import Jinja2Templates

from core.config import settings
from core.db import db
from schemas.shortlink import ShortenResponse, AccessLogResponse, ShortenLinkRequest, ShortenLinkResponse
from utils.device import parse_user_agent, get_geo_from_ip
from utils.qr import generate_qr

router = APIRouter()
log = structlog.get_logger()
templates = Jinja2Templates(directory="src/static/templates")


@router.get("/", response_class=HTMLResponse)
async def index(request: Request):
    return templates.TemplateResponse("login.html", {"request": request})


@router.get("/alive")
async def alive():
    return "Alive"


@router.post("/shorten", response_model=ShortenResponse)
async def shorten_link(
    name: str = Form(...),
    url: str = Form(...),
    callback_url: str = Form(None),
    slug: str = Form(None),
):
    """
    Encurta uma URL fornecida, gerando um slug único e QR codes.
    Slug precisa ser único, com 6 caracteres alpha numéricos;
    se já existir, retorna erro 409.
    """
    slug = slug or shortuuid.uuid()[:6]
    if await db.links.find_one({"slug": slug}):
        raise HTTPException(status_code=409, detail="Slug já está em uso.")
    qr_png_path, qr_svg_path = generate_qr(slug)
    base_url = settings.BASE_URL
    qr_png = f"{base_url}/{qr_png_path}"
    qr_svg = f"{base_url}/{qr_svg_path}"
    await db.links.insert_one({
        "slug": slug,
        "original_url": url,
        "description": name,
        "callback_url": callback_url,
        "created_at": datetime.now().isoformat(),
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


@router.post("/shorten-link", response_model=ShortenLinkResponse)
async def create_or_get_base_link(payload: ShortenLinkRequest):
    """
    Cria um link encurtado a partir de ShortenLinkRequest.
    - Chama UMA vez com original_url = URL base da campanha
    - Define slug
    - Chamadas subsequentes com o mesmo original_url retornam o mesmo slug
    """

    slug = payload.slug or shortuuid.uuid()[:6]

    existing = await db.links.find_one({"slug": slug})
    if existing:
        raise HTTPException(
            status_code=409,
            detail="Slug já está em uso.",
        )

    now = datetime.now(timezone.utc)

    doc = {
        "original_url": str(payload.original_url),
        "slug": slug,
        "title": payload.title,
        "notes": payload.notes,
        "tags": payload.tags or [],
        "is_active": payload.is_active,
        "created_at": now,
        "updated_at": None,
        "expires_at": payload.expires_at,
        "max_clicks": payload.max_clicks,
        "click_count": 0,
    }

    result = await db.links.insert_one(doc)

    short_url = f"{settings.BASE_URL.rstrip('/')}/{slug}"

    return ShortenLinkResponse(
        id=str(result.inserted_id),
        original_url=doc["original_url"],
        slug=slug,
        short_url=short_url,
        title=doc["title"],
        notes=doc["notes"],
        tags=doc["tags"],
        is_active=doc["is_active"],
        created_at=doc["created_at"],
        updated_at=doc["updated_at"],
        expires_at=doc["expires_at"],
        max_clicks=doc["max_clicks"],
        click_count=doc["click_count"],
    )


@router.get("/{slug}", response_model=AccessLogResponse)
async def redirect(slug: str, request: Request):
    """
    Redireciona um slug para a URL original, registrando acesso
    e executando callback (se houver). Agora repassa também a query
    da requisição (?i=..., etc.) para a URL final.
    """
    link = await db.links.find_one({"slug": slug})
    if not link:
        raise HTTPException(status_code=404, detail="Link not found")

    base_url = link["original_url"]
    incoming_query = request.url.query

    if incoming_query:
        parsed = urlparse(base_url)
        existing_qs = dict(parse_qsl(parsed.query))
        new_qs = dict(parse_qsl(incoming_query))
        merged_qs = {**existing_qs, **new_qs}
        parsed = parsed._replace(query=urlencode(merged_qs, doseq=True))
        final_url = urlunparse(parsed)
    else:
        final_url = base_url

    ip = request.client.host
    ua = request.headers.get("user-agent", None)
    referer = request.headers.get("referer", None)
    accept_language = request.headers.get("accept-language", None)
    dnt = request.headers.get("dnt", None)
    connection = request.headers.get("connection", None)
    encoding = request.headers.get("accept-encoding", None)

    device_info = await parse_user_agent(ua)
    geo_info = await get_geo_from_ip(ip)
    device_info.pop("ip", None)
    geo_info.pop("ip", None)

    access_log = {
        "slug": slug,
        "timestamp": datetime.now().isoformat(),
        "ip": ip,
        "user_agent": ua,
        "referer": referer,
        "accept_language": accept_language,
        "dnt": dnt,
        "connection": connection,
        "encoding": encoding,
        "destination_url": final_url,
        **device_info,
        **geo_info,
    }

    result = await db.access_logs.insert_one(access_log)
    access_log["_id"] = str(result.inserted_id)

    log.info(
        "Link accessed",
        slug=slug,
        ip=ip,
        destination=final_url,
        **device_info,
        **geo_info,
    )

    if link.get("callback_url"):
        try:
            async with httpx.AsyncClient() as client:
                await client.post(
                    link["callback_url"],
                    json=access_log,
                    timeout=3.0,
                    headers={"Content-Type": "application/json"},
                )
            log.info("Callback enviado com sucesso", url=link["callback_url"])
        except Exception as e:
            log.warning("Callback failed", error=str(e))

    return RedirectResponse(final_url)
