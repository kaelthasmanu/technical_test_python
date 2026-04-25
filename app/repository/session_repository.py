from __future__ import annotations

from motor.motor_asyncio import AsyncIOMotorCollection, AsyncIOMotorDatabase

from app.schema.session import SessionCreateDTO


class SessionRepository:
    """Stores user session data in MongoDB after a successful login."""

    def __init__(self, db: AsyncIOMotorDatabase) -> None:
        self._db = db

    @property
    def collection(self) -> AsyncIOMotorCollection:
        return self._db["sessions"]

    async def create(self, dto: SessionCreateDTO) -> None:
        await self.collection.insert_one(dto.model_dump())
