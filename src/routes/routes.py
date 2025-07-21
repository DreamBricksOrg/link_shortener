import structlog
import shortuuid
import httpx
from datetime import datetime

from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import RedirectResponse

from core.db import db
from model.shortlink import LinkCreate
from schemas.shortlink import ShortenResponse, AccessLogResponse
from utils.qr import generate_qr
from utils.device import parse_user_agent


router = APIRouter()
log = structlog.get_logger()


@router.get("/")
async def index():
    return "Hello Callback Link Shortener"


@router.get("/alive")
async def alive():
    return "Alive"

@router.post("/shorten", response_model=ShortenResponse)
async def shorten_link(data: LinkCreate):
    slug = data.slug or shortuuid.uuid()[:6]
    if await db.links.find_one({"slug": slug}):
        raise HTTPException(status_code=409, detail="Slug já está em uso.")
    qr_png_path, qr_svg_path = generate_qr(slug)

    await db.links.insert_one({
        "slug": slug,
        "original_url": data.url,
        "description": data.name,
        "callback_url": data.callback_url,
        "created_at": datetime.now(),
        "qr_png": qr_png_path,
        "qr_svg": qr_svg_path
    })

    log.info("Link created", slug=slug, url=data.url)
    return ShortenResponse(slug=slug, qr_png=qr_png_path, qr_svg=qr_svg_path)

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
        "timestamp": datetime.now(),
        "ip": ip,
        "user_agent": ua,
        **device_info
    }

    await db.access_logs.insert_one(access_log)
    log.info("Link accessed", slug=slug, ip=ip, **device_info)

    if link.get("callback_url"):
        try:
            async with httpx.AsyncClient() as client:
                await client.post(link["callback_url"], json=access_log, timeout=3.0)
        except Exception as e:
            log.warning("Callback failed", error=str(e))

    return RedirectResponse(link["original_url"])
