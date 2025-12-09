from __future__ import annotations

from typing import Any, Dict, Optional
from user_agents import parse

import ipaddress
import logging

import httpx


logger = logging.getLogger(__name__)


def _is_private_ip(ip: str) -> bool:
    try:
        ip_obj = ipaddress.ip_address(ip)
        return ip_obj.is_private or ip_obj.is_loopback or ip_obj.is_reserved
    except ValueError:
        return True


async def parse_user_agent(ua_string: str):
    ua = parse(ua_string)
    return {
        "is_mobile": ua.is_mobile,
        "is_tablet": ua.is_tablet,
        "is_pc": ua.is_pc,
        "browser": ua.browser.family,
        "browser_version": ua.browser.version_string,
        "os": ua.os.family,
        "os_version": ua.os.version_string,
        "device": ua.device.family,
    }


async def get_geo_from_ip(ip: Optional[str]) -> Dict[str, Any]:
    if not ip:
        return {}

    if _is_private_ip(ip):
        return {"ip": ip}

    url = f"https://ipapi.co/{ip}/json/"
    try:
        async with httpx.AsyncClient(timeout=2.0) as client:
            resp = await client.get(url)
            resp.raise_for_status()
            data = resp.json()
    except Exception as exc:
        logger.warning("Falha ao buscar geo para IP %s: %s", ip, exc)
        return {"ip": ip}

    return {
        "ip": ip,
        "country": data.get("country_name"),
        "country_code": data.get("country"),
        "region": data.get("region"),
        "city": data.get("city"),
        "latitude": data.get("latitude"),
        "longitude": data.get("longitude"),
        "timezone": data.get("timezone"),
        "raw": data,
    }