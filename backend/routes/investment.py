from fastapi import APIRouter, HTTPException, status, Depends
from models.investment import InvestmentBuy, InvestmentSell, Portfolio, PortfolioResponse
from middleware.auth import get_current_user
from motor.motor_asyncio import AsyncIOMotorClient
from typing import List
import os
import httpx

router = APIRouter(prefix="/investments", tags=["Investments"])

def get_db():
    mongo_url = os.environ['MONGO_URL']
    client = AsyncIOMotorClient(mongo_url)
    return client[os.environ['DB_NAME']]

FINNHUB_API_KEY = os.environ.get('FINNHUB_API_KEY', '')

# Investment type configurations
INVESTMENT_CONFIGS = {
    'fd': {'name': 'Fixed Deposit', 'rate': 0.072, 'price': 1.0},
    'mf': {'name': 'Mutual Fund', 'rate': 0.15, 'price': 1.0},
    'stocks': {'rate': 0.0}  # Stocks use real-time prices
}

async def get_stock_price(symbol: str) -> float:
    """Get current stock price from Finnhub"""
    if not FINNHUB_API_KEY:
        # Return mock price if no API key
        return 100.0
    
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"https://finnhub.io/api/v1/quote",
                params={"symbol": symbol, "token": FINNHUB_API_KEY}
            )
            data = response.json()
            return data.get('c', 100.0)  # 'c' is current price
    except Exception:
        return 100.0

@router.get("/portfolio", response_model=List[PortfolioResponse])
async def get_portfolio(current_user: dict = Depends(get_current_user)):
    """Get user's investment portfolio"""
    portfolio_items = await db.portfolio.find(
        {"userId": current_user['id']},
        {"_id": 0}
    ).to_list(1000)
    
    response = []
    for item in portfolio_items:
        # Get current price
        if item['investmentType'] == 'stocks':
            current_price = await get_stock_price(item['symbol'])
        else:
            config = INVESTMENT_CONFIGS.get(item['investmentType'], {})
            # Calculate returns based on investment type
            current_price = item['buyPrice'] * (1 + config.get('rate', 0))
        
        total_value = current_price * item['quantity']
        buy_value = item['buyPrice'] * item['quantity']
        profit_loss = total_value - buy_value
        profit_loss_percent = (profit_loss / buy_value * 100) if buy_value > 0 else 0
        
        response.append(PortfolioResponse(
            id=item['id'],
            symbol=item['symbol'],
            name=item['name'],
            quantity=item['quantity'],
            buyPrice=item['buyPrice'],
            currentPrice=current_price,
            investmentType=item['investmentType'],
            totalValue=total_value,
            profitLoss=profit_loss,
            profitLossPercent=profit_loss_percent
        ))
    
    return response

@router.post("/buy", response_model=Portfolio, status_code=status.HTTP_201_CREATED)
async def buy_investment(
    investment: InvestmentBuy,
    current_user: dict = Depends(get_current_user)
):
    """Simulate buying an investment"""
    db = get_db()
    # Get current price
    if investment.investmentType == 'stocks':
        price = await get_stock_price(investment.symbol)
        name = investment.symbol
    else:
        config = INVESTMENT_CONFIGS.get(investment.investmentType)
        if not config:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid investment type"
            )
        price = config['price']
        name = config['name']
    
    total_cost = price * investment.quantity
    
    # Check if user has enough balance
    user = await db.users.find_one({"id": current_user['id']}, {"_id": 0})
    if user['coins'] < total_cost:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Insufficient balance"
        )
    
    # Check if user already has this investment
    existing = await db.portfolio.find_one({
        "userId": current_user['id'],
        "symbol": investment.symbol,
        "investmentType": investment.investmentType
    })
    
    if existing:
        # Update existing portfolio item (average buy price)
        old_qty = existing['quantity']
        old_price = existing['buyPrice']
        new_qty = old_qty + investment.quantity
        new_avg_price = ((old_price * old_qty) + (price * investment.quantity)) / new_qty
        
        await db.portfolio.update_one(
            {"id": existing['id']},
            {
                "$set": {
                    "quantity": new_qty,
                    "buyPrice": new_avg_price,
                    "currentPrice": price
                }
            }
        )
        
        portfolio_item = await db.portfolio.find_one({"id": existing['id']}, {"_id": 0})
    else:
        # Create new portfolio item
        portfolio_item_obj = Portfolio(
            userId=current_user['id'],
            symbol=investment.symbol,
            name=name,
            quantity=investment.quantity,
            buyPrice=price,
            currentPrice=price,
            investmentType=investment.investmentType
        )
        
        portfolio_dict = portfolio_item_obj.model_dump()
        await db.portfolio.insert_one(portfolio_dict)
        portfolio_item = portfolio_dict
    
    # Deduct from user balance
    await db.users.update_one(
        {"id": current_user['id']},
        {"$inc": {"coins": -total_cost}}
    )
    
    return Portfolio(**portfolio_item)

@router.post("/sell", status_code=status.HTTP_200_OK)
async def sell_investment(
    investment: InvestmentSell,
    current_user: dict = Depends(get_current_user)
):
    """Simulate selling an investment"""
    db = get_db()
    # Find portfolio item
    portfolio_item = await db.portfolio.find_one({
        "userId": current_user['id'],
        "symbol": investment.symbol
    }, {"_id": 0})
    
    if not portfolio_item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Investment not found in portfolio"
        )
    
    if portfolio_item['quantity'] < investment.quantity:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Insufficient quantity to sell"
        )
    
    # Get current price
    if portfolio_item['investmentType'] == 'stocks':
        current_price = await get_stock_price(investment.symbol)
    else:
        config = INVESTMENT_CONFIGS.get(portfolio_item['investmentType'])
        current_price = portfolio_item['buyPrice'] * (1 + config.get('rate', 0))
    
    sale_value = current_price * investment.quantity
    
    # Update or remove portfolio item
    new_quantity = portfolio_item['quantity'] - investment.quantity
    
    if new_quantity == 0:
        await db.portfolio.delete_one({"id": portfolio_item['id']})
    else:
        await db.portfolio.update_one(
            {"id": portfolio_item['id']},
            {"$set": {"quantity": new_quantity, "currentPrice": current_price}}
        )
    
    # Add to user balance
    await db.users.update_one(
        {"id": current_user['id']},
        {"$inc": {"coins": sale_value}}
    )
    
    # Calculate profit/loss
    buy_value = portfolio_item['buyPrice'] * investment.quantity
    profit_loss = sale_value - buy_value
    
    return {
        "message": "Investment sold successfully",
        "quantity": investment.quantity,
        "salePrice": current_price,
        "totalValue": sale_value,
        "profitLoss": profit_loss,
        "newBalance": (await db.users.find_one({"id": current_user['id']}, {"_id": 0}))['coins']
    }

@router.get("/performance")
async def get_investment_performance(current_user: dict = Depends(get_current_user)):
    """Get overall investment performance"""
    db = get_db()
    portfolio_items = await db.portfolio.find(
        {"userId": current_user['id']},
        {"_id": 0}
    ).to_list(1000)
    
    total_invested = 0
    current_value = 0
    
    for item in portfolio_items:
        # Get current price
        if item['investmentType'] == 'stocks':
            current_price = await get_stock_price(item['symbol'])
        else:
            config = INVESTMENT_CONFIGS.get(item['investmentType'], {})
            current_price = item['buyPrice'] * (1 + config.get('rate', 0))
        
        total_invested += item['buyPrice'] * item['quantity']
        current_value += current_price * item['quantity']
    
    profit_loss = current_value - total_invested
    profit_loss_percent = (profit_loss / total_invested * 100) if total_invested > 0 else 0
    
    return {
        "totalInvested": total_invested,
        "currentValue": current_value,
        "profitLoss": profit_loss,
        "profitLossPercent": profit_loss_percent,
        "portfolioCount": len(portfolio_items)
    }


