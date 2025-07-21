from pydantic import BaseModel, Field, HttpUrl
from typing import Optional

class Link(BaseModel):
    name: str
    url: HttpUrl
    callback_url: Optional[HttpUrl] = None
    slug: Optional[str] = Field(default=None, min_length=2, max_length=10)
