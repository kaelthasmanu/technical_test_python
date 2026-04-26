from __future__ import annotations

import base64
import json
from typing import Annotated

import httpx
from fastapi import Depends, HTTPException, Request, Security, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from motor.motor_asyncio import AsyncIOMotorDatabase

from .http_client import get_http_client
from app.services.auth_service import AuthService
from app.services.cliente_service import ClienteService
from app.services.intereses_service import InteresesService

# ---------------------------------------------------------------------------
# Database dependency
# ---------------------------------------------------------------------------


def get_db(request: Request) -> AsyncIOMotorDatabase:
    """Return the shared Motor database from app state (set at startup)."""
    return request.app.state.db


async def get_cliente_service(
    client: Annotated[httpx.AsyncClient, Depends(get_http_client)],
    db: Annotated[AsyncIOMotorDatabase, Depends(get_db)],
    current_user: Annotated[str, Depends(get_current_user)],
) -> ClienteService:
    return ClienteService(client, db, current_user)


async def get_auth_service(
    client: Annotated[httpx.AsyncClient, Depends(get_http_client)],
    db: Annotated[AsyncIOMotorDatabase, Depends(get_db)],
) -> AuthService:
    return AuthService(client, db)


async def get_intereses_service(
    client: Annotated[httpx.AsyncClient, Depends(get_http_client)],
) -> InteresesService:
    return InteresesService(client)


# ---------------------------------------------------------------------------
# HTTP client dependency
# ---------------------------------------------------------------------------


# ---------------------------------------------------------------------------
# Authorization dependency
# ---------------------------------------------------------------------------

bearer_scheme = HTTPBearer(auto_error=False)


async def get_authorization(
    credentials: Annotated[HTTPAuthorizationCredentials | None, Security(bearer_scheme)] = None,
) -> str:
    """Extract and validate the Bearer token from the Authorization header."""
    if not credentials or credentials.scheme.lower() != "bearer":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authorization header missing or invalid",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return f"Bearer {credentials.credentials}"


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
ClienteServiceDep = Annotated[ClienteService, Depends(get_cliente_service)]
AuthServiceDep = Annotated[AuthService, Depends(get_auth_service)]
InteresesServiceDep = Annotated[InteresesService, Depends(get_intereses_service)]
