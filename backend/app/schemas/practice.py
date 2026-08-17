from datetime import datetime
from typing import ClassVar

from app.models.practice import Difficulty, PracticeStatus
from pydantic import BaseModel, ConfigDict, Field


class PracticeCreate(BaseModel):
    title: str = Field(min_length=1, max_length=200)
    description: str = Field(min_length=1)
    duration: int = Field(gt=0)
    difficulty: Difficulty


class PracticeUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=1, max_length=200)
    description: str | None = Field(default=None, min_length=1)
    duration: int | None = Field(default=None, gt=0)
    difficulty: Difficulty | None = None
    status: PracticeStatus | None = None


class PracticeResponse(BaseModel):
    id: int
    title: str
    description: str
    duration: int
    difficulty: Difficulty
    status: PracticeStatus
    created_at: datetime
    updated_at: datetime

    model_config: ClassVar[ConfigDict] = ConfigDict(from_attributes=True)
