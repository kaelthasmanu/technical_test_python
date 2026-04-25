from __future__ import annotations

import base64
import json
from typing import Annotated

import httpx
from fastapi import Depends, Header, HTTPException, Request, status
from motor.motor_asyncio import AsyncIOMotorDatabase

from .http_client import get_http_client

# ---------------------------------------------------------------------------
# Database dependency
# ---------------------------------------------------------------------------


def get_db(request: Request) -> AsyncIOMotorDatabase:
    """Return the shared Motor database from app state (set at startup)."""
    return request.app.state.db


# ---------------------------------------------------------------------------
# HTTP client dependency
# ---------------------------------------------------------------------------


# ---------------------------------------------------------------------------
# Authorization dependency
# ---------------------------------------------------------------------------


async def get_authorization(
    authorization: Annotated[str | None, Header()] = None,
) -> str:
    """Extract and validate the Bearer token from the Authorization header."""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authorization header missing or invalid",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return authorization


# ---------------------------------------------------------------------------
# Current-user dependency (username extracted from JWT payload)
# ---------------------------------------------------------------------------

_NAME_CLAIM = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"


def _extract_username(token: str) -> str:
    """Decode the JWT payload (without verification) to obtain the username."""
    try:
        payload_b64 = token.split(".")[1]
        padding = "=" * (4 - len(payload_b64) % 4)
        payload: dict = json.loads(base64.b64decode(payload_b64 + padding))
        return payload.get(_NAME_CLAIM, payload.get("sub", "unknown"))
    except Exception:
        return "unknown"


def get_current_user(
    authorization: Annotated[str, Depends(get_authorization)],
) -> str:
    """Return the username embedded in the Bearer JWT."""
    token = authorization.removeprefix("Bearer ")
    return _extract_username(token)


# ---------------------------------------------------------------------------
# Typed dependency aliases (use these in route signatures)
# ---------------------------------------------------------------------------

DBDep = Annotated[AsyncIOMotorDatabase, Depends(get_db)]
HttpClientDep = Annotated[httpx.AsyncClient, Depends(get_http_client)]
AuthDep = Annotated[str, Depends(get_authorization)]
CurrentUserDep = Annotated[str, Depends(get_current_user)]
