from fastapi import APIRouter, HTTPException, status, Depends
from models.quiz import QuizQuestion, QuizSubmission, QuizResult
from middleware.auth import get_current_user
from motor.motor_asyncio import AsyncIOMotorClient
from typing import List
import os
import uuid

router = APIRouter(prefix="/quiz", tags=["Quiz"])

def get_db():
    mongo_url = os.environ['MONGO_URL']
    client = AsyncIOMotorClient(mongo_url)
    return client[os.environ['DB_NAME']]

# Sample quiz questions (these will be seeded to database)
SAMPLE_QUESTIONS = [
    {
        "id": str(uuid.uuid4()),
        "category": "Budgeting Basics",
        "icon": "💰",
        "question": "You receive ₹10,000/month. After rent (₹3,000), which is the BEST savings strategy?",
        "options": [
            "Spend everything and save what's left",
            "Save first, then spend from what remains",
            "Invest all savings in stocks immediately",
            "Put everything in a savings account"
        ],
        "correctAnswer": 1,
        "explanation": "'Pay yourself first!' — Save before you spend. This ensures savings happen regardless of your willpower.",
        "points": 100,
        "reward": 200
    },
    {
        "id": str(uuid.uuid4()),
        "category": "Investment Types",
        "icon": "📈",
        "question": "Which investment typically offers the highest returns but also the highest risk?",
        "options": [
            "Fixed Deposits",
            "Savings Account",
            "Stocks",
            "Government Bonds"
        ],
        "correctAnswer": 2,
        "explanation": "Stocks offer high potential returns but come with market volatility and higher risk.",
        "points": 150,
        "reward": 300
    },
    {
        "id": str(uuid.uuid4()),
        "category": "Emergency Fund",
        "icon": "🚨",
        "question": "How many months of expenses should you ideally have in an emergency fund?",
        "options": [
            "1 month",
            "3-6 months",
            "12 months",
            "No need for emergency fund"
        ],
        "correctAnswer": 1,
        "explanation": "Financial experts recommend 3-6 months of expenses as a safety net for unexpected situations.",
        "points": 100,
        "reward": 200
    },
    {
        "id": str(uuid.uuid4()),
        "category": "Credit Cards",
        "icon": "💳",
        "question": "What's the smartest way to use a credit card?",
        "options": [
            "Max it out every month",
            "Only use it for emergencies",
            "Pay the minimum due each month",
            "Pay full balance before due date"
        ],
        "correctAnswer": 3,
        "explanation": "Paying the full balance avoids interest charges and builds a good credit score.",
        "points": 120,
        "reward": 250
    },
    {
        "id": str(uuid.uuid4()),
        "category": "Compound Interest",
        "icon": "🎯",
        "question": "Starting to invest early is beneficial because of:",
        "options": [
            "Lower taxes",
            "Compound interest",
            "Less risk",
            "Government subsidies"
        ],
        "correctAnswer": 1,
        "explanation": "Compound interest means earning returns on your returns, which grows exponentially over time.",
        "points": 130,
        "reward": 280
    }
]

@router.get("/questions", response_model=List[QuizQuestion])
async def get_quiz_questions():
    """Get all quiz questions"""
    db = get_db()
    # Seed questions if database is empty
    count = await db.quiz_questions.count_documents({})
    if count == 0:
        await db.quiz_questions.insert_many(SAMPLE_QUESTIONS)
    
    questions = await db.quiz_questions.find({}, {"_id": 0}).to_list(100)
    return questions

@router.post("/submit", response_model=QuizResult)
async def submit_quiz(
    submission: QuizSubmission,
    current_user: dict = Depends(get_current_user)
):
    """Submit quiz answers and calculate score"""
    # Get all questions
    questions = await db.quiz_questions.find({}, {"_id": 0}).to_list(100)
    
    if len(submission.answers) != len(questions):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Number of answers doesn't match number of questions"
        )
    
    # Calculate score
    score = 0
    correct_count = 0
    coins_earned = 0
    xp_earned = 0
    results = []
    
    for i, question in enumerate(questions):
        user_answer = submission.answers[i]
        is_correct = user_answer == question['correctAnswer']
        
        if is_correct:
            score += question['points']
            correct_count += 1
            coins_earned += question['reward']
            xp_earned += question['points']
        
        results.append({
            "questionId": question['id'],
            "question": question['question'],
            "userAnswer": user_answer,
            "correctAnswer": question['correctAnswer'],
            "isCorrect": is_correct,
            "explanation": question['explanation']
        })
    
    # Update user stats
    await db.users.update_one(
        {"id": current_user['id']},
        {
            "$inc": {
                "coins": coins_earned,
                "xp": xp_earned
            }
        }
    )
    
    # Check for level up (every 500 XP = 1 level)
    user = await db.users.find_one({"id": current_user['id']}, {"_id": 0})
    new_level = (user['xp'] + xp_earned) // 500 + 1
    
    if new_level > user['level']:
        await db.users.update_one(
            {"id": current_user['id']},
            {"$set": {"level": new_level}}
        )
    
    return QuizResult(
        score=score,
        totalQuestions=len(questions),
        correctAnswers=correct_count,
        coinsEarned=coins_earned,
        xpEarned=xp_earned,
        results=results
    )


