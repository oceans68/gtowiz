/**
 * GTO Drill Coach — Preflop Trainer Page (Static Bundle)
 */
(function () {
  const { Card, Button, Badge, ProgressBar, SourceLabel, PlayingCard, PokerTable, Spinner, AppShell } = window.GTOComponents;
  const {
    cn, getActionLabel, getActionColor, getPositionFull, getActionTypeFull, scoreAnswer, getGTOWScoreLabel,
  } = window.GTOUtils;
  const {
    ALL_RANGES, HAND_GRID_ORDER, getRandomComboFromRange, getComboAllActions,
  } = window.GTOData;
  const { useAppStore, startSession, recordAnswer, endSession, addXP, updateMissionProgress, checkAndAwardBadges } = window.GTOStore;
  const { getFallbackExplanation } = window.GTOExplain;

  const CASH_RFI_RANGES = [
    { id: 'utg-rfi-100bb', label: 'UTG — Open Raise' },
    { id: 'co-rfi-100bb', label: 'CO — Open Raise' },
    { id: 'btn-rfi-100bb', label: 'BTN — Open Raise' },
    { id: 'sb-rfi-100bb', label: 'SB — Open Raise' },
  ];

  const CASH_VS_OPEN_RANGES = [
    { id: 'bb-vs-btn-open', label: 'BB vs BTN Open' },
    { id: 'co-vs-utg-open-100bb', label: 'CO vs UTG Open' },
    { id: 'btn-vs-utg-open-100bb', label: 'BTN vs UTG Open' },
    { id: 'sb-vs-btn-open-100bb', label: 'SB vs BTN Open' },
  ];

  const CASH_VS_LIMP_RANGES = [
    { id: 'btn-vs-limp-100bb', label: 'BTN — Player Limped' },
    { id: 'sb-vs-limp-100bb', label: 'SB — Player Limped' },
    { id: 'bb-vs-limp-100bb', label: 'BB — Player Limped' },
  ];

  const CASH_3BET_4BET_RANGES = [
    { id: 'btn-3bet-vs-co', label: 'BTN 3-Bet vs CO' },
    { id: 'btn-vs-4bet-from-co', label: 'BTN — Faced a 4-Bet (after 3-betting CO)' },
  ];

  const MTT_RANGES = [
    { id: 'utg-push-10bb', label: 'UTG — Push/Fold 10bb' },
    { id: 'co-push-15bb', label: 'CO — Push/Fold 15bb' },
    { id: 'btn-push-10bb', label: 'BTN — Push/Fold 10bb' },
    { id: 'sb-push-10bb', label: 'SB — Push/Fold 10bb (vs BB)' },
    { id: 'btn-vs-limp-push-12bb', label: 'BTN — Player Limped (12bb)' },
    { id: 'bb-vs-raise-push-10bb', label: 'BB — Faced a Raise (10bb)' },
  ];

  const CASH_CATEGORIES = [
    { key: 'rfi', label: 'Open (RFI)', ranges: CASH_RFI_RANGES },
    { key: 'vs_open', label: 'vs Open', ranges: CASH_VS_OPEN_RANGES },
    { key: 'vs_limp', label: 'vs Limp', ranges: CASH_VS_LIMP_RANGES },
    { key: '3bet_4bet', label: '3-Bet / 4-Bet', ranges: CASH_3BET_4BET_RANGES },
  ];


  // ── Config screen ──────────────────────────────────────────────────────

  function ConfigScreen({ onStart, navigate }) {
    const [gameMode, setGameMode] = React.useState('cash');
    const [category, setCategory] = React.useState('rfi');
    const [selected, setSelected] = React.useState(['btn-rfi-100bb']);
    const [spots, setSpots] = React.useState(10);

    const availableRanges = gameMode === 'cash'
      ? (CASH_CATEGORIES.find((c) => c.key === category) || CASH_CATEGORIES[0]).ranges
      : MTT_RANGES;

    const handleModeChange = (mode) => {
      setGameMode(mode);
      if (mode === 'cash') {
        setCategory('rfi');
        setSelected(['btn-rfi-100bb']);
      } else {
        setSelected(['btn-push-10bb']);
      }
    };

    const handleCategoryChange = (key) => {
      setCategory(key);
      const cat = CASH_CATEGORIES.find((c) => c.key === key);
      setSelected(cat && cat.ranges.length > 0 ? [cat.ranges[0].id] : []);
    };

    const toggle = (id) => {
      setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
    };

    return (
      <div className="max-w-lg mx-auto px-4 pt-6">
        <div className="mb-6">
          <a href="#/dashboard" onClick={(e) => { e.preventDefault(); navigate('dashboard'); }} className="text-slate-500 hover:text-slate-400 text-sm">← Dashboard</a>
          <h1 className="font-display font-bold text-2xl text-slate-100 mt-2">Preflop Trainer</h1>
          <p className="text-slate-500 text-sm mt-1">
            {gameMode === 'cash' ? '100bb · 6-max cash game' : 'Short stack · 6-max MTT push/fold'}
          </p>
        </div>

        <div className="flex gap-2 mb-4 p-1 bg-white/4 rounded-xl">
          {['cash', 'mtt'].map((mode) => (
            <button
              key={mode}
              onClick={() => handleModeChange(mode)}
              className={cn('flex-1 py-2 rounded-lg font-display font-semibold text-sm transition-all', gameMode === mode ? 'bg-navy-700 text-slate-200 shadow' : 'text-slate-500 hover:text-slate-400')}
            >
              {mode === 'cash' ? '💰 Cash 100bb' : '🏆 MTT Push/Fold'}
            </button>
          ))}
        </div>

        {gameMode === 'cash' && (
          <div className="flex gap-1.5 mb-4 overflow-x-auto pb-1">
            {CASH_CATEGORIES.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => handleCategoryChange(key)}
                className={cn('px-3 py-1.5 rounded-lg text-xs font-display font-semibold whitespace-nowrap border transition-all flex-shrink-0', category === key ? 'border-teal-400/40 bg-teal-400/10 text-teal-400' : 'border-white/6 text-slate-500 hover:text-slate-400')}
              >
                {label}
              </button>
            ))}
          </div>
        )}

        <Card className="mb-4">
          <div className="text-xs font-display font-semibold text-slate-500 uppercase tracking-wider mb-3">Select Spots</div>
          <div className="flex flex-col gap-2">
            {availableRanges.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => toggle(id)}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg border text-left transition-all',
                  selected.includes(id) ? 'border-teal-400/40 bg-teal-400/8 text-slate-200' : 'border-white/6 bg-white/2 text-slate-500 hover:bg-white/5 hover:text-slate-400'
                )}
              >
                <div className={cn('w-4 h-4 rounded border flex items-center justify-center flex-shrink-0', selected.includes(id) ? 'border-teal-400 bg-teal-400' : 'border-slate-600')}>
                  {selected.includes(id) && (
                    <svg viewBox="0 0 10 8" className="w-2.5 h-2.5 text-navy-900">
                      <path d="M1 4l3 3 5-6" stroke="currentColor" strokeWidth={1.5} fill="none" />
                    </svg>
                  )}
                </div>
                <span className="font-display font-medium text-sm">{label}</span>
              </button>
            ))}
          </div>
        </Card>

        <Card className="mb-6">
          <div className="text-xs font-display font-semibold text-slate-500 uppercase tracking-wider mb-3">Spots per Session</div>
          <div className="flex gap-2">
            {[5, 10, 15, 20].map((n) => (
              <button
                key={n}
                onClick={() => setSpots(n)}
                className={cn('flex-1 py-2 rounded-lg font-display font-semibold text-sm border transition-all', spots === n ? 'border-teal-400/40 bg-teal-400/10 text-teal-400' : 'border-white/6 text-slate-500 hover:text-slate-400')}
              >
                {n}
              </button>
            ))}
          </div>
        </Card>

        <Button variant="primary" size="lg" fullWidth disabled={selected.length === 0} onClick={() => onStart(selected, spots)}>
          Start Drill →
        </Button>

        <p className="text-center text-xs text-slate-600 mt-4">
          ⚠ Sample / Imported / Estimated training data · Off-table study only
        </p>
      </div>
    );
  }

  // ── Range grid display ────────────────────────────────────────────────

  function RangeGrid({ range, highlightedCombo }) {
    const actionMap = new Map();
    for (const a of range.actions) {
      const existing = actionMap.get(a.hand_combo);
      if (!existing || a.frequency > existing.frequency) {
        actionMap.set(a.hand_combo, { action: a.action, frequency: a.frequency });
      }
    }

    return (
      <div className="range-grid">
        {HAND_GRID_ORDER.map((combo) => {
          const data = actionMap.get(combo);
          let action = 'fold';
          if (data) {
            if (data.action === 'allin') {
              action = data.frequency >= 0.5 ? 'raise' : data.frequency >= 0.2 ? 'mixed' : 'fold';
            } else if (data.action === 'check') {
              action = data.frequency >= 0.5 ? 'check' : 'fold';
            } else {
              action = data.frequency >= 0.5 ? data.action : data.frequency >= 0.2 ? 'mixed' : 'fold';
            }
          }
          const isHighlighted = combo === highlightedCombo;
          return (
            <div
              key={combo}
              className={cn('range-cell', action, isHighlighted && 'highlighted')}
              title={`${combo}: ${data ? `${data.action} ${Math.round(data.frequency * 100)}%` : 'fold'}`}
            >
              {combo.slice(0, 2)}
            </div>
          );
        })}
      </div>
    );
  }

  // ── Drill screen ──────────────────────────────────────────────────────

  function DrillScreen({ spot, spotIndex, totalSpots, onAnswer }) {
    const { range, combo } = spot;

    const isPair = combo.length === 2 && combo[0] === combo[1];
    const isSuited = combo.endsWith('s');

    const getActions = () => {
      if (range.action_type === 'rfi') return ['fold', 'raise'];
      if (range.action_type === 'vs_open') return ['fold', 'call', 'raise'];
      if (range.action_type === 'vs_limp') return ['fold', 'check', 'call', 'raise'].filter((a) => a !== 'fold' || range.position_hero !== 'BB');
      if (range.action_type === 'three_bet') return ['fold', 'call', 'raise'];
      if (range.action_type === 'vs_three_bet') return ['fold', 'call', 'raise', 'four_bet'];
      if (range.action_type === 'vs_four_bet') return ['fold', 'call', 'raise'];
      if (range.action_type === 'blind_defense') return ['fold', 'call', 'raise'];
      if (range.action_type === 'push_fold') return ['fold', 'allin'];
      return ['fold', 'call', 'raise'];
    };

    const actions = getActions();

    // Build a short, plain-English context line per scenario type, plus
    // the data needed to render the visual table (villains shown, pot size,
    // action label bubble on whoever acted before hero).
    const getContext = () => {
      switch (range.action_type) {
        case 'rfi':
          return {
            text: `You are in ${getPositionFull(range.position_hero)}. Action folds to you.`,
            villains: [],
            potBB: 1.5,
            actingVillain: null,
            actingLabel: null,
          };
        case 'vs_open':
          return {
            text: `${range.facing_position} opens to ${range.raise_size_bb ?? 2.5}bb. You are in ${range.position_hero}.`,
            villains: [range.facing_position],
            potBB: (range.raise_size_bb ?? 2.5) + 1.5,
            actingVillain: range.facing_position,
            actingLabel: `Raises ${range.raise_size_bb ?? 2.5}bb`,
          };
        case 'vs_limp': {
          // Use a representative limper seat: one position before hero in the
          // standard order, purely for the visual (the range itself doesn't
          // track exact limper seat).
          const limperSeat = range.position_hero === 'BB' ? 'BTN' : range.position_hero === 'SB' ? 'BTN' : 'MP';
          return {
            text: `${limperSeat} limps in for 1bb. Action is on you in ${getPositionFull(range.position_hero)}.`,
            villains: [limperSeat],
            potBB: 2.5,
            actingVillain: limperSeat,
            actingLabel: 'Limps (calls 1bb)',
          };
        }
        case 'three_bet':
          return {
            text: `${range.facing_position} opens. You are in ${range.position_hero}. Do you 3-bet, call, or fold?`,
            villains: [range.facing_position],
            potBB: 2.5 + 1.5,
            actingVillain: range.facing_position,
            actingLabel: 'Opens 2.5bb',
          };
        case 'vs_four_bet':
          return {
            text: `You 3-bet, and ${range.facing_position} 4-bet back. You are in ${range.position_hero}. Continue or fold?`,
            villains: [range.facing_position],
            potBB: 24,
            actingVillain: range.facing_position,
            actingLabel: '4-Bets',
          };
        case 'push_fold':
          return {
            text: `${range.stack_depth_bb}bb effective. You are in ${getPositionFull(range.position_hero)}.${range.facing_position ? ` Folds to you, ${range.facing_position} in the blind.` : ' Action folds to you.'} Shove or fold?`,
            villains: range.facing_position ? [range.facing_position] : [],
            potBB: 1.5,
            actingVillain: null,
            actingLabel: null,
          };
        default:
          return {
            text: `Facing action from ${range.facing_position}. You are in ${range.position_hero}.`,
            villains: range.facing_position ? [range.facing_position] : [],
            potBB: 3,
            actingVillain: range.facing_position,
            actingLabel: null,
          };
      }
    };

    const context = getContext();
    const heroCards = (() => {
      const r1 = combo[0];
      const r2 = combo.length === 2 ? combo[1] : combo[1];
      const suited = combo.endsWith('s');
      const pair = combo.length === 2 && combo[0] === combo[1];
      return pair ? [`${r1}s`, `${r2}h`] : suited ? [`${r1}s`, `${r2}s`] : [`${r1}s`, `${r2}h`];
    })();

    return (
      <div>
        <div className="flex items-center gap-3 mb-5">
          <ProgressBar value={(spotIndex / totalSpots) * 100} className="flex-1" />
          <span className="text-xs text-slate-500 flex-shrink-0 font-mono">{spotIndex}/{totalSpots}</span>
        </div>

        <Card className="mb-4">
          <div className="flex items-center gap-2 flex-wrap mb-3">
            <Badge variant="teal">{getActionTypeFull(range.action_type)}</Badge>
            <Badge variant="default">{range.position_hero}</Badge>
            {range.facing_position && <Badge variant="default">vs {range.facing_position}</Badge>}
            <Badge variant="default">{range.stack_depth_bb}bb</Badge>
            <SourceLabel sourceType={range.source_type} />
          </div>

          <div className="text-sm text-slate-400 mb-1">{context.text}</div>
          <div className="text-xs text-slate-600">
            {range.action_type === 'push_fold' ? `${range.stack_depth_bb}bb effective · 6-max MTT · Push/fold only` : '100bb effective stacks · 6-max cash game'}
          </div>
        </Card>

        <Card className="mb-5 py-4">
          <PokerTable
            heroPosition={range.position_hero}
            villainPositions={context.villains}
            heroCards={heroCards}
            potBB={context.potBB}
            heroStackBB={range.stack_depth_bb}
            dealerPosition="BTN"
            activeSeat={context.actingVillain}
            actionLabel={context.actingLabel}
          />
          <div className="text-center mt-2">
            <div className="font-mono text-lg font-bold text-slate-300">{combo}</div>
            <div className="text-xs text-slate-600">{combo.endsWith('s') ? 'Suited' : combo.endsWith('o') ? 'Offsuit' : 'Pocket pair'}</div>
          </div>
        </Card>

        <div className="text-center mb-5">
          <p className="font-display font-semibold text-slate-200 text-lg">What is your action?</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {actions.map((action) => (
            <button key={action} onClick={() => onAnswer(action)} className={cn('action-btn', getActionColor(action))}>
              {getActionLabel(action)}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // ── Feedback screen ──────────────────────────────────────────────────

  function FeedbackScreen({ spot, userAction, result, explanation, onNext, isLast }) {
    const isCorrect = result.is_correct;
    const isAcceptable = result.feedback_label === 'acceptable';
    const isMistake = !isCorrect && !isAcceptable;
    const gtowScore = result.gtow_score ?? (isCorrect ? 100 : -50);
    const scoreInfo = getGTOWScoreLabel(gtowScore);
    const userFreq = result.user_freq ?? (isCorrect ? spot.frequency : 0);
    const correctFreq = result.correct_freq ?? spot.frequency;
    const isMixed = correctFreq < 0.75 && correctFreq > 0.15;

    // All actions for this combo for EV comparison
    const allActions = spot.allActions || [];

    return (
      <div>
        {/* GTOW Score Banner */}
        <div className={cn('rounded-xl p-4 mb-4 border', isCorrect ? 'feedback-correct' : isAcceptable ? 'feedback-acceptable' : 'feedback-mistake')}>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">{isCorrect ? '✅' : isAcceptable ? '⚠️' : '❌'}</span>
            <span className={cn('font-display font-bold text-lg', isCorrect ? 'text-gto-green' : isAcceptable ? 'text-gold-400' : 'text-gto-red')}>
              {isCorrect ? 'Correct!' : isAcceptable ? 'Acceptable' : isMistake && result.feedback_label === 'big_mistake' ? 'Blunder!' : 'Mistake'}
            </span>
            {/* GTOW Score chip */}
            <div className="ml-auto flex items-center gap-2">
              <div className="px-2 py-1 rounded-lg text-xs font-display font-bold" style={{ background: `${scoreInfo.color}22`, color: scoreInfo.color, border: `1px solid ${scoreInfo.color}44` }}>
                GTOW {gtowScore > 0 ? '+' : ''}{gtowScore}
              </div>
              <span className="text-gold-400 font-display font-bold text-xs">+{result.xp_earned}XP</span>
            </div>
          </div>

          <div className="flex gap-4 text-sm flex-wrap mb-2">
            <div>
              <span className="text-slate-500 text-xs">Your action: </span>
              <span className={cn('font-semibold text-sm', isCorrect ? 'text-gto-green' : isAcceptable ? 'text-gold-400' : 'text-gto-red')}>{getActionLabel(userAction)}</span>
              {userFreq > 0 && !isCorrect && <span className="text-slate-600 text-xs ml-1">({Math.round(userFreq * 100)}% GTO)</span>}
            </div>
            {!isCorrect && (
              <div>
                <span className="text-slate-500 text-xs">Best action: </span>
                <span className="font-semibold text-sm text-gto-green">{getActionLabel(spot.correctAction)}</span>
                <span className="text-slate-600 text-xs ml-1">({Math.round(correctFreq * 100)}% GTO)</span>
              </div>
            )}
          </div>

          {/* Trickiness indicator */}
          {isMixed && (
            <div className="flex items-center gap-2 mt-1 py-1 px-2 rounded-lg bg-purple-500/10 border border-purple-500/20">
              <span className="text-xs text-purple-400">🎲 Mixed spot:</span>
              <span className="text-xs text-slate-400">GTO mixes actions here — not a pure play</span>
            </div>
          )}

          {result.ev_loss_bb > 0 && !isCorrect && (
            <div className="text-xs mt-2">
              <span className="text-slate-500">Est. EV loss: </span>
              <span className="text-gto-red font-mono font-bold">-{result.ev_loss_bb.toFixed(2)} bb</span>
              <span className="text-slate-600 ml-1">(sample data estimate)</span>
            </div>
          )}
        </div>

        {/* EV Comparison bars — shows all actions for this combo */}
        {allActions.length > 1 && (
          <Card className="mb-4">
            <div className="text-xs font-display font-semibold text-slate-500 uppercase tracking-wider mb-3">
              Action Frequencies for {spot.combo}
            </div>
            <div className="flex flex-col gap-2">
              {allActions.sort((a, b) => b.frequency - a.frequency).map((a) => {
                const isChosen = a.action === userAction;
                const isBest = a.action === spot.correctAction;
                const color = isBest ? '#00cc66' : isChosen ? '#ff4444' : '#475569';
                return (
                  <div key={a.action} className="flex items-center gap-2">
                    <div className="w-16 text-xs font-display font-semibold flex-shrink-0" style={{ color }}>
                      {getActionLabel(a.action)}
                      {isChosen && ' ←'}
                    </div>
                    <div className="flex-1 h-5 bg-white/5 rounded overflow-hidden">
                      <div className="h-full rounded transition-all" style={{ width: `${Math.round(a.frequency * 100)}%`, background: color, opacity: 0.8 }} />
                    </div>
                    <div className="w-8 text-xs text-right font-mono" style={{ color }}>{Math.round(a.frequency * 100)}%</div>
                  </div>
                );
              })}
            </div>
          </Card>
        )}

        {/* Range grid */}
        <Card className="mb-4">
          <div className="text-xs font-display font-semibold text-slate-500 uppercase tracking-wider mb-3">
            Range Visualization — {spot.range.position_hero} {getActionTypeFull(spot.range.action_type)}
          </div>
          <RangeGrid range={spot.range} highlightedCombo={spot.combo} />
          <div className="flex gap-3 mt-3 text-xs text-slate-600 flex-wrap">
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-gto-green/70 inline-block" />Raise/Push</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-teal-500/70 inline-block" />Call</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-slate-400/45 inline-block" />Check</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-white/10 inline-block" />Fold</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-gold-400/80 inline-block border border-gold-400" />This hand</span>
          </div>
        </Card>

        {/* GTO Wizard-style explanation with "why" */}
        <Card className="mb-5">
          <div className="text-xs font-display font-semibold text-slate-500 uppercase tracking-wider mb-3">🧠 GTO Explanation</div>
          <div className="text-sm text-slate-300 leading-relaxed">
            {explanation && explanation.split('\n').map((line, i) => {
              if (!line.trim()) return null;
              const formatted = line.replace(/\*\*(.*?)\*\*/g, (_, t) => `<strong>${t}</strong>`);
              return <p key={i} className="mb-2" dangerouslySetInnerHTML={{ __html: formatted }} />;
            })}
          </div>
          <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between">
            <SourceLabel sourceType={spot.range.source_type} />
          </div>
        </Card>

        <Button variant="primary" size="lg" fullWidth onClick={onNext}>
          {isLast ? 'See Results →' : 'Next Spot →'}
        </Button>
      </div>
    );
  }

  // ── Session End ────────────────────────────────────────────────────────

  function SessionEndScreen({ answers, onRestart, navigate }) {
    const total = answers.length;
    const correct = answers.filter((a) => a.is_correct).length;
    const accuracy = Math.round((correct / total) * 100);
    const totalEV = answers.reduce((sum, a) => sum + (a.ev_loss_bb ?? 0), 0);
    const avgGTOW = Math.round(answers.reduce((sum, a) => sum + (a.gtow_score ?? (a.is_correct ? 100 : -50)), 0) / total);
    const gtowInfo = getGTOWScoreLabel(avgGTOW);

    // Action breakdown
    const actionBreakdown = {};
    for (const a of answers) {
      const k = `${a.correct_action}`;
      actionBreakdown[k] = (actionBreakdown[k] || { total: 0, correct: 0 });
      actionBreakdown[k].total++;
      if (a.is_correct) actionBreakdown[k].correct++;
    }

    return (
      <div>
        <div className="text-center mb-6">
          <div className="text-5xl mb-3">{avgGTOW >= 70 ? '🏆' : avgGTOW >= 40 ? '💪' : '📚'}</div>
          <h2 className="font-display font-bold text-2xl text-slate-100">Session Complete</h2>
          <p className="text-slate-500 text-sm mt-1">{total} spots drilled</p>
        </div>

        {/* GTOW Score prominent display */}
        <div className="rounded-xl p-5 mb-4 text-center" style={{ background: `${gtowInfo.color}11`, border: `1px solid ${gtowInfo.color}33` }}>
          <div className="text-xs text-slate-500 mb-1">GTOW SCORE</div>
          <div className="text-5xl font-display font-bold mb-1" style={{ color: gtowInfo.color }}>
            {avgGTOW > 0 ? '+' : ''}{avgGTOW}
          </div>
          <div className="text-sm font-display font-semibold" style={{ color: gtowInfo.color }}>{gtowInfo.emoji} {gtowInfo.label}</div>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-5">
          <Card className="text-center">
            <div className={cn('text-2xl font-display font-bold', accuracy >= 70 ? 'text-gto-green' : 'text-gto-red')}>{accuracy}%</div>
            <div className="text-xs text-slate-500 mt-1">Accuracy</div>
          </Card>
          <Card className="text-center">
            <div className="text-2xl font-display font-bold text-slate-200">{correct}/{total}</div>
            <div className="text-xs text-slate-500 mt-1">Correct</div>
          </Card>
          <Card className="text-center">
            <div className="text-2xl font-display font-bold text-gto-red">-{totalEV.toFixed(1)}</div>
            <div className="text-xs text-slate-500 mt-1">bb lost*</div>
          </Card>
        </div>

        {/* Action breakdown — what types of spots did the trainee get right? */}
        {Object.keys(actionBreakdown).length > 1 && (
          <Card className="mb-5">
            <div className="text-xs font-display font-semibold text-slate-500 uppercase tracking-wider mb-3">Performance by Action Type</div>
            <div className="flex flex-col gap-2">
              {Object.entries(actionBreakdown).sort((a, b) => b[1].total - a[1].total).map(([action, stats]) => {
                const pct = Math.round((stats.correct / stats.total) * 100);
                return (
                  <div key={action} className="flex items-center gap-2">
                    <div className="w-16 text-xs font-display font-semibold text-slate-400 flex-shrink-0">{getActionLabel(action)}</div>
                    <div className="flex-1 h-4 bg-white/5 rounded overflow-hidden">
                      <div className="h-full rounded" style={{ width: `${pct}%`, background: pct >= 70 ? '#00cc66' : pct >= 40 ? '#ffb800' : '#ff4444' }} />
                    </div>
                    <div className="text-xs font-mono text-slate-500 w-14 text-right">{stats.correct}/{stats.total} ({pct}%)</div>
                  </div>
                );
              })}
            </div>
          </Card>
        )}

        <p className="text-xs text-slate-600 text-center mb-4">* EV estimates based on sample training data — not solver-verified</p>

        <div className="flex gap-3">
          <Button variant="secondary" size="lg" className="flex-1" onClick={onRestart}>Drill Again</Button>
          <Button variant="primary" size="lg" className="flex-1" onClick={() => navigate('dashboard')}>Dashboard →</Button>
        </div>
      </div>
    );
  }

  // ── Main ────────────────────────────────────────────────────────────────

  function PreflopTrainerPage({ navigate }) {
    const [mode, setMode] = React.useState('config');
    const [spots, setSpots] = React.useState([]);
    const [currentIndex, setCurrentIndex] = React.useState(0);
    const [userAction, setUserAction] = React.useState(null);
    const [scoreResult, setScoreResult] = React.useState(null);
    const [explanation, setExplanation] = React.useState(null);
    const [sessionAnswers, setSessionAnswers] = React.useState([]);

    const generateSpots = (rangeIds, count) => {
      const selectedRanges = ALL_RANGES.filter((r) => rangeIds.includes(r.id));
      if (selectedRanges.length === 0) return [];

      const result = [];
      const usedCombos = new Set();
      const actionCounts = {}; // track action distribution for balancing

      for (let i = 0; i < count; i++) {
        const range = selectedRanges[i % selectedRanges.length];
        let spotData;
        let attempts = 0;
        do {
          spotData = getRandomComboFromRange(range, actionCounts);
          attempts++;
        } while (usedCombos.has(`${range.id}-${spotData.combo}`) && attempts < 25);

        usedCombos.add(`${range.id}-${spotData.combo}`);
        // Track action counts for balancing next picks
        actionCounts[spotData.correctAction] = (actionCounts[spotData.correctAction] || 0) + 1;
        result.push({ range, ...spotData });
      }
      return result;
    };


    const handleStart = (rangeIds, spotsPerSession) => {
      const newSpots = generateSpots(rangeIds, spotsPerSession);
      setSpots(newSpots);
      setCurrentIndex(0);
      setSessionAnswers([]);
      startSession('preflop');
      setMode('drilling');
    };

    const handleAnswer = (action) => {
      const spot = spots[currentIndex];
      // Get all GTO actions for this combo for proper EV comparison display
      const comboAllActions = spot.allActions || getComboAllActions(spot.range.id, spot.combo);
      const result = scoreAnswer(action, spot.correctAction, null, null, comboAllActions, spot.frequency);
      setUserAction(action);
      setScoreResult(result);

      const answer = {
        spot_id: `preflop-${spot.range.id}-${spot.combo}`,
        spot_type: 'preflop',
        user_action: action,
        correct_action: spot.correctAction,
        is_correct: result.is_correct,
        ev_loss_bb: result.ev_loss_bb,
        ev_is_estimated: result.ev_is_estimated,
        time_to_answer_ms: 0,
        position: spot.range.position_hero,
        action_type: spot.range.action_type,
        gtow_score: result.gtow_score,
      };

      recordAnswer(answer);
      addXP(result.xp_earned);
      updateMissionProgress('preflop');

      setSessionAnswers((prev) => [...prev, answer]);
      setExplanation(getFallbackExplanation({
        spot_type: 'preflop',
        position: spot.range.position_hero,
        user_action: action,
        correct_action: spot.correctAction,
        is_correct: result.is_correct,
        source_type: spot.range.source_type,
        preflop_action_type: spot.range.action_type,
        frequency: spot.frequency,
        user_freq: result.user_freq,
        correct_freq: result.correct_freq,
        gtow_score: result.gtow_score,
        combo: spot.combo,
      }));
      setMode('feedback');
    };


    const handleNext = () => {
      const isLast = currentIndex >= spots.length - 1;
      if (isLast) {
        endSession();
        checkAndAwardBadges();
        setMode('session-end');
      } else {
        setCurrentIndex((i) => i + 1);
        setUserAction(null);
        setScoreResult(null);
        setExplanation(null);
        setMode('drilling');
      }
    };

    const handleRestart = () => {
      setMode('config');
      setCurrentIndex(0);
      setSessionAnswers([]);
      setUserAction(null);
      setScoreResult(null);
      setExplanation(null);
    };

    return (
      <AppShell route="preflop" navigate={navigate}>
        <div className="max-w-lg mx-auto px-4 pt-6 pb-4">
          {mode === 'config' && <ConfigScreen onStart={handleStart} navigate={navigate} />}

          {mode === 'drilling' && spots[currentIndex] && (
            <>
              <div className="flex items-center justify-between mb-5">
                <button onClick={handleRestart} className="text-slate-500 hover:text-slate-400 text-sm">← Config</button>
                <h1 className="font-display font-bold text-slate-100">Preflop Trainer</h1>
                <div className="text-xs text-slate-600">{currentIndex + 1}/{spots.length}</div>
              </div>
              <DrillScreen spot={spots[currentIndex]} spotIndex={currentIndex} totalSpots={spots.length} onAnswer={handleAnswer} />
            </>
          )}

          {mode === 'feedback' && spots[currentIndex] && userAction && scoreResult && (
            <>
              <div className="flex items-center justify-between mb-5">
                <div className="text-xs text-slate-600 font-mono">{currentIndex + 1}/{spots.length}</div>
                <h1 className="font-display font-bold text-slate-100">Feedback</h1>
                <div />
              </div>
              <FeedbackScreen spot={spots[currentIndex]} userAction={userAction} result={scoreResult} explanation={explanation} onNext={handleNext} isLast={currentIndex >= spots.length - 1} />
            </>
          )}

          {mode === 'session-end' && (
            <>
              <div className="flex items-center justify-between mb-5">
                <div /><h1 className="font-display font-bold text-slate-100">Session Summary</h1><div />
              </div>
              <SessionEndScreen answers={sessionAnswers} onRestart={handleRestart} navigate={navigate} />
            </>
          )}
        </div>
      </AppShell>
    );
  }

  window.GTOPages = window.GTOPages || {};
  window.GTOPages.Preflop = PreflopTrainerPage;
})();
