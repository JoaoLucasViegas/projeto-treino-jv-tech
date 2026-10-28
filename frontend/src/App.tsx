import { useCallback, useState } from 'react';
import Navbar from './components/Navbar';
import MovieDetailsModal from './components/MovieDetailsModal';
import ReviewModal from './components/ReviewModal';
import CatalogPage from './pages/CatalogPage';
import MyListPage from './pages/MyListPage';
import { Movie, FavoriteItem, CreateFavoritePayload } from './types';

function App() {
  const [activeTab, setActiveTab] = useState<'catalog' | 'mylist'>('catalog');
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [detailsMovie, setDetailsMovie] = useState<Movie | null>(null);

  const closeDetails = useCallback(() => setDetailsMovie(null), []);
  const openReviewFromDetails = useCallback((movie: Movie) => {
    setDetailsMovie(null);
    setSelectedMovie(movie);
  }, []);

  // Salva um filme na lista. Se ele já estiver lá, atualiza a entrada existente.
  const handleSave = (payload: CreateFavoritePayload) => {
    setFavorites((prev) => {
      const existing = prev.find((item) => item.movie_id === payload.movie_id);
      if (existing) {
        return prev.map((item) =>
          item.id === existing.id ? { ...payload, id: existing.id } : item
        );
      }
      return [...prev, { ...payload, id: Date.now() }];
    });
    setSelectedMovie(null);
  };

  const handleDelete = (id: number) => {
    setFavorites((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <>
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        favoritesCount={favorites.length}
      />

      {activeTab === 'catalog' ? (
        <CatalogPage
          onOpenDetails={setDetailsMovie}
          onOpenReview={setSelectedMovie}
          favoriteMovieIds={favorites.map((item) => item.movie_id)}
        />
      ) : (
        <MyListPage favorites={favorites} onDelete={handleDelete} />
      )}

      <MovieDetailsModal
        movie={detailsMovie}
        onClose={closeDetails}
        onOpenReview={openReviewFromDetails}
      />

      <ReviewModal
        movie={selectedMovie}
        onClose={() => setSelectedMovie(null)}
        onSave={handleSave}
      />
    </>
  );
}

export default App;