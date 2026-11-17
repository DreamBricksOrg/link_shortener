from motor.motor_asyncio import AsyncIOMotorClient
import certifi
from core.config import settings

client_options = {"serverSelectionTimeoutMS": 20000}
if settings.MONGO_URI.startswith("mongodb+srv://"):
    client_options.update(tls=True, tlsCAFile=certifi.where())

_client = AsyncIOMotorClient(settings.MONGO_URI, **client_options)
db = _client[settings.MONGO_DB]

async def init_db():
    await db.registrations.create_index("createdAt")
