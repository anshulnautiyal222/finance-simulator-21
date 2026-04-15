from pydantic import BaseModel
from typing import List

class QuizQuestion(BaseModel):
    id: str
    category: str
    icon: str
    question: str
    options: List[str]
    correctAnswer: int
    explanation: str
    points: int
    reward: int

class QuizSubmission(BaseModel):
    answers: List[int]  # List of selected answer indices

class QuizResult(BaseModel):
    score: int
    totalQuestions: int
    correctAnswers: int
    coinsEarned: int
    xpEarned: int
    results: List[dict]

