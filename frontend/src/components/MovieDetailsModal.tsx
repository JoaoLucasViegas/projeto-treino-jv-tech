import { useEffect, useRef, useState, CSSProperties } from 'react';
import { Film, Star, X } from 'lucide-react';
import { Movie } from '../types';
import { localizeMovieGenre } from '../utils/movieGenres';

interface MovieDetailsModalProps {
  movie: Movie | null;
  onClose: () => void;
  onOpenReview: (movie: Movie) => void;
}

const token = (name: string, fallback: string) => `var(--md-sys-color-${name}, ${fallback})`;

const color = {
  surface: token('surface-container-high', '#241B38'),
  surfaceLow: token('surface-container-low', 'rgba(255, 255, 255, 0.04)'),
  onSurface: token('on-surface', '#E6E1E5'),
  onSurfaceVariant: token('on-surface-variant', '#CAC4D0'),
  primary: token('primary', '#D0BCFF'),
  onPrimary: token('on-primary', '#381E72'),
};

const mix = (percent: number) => `color-mix(in srgb, ${color.primary} ${percent}%, transparent)`;
const emphasized = 'cubic-bezier(0.2, 0, 0, 1)';
const spring = 'cubic-bezier(0.34, 1.56, 0.64, 1)';

const styles: Record<string, CSSProperties> = {
  scrim: {
    position: 'fixed',
    inset: 0,
    zIndex: 100,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    background: 'rgba(0, 0, 0, 0.6)',
    backdropFilter: 'blur(6px)',
    WebkitBackdropFilter: 'blur(6px)',
    opacity: 0,
    transition: `opacity 300ms ${emphasized}`,
  },
  scrimVisible: { opacity: 1 },
  dialog: {
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
    width: '100%',
    maxWidth: 720,
    maxHeight: '90vh',
    boxSizing: 'border-box',
    padding: 24,
    borderRadius: 28,
    background: color.surface,
    border: `1px solid rgba(255, 255, 255, 0.14)`,
    boxShadow: `0 24px 60px rgba(0, 0, 0, 0.6), 0 0 40px 0 ${mix(25)}`,
    fontFamily: 'Roboto, "Google Sans", Arial, sans-serif',
    color: color.onSurface,
    transform: 'translateY(16px) scale(0.96)',
    transition: `transform 450ms ${spring}`,
    overflowY: 'auto',
  },
  dialogVisible: { transform: 'translateY(0) scale(1)' },
  header: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 16,
  },
  heading: { display: 'flex', flexDirection: 'column', gap: 8, minWidth: 0 },
  overline: {
    margin: 0,
    color: color.primary,
    fontSize: 12,
    fontWeight: 600,
    letterSpacing: '0.5px',
    textTransform: 'uppercase',
  },
  title: {
    margin: 0,
    color: color.onSurface,
    fontSize: 24,
    fontWeight: 600,
    lineHeight: '32px',
    overflowWrap: 'anywhere',
  },
  closeButton: {
    flex: '0 0 auto',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
    border: 'none',
    borderRadius: 20,
    background: color.surfaceLow,
    color: color.onSurfaceVariant,
    cursor: 'pointer',
    transition: `background 300ms ${emphasized}, color 300ms ${emphasized}`,
  },
  body: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    gap: 20,
  },
  poster: {
    flex: '0 0 144px',
    width: 144,
    aspectRatio: '2 / 3',
    objectFit: 'cover',
    borderRadius: 16,
    background: color.surfaceLow,
  },
  posterPlaceholder: {
    flex: '0 0 144px',
    width: 144,
    aspectRatio: '2 / 3',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    background: color.surfaceLow,
    color: color.onSurfaceVariant,
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
    minWidth: 0,
    flex: '1 1 280px',
  },
  metadata: { display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8 },
  metadataItem: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    minHeight: 32,
    padding: '0 12px',
    borderRadius: 16,
    background: color.surfaceLow,
    color: color.onSurfaceVariant,
    fontSize: 13,
    fontWeight: 500,
  },
  genres: { display: 'flex', flexWrap: 'wrap', gap: 6 },
  genre: {
    padding: '4px 10px',
    borderRadius: 999,
    background: mix(12),
    color: color.primary,
    fontSize: 12,
    lineHeight: '18px',
  },
  synopsisSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    padding: 16,
    borderRadius: 16,
    background: color.surfaceLow,
  },
  synopsisTitle: {
    margin: 0,
    color: color.onSurfaceVariant,
    fontSize: 12,
    fontWeight: 600,
    letterSpacing: '0.5px',
    textTransform: 'uppercase',
  },
  synopsis: {
    margin: 0,
    color: color.onSurface,
    fontSize: 14,
    lineHeight: '22px',
    whiteSpace: 'pre-wrap',
    overflowWrap: 'anywhere',
  },
  footer: { display: 'flex', justifyContent: 'flex-end' },
  actionButton: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    minHeight: 44,
    padding: '0 20px',
    border: 'none',
    borderRadius: 22,
    background: color.primary,
    color: color.onPrimary,
    fontFamily: 'inherit',
    fontSize: 14,
    fontWeight: 600,
    letterSpacing: '0.1px',
    cursor: 'pointer',
    transition: `box-shadow 300ms ${emphasized}`,
  },
};

const MovieDetailsModal = ({ movie, onClose, onOpenReview }: MovieDetailsModalProps) => {
  const [visible, setVisible] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!movie) return;

    const frame = requestAnimationFrame(() => {
      setVisible(true);
      closeButtonRef.current?.focus();
    });
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', onKeyDown);
    return () => {
      cancelAnimationFrame(frame);
      setVisible(false);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [movie, onClose]);

  if (!movie) return null;

  const handleOpenReview = () => {
    onClose();
    onOpenReview(movie);
  };

  return (
    <div
      style={{ ...styles.scrim, ...(visible ? styles.scrimVisible : {}) }}
      onClick={onClose}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="movie-details-title"
        aria-describedby="movie-details-synopsis"
        style={{ ...styles.dialog, ...(visible ? styles.dialogVisible : {}) }}
        onClick={(event) => event.stopPropagation()}
      >
        <header style={styles.header}>
          <div style={styles.heading}>
            <p style={styles.overline}>Detalhes do título</p>
            <h2 id="movie-details-title" style={styles.title}>{movie.title}</h2>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            style={styles.closeButton}
            onClick={onClose}
            aria-label="Fechar detalhes"
          >
            <X size={20} />
          </button>
        </header>

        <div style={styles.body}>
          {movie.image ? (
            <img src={movie.image} alt={`Pôster de ${movie.title}`} style={styles.poster} />
          ) : (
            <div style={styles.posterPlaceholder} aria-hidden="true">
              <Film size={36} />
            </div>
          )}

          <div style={styles.content}>
            <div style={styles.metadata}>
              {movie.year != null && <span style={styles.metadataItem}>{movie.year}</span>}
              <span
                style={styles.metadataItem}
                aria-label={movie.rating != null ? `Nota ${movie.rating.toFixed(1)} de 10` : 'Sem nota'}
              >
                <Star
                  size={16}
                  fill={movie.rating != null ? '#FFD54F' : 'none'}
                  color={movie.rating != null ? '#FFD54F' : color.onSurfaceVariant}
                />
                {movie.rating != null ? `${movie.rating.toFixed(1)} / 10` : 'Sem nota'}
              </span>
            </div>

            <div style={styles.genres} aria-label="Gêneros">
              {movie.genres.length > 0 ? movie.genres.map((genre) => (
                <span key={genre} style={styles.genre}>{localizeMovieGenre(genre)}</span>
              )) : (
                <span style={styles.metadataItem}>Gêneros não informados</span>
              )}
            </div>

            <section style={styles.synopsisSection} aria-labelledby="movie-synopsis-title">
              <h3 id="movie-synopsis-title" style={styles.synopsisTitle}>Sinopse</h3>
              <p style={{ ...styles.synopsis, fontSize: 12, color: color.onSurfaceVariant }}>
                Texto exibido no idioma fornecido pela fonte de dados.
              </p>
              <p id="movie-details-synopsis" style={styles.synopsis}>
                {movie.summary?.trim() || 'Sinopse indisponível.'}
              </p>
            </section>
          </div>
        </div>

        <footer style={styles.footer}>
          <button type="button" style={styles.actionButton} onClick={handleOpenReview}>
            Avaliar e adicionar ao diário
          </button>
        </footer>
      </section>
    </div>
  );
};

export default MovieDetailsModal;
