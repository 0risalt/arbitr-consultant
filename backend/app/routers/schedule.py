from fastapi import APIRouter, Depends
from sqlalchemy import select
from ..database import get_db
from ..models import HearingSchedule
from ..schemas import HearingOut
from typing import List

router = APIRouter(prefix="/api/schedule", tags=["schedule"])

@router.get("/", response_model=List[HearingOut])
async def get_schedule(db=Depends(get_db)):
    result = await db.execute(
        select(HearingSchedule).order_by(HearingSchedule.hearing_date)
    )
    return result.scalars().all()