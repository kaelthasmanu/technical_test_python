from __future__ import annotations

from collections.abc import AsyncGenerator

import httpx

from .settings import EXTERNAL_API_BASE_URL


async def get_http_client() -> AsyncGenerator[httpx.AsyncClient, None]:
    """FastAPI dependency that yields a per-request httpx async client."""
    async with httpx.AsyncClient(
        base_url=EXTERNAL_API_BASE_URL,
        timeout=30.0,
        follow_redirects=True,
    ) as client:
        yield client
