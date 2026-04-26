from __future__ import annotations

import httpx
from fastapi import HTTPException

from backend.app.schema.intereses import IntereseItem


class InteresesService:
    """Proxies interest-list retrieval from the external Innovasoft API."""

    def __init__(self, client: httpx.AsyncClient) -> None:
        self._client = client

    async def listado(self, authorization: str) -> list[IntereseItem]:
        response = await self._client.get(
            "/api/Intereses/Listado",
            headers={"Authorization": authorization},
        )
        if response.status_code != 200:
            raise HTTPException(
                status_code=response.status_code,
                detail=response.json(),
            )
        return [IntereseItem(**item) for item in response.json()]
