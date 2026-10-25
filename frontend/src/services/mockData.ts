import { Movie } from '../types';

export const mockMovies: Movie[] = [
  {
    id: 169,
    title: 'Breaking Bad',
    summary:
      'Um professor de química diagnosticado com câncer começa a produzir metanfetamina...',
    image: 'https://static.tvmaze.com/uploads/images/medium_portrait/0/2400.jpg',
    rating: 9.2,
    genres: ['Drama', 'Crime', 'Suspense'],
  },
  {
    id: 82,
    title: 'Game of Thrones',
    summary:
      'Famílias nobres disputam o controle do Trono de Ferro enquanto uma ameaça antiga desperta no Norte.',
    image: 'https://placehold.co/210x295?text=Game+of+Thrones',
    rating: 9.0,
    genres: ['Drama', 'Fantasia', 'Aventura'],
  },
  {
    id: 2993,
    title: 'Stranger Things',
    summary:
      'Quando um garoto desaparece, uma pequena cidade descobre segredos e forças sobrenaturais.',
    genres: ['Ficção Científica', 'Terror', 'Mistério'],
  },
];