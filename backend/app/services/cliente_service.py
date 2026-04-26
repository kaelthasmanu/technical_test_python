from __future__ import annotations

import json
from json import JSONDecodeError

import httpx
from fastapi import HTTPException
from motor.motor_asyncio import AsyncIOMotorDatabase

from ..repository.operation_repository import OperationRepository
from ..schema.cliente import (
    ClienteCreateRequest,
    ClienteDetalle,
    ClienteListadoItem,
    ClienteListadoRequest,
    ClienteUpdateRequest,
    SuccessResponse,
)
from ..schema.operation import OperationCreateDTO


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

    def _parse_response(self, response: httpx.Response) -> dict | None:
        if not response.content:
            return None
        try:
            return response.json()
        except JSONDecodeError:
            return None

    def _raise_for_status(self, response: httpx.Response) -> dict | None:
        payload = self._parse_response(response)
        if response.status_code != 200:
            raise HTTPException(
                status_code=response.status_code,
                detail=payload if payload is not None else response.text,
            )
        return payload

# ------------------------------------------------------------------
    # Common utilities for write operations
    # ------------------------------------------------------------------
    def _resolve_cliente_id(self, payload: dict | None, fallback: str) -> str:
        if isinstance(payload, dict):
            return (
                payload.get("id")
                or payload.get("cliente_id")
                or payload.get("clienteId")
                or fallback
            )
        return fallback

    async def _record_operation(
        self,
        accion: str,
        cliente_id: str,
        resultado: int,
    ) -> None:
        await self._operation_repo.create(
            OperationCreateDTO(
                accion=accion,
                usuario=self._username,
                cliente_id=cliente_id,
                resultado=resultado,
            )
        )

    async def _handle_write_response(
        self,
        response: httpx.Response,
        accion: str,
        cliente_id: str,
        success_message: str,
    ) -> SuccessResponse:
        payload = self._parse_response(response)
        await self._record_operation(
            accion=accion,
            cliente_id=cliente_id,
            resultado=response.status_code,
        )

        if response.status_code not in (200, 201, 204):
            raise HTTPException(
                status_code=response.status_code,
                detail=payload if payload is not None else response.text,
            )

        if payload is None:
            return SuccessResponse(status="Success", message=success_message)

        return SuccessResponse(**payload)

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

        payload = response.json()
        if isinstance(payload, list):
            if not payload:
                raise HTTPException(
                    status_code=404,
                    detail="Cliente no encontrado",
                )
            payload = payload[0]

        try:
            return ClienteDetalle(**payload)
        except Exception as exc:
            raise HTTPException(
                status_code=502,
                detail={
                    "message": "Respuesta inválida de la API externa",
                    "external_response": payload,
                    "error": str(exc),
                },
            )

    # ------------------------------------------------------------------
    # Write operations (logged to MongoDB)
    # ------------------------------------------------------------------

    async def crear(
        self,
        request: ClienteCreateRequest,
        authorization: str,
    ) -> SuccessResponse:
        cliente_id = request.identificacion
        try:
            response = await self._client.post(
                "/api/Cliente/Crear",
                json=request.model_dump(exclude_none=True, by_alias=True),
                headers={"Authorization": authorization},
            )
        except httpx.HTTPError as exc:
            await self._record_operation(
                accion="CREAR",
                cliente_id=cliente_id,
                resultado=0,
            )
            raise HTTPException(status_code=502, detail=str(exc))

        payload = self._parse_response(response)
        cliente_id = self._resolve_cliente_id(payload, cliente_id)

        return await self._handle_write_response(
            response=response,
            accion="CREAR",
            cliente_id=cliente_id,
            success_message="Cliente creado correctamente",
        )

    async def actualizar(
        self,
        request: ClienteUpdateRequest,
        authorization: str,
    ) -> SuccessResponse:
        cliente_id = request.id
        try:
            response = await self._client.post(
                "/api/Cliente/Actualizar",
                json=request.model_dump(exclude_none=True, by_alias=True),
                headers={"Authorization": authorization},
            )
        except httpx.HTTPError as exc:
            await self._record_operation(
                accion="ACTUALIZAR",
                cliente_id=cliente_id,
                resultado=0,
            )
            raise HTTPException(status_code=502, detail=str(exc))

        return await self._handle_write_response(
            response=response,
            accion="ACTUALIZAR",
            cliente_id=cliente_id,
            success_message="Cliente actualizado correctamente",
        )

    async def eliminar(self, cliente_id: str, authorization: str) -> SuccessResponse:
        try:
            response = await self._client.delete(
                f"/api/Cliente/Eliminar/{cliente_id}",
                headers={"Authorization": authorization},
            )
        except httpx.HTTPError as exc:
            await self._record_operation(
                accion="ELIMINAR",
                cliente_id=cliente_id,
                resultado=0,
            )
            raise HTTPException(status_code=502, detail=str(exc))

        return await self._handle_write_response(
            response=response,
            accion="ELIMINAR",
            cliente_id=cliente_id,
            success_message="Cliente eliminado correctamente",
        )
