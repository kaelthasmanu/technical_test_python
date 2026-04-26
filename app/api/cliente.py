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
from app.util.dependencies import AuthDep, ClienteServiceDep

router = APIRouter(prefix="/api/Cliente", tags=["Cliente"])


@router.post("/Listado", response_model=list[ClienteListadoItem])
async def listado(
    request: ClienteListadoRequest,
    service: ClienteServiceDep,
    authorization: AuthDep,
) -> list[ClienteListadoItem]:
    return await service.listado(request, authorization)


@router.get("/Obtener/{cliente_id}", response_model=ClienteDetalle)
async def obtener(
    cliente_id: str,
    service: ClienteServiceDep,
    authorization: AuthDep,
) -> ClienteDetalle:
    return await service.obtener(cliente_id, authorization)


@router.post("/Crear", response_model=SuccessResponse)
async def crear(
    request: ClienteCreateRequest,
    service: ClienteServiceDep,
    authorization: AuthDep,
) -> SuccessResponse:
    return await service.crear(request, authorization)


@router.post("/Actualizar", response_model=SuccessResponse)
async def actualizar(
    request: ClienteUpdateRequest,
    service: ClienteServiceDep,
    authorization: AuthDep,
) -> SuccessResponse:
    return await service.actualizar(request, authorization)


@router.delete("/Eliminar/{cliente_id}", response_model=SuccessResponse)
async def eliminar(
    cliente_id: str,
    service: ClienteServiceDep,
    authorization: AuthDep,
) -> SuccessResponse:
    return await service.eliminar(cliente_id, authorization)
