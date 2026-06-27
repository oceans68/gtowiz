/**
 * GTO Drill Coach — Shared UI Components (Static Bundle)
 * JSX via Babel standalone. Plain-JS port of components/ui + layout/AppShell.
 */
const { cn, getSourceLabel, getSourceColor, getLevelTitle, getLevelProgress, getXPForNextLevel } = window.GTOUtils;

// ── Card ───────────────────────────────────────────────────────────────────

function Card({ hover, className, children, ...props }) {
  return (
    <div className={cn(hover ? 'glass-card-hover' : 'glass-card', 'p-4', className)} {...props}>
      {children}
    </div>
  );
}

// ── Button ─────────────────────────────────────────────────────────────────

const buttonVariants = {
  primary: 'bg-teal-500 hover:bg-teal-400 text-white',
  secondary: 'bg-navy-700 hover:bg-navy-600 text-slate-200 border border-white/10',
  ghost: 'bg-transparent hover:bg-white/5 text-slate-400 hover:text-slate-200',
  danger: 'bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/20',
  gold: 'bg-gold-400/20 hover:bg-gold-400/30 text-gold-400 border border-gold-400/20',
};

const buttonSizes = {
  sm: 'px-3 py-1.5 text-sm rounded-lg',
  md: 'px-4 py-2.5 text-sm rounded-lg',
  lg: 'px-5 py-3 text-base rounded-xl',
};

function Button({ variant = 'primary', size = 'md', fullWidth, className, children, ...props }) {
  return (
    <button
      className={cn(
        'action-btn font-display font-semibold transition-all',
        buttonVariants[variant],
        buttonSizes[size],
        fullWidth && 'w-full',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

// ── ProgressBar ────────────────────────────────────────────────────────────

function ProgressBar({ value, variant = 'teal', className }) {
  return (
    <div className={cn('progress-bar', className)}>
      <div
        className={cn(
          'progress-bar-fill',
          variant === 'gold' && 'progress-bar-fill-gold',
          variant === 'green' && 'progress-bar-fill-green'
        )}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}

// ── Badge ──────────────────────────────────────────────────────────────────

const badgeVariants = {
  default: 'bg-white/8 text-slate-400',
  teal: 'bg-teal-400/15 text-teal-400',
  gold: 'bg-gold-400/15 text-gold-400',
  green: 'bg-gto-green/15 text-gto-green',
  red: 'bg-gto-red/15 text-gto-red',
  purple: 'bg-purple-400/15 text-purple-400',
};

function Badge({ variant = 'default', className, children }) {
  return <span className={cn('source-badge', badgeVariants[variant], className)}>{children}</span>;
}

// ── SourceLabel ────────────────────────────────────────────────────────────

function SourceLabel({ sourceType }) {
  return (
    <span className={cn('source-badge', getSourceColor(sourceType))}>
      {getSourceLabel(sourceType)}
    </span>
  );
}

// ── StatCard ───────────────────────────────────────────────────────────────

const statColors = {
  teal: 'text-teal-400',
  gold: 'text-gold-400',
  green: 'text-gto-green',
  red: 'text-gto-red',
  default: 'text-slate-200',
};

function StatCard({ label, value, sub, color = 'default', className }) {
  return (
    <Card className={cn('flex flex-col gap-1', className)}>
      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-500 font-display font-medium uppercase tracking-wider">{label}</span>
      </div>
      <div className={cn('text-2xl font-display font-bold', statColors[color])}>{value}</div>
      {sub && <div className="text-xs text-slate-500">{sub}</div>}
    </Card>
  );
}

// ── EmptyState ─────────────────────────────────────────────────────────────

function EmptyState({ icon = '🃏', title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="font-display font-semibold text-slate-200 text-lg mb-2">{title}</h3>
      {description && <p className="text-slate-500 text-sm max-w-xs">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

// ── Spinner ────────────────────────────────────────────────────────────────

function Spinner({ size = 'md' }) {
  const sizes = { sm: 'w-4 h-4', md: 'w-6 h-6', lg: 'w-8 h-8' };
  return <div className={cn('border-2 border-teal-400/20 border-t-teal-400 rounded-full animate-spin', sizes[size])} />;
}

// ── PlayingCard ────────────────────────────────────────────────────────────

function PlayingCard({ card, size = 'md' }) {
  if (!card || card.length < 2) return null;
  const rank = card.slice(0, -1).toUpperCase();
  const suit = card.slice(-1).toLowerCase();
  const suitSymbols = { s: '♠', h: '♥', d: '♦', c: '♣' };
  const isRed = suit === 'h' || suit === 'd';
  const symbol = suitSymbols[suit] ?? suit;
  const sizeClass = size === 'lg' ? 'playing-card playing-card-lg' : 'playing-card';

  return (
    <div className={sizeClass}>
      <span className={cn('flex flex-col items-center leading-none', isRed ? 'text-red-400' : 'text-slate-200')}>
        <span>{rank}</span>
        <span style={{ fontSize: '0.65em' }}>{symbol}</span>
      </span>
    </div>
  );
}

// ── Icons (inline SVG) ────────────────────────────────────────────────────

function HomeIcon({ active }) {
  return (
    <svg viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={2}>
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}
function DrillIcon({ active }) {
  return (
    <svg viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={2}>
      <circle cx={12} cy={12} r={10} />
      <polygon points="10 8 16 12 10 16 10 8" fill={active ? '#0d1117' : 'currentColor'} />
    </svg>
  );
}
function MissionIcon({ active }) {
  return (
    <svg viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={2}>
      <path d="M9 11l3 3L22 4" />
      <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
    </svg>
  );
}
function ProgressIcon({ active }) {
  return (
    <svg viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={2}>
      <line x1={18} y1={20} x2={18} y2={10} />
      <line x1={12} y1={20} x2={12} y2={4} />
      <line x1={6} y1={20} x2={6} y2={14} />
    </svg>
  );
}
function ReviewIcon({ active }) {
  return (
    <svg viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={2}>
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1={16} y1={13} x2={8} y2={13} />
      <line x1={16} y1={17} x2={8} y2={17} />
    </svg>
  );
}

// ── Navigation config ────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { route: 'dashboard', label: 'Home', Icon: HomeIcon },
  { route: 'preflop', label: 'Drill', Icon: DrillIcon },
  { route: 'missions', label: 'Missions', Icon: MissionIcon },
  { route: 'progress', label: 'Progress', Icon: ProgressIcon },
  { route: 'review', label: 'Review', Icon: ReviewIcon },
];

// ── BottomNav (mobile) ────────────────────────────────────────────────────

function BottomNav({ route, navigate }) {
  return (
    <nav className="bottom-nav">
      {NAV_ITEMS.map(({ route: r, label, Icon }) => {
        const active = route === r || (r === 'preflop' && (route === 'postflop' || route === 'plo'));
        return (
          <a
            key={r}
            href={`#/${r}`}
            onClick={(e) => { e.preventDefault(); navigate(r); }}
            className={cn('bottom-nav-item', active && 'active')}
          >
            <Icon active={active} />
            {label}
          </a>
        );
      })}
    </nav>
  );
}

// ── Sidebar (desktop) ─────────────────────────────────────────────────────

function Sidebar({ route, navigate }) {
  const { profile } = window.GTOStore.useAppStore();
  const progressPct = getLevelProgress(profile.xp, profile.level);

  return (
    <aside className="sidebar">
      <a href="#/dashboard" onClick={(e) => { e.preventDefault(); navigate('dashboard'); }} className="flex items-center gap-2.5 mb-8 px-2">
        <div className="w-8 h-8 rounded-lg bg-teal-500/20 flex items-center justify-center text-teal-400 font-display font-bold text-sm">GD</div>
        <div>
          <div className="font-display font-bold text-slate-200 text-sm leading-tight">GTO Drill</div>
          <div className="font-display text-xs text-teal-400 leading-tight">Coach</div>
        </div>
      </a>

      <nav className="flex flex-col gap-1 flex-1">
        {NAV_ITEMS.map(({ route: r, label, Icon }) => {
          const active = route === r || (r === 'preflop' && (route === 'postflop' || route === 'plo'));
          return (
            <a
              key={r}
              href={`#/${r}`}
              onClick={(e) => { e.preventDefault(); navigate(r); }}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-display font-medium transition-colors',
                active ? 'bg-teal-500/15 text-teal-400' : 'text-slate-500 hover:text-slate-200 hover:bg-white/5'
              )}
            >
              <span className="w-5 h-5 flex-shrink-0"><Icon active={active} /></span>
              {label}
            </a>
          );
        })}

        <div className="my-3 border-t border-white/5" />

        <a
          href="#/library"
          onClick={(e) => { e.preventDefault(); navigate('library'); }}
          className={cn(
            'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-display font-medium transition-colors',
            route === 'library' ? 'bg-teal-500/15 text-teal-400' : 'text-slate-500 hover:text-slate-200 hover:bg-white/5'
          )}
        >
          <span className="text-base">📚</span> Library
        </a>

        <a
          href="#/plo"
          onClick={(e) => { e.preventDefault(); navigate('plo'); }}
          className={cn(
            'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-display font-medium transition-colors',
            route === 'plo' ? 'bg-purple-500/15 text-purple-400' : 'text-slate-500 hover:text-slate-200 hover:bg-white/5'
          )}
        >
          <span className="text-base">🃏</span> PLO Trainer
        </a>

        <a
          href="#/fair-play"
          onClick={(e) => { e.preventDefault(); navigate('fair-play'); }}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-display font-medium text-slate-500 hover:text-slate-200 hover:bg-white/5 transition-colors"
        >
          <span className="text-base">🛡️</span> Fair Play
        </a>
      </nav>

      <div className="mt-auto">
        <div className="glass-card p-3">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-full bg-teal-500/20 flex items-center justify-center text-xs font-display font-bold text-teal-400">
              {profile.username.slice(0, 1).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-display font-semibold text-slate-200 truncate">{profile.username}</div>
              <div className="text-xs text-slate-500">Lv.{profile.level} · {getLevelTitle(profile.level)}</div>
            </div>
          </div>
          <div className="progress-bar">
            <div className="progress-bar-fill" style={{ width: `${progressPct}%` }} />
          </div>
          <div className="flex justify-between text-xs text-slate-600 mt-1">
            <span>{profile.xp.toLocaleString()} XP</span>
            <span>{getXPForNextLevel(profile.level).toLocaleString()} XP</span>
          </div>
        </div>

        <a
          href="#/settings"
          onClick={(e) => { e.preventDefault(); navigate('settings'); }}
          className="flex items-center gap-2 px-3 py-2 mt-2 rounded-lg text-xs text-slate-600 hover:text-slate-400 transition-colors"
        >
          ⚙️ Settings
        </a>
      </div>
    </aside>
  );
}

// ── AppShell ───────────────────────────────────────────────────────────────

function AppShell({ route, navigate, children }) {
  return (
    <div className="min-h-screen bg-navy-900">
      <Sidebar route={route} navigate={navigate} />
      <main className="md:pl-[220px] mobile-page-padding">{children}</main>
      <BottomNav route={route} navigate={navigate} />
    </div>
  );
}

// ── PokerTable — 2D visual table simulation ───────────────────────────────
// Renders an oval table with up to 6 seats arranged around it, hero's hole
// cards face up, villains shown as seat markers (face-down unless folded
// out / specified), dealer button, pot display, and per-seat stack labels.
// Seat layout is computed from a fixed 6-max template, rotated so hero is
// always at the bottom-center seat for a consistent "my seat" perspective.

const SIX_MAX_SEAT_ORDER = ['BTN', 'SB', 'BB', 'UTG', 'CO', 'MP'];

// Relative angles (degrees, 0 = top) for a 6-max oval, hero always placed at
// the bottom (180°) regardless of actual position, with other seats rotated
// around accordingly so the spatial layout always reads "around the table".
const SEAT_ANGLES_6MAX = [180, 240, 300, 0, 60, 120];

function getTableSeats(heroPosition, villainPositions) {
  // Build full ordered seat list starting at hero, going clockwise around
  // the standard 6-max action order, so visual layout matches real table flow.
  const order = ['UTG', 'MP', 'CO', 'BTN', 'SB', 'BB'];
  const heroIdx = order.indexOf(heroPosition);
  const rotated = heroIdx >= 0
    ? [...order.slice(heroIdx), ...order.slice(0, heroIdx)]
    : order;

  return rotated.map((pos, i) => ({
    position: pos,
    angle: SEAT_ANGLES_6MAX[i],
    isHero: pos === heroPosition,
    isActive: pos === heroPosition || (villainPositions || []).includes(pos),
  }));
}

function seatCoords(angle, rx, ry) {
  const rad = (angle - 90) * (Math.PI / 180);
  return { x: 50 + rx * Math.cos(rad), y: 50 + ry * Math.sin(rad) };
}

function PokerTable({ heroPosition, villainPositions, heroCards, potBB, heroStackBB, dealerPosition, activeSeat, actionLabel }) {
  const seats = getTableSeats(heroPosition, villainPositions || []);

  return (
    <div className="poker-table-wrap">
      <div className="poker-table-oval">
        <div className="poker-table-felt-edge" />
        <div className="poker-table-pot">
          <span className="poker-table-pot-label">POT</span>
          <span className="poker-table-pot-value">{potBB.toFixed(1)} bb</span>
        </div>

        {seats.map((seat) => {
          const { x, y } = seatCoords(seat.angle, 40, 36);
          const isDealer = seat.position === dealerPosition;
          const isActing = seat.position === activeSeat;
          const isFolded = !seat.isActive && !seat.isHero;

          return (
            <div
              key={seat.position}
              className={cn('poker-seat', seat.isHero && 'poker-seat-hero', isActing && 'poker-seat-acting', isFolded && 'poker-seat-folded')}
              style={{ left: `${x}%`, top: `${y}%` }}
            >
              {isDealer && <span className="poker-dealer-btn">D</span>}

              <div className="poker-seat-cards">
                {seat.isHero ? (
                  heroCards.map((c, i) => <PlayingCard key={i} card={c} size="sm" />)
                ) : seat.isActive ? (
                  <>
                    <div className="poker-card-back" />
                    <div className="poker-card-back" />
                  </>
                ) : (
                  <div className="poker-seat-empty">—</div>
                )}
              </div>

              <div className={cn('poker-seat-label', seat.isHero && 'poker-seat-label-hero')}>
                {seat.position}{seat.isHero ? ' (You)' : ''}
              </div>

              {seat.isHero && (
                <div className="poker-seat-stack">{heroStackBB.toFixed(0)}bb</div>
              )}

              {isActing && actionLabel && (
                <div className="poker-action-bubble">{actionLabel}</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

window.GTOComponents = {
  Card, Button, ProgressBar, Badge, SourceLabel, StatCard, EmptyState, Spinner, PlayingCard, PokerTable, AppShell,
};
