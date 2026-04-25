from __future__ import annotations

from fastapi import APIRouter

from app.schema.intereses import IntereseItem
from app.services.intereses_service import InteresesService
from app.util.dependencies import AuthDep, HttpClientDep

router = APIRouter(prefix="/api/Intereses", tags=["Intereses"])


@router.get("/Listado", response_model=list[IntereseItem])
async def listado(
    client: HttpClientDep,
    authorization: AuthDep,
) -> list[IntereseItem]:
    service = InteresesService(client)
    return await service.listado(authorization)
