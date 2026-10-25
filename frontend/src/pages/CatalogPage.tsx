import { useEffect, useState, FormEvent, CSSProperties } from 'react';
import { Search } from 'lucide-react';
import MovieCard from '../components/MovieCard';
import { Movie } from '../types';
import { getDefaultMovies, searchMovies } from '../services/api';

interface CatalogPageProps {
  onOpenReview: (movie: Movie) => void;
  favoriteMovieIds: number[];
}

// Tokens Material Design 3 (--md-sys-color-*). O fallback é o tema escuro baseline.
const token = (name: string, fallback: string) => `var(--md-sys-color-${name}, ${fallback})`;

const color = {
  onSurface: token('on-surface', '#E6E1E5'),
  onSurfaceVariant: token('on-surface-variant', '#CAC4D0'),
  primary: token('primary', '#D0BCFF'),
  onPrimary: token('on-primary', '#381E72'),
};

// Variações da cor primária (acompanham o tema): anel, brilho e tinta de fundo.
const mix = (percent: number) => `color-mix(in srgb, ${color.primary} ${percent}%, transparent)`;
const primaryRing = mix(60);
const primaryGlow = mix(25);
const primaryTint = mix(10);
const primaryBorderSoft = mix(40);

const glass = 'rgba(255, 255, 255, 0.08)';
const glassBorder = 'rgba(255, 255, 255, 0.12)';

// Fundo gradiente: preto com roxo. Mesmo gradiente do Navbar (fixed = emendados).
const background =
  'radial-gradient(80% 60% at 20% 0%, rgba(124, 77, 255, 0.35) 0%, transparent 70%), ' +
  'linear-gradient(160deg, #24104A 0%, #0F0620 45%, #000000 100%)';

// Easing "emphasized" do Material 3 (hover) e curva com leve overshoot (clique).
const emphasized = 'cubic-bezier(0.2, 0, 0, 1)';
const spring = 'cubic-bezier(0.34, 1.56, 0.64, 1)';

const styles: Record<string, CSSProperties> = {
  page: {
    width: '100%',
    minHeight: '100vh',
    boxSizing: 'border-box',
    padding: '24px 24px 48px',
    background,
    backgroundAttachment: 'fixed',
    fontFamily: 'Roboto, "Google Sans", Arial, sans-serif',
    color: color.onSurface,
  },
  container: {
    width: '100%',
    maxWidth: 1200,
    margin: '0 auto',
  },
  searchForm: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    width: '100%',
    maxWidth: 640,
    margin: '0 auto 40px',
  },
  inputWrapper: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    height: 56,
    boxSizing: 'border-box',
    padding: '0 20px',
    borderRadius: 28,
    background: glass,
    border: `1px solid ${glassBorder}`,
    boxShadow: '0 0 0 0 transparent, 0 0 0 0 transparent',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    color: color.onSurfaceVariant,
    transition: `border-color 400ms ${emphasized}, box-shadow 400ms ${emphasized}, background 400ms ${emphasized}, color 300ms ${emphasized}`,
  },
  inputWrapperHover: {
    background: primaryTint,
    borderColor: primaryBorderSoft,
    boxShadow: `0 0 28px 0 ${primaryGlow}, 0 0 0 0 transparent`,
    color: color.onSurface,
  },
  inputWrapperFocused: {
    background: primaryTint,
    borderColor: primaryRing,
    boxShadow: `0 0 28px 0 ${primaryGlow}, 0 0 0 4px ${mix(18)}`,
    color: color.primary,
  },
  input: {
    flex: 1,
    minWidth: 0,
    border: 'none',
    outline: 'none',
    background: 'transparent',
    color: color.onSurface,
    fontFamily: 'inherit',
    fontSize: 16,
  },
  button: {
    height: 56,
    padding: '0 28px',
    border: 'none',
    borderRadius: 28,
    background: color.primary,
    color: color.onPrimary,
    fontFamily: 'inherit',
    fontSize: 14,
    fontWeight: 600,
    letterSpacing: '0.1px',
    cursor: 'pointer',
    transform: 'scale(1)',
    boxShadow: '0 0 0 0 transparent',
    transition: `transform 300ms ${spring}, box-shadow 400ms ${emphasized}`,
  },
  buttonHover: { boxShadow: `0 0 28px 2px ${mix(45)}` },
  buttonPressed: { transform: 'scale(0.96)' },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, 160px)',
    justifyContent: 'center',
    alignItems: 'stretch',
    gap: 28,
  },
  message: { color: color.onSurfaceVariant, fontSize: 14, textAlign: 'center' },
};

const CatalogPage = ({ onOpenReview, favoriteMovieIds }: CatalogPageProps) => {
  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [inputHovered, setInputHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [buttonHovered, setButtonHovered] = useState(false);
  const [pressed, setPressed] = useState(false);

  const runSearch = async (term: string) => {
    setLoading(true);
    setError(false);
    try {
      setMovies(await searchMovies(term));
    } catch {
      setMovies([]);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const loadDefaultMovies = async () => {
    setLoading(true);
    setError(false);
    try {
      setMovies(await getDefaultMovies());
    } catch {
      setMovies([]);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDefaultMovies();
  }, []);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const term = query.trim();
    if (!term) {
      loadDefaultMovies();
      return;
    }
    runSearch(term);
  };

  const inputWrapperStyle: CSSProperties = {
    ...styles.inputWrapper,
    ...(inputHovered ? styles.inputWrapperHover : {}),
    ...(focused ? styles.inputWrapperFocused : {}),
  };

  const buttonStyle: CSSProperties = {
    ...styles.button,
    ...(buttonHovered ? styles.buttonHover : {}),
    ...(pressed ? styles.buttonPressed : {}),
  };

  return (
    <main style={styles.page}>
      <div style={styles.container}>
        <form style={styles.searchForm} onSubmit={handleSubmit}>
          <label
            style={inputWrapperStyle}
            onMouseEnter={() => setInputHovered(true)}
            onMouseLeave={() => setInputHovered(false)}
          >
            <Search size={20} />
            <input
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder="Pesquisar filmes e séries"
              style={styles.input}
            />
          </label>
          <button
            type="submit"
            style={buttonStyle}
            onMouseEnter={() => setButtonHovered(true)}
            onMouseLeave={() => {
              setButtonHovered(false);
              setPressed(false);
            }}
            onMouseDown={() => setPressed(true)}
            onMouseUp={() => setPressed(false)}
          >
            Pesquisar
          </button>
        </form>

        {loading ? (
          <p style={styles.message}>Buscando...</p>
        ) : error ? (
          <p style={styles.message}>
            Não foi possível carregar os filmes
          </p>
        ) : movies.length === 0 ? (
          <p style={styles.message}>
            Nenhum título encontrado.
          </p>
        ) : (
          <section style={styles.grid}>
            {movies.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                isFavorited={favoriteMovieIds.includes(movie.id)}
                onOpenReview={onOpenReview}
              />
            ))}
          </section>
        )}
      </div>
    </main>
  );
};

export default CatalogPage;