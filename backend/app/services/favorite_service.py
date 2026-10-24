
from sqlalchemy.orm import Session

from app.database.models import FavoriteMovie
from app.schemas.favorite import FavoriteMovieCreate


def get_all_favorites(db: Session):
    return db.query(FavoriteMovie).all()


def create_favorite(
    db: Session,
    favorite_data: FavoriteMovieCreate,
):
    favorite = FavoriteMovie(**favorite_data.model_dump())

    db.add(favorite)
    db.commit()
    db.refresh(favorite)

    return favorite


def delete_favorite(db: Session, favorite_id: int) -> bool:
    favorite = (
        db.query(FavoriteMovie)
        .filter(FavoriteMovie.id == favorite_id)
        .first()
    )

    if favorite is None:
        return False

    db.delete(favorite)
    db.commit()

    return True
