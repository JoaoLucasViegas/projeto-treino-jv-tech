
from typing import Optional

from pydantic import BaseModel, Field


class FavoriteMovieCreate(BaseModel):
    movie_id: int
    title: str
    poster_url: Optional[str] = None
    user_rating: float = Field(default=5.0, ge=0, le=10)
    status: str = "assistido"
    notes: Optional[str] = None


class FavoriteMovieResponse(FavoriteMovieCreate):
    id: int

    class Config:
        from_attributes = True
