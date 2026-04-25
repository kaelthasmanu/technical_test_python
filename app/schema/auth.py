from __future__ import annotations

import re
from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator


class LoginRequest(BaseModel):
    username: str = Field(..., description="Nombre de usuario")
    password: str = Field(..., description="Contraseña del usuario")


class LoginResponse(BaseModel):
    token: str
    expiration: datetime
    userid: str
    username: str


class RegisterRequest(BaseModel):
    username: str = Field(..., description="Nombre de usuario")
    email: EmailStr = Field(..., description="Correo electrónico válido")
    password: str = Field(
        ...,
        min_length=9,
        max_length=20,
        description="Contraseña: 9-20 caracteres, con dígito, mayúscula y minúscula",
    )

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "username": "juan.perez",
                "email": "juan@example.com",
                "password": "Secure123",
            }
        }
    )

    @field_validator("password")
    @classmethod
    def validate_password_strength(cls, value: str) -> str:
        if not re.search(r"\d", value):
            raise ValueError("La contraseña debe contener al menos un dígito")
        if not re.search(r"[A-Z]", value):
            raise ValueError("La contraseña debe contener al menos una letra mayúscula")
        if not re.search(r"[a-z]", value):
            raise ValueError("La contraseña debe contener al menos una letra minúscula")
        return value


class RegisterResponse(BaseModel):
    status: str
    message: str


class LogoutResponse(BaseModel):
    status: str
    message: str
