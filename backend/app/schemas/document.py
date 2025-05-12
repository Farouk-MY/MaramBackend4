from pydantic import BaseModel, Field, field_validator
from enum import Enum
from datetime import datetime
from typing import Optional, List


class DocumentType(str, Enum):
    JSON = "json"
    CSV = "csv"
    TEXT = "text"
    PDF = "pdf"


class DocumentBase(BaseModel):
    name: str
    description: str
    document_type: DocumentType

    @field_validator('name')
    def name_must_not_be_empty(cls, v):
        if not v or not v.strip():
            raise ValueError('Document name cannot be empty')
        return v.strip()

    @field_validator('description')
    def description_must_not_be_empty(cls, v):
        if not v or not v.strip():
            raise ValueError('Document description cannot be empty')
        return v.strip()


class DocumentCreate(DocumentBase):
    pass


class DocumentResponse(DocumentBase):
    id: str = Field(..., alias="_id")
    file_path: str
    created_at: str
    updated_at: str

    class Config:
        populate_by_name = True
        json_schema_extra = {
            "example": {
                "_id": "60d21b4967d0d8992e610c85",
                "name": "FAQ Document",
                "description": "Frequently asked questions about our services",
                "document_type": "pdf",
                "file_path": "uploads/documents/faq.pdf",
                "created_at": "2023-06-01T12:00:00",
                "updated_at": "2023-06-01T12:00:00"
            }
        }


class DocumentListResponse(BaseModel):
    total: int
    documents: List[DocumentResponse]