from fastapi import APIRouter, HTTPException
from ..schemas import ChatRequest, ChatResponse
from ..chatbot import get_best_answer, log_consultation
import uuid

router = APIRouter(prefix="/api/chat", tags=["chat"])

@router.post("/ask", response_model=ChatResponse)
async def ask_question(req: ChatRequest):
    if len(req.question.strip()) < 3:
        raise HTTPException(400, "Слишком короткий вопрос. Минимум 3 символа.")
    answer, confidence = await get_best_answer(req.question, req.session_id)
    # Логирование асинхронно (не ждём)
    await log_consultation(req.session_id, req.question, answer)
    return ChatResponse(answer=answer, confidence=confidence)