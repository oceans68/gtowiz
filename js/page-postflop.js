/**
 * GTO Drill Coach — Postflop Trainer Page (Static Bundle)
 */
(function () {
  const { Card, Button, Badge, ProgressBar, SourceLabel, PlayingCard, AppShell } = window.GTOComponents;
  const { cn, getActionLabel, getActionColor } = window.GTOUtils;
  const { POSTFLOP_SPOTS } = window.GTOData;
  const { startSession, recordAnswer, endSession, addXP, updateMissionProgress, checkAndAwardBadges } = window.GTOStore;
  const { getFallbackExplanation } = window.GTOExplain;

  function BoardDisplay({ cards }) {
    return (
      <div className="flex gap-2 justify-center flex-wrap">
        {cards.map((card, i) => <PlayingCard key={i} card={card} size="lg" />)}
      </div>
    );
  }

  function ConfigScreen({ onStart, navigate }) {
    const [count, setCount] = React.useState(5);
    const [difficulty, setDifficulty] = React.useState('all');

    return (
      <div className="max-w-lg mx-auto px-4 pt-6">
        <div className="mb-6">
          <a href="#/dashboard" onClick={(e) => { e.preventDefault(); navigate('dashboard'); }} className="text-slate-500 hover:text-slate-400 text-sm">← Dashboard</a>
          <h1 className="font-display font-bold text-2xl text-slate-100 mt-2">Postflop Quiz</h1>
          <p className="text-slate-500 text-sm mt-1">Board texture · C-bet strategy · Pot control</p>
        </div>

        <Card className="mb-4">
          <div className="text-xs font-display font-semibold text-slate-500 uppercase tracking-wider mb-3">Difficulty</div>
          <div className="flex gap-2 flex-wrap">
            {[
              { value: 'all', label: 'Mixed' },
              { value: 'beginner', label: 'Beginner' },
              { value: 'intermediate', label: 'Intermediate' },
              { value: 'advanced', label: 'Advanced' },
            ].map(({ value, label }) => (
              <button
                key={value}
                onClick={() => setDifficulty(value)}
                className={cn('flex-1 py-2 rounded-lg font-display font-semibold text-xs border transition-all min-w-[70px]', difficulty === value ? 'border-teal-400/40 bg-teal-400/10 text-teal-400' : 'border-white/6 text-slate-500 hover:text-slate-400')}
              >
                {label}
              </button>
            ))}
          </div>
        </Card>

        <Card className="mb-6">
          <div className="text-xs font-display font-semibold text-slate-500 uppercase tracking-wider mb-3">Spots per Session</div>
          <div className="flex gap-2">
            {[3, 5, 8, 10].map((n) => (
              <button
                key={n}
                onClick={() => setCount(n)}
                className={cn('flex-1 py-2 rounded-lg font-display font-semibold text-sm border transition-all', count === n ? 'border-teal-400/40 bg-teal-400/10 text-teal-400' : 'border-white/6 text-slate-500 hover:text-slate-400')}
              >
                {n}
              </button>
            ))}
          </div>
        </Card>

        <Card className="mb-6 border border-amber-400/15 bg-amber-400/5">
          <div className="text-xs font-display font-semibold text-amber-400 mb-2">What to expect</div>
          <ul className="text-xs text-slate-400 space-y-1">
            <li>• Board texture shown with pot size and SPR</li>
            <li>• Choose your bet size or check/fold</li>
            <li>• Feedback explains the GTO concept</li>
            <li>• EV loss scored (estimated for sample data)</li>
          </ul>
        </Card>

        <Button variant="primary" size="lg" fullWidth onClick={() => onStart(count, difficulty)}>Start Quiz →</Button>
        <p className="text-center text-xs text-slate-600 mt-4">⚠ Sample training data · Estimated EV · Off-table study only</p>
      </div>
    );
  }

  function PostflopDrillScreen({ spot, spotIndex, totalSpots, onAnswer }) {
    const spr = spot.spr_approx.toFixed(1);
    const street = spot.street.charAt(0).toUpperCase() + spot.street.slice(1);
    const availableActions = spot.actions.map((a) => a.action);

    const tagColors = {
      'dry-board': 'bg-blue-400/10 text-blue-400',
      'wet-board': 'bg-amber-400/10 text-amber-400',
      'connected': 'bg-orange-400/10 text-orange-400',
      'monotone': 'bg-purple-400/10 text-purple-400',
      'paired-board': 'bg-slate-400/10 text-slate-400',
      '3-bet-pot': 'bg-red-400/10 text-red-400',
      '4-bet-pot': 'bg-red-400/10 text-red-400',
      'IP': 'bg-teal-400/10 text-teal-400',
      'OOP': 'bg-yellow-400/10 text-yellow-400',
    };

    return (
      <div>
        <div className="flex items-center gap-3 mb-5">
          <ProgressBar value={(spotIndex / totalSpots) * 100} className="flex-1" />
          <span className="text-xs text-slate-500 flex-shrink-0 font-mono">{spotIndex}/{totalSpots}</span>
        </div>

        <Card className="mb-4">
          <div className="flex items-center gap-2 flex-wrap mb-3">
            <Badge variant="teal">{street}</Badge>
            <Badge variant="default">{spot.position_hero} vs {spot.position_villain}</Badge>
            <Badge variant="default">{spot.stack_depth_bb}bb</Badge>
            <Badge variant={spot.difficulty === 'advanced' ? 'red' : spot.difficulty === 'intermediate' ? 'gold' : 'green'}>{spot.difficulty}</Badge>
            <SourceLabel sourceType={spot.source_type} />
          </div>

          <p className="text-sm text-slate-400 mb-3">{spot.preflop_action_summary}</p>

          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-white/4 rounded-lg p-2">
              <div className="text-xs text-slate-500 mb-0.5">Pot</div>
              <div className="font-display font-bold text-slate-200 text-sm">{spot.pot_size_bb} bb</div>
            </div>
            <div className="bg-white/4 rounded-lg p-2">
              <div className="text-xs text-slate-500 mb-0.5">Stack</div>
              <div className="font-display font-bold text-slate-200 text-sm">{spot.hero_stack_bb} bb</div>
            </div>
            <div className="bg-white/4 rounded-lg p-2">
              <div className="text-xs text-slate-500 mb-0.5">SPR</div>
              <div className="font-display font-bold text-slate-200 text-sm">{spr}</div>
            </div>
          </div>
        </Card>

        <Card className="mb-4 flex flex-col items-center py-5">
          <div className="text-xs font-display font-semibold text-slate-500 uppercase tracking-wider mb-4">Board</div>
          <BoardDisplay cards={spot.board_cards} />
          <div className="flex flex-wrap gap-1.5 justify-center mt-4">
            {spot.concept_tags.map((tag) => (
              <span key={tag} className={cn('text-xs px-2 py-0.5 rounded-full font-display font-medium', tagColors[tag] ?? 'bg-slate-400/10 text-slate-400')}>{tag}</span>
            ))}
          </div>
        </Card>

        <Card className="mb-5">
          <div className="text-xs font-display font-semibold text-slate-500 uppercase tracking-wider mb-1">Your Range</div>
          <p className="text-sm text-slate-400">{spot.hand_range_description}</p>
          {spot.hand_combo && (
            <div className="mt-2 flex gap-2">
              <PlayingCard card={spot.hand_combo.slice(0, 2)} />
              <PlayingCard card={spot.hand_combo.slice(2)} />
            </div>
          )}
        </Card>

        <div className="text-center mb-4">
          <p className="font-display font-semibold text-slate-200 text-lg">
            {spot.position_hero === spot.position_villain ? 'Your action?' : `You are ${spot.position_hero} — your action?`}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {availableActions.map((action) => (
            <button key={action} onClick={() => onAnswer(action)} className={cn('action-btn', getActionColor(action))}>
              {getActionLabel(action)}
            </button>
          ))}
        </div>
      </div>
    );
  }

  function PostflopFeedbackScreen({ spot, userAction, explanation, onNext, isLast }) {
    const chosenAction = spot.actions.find((a) => a.action === userAction);
    const bestAction = spot.actions.find((a) => a.is_recommended);
    const isCorrect = chosenAction?.is_recommended ?? false;
    const isAcceptable = chosenAction?.is_acceptable ?? false;
    const evLoss = chosenAction?.ev_loss_vs_best ?? 0;
    const feedbackType = isCorrect ? 'correct' : isAcceptable ? 'acceptable' : 'mistake';

    return (
      <div>
        <div className={cn('rounded-xl p-4 mb-4 border', `feedback-${feedbackType}`)}>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">{isCorrect ? '✅' : isAcceptable ? '⚠️' : '❌'}</span>
            <span className={cn('font-display font-bold text-lg', isCorrect ? 'text-gto-green' : isAcceptable ? 'text-gold-400' : 'text-gto-red')}>
              {isCorrect ? 'Correct!' : isAcceptable ? 'Acceptable' : 'Mistake'}
            </span>
          </div>

          <div className="space-y-1 text-sm">
            <div>
              <span className="text-slate-500">Your action: </span>
              <span className={cn('font-semibold', isCorrect ? 'text-gto-green' : isAcceptable ? 'text-gold-400' : 'text-gto-red')}>{getActionLabel(userAction)}</span>
              {chosenAction?.frequency != null && <span className="text-slate-600 ml-1">({Math.round(chosenAction.frequency * 100)}% freq)</span>}
            </div>
            {!isCorrect && bestAction && (
              <div>
                <span className="text-slate-500">Best action: </span>
                <span className="font-semibold text-gto-green">{getActionLabel(bestAction.action)} ({Math.round(bestAction.frequency * 100)}% freq)</span>
              </div>
            )}
            {evLoss > 0 && (
              <div className="text-xs">
                <span className="text-slate-500">Estimated EV loss: </span>
                <span className="text-gto-red font-mono">-{evLoss.toFixed(2)} bb</span>
                <span className="text-slate-600 ml-1">(estimated — not solver-verified)</span>
              </div>
            )}
          </div>
        </div>

        <Card className="mb-4">
          <div className="text-xs font-display font-semibold text-slate-500 uppercase tracking-wider mb-3">Action Breakdown</div>
          <div className="space-y-2">
            {spot.actions.map((a) => (
              <div key={a.action} className="flex items-center gap-3">
                <div className={cn('w-20 text-xs font-display font-semibold flex-shrink-0', a.is_recommended ? 'text-gto-green' : a.is_acceptable ? 'text-gold-400' : 'text-slate-500')}>
                  {getActionLabel(a.action)}
                </div>
                <div className="flex-1 bg-white/5 rounded-full h-2 overflow-hidden">
                  <div className={cn('h-2 rounded-full', a.action === userAction ? 'bg-teal-500' : a.is_recommended ? 'bg-gto-green/60' : 'bg-white/15')} style={{ width: `${Math.round(a.frequency * 100)}%` }} />
                </div>
                <div className="text-xs text-slate-500 w-10 text-right font-mono">{Math.round(a.frequency * 100)}%</div>
                {a.is_recommended && <span className="text-xs text-gto-green">✓ Best</span>}
                {a.action === userAction && !a.is_recommended && <span className="text-xs text-teal-400">← You</span>}
              </div>
            ))}
          </div>
        </Card>

        <Card className="mb-5">
          <div className="text-xs font-display font-semibold text-slate-500 uppercase tracking-wider mb-3">🧠 Explanation</div>
          <div className="text-sm text-slate-300 whitespace-pre-line leading-relaxed">{explanation}</div>
          <div className="mt-3 pt-3 border-t border-white/5 flex items-center gap-2 flex-wrap">
            <SourceLabel sourceType={spot.source_type} />
            <span className="text-xs text-slate-600">EV values are estimated</span>
          </div>
        </Card>

        <Button variant="primary" size="lg" fullWidth onClick={onNext}>{isLast ? 'See Results →' : 'Next Spot →'}</Button>
      </div>
    );
  }

  function PostflopSessionEnd({ answers, onRestart, navigate }) {
    const total = answers.length;
    const correct = answers.filter((a) => a.is_correct).length;
    const accuracy = Math.round((correct / total) * 100);
    const totalEV = answers.reduce((sum, a) => sum + (a.ev_loss_bb ?? 0), 0);

    return (
      <div>
        <div className="text-center mb-6">
          <div className="text-5xl mb-3">{accuracy >= 70 ? '🎯' : '📚'}</div>
          <h2 className="font-display font-bold text-2xl text-slate-100">Quiz Complete</h2>
          <p className="text-slate-500 text-sm mt-1">{total} postflop spots studied</p>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-5">
          <Card className="text-center">
            <div className={cn('text-2xl font-display font-bold', accuracy >= 60 ? 'text-gto-green' : 'text-gto-red')}>{accuracy}%</div>
            <div className="text-xs text-slate-500 mt-1">Accuracy</div>
          </Card>
          <Card className="text-center">
            <div className="text-2xl font-display font-bold text-slate-200">{correct}/{total}</div>
            <div className="text-xs text-slate-500 mt-1">Correct</div>
          </Card>
          <Card className="text-center">
            <div className="text-2xl font-display font-bold text-gto-red">-{totalEV.toFixed(2)}</div>
            <div className="text-xs text-slate-500 mt-1">bb* lost</div>
          </Card>
        </div>

        <p className="text-xs text-slate-600 text-center mb-5">* Estimated training score — not solver-verified EV</p>

        <div className="flex gap-3">
          <Button variant="secondary" size="lg" className="flex-1" onClick={onRestart}>Drill Again</Button>
          <Button variant="primary" size="lg" className="flex-1" onClick={() => navigate('dashboard')}>Dashboard →</Button>
        </div>
      </div>
    );
  }

  function PostflopTrainerPage({ navigate }) {
    const [mode, setMode] = React.useState('config');
    const [spots, setSpots] = React.useState([]);
    const [currentIndex, setCurrentIndex] = React.useState(0);
    const [userAction, setUserAction] = React.useState(null);
    const [explanation, setExplanation] = React.useState(null);
    const [sessionAnswers, setSessionAnswers] = React.useState([]);

    const generateSpots = (count, difficulty) => {
      const pool = difficulty === 'all' ? POSTFLOP_SPOTS.filter((s) => s.is_active) : POSTFLOP_SPOTS.filter((s) => s.is_active && s.difficulty === difficulty);
      const shuffled = [...pool].sort(() => Math.random() - 0.5);
      return shuffled.slice(0, Math.min(count, shuffled.length));
    };

    const handleStart = (count, difficulty) => {
      const newSpots = generateSpots(count, difficulty);
      setSpots(newSpots);
      setCurrentIndex(0);
      setSessionAnswers([]);
      startSession('postflop');
      setMode('drilling');
    };

    const handleAnswer = (action) => {
      const spot = spots[currentIndex];
      const chosenPostflopAction = spot.actions.find((a) => a.action === action);
      const bestAction = spot.actions.find((a) => a.is_recommended);

      const isCorrect = chosenPostflopAction?.is_recommended ?? false;
      const evLoss = chosenPostflopAction?.ev_loss_vs_best ?? 0.3;
      const xpEarned = isCorrect ? 15 : chosenPostflopAction?.is_acceptable ? 8 : 5;

      const answer = {
        spot_id: spot.id,
        spot_type: 'postflop',
        user_action: action,
        correct_action: bestAction?.action ?? 'check',
        is_correct: isCorrect,
        ev_loss_bb: evLoss,
        ev_is_estimated: true,
        time_to_answer_ms: 0,
      };

      setUserAction(action);
      recordAnswer(answer);
      addXP(xpEarned);
      updateMissionProgress('postflop');
      setSessionAnswers((prev) => [...prev, answer]);

      setExplanation(getFallbackExplanation({
        spot_type: 'postflop',
        position_hero: spot.position_hero,
        board_cards: spot.board_cards,
        user_action: action,
        correct_action: bestAction?.action ?? 'check',
        source_type: spot.source_type,
        concept_tags: spot.concept_tags,
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
        setExplanation(null);
        setMode('drilling');
      }
    };

    const handleRestart = () => {
      setMode('config');
      setCurrentIndex(0);
      setSessionAnswers([]);
      setUserAction(null);
      setExplanation(null);
    };

    return (
      <AppShell route="postflop" navigate={navigate}>
        <div className="max-w-lg mx-auto px-4 pt-6 pb-4">
          {mode === 'config' && <ConfigScreen onStart={handleStart} navigate={navigate} />}

          {mode === 'drilling' && spots[currentIndex] && (
            <>
              <div className="flex items-center justify-between mb-5">
                <button onClick={handleRestart} className="text-slate-500 hover:text-slate-400 text-sm">← Config</button>
                <h1 className="font-display font-bold text-slate-100">Postflop Quiz</h1>
                <div className="text-xs text-slate-600">{currentIndex + 1}/{spots.length}</div>
              </div>
              <PostflopDrillScreen spot={spots[currentIndex]} spotIndex={currentIndex} totalSpots={spots.length} onAnswer={handleAnswer} />
            </>
          )}

          {mode === 'feedback' && spots[currentIndex] && userAction && (
            <>
              <div className="flex items-center justify-between mb-5">
                <div className="text-xs text-slate-600 font-mono">{currentIndex + 1}/{spots.length}</div>
                <h1 className="font-display font-bold text-slate-100">Feedback</h1>
                <div />
              </div>
              <PostflopFeedbackScreen spot={spots[currentIndex]} userAction={userAction} explanation={explanation} onNext={handleNext} isLast={currentIndex >= spots.length - 1} />
            </>
          )}

          {mode === 'session-end' && (
            <>
              <div className="flex items-center justify-between mb-5"><div /><h1 className="font-display font-bold text-slate-100">Session Summary</h1><div /></div>
              <PostflopSessionEnd answers={sessionAnswers} onRestart={handleRestart} navigate={navigate} />
            </>
          )}
        </div>
      </AppShell>
    );
  }

  window.GTOPages = window.GTOPages || {};
  window.GTOPages.Postflop = PostflopTrainerPage;
})();
