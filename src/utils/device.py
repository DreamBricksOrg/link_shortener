from user_agents import parse

def parse_user_agent(ua_string: str):
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
