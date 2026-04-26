from __future__ import annotations

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient

from app.api import api_router
from app.util.settings import CORS_ORIGINS, MONGODB_DB, MONGODB_URI


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Initialize the MongoDB connection pool on startup and close it on shutdown."""
    mongo_client: AsyncIOMotorClient = AsyncIOMotorClient(MONGODB_URI)
    app.state.db = mongo_client[MONGODB_DB]
    yield
    mongo_client.close()


app = FastAPI(
    title="Technical Test Backend",
    description="Mirror API — proxies Innovasoft endpoints and audits mutations in MongoDB.",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router)
