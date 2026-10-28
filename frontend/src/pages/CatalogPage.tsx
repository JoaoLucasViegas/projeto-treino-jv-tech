import { useEffect, useRef, useState, FormEvent, CSSProperties } from 'react';
import { ChevronLeft, ChevronRight, Search, X } from 'lucide-react';
import MovieCard from '../components/MovieCard';
import { Movie } from '../types';
import { getDefaultMovies, searchMovies } from '../services/api';

interface CatalogPageProps {
  onOpenDetails: (movie: Movie) => void;
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
const PAGE_SIZE = 12;

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
    border: `1px solid ${primaryBorderSoft}`,
    boxShadow: `0 0 28px 0 ${primaryGlow}, 0 0 0 0 transparent`,
    color: color.onSurface,
  },
  inputWrapperFocused: {
    background: primaryTint,
    border: `1px solid ${primaryRing}`,
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
  clearButton: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    flex: '0 0 36px',
    width: 36,
    height: 36,
    padding: 0,
    border: 'none',
    borderRadius: 18,
    background: 'transparent',
    color: color.onSurfaceVariant,
    cursor: 'pointer',
    transition: `background 300ms ${emphasized}, color 300ms ${emphasized}`,
  },
  clearButtonHover: { background: primaryTint, color: color.primary },
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
  resultsSummary: {
    margin: '0 0 16px',
    color: color.onSurfaceVariant,
    fontSize: 12,
    textAlign: 'center',
  },
  pagination: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    marginTop: 32,
  },
  pageButton: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    height: 44,
    padding: '0 18px',
    border: 'none',
    borderRadius: 999,
    background: token('primary-container', '#4F378B'),
    color: token('on-primary-container', '#EADDFF'),
    fontFamily: 'inherit',
    fontSize: 14,
    fontWeight: 500,
    letterSpacing: '0.1px',
    cursor: 'pointer',
    transition: `background 300ms ${emphasized}, color 300ms ${emphasized}, box-shadow 400ms ${emphasized}`,
  },
  pageButtonDisabled: {
    opacity: 0.45,
    cursor: 'not-allowed',
    background: glass,
    color: color.onSurfaceVariant,
  },
  pageIndicator: {
    color: color.onSurfaceVariant,
    fontSize: 14,
    minWidth: 100,
    textAlign: 'center',
  },
};

const CatalogPage = ({ onOpenDetails, onOpenReview, favoriteMovieIds }: CatalogPageProps) => {
  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [inputHovered, setInputHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [buttonHovered, setButtonHovered] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [clearHovered, setClearHovered] = useState(false);
  const requestId = useRef(0);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const runSearch = async (term: string) => {
    const activeRequest = ++requestId.current;
    setLoading(true);
    setError(null);
    setCurrentPage(1);
    try {
      const results = await searchMovies(term);
      if (activeRequest !== requestId.current) return;
      setMovies(results);
    } catch (caughtError) {
      if (activeRequest !== requestId.current) return;
      setMovies([]);
      console.error('Falha ao buscar filmes:', caughtError);
      setError('Não foi possível buscar os filmes. Verifique se o servidor está disponível e tente novamente.');
    } finally {
      if (activeRequest === requestId.current) setLoading(false);
    }
  };

  const loadDefaultMovies = async () => {
    const activeRequest = ++requestId.current;
    setLoading(true);
    setError(null);
    setCurrentPage(1);
    try {
      const results = await getDefaultMovies();
      if (activeRequest !== requestId.current) return;
      setMovies(results);
    } catch (caughtError) {
      if (activeRequest !== requestId.current) return;
      setMovies([]);
      console.error('Falha ao carregar o catálogo:', caughtError);
      setError('Não foi possível carregar o catálogo. Verifique se o servidor está disponível e tente novamente.');
    } finally {
      if (activeRequest === requestId.current) setLoading(false);
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
  const pageCount = Math.ceil(movies.length / PAGE_SIZE);
  const visiblePage = Math.min(currentPage, Math.max(pageCount, 1));
  const paginatedMovies = movies.slice((visiblePage - 1) * PAGE_SIZE, visiblePage * PAGE_SIZE);
  const firstResult = movies.length === 0 ? 0 : (visiblePage - 1) * PAGE_SIZE + 1;
  const lastResult = Math.min(visiblePage * PAGE_SIZE, movies.length);

  return (
    <main style={styles.page}>
      <div style={styles.container}>
        <form style={styles.searchForm} onSubmit={handleSubmit}>
          <div
            style={inputWrapperStyle}
            onMouseEnter={() => setInputHovered(true)}
            onMouseLeave={() => setInputHovered(false)}
          >
            <Search size={20} aria-hidden="true" />
            <input
              ref={searchInputRef}
              id="catalog-search"
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder="Pesquisar filmes e séries"
              aria-label="Pesquisar filmes e séries"
              style={styles.input}
            />
            {query.length > 0 && (
              <button
                type="button"
                style={{ ...styles.clearButton, ...(clearHovered ? styles.clearButtonHover : {}) }}
                aria-label="Limpar pesquisa"
                onClick={() => {
                  setQuery('');
                  setCurrentPage(1);
                  searchInputRef.current?.focus();
                }}
                onMouseEnter={() => setClearHovered(true)}
                onMouseLeave={() => setClearHovered(false)}
              >
                <X size={18} />
              </button>
            )}
          </div>
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
          <p style={styles.message} role="status" aria-live="polite">Buscando...</p>
        ) : error ? (
          <p style={styles.message} role="alert">{error}</p>
        ) : movies.length === 0 ? (
          <p style={styles.message}>
            Nenhum título encontrado.
          </p>
        ) : (
          <>
            <p style={styles.resultsSummary} aria-live="polite">
              Exibindo {firstResult}–{lastResult} de {movies.length} resultados
            </p>
            <section style={styles.grid} aria-label="Resultados do catálogo">
              {paginatedMovies.map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  onOpenDetails={onOpenDetails}
                  isFavorited={favoriteMovieIds.includes(movie.id)}
                  onOpenReview={onOpenReview}
                />
              ))}
            </section>
            {pageCount > 1 && (
              <nav style={styles.pagination} aria-label="Paginação dos resultados">
                <button
                  type="button"
                  style={{
                    ...styles.pageButton,
                    ...(visiblePage === 1 ? styles.pageButtonDisabled : {}),
                  }}
                    onClick={() => setCurrentPage((page) => Math.max(1, Math.min(page, pageCount) - 1))}
                    disabled={visiblePage === 1}
                  aria-label="Página anterior"
                >
                  <ChevronLeft size={16} />
                  Anterior
                </button>
                <span style={styles.pageIndicator} aria-current="page">
                  Página {visiblePage} de {pageCount}
                </span>
                <button
                  type="button"
                  style={{
                    ...styles.pageButton,
                    ...(visiblePage === pageCount ? styles.pageButtonDisabled : {}),
                  }}
                  onClick={() => setCurrentPage((page) => Math.min(pageCount, Math.min(page, pageCount) + 1))}
                  disabled={visiblePage === pageCount}
                  aria-label="Próxima página"
                >
                  Próxima
                  <ChevronRight size={16} />
                </button>
              </nav>
            )}
          </>
        )}
      </div>
    </main>
  );
};

export default CatalogPage;