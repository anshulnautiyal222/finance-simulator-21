from fastapi import APIRouter, Depends
from middleware.auth import get_current_user
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel
from typing import Optional
import os

router = APIRouter(prefix="/gamestate", tags=["Game State"])

def get_db():
    mongo_url = os.environ['MONGO_URL']
    client = AsyncIOMotorClient(mongo_url)
    return client[os.environ['DB_NAME']]

class GameStateUpdate(BaseModel):
    balance: Optional[float] = None
    day: Optional[int] = None
    investments: Optional[dict] = None
    spending: Optional[dict] = None
    transactions: Optional[list] = None
    balanceHistory: Optional[list] = None
    healthScore: Optional[int] = None
    xp: Optional[int] = None
    level: Optional[int] = None

@router.get("")
async def get_game_state(current_user: dict = Depends(get_current_user)):
    """Load saved game state for the current user"""
    db = get_db()
    state = await db.game_states.find_one(
        {"userId": current_user['id']},
        {"_id": 0}
    )
    if not state:
        return {"exists": False}
    state.pop("userId", None)
    return {"exists": True, "state": state}

@router.put("")
async def save_game_state(
    game_state: GameStateUpdate,
    current_user: dict = Depends(get_current_user)
):
    """Save full game state for the current user"""
    db = get_db()
    state_dict = game_state.model_dump(exclude_none=False)
    state_dict["userId"] = current_user['id']

    await db.game_states.update_one(
        {"userId": current_user['id']},
        {"$set": state_dict},
        upsert=True
    )

    # Also sync key user stats to the users collection
    user_updates = {}
    if game_state.balance is not None:
        user_updates["coins"] = game_state.balance
    if game_state.xp is not None:
        user_updates["xp"] = game_state.xp
    if game_state.level is not None:
        user_updates["level"] = game_state.level
    if game_state.healthScore is not None:
        user_updates["healthScore"] = game_state.healthScore

    if user_updates:
        await db.users.update_one(
            {"id": current_user['id']},
            {"$set": user_updates}
        )

    return {"message": "Game state saved"}

