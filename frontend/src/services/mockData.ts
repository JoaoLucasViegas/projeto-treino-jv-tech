import { Movie } from '../types';

const poster = (title: string) =>
  `https://placehold.co/210x295?text=${encodeURIComponent(title)}`;

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
    image: poster('Game of Thrones'),
    rating: 9.0,
    genres: ['Drama', 'Fantasia', 'Aventura'],
  },
  {
    id: 2993,
    title: 'Stranger Things',
    summary:
      'Quando um garoto desaparece, uma pequena cidade descobre segredos e forças sobrenaturais.',
    // sem "image" e sem "rating": ambos são opcionais, então é válido
    genres: ['Ficção Científica', 'Terror', 'Mistério'],
  },
  {
    id: 618,
    title: 'Better Call Saul',
    summary:
      'A trajetória de um advogado de poucos recursos até se tornar o criminoso mais falante da cidade.',
    image: poster('Better Call Saul'),
    rating: 8.9,
    genres: ['Drama', 'Crime'],
  },
  {
    id: 526,
    title: 'The Office',
    summary:
      'O dia a dia de funcionários de uma filial de papelaria, registrado por uma equipe de documentário.',
    image: poster('The Office'),
    rating: 8.6,
    genres: ['Comédia'],
  },
  {
    id: 431,
    title: 'Friends',
    summary:
      'Seis amigos enfrentam trabalho, namoros e a vida adulta em Nova York.',
    image: poster('Friends'),
    rating: 8.5,
    genres: ['Comédia', 'Romance'],
  },
  {
    id: 335,
    title: 'Sherlock',
    summary:
      'Um detetive consultor brilhante e seu parceiro resolvem crimes na Londres atual.',
    image: poster('Sherlock'),
    rating: 9.1,
    genres: ['Crime', 'Drama', 'Mistério'],
  },
  {
    id: 305,
    title: 'Black Mirror',
    summary:
      'Histórias independentes que mostram o lado sombrio e inesperado da tecnologia.',
    image: poster('Black Mirror'),
    rating: 8.8,
    genres: ['Ficção Científica', 'Drama', 'Suspense'],
  },
  {
    id: 2547,
    title: 'Peaky Blinders',
    summary:
      'Uma gangue de Birmingham ascende no período pós-guerra sob a liderança da família Shelby.',
    image: poster('Peaky Blinders'),
    rating: 8.8,
    genres: ['Drama', 'Crime', 'História'],
  },
  {
    id: 73,
    title: 'The Walking Dead',
    summary:
      'Sobreviventes de um apocalipse zumbi lutam para se manter vivos e unidos.',
    image: poster('The Walking Dead'),
    rating: 8.1,
    genres: ['Terror', 'Drama', 'Ação'],
  },
  {
    id: 66,
    title: 'The Big Bang Theory',
    summary:
      'Dois físicos geniais e seus amigos nerds descobrem que a vizinha ao lado é bem diferente deles.',
    image: poster('The Big Bang Theory'),
    rating: 8.2,
    genres: ['Comédia', 'Romance'],
  },
  {
    id: 17128,
    title: 'Dark',
    summary:
      'O desaparecimento de crianças em uma cidade alemã revela conexões entre quatro gerações.',
    image: poster('Dark'),
    rating: 8.7,
    genres: ['Ficção Científica', 'Mistério', 'Drama'],
  },
  {
    id: 38963,
    title: 'The Witcher',
    summary:
      'Um caçador de monstros solitário tenta encontrar seu lugar em um mundo em que pessoas se mostram mais perversas que as feras.',
    image: poster('The Witcher'),
    rating: 8.0,
    genres: ['Fantasia', 'Ação', 'Aventura'],
  },
  {
    id: 1001,
    title: 'Planeta Azul',
    summary:
      'Uma jornada pelos oceanos revela a vida e os mistérios das profundezas.',
    image: poster('Planeta Azul'),
    // sem "rating": testa o card sem badge de nota
    genres: ['Documentário', 'Natureza'],
  },
  {
    id: 1002,
    title: 'Noites de Verão',
    summary:
      'Um grupo de amigos de infância se reencontra em uma cidade litorânea e precisa encarar o passado.',
    image: poster('Noites de Verão'),
    rating: 7.4,
    genres: ['Drama', 'Romance'],
  },
];