/**
 * GTO Drill Coach — Hand Review Page (Static Bundle)
 */
(function () {
  const { Card, Button, Badge, PlayingCard, AppShell } = window.GTOComponents;
  const { cn } = window.GTOUtils;
  const { addXP, updateMissionProgress } = window.GTOStore;
  const { parseHandHistory } = window.GTOHandParser;

  const SAMPLE_HAND = `PokerStars Hand #123456789: Hold'em No Limit ($0.50/$1.00 USD) - 2024/01/15 20:31:45 ET
Table 'Altair' 6-max Seat #3 is the button
Seat 1: UTG_Player ($100 in chips)
Seat 2: MP_Player ($95 in chips)
Seat 3: CO_Player ($110 in chips) 
Seat 4: BTN_Player ($100 in chips)
Seat 5: SB_Player ($98 in chips)
Seat 6: Hero ($100 in chips)
SB_Player: posts small blind $0.50
Hero: posts big blind $1
*** HOLE CARDS ***
Dealt to Hero [Kh Qd]
UTG_Player: folds
MP_Player: folds
CO_Player: folds
BTN_Player: raises $2 to $2.50
SB_Player: folds
Hero: calls $1.50
*** FLOP *** [Ks 7h 2c]
Hero: checks
BTN_Player: bets $3.50
Hero: calls $3.50
*** TURN *** [Ks 7h 2c] [Qh]
Hero: checks
BTN_Player: bets $8
Hero: raises $18 to $26
BTN_Player: folds
Hero collected $44 from pot`;

  function ReviewDisplay({ result, navigate }) {
    const { status, parsed, error, notes } = result;

    if (status === 'failed') {
      return (
        <Card className="border border-gto-red/20 bg-gto-red/5">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-gto-red text-xl">❌</span>
            <span className="font-display font-semibold text-gto-red">Parse Failed</span>
          </div>
          <p className="text-sm text-slate-400 mb-3">{error ?? 'Could not parse this hand history.'}</p>
          <p className="text-sm text-slate-500">{notes}</p>
          <div className="mt-4 p-3 bg-white/3 rounded-lg border border-white/5">
            <div className="text-xs font-display font-semibold text-slate-500 mb-2">Supported formats:</div>
            <ul className="text-xs text-slate-500 space-y-1">
              <li>• PokerStars: <span className="font-mono text-slate-400">PokerStars Hand #...</span></li>
              <li>• GGPoker: <span className="font-mono text-slate-400">RC... or HH...</span></li>
            </ul>
          </div>
        </Card>
      );
    }

    return (
      <div className="space-y-4">
        <Card className={cn('border', status === 'success' ? 'border-gto-green/20 bg-gto-green/5' : 'border-gold-400/20 bg-gold-400/5')}>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl">{status === 'success' ? '✅' : '⚠️'}</span>
            <span className={cn('font-display font-semibold', status === 'success' ? 'text-gto-green' : 'text-gold-400')}>
              {status === 'success' ? 'Hand Parsed' : 'Partial Parse'}
            </span>
          </div>
          <p className="text-sm text-slate-400">{notes}</p>
        </Card>

        {parsed && (
          <>
            {parsed.hero_hand && (
              <Card>
                <div className="text-xs font-display font-semibold text-slate-500 uppercase tracking-wider mb-3">Hero's Hand</div>
                <div className="flex gap-2 items-center flex-wrap">
                  <PlayingCard card={parsed.hero_hand[0]} size="lg" />
                  <PlayingCard card={parsed.hero_hand[1]} size="lg" />
                  <div className="ml-2 text-slate-400 text-sm font-mono">{parsed.hero_hand[0]} {parsed.hero_hand[1]}</div>
                </div>
              </Card>
            )}

            <Card>
              <div className="text-xs font-display font-semibold text-slate-500 uppercase tracking-wider mb-3">Hand Summary</div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Blinds</span>
                  <span className="text-slate-300 font-mono">${parsed.blinds.small}/${parsed.blinds.big}</span>
                </div>
                {Object.keys(parsed.stack_sizes).length > 0 && (
                  <div className="flex justify-between text-sm flex-wrap gap-1">
                    <span className="text-slate-500">Stacks</span>
                    <span className="text-slate-300 text-xs font-mono">
                      {Object.entries(parsed.stack_sizes).slice(0, 3).map(([p, s]) => `${p}: $${s}`).join(' · ')}
                    </span>
                  </div>
                )}
                {parsed.preflop.actions.length > 0 && (
                  <div className="flex justify-between text-sm flex-wrap gap-1">
                    <span className="text-slate-500">Preflop</span>
                    <span className="text-slate-300 text-xs font-mono text-right">
                      {parsed.preflop.actions.map((a) => `${a.player} ${a.action}${a.amount ? ` $${a.amount}` : ''}`).join(' → ')}
                    </span>
                  </div>
                )}
                {parsed.flop && (
                  <div className="flex justify-between text-sm items-center">
                    <span className="text-slate-500">Flop</span>
                    <div className="flex gap-1">{(parsed.flop.cards || []).map((c, i) => <PlayingCard key={i} card={c} size="sm" />)}</div>
                  </div>
                )}
                {parsed.turn && (
                  <div className="flex justify-between text-sm items-center">
                    <span className="text-slate-500">Turn</span>
                    <div className="flex gap-1">{(parsed.turn.cards || []).map((c, i) => <PlayingCard key={i} card={c} size="sm" />)}</div>
                  </div>
                )}
                {parsed.river && (
                  <div className="flex justify-between text-sm items-center">
                    <span className="text-slate-500">River</span>
                    <div className="flex gap-1">{(parsed.river.cards || []).map((c, i) => <PlayingCard key={i} card={c} size="sm" />)}</div>
                  </div>
                )}
              </div>
            </Card>

            {parsed.key_decision_points.length > 0 && (
              <Card>
                <div className="text-xs font-display font-semibold text-slate-500 uppercase tracking-wider mb-3">🎯 Key Decision Points</div>
                <ul className="space-y-2">
                  {parsed.key_decision_points.map((point, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-400"><span className="text-teal-400 flex-shrink-0">·</span>{point}</li>
                  ))}
                </ul>
              </Card>
            )}

            {parsed.leak_categories.length > 0 && (
              <Card className="border border-gold-400/15 bg-gold-400/5">
                <div className="text-xs font-display font-semibold text-gold-400 uppercase tracking-wider mb-3">⚠️ Potential Leak Categories</div>
                <div className="flex flex-wrap gap-2 mb-3">
                  {parsed.leak_categories.map((leak, i) => <Badge key={i} variant="gold">{leak}</Badge>)}
                </div>
                <p className="text-xs text-slate-500">This is a structural review only. Exact EV analysis requires solver-backed data not available in this app.</p>
              </Card>
            )}

            {parsed.suggested_drill_types.length > 0 && (
              <Card>
                <div className="text-xs font-display font-semibold text-slate-500 uppercase tracking-wider mb-3">📚 Suggested Practice</div>
                <div className="grid grid-cols-2 gap-2">
                  {parsed.suggested_drill_types.some((t) => t.includes('preflop')) && (
                    <div className="glass-card-hover p-3 text-center cursor-pointer" onClick={() => navigate('preflop')}>
                      <div className="text-lg mb-1">🃏</div>
                      <div className="text-xs font-display font-semibold text-slate-300">Preflop Drill</div>
                    </div>
                  )}
                  {parsed.suggested_drill_types.some((t) => t.includes('postflop')) && (
                    <div className="glass-card-hover p-3 text-center cursor-pointer" onClick={() => navigate('postflop')}>
                      <div className="text-lg mb-1">🎲</div>
                      <div className="text-xs font-display font-semibold text-slate-300">Postflop Quiz</div>
                    </div>
                  )}
                </div>
              </Card>
            )}

            <div className="p-3 bg-white/3 rounded-lg border border-white/5">
              <p className="text-xs text-slate-600 text-center">
                ⚠️ This is a light study review for off-table analysis only. Not a real-time assistance tool. No solver EV data is claimed.{' '}
                <a href="#/fair-play" onClick={(e) => { e.preventDefault(); navigate('fair-play'); }} className="text-teal-400/60 hover:text-teal-400">Fair Play Policy</a>
              </p>
            </div>
          </>
        )}
      </div>
    );
  }

  function ReviewPage({ navigate }) {
    const [handText, setHandText] = React.useState('');
    const [result, setResult] = React.useState(null);
    const [isProcessing, setIsProcessing] = React.useState(false);
    const [hasSubmitted, setHasSubmitted] = React.useState(false);

    const handleParse = () => {
      if (!handText.trim()) return;
      setIsProcessing(true);

      setTimeout(() => {
        const parseResult = parseHandHistory(handText);
        setResult(parseResult);
        setIsProcessing(false);

        if (!hasSubmitted) {
          setHasSubmitted(true);
          addXP(20);
          updateMissionProgress('review');
        }
      }, 400);
    };

    const handleLoadSample = () => { setHandText(SAMPLE_HAND); setResult(null); };
    const handleClear = () => { setHandText(''); setResult(null); };

    return (
      <AppShell route="review" navigate={navigate}>
        <div className="max-w-lg mx-auto px-4 pt-6 pb-4">
          <div className="mb-6">
            <h1 className="font-display font-bold text-2xl text-slate-100">Hand Review</h1>
            <p className="text-slate-500 text-sm mt-1">Paste a hand history for light review and study recommendations</p>
          </div>

          <Card className="mb-5 border border-teal-400/15 bg-teal-400/5">
            <div className="flex gap-3">
              <span className="text-xl flex-shrink-0">🛡️</span>
              <div>
                <div className="font-display font-semibold text-teal-400 text-sm mb-1">Off-Table Study Only</div>
                <p className="text-xs text-slate-500">This tool is for reviewing hands away from any active session. Never use this tool during live play — that violates poker site terms of service.</p>
              </div>
            </div>
          </Card>

          {!result && (
            <div className="mb-5">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-display font-semibold text-slate-500 uppercase tracking-wider">Paste Hand History</label>
                <button onClick={handleLoadSample} className="text-xs text-teal-400 hover:text-teal-300 font-display font-medium transition-colors">Load sample →</button>
              </div>
              <textarea
                value={handText}
                onChange={(e) => setHandText(e.target.value)}
                placeholder="Paste your PokerStars or GGPoker hand history here..."
                className="gto-input gto-textarea w-full"
                rows={10}
              />
              <div className="flex gap-3 mt-3">
                <Button variant="primary" size="lg" className="flex-1" disabled={!handText.trim() || isProcessing} onClick={handleParse}>
                  {isProcessing ? 'Parsing…' : 'Review Hand →'}
                </Button>
                {handText && <Button variant="ghost" size="lg" onClick={handleClear}>Clear</Button>}
              </div>
              <p className="text-xs text-slate-600 text-center mt-2">Supports PokerStars and GGPoker formats · +20 XP for first review</p>
            </div>
          )}

          {result && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display font-bold text-slate-200">Review Results</h2>
                <Button variant="ghost" size="sm" onClick={() => setResult(null)}>← New Hand</Button>
              </div>
              <ReviewDisplay result={result} navigate={navigate} />
            </div>
          )}

          {!result && (
            <Card className="mt-4">
              <div className="text-xs font-display font-semibold text-slate-500 uppercase tracking-wider mb-3">Supported Formats</div>
              <div className="space-y-2 text-xs text-slate-500">
                <div><span className="text-slate-400 font-semibold">PokerStars:</span> Copy hand from game client (CTRL+C in hand history window)</div>
                <div><span className="text-slate-400 font-semibold">GGPoker:</span> Copy from Hand History section in the client</div>
                <div className="mt-3 pt-3 border-t border-white/5 text-slate-600">Note: This is a light parser for study guidance only. It does not provide solver-verified EV analysis.</div>
              </div>
            </Card>
          )}
        </div>
      </AppShell>
    );
  }

  window.GTOPages = window.GTOPages || {};
  window.GTOPages.Review = ReviewPage;
})();
