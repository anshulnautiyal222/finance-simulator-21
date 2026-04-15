from fastapi import APIRouter, HTTPException, status, Depends
from models.user import UserCreate, UserLogin, UserResponse, User
from utils.password import hash_password, verify_password
from utils.jwt_handler import create_access_token
from middleware.auth import get_current_user
from motor.motor_asyncio import AsyncIOMotorClient
import os

router = APIRouter(prefix="/auth", tags=["Authentication"])

def get_db():
    mongo_url = os.environ['MONGO_URL']
    client = AsyncIOMotorClient(mongo_url)
    return client[os.environ['DB_NAME']]

db = None

@router.post("/signup", response_model=dict, status_code=status.HTTP_201_CREATED)
async def signup(user_data: UserCreate):
    """Register a new user"""
    db = get_db()
    
    # Check if user already exists
    existing_user = await db.users.find_one({"email": user_data.email})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Hash password
    hashed_password = hash_password(user_data.password)
    
    # Create user
    user = User(
        name=user_data.name,
        email=user_data.email,
        password=hashed_password
    )
    
    # Insert to database
    user_dict = user.model_dump()
    await db.users.insert_one(user_dict)
    
    # Create access token
    access_token = create_access_token(data={"sub": user.id})
    
    # Return user without password
    user_response = UserResponse(
        id=user.id,
        name=user.name,
        email=user.email,
        coins=user.coins,
        level=user.level,
        xp=user.xp,
        healthScore=user.healthScore,
        createdAt=user.createdAt
    )
    
    return {
        "token": access_token,
        "user": user_response.model_dump()
    }

@router.post("/login", response_model=dict)
async def login(credentials: UserLogin):
    """Login user and return JWT token"""
    db = get_db()
    
    # Find user
    user = await db.users.find_one({"email": credentials.email}, {"_id": 0})
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    # Verify password
    if not verify_password(credentials.password, user['password']):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    # Create access token
    access_token = create_access_token(data={"sub": user['id']})
    
    # Return user without password
    user_response = UserResponse(
        id=user['id'],
        name=user['name'],
        email=user['email'],
        coins=user['coins'],
        level=user['level'],
        xp=user['xp'],
        healthScore=user.get('healthScore', 50),
        createdAt=user['createdAt']
    )
    
    return {
        "token": access_token,
        "user": user_response.model_dump()
    }

@router.get("/me", response_model=UserResponse)
async def get_me(current_user: dict = Depends(get_current_user)):
    """Get current authenticated user"""
    return UserResponse(**current_user)


