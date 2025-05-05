from typing import Optional
from pydantic import BaseModel, EmailStr, Field, validator, field_validator
import re

class UserBase(BaseModel):
    email: EmailStr
    full_name: str

    @field_validator('full_name')
    def name_must_not_be_empty(cls, v):
        if not v or not v.strip():
            raise ValueError('Full name cannot be empty')
        return v.strip()


class UserCreate(UserBase):
    password: str

    @field_validator('password')
    def password_must_be_strong(cls, v):
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters')
        if not re.search(r'[A-Z]', v):
            raise ValueError('Password must contain at least one uppercase letter')
        if not re.search(r'[a-z]', v):
            raise ValueError('Password must contain at least one lowercase letter')
        if not re.search(r'[0-9]', v):
            raise ValueError('Password must contain at least one number')
        return v


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class ForgotPassword(BaseModel):
    email: EmailStr


class ResetPassword(BaseModel):
    token: str
    new_password: str

    @field_validator('new_password')
    def password_must_be_strong(cls, v):
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters')
        if not re.search(r'[A-Z]', v):
            raise ValueError('Password must contain at least one uppercase letter')
        if not re.search(r'[a-z]', v):
            raise ValueError('Password must contain at least one lowercase letter')
        if not re.search(r'[0-9]', v):
            raise ValueError('Password must contain at least one number')
        return v


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenPayload(BaseModel):
    sub: str = None
    exp: int = None


class UserResponse(UserBase):
    id: str = Field(..., alias="_id")
    is_active: bool
    is_verified: bool
    is_admin: bool = False
    is_blocked: bool = False  # Add blocked status to response
    blocked_reason: Optional[str] = None  # Add blocked reason to response
    blocked_at: Optional[str] = None  # Add blocked timestamp to response
    created_at: str
    updated_at: str

    class Config:
        populate_by_name = True


class BlockUserRequest(BaseModel):
    reason: Optional[str] = "Blocked by administrator"


class AdminCreate(BaseModel):
    email: EmailStr
    full_name: str
    password: str
    is_admin: bool = False
    is_active: bool = True
    is_verified: bool = True
    is_blocked: bool = False  # Add blocked field

    @field_validator('password')
    def password_must_be_strong(cls, v):
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters')
        if not re.search(r'[A-Z]', v):
            raise ValueError('Password must contain at least one uppercase letter')
        if not re.search(r'[a-z]', v):
            raise ValueError('Password must contain at least one lowercase letter')
        if not re.search(r'[0-9]', v):
            raise ValueError('Password must contain at least one number')
        return v


class AdminLogin(BaseModel):
    email: EmailStr
    password: str


class UserListResponse(BaseModel):
    total: int
    users: list[UserResponse]


class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    full_name: Optional[str] = None
    current_password: Optional[str] = None
    new_password: Optional[str] = None

    @field_validator('full_name')
    def name_must_not_be_empty(cls, v):
        if v is not None and not v.strip():
            raise ValueError('Full name cannot be empty')
        return v.strip() if v else v

    @field_validator('new_password')
    def password_must_be_strong(cls, v):
        if v is None:
            return v
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters')
        if not re.search(r'[A-Z]', v):
            raise ValueError('Password must contain at least one uppercase letter')
        if not re.search(r'[a-z]', v):
            raise ValueError('Password must contain at least one lowercase letter')
        if not re.search(r'[0-9]', v):
            raise ValueError('Password must contain at least one number')
        return v