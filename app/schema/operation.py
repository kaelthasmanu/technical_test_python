from __future__ import annotations

from datetime import datetime, timezone
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field


ActionType = Literal["CREAR", "ACTUALIZAR", "ELIMINAR"]


class OperationCreateDTO(BaseModel):
    accion: ActionType = Field(..., description="Tipo de operación realizada")
    usuario: str = Field(..., description="Username del usuario que ejecutó la acción")
    cliente_id: str = Field(..., description="ID del cliente afectado")
    timestamp: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        description="Fecha y hora de la operación en formato ISO 8601",
    )
    resultado: int = Field(..., description="Código HTTP de respuesta de la API de Innovasoft")

    model_config = ConfigDict(
        extra="forbid",
        json_schema_extra={
            "example": {
                "accion": "CREAR",
                "usuario": "juan.perez",
                "cliente_id": "1234567890",
                "timestamp": "2026-04-24T16:10:05Z",
                "resultado": 200,
            }
        },
    )


class OperationResponseDTO(BaseModel):
    id: str | None = Field(default=None, description="ID interno de MongoDB")
    accion: ActionType
    usuario: str
    cliente_id: str
    timestamp: datetime
    resultado: int

    model_config = ConfigDict(
        extra="forbid",
        json_encoders={datetime: lambda value: value.isoformat()},
    )
