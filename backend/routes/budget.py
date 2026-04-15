from fastapi import APIRouter, HTTPException, status, Depends
from models.transaction import Transaction, TransactionCreate, TransactionUpdate
from middleware.auth import get_current_user
from motor.motor_asyncio import AsyncIOMotorClient
from typing import List
import os

router = APIRouter(prefix="/budget", tags=["Budget"])

def get_db():
    mongo_url = os.environ['MONGO_URL']
    client = AsyncIOMotorClient(mongo_url)
    return client[os.environ['DB_NAME']]

@router.get("/transactions", response_model=List[Transaction])
async def get_transactions(current_user: dict = Depends(get_current_user)):
    """Get all transactions for current user"""
    db = get_db()
    transactions = await db.transactions.find(
        {"userId": current_user['id']},
        {"_id": 0}
    ).sort("createdAt", -1).to_list(1000)
    
    return transactions

@router.post("/transactions", response_model=Transaction, status_code=status.HTTP_201_CREATED)
async def create_transaction(
    transaction_data: TransactionCreate,
    current_user: dict = Depends(get_current_user)
):
    """Create a new transaction"""
    db = get_db()
    # Get current day from user's game state
    user = await db.users.find_one({"id": current_user['id']}, {"_id": 0})
    current_day = user.get('currentDay', 1)
    
    # Create transaction
    transaction = Transaction(
        userId=current_user['id'],
        icon=transaction_data.icon,
        name=transaction_data.name,
        category=transaction_data.category,
        amount=transaction_data.amount,
        type=transaction_data.type,
        day=current_day
    )
    
    # Insert to database
    transaction_dict = transaction.model_dump()
    await db.transactions.insert_one(transaction_dict)
    
    # Update user balance
    balance_change = transaction.amount if transaction.type == 'in' else -transaction.amount
    await db.users.update_one(
        {"id": current_user['id']},
        {"$inc": {"coins": balance_change}}
    )
    
    return transaction

@router.put("/transactions/{transaction_id}", response_model=Transaction)
async def update_transaction(
    transaction_id: str,
    transaction_data: TransactionUpdate,
    current_user: dict = Depends(get_current_user)
):
    """Update a transaction"""
    db = get_db()
    # Find transaction
    existing = await db.transactions.find_one(
        {"id": transaction_id, "userId": current_user['id']},
        {"_id": 0}
    )
    
    if not existing:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Transaction not found"
        )
    
    # Calculate balance adjustment
    old_amount = existing['amount'] if existing['type'] == 'in' else -existing['amount']
    
    # Update transaction
    update_data = {k: v for k, v in transaction_data.model_dump().items() if v is not None}
    if update_data:
        await db.transactions.update_one(
            {"id": transaction_id},
            {"$set": update_data}
        )
    
    # Get updated transaction
    updated = await db.transactions.find_one({"id": transaction_id}, {"_id": 0})
    
    # Recalculate balance
    new_amount = updated['amount'] if updated['type'] == 'in' else -updated['amount']
    balance_diff = new_amount - old_amount
    
    await db.users.update_one(
        {"id": current_user['id']},
        {"$inc": {"coins": balance_diff}}
    )
    
    return Transaction(**updated)

@router.delete("/transactions/{transaction_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_transaction(
    transaction_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Delete a transaction"""
    db = get_db()
    # Find transaction
    transaction = await db.transactions.find_one(
        {"id": transaction_id, "userId": current_user['id']},
        {"_id": 0}
    )
    
    if not transaction:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Transaction not found"
        )
    
    # Revert balance
    balance_change = -transaction['amount'] if transaction['type'] == 'in' else transaction['amount']
    await db.users.update_one(
        {"id": current_user['id']},
        {"$inc": {"coins": balance_change}}
    )
    
    # Delete transaction
    await db.transactions.delete_one({"id": transaction_id})
    
    return None

@router.get("/summary")
async def get_budget_summary(current_user: dict = Depends(get_current_user)):
    """Get budget summary with balance and spending by category"""
    db = get_db()
    user = await db.users.find_one({"id": current_user['id']}, {"_id": 0})
    
    # Get all transactions
    transactions = await db.transactions.find(
        {"userId": current_user['id']},
        {"_id": 0}
    ).to_list(1000)
    
    # Calculate spending by category
    spending_by_category = {}
    total_income = 0
    total_expenses = 0
    
    for t in transactions:
        if t['type'] == 'out':
            category = t['category']
            spending_by_category[category] = spending_by_category.get(category, 0) + abs(t['amount'])
            total_expenses += abs(t['amount'])
        else:
            total_income += t['amount']
    
    return {
        "balance": user.get('coins', 0),
        "totalIncome": total_income,
        "totalExpenses": total_expenses,
        "spendingByCategory": spending_by_category,
        "transactionCount": len(transactions)
    }


