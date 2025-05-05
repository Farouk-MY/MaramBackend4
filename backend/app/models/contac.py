from datetime import datetime
from typing import Optional
from pydantic import Field, BaseModel, EmailStr
from bson import ObjectId
from .user import PyObjectId

class ContactForm(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    first_name: str
    last_name: str
    email: EmailStr
    phone: Optional[str] = None
    message: str
    status: str = "pending"
    response: Optional[str] = None
    responded_at: Optional[datetime] = None
    responded_by: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: lambda v: str(v)}