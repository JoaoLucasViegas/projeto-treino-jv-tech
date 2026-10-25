
from typing import List

from fastapi import APIRouter, Query

from app.schemas.movie import MovieSchema
from app.services.tvmaze_service import (
    get_default_movies_from_tvmaze,
    search_movies_in_tvmaze,
)

router = APIRouter(
    prefix="/api/movies",
    tags=["Filmes"],
)


@router.get("/catalog", response_model=List[MovieSchema])
async def get_default_movies():
    return await get_default_movies_from_tvmaze()


@router.get("/search", response_model=List[MovieSchema])
async def search_movies(q: str = Query(...)):
    return await search_movies_in_tvmaze(q)
