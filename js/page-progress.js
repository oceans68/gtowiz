/**
 * GTO Drill Coach — Progress Page (Static Bundle)
 */
(function () {
  const { Card, Badge, EmptyState, Button, AppShell } = window.GTOComponents;
  const { cn } = window.GTOUtils;
  const { useAppStore, getProgressData } = window.GTOStore;

  function accuracyColor(value) {
    if (value >= 80) return '#00cc66';
    if (value >= 60) return '#ffb800';
    return '#ff4444';
  }

  function SimpleBarChart({ data, valueKey, labelKey, colorFn, title }) {
    if (!data || data.length === 0) return null;
    const max = Math.max(...data.map((d) => d[valueKey]));

    return (
      <div>
        <div className="text-xs font-display font-semibold text-slate-500 uppercase tracking-wider mb-3">{title}</div>
        <div className="space-y-3">
          {data.map((item, i) => {
            const value = item[valueKey];
            const pct = max > 0 ? (value / max) * 100 : 0;
            const displayPct = valueKey === 'accuracy_pct' ? `${Math.round(value)}%` : `${value.toFixed(2)}`;
            const color = colorFn ? colorFn(value) : '#00d4ff';
            return (
              <div key={i} className="flex items-center gap-3">
                <div className="w-20 text-xs text-slate-400 font-display font-medium flex-shrink-0 text-right">{item[labelKey]}</div>
                <div className="flex-1 bg-white/5 rounded-full h-2.5 overflow-hidden">
                  <div className="h-2.5 rounded-full transition-all duration-700" style={{ width: `${pct}%`, backgroundColor: color }} />
                </div>
                <div className="w-12 text-xs text-slate-400 font-mono text-right flex-shrink-0">{displayPct}</div>
                {item.total_attempts !== undefined && <div className="w-10 text-xs text-slate-600 text-right flex-shrink-0">{item.total_attempts}x</div>}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  function WeeklyTrend({ sessions }) {
    if (sessions.length === 0) return null;
    const maxSpots = Math.max(...sessions.map((s) => s.spots_completed), 1);

    return (
      <Card className="mb-5">
        <div className="text-xs font-display font-semibold text-slate-500 uppercase tracking-wider mb-4">Last 7 Days</div>
        <div className="flex items-end gap-1 h-20">
          {(() => {
            const days = [];
            for (let i = 6; i >= 0; i--) {
              const d = new Date();
              d.setDate(d.getDate() - i);
              const dateStr = d.toISOString().split('T')[0];
              const session = sessions.find((s) => s.date === dateStr);
              days.push(session ? { date: dateStr, spots: session.spots_completed, accuracy: session.accuracy_pct } : null);
            }
            return days.map((day, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full flex items-end justify-center" style={{ height: '56px' }}>
                  {day ? (
                    <div className="w-full rounded-t-sm transition-all duration-700" style={{ height: `${Math.max(8, (day.spots / maxSpots) * 56)}px`, backgroundColor: accuracyColor(day.accuracy), opacity: 0.7 }} title={`${day.date}: ${day.spots} spots, ${Math.round(day.accuracy)}% accuracy`} />
                  ) : (
                    <div className="w-full h-1 bg-white/5 rounded" />
                  )}
                </div>
                <div className="text-xs text-slate-600 font-mono">
                  {['S', 'M', 'T', 'W', 'T', 'F', 'S'][(() => { const d = new Date(); d.setDate(d.getDate() - (6 - i)); return d.getDay(); })()]}
                </div>
              </div>
            ));
          })()}
        </div>
        <div className="flex justify-between text-xs text-slate-600 mt-2"><span>7 days ago</span><span>Today</span></div>
      </Card>
    );
  }

  const POSITION_ORDER = ['UTG', 'MP', 'CO', 'BTN', 'SB', 'BB'];

  function PositionHeatmap({ data }) {
    return (
      <div className="grid grid-cols-3 gap-2 mb-2">
        {POSITION_ORDER.map((pos) => {
          const item = data.find((d) => d.position === pos);
          const acc = item ? item.accuracy_pct : null;
          const attempts = item ? item.total_attempts : 0;
          const bgColor = acc === null ? 'bg-white/5 text-slate-600' : acc >= 80 ? 'bg-gto-green/15 text-gto-green border border-gto-green/20' : acc >= 60 ? 'bg-gold-400/15 text-gold-400 border border-gold-400/20' : 'bg-gto-red/15 text-gto-red border border-gto-red/20';
          return (
            <div key={pos} className={cn('rounded-lg p-3 text-center', bgColor)}>
              <div className="font-display font-bold text-lg">{pos}</div>
              <div className="text-2xl font-display font-bold mt-1">{acc !== null ? `${Math.round(acc)}%` : '—'}</div>
              <div className="text-xs opacity-60 mt-0.5">{attempts > 0 ? `${attempts} spots` : 'No data'}</div>
            </div>
          );
        })}
      </div>
    );
  }

  function ProgressPage({ navigate }) {
    const { allSessions } = useAppStore();
    const data = React.useMemo(() => getProgressData(), [allSessions]);

    if (!data || data.sessions_count === 0) {
      return (
        <AppShell route="progress" navigate={navigate}>
          <div className="max-w-lg mx-auto px-4 pt-6">
            <h1 className="font-display font-bold text-2xl text-slate-100 mb-6">Progress & Leaks</h1>
            <EmptyState
              icon="📈"
              title="No data yet"
              description="Complete your first drill session to start tracking your progress, leaks, and accuracy by position."
              action={<Button variant="primary" onClick={() => navigate('preflop')}>Start First Drill</Button>}
            />
          </div>
        </AppShell>
      );
    }

    const spotTypeLabels = {
      rfi: 'RFI', vs_open: 'vs Open', three_bet: '3-Bet', vs_three_bet: 'vs 3-Bet',
      postflop: 'Postflop', preflop: 'Preflop', four_bet: '4-Bet', blind_defense: 'BB Defense', push_fold: 'Push/Fold',
    };

    return (
      <AppShell route="progress" navigate={navigate}>
        <div className="max-w-lg mx-auto px-4 pt-6 pb-4">
          <div className="mb-6">
            <h1 className="font-display font-bold text-2xl text-slate-100">Progress & Leaks</h1>
            <p className="text-slate-500 text-sm mt-1">{data.sessions_count} sessions · {data.total_spots_completed} spots studied</p>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-5">
            <Card className="text-center">
              <div className={cn('text-3xl font-display font-bold', data.overall_accuracy >= 70 ? 'text-gto-green' : data.overall_accuracy >= 50 ? 'text-gold-400' : 'text-gto-red')}>{data.overall_accuracy}%</div>
              <div className="text-xs text-slate-500 mt-1">Overall Accuracy</div>
            </Card>
            <Card className="text-center">
              <div className="text-3xl font-display font-bold text-gto-red">-{data.total_ev_loss_bb.toFixed(1)}</div>
              <div className="text-xs text-slate-500 mt-1">Total EV Lost (bb)*</div>
            </Card>
          </div>

          <p className="text-xs text-slate-600 mb-5 text-center">* Estimated training score — not solver-verified EV</p>

          {data.weekly_sessions.length > 0 && <WeeklyTrend sessions={data.weekly_sessions} />}

          {data.weakest_position && data.by_position[0]?.total_attempts >= 3 && (
            <Card className="mb-5 border border-gto-red/20 bg-gto-red/5">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <div className="text-xs font-display font-semibold text-gto-red uppercase tracking-wider mb-1">🔴 Biggest Leak</div>
                  <div className="font-display font-bold text-slate-200 text-lg">{data.weakest_position} position</div>
                  <div className="text-sm text-slate-500 mt-0.5">Only {Math.round(data.by_position[0]?.accuracy_pct ?? 0)}% accuracy</div>
                </div>
                <Button variant="danger" size="sm" onClick={() => navigate('preflop')}>Practice →</Button>
              </div>
            </Card>
          )}

          {data.by_position.length > 0 && (
            <Card className="mb-5">
              <div className="text-xs font-display font-semibold text-slate-500 uppercase tracking-wider mb-4">Accuracy by Position</div>
              <PositionHeatmap data={data.by_position} />
              <div className="flex gap-3 mt-3 text-xs text-slate-600 flex-wrap">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-gto-green inline-block" />80%+</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-gold-400 inline-block" />60–79%</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-gto-red inline-block" />&lt;60%</span>
              </div>
            </Card>
          )}

          {data.by_spot_type.length > 0 && (
            <Card className="mb-5">
              <SimpleBarChart
                data={data.by_spot_type.map((s) => ({ ...s, label: spotTypeLabels[s.spot_type] ?? s.spot_type }))}
                valueKey="accuracy_pct"
                labelKey="label"
                colorFn={accuracyColor}
                title="Accuracy by Spot Type"
              />
            </Card>
          )}

          {allSessions.length > 0 && (
            <Card className="mb-5">
              <div className="text-xs font-display font-semibold text-slate-500 uppercase tracking-wider mb-4">Recent Sessions</div>
              <div className="space-y-3">
                {[...allSessions].reverse().slice(0, 5).map((session) => (
                  <div key={session.id} className="flex items-center gap-3 py-2 border-b border-white/5 last:border-0">
                    <div className="flex-1">
                      <div className="text-sm font-display font-medium text-slate-300 capitalize">{session.session_type} session</div>
                      <div className="text-xs text-slate-600 mt-0.5">{session.total_spots} spots · {session.started_at ? new Date(session.started_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) : 'Today'}</div>
                    </div>
                    <div className="text-right">
                      <div className={cn('font-display font-bold text-sm', session.accuracy_pct >= 70 ? 'text-gto-green' : session.accuracy_pct >= 50 ? 'text-gold-400' : 'text-gto-red')}>{Math.round(session.accuracy_pct)}%</div>
                      <div className="text-xs text-slate-600">accuracy</div>
                    </div>
                    <div className="text-right">
                      <div className="font-display font-bold text-sm text-gto-red">-{session.total_ev_loss_bb.toFixed(2)}</div>
                      <div className="text-xs text-slate-600">bb{session.estimated_ev ? '*' : ''}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {data.weakest_position && (
            <Card className="mb-4 border border-teal-400/15 bg-teal-400/5">
              <div className="text-xs font-display font-semibold text-teal-400 uppercase tracking-wider mb-2">📋 Study Recommendation</div>
              <p className="text-sm text-slate-400">
                Focus on <strong className="text-slate-200">{data.weakest_position}</strong> position drills.
                {data.weakest_spot_type && ` Pay special attention to ${spotTypeLabels[data.weakest_spot_type] ?? data.weakest_spot_type} spots.`}
              </p>
              <Button variant="primary" size="sm" className="mt-3" onClick={() => navigate('preflop')}>Practice Weak Spots →</Button>
            </Card>
          )}

          <div className="text-center text-xs text-slate-600">
            <a href="#/fair-play" onClick={(e) => { e.preventDefault(); navigate('fair-play'); }} className="hover:text-slate-500 transition-colors">🛡️ Off-table study only · Fair Play Policy</a>
          </div>
        </div>
      </AppShell>
    );
  }

  window.GTOPages = window.GTOPages || {};
  window.GTOPages.Progress = ProgressPage;
})();
