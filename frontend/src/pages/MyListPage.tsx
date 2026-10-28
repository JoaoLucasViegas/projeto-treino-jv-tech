import { useState, CSSProperties } from 'react';
import { Film, Star, Check, Clock, Trash2, BookmarkCheck } from 'lucide-react';
import { FavoriteItem } from '../types';

interface MyListPageProps {
  favorites: FavoriteItem[];
  onDelete: (id: number) => void;
}

// Tokens Material Design 3 (--md-sys-color-*). O fallback é o tema escuro baseline.
const token = (name: string, fallback: string) => `var(--md-sys-color-${name}, ${fallback})`;

const color = {
  onSurface: token('on-surface', '#E6E1E5'),
  onSurfaceVariant: token('on-surface-variant', '#CAC4D0'),
  primary: token('primary', '#D0BCFF'),
  onPrimaryContainer: token('on-primary-container', '#EADDFF'),
  primaryContainer: token('primary-container', '#4F378B'),
  error: token('error', '#F2B8B5'),
};

// Variações da cor primária e da cor de erro (acompanham o tema).
const mix = (base: string, percent: number) =>
  `color-mix(in srgb, ${base} ${percent}%, transparent)`;
const primaryRing = mix(color.primary, 60);
const primaryGlow = mix(color.primary, 25);
const primaryBorderSoft = mix(color.primary, 40);
const errorTint = mix(color.error, 14);
const errorTintStrong = mix(color.error, 24);
const errorBorderSoft = mix(color.error, 40);

const glass = 'rgba(255, 255, 255, 0.08)';
const outline = 'rgba(255, 255, 255, 0.18)';
const starActive = '#FFD54F';
const starInactive = 'rgba(255, 255, 255, 0.28)';

// Fundo gradiente: preto com roxo. Mesmo gradiente do Navbar e do CatalogPage.
const background =
  'radial-gradient(80% 60% at 20% 0%, rgba(124, 77, 255, 0.35) 0%, transparent 70%), ' +
  'linear-gradient(160deg, #24104A 0%, #0F0620 45%, #000000 100%)';

// Easing "emphasized" do Material 3 (hover).
const emphasized = 'cubic-bezier(0.2, 0, 0, 1)';

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
  container: { width: '100%', maxWidth: 1200, margin: '0 auto' },
  header: {
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
    maxWidth: 640,
    margin: '0 auto 40px',
    textAlign: 'center',
  },
  pageTitle: { margin: 0, fontSize: 28, fontWeight: 600, letterSpacing: '-0.2px' },
  pageSubtitle: { margin: 0, fontSize: 14, color: color.onSurfaceVariant },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, 200px)',
    justifyContent: 'center',
    alignItems: 'stretch',
    gap: 28,
  },
  empty: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 12,
    padding: '48px 24px',
    textAlign: 'center',
    color: color.onSurfaceVariant,
    fontSize: 14,
  },
  emptyIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 72,
    height: 72,
    borderRadius: 24,
    background: glass,
    color: color.primary,
  },
  emptyTitle: { margin: 0, fontSize: 18, fontWeight: 600, color: color.onSurface },
  card: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    width: 200,
    alignSelf: 'stretch',
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
  overlay: {
    position: 'absolute',
    inset: 0,
    background: `linear-gradient(to top, color-mix(in srgb, ${color.primaryContainer} 85%, transparent) 0%, transparent 50%)`,
    opacity: 0,
    transition: `opacity 450ms ${emphasized}`,
    pointerEvents: 'none',
  },
  overlayHover: { opacity: 1 },
  info: { display: 'flex', flexDirection: 'column', gap: 8, flex: 1 },
  title: {
    margin: 0,
    fontSize: 15,
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
  stars: { display: 'flex', alignItems: 'center', gap: 2 },
  noRating: { fontSize: 12, color: color.onSurfaceVariant },
  statusChip: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    padding: '3px 10px',
    borderRadius: 999,
    fontSize: 11,
    fontWeight: 500,
    letterSpacing: '0.5px',
  },
  statusWatched: { background: color.primaryContainer, color: color.onPrimaryContainer },
  statusWant: { border: `1px solid ${outline}`, color: color.onSurfaceVariant },
  notes: {
    margin: 0,
    fontSize: 12,
    lineHeight: '18px',
    color: color.onSurfaceVariant,
    display: '-webkit-box',
    WebkitLineClamp: 3,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
  deleteButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 40,
    padding: '0 14px',
    border: '1px solid transparent',
    borderRadius: 20,
    background: 'transparent',
    color: color.onSurfaceVariant,
    fontFamily: 'inherit',
    fontSize: 12,
    fontWeight: 600,
    letterSpacing: '0.1px',
    cursor: 'pointer',
    transition: `background 300ms ${emphasized}, border-color 300ms ${emphasized}, color 300ms ${emphasized}`,
  },
  // Card em hover: o botão ganha a borda de erro suave...
  deleteButtonCardHover: { borderColor: errorBorderSoft, color: color.error },
  // ...e o hover no próprio botão o preenche com a tinta de erro.
  deleteButtonHover: { background: errorTintStrong, borderColor: color.error, color: color.error },
};

interface FavoriteCardProps {
  item: FavoriteItem;
  onDelete: (id: number) => void;
}

const FavoriteCard = ({ item, onDelete }: FavoriteCardProps) => {
  const [hovered, setHovered] = useState(false);
  const [deleteHovered, setDeleteHovered] = useState(false);

  const watched = item.status === 'assistido';

  return (
    <article
      style={styles.card}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        setDeleteHovered(false);
      }}
    >
      <div style={{ ...styles.imageWrapper, ...(hovered ? styles.imageWrapperHover : {}) }}>
        {item.poster_url ? (
          <img src={item.poster_url} alt={`Pôster de ${item.title}`} style={styles.image} />
        ) : (
          <div style={styles.placeholder}>
            <Film size={36} />
          </div>
        )}
        <div style={{ ...styles.overlay, ...(hovered ? styles.overlayHover : {}) }} />
      </div>

      <div style={styles.info}>
        <h3
          style={{ ...styles.title, ...(hovered ? styles.titleHover : {}) }}
          title={item.title}
        >
          {item.title}
        </h3>

        {item.user_rating > 0 ? (
          <div style={styles.stars} aria-label={`Nota ${item.user_rating} de 5`}>
            {[1, 2, 3, 4, 5].map((value) => (
              <Star
                key={value}
                size={16}
                color={value <= item.user_rating ? starActive : starInactive}
                fill={value <= item.user_rating ? starActive : 'none'}
              />
            ))}
          </div>
        ) : (
          <span style={styles.noRating}>Sem nota</span>
        )}

        <span
          style={{ ...styles.statusChip, ...(watched ? styles.statusWatched : styles.statusWant) }}
        >
          {watched ? <Check size={12} /> : <Clock size={12} />}
          {watched ? 'Já Assistido' : 'Quero Assistir'}
        </span>

        {item.notes && <p style={styles.notes}>{item.notes}</p>}
      </div>

      <button
        type="button"
        style={{
          ...styles.deleteButton,
          ...(hovered ? styles.deleteButtonCardHover : {}),
          ...(deleteHovered ? styles.deleteButtonHover : {}),
        }}
        onClick={() => onDelete(item.id)}
        onMouseEnter={() => setDeleteHovered(true)}
        onMouseLeave={() => setDeleteHovered(false)}
      >
        <Trash2 size={16} />
        Excluir
      </button>
    </article>
  );
};

const MyListPage = ({ favorites, onDelete }: MyListPageProps) => {
  return (
    <main style={styles.page}>
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.pageTitle}>Minha Lista</h1>
          <p style={styles.pageSubtitle}>
            {favorites.length === 1 ? '1 título salvo' : `${favorites.length} títulos salvos`}
          </p>
        </div>

        {favorites.length === 0 ? (
          <div style={styles.empty}>
            <span style={styles.emptyIcon}>
              <BookmarkCheck size={32} />
            </span>
            <h2 style={styles.emptyTitle}>Sua lista está vazia</h2>
            <span>Adicione filmes pelo catálogo para vê-los aqui.</span>
          </div>
        ) : (
          <section style={styles.grid}>
            {favorites.map((item) => (
              <FavoriteCard key={item.id} item={item} onDelete={onDelete} />
            ))}
          </section>
        )}
      </div>
    </main>
  );
};

export default MyListPage;