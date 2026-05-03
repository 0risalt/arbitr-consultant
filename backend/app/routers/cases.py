from fastapi import APIRouter, Depends
from sqlalchemy import select
from ..database import get_db
from ..models import CourtCase
from ..schemas import CourtCaseOut
from sqlalchemy.orm import joinedload
from typing import List

router = APIRouter(prefix="/api/cases", tags=["cases"])

@router.get("/", response_model=List[CourtCaseOut])
async def list_cases(db=Depends(get_db)):
    result = await db.execute(select(CourtCase).order_by(CourtCase.created_at.desc()))
    return result.scalars().all()