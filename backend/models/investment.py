from pydantic import BaseModel, Field
from datetime import datetime, timezone
import uuid
from typing import Literal

class InvestmentBuy(BaseModel):
    symbol: str
    quantity: int
    investmentType: Literal['fd', 'mf', 'stocks']

class InvestmentSell(BaseModel):
    symbol: str
    quantity: int

class Portfolio(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    userId: str
    symbol: str
    name: str
    quantity: int
    buyPrice: float
    currentPrice: float
    investmentType: Literal['fd', 'mf', 'stocks']
    purchaseDate: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class PortfolioResponse(BaseModel):
    id: str
    symbol: str
    name: str
    quantity: int
    buyPrice: float
    currentPrice: float
    investmentType: str
    totalValue: float
    profitLoss: float
    profitLossPercent: float


