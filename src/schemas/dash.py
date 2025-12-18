from __future__ import annotations

from datetime import datetime
from typing import Any, Dict, List, Optional

from pydantic import BaseModel, Field, HttpUrl


class DateRangeOut(BaseModel):
    from_: datetime = Field(..., alias="from")
    to: datetime
    tz: str


class SeriesPoint(BaseModel):
    bucket: str
    clicks: int


class TopLinkItem(BaseModel):
    slug: str
    title: Optional[str] = None
    original_url: Optional[HttpUrl] = None
    clicks: int
    last_click: Optional[datetime] = None


class OverviewResponse(BaseModel):
    range: DateRangeOut
    clicks_total: int
    unique_ips: int
    links_total: int
    links_active: int
    top_links: List[TopLinkItem]
    series: List[SeriesPoint]


class LinkListItem(BaseModel):
    id: str
    slug: str
    original_url: HttpUrl
    title: Optional[str] = None
    notes: Optional[str] = None
    tags: List[str] = Field(default_factory=list)
    is_active: bool = True
    created_at: datetime
    expires_at: Optional[datetime] = None
    max_clicks: Optional[int] = None

    clicks: int = 0
    unique_ips: int = 0
    last_click: Optional[datetime] = None


class PaginatedLinksResponse(BaseModel):
    range: DateRangeOut
    page: int
    page_size: int
    total: int
    data: List[LinkListItem]


class BreakdownItem(BaseModel):
    key: Optional[str] = None
    count: int


class GeoBreakdownItem(BaseModel):
    country: Optional[str] = None
    region: Optional[str] = None
    city: Optional[str] = None
    count: int


class LinkStatsResponse(BaseModel):
    range: DateRangeOut
    slug: str
    link: Optional[Dict[str, Any]] = None
    clicks_total: int
    unique_ips: int
    last_click: Optional[datetime] = None

    series: List[SeriesPoint]
    browsers: List[BreakdownItem]
    os: List[BreakdownItem]
    device_type: List[BreakdownItem]
    referers: List[BreakdownItem]
    geo: List[GeoBreakdownItem]


class AccessLogItem(BaseModel):
    id: str
    slug: str
    timestamp: datetime
    ip: Optional[str] = None
    user_agent: Optional[str] = None
    referer: Optional[str] = None
    browser: Optional[str] = None
    os: Optional[str] = None
    device: Optional[str] = None
    is_mobile: Optional[bool] = None
    is_tablet: Optional[bool] = None
    is_pc: Optional[bool] = None
    country: Optional[str] = None
    region: Optional[str] = None
    city: Optional[str] = None


class PaginatedAccessLogsResponse(BaseModel):
    range: DateRangeOut
    page: int
    page_size: int
    total: int
    data: List[AccessLogItem]
