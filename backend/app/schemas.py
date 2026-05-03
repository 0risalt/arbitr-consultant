from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from uuid import UUID

# FAQ
class FAQBase(BaseModel):
    question: str
    answer: str
    category: Optional[str] = None

class FAQOut(FAQBase):
    id: UUID

# CourtCase
class CourtCaseBase(BaseModel):
    case_number: str
    plaintiff: Optional[str] = None
    defendant: Optional[str] = None
    judge_name: Optional[str] = None
    status: str = "На рассмотрении"

class CourtCaseCreate(CourtCaseBase):
    pass

class CourtCaseOut(CourtCaseBase):
    id: UUID
    created_at: datetime

# HearingSchedule
class HearingBase(BaseModel):
    case_id: UUID
    hearing_date: datetime
    courtroom: Optional[str] = None
    judge_name: Optional[str] = None

class HearingOut(HearingBase):
    id: UUID

# Chat
class ChatRequest(BaseModel):
    question: str
    session_id: UUID

class ChatResponse(BaseModel):
    answer: str
    confidence: float  # релевантность 0..1

# Auth
class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"