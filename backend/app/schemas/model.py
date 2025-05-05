from pydantic import BaseModel, Field, validator, field_validator
from enum import Enum
from datetime import datetime
from typing import Optional
from typing import List


class ModelType(str, Enum):
    JSON = "json"
    CSV = "csv"
    TEXT = "text"


class ModelBase(BaseModel):
    name: str
    description: str
    model_type: ModelType
    category: str  # Add the new category field

    @field_validator('name')
    def name_must_not_be_empty(cls, v):
        if not v or not v.strip():
            raise ValueError('Model name cannot be empty')
        return v.strip()

    @field_validator('description')
    def description_must_not_be_empty(cls, v):
        if not v or not v.strip():
            raise ValueError('Model description cannot be empty')
        return (v.strip())

    @field_validator('category')
    def description_must_not_be_empty(cls, v):
        if not v or not v.strip():
            raise ValueError('Model category cannot be empty')
        return v.strip()


class ModelCreate(ModelBase):
    pass


class ModelResponse(ModelBase):
    id: str = Field(..., alias="_id")
    file_path: str
    user_id: str
    created_at: str
    updated_at: str

    class Config:
        populate_by_name = True


class ModelListResponse(BaseModel):
    total: int
    models: list[ModelResponse]