from pydantic import BaseModel, Field
from datetime import datetime, timezone
import uuid
from typing import Literal

class TransactionCreate(BaseModel):
    icon: str
    name: str
    category: str
    amount: float
    type: Literal['in', 'out']

class TransactionUpdate(BaseModel):
    icon: str | None = None
    name: str | None = None
    category: str | None = None
    amount: float | None = None
    type: Literal['in', 'out'] | None = None

class Transaction(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    userId: str
    icon: str
    name: str
    category: str
    amount: float
    type: Literal['in', 'out']
    day: int
    createdAt: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


