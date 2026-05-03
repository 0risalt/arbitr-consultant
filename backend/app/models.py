import uuid
from datetime import datetime
from sqlalchemy import Column, String, Text, DateTime, ForeignKey, Index, text
from sqlalchemy.dialects.postgresql import UUID, TSVECTOR
from sqlalchemy.orm import relationship
from .database import Base

class FAQ(Base):
    __tablename__ = 'faq'
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    question = Column(Text, nullable=False)
    answer = Column(Text, nullable=False)
    category = Column(String(100))
    tsvector = Column(TSVECTOR)  # Generated column – только для чтения

    __table_args__ = (
        Index('ix_faq_tsvector', tsvector, postgresql_using='gin'),
        Index('ix_faq_trgm', question, postgresql_using='gin', postgresql_ops={'question': 'gin_trgm_ops'}),
    )

class CourtCase(Base):
    __tablename__ = 'court_cases'
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    case_number = Column(String(50), unique=True, nullable=False)
    plaintiff = Column(Text)
    defendant = Column(Text)
    judge_name = Column(Text)
    status = Column(String(50), default='На рассмотрении')
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)

    hearings = relationship('HearingSchedule', back_populates='case', cascade='all, delete-orphan')

class HearingSchedule(Base):
    __tablename__ = 'hearing_schedule'
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    case_id = Column(UUID(as_uuid=True), ForeignKey('court_cases.id', ondelete='CASCADE'))
    hearing_date = Column(DateTime(timezone=True), nullable=False)
    courtroom = Column(String(20))
    judge_name = Column(Text)

    case = relationship('CourtCase', back_populates='hearings')

class Consultation(Base):
    __tablename__ = 'consultations'
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    session_id = Column(UUID(as_uuid=True), nullable=False)
    question = Column(Text, nullable=False)
    answer = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)

class Admin(Base):
    __tablename__ = 'admins'
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    username = Column(String(50), unique=True, nullable=False)
    password_hash = Column(Text, nullable=False)