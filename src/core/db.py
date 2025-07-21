from motor.motor_asyncio import AsyncIOMotorClient
import certifi
from core.config import settings

_client = AsyncIOMotorClient(
    settings.MONGO_URI,
    tls=True,
    tlsCAFile=certifi.where(),
    serverSelectionTimeoutMS=20000,
)
db = _client[settings.MONGO_DB]

async def init_db():
    await db.registrations.create_index("createdAt")
