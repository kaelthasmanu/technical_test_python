from __future__ import annotations

from typing import Protocol

from motor.motor_asyncio import AsyncIOMotorCollection


class CollectionRepository(Protocol):
    """Base protocol for all Motor-backed repositories."""

    @property
    def collection(self) -> AsyncIOMotorCollection: ...
