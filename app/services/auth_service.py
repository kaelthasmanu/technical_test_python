from __future__ import annotations

import httpx
from fastapi import HTTPException
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.repository.session_repository import SessionRepository
from app.schema.auth import LoginRequest, LoginResponse, RegisterRequest, RegisterResponse
from app.schema.session import SessionCreateDTO


class AuthService:
    """Delegates auth operations to the external Innovasoft API and persists
    the resulting session in MongoDB."""

    def __init__(self, client: httpx.AsyncClient, db: AsyncIOMotorDatabase) -> None:
        self._client = client
        self._session_repo = SessionRepository(db)

    async def login(self, request: LoginRequest) -> LoginResponse:
        response = await self._client.post(
            "/api/Authenticate/login",
            json=request.model_dump(),
        )
        if response.status_code != 200:
            raise HTTPException(
                status_code=response.status_code,
                detail=response.json(),
            )

        data = response.json()
        login_response = LoginResponse(**data)

        await self._session_repo.create(
            SessionCreateDTO(
                token=login_response.token,
                userid=login_response.userid,
                username=login_response.username,
            )
        )

        return login_response

    async def register(self, request: RegisterRequest) -> RegisterResponse:
        response = await self._client.post(
            "/api/Authenticate/register",
            json=request.model_dump(),
        )
        if response.status_code != 200:
            raise HTTPException(
                status_code=response.status_code,
                detail=response.json(),
            )

        return RegisterResponse(**response.json())
