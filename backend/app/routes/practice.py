from typing import Annotated

from app.schemas.practice import (
    PracticeCreate,
    PracticeResponse,
    PracticeUpdate,
)
from app.services.practice_service import (
    complete_practice,
    create_practice,
    delete_practice,
    get_all_practices,
    get_practice,
    update_practice,
)
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ..database import get_db

DbSession = Annotated[Session, Depends(get_db)]

router = APIRouter(prefix="/practices", tags=["Practices"])


@router.post(
    "",
    response_model=PracticeResponse,
    status_code=status.HTTP_201_CREATED,
)
def create(
    practice_data: PracticeCreate,
    db: DbSession,
):
    return create_practice(db, practice_data)


@router.get(
    "",
    response_model=list[PracticeResponse],
    status_code=status.HTTP_200_OK,
)
def get_all(db: DbSession):
    return get_all_practices(db)


@router.put("/{practice_id}", response_model=PracticeResponse)
def update(practice_id: int, practice_data: PracticeUpdate, db: DbSession):
    practice = get_practice(db, practice_id)

    if not practice:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Practice not found",
        )

    return update_practice(db, practice, practice_data)


@router.patch("/{practice_id}/complete", response_model=PracticeResponse)
def complete(practice_id: int, db: DbSession):
    practice = get_practice(db, practice_id)

    if not practice:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Practice not found"
        )

    return complete_practice(db, practice)


@router.delete("/{practice_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete(practice_id: int, db: DbSession):
    practice = get_practice(db, practice_id)

    if not practice:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Practice not found"
        )

    delete_practice(db, practice)
