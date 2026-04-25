from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class SessionCreateDTO(BaseModel):
    token: str = Field(..., description="JWT retornado por la API de Innovasoft")
    userid: str = Field(..., description="ID del usuario en la API de Innovasoft")
    username: str = Field(..., description="Nombre del usuario autenticado")
    login_timestamp: datetime = Field(
        default_factory=datetime.utcnow,
        description="Fecha y hora del login en formato ISO 8601",
    )

    model_config = ConfigDict(
        extra="forbid",
        json_schema_extra={
            "example": {
                "token": "eyJhbGciOiJIUzI1NiIsInR...",
                "userid": "64123ab456",
                "username": "juan.perez",
                "login_timestamp": "2026-04-24T15:20:30Z",
            }
        },
    )


class SessionResponseDTO(BaseModel):
    id: str | None = Field(default=None, description="ID interno de MongoDB")
    token: str
    userid: str
    username: str
    login_timestamp: datetime

    model_config = ConfigDict(
        extra="forbid",
        json_encoders={datetime: lambda value: value.isoformat()},
    )
