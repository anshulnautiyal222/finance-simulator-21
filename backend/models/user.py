from pydantic import BaseModel, EmailStr, Field
from datetime import datetime, timezone
import uuid
from typing import Optional

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: str
    name: str
    email: EmailStr
    coins: int
    level: int
    xp: int
    healthScore: int
    createdAt: str

class User(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: EmailStr
    password: str
    coins: int = 5000
    level: int = 1
    xp: int = 0
    healthScore: int = 50
    createdAt: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


