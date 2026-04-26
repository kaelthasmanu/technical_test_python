from __future__ import annotations

from motor.motor_asyncio import AsyncIOMotorCollection, AsyncIOMotorDatabase

from ..schema.operation import OperationCreateDTO


class OperationRepository:
    """Persists audit operations (CREAR / ACTUALIZAR / ELIMINAR) in MongoDB."""

    def __init__(self, db: AsyncIOMotorDatabase) -> None:
        self._db = db

    @property
    def collection(self) -> AsyncIOMotorCollection:
        return self._db["operations"]

    async def create(self, dto: OperationCreateDTO) -> None:
        await self.collection.insert_one(dto.model_dump())
