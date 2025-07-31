import structlog
import httpx
from datetime import datetime

from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import RedirectResponse, HTMLResponse
from fastapi.templating import Jinja2Templates

from core.db import db
from schemas.shortlink import AccessLogResponse
from utils.device import parse_user_agent, get_geo_from_ip


router = APIRouter()
log = structlog.get_logger()
templates = Jinja2Templates(directory="src/static/templates")


@router.get("/", response_class=HTMLResponse)
async def index(request: Request):
    return templates.TemplateResponse("login.html", {"request": request})


@router.get("/alive")
async def alive():
    return "Alive"

@router.get("/{slug}", response_model=AccessLogResponse)
async def redirect(slug: str, request: Request):
    link = await db.links.find_one({"slug": slug})
    if not link:
        raise HTTPException(status_code=404, detail="Link not found")

    ip = request.client.host
    ua = request.headers.get("user-agent", None)
    referer = request.headers.get("referer", None)
    accept_language = request.headers.get("accept-language", None)
    dnt = request.headers.get("dnt", None)
    connection = request.headers.get("connection", None)
    encoding = request.headers.get("accept-encoding", None)

    device_info = await parse_user_agent(ua)
    geo_info = await get_geo_from_ip(ip)

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
        **device_info,
        **geo_info
    }

    result = await db.access_logs.insert_one(access_log)
    access_log["_id"] = str(result.inserted_id)
    log.info("Link accessed", slug=slug, ip=ip, **device_info, **geo_info)

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

