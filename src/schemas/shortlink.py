from pydantic import BaseModel, HttpUrl
from datetime import datetime
from typing import Literal

class ShortenResponse(BaseModel):
    slug: str
    qr_png: HttpUrl
    qr_svg: HttpUrl

class AccessLogResponse(BaseModel):
    status: Literal["redirect"]
    slug: str
    original_url: HttpUrl
    redirected_at: datetime
