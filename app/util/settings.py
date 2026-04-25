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
