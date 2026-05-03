from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy import select
from ..database import get_db
from ..models import Admin
from ..schemas import Token
from ..auth import verify_password, create_access_token, get_current_admin

router = APIRouter(prefix="/api/admin", tags=["admin"])

@router.post("/login", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db=Depends(get_db)):
    result = await db.execute(select(Admin).where(Admin.username == form_data.username))
    admin = result.scalar_one_or_none()
    if not admin or not verify_password(form_data.password, admin.password_hash):
        raise HTTPException(status_code=400, detail="Неверное имя пользователя или пароль")
    token = create_access_token({"sub": admin.username})
    return Token(access_token=token)

@router.get("/me")
async def read_admin(current_admin = Depends(get_current_admin)):
    return {"username": current_admin.username}