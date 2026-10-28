
from typing import List, Annotated

from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.schemas.favorite import (
    FavoriteMovieCreate,
    FavoriteMovieResponse,
)
from app.services.favorite_service import (
    get_all_favorites,
    create_favorite,
    delete_favorite,
) 

router = APIRouter(prefix="/api/favorites", tags=["Favoritos"])

DbSession = Annotated[Session, Depends(get_db)]


@router.get("/", response_model=List[FavoriteMovieResponse])
def list_favorites(db: DbSession):
    return get_all_favorites(db)


@router.post(
    "/",
    response_model=FavoriteMovieResponse,
    status_code=status.HTTP_201_CREATED,
)
def add_favorite(
    favorite_data: FavoriteMovieCreate,
    db: DbSession,
):
    return create_favorite(db, favorite_data)


@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_favorite(id: int, db: DbSession):
    deleted = delete_favorite(db, id)

    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Favorito não encontrado",
        )

    return Response(status_code=status.HTTP_204_NO_CONTENT)
