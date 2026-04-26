from __future__ import annotations

from pydantic import BaseModel, Field


class IntereseItem(BaseModel):
    id: str = Field(..., description="ID del interés")
    descripcion: str = Field(..., description="Descripción del interés")
