import structlog
import logging
import os
from pathlib import Path

from sentry_sdk import init as sentry_init
from sentry_sdk.integrations.asgi import SentryAsgiMiddleware

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from core.config import settings
from utils.log_sender import LogSender
from routes.routes import router as rest_router
from routes.auth import router as auth_router
from routes.admin import router as admin_router
from routes.dash import router as dash_router


logging.basicConfig(level=logging.INFO, format="%(message)s")

sentry_init(
    dsn=settings.SENTRY_DSN,
    traces_sample_rate=1.0,
)

structlog.configure(
    processors=[
        structlog.processors.TimeStamper(fmt="iso"),
        structlog.processors.add_log_level,
        structlog.processors.StackInfoRenderer(),
        structlog.processors.format_exc_info,
        structlog.processors.JSONRenderer(),
    ],
    context_class=dict,
    logger_factory=structlog.stdlib.LoggerFactory(),
    wrapper_class=structlog.stdlib.BoundLogger,
    cache_logger_on_first_use=True,
)

log = structlog.get_logger(__name__)

log_sender = LogSender(
    log_api=settings.LOG_API,
    project_id=settings.LOG_PROJECT_ID,
    upload_delay=120
)

BASE_DIR = Path(__file__).resolve().parent
STATIC_DIR = os.path.join(BASE_DIR, "static")

app = FastAPI()
app.add_middleware(SentryAsgiMiddleware)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # ajustar conforme política de produção
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/src/static", StaticFiles(directory="src/static"), name="src-static")

app.include_router(rest_router)
app.include_router(auth_router)
app.include_router(admin_router)
app.include_router(dash_router)
