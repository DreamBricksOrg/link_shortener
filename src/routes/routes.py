import structlog
import shortuuid
import httpx
from datetime import datetime

from fastapi import APIRouter, HTTPException, Request, Form
from fastapi.responses import RedirectResponse, HTMLResponse
from fastapi.templating import Jinja2Templates
from fastapi.encoders import jsonable_encoder

from core.db import db
from core.config import settings
from model.shortlink import LinkCreate
from schemas.shortlink import ShortenResponse, AccessLogResponse
from utils.qr import generate_qr
from utils.device import parse_user_agent

router = APIRouter()
log = structlog.get_logger()
templates = Jinja2Templates(directory="src/static/templates")


@router.get("/", response_class=HTMLResponse)
async def index(request: Request):
    return templates.TemplateResponse("form.html", {"request": request})


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

@router.get("/{slug}", response_model=AccessLogResponse)
async def redirect(slug: str, request: Request):
    link = await db.links.find_one({"slug": slug})
    if not link:
        raise HTTPException(status_code=404, detail="Link not found")

    ip = request.client.host
    ua = request.headers.get("user-agent", "")
    device_info = parse_user_agent(ua)
    access_log = {
        "slug": slug,
        "timestamp": datetime.now().isoformat(),
        "ip": ip,
        "user_agent": ua,
        **device_info
    }

    result = await db.access_logs.insert_one(access_log)
    access_log["_id"] = str(result.inserted_id)
    log.info("Link accessed", slug=slug, ip=ip, **device_info)

    if link.get("callback_url"):
        try:
            async with httpx.AsyncClient() as client:
                await client.post(
                    link["callback_url"],
                    json=access_log,
                    timeout=3.0,
                    headers={"Content-Type": "application/json"}
                )
                log.info("Callback enviado com sucesso", url=link["callback_url"])
        except Exception as e:
            log.warning("Callback failed", error=str(e))

    return RedirectResponse(link["original_url"])
