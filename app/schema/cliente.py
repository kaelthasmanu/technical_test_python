from __future__ import annotations

from typing import Literal

from pydantic import BaseModel, ConfigDict, Field

from .intereses import IntereseItem


class ClienteListadoRequest(BaseModel):
    identificacion: str | None = Field(default=None, description="Filtro por identificación (opcional)")
    nombre: str | None = Field(default=None, description="Filtro por nombre (opcional)")
    usuarioId: str = Field(..., description="ID del usuario en sesión")


class ClienteListadoItem(BaseModel):
    id: str
    identificacion: str
    nombre: str
    apellidos: str


class ClienteDetalle(BaseModel):
    id: str
    identificacion: str | None = Field(default=None)
    nombre: str | None = Field(default=None)
    apellidos: str | None = Field(default=None)
    genero: Literal["M", "F"] | None = Field(
        default=None,
        description="M=Masculino, F=Femenino",
    )
    imagen: str | None = Field(default=None, description="Imagen en base64")
    intereses: list[IntereseItem] = Field(default_factory=list)


class ClienteCreateRequest(BaseModel):
    identificacion: str = Field(..., description="Identificación del cliente")
    nombre: str = Field(..., description="Nombre del cliente")
    apellidos: str = Field(..., description="Apellidos del cliente")
    genero: Literal["M", "F"] = Field(..., description="M=Masculino, F=Femenino")
    imagen: str | None = Field(default=None, description="Imagen en base64")
    intereses: list[str] = Field(..., description="Lista de IDs de intereses")
    usuarioId: str = Field(..., description="ID del usuario en sesión")

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "identificacion": "123456789",
                "nombre": "Juan",
                "apellidos": "Pérez",
                "genero": "M",
                "imagen": None,
                "intereses": ["3fa85f64-5717-4562-b3fc-2c963f66afa6"],
                "usuarioId": "c8c8b7f9-edd5-4b0b-b488-74d82747ac56",
            }
        }
    )


class ClienteUpdateRequest(ClienteCreateRequest):
    id: str = Field(..., description="ID del cliente a actualizar")


class SuccessResponse(BaseModel):
    status: str
    message: str
