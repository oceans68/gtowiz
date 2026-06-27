/**
 * GTO Drill Coach — PLO (Pot-Limit Omaha) Trainer Page
 *
 * Trains preflop PLO decisions for 6-max cash (100bb) and MTT push/fold.
 * Key PLO concepts drilled:
 *  - When to FOLD decent-looking hands (traps)
 *  - Suited vs unsuited value difference
 *  - Connectivity and nut potential
 *  - Position matters even more than in NLHE
 */
(function () {
  const { Card, Button, Badge, ProgressBar, SourceLabel, PlayingCard, Spinner, AppShell } = window.GTOComponents;
  const { cn, getGTOWScoreLabel, getActionLabel } = window.GTOUtils;
  const { PLO_CASH_HANDS, PLO_MTT_HANDS, getPLODrillSpot } = window.GTOData;
  const { useAppStore, addXP } = window.GTOStore;

  // ── PLO Playing Card — 4-card display ─────────────────────────────────
  function PLOHand({ cards, size = 'lg', dimmed = false }) {
    const rankMap = { A: 'A', K: 'K', Q: 'Q', J: 'J', T: '10', '9': '9', '8': '8', '7': '7', '6': '6', '5': '5', '4': '4', '3': '3', '2': '2' };
    const suitMap = { s: '♠', h: '♥', d: '♦', c: '♣' };
    const suitColor = { s: '#e2e8f0', h: '#ff4444', d: '#ff4444', c: '#e2e8f0' };

    return (
      <div className={cn('flex gap-1.5 justify-center', dimmed && 'opacity-50')}>
        {cards.map((card, i) => {
          const rank = card.slice(0, -1);
          const suit = card.slice(-1);
          return (
            <div key={i} className={cn('plo-card', size === 'lg' && 'plo-card-lg', size === 'sm' && 'plo-card-sm')}>
              <div className="plo-card-rank" style={{ color: suitColor[suit] || '#e2e8f0' }}>
                {rankMap[rank] || rank}
              </div>
              <div className="plo-card-suit" style={{ color: suitColor[suit] || '#e2e8f0' }}>
                {suitMap[suit] || suit}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // ── Hand Properties Badge Row ──────────────────────────────────────────
  function HandBadges({ hand }) {
    return (
      <div className="flex flex-wrap gap-1.5 justify-center mt-2">
        {hand.is_double_suited && (
          <span className="px-2 py-0.5 rounded-full text-xs font-display font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">
            🎨 Double-Suited
          </span>
        )}
        {hand.is_single_suited && !hand.is_double_suited && (
          <span className="px-2 py-0.5 rounded-full text-xs font-display font-bold bg-blue-400/15 text-blue-300 border border-blue-400/20">
            🎨 Single-Suited
          </span>
        )}
        {!hand.is_single_suited && !hand.is_double_suited && (
          <span className="px-2 py-0.5 rounded-full text-xs font-display font-bold bg-white/5 text-slate-500 border border-white/8">
            🌈 Rainbow
          </span>
        )}
        <span className="px-2 py-0.5 rounded-full text-xs font-display font-semibold" style={{
          background: hand.connectivity >= 4 ? 'rgba(0,204,102,0.15)' : hand.connectivity >= 3 ? 'rgba(255,184,0,0.15)' : 'rgba(255,68,68,0.1)',
          color: hand.connectivity >= 4 ? '#00cc66' : hand.connectivity >= 3 ? '#ffb800' : '#ff8c42',
          border: `1px solid ${hand.connectivity >= 4 ? 'rgba(0,204,102,0.3)' : hand.connectivity >= 3 ? 'rgba(255,184,0,0.3)' : 'rgba(255,140,66,0.3)'}`,
        }}>
          {'⚡'.repeat(hand.connectivity > 3 ? 3 : hand.connectivity > 1 ? 2 : 1)} Connectivity {hand.connectivity}/5
        </span>
        <span className="px-2 py-0.5 rounded-full text-xs font-display font-semibold" style={{
          background: hand.nut_potential >= 4 ? 'rgba(0,212,255,0.15)' : 'rgba(100,116,139,0.15)',
          color: hand.nut_potential >= 4 ? '#00d4ff' : '#64748b',
          border: `1px solid ${hand.nut_potential >= 4 ? 'rgba(0,212,255,0.3)' : 'rgba(100,116,139,0.3)'}`,
        }}>
          🔑 Nut potential {hand.nut_potential}/5
        </span>
        {hand.category === 'trap_hand' && (
          <span className="px-2 py-0.5 rounded-full text-xs font-display font-bold bg-red-500/20 text-red-400 border border-red-500/30">
            ⚠️ TRAP HAND
          </span>
        )}
      </div>
    );
  }

  // ── Score Display ──────────────────────────────────────────────────────
  function GTOWScoreBadge({ score }) {
    const info = getGTOWScoreLabel(score);
    return (
      <div className="px-3 py-1 rounded-lg text-xs font-display font-bold" style={{
        background: `${info.color}22`, color: info.color, border: `1px solid ${info.color}44`
      }}>
        GTOW {score > 0 ? '+' : ''}{score}
      </div>
    );
  }

  // ── Config Screen ──────────────────────────────────────────────────────
  function PLOConfigScreen({ onStart, navigate }) {
    const [mode, setMode] = React.useState('cash'); // 'cash' | 'mtt'
    const [spots, setSpots] = React.useState(10);
    const [focusTrap, setFocusTrap] = React.useState(false);

    const cashCount = PLO_CASH_HANDS.length;
    const mttCount = PLO_MTT_HANDS.length;

    return (
      <div className="max-w-lg mx-auto px-4 pt-6">
        <div className="mb-5">
          <a href="#/dashboard" onClick={(e) => { e.preventDefault(); navigate('dashboard'); }}
            className="text-slate-500 hover:text-slate-400 text-sm">← Dashboard</a>
          <h1 className="font-display font-bold text-2xl text-slate-100 mt-2">PLO Trainer</h1>
          <p className="text-slate-500 text-sm mt-1">Pot-Limit Omaha • 4-card hands • 6-max</p>
        </div>

        {/* PLO info banner */}
        <div className="rounded-xl p-4 mb-5 bg-purple-500/10 border border-purple-500/20">
          <div className="text-xs font-display font-bold text-purple-400 uppercase tracking-wider mb-2">
            🎓 What you'll train
          </div>
          <ul className="text-sm text-slate-400 space-y-1">
            <li>• When to FOLD hands that look strong (the #1 PLO leak)</li>
            <li>• Double-suited vs single-suited vs rainbow value</li>
            <li>• Rundown quality and nut potential</li>
            <li>• Position-dependent opening/calling ranges</li>
            <li>• MTT push/fold decisions at various stack depths</li>
          </ul>
        </div>

        {/* Mode selector */}
        <div className="flex gap-2 mb-4 p-1 bg-white/4 rounded-xl">
          {[{ key: 'cash', label: '💰 Cash 100bb', sub: `${cashCount} hand types` },
            { key: 'mtt', label: '🏆 MTT Push/Fold', sub: `${mttCount} hand types` }
          ].map(({ key, label, sub }) => (
            <button key={key} onClick={() => setMode(key)}
              className={cn('flex-1 py-2.5 rounded-lg font-display font-semibold text-sm transition-all', mode === key ? 'bg-navy-700 text-slate-200 shadow' : 'text-slate-500 hover:text-slate-400')}>
              <div>{label}</div>
              <div className="text-xs font-normal opacity-60 mt-0.5">{sub}</div>
            </button>
          ))}
        </div>

        {/* Focus on traps toggle */}
        <Card className="mb-4">
          <button onClick={() => setFocusTrap(!focusTrap)}
            className={cn('w-full flex items-center gap-3 text-left transition-all rounded-lg p-1', focusTrap ? 'text-slate-200' : 'text-slate-500')}>
            <div className={cn('w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all',
              focusTrap ? 'border-red-400 bg-red-400/20' : 'border-slate-600')}>
              {focusTrap && <span className="text-red-400 text-xs">✓</span>}
            </div>
            <div>
              <div className="font-display font-semibold text-sm">⚠️ Focus on Trap Hands</div>
              <div className="text-xs text-slate-600 mt-0.5">
                Drill only the hands that most players get wrong (the #1 PLO leak)
              </div>
            </div>
          </button>
        </Card>

        {/* Spot count */}
        <Card className="mb-5">
          <div className="text-xs font-display font-semibold text-slate-500 uppercase tracking-wider mb-3">Spots per Session</div>
          <div className="flex gap-2">
            {[5, 10, 15, 20].map((n) => (
              <button key={n} onClick={() => setSpots(n)}
                className={cn('flex-1 py-2 rounded-lg text-sm font-display font-semibold border transition-all',
                  spots === n ? 'bg-teal-400/10 border-teal-400/40 text-teal-400' : 'border-white/6 text-slate-500 hover:text-slate-400')}>
                {n}
              </button>
            ))}
          </div>
        </Card>

        <Button variant="primary" size="lg" fullWidth
          onClick={() => onStart({ mode, spots, focusTrap })}>
          Start PLO Drill →
        </Button>
      </div>
    );
  }

  // ── Drill Screen ───────────────────────────────────────────────────────
  function PLODrillScreen({ spot, spotIndex, totalSpots, onAnswer }) {
    const { hand, position, scenario, correctAction } = spot;
    const isMTT = spot.isMTT;

    const actions = isMTT
      ? ['fold', 'allin']
      : scenario === 'vs_open'
      ? ['fold', 'call', 'raise']
      : ['fold', 'raise'];

    const actionColors = {
      fold: 'bg-red-500/15 border-red-500/30 text-red-400 hover:bg-red-500/25',
      call: 'bg-teal-500/15 border-teal-500/30 text-teal-400 hover:bg-teal-500/25',
      raise: 'bg-green-500/15 border-green-500/30 text-green-400 hover:bg-green-500/25',
      allin: 'bg-orange-500/15 border-orange-500/30 text-orange-400 hover:bg-orange-500/25',
    };

    const scenarioText = scenario === 'vs_open'
      ? `A player opens from CO. You are in ${position}.`
      : isMTT
      ? `${hand.stack_bb || 20}bb effective · 6-max MTT · Action folds to you in ${position}.`
      : `Action folds to you in ${position} · 100bb · 6-max cash.`;

    return (
      <div>
        <div className="flex items-center gap-3 mb-5">
          <ProgressBar value={(spotIndex / totalSpots) * 100} className="flex-1" />
          <span className="text-xs text-slate-500 flex-shrink-0 font-mono">{spotIndex}/{totalSpots}</span>
        </div>

        <Card className="mb-4">
          <div className="flex items-center gap-2 flex-wrap mb-2">
            <Badge variant="teal">PLO {isMTT ? 'MTT' : 'Cash'}</Badge>
            <Badge variant="default">{position}</Badge>
            {scenario === 'vs_open' && <Badge variant="default">vs Open</Badge>}
            {isMTT && hand.stack_bb && <Badge variant="default">{hand.stack_bb}bb</Badge>}
            <span className="ml-auto text-xs text-slate-500 italic">Sample training data</span>
          </div>
          <p className="text-sm text-slate-400">{scenarioText}</p>
        </Card>

        {/* 4-card PLO hand display */}
        <Card className="mb-5 py-6 text-center">
          <div className="text-xs font-display font-semibold text-slate-500 uppercase tracking-wider mb-4">Your Hand</div>
          <PLOHand cards={hand.display_cards} size="lg" />
          <HandBadges hand={hand} />
          <div className="mt-3 text-xs text-slate-600">{hand.label}</div>
        </Card>

        <div className="text-center mb-4">
          <p className="font-display font-semibold text-slate-200 text-lg">What is your action?</p>
          {hand.category === 'trap_hand' && (
            <p className="text-xs text-slate-500 mt-1">💭 Think carefully — this might be a trap hand</p>
          )}
        </div>

        <div className={cn('grid gap-3', actions.length === 2 ? 'grid-cols-2' : 'grid-cols-3')}>
          {actions.map((action) => (
            <button key={action} onClick={() => onAnswer(action)}
              className={cn('action-btn border', actionColors[action] || 'bg-white/5 border-white/10 text-slate-400')}>
              {action === 'allin' ? 'All-In' : action === 'raise' ? 'Raise/3-Bet' : action.charAt(0).toUpperCase() + action.slice(1)}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // ── Feedback Screen ────────────────────────────────────────────────────
  function PLOFeedbackScreen({ spot, userAction, gtowScore, xpEarned, onNext, isLast }) {
    const { hand, position, scenario, correctAction } = spot;
    const isCorrect = userAction === correctAction;
    const scoreInfo = getGTOWScoreLabel(gtowScore);

    const feedbackLabel = isCorrect ? 'correct'
      : (userAction === 'fold' && correctAction !== 'fold') ? 'over_folded'
      : (userAction !== 'fold' && correctAction === 'fold') ? 'trap_caught'
      : 'wrong_action';

    const feedbackMessages = {
      correct: { icon: '✅', title: 'Correct!', color: 'text-gto-green', bg: 'feedback-correct' },
      over_folded: { icon: '📉', title: 'Too tight', color: 'text-gold-400', bg: 'feedback-acceptable' },
      trap_caught: { icon: '❌', title: 'Trap! Should fold', color: 'text-gto-red', bg: 'feedback-mistake' },
      wrong_action: { icon: '❌', title: 'Wrong action', color: 'text-gto-red', bg: 'feedback-mistake' },
    };
    const fb = feedbackMessages[feedbackLabel];

    // Strength bars
    const bars = [
      { label: 'Hand Strength', value: hand.hand_strength, max: 5 },
      { label: 'Nut Potential', value: hand.nut_potential, max: 5 },
      { label: 'Connectivity', value: hand.connectivity, max: 5 },
    ];

    return (
      <div>
        {/* Result banner */}
        <div className={cn('rounded-xl p-4 mb-4 border', fb.bg)}>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">{fb.icon}</span>
            <span className={cn('font-display font-bold text-lg', fb.color)}>{fb.title}</span>
            <div className="ml-auto flex items-center gap-2">
              <GTOWScoreBadge score={gtowScore} />
              <span className="text-gold-400 font-display font-bold text-xs">+{xpEarned}XP</span>
            </div>
          </div>

          <div className="flex gap-4 text-sm flex-wrap mb-1">
            <div>
              <span className="text-slate-500 text-xs">Your action: </span>
              <span className={cn('font-semibold text-sm', isCorrect ? 'text-gto-green' : 'text-gto-red')}>
                {userAction === 'allin' ? 'All-In' : userAction === 'raise' ? 'Raise/3-Bet' : userAction.charAt(0).toUpperCase() + userAction.slice(1)}
              </span>
            </div>
            {!isCorrect && (
              <div>
                <span className="text-slate-500 text-xs">Correct: </span>
                <span className="font-semibold text-sm text-gto-green">
                  {correctAction === 'allin' ? 'All-In' : correctAction === 'raise' ? 'Raise/3-Bet' : correctAction.charAt(0).toUpperCase() + correctAction.slice(1)}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Hand display again for reference */}
        <Card className="mb-4 py-4 text-center">
          <PLOHand cards={hand.display_cards} size="lg" />
          <HandBadges hand={hand} />

          {/* Hand evaluation bars */}
          <div className="mt-4 space-y-2 text-left">
            {bars.map(({ label, value, max }) => {
              const pct = (value / max) * 100;
              const color = value >= 4 ? '#00cc66' : value >= 3 ? '#ffb800' : '#ff4444';
              return (
                <div key={label} className="flex items-center gap-2">
                  <div className="w-24 text-xs text-slate-500 flex-shrink-0">{label}</div>
                  <div className="flex-1 h-3 bg-white/5 rounded overflow-hidden">
                    <div className="h-full rounded transition-all" style={{ width: `${pct}%`, background: color }} />
                  </div>
                  <div className="w-8 text-xs text-right font-mono" style={{ color }}>{value}/{max}</div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* GTO Explanation */}
        <Card className="mb-5">
          <div className="text-xs font-display font-semibold text-slate-500 uppercase tracking-wider mb-3">
            🧠 PLO GTO Explanation
          </div>

          {/* Key concept */}
          <div className="mb-3 p-3 rounded-lg bg-teal-400/5 border border-teal-400/15">
            <div className="text-xs font-display font-semibold text-teal-400 mb-1">💡 Key Concept</div>
            <p className="text-sm text-slate-300">{hand.key_concept}</p>
          </div>

          {/* Common mistake */}
          <div className="p-3 rounded-lg bg-red-400/5 border border-red-400/15">
            <div className="text-xs font-display font-semibold text-red-400 mb-1">🎭 Common Mistake</div>
            <p className="text-sm text-slate-300">{hand.common_mistake}</p>
          </div>

          {/* PLO principles section */}
          <div className="mt-3 pt-3 border-t border-white/5">
            <div className="text-xs font-display font-semibold text-slate-500 uppercase tracking-wider mb-2">
              PLO Principles
            </div>
            <div className="space-y-1 text-xs text-slate-500">
              {hand.is_double_suited && <div>🎨 Double-suited adds ~15-20% equity vs rainbow equivalent</div>}
              {!hand.is_single_suited && !hand.is_double_suited && <div>🌈 Rainbow PLO hands lose significant equity vs suited hands</div>}
              {hand.category === 'trap_hand' && <div>⚠️ This hand type is the #1 leak for NLHE players moving to PLO</div>}
              {hand.connectivity >= 5 && <div>⚡ Perfect connectivity = potential 20-card wrap draws on flop</div>}
              {hand.nut_potential <= 1 && <div>🔑 Low nut potential = dangerous in PLO (non-nut draws bust)</div>}
              <div>📍 Position: {position === 'UTG' ? 'Early position requires tighter standards' : position === 'BTN' ? 'Button = maximum positional advantage' : 'Blinds = defend wide, but tighter OOP postflop'}</div>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-white/5">
            <span className="text-xs text-slate-600 italic">⚠️ Sample training ranges — not solver-verified PLO GTO</span>
          </div>
        </Card>

        <Button variant="primary" size="lg" fullWidth onClick={onNext}>
          {isLast ? 'See Results →' : 'Next Spot →'}
        </Button>
      </div>
    );
  }

  // ── Session End ────────────────────────────────────────────────────────
  function PLOSessionEnd({ answers, onRestart, navigate }) {
    const total = answers.length;
    const correct = answers.filter((a) => a.is_correct).length;
    const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;
    const trapTotal = answers.filter((a) => a.is_trap).length;
    const trapCorrect = answers.filter((a) => a.is_trap && a.is_correct).length;
    const avgGTOW = total > 0
      ? Math.round(answers.reduce((s, a) => s + a.gtow_score, 0) / total)
      : 0;
    const gtowInfo = getGTOWScoreLabel(avgGTOW);

    // What categories did they get wrong?
    const wrongCategories = {};
    for (const a of answers) {
      if (!a.is_correct) {
        wrongCategories[a.category] = (wrongCategories[a.category] || 0) + 1;
      }
    }

    return (
      <div>
        <div className="text-center mb-5">
          <div className="text-5xl mb-3">{avgGTOW >= 70 ? '🏆' : avgGTOW >= 40 ? '💪' : '📚'}</div>
          <h2 className="font-display font-bold text-2xl text-slate-100">Session Complete</h2>
          <p className="text-slate-500 text-sm mt-1">{total} PLO spots drilled</p>
        </div>

        {/* GTOW Score */}
        <div className="rounded-xl p-5 mb-4 text-center" style={{ background: `${gtowInfo.color}11`, border: `1px solid ${gtowInfo.color}33` }}>
          <div className="text-xs text-slate-500 mb-1">GTOW SCORE</div>
          <div className="text-5xl font-display font-bold mb-1" style={{ color: gtowInfo.color }}>
            {avgGTOW > 0 ? '+' : ''}{avgGTOW}
          </div>
          <div className="text-sm font-display font-semibold" style={{ color: gtowInfo.color }}>
            {gtowInfo.emoji} {gtowInfo.label}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-4">
          <Card className="text-center">
            <div className={cn('text-2xl font-display font-bold', accuracy >= 70 ? 'text-gto-green' : 'text-gto-red')}>{accuracy}%</div>
            <div className="text-xs text-slate-500 mt-1">Overall</div>
          </Card>
          <Card className="text-center">
            <div className={cn('text-2xl font-display font-bold', trapTotal > 0 && trapCorrect === trapTotal ? 'text-gto-green' : 'text-gold-400')}>
              {trapTotal > 0 ? `${trapCorrect}/${trapTotal}` : '—'}
            </div>
            <div className="text-xs text-slate-500 mt-1">Trap Hands</div>
          </Card>
          <Card className="text-center">
            <div className="text-2xl font-display font-bold text-slate-200">{correct}/{total}</div>
            <div className="text-xs text-slate-500 mt-1">Correct</div>
          </Card>
        </div>

        {/* Leak analysis */}
        {Object.keys(wrongCategories).length > 0 && (
          <Card className="mb-5">
            <div className="text-xs font-display font-semibold text-slate-500 uppercase tracking-wider mb-3">
              🔍 Your Leaks
            </div>
            {Object.entries(wrongCategories).sort((a, b) => b[1] - a[1]).map(([cat, count]) => (
              <div key={cat} className="flex items-center justify-between py-1.5 border-b border-white/4 last:border-0">
                <span className="text-sm text-slate-400 capitalize">{cat.replace(/_/g, ' ')}</span>
                <span className="text-sm font-mono text-gto-red">{count} wrong</span>
              </div>
            ))}
            {wrongCategories.trap_hand > 0 && (
              <div className="mt-3 p-3 rounded-lg bg-red-500/8 border border-red-500/20 text-xs text-red-400">
                ⚠️ You lost {wrongCategories.trap_hand} trap hand spot{wrongCategories.trap_hand > 1 ? 's' : ''} — this is the most expensive PLO leak. Study the "when to fold" concept.
              </div>
            )}
          </Card>
        )}

        <div className="flex gap-3">
          <Button variant="secondary" size="lg" className="flex-1" onClick={onRestart}>Drill Again</Button>
          <Button variant="primary" size="lg" className="flex-1" onClick={() => navigate('dashboard')}>Dashboard →</Button>
        </div>
      </div>
    );
  }

  // ── Main PLO Page ──────────────────────────────────────────────────────
  function PLOPage({ navigate }) {
    const [mode, setMode] = React.useState('config'); // config | drilling | feedback | end
    const [spots, setSpots] = React.useState([]);
    const [currentIndex, setCurrentIndex] = React.useState(0);
    const [userAction, setUserAction] = React.useState(null);
    const [gtowScore, setGtowScore] = React.useState(0);
    const [xpEarned, setXpEarned] = React.useState(0);
    const [sessionAnswers, setSessionAnswers] = React.useState([]);
    const [sessionCounts, setSessionCounts] = React.useState({});

    const handleStart = ({ mode: gameMode, spots: count, focusTrap }) => {
      const isMTT = gameMode === 'mtt';
      const generated = [];
      const counts = {};

      for (let i = 0; i < count; i++) {
        const spot = getPLODrillSpot(isMTT, counts);
        // Filter for trap focus mode
        if (focusTrap && spot.hand.category !== 'trap_hand' && Math.random() > 0.3) {
          // Re-roll with trap hands only (70% of the time)
          const trapHands = (isMTT ? PLO_MTT_HANDS : PLO_CASH_HANDS)
            .filter((h) => h.category === 'trap_hand');
          if (trapHands.length > 0) {
            const hand = trapHands[Math.floor(Math.random() * trapHands.length)];
            const positions = ['UTG', 'CO', 'BTN', 'SB'];
            const position = positions[Math.floor(Math.random() * positions.length)];
            const correctAction = isMTT ? hand.correct_action || 'fold'
              : 'fold'; // trap hands always fold in cash
            generated.push({ hand, position, scenario: 'open', correctAction, isMTT });
            counts[correctAction] = (counts[correctAction] || 0) + 1;
            continue;
          }
        }
        generated.push({ ...spot, isMTT });
        counts[spot.correctAction] = (counts[spot.correctAction] || 0) + 1;
      }

      setSpots(generated);
      setCurrentIndex(0);
      setSessionAnswers([]);
      setSessionCounts({});
      setMode('drilling');
    };

    const handleAnswer = (action) => {
      const spot = spots[currentIndex];
      const isCorrect = action === spot.correctAction;

      // GTOW score: correct = +100, trap_folded_correctly = +120, caught_in_trap = -100
      let score, xp;
      if (isCorrect) {
        score = spot.hand.category === 'trap_hand' ? 120 : 100;
        xp = spot.hand.category === 'trap_hand' ? 20 : 10;
      } else if (action !== 'fold' && spot.correctAction === 'fold') {
        // Fell for a trap — worst mistake in PLO
        score = -100;
        xp = 0;
      } else {
        score = -50;
        xp = 2;
      }

      setGtowScore(score);
      setXpEarned(xp);
      setUserAction(action);
      addXP(xp);

      const answer = {
        is_correct: isCorrect,
        gtow_score: score,
        category: spot.hand.category,
        is_trap: spot.hand.category === 'trap_hand',
        action,
        correct_action: spot.correctAction,
      };
      setSessionAnswers((prev) => [...prev, answer]);
      setSessionCounts((prev) => ({ ...prev, [action]: (prev[action] || 0) + 1 }));
      setMode('feedback');
    };

    const handleNext = () => {
      if (currentIndex >= spots.length - 1) {
        setMode('end');
      } else {
        setCurrentIndex((i) => i + 1);
        setUserAction(null);
        setMode('drilling');
      }
    };

    const handleRestart = () => {
      setMode('config');
      setSpots([]);
      setCurrentIndex(0);
      setSessionAnswers([]);
    };

    return (
      <AppShell route="plo" navigate={navigate}>
        <div className="max-w-lg mx-auto px-4 pt-6 pb-24">
          {mode === 'config' && <PLOConfigScreen onStart={handleStart} navigate={navigate} />}
          {mode === 'drilling' && spots[currentIndex] && (
            <PLODrillScreen spot={spots[currentIndex]} spotIndex={currentIndex} totalSpots={spots.length} onAnswer={handleAnswer} />
          )}
          {mode === 'feedback' && spots[currentIndex] && (
            <PLOFeedbackScreen spot={spots[currentIndex]} userAction={userAction} gtowScore={gtowScore} xpEarned={xpEarned} onNext={handleNext} isLast={currentIndex >= spots.length - 1} />
          )}
          {mode === 'end' && (
            <PLOSessionEnd answers={sessionAnswers} onRestart={handleRestart} navigate={navigate} />
          )}
        </div>
      </AppShell>
    );
  }

  window.GTOPagePLO = PLOPage;
})();
