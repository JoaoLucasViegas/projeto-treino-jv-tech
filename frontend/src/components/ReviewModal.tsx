import { useEffect, useState, CSSProperties } from 'react';
import { Film, Star } from 'lucide-react';
import { Movie, FavoriteStatus, CreateFavoritePayload } from '../types';
import { localizeMovieGenre } from '../utils/movieGenres';

interface ReviewModalProps {
  // O modal abre quando há um filme selecionado e fecha quando é null.
  movie: Movie | null;
  onClose: () => void;
  onSave: (payload: CreateFavoritePayload) => void;
}

// Tokens Material Design 3 (--md-sys-color-*). O fallback é o tema escuro baseline.
const token = (name: string, fallback: string) => `var(--md-sys-color-${name}, ${fallback})`;

const color = {
  surfaceContainerHigh: token('surface-container-high', '#241B38'),
  onSurface: token('on-surface', '#E6E1E5'),
  onSurfaceVariant: token('on-surface-variant', '#CAC4D0'),
  primary: token('primary', '#D0BCFF'),
  onPrimary: token('on-primary', '#381E72'),
};

// Variações da cor primária (acompanham o tema): anel, brilho e tinta de fundo.
const mix = (percent: number) => `color-mix(in srgb, ${color.primary} ${percent}%, transparent)`;
const primaryRing = mix(60);
const primaryGlow = mix(25);
const primaryTint = mix(12);
const primaryBorderSoft = mix(40);

const glass = 'rgba(255, 255, 255, 0.06)';
const glassBorder = 'rgba(255, 255, 255, 0.14)';
const starActive = '#FFD54F';
const starInactive = 'rgba(255, 255, 255, 0.28)';

// Easing "emphasized" do Material 3 (hover) e curva com leve overshoot (clique).
const emphasized = 'cubic-bezier(0.2, 0, 0, 1)';
const spring = 'cubic-bezier(0.34, 1.56, 0.64, 1)';

const fieldBase: CSSProperties = {
  width: '100%',
  boxSizing: 'border-box',
  padding: '12px 16px',
  borderRadius: 16,
  background: glass,
  border: `1px solid ${glassBorder}`,
  color: color.onSurface,
  fontFamily: 'inherit',
  fontSize: 14,
  outline: 'none',
  colorScheme: 'dark',
  transition: `border-color 300ms ${emphasized}, box-shadow 300ms ${emphasized}, background 300ms ${emphasized}`,
};

const fieldFocused: CSSProperties = {
  background: primaryTint,
  border: `1px solid ${primaryRing}`,
  boxShadow: `0 0 0 4px ${mix(18)}`,
};

const styles: Record<string, CSSProperties> = {
  scrim: {
    position: 'fixed',
    inset: 0,
    zIndex: 100,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
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
    gap: 16,
    width: '100%',
    maxWidth: 560,
    maxHeight: '90vh',
    boxSizing: 'border-box',
    padding: 24,
    borderRadius: 28,
    background: color.surfaceContainerHigh,
    border: `1px solid ${glassBorder}`,
    boxShadow: `0 24px 60px rgba(0, 0, 0, 0.6), 0 0 40px 0 ${primaryGlow}`,
    fontFamily: 'Roboto, "Google Sans", Arial, sans-serif',
    color: color.onSurface,
    transform: 'translateY(16px) scale(0.96)',
    transition: `transform 450ms ${spring}`,
    overflowY: 'auto',
  },
  dialogVisible: { transform: 'translateY(0) scale(1)' },
  header: { display: 'flex', flexDirection: 'column', gap: 4 },
  overline: {
    margin: 0,
    fontSize: 12,
    fontWeight: 500,
    letterSpacing: '0.5px',
    color: color.primary,
  },
  title: { margin: 0, fontSize: 22, fontWeight: 600, lineHeight: '28px' },
  movieDetails: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 12,
    padding: 12,
    borderRadius: 16,
    background: token('surface-container-low', 'rgba(255, 255, 255, 0.04)'),
  },
  moviePoster: {
    flex: '0 0 72px',
    width: 72,
    aspectRatio: '2 / 3',
    objectFit: 'cover',
    borderRadius: 8,
    background: glass,
  },
  posterPlaceholder: {
    flex: '0 0 72px',
    width: 72,
    aspectRatio: '2 / 3',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    background: glass,
    color: color.onSurfaceVariant,
  },
  movieDescription: { display: 'flex', flexDirection: 'column', gap: 8, minWidth: 0 },
  movieRating: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    color: color.onSurface,
    fontSize: 12,
    fontWeight: 600,
  },
  movieGenres: { color: color.onSurfaceVariant, fontSize: 11 },
  synopsisLabel: {
    margin: '4px 0 0',
    color: color.onSurfaceVariant,
    fontSize: 12,
    fontWeight: 600,
    letterSpacing: '0.5px',
    textTransform: 'uppercase',
  },
  synopsis: { margin: 0, color: color.onSurfaceVariant, fontSize: 13, lineHeight: '18px' },
  field: { display: 'flex', flexDirection: 'column', gap: 8 },
  label: {
    fontSize: 12,
    fontWeight: 500,
    letterSpacing: '0.5px',
    color: color.onSurfaceVariant,
  },
  stars: { display: 'flex', alignItems: 'center', gap: 4 },
  starButton: {
    display: 'flex',
    padding: 4,
    border: 'none',
    borderRadius: 12,
    background: 'transparent',
    cursor: 'pointer',
    transform: 'scale(1)',
    transition: `transform 300ms ${spring}, background 300ms ${emphasized}`,
  },
  starButtonHover: { transform: 'scale(1.18)', background: primaryTint },
  ratingText: { marginLeft: 8, fontSize: 13, color: color.onSurfaceVariant },
  select: { ...fieldBase, cursor: 'pointer' },
  textarea: { ...fieldBase, minHeight: 100, resize: 'vertical', lineHeight: '20px' },
  actions: { display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 4 },
  cancelButton: {
    height: 44,
    padding: '0 20px',
    border: '1px solid transparent',
    borderRadius: 22,
    background: 'transparent',
    color: color.primary,
    fontFamily: 'inherit',
    fontSize: 14,
    fontWeight: 600,
    letterSpacing: '0.1px',
    cursor: 'pointer',
    transition: `background 300ms ${emphasized}, border-color 300ms ${emphasized}`,
  },
  cancelButtonHover: { background: primaryTint, border: `1px solid ${primaryBorderSoft}` },
  saveButton: {
    height: 44,
    padding: '0 24px',
    border: 'none',
    borderRadius: 22,
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
  saveButtonHover: { boxShadow: `0 0 24px 2px ${mix(45)}` },
  saveButtonPressed: { transform: 'scale(0.96)' },
};

const ratingLabels = ['Sem nota', 'Ruim', 'Regular', 'Bom', 'Muito bom', 'Excelente'];

const ReviewModal = ({ movie, onClose, onSave }: ReviewModalProps) => {
  const [rating, setRating] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [status, setStatus] = useState<FavoriteStatus>('assistido');
  const [notes, setNotes] = useState('');
  const [focusedField, setFocusedField] = useState<'status' | 'notes' | null>(null);
  const [hoveredButton, setHoveredButton] = useState<'cancel' | 'save' | null>(null);
  const [savePressed, setSavePressed] = useState(false);
  const [visible, setVisible] = useState(false);

  // A cada novo filme selecionado: limpa o formulário e dispara a animação de entrada.
  useEffect(() => {
    if (!movie) return;
    setRating(0);
    setHoveredStar(0);
    setStatus('assistido');
    setNotes('');
    const frame = requestAnimationFrame(() => setVisible(true));
    return () => {
      cancelAnimationFrame(frame);
      setVisible(false);
    };
  }, [movie]);

  // Fecha com a tecla Esc
  useEffect(() => {
    if (!movie) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [movie, onClose]);

  if (!movie) return null;

  const handleSave = () => {
    onSave({
      movie_id: movie.id,
      title: movie.title,
      poster_url: movie.image ?? '',
      user_rating: rating,
      status,
      notes: notes.trim() || undefined,
    });
  };

  const shownRating = hoveredStar || rating;

  return (
    <div
      style={{ ...styles.scrim, ...(visible ? styles.scrimVisible : {}) }}
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`Salvar ${movie.title}`}
        style={{ ...styles.dialog, ...(visible ? styles.dialogVisible : {}) }}
        onClick={(event) => event.stopPropagation()}
      >
        <div style={styles.header}>
          <p style={styles.overline}>Adicionar ao Diário</p>
          <h2 style={styles.title}>{movie.title}</h2>
        </div>

        <section style={styles.movieDetails} aria-label={`Detalhes de ${movie.title}`}>
          {movie.image ? (
            <img src={movie.image} alt={`Pôster de ${movie.title}`} style={styles.moviePoster} />
          ) : (
            <div style={styles.posterPlaceholder} aria-hidden="true">
              <Film size={28} />
            </div>
          )}
          <div style={styles.movieDescription}>
            <div style={styles.movieRating} aria-label={
              movie.rating != null ? `Nota do catálogo: ${movie.rating.toFixed(1)} de 10` : 'Filme sem nota no catálogo'
            }>
              <Star size={16} fill={starActive} color={starActive} aria-hidden="true" />
              {movie.rating != null ? `${movie.rating.toFixed(1)} / 10 no catálogo` : 'Sem nota no catálogo'}
            </div>
            <span style={styles.movieGenres}>
              {movie.genres.length > 0
                ? movie.genres.map(localizeMovieGenre).join(' · ')
                : 'Gêneros não informados'}
            </span>
            <p style={styles.synopsisLabel}>Sinopse</p>
            <p style={styles.synopsis}>{movie.summary?.trim() || 'Sinopse indisponível.'}</p>
          </div>
        </section>

        <div style={styles.field}>
          <span style={styles.label}>Sua nota</span>
          <div style={styles.stars} onMouseLeave={() => setHoveredStar(0)}>
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                type="button"
                aria-label={`${value} ${value === 1 ? 'estrela' : 'estrelas'}`}
                aria-pressed={rating === value}
                style={{
                  ...styles.starButton,
                  ...(hoveredStar === value ? styles.starButtonHover : {}),
                }}
                onClick={() => setRating(value)}
                onMouseEnter={() => setHoveredStar(value)}
              >
                <Star
                  size={30}
                  color={value <= shownRating ? starActive : starInactive}
                  fill={value <= shownRating ? starActive : 'none'}
                />
              </button>
            ))}
            <span style={styles.ratingText}>{ratingLabels[shownRating]}</span>
          </div>
        </div>

        <div style={styles.field}>
          <label style={styles.label} htmlFor="review-status">
            Status
          </label>
          <select
            id="review-status"
            value={status}
            onChange={(event) => setStatus(event.target.value as FavoriteStatus)}
            onFocus={() => setFocusedField('status')}
            onBlur={() => setFocusedField(null)}
            style={{ ...styles.select, ...(focusedField === 'status' ? fieldFocused : {}) }}
          >
            <option value="assistido">Já Assistido</option>
            <option value="quero_assistir">Quero Assistir</option>
          </select>
        </div>

        <div style={styles.field}>
          <label style={styles.label} htmlFor="review-notes">
            Resenha pessoal
          </label>
          <textarea
            id="review-notes"
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            onFocus={() => setFocusedField('notes')}
            onBlur={() => setFocusedField(null)}
            placeholder="O que você achou?"
            style={{ ...styles.textarea, ...(focusedField === 'notes' ? fieldFocused : {}) }}
          />
        </div>

        <div style={styles.actions}>
          <button
            type="button"
            style={{
              ...styles.cancelButton,
              ...(hoveredButton === 'cancel' ? styles.cancelButtonHover : {}),
            }}
            onClick={onClose}
            onMouseEnter={() => setHoveredButton('cancel')}
            onMouseLeave={() => setHoveredButton(null)}
          >
            Cancelar
          </button>
          <button
            type="button"
            style={{
              ...styles.saveButton,
              ...(hoveredButton === 'save' ? styles.saveButtonHover : {}),
              ...(savePressed ? styles.saveButtonPressed : {}),
            }}
            onClick={handleSave}
            onMouseEnter={() => setHoveredButton('save')}
            onMouseLeave={() => {
              setHoveredButton(null);
              setSavePressed(false);
            }}
            onMouseDown={() => setSavePressed(true)}
            onMouseUp={() => setSavePressed(false)}
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;