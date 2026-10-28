export interface Movie {
  id: number;
  title: string;
  summary: string;
  image?: string;
  rating?: number | null;
  genres: string[];
  year?: number | null;
}

export type FavoriteStatus = 'assistido' | 'quero_assistir';

export interface FavoriteItem {
  id: number;
  movie_id: number;
  title: string;
  poster_url: string;
  user_rating: number;
  status: FavoriteStatus;
  notes?: string;
}

export type CreateFavoritePayload = Omit<FavoriteItem, 'id'>;