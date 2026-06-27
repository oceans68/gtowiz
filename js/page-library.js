/**
 * GTO Drill Coach — Library Page (Static Bundle)
 */
(function () {
  const { Card, Badge, SourceLabel, Button, PlayingCard, AppShell } = window.GTOComponents;
  const { cn, getActionTypeFull } = window.GTOUtils;
  const { POSTFLOP_SPOTS, ALL_RANGES } = window.GTOData;

  function SpotCard({ spot, navigate }) {
    const [expanded, setExpanded] = React.useState(false);

    return (
      <Card className={cn('cursor-pointer transition-all border', expanded ? 'border-teal-400/20' : 'border-white/6')} onClick={() => setExpanded((v) => !v)}>
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap mb-1.5">
              <Badge variant="teal">{spot.street.charAt(0).toUpperCase() + spot.street.slice(1)}</Badge>
              <Badge variant="default">{spot.position_hero} vs {spot.position_villain}</Badge>
              <Badge variant={spot.difficulty === 'advanced' ? 'red' : spot.difficulty === 'intermediate' ? 'gold' : 'green'}>{spot.difficulty}</Badge>
            </div>
            <div className="text-xs text-slate-500">{spot.preflop_action_summary}</div>
          </div>
          <span className="text-slate-600 text-sm ml-2">{expanded ? '▲' : '▼'}</span>
        </div>

        <div className="flex gap-1.5 mb-2 items-center flex-wrap">
          {spot.board_cards.map((c, i) => <PlayingCard key={i} card={c} size="sm" />)}
          <div className="ml-2 text-xs text-slate-500">Pot: {spot.pot_size_bb}bb · SPR: {spot.spr_approx}</div>
        </div>

        <div className="flex flex-wrap gap-1 mb-2">
          {spot.concept_tags.slice(0, 3).map((tag) => <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-slate-500">{tag}</span>)}
        </div>

        <SourceLabel sourceType={spot.source_type} />

        {expanded && (
          <div className="mt-4 pt-4 border-t border-white/5">
            <div className="text-xs font-display font-semibold text-slate-500 uppercase tracking-wider mb-3">GTO Actions</div>
            <div className="space-y-2">
              {spot.actions.map((a) => (
                <div key={a.action} className="flex items-center gap-3">
                  <div className={cn('text-xs font-display font-semibold w-20', a.is_recommended ? 'text-gto-green' : a.is_acceptable ? 'text-gold-400' : 'text-slate-500')}>{a.action.replace('_', ' ')}</div>
                  <div className="flex-1 bg-white/5 rounded-full h-2 overflow-hidden">
                    <div className={cn('h-2 rounded-full', a.is_recommended ? 'bg-gto-green/70' : 'bg-white/15')} style={{ width: `${Math.round(a.frequency * 100)}%` }} />
                  </div>
                  <div className="text-xs text-slate-500 font-mono w-10 text-right">{Math.round(a.frequency * 100)}%</div>
                  {a.is_recommended && <span className="text-xs text-gto-green">✓</span>}
                </div>
              ))}
            </div>
            {spot.explanation_hint && <p className="text-xs text-slate-500 mt-3 italic">{spot.explanation_hint}</p>}
            <Button variant="primary" size="sm" fullWidth className="mt-3" onClick={(e) => { e.stopPropagation(); navigate('postflop'); }}>Practice This Spot Type →</Button>
          </div>
        )}
      </Card>
    );
  }

  function RangeCard({ range, navigate }) {
    const totalCombos = range.actions.filter((a) => a.frequency >= 0.5).length;
    return (
      <Card className="border border-white/6">
        <div className="flex items-start justify-between mb-3 flex-wrap gap-2">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <Badge variant="teal">{range.position_hero}</Badge>
              <Badge variant="default">{getActionTypeFull(range.action_type)}</Badge>
              {range.facing_position && <Badge variant="default">vs {range.facing_position}</Badge>}
            </div>
            <div className="text-xs text-slate-500">{range.stack_depth_bb}bb · {range.format} · {range.game_type}</div>
          </div>
          <SourceLabel sourceType={range.source_type} />
        </div>

        <div className="flex items-center justify-between text-sm flex-wrap gap-2">
          <div className="text-slate-500"><span className="text-slate-300 font-display font-semibold">{totalCombos}</span> combos in range</div>
          <Button variant="secondary" size="sm" onClick={() => navigate('preflop')}>Drill →</Button>
        </div>

        {range.notes && <p className="text-xs text-slate-600 mt-2 italic">{range.notes}</p>}
      </Card>
    );
  }

  function LibraryPage({ navigate }) {
    const [activeTab, setActiveTab] = React.useState('postflop');
    const [difficultyFilter, setDifficultyFilter] = React.useState('all');
    const [streetFilter, setStreetFilter] = React.useState('all');

    const filteredSpots = React.useMemo(() => {
      return POSTFLOP_SPOTS.filter((s) => {
        if (!s.is_active) return false;
        if (difficultyFilter !== 'all' && s.difficulty !== difficultyFilter) return false;
        if (streetFilter !== 'all' && s.street !== streetFilter) return false;
        return true;
      });
    }, [difficultyFilter, streetFilter]);

    const allRanges = ALL_RANGES;

    return (
      <AppShell route="library" navigate={navigate}>
        <div className="max-w-lg mx-auto px-4 pt-6 pb-4">
          <div className="mb-6">
            <h1 className="font-display font-bold text-2xl text-slate-100">Study Library</h1>
            <p className="text-slate-500 text-sm mt-1">Browse all training spots and preflop ranges</p>
          </div>

          <div className="flex gap-2 mb-5 p-1 bg-white/4 rounded-xl">
            {['postflop', 'preflop'].map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)} className={cn('flex-1 py-2 rounded-lg font-display font-semibold text-sm transition-all', activeTab === tab ? 'bg-navy-700 text-slate-200 shadow' : 'text-slate-500 hover:text-slate-400')}>
                {tab === 'postflop' ? '🎲 Postflop' : '🃏 Preflop'}
              </button>
            ))}
          </div>

          {activeTab === 'postflop' && (
            <>
              <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
                {[{ value: 'all', label: 'All' }, { value: 'beginner', label: 'Beginner' }, { value: 'intermediate', label: 'Intermediate' }, { value: 'advanced', label: 'Advanced' }].map(({ value, label }) => (
                  <button key={value} onClick={() => setDifficultyFilter(value)} className={cn('px-3 py-1.5 rounded-lg text-xs font-display font-semibold whitespace-nowrap border transition-all flex-shrink-0', difficultyFilter === value ? 'border-teal-400/40 bg-teal-400/10 text-teal-400' : 'border-white/6 text-slate-500 hover:text-slate-400')}>{label}</button>
                ))}
                <div className="w-px bg-white/8 mx-1 flex-shrink-0" />
                {[{ value: 'all', label: 'All Streets' }, { value: 'flop', label: 'Flop' }, { value: 'turn', label: 'Turn' }, { value: 'river', label: 'River' }].map(({ value, label }) => (
                  <button key={value} onClick={() => setStreetFilter(value)} className={cn('px-3 py-1.5 rounded-lg text-xs font-display font-semibold whitespace-nowrap border transition-all flex-shrink-0', streetFilter === value ? 'border-teal-400/40 bg-teal-400/10 text-teal-400' : 'border-white/6 text-slate-500 hover:text-slate-400')}>{label}</button>
                ))}
              </div>

              <div className="text-xs text-slate-600 mb-3">{filteredSpots.length} spots · All labeled sample training data</div>

              <div className="space-y-3">
                {filteredSpots.map((spot) => <SpotCard key={spot.id} spot={spot} navigate={navigate} />)}
              </div>
            </>
          )}

          {activeTab === 'preflop' && (
            <>
              <div className="text-xs text-slate-600 mb-3">{allRanges.length} range configurations · Imported chart / estimated data</div>
              <div className="space-y-3">
                {allRanges.map((range) => <RangeCard key={range.id} range={range} navigate={navigate} />)}
              </div>
            </>
          )}

          <div className="mt-8 p-4 bg-white/3 rounded-xl border border-white/5">
            <div className="text-xs font-display font-semibold text-slate-500 uppercase tracking-wider mb-2">Data Accuracy Policy</div>
            <p className="text-xs text-slate-600">
              All training data in GTO Drill Coach is clearly labeled with its source type. No data is claimed as solver-verified unless explicitly marked.
              Sample, imported chart, and estimated data is suitable for building correct habits but may differ from site-specific, rake-adjusted or ICM-adjusted GTO solutions.
            </p>
            <a href="#/fair-play" onClick={(e) => { e.preventDefault(); navigate('fair-play'); }} className="text-xs text-teal-400/60 hover:text-teal-400 mt-2 block transition-colors">Read our full Fair Play & Data Policy →</a>
          </div>
        </div>
      </AppShell>
    );
  }

  window.GTOPages = window.GTOPages || {};
  window.GTOPages.Library = LibraryPage;
})();
