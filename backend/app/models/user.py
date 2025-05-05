# In models/user.py
from datetime import datetime
from typing import Optional
from pydantic import Field, BaseModel, EmailStr
from bson import ObjectId


class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid ObjectId")
        return ObjectId(v)

    @classmethod
    def __get_pydantic_json_schema__(cls, schema, handler):
        schema.update(type="string")
        return schema


class User(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    email: EmailStr
    full_name: str
    hashed_password: str
    is_active: bool = True
    is_verified: bool = False
    is_admin: bool = False
    is_blocked: bool = False  # New field to track blocked status
    blocked_reason: Optional[str] = None  # Optional reason for blocking
    blocked_at: Optional[datetime] = None  # When the user was blocked
    verification_code: Optional[str] = None
    verification_code_expires: Optional[datetime] = None
    reset_password_token: Optional[str] = None
    reset_password_expires: Optional[datetime] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True  # Updated for Pydantic v2
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: lambda v: str(v)}  # Ensure ObjectId is serialized as a string