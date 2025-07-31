import pytest
from httpx import AsyncClient
from main import app


@pytest.mark.asyncio
async def test_shorten_and_redirect(monkeypatch):
    test_slug = "test123"
    test_url = "https://example.com"

    # Mock do banco de dados
    async def mock_find_one(query):
        if query.get("slug") == test_slug:
            return None

    async def mock_insert_one(data):
        return None

    monkeypatch.setattr("src.routes.routes.db.links.find_one", mock_find_one)
    monkeypatch.setattr("src.routes.routes.db.links.insert_one", mock_insert_one)

    payload = {
        "name": "test",
        "url": test_url,
        "slug": test_slug
    }

    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.post("/shorten", data=payload)

    assert response.status_code == 200
    assert response.json()["slug"] == test_slug
