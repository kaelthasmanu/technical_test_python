from __future__ import annotations

from fastapi import APIRouter

from ..schema.auth import (
    LoginRequest,
    LoginResponse,
    LogoutResponse,
    RegisterRequest,
    RegisterResponse,
)
from ..util.dependencies import AuthDep, AuthServiceDep

router = APIRouter(prefix="/api/Authenticate", tags=["Authenticate"])


@router.post("/login", response_model=LoginResponse)
async def login(
    request: LoginRequest,
    service: AuthServiceDep,
) -> LoginResponse:
    return await service.login(request)


@router.post("/register", response_model=RegisterResponse)
async def register(
    request: RegisterRequest,
    service: AuthServiceDep,
) -> RegisterResponse:
    return await service.register(request)


@router.post("/logout", response_model=LogoutResponse)
async def logout(
    authorization: AuthDep,
    service: AuthServiceDep,
) -> LogoutResponse:
    return await service.logout(authorization)
