import { useState, CSSProperties } from 'react';
import { Film, Clapperboard, BookmarkCheck } from 'lucide-react';

interface NavbarProps {
  activeTab: 'catalog' | 'mylist';
  setActiveTab: (tab: 'catalog' | 'mylist') => void;
  favoritesCount: number;
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
const primaryBorderSoft = mix(40);

// Superfícies "glass" sobre o fundo gradiente.
const glass = 'rgba(255, 255, 255, 0.08)';
const glassBorder = 'rgba(255, 255, 255, 0.12)';

// Mesmo gradiente do CatalogPage (fixed = os dois ficam emendados, sem faixa entre eles).
const background =
  'radial-gradient(80% 60% at 20% 0%, rgba(124, 77, 255, 0.35) 0%, transparent 70%), ' +
  'linear-gradient(160deg, #24104A 0%, #0F0620 45%, #000000 100%)';

// Easing "emphasized" do Material 3 (hover) e curva com leve overshoot (troca de aba).
const emphasized = 'cubic-bezier(0.2, 0, 0, 1)';
const spring = 'cubic-bezier(0.34, 1.56, 0.64, 1)';

const styles: Record<string, CSSProperties> = {
  header: {
    position: 'sticky',
    top: 0,
    zIndex: 20,
    padding: '12px 24px',
    background,
    backgroundAttachment: 'fixed',
    fontFamily: 'Roboto, "Google Sans", Arial, sans-serif',
    color: color.onSurface,
  },
  // Floating toolbar: barra em pílula que não vai de ponta a ponta.
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
    width: '100%',
    maxWidth: 1200,
    margin: '0 auto',
    boxSizing: 'border-box',
    padding: '8px 8px 8px 12px',
    borderRadius: 999,
    background: glass,
    border: `1px solid ${glassBorder}`,
    boxShadow: '0 0 0 0 transparent',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    transition: `border-color 400ms ${emphasized}, box-shadow 400ms ${emphasized}`,
  },
  toolbarHover: {
    borderColor: primaryBorderSoft,
    boxShadow: `0 0 28px 0 ${primaryGlow}`,
  },
  logo: { display: 'flex', alignItems: 'center', gap: 12 },
  logoIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
    borderRadius: 14,
    background: color.primaryContainer,
    color: color.onPrimaryContainer,
    boxShadow: '0 0 0 1px transparent, 0 0 0 0 transparent',
    transition: `box-shadow 400ms ${emphasized}, border-radius 400ms ${spring}`,
  },
  logoIconHover: {
    borderRadius: 20,
    boxShadow: `0 0 0 1px ${primaryRing}, 0 0 20px 2px ${primaryGlow}`,
  },
  logoText: { fontSize: 20, fontWeight: 400, letterSpacing: '-0.2px' },
  logoAccent: { fontWeight: 700, color: color.primary },
  // Button group: o selecionado vira pílula, os demais ficam retangulares arredondados.
  group: { display: 'flex', alignItems: 'center', gap: 4 },
  button: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    height: 44,
    padding: '0 18px',
    border: 'none',
    borderRadius: 16,
    background: 'transparent',
    color: color.onSurfaceVariant,
    fontFamily: 'inherit',
    fontSize: 14,
    fontWeight: 500,
    letterSpacing: '0.1px',
    cursor: 'pointer',
    boxShadow: '0 0 0 1px transparent, 0 0 0 0 transparent',
    transition: `background 300ms ${emphasized}, color 300ms ${emphasized}, box-shadow 400ms ${emphasized}, border-radius 350ms ${spring}`,
  },
  buttonHover: {
    background: primaryTint,
    color: color.primary,
    boxShadow: `0 0 0 1px ${primaryBorderSoft}, 0 0 0 0 transparent`,
  },
  buttonActive: {
    background: color.primary,
    color: color.onPrimary,
    borderRadius: 999,
    boxShadow: `0 0 0 1px transparent, 0 0 20px 0 ${primaryGlow}`,
  },
  badge: {
    minWidth: 22,
    height: 22,
    padding: '0 7px',
    boxSizing: 'border-box',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 11,
    background: color.primaryContainer,
    color: color.onPrimaryContainer,
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: '0.5px',
    transition: `background 300ms ${emphasized}, color 300ms ${emphasized}`,
  },
  badgeActive: { background: color.onPrimary, color: color.primary },
};

const Navbar = ({ activeTab, setActiveTab, favoritesCount }: NavbarProps) => {
  const [hovered, setHovered] = useState<'catalog' | 'mylist' | null>(null);
  const [toolbarHovered, setToolbarHovered] = useState(false);
  const [logoHovered, setLogoHovered] = useState(false);

  const buttonStyle = (tab: 'catalog' | 'mylist'): CSSProperties => ({
    ...styles.button,
    ...(hovered === tab && activeTab !== tab ? styles.buttonHover : {}),
    ...(activeTab === tab ? styles.buttonActive : {}),
  });

  return (
    <header style={styles.header}>
      <div
        style={{ ...styles.toolbar, ...(toolbarHovered ? styles.toolbarHover : {}) }}
        onMouseEnter={() => setToolbarHovered(true)}
        onMouseLeave={() => setToolbarHovered(false)}
      >
        <div
          style={styles.logo}
          onMouseEnter={() => setLogoHovered(true)}
          onMouseLeave={() => setLogoHovered(false)}
        >
          <span style={{ ...styles.logoIcon, ...(logoHovered ? styles.logoIconHover : {}) }}>
            <Film size={22} />
          </span>
          <span style={styles.logoText}>
            Cine<span style={styles.logoAccent}>Tech</span>
          </span>
        </div>

        <nav style={styles.group}>
          <button
            type="button"
            style={buttonStyle('catalog')}
            onClick={() => setActiveTab('catalog')}
            onMouseEnter={() => setHovered('catalog')}
            onMouseLeave={() => setHovered(null)}
          >
            <Clapperboard size={18} />
            Catálogo
          </button>

          <button
            type="button"
            style={buttonStyle('mylist')}
            onClick={() => setActiveTab('mylist')}
            onMouseEnter={() => setHovered('mylist')}
            onMouseLeave={() => setHovered(null)}
          >
            <BookmarkCheck size={18} />
            Minha Lista
            <span style={{ ...styles.badge, ...(activeTab === 'mylist' ? styles.badgeActive : {}) }}>
              {favoritesCount}
            </span>
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;