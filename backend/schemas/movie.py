from pydantic import BaseModel, Field

class MovieSchema(BaseModel):
    id: int
    title: str
    summary: str
    image: str
    rating: float = Field(ge=0, le=10)
    genres: list[str]