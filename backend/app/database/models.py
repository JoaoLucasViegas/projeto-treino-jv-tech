
from sqlalchemy import Column, Integer, String, Float, Text

from app.database.connection import Base


class FavoriteMovie(Base):
    __tablename__ = "favorite_movies"

    id = Column(Integer, primary_key=True, index=True)
    movie_id = Column(Integer, nullable=False)
    title = Column(String, nullable=False)
    poster_url = Column(String, nullable=True)
    user_rating = Column(Float, default=5.0, nullable=False)
    status = Column(String, default="assistido", nullable=False)
    notes = Column(Text, nullable=True)
