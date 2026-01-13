from pydantic import BaseModel, Field
from typing import List, Optional

class RegenerateQrRequest(BaseModel):
    slug: Optional[str] = Field(default=None, description="Um slug para regenerar")
    slugs: Optional[List[str]] = Field(default=None, description="Lista de slugs para regenerar em lote")
    force: bool = Field(default=True, description="Se true, sobrescreve imagens existentes")

class RegenerateQrResult(BaseModel):
    slug: str
    ok: bool
    reason: Optional[str] = None
    qr_png: Optional[str] = None
    qr_svg: Optional[str] = None

class RegenerateQrResponse(BaseModel):
    updated: int
    results: List[RegenerateQrResult]
