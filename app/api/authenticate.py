from __future__ import annotations

from fastapi import APIRouter

from app.schema.auth import (
    LoginRequest,
    LoginResponse,
    LogoutResponse,
    RegisterRequest,
    RegisterResponse,
)
from app.services.auth_service import AuthService
from app.util.dependencies import AuthDep, DBDep, HttpClientDep

router = APIRouter(prefix="/api/Authenticate", tags=["Authenticate"])


@router.post("/login", response_model=LoginResponse)
async def login(
    request: LoginRequest,
    client: HttpClientDep,
    db: DBDep,
) -> LoginResponse:
    service = AuthService(client, db)
    return await service.login(request)


@router.post("/register", response_model=RegisterResponse)
async def register(
    request: RegisterRequest,
    client: HttpClientDep,
    db: DBDep,
) -> RegisterResponse:
    service = AuthService(client, db)
    return await service.register(request)


@router.post("/logout", response_model=LogoutResponse)
async def logout(
    authorization: AuthDep,
    client: HttpClientDep,
    db: DBDep,
) -> LogoutResponse:
    service = AuthService(client, db)
    return await service.logout(authorization)
