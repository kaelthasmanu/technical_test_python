from __future__ import annotations

import os

EXTERNAL_API_BASE_URL: str = os.getenv(
    "EXTERNAL_API_BASE_URL",
    "https://pruebareactjs.test-class.com/Api",
)
MONGODB_URI: str = os.getenv(
    "MONGODB_URI",
    "mongodb://admin:password@localhost:27017",
)
MONGODB_DB: str = os.getenv("MONGODB_DB", "technical_test")
CORS_ORIGINS: list[str] = [
    origin.strip()
    for origin in os.getenv(
        "CORS_ORIGINS",
        "http://localhost:3000,http://127.0.0.1:3000",
    ).split(",")
    if origin.strip()
]
