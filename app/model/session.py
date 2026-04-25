from __future__ import annotations

from datetime import datetime, timezone

from bson import ObjectId
from pydantic import BaseModel, ConfigDict, Field

from .mongo import PyObjectId


class SessionModel(BaseModel):
    id: PyObjectId | None = Field(default=None, alias="_id")
    token: str = Field(..., description="JWT retornado por la API de Innovasoft")
    userid: str = Field(..., description="ID del usuario en la API de Innovasoft")
    username: str = Field(..., description="Nombre del usuario autenticado")
    login_timestamp: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        description="Fecha y hora del login en formato ISO 8601",
    )

    model_config = ConfigDict(
        extra="forbid",
        populate_by_name=True,
        json_encoders={ObjectId: str, datetime: lambda value: value.isoformat()},
        json_schema_extra={
            "example": {
                "token": "eyJhbGciOiJIUzI1NiIsInR...",
                "userid": "64123ab456",
                "username": "juan.perez",
                "login_timestamp": "2026-04-24T15:20:30Z",
            }
        },
    )
