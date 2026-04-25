from __future__ import annotations

import httpx
from fastapi import HTTPException
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.repository.operation_repository import OperationRepository
from app.schema.cliente import (
    ClienteCreateRequest,
    ClienteDetalle,
    ClienteListadoItem,
    ClienteListadoRequest,
    ClienteUpdateRequest,
    SuccessResponse,
)
from app.schema.operation import OperationCreateDTO


class ClienteService:
    """Proxies all client CRUD operations to the external Innovasoft API and
    logs each mutating action as an audit record in MongoDB."""

    def __init__(
        self,
        client: httpx.AsyncClient,
        db: AsyncIOMotorDatabase,
        username: str,
    ) -> None:
        self._client = client
        self._operation_repo = OperationRepository(db)
        self._username = username

    # ------------------------------------------------------------------
    # Read operations
    # ------------------------------------------------------------------

    async def listado(
        self,
        request: ClienteListadoRequest,
        authorization: str,
    ) -> list[ClienteListadoItem]:
        response = await self._client.post(
            "/api/Cliente/Listado",
            json=request.model_dump(exclude_none=True),
            headers={"Authorization": authorization},
        )
        if response.status_code != 200:
            raise HTTPException(
                status_code=response.status_code,
                detail=response.json(),
            )
        return [ClienteListadoItem(**item) for item in response.json()]

    async def obtener(self, cliente_id: str, authorization: str) -> ClienteDetalle:
        response = await self._client.get(
            f"/api/Cliente/Obtener/{cliente_id}",
            headers={"Authorization": authorization},
        )
        if response.status_code != 200:
            raise HTTPException(
                status_code=response.status_code,
                detail=response.json(),
            )
        return ClienteDetalle(**response.json())

    # ------------------------------------------------------------------
    # Write operations (logged to MongoDB)
    # ------------------------------------------------------------------

    async def crear(
        self,
        request: ClienteCreateRequest,
        authorization: str,
    ) -> SuccessResponse:
        response = await self._client.post(
            "/api/Cliente/Crear",
            json=request.model_dump(),
            headers={"Authorization": authorization},
        )
        if response.status_code != 200:
            raise HTTPException(
                status_code=response.status_code,
                detail=response.json(),
            )

        await self._operation_repo.create(
            OperationCreateDTO(
                accion="CREAR",
                usuario=self._username,
                cliente_id=request.identificacion,
                resultado=response.status_code,
            )
        )

        return SuccessResponse(**response.json())

    async def actualizar(
        self,
        request: ClienteUpdateRequest,
        authorization: str,
    ) -> SuccessResponse:
        response = await self._client.post(
            "/api/Cliente/Actualizar",
            json=request.model_dump(),
            headers={"Authorization": authorization},
        )
        if response.status_code != 200:
            raise HTTPException(
                status_code=response.status_code,
                detail=response.json(),
            )

        await self._operation_repo.create(
            OperationCreateDTO(
                accion="ACTUALIZAR",
                usuario=self._username,
                cliente_id=request.id,
                resultado=response.status_code,
            )
        )

        return SuccessResponse(**response.json())

    async def eliminar(self, cliente_id: str, authorization: str) -> SuccessResponse:
        response = await self._client.delete(
            f"/api/Cliente/Eliminar/{cliente_id}",
            headers={"Authorization": authorization},
        )
        if response.status_code != 200:
            raise HTTPException(
                status_code=response.status_code,
                detail=response.json(),
            )

        await self._operation_repo.create(
            OperationCreateDTO(
                accion="ELIMINAR",
                usuario=self._username,
                cliente_id=cliente_id,
                resultado=response.status_code,
            )
        )

        return SuccessResponse(**response.json())
