from app.models.practice import Practice, PracticeStatus
from app.schemas.practice import PracticeCreate, PracticeUpdate
from sqlalchemy import select
from sqlalchemy.orm import Session


def get_all_practices(db: Session) -> list[Practice]:
    statement = select(Practice).order_by(Practice.created_at.desc())
    return list(db.scalars(statement).all())


def get_practice(db: Session, practice_id: int) -> Practice | None:
    return db.get(Practice, practice_id)


def create_practice(db: Session, practice_data: PracticeCreate) -> Practice:
    practice = Practice(
        title=practice_data.title,
        description=practice_data.description,
        duration=practice_data.duration,
        difficulty=practice_data.difficulty,
        status=PracticeStatus.PENDING,
    )

    db.add(practice)
    db.commit()
    db.refresh(practice)

    return practice


def update_practice(
    db: Session, practice: Practice, practice_data: PracticeUpdate
) -> Practice:
    update_data = practice_data.model_dump(exclude_unset=True)

    for field, value in update_data.items():
        setattr(practice, field, value)

    db.commit()
    db.refresh(practice)

    return practice


def complete_practice(db: Session, practice: Practice) -> Practice:
    practice.status = PracticeStatus.COMPLETED

    db.commit()
    db.refresh(practice)

    return practice


def delete_practice(db: Session, practice: Practice) -> None:
    db.delete(practice)
    db.commit()
