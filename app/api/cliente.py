from __future__ import annotations

from fastapi import APIRouter

from app.schema.cliente import (
    ClienteCreateRequest,
    ClienteDetalle,
    ClienteListadoItem,
    ClienteListadoRequest,
    ClienteUpdateRequest,
    SuccessResponse,
)
from app.services.cliente_service import ClienteService
from app.util.dependencies import AuthDep, CurrentUserDep, DBDep, HttpClientDep

router = APIRouter(prefix="/api/Cliente", tags=["Cliente"])


@router.post("/Listado", response_model=list[ClienteListadoItem])
async def listado(
    request: ClienteListadoRequest,
    client: HttpClientDep,
    db: DBDep,
    authorization: AuthDep,
    current_user: CurrentUserDep,
) -> list[ClienteListadoItem]:
    service = ClienteService(client, db, current_user)
    return await service.listado(request, authorization)


@router.get("/Obtener/{cliente_id}", response_model=ClienteDetalle)
async def obtener(
    cliente_id: str,
    client: HttpClientDep,
    db: DBDep,
    authorization: AuthDep,
    current_user: CurrentUserDep,
) -> ClienteDetalle:
    service = ClienteService(client, db, current_user)
    return await service.obtener(cliente_id, authorization)


@router.post("/Crear", response_model=SuccessResponse)
async def crear(
    request: ClienteCreateRequest,
    client: HttpClientDep,
    db: DBDep,
    authorization: AuthDep,
    current_user: CurrentUserDep,
) -> SuccessResponse:
    service = ClienteService(client, db, current_user)
    return await service.crear(request, authorization)


@router.post("/Actualizar", response_model=SuccessResponse)
async def actualizar(
    request: ClienteUpdateRequest,
    client: HttpClientDep,
    db: DBDep,
    authorization: AuthDep,
    current_user: CurrentUserDep,
) -> SuccessResponse:
    service = ClienteService(client, db, current_user)
    return await service.actualizar(request, authorization)


@router.delete("/Eliminar/{cliente_id}", response_model=SuccessResponse)
async def eliminar(
    cliente_id: str,
    client: HttpClientDep,
    db: DBDep,
    authorization: AuthDep,
    current_user: CurrentUserDep,
) -> SuccessResponse:
    service = ClienteService(client, db, current_user)
    return await service.eliminar(cliente_id, authorization)
