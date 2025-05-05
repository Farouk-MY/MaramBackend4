from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class ContactFormBase(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    phone: Optional[str] = None
    message: str

class ContactFormCreate(ContactFormBase):
    pass

class ContactFormResponse(ContactFormBase):
    id: str
    status: str
    created_at: str
    response: Optional[str] = None
    responded_at: Optional[str] = None
    responded_by: Optional[str] = None