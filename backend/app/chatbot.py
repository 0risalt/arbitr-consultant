from sqlalchemy import text, func, select
from sqlalchemy.orm import Session
from .models import FAQ
from .database import AsyncSessionLocal
import uuid

async def get_best_answer(question: str, session_id: uuid.UUID):
    """
    Асинхронный поиск лучшего ответа.
    1. Полнотекстовый поиск по tsvector.
    2. Если ранг низкий, триграмный поиск (ILIKE + similarity).
    Возвращает (answer, confidence, faq_id).
    """
    async with AsyncSessionLocal() as db:
        # Полнотекстовый поиск
        ts_query = func.plainto_tsquery('russian', question)
        stmt = (
            select(FAQ.answer, FAQ.id, func.ts_rank(FAQ.tsvector, ts_query).label("rank"))
            .where(FAQ.tsvector.op('@@')(ts_query))
            .order_by(func.ts_rank(FAQ.tsvector, ts_query).desc())
            .limit(1)
        )
        res = await db.execute(stmt)
        row = res.fetchone()
        if row and row.rank > 0.05:
            return row.answer, round(float(row.rank), 2)

        # Триграмный поиск (нечёткий)
        pattern = f"%{question}%"
        stmt2 = select(FAQ.answer, FAQ.id).where(FAQ.question.ilike(pattern)).limit(1)
        res2 = await db.execute(stmt2)
        row2 = res2.fetchone()
        if row2:
            return row2.answer, 0.4  # средняя уверенность

        # Если ничего не найдено
        return ("Извините, я не могу ответить на этот вопрос. Попробуйте переформулировать или обратитесь в канцелярию суда.", 0.0)

async def log_consultation(session_id, question, answer):
    from .models import Consultation
    async with AsyncSessionLocal() as db:
        async with db.begin():
            consult = Consultation(
                session_id=session_id,
                question=question,
                answer=answer
            )
            db.add(consult)