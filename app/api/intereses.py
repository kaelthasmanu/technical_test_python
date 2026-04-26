from __future__ import annotations

from fastapi import APIRouter

from app.schema.intereses import IntereseItem
from app.util.dependencies import AuthDep, InteresesServiceDep

router = APIRouter(prefix="/api/Intereses", tags=["Intereses"])


@router.get("/Listado", response_model=list[IntereseItem])
async def listado(
    service: InteresesServiceDep,
    authorization: AuthDep,
) -> list[IntereseItem]:
    return await service.listado(authorization)
