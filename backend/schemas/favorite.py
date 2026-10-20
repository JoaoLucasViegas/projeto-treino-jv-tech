import asyncio
import re
import httpx
from pydantic import BaseModel, Field

TVMAZE_BASE_URL = "https://api.tvmaze.com"

class MovieSchema(BaseModel):
    id: int
    title: str
    summary: str
    image: str
    rating: float = Field(ge=0, le=10)
    genres: list[str]


def _strip_html(text: str | None) -> str:
    return re.sub(r"<[^>]+>", "", text or "").strip();

def _to_movie_schema(show: dict) -> MovieSchema:
    image = show.get("image") or {}
    rating = show.get("rating") or {};

    return MovieSchema(
        id=show["id"],
        title=show["name"],
        summary=_strip_html(show.get("summary")),
        image=image.get("original") or image.get("medium") or "",
        rating=rating.get("average") or 0.0,
        genres=show.get("genres") or [],
    );


async def search_movies_in_tvmaze(query: str) -> list[MovieSchema]:
    async with httpx.AsyncClient(base_url=TVMAZE_BASE_URL, timeout=10.0) as client:
        response = await client.get("/search/shows", params={"q": query})
        response.raise_for_status()
        results = response.json();

    return [_to_movie_schema(item["show"]) for item in results];


async def main():
    try:
        filmes = await search_movies_in_tvmaze("breaking bad");
    except httpx.HTTPStatusError as e:
        print(f"Erro HTTP {e.response.status_code}: {e.request.url}");
        return;
    except httpx.RequestError as e:
        print(f"Erro de conexão: {e}");
        return;

    for filme in filmes:
        print(f"{filme.id} - {filme.title} ({filme.rating}) {filme.genres}");


if __name__ == "__main__":
    asyncio.run(main());