from __future__ import annotations

import re

from datetime import datetime
from typing import Literal, Optional, List

from pydantic import BaseModel, HttpUrl, Field, validator


class ShortenResponse(BaseModel):
    slug: Optional[str] = Field(
        default=None,
        description="Slug customizado opcional. Se vazio, o sistema gera um.",
    )
    qr_png: HttpUrl = Field(
        ...,
        description="URL com link direto ao qr code gerado em formato PNG",
    )
    qr_svg: HttpUrl = Field(
        ...,
        description="URL com link direto ao qr code gerado em formato SVG",
    )

    @validator("slug")
    def validate_slug(cls, v):
        if v is None:
            return v
        if not re.match(r"^[a-zA-Z0-9_-]{3,64}$", v):
            raise ValueError("slug must match ^[a-zA-Z0-9_-]{3,64}$")
        return v


class ShortenLinkRequest(BaseModel):
    original_url: HttpUrl = Field(..., description="URL de destino completa")
    slug: Optional[str] = Field(
        default=None,
        description="Slug customizado opcional. Se vazio, o sistema gera um.",
    )
    title: Optional[str] = Field(
        default=None,
        description="Título amigável do link (para painel/admin).",
    )
    notes: Optional[str] = Field(
        default=None,
        description="Notas internas / observações.",
    )
    tags: List[str] = Field(
        default_factory=list,
        description="Lista de tags livres para segmentação.",
    )
    is_active: bool = Field(
        default=True,
        description="Se falso, o link não redireciona (pode dar 410/404).",
    )
    expires_at: Optional[datetime] = Field(
        default=None,
        description="Data/hora de expiração do link (UTC).",
    )
    max_clicks: Optional[int] = Field(
        default=None,
        ge=1,
        description="Limite máximo de cliques antes de desativar o link.",
    )

    @validator("slug")
    def validate_slug(cls, v):
        if v is None:
            return v
        if not re.match(r"^[a-zA-Z0-9_-]{3,64}$", v):
            raise ValueError("slug must match ^[a-zA-Z0-9_-]{3,64}$")
        return v
    

class ShortenLinkResponse(BaseModel):
    id: str = Field(..., description="ObjectId do link em string")
    original_url: HttpUrl = Field(..., description="URL de destino completa")
    slug: str = Field(..., description="Slug final atribuído ao link")
    short_url: HttpUrl = Field(..., description="URL encurtada completa (com domínio)")
    title: Optional[str] = Field(default=None)
    notes: Optional[str] = Field(default=None)
    tags: List[str] = Field(default_factory=list)
    is_active: bool = Field(default=True)

    created_at: datetime = Field(..., description="Data de criação (UTC)")
    updated_at: Optional[datetime] = Field(
        default=None, description="Última atualização (UTC)"
    )
    expires_at: Optional[datetime] = Field(default=None)
    max_clicks: Optional[int] = Field(default=None)
    click_count: int = Field(
        default=0,
        description="Total de cliques contabilizados nesse link.",
    )

    class Config:
        orm_mode = True


class AccessLogResponse(BaseModel):
    status: Literal["redirect"]
    slug: str
    original_url: HttpUrl
    redirected_at: datetime
