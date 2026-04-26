from __future__ import annotations

from fastapi import APIRouter

from .authenticate import router as authenticate_router
from .cliente import router as cliente_router
from .intereses import router as intereses_router

api_router = APIRouter()
api_router.include_router(authenticate_router)
api_router.include_router(cliente_router)
api_router.include_router(intereses_router)

__all__ = ["api_router"]
