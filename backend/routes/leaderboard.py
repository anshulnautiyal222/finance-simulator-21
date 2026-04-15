from fastapi import APIRouter
from motor.motor_asyncio import AsyncIOMotorClient
from typing import List
import os

router = APIRouter(prefix="/leaderboard", tags=["Leaderboard"])

def get_db():
    mongo_url = os.environ['MONGO_URL']
    client = AsyncIOMotorClient(mongo_url)
    return client[os.environ['DB_NAME']]

@router.get("/coins")
async def get_leaderboard_by_coins(limit: int = 10):
    """Get top users by coins"""
    db = get_db()
    users = await db.users.find(
        {},
        {"_id": 0, "password": 0}
    ).sort("coins", -1).limit(limit).to_list(limit)
    
    leaderboard = []
    for idx, user in enumerate(users, 1):
        leaderboard.append({
            "rank": idx,
            "name": user['name'],
            "coins": user['coins'],
            "level": user['level'],
            "xp": user['xp']
        })
    
    return {"leaderboard": leaderboard}

@router.get("/xp")
async def get_leaderboard_by_xp(limit: int = 10):
    """Get top users by XP"""
    db = get_db()
    users = await db.users.find(
        {},
        {"_id": 0, "password": 0}
    ).sort("xp", -1).limit(limit).to_list(limit)
    
    leaderboard = []
    for idx, user in enumerate(users, 1):
        leaderboard.append({
            "rank": idx,
            "name": user['name'],
            "coins": user['coins'],
            "level": user['level'],
            "xp": user['xp']
        })
    
    return {"leaderboard": leaderboard}

@router.get("/combined")
async def get_combined_leaderboard(limit: int = 10):
    """Get top users by combined score (coins + xp)"""
    db = get_db()
    users = await db.users.find(
        {},
        {"_id": 0, "password": 0}
    ).to_list(1000)
    
    # Calculate combined score
    for user in users:
        user['combinedScore'] = user['coins'] + (user['xp'] * 10)  # XP weighted 10x
        user['healthScore'] = user.get('healthScore', 50)
    
    # Sort by combined score
    users.sort(key=lambda x: x['combinedScore'], reverse=True)
    
    leaderboard = []
    for idx, user in enumerate(users[:limit], 1):
        leaderboard.append({
            "rank": idx,
            "name": user['name'],
            "coins": user['coins'],
            "level": user['level'],
            "xp": user['xp'],
            "healthScore": user['healthScore'],
            "combinedScore": user['combinedScore']
        })
    
    return {"leaderboard": leaderboard}


