import structlog

from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Query, Request, BackgroundTasks
from fastapi.responses import JSONResponse, FileResponse, HTMLResponse

from core.config import settings


router = APIRouter()
log = structlog.get_logger()


@router.get("/")
async def index():
    return "Hello Callback Link Shortener"


@router.get("/alive")
async def alive():
    return "Alive"

