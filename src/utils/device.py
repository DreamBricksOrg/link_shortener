# device.py
from user_agents import parse as parse_ua
import httpx

async def parse_user_agent(ua_string: str):
    ua = parse_ua(ua_string)
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

async def get_geo_from_ip(ip: str) -> dict:
    try:
        async with httpx.AsyncClient() as client:
            resp = await client.get(f"https://ipwho.is/{ip}", timeout=3.0)
            data = resp.json()
            if data.get("success"):
                return {
                    "country": data.get("country"),
                    "region": data.get("region"),
                    "city": data.get("city"),
                    "latitude": data.get("latitude"),
                    "longitude": data.get("longitude"),
                    "org": data.get("org"),
                }
    except Exception:
        pass

    return {
        "country": None,
        "region": None,
        "city": None,
        "latitude": None,
        "longitude": None,
        "org": None,
    }
