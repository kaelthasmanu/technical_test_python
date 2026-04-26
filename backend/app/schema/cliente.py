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
    sexo: Literal["M", "F"] | None = Field(
        default=None,
        description="M=Masculino, F=Femenino",
    )
    genero: Literal["M", "F"] | None = Field(
        default=None,
        description="M=Masculino, F=Femenino",
    )
    celular: str | None = Field(default=None)
    direccion: str | None = Field(default=None)
    otroTelefono: str | None = Field(default=None)
    imagen: str | None = Field(default=None, description="Imagen en base64")
    interesFK: str | None = Field(default=None)
    resennaPersonal: str | None = Field(default=None)
    fAfiliacion: str | None = Field(default=None)
    fNacimiento: str | None = Field(default=None)
    intereses: list[IntereseItem | str] = Field(default_factory=list)
    usuarioId: str | None = Field(default=None)

    model_config = ConfigDict(
        extra="allow",
        populate_by_name=True,
    )


class ClienteCreateRequest(BaseModel):
    identificacion: str = Field(..., description="Identificación del cliente")
    nombre: str = Field(..., description="Nombre del cliente")
    apellidos: str = Field(..., description="Apellidos del cliente")
    sexo: Literal["M", "F"] = Field(..., alias="sexo", description="M=Masculino, F=Femenino")
    celular: str = Field(..., description="Teléfono celular del cliente")
    direccion: str = Field(..., description="Dirección del cliente")
    otroTelefono: str = Field(..., description="Otro teléfono del cliente")
    imagen: str | None = Field(default=None, description="Imagen en base64")
    interesFK: str = Field(..., alias="interesFK", description="ID del interés seleccionado")
    resennaPersonal: str = Field(..., alias="resennaPersonal", description="Reseña personal del cliente")
    fAfiliacion: str | None = Field(default=None, alias="fAfiliacion", description="Fecha de afiliación")
    fNacimiento: str | None = Field(default=None, alias="fNacimiento", description="Fecha de nacimiento")
    usuarioId: str = Field(..., description="ID del usuario en sesión")

    model_config = ConfigDict(
        extra="forbid",
        populate_by_name=True,
        json_schema_extra={
            "example": {
                "identificacion": "123456789",
                "nombre": "Juan",
                "apellidos": "Pérez",
                "sexo": "M",
                "celular": "5551234567",
                "direccion": "Av. Siempre Viva 742",
                "otroTelefono": "5559876543",
                "imagen": None,
                "interesFK": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
                "resennaPersonal": "Cliente tranquilo y responsable",
                "fAfiliacion": "2026-04-22T00:00:00.000Z",
                "fNacimiento": "2026-04-14T00:00:00.000Z",
                "usuarioId": "c8c8b7f9-edd5-4b0b-b488-74d82747ac56",
            }
        }
    )


class ClienteUpdateRequest(ClienteCreateRequest):
    id: str = Field(..., description="ID del cliente a actualizar")


class SuccessResponse(BaseModel):
    status: str
    message: str
