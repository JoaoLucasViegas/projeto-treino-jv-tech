import { useState, CSSProperties } from 'react';
import { Star, PlusCircle, Check, Film, ChevronRight } from 'lucide-react';
import { Movie } from '../types';
import { localizeMovieGenre } from '../utils/movieGenres';

interface MovieCardProps {
  movie: Movie;
  onOpenDetails: (movie: Movie) => void;
  onOpenReview: (movie: Movie) => void;
  isFavorited: boolean;
}

// Tokens Material Design 3 (--md-sys-color-*). O fallback é o tema escuro baseline.
// Para trocar o tema, defina essas variáveis no :root, sem mexer no componente.
const token = (name: string, fallback: string) => `var(--md-sys-color-${name}, ${fallback})`;

const color = {
  onSurface: token('on-surface', '#E6E1E5'),
  onSurfaceVariant: token('on-surface-variant', '#CAC4D0'),
  primary: token('primary', '#D0BCFF'),
  onPrimary: token('on-primary', '#381E72'),
  primaryContainer: token('primary-container', '#4F378B'),
  onPrimaryContainer: token('on-primary-container', '#EADDFF'),
};

// Variações da cor primária (acompanham o tema): anel, brilho e tinta de fundo.
const mix = (percent: number) => `color-mix(in srgb, ${color.primary} ${percent}%, transparent)`;
const primaryRing = mix(60);
const primaryGlow = mix(25);
const primaryTint = mix(14);
const primaryTintStrong = mix(26);
const primaryBorderSoft = mix(40);

const glass = 'rgba(255, 255, 255, 0.08)';
const outline = 'rgba(255, 255, 255, 0.18)';

// Easing "emphasized" do Material 3: entra rápido e assenta devagar. Mais elegante que overshoot.
const emphasized = 'cubic-bezier(0.2, 0, 0, 1)';

const styles: Record<string, CSSProperties> = {
  card: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    width: 160,
    alignSelf: 'stretch',
    fontFamily: 'Roboto, "Google Sans", Arial, sans-serif',
    color: color.onSurface,
  },
  imageWrapper: {
    position: 'relative',
    width: '100%',
    aspectRatio: '2 / 3',
    borderRadius: 20,
    overflow: 'hidden',
    background: glass,
    transform: 'translateY(0) scale(1)',
    boxShadow:
      '0 0 0 1px transparent, 0 0 0 0 transparent, 0 4px 12px rgba(0, 0, 0, 0.35)',
    transition: `transform 450ms ${emphasized}, box-shadow 450ms ${emphasized}`,
  },
  imageWrapperHover: {
    transform: 'translateY(-4px) scale(1.025)',
    boxShadow: `0 0 0 1px ${primaryRing}, 0 0 32px 2px ${primaryGlow}, 0 20px 40px rgba(0, 0, 0, 0.55)`,
  },
  image: { width: '100%', height: '100%', objectFit: 'cover', display: 'block' },
  placeholder: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: color.onSurfaceVariant,
  },
  // Véu roxo discreto que sobe da base do pôster no hover
  overlay: {
    position: 'absolute',
    inset: 0,
    background: `linear-gradient(to top, color-mix(in srgb, ${color.primaryContainer} 85%, transparent) 0%, transparent 50%)`,
    opacity: 0,
    transition: `opacity 450ms ${emphasized}`,
    pointerEvents: 'none',
  },
  overlayHover: { opacity: 1 },
  ratingBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    display: 'flex',
    alignItems: 'center',
    gap: 3,
    padding: '3px 9px',
    borderRadius: 999,
    background: 'rgba(0, 0, 0, 0.55)',
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 600,
  },
  info: { display: 'flex', flexDirection: 'column', gap: 8, flex: 1 },
  titleRow: { display: 'flex', alignItems: 'baseline', gap: 6, minWidth: 0 },
  title: {
    margin: 0,
    fontSize: 14,
    fontWeight: 600,
    lineHeight: '20px',
    letterSpacing: '0.1px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    color: color.onSurface,
    transition: `color 300ms ${emphasized}`,
  },
  titleHover: { color: color.primary },
  year: {
    flexShrink: 0,
    color: color.onSurfaceVariant,
    fontSize: 12,
    lineHeight: '20px',
  },
  summary: {
    margin: 0,
    color: color.onSurfaceVariant,
    fontSize: 12,
    lineHeight: '17px',
    display: '-webkit-box',
    WebkitBoxOrient: 'vertical',
    WebkitLineClamp: 3,
    overflow: 'hidden',
  },
  detailsButton: {
    display: 'inline-flex',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 2,
    minHeight: 32,
    padding: '0 8px',
    marginLeft: -8,
    border: 'none',
    borderRadius: 16,
    background: 'transparent',
    color: color.primary,
    fontFamily: 'inherit',
    fontSize: 12,
    fontWeight: 600,
    cursor: 'pointer',
    marginTop: 'auto',
    transition: `background 300ms ${emphasized}`,
  },
  detailsButtonHover: { background: primaryTint },
  genres: {
    display: 'flex',
    flexWrap: 'nowrap',
    alignItems: 'center',
    gap: 6,
    minWidth: 0,
    flex: '0 0 24px',
    overflow: 'hidden',
  },
  genreTag: {
    flex: '0 1 auto',
    minWidth: 0,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    padding: '2px 10px',
    borderRadius: 999,
    border: `1px solid ${outline}`,
    color: color.onSurfaceVariant,
    fontSize: 11,
    lineHeight: '16px',
    letterSpacing: '0.5px',
    transition: `border-color 300ms ${emphasized}, color 300ms ${emphasized}`,
  },
  moreGenres: {
    flex: '0 0 auto',
    color: color.onSurfaceVariant,
    fontSize: 10,
    lineHeight: '16px',
    whiteSpace: 'nowrap',
  },
  genreTagHover: { border: `1px solid ${primaryBorderSoft}`, color: color.onSurface },
  button: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 40,
    padding: '0 14px',
    border: '1px solid transparent',
    borderRadius: 20,
    background: color.primaryContainer,
    color: color.onPrimaryContainer,
    fontFamily: 'inherit',
    fontSize: 12,
    fontWeight: 600,
    letterSpacing: '0.1px',
    cursor: 'pointer',
    transition: `background 300ms ${emphasized}, color 300ms ${emphasized}, border-color 300ms ${emphasized}`,
  },
  // Card em hover: o botão ganha uma tinta primária suave...
  buttonCardHover: { background: primaryTint, border: `1px solid ${primaryRing}`, color: color.primary },
  // ...e só o hover no próprio botão o preenche por completo.
  buttonHover: { background: color.primary, border: `1px solid ${color.primary}`, color: color.onPrimary },
  buttonFavorited: {
    background: 'transparent',
    border: `1px solid ${color.primary}`,
    color: color.primary,
  },
  buttonFavoritedCardHover: { background: primaryTint },
  buttonFavoritedHover: { background: primaryTintStrong },
};

const MovieCard = ({ movie, onOpenDetails, onOpenReview, isFavorited }: MovieCardProps) => {
  const [hovered, setHovered] = useState(false);
  const [buttonHovered, setButtonHovered] = useState(false);
  const [detailsHovered, setDetailsHovered] = useState(false);

  const buttonStyle: CSSProperties = {
    ...styles.button,
    ...(isFavorited ? styles.buttonFavorited : {}),
    ...(hovered
      ? isFavorited
        ? styles.buttonFavoritedCardHover
        : styles.buttonCardHover
      : {}),
    ...(buttonHovered
      ? isFavorited
        ? styles.buttonFavoritedHover
        : styles.buttonHover
      : {}),
  };

  return (
    <article
      style={styles.card}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        setButtonHovered(false);
      }}
    >
      <div style={{ ...styles.imageWrapper, ...(hovered ? styles.imageWrapperHover : {}) }}>
        {movie.image ? (
          <img src={movie.image} alt={`Pôster de ${movie.title}`} style={styles.image} />
        ) : (
          <div style={styles.placeholder}>
            <Film size={36} />
          </div>
        )}

        <div style={{ ...styles.overlay, ...(hovered ? styles.overlayHover : {}) }} />

        {movie.rating != null && (
          <div style={styles.ratingBadge}>
            <Star size={12} fill="#FFD54F" color="#FFD54F" />
            {movie.rating.toFixed(1)}
          </div>
        )}
      </div>

      <div style={styles.info}>
        <div style={styles.titleRow}>
          <h3
            style={{ ...styles.title, ...(hovered ? styles.titleHover : {}) }}
            title={movie.title}
          >
            {movie.title}
          </h3>
          {movie.year != null && <span style={styles.year}>{movie.year}</span>}
        </div>

        <p style={styles.summary} title={movie.summary || undefined}>
          {movie.summary?.trim() || 'Sinopse indisponível.'}
        </p>

        <div
          style={styles.genres}
          aria-label={
            movie.genres.length
              ? `Gêneros: ${movie.genres.map(localizeMovieGenre).join(', ')}`
              : 'Gêneros não informados'
          }
        >
          {movie.genres.slice(0, 1).map((genre) => (
            <span
              key={genre}
              style={{ ...styles.genreTag, ...(hovered ? styles.genreTagHover : {}) }}
              title={genre}
            >
              {localizeMovieGenre(genre)}
            </span>
          ))}
          {movie.genres.length > 1 && (
            <span style={styles.moreGenres}>+{movie.genres.length - 1}</span>
          )}
          {movie.genres.length === 0 && (
            <span style={styles.moreGenres}>Gêneros não informados</span>
          )}
        </div>

        <button
          type="button"
          style={{ ...styles.detailsButton, ...(detailsHovered ? styles.detailsButtonHover : {}) }}
          onClick={() => onOpenDetails(movie)}
          onMouseEnter={() => setDetailsHovered(true)}
          onMouseLeave={() => setDetailsHovered(false)}
          aria-label={`Ver detalhes completos de ${movie.title}`}
        >
          Ver detalhes
          <ChevronRight size={16} />
        </button>
      </div>

      <button
        type="button"
        style={buttonStyle}
        onClick={() => onOpenReview(movie)}
        onMouseEnter={() => setButtonHovered(true)}
        onMouseLeave={() => setButtonHovered(false)}
      >
        {isFavorited ? <Check size={16} /> : <PlusCircle size={16} />}
        {isFavorited ? 'No Diário' : 'Adicionar ao Diário'}
      </button>
    </article>
  );
};

export default MovieCard;