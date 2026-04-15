from fastapi import APIRouter, Depends
from middleware.auth import get_current_user
from motor.motor_asyncio import AsyncIOMotorClient
import os

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

def get_db():
    mongo_url = os.environ['MONGO_URL']
    client = AsyncIOMotorClient(mongo_url)
    return client[os.environ['DB_NAME']]

@router.get("")
async def get_dashboard(current_user: dict = Depends(get_current_user)):
    """Get aggregated dashboard data for user"""
    db = get_db()
    user_id = current_user['id']
    
    # Get user data
    user = await db.users.find_one({"id": user_id}, {"_id": 0, "password": 0})
    
    # Get transactions summary
    transactions = await db.transactions.find(
        {"userId": user_id},
        {"_id": 0}
    ).to_list(1000)
    
    total_income = sum(t['amount'] for t in transactions if t['type'] == 'in')
    total_expenses = sum(abs(t['amount']) for t in transactions if t['type'] == 'out')
    
    # Spending by category
    spending_by_category = {}
    for t in transactions:
        if t['type'] == 'out':
            cat = t['category']
            spending_by_category[cat] = spending_by_category.get(cat, 0) + abs(t['amount'])
    
    # Get portfolio summary
    portfolio = await db.portfolio.find(
        {"userId": user_id},
        {"_id": 0}
    ).to_list(1000)
    
    total_invested = sum(item['buyPrice'] * item['quantity'] for item in portfolio)
    
    # Calculate investment by type
    investments_by_type = {}
    for item in portfolio:
        inv_type = item['investmentType']
        value = item['buyPrice'] * item['quantity']
        investments_by_type[inv_type] = investments_by_type.get(inv_type, 0) + value
    
    # Get quiz stats (from user XP)
    quiz_stats = {
        "totalXp": user['xp'],
        "level": user['level'],
        "questionsAnswered": user['xp'] // 100  # Approximate
    }
    
    return {
        "user": {
            "id": user['id'],
            "name": user['name'],
            "email": user['email'],
            "coins": user['coins'],
            "level": user['level'],
            "xp": user['xp'],
            "healthScore": user.get('healthScore', 50)
        },
        "budget": {
            "balance": user['coins'],
            "totalIncome": total_income,
            "totalExpenses": total_expenses,
            "spendingByCategory": spending_by_category,
            "transactionCount": len(transactions)
        },
        "investments": {
            "totalInvested": total_invested,
            "portfolioCount": len(portfolio),
            "investmentsByType": investments_by_type
        },
        "quiz": quiz_stats
    }


