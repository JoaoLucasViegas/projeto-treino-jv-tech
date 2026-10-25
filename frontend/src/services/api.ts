import { Movie } from '../types';

const API_BASE_URL = 'http://localhost:8000/api';

export const getDefaultMovies = async (): Promise<Movie[]> => {
  const response = await fetch(`${API_BASE_URL}/movies/catalog`);

  if (!response.ok) {
    throw new Error(`Erro ao carregar catálogo (HTTP ${response.status})`);
  }

  return response.json();
};

export const searchMovies = async (query: string): Promise<Movie[]> => {
  const response = await fetch(
    `${API_BASE_URL}/movies/search?q=${encodeURIComponent(query)}`
  );

  if (!response.ok) {
    throw new Error(`Erro ao buscar filmes (HTTP ${response.status})`);
  }

  return response.json();
};