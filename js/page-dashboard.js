/**
 * GTO Drill Coach — Dashboard Page (Static Bundle)
 */
(function () {
  const { Card, StatCard, ProgressBar, Button, Badge, AppShell } = window.GTOComponents;
  const { cn, getLevelTitle, getLevelProgress, getXPForNextLevel, getMissionProgressPct, isDrilledToday, getGTOWScoreLabel, getActionLabel } = window.GTOUtils;
  const { useAppStore, getTodayMission, getProgressData } = window.GTOStore;
  const { getDailyQuizSpot } = window.GTOData;
  const { getFallbackExplanation } = window.GTOExplain;

  // ── Daily Quiz Widget ─────────────────────────────────────────────────────
  function DailyQuizWidget({ navigate }) {
    const [quiz, setQuiz] = React.useState(null);
    const [answered, setAnswered] = React.useState(false);
    const [chosen, setChosen] = React.useState(null);

    React.useEffect(() => {
      try { setQuiz(getDailyQuizSpot()); } catch(e) { /* ignore */ }
    }, []);

    if (!quiz) return null;
    const { range, combo, correctAction, frequency, allActions } = quiz;
    const actions = range.action_type === 'push_fold' ? ['fold', 'allin'] : range.action_type === 'vs_limp' ? ['fold', 'check', 'raise'] : ['fold', 'call', 'raise'];

    const handlePick = (action) => {
      if (answered) return;
      setChosen(action);
      setAnswered(true);
    };

    const isCorrect = chosen === correctAction;

    return (
      <Card className="mb-5 border border-purple-500/20 bg-purple-500/5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-base">🎯</span>
            <div className="text-xs font-display font-bold text-purple-400 uppercase tracking-wider">Daily Quiz</div>
          </div>
          <Badge variant="default" className="text-xs">Tricky Spot</Badge>
        </div>

        <div className="text-xs text-slate-500 mb-2">
          {range.position_hero} — {range.facing_position ? `vs ${range.facing_position} open` : range.action_type === 'vs_limp' ? 'facing a limp' : range.action_type === 'push_fold' ? `${range.stack_depth_bb}bb push/fold` : 'preflop decision'}
        </div>

        <div className="flex items-center justify-center gap-3 mb-4 py-3 bg-white/3 rounded-xl">
          <div className="text-3xl font-display font-bold text-slate-100">{combo}</div>
          <div className="text-xs text-slate-500">{combo.endsWith('s') ? 'Suited' : combo.endsWith('o') ? 'Offsuit' : 'Pair'}</div>
        </div>

        {!answered ? (
          <div className="grid grid-cols-3 gap-2">
            {actions.map((a) => (
              <button key={a} onClick={() => handlePick(a)}
                className="py-2 rounded-lg text-sm font-display font-bold border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:border-purple-400/30 transition-all">
                {getActionLabel(a)}
              </button>
            ))}
          </div>
        ) : (
          <div>
            <div className={cn('rounded-lg p-3 mb-3 text-sm font-display font-semibold', isCorrect ? 'bg-gto-green/10 text-gto-green border border-gto-green/30' : 'bg-gto-red/10 text-gto-red border border-gto-red/30')}>
              {isCorrect ? `✅ Correct! ${getActionLabel(correctAction)} (${Math.round(frequency * 100)}%)` : `❌ Answer: ${getActionLabel(correctAction)} (${Math.round(frequency * 100)}%) — You chose ${getActionLabel(chosen)}`}
            </div>
            <button onClick={() => navigate('preflop')}
              className="w-full py-2 rounded-lg text-xs text-purple-400 border border-purple-500/20 hover:bg-purple-500/10 transition-all font-display font-semibold">
              Train this spot in full drill →
            </button>
          </div>
        )}
      </Card>
    );
  }

  function DashboardPage({ navigate }) {
    const { profile, allSessions, earnedBadges } = useAppStore();

    const todayMission = React.useMemo(() => getTodayMission(), [allSessions]);
    const progress = React.useMemo(() => getProgressData(), [allSessions]);

    const levelProgress = getLevelProgress(profile.xp, profile.level);
    const xpToNext = getXPForNextLevel(profile.level) - profile.xp;
    const drilledToday = isDrilledToday(profile.last_drill_date);
    const missionPct = getMissionProgressPct(todayMission.progress, todayMission.mission.requirements);

    // Compute GTOW score from recent sessions
    const recentAnswers = allSessions.slice(-5).flatMap((s) => s.answers || []);
    const avgGTOW = recentAnswers.length > 0
      ? Math.round(recentAnswers.reduce((sum, a) => sum + (a.gtow_score ?? (a.is_correct ? 100 : -50)), 0) / recentAnswers.length)
      : null;
    const gtowInfo = avgGTOW !== null ? getGTOWScoreLabel(avgGTOW) : null;

    const weekEVLoss = allSessions
      .filter((s) => {
        const d = s.ended_at ? new Date(s.ended_at) : null;
        if (!d) return false;
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return d > weekAgo;
      })
      .reduce((sum, s) => sum + s.total_ev_loss_bb, 0);

    return (
      <AppShell route="dashboard" navigate={navigate}>
        <div className="max-w-2xl mx-auto px-4 pt-6 pb-4">

          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="font-display font-bold text-2xl text-slate-100">
                {drilledToday ? 'Keep it up,' : 'Welcome back,'}{' '}
                <span className="text-teal-400">{profile.username}</span>
              </h1>
              <p className="text-slate-500 text-sm mt-1">
                Level {profile.level} · {getLevelTitle(profile.level)}
              </p>
            </div>
            {profile.current_streak > 0 && (
              <div className="flex flex-col items-center glass-card px-3 py-2">
                <span className="streak-flame text-2xl">🔥</span>
                <span className="font-display font-bold text-gold-400 text-lg leading-none">{profile.current_streak}</span>
                <span className="text-xs text-slate-500">streak</span>
              </div>
            )}
          </div>

          {/* XP Progress */}
          <Card className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-display font-semibold text-slate-500 uppercase tracking-wider">Level Progress</span>
              <span className="text-xs text-slate-500">{xpToNext.toLocaleString()} XP to next level</span>
            </div>
            <ProgressBar value={levelProgress} variant="gold" />
            <div className="flex justify-between text-xs text-slate-600 mt-1.5">
              <span>{profile.xp.toLocaleString()} XP</span>
              <span>{getXPForNextLevel(profile.level).toLocaleString()} XP</span>
            </div>
          </Card>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            <StatCard label="Accuracy" value={progress.overall_accuracy > 0 ? `${progress.overall_accuracy}%` : '—'} sub="all time" color="teal" />
            {gtowInfo ? (
              <div className="glass-card text-center" style={{ borderColor: `${gtowInfo.color}33`, background: `${gtowInfo.color}0a` }}>
                <div className="text-2xl font-display font-bold" style={{ color: gtowInfo.color }}>{avgGTOW > 0 ? '+' : ''}{avgGTOW}</div>
                <div className="text-xs mt-1" style={{ color: gtowInfo.color }}>{gtowInfo.emoji} GTOW</div>
                <div className="text-xs text-slate-600 mt-0.5">recent avg</div>
              </div>
            ) : (
              <StatCard label="GTOW" value="—" sub="drill to start" />
            )}
            <StatCard label="Spots" value={progress.total_spots_completed > 0 ? progress.total_spots_completed : '—'} sub="completed" />
          </div>

          {/* Daily Quiz */}
          <DailyQuizWidget navigate={navigate} />

          {/* Today's Mission */}
          <div className="mb-4">
            <h2 className="font-display font-bold text-slate-200 text-base mb-3">Today's Mission</h2>
            <Card className={cn('border', todayMission.status === 'completed' ? 'border-gto-green/25 bg-gto-green/5' : 'border-white/7')}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="font-display font-semibold text-slate-200">{todayMission.mission.title}</span>
                    {todayMission.status === 'completed' && <Badge variant="green">✓ Done</Badge>}
                  </div>
                  <p className="text-sm text-slate-500">{todayMission.mission.description}</p>
                </div>
                <div className="ml-3 flex-shrink-0 text-right">
                  <div className="text-gold-400 font-display font-bold text-sm">+{todayMission.mission.xp_reward}</div>
                  <div className="text-xs text-slate-600">XP</div>
                </div>
              </div>

              <ProgressBar value={missionPct} variant={todayMission.status === 'completed' ? 'green' : 'teal'} className="mb-2" />

              <div className="flex flex-wrap justify-between items-center gap-2">
                <div className="flex gap-4 text-xs text-slate-500 flex-wrap">
                  {todayMission.mission.requirements.preflop_spots && (
                    <span>Preflop: {todayMission.progress.preflop_completed}/{todayMission.mission.requirements.preflop_spots}</span>
                  )}
                  {todayMission.mission.requirements.postflop_spots && (
                    <span>Postflop: {todayMission.progress.postflop_completed}/{todayMission.mission.requirements.postflop_spots}</span>
                  )}
                  {todayMission.mission.requirements.hand_reviews && (
                    <span>Reviews: {todayMission.progress.hand_reviews_completed}/{todayMission.mission.requirements.hand_reviews}</span>
                  )}
                </div>
                <span className="text-xs text-slate-600">{missionPct}%</span>
              </div>

              {todayMission.status !== 'completed' && (
                <Button variant="primary" size="sm" className="mt-3 w-full" onClick={() => navigate('missions')}>
                  Start Mission →
                </Button>
              )}
            </Card>
          </div>

          {/* Quick Start */}
          <div className="mb-4">
            <h2 className="font-display font-bold text-slate-200 text-base mb-3">Quick Start</h2>
            <div className="grid grid-cols-2 gap-3">
              <div className="glass-card-hover p-4 cursor-pointer group" onClick={() => navigate('preflop')}>
                <div className="text-2xl mb-2">🃏</div>
                <div className="font-display font-semibold text-slate-200 text-sm group-hover:text-teal-400 transition-colors">Preflop Trainer</div>
                <div className="text-xs text-slate-500 mt-0.5">NLHE ranges & spots</div>
              </div>
              <div className="glass-card-hover p-4 cursor-pointer group" onClick={() => navigate('plo')}>
                <div className="text-2xl mb-2">🎴</div>
                <div className="font-display font-semibold text-slate-200 text-sm group-hover:text-purple-400 transition-colors">PLO Trainer</div>
                <div className="text-xs text-slate-500 mt-0.5">Omaha cash & MTT</div>
              </div>
              <div className="glass-card-hover p-4 cursor-pointer group" onClick={() => navigate('postflop')}>
                <div className="text-2xl mb-2">🎲</div>
                <div className="font-display font-semibold text-slate-200 text-sm group-hover:text-teal-400 transition-colors">Postflop Quiz</div>
                <div className="text-xs text-slate-500 mt-0.5">Board texture drills</div>
              </div>
              <div className="glass-card-hover p-4 cursor-pointer group" onClick={() => navigate('review')}>
                <div className="text-2xl mb-2">🔍</div>
                <div className="font-display font-semibold text-slate-200 text-sm group-hover:text-teal-400 transition-colors">Hand Review</div>
                <div className="text-xs text-slate-500 mt-0.5">Paste & analyze</div>
              </div>
              <div className="glass-card-hover p-4 cursor-pointer group" onClick={() => navigate('progress')}>
                <div className="text-2xl mb-2">📈</div>
                <div className="font-display font-semibold text-slate-200 text-sm group-hover:text-teal-400 transition-colors">My Leaks</div>
                <div className="text-xs text-slate-500 mt-0.5">
                  {progress.weakest_position ? `Weakest: ${progress.weakest_position}` : 'No data yet'}
                </div>
              </div>
            </div>
          </div>

          {/* Weakest area */}
          {progress.weakest_position && (
            <Card className="mb-4 border border-red-500/15 bg-red-500/5">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <div className="text-xs font-display font-semibold text-red-400 uppercase tracking-wider mb-1">Biggest Leak</div>
                  <div className="font-display font-bold text-slate-200">{progress.weakest_position} position</div>
                  <div className="text-xs text-slate-500 mt-0.5">{progress.by_position[0]?.accuracy_pct}% accuracy — needs work</div>
                </div>
                <Button variant="danger" size="sm" onClick={() => navigate('preflop')}>Fix It →</Button>
              </div>
            </Card>
          )}

          {/* Recent badges */}
          {earnedBadges.length > 0 && (
            <div className="mb-4">
              <h2 className="font-display font-bold text-slate-200 text-base mb-3">Recent Badges</h2>
              <div className="flex flex-wrap gap-2">
                {earnedBadges.slice(-6).map((eb) => (
                  <div key={eb.badge.slug} className="flex items-center gap-2 glass-card px-3 py-2" title={eb.badge.description}>
                    <span className="text-lg">{eb.badge.icon}</span>
                    <span className="text-xs font-display font-semibold text-slate-300">{eb.badge.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty state for new users */}
          {allSessions.length === 0 && (
            <Card className="border border-teal-400/15 bg-teal-400/5 mb-4">
              <div className="text-center py-2">
                <div className="text-3xl mb-2">🎯</div>
                <div className="font-display font-bold text-slate-200 mb-1">Ready to start?</div>
                <p className="text-slate-500 text-sm mb-4">Complete your first drill to build your streak and track your progress.</p>
                <Button variant="primary" onClick={() => navigate('preflop')}>Start First Drill</Button>
              </div>
            </Card>
          )}

          {/* Fair play notice */}
          <div className="text-center mt-2">
            <a href="#/fair-play" onClick={(e) => { e.preventDefault(); navigate('fair-play'); }} className="text-xs text-slate-600 hover:text-slate-500 transition-colors">
              🛡️ Off-table study only · Fair Play Policy
            </a>
          </div>
        </div>
      </AppShell>
    );
  }

  window.GTOPages = window.GTOPages || {};
  window.GTOPages.Dashboard = DashboardPage;
})();
