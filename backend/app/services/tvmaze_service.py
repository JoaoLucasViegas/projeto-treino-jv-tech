
import html
import re
from typing import List

import httpx

from app.schemas.movie import MovieSchema


async def search_movies_in_tvmaze(query: str) -> List[MovieSchema]:
    if not query.strip():
        return []

    async with httpx.AsyncClient(timeout=15.0) as client:
        response = await client.get(
            "https://api.tvmaze.com/search/shows",
            params={"q": query},
        )
        response.raise_for_status()
        results = response.json()

    movies = []

    for item in results:
        show = item["show"]

        summary = show.get("summary") or ""
        summary = re.sub(r"<[^>]*>", "", summary)
        summary = html.unescape(summary).strip()

        image_data = show.get("image") or {}
        rating_data = show.get("rating") or {}

        movies.append(
            MovieSchema(
                id=show["id"],
                title=show["name"],
                summary=summary,
                image=image_data.get("medium"),
                rating=rating_data.get("average"),
                genres=show.get("genres") or [],
            )
        )

    return movies
