from __future__ import annotations

from typing import Any

from bson import ObjectId
from pydantic_core import core_schema


class PyObjectId(ObjectId):
    """Pydantic-compatible ObjectId wrapper for MongoDB documents."""

    @classmethod
    def __get_pydantic_core_schema__(cls, source_type, handler):
        return core_schema.no_info_plain_validator_function(cls.validate)

    @classmethod
    def validate(cls, value: Any) -> "PyObjectId":
        if isinstance(value, ObjectId):
            return cls(str(value))

        if isinstance(value, str) and ObjectId.is_valid(value):
            return cls(value)

        raise TypeError("Invalid ObjectId")

    @classmethod
    def __get_pydantic_json_schema__(cls, core_schema):
        return {
            "type": "string",
            "format": "object-id",
        }
