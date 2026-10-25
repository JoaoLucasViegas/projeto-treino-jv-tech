from typing import List
from app.routers.movies import router as movies_router
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.schemas.movie import MovieSchema
from app.services.tvmaze_service import search_movies_in_tvmaze
from app.routers.favorites import router as favorites_router

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(favorites_router)
app.include_router(movies_router)

@app.get("/movies/search", response_model=List[MovieSchema])
async def search_movies(query: str = ""):
    return await search_movies_in_tvmaze(query)