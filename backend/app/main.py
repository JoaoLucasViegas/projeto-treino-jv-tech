from typing import List
from app.routers.movies import router as movies_router
from fastapi import FastAPI
from app.schemas.movie import MovieSchema
from app.services.tvmaze_service import search_movies_in_tvmaze
from app.routers.favorites import router as favorites_router

app = FastAPI()
app.include_router(favorites_router)
app.include_router(movies_router)

@app.get("/movies/search", response_model=List[MovieSchema])
async def search_movies(query: str = ""):
    return await search_movies_in_tvmaze(query)