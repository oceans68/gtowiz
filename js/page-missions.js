/**
 * GTO Drill Coach — Missions Page (Static Bundle)
 */
(function () {
  const { Card, Button, Badge, ProgressBar, AppShell } = window.GTOComponents;
  const { cn, getMissionProgressPct, getLevelProgress, getXPForNextLevel, getLevelTitle } = window.GTOUtils;
  const { useAppStore, getTodayMission, completeMission, ALL_BADGES } = window.GTOStore;

  function MissionCard({ missionProgress, navigate }) {
    const { mission, status, progress } = missionProgress;
    const pct = getMissionProgressPct(progress, mission.requirements);
    const isDone = status === 'completed';

    const getDrillRoute = () => {
      if (mission.requirements.hand_reviews && !mission.requirements.preflop_spots && !mission.requirements.postflop_spots) return 'review';
      if (mission.requirements.postflop_spots && !mission.requirements.preflop_spots) return 'postflop';
      return 'preflop';
    };

    return (
      <Card className={cn('border transition-all', isDone ? 'border-gto-green/20 bg-gto-green/5 mission-complete-pulse' : 'border-white/7')}>
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 pr-4">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <h3 className="font-display font-bold text-slate-200 text-base">{mission.title}</h3>
              {isDone && <Badge variant="green">✓ Complete</Badge>}
              {status === 'in_progress' && <Badge variant="teal">In Progress</Badge>}
            </div>
            <p className="text-sm text-slate-500">{mission.description}</p>
          </div>
          <div className="text-right flex-shrink-0">
            <div className="text-gold-400 font-display font-bold">+{mission.xp_reward}</div>
            <div className="text-xs text-slate-600">XP</div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-3">
          {mission.requirements.preflop_spots && (
            <div className={cn('flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg font-display font-medium', progress.preflop_completed >= mission.requirements.preflop_spots ? 'bg-gto-green/15 text-gto-green' : 'bg-white/5 text-slate-400')}>
              🃏 Preflop: {progress.preflop_completed}/{mission.requirements.preflop_spots}
            </div>
          )}
          {mission.requirements.postflop_spots && (
            <div className={cn('flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg font-display font-medium', progress.postflop_completed >= mission.requirements.postflop_spots ? 'bg-gto-green/15 text-gto-green' : 'bg-white/5 text-slate-400')}>
              🎲 Postflop: {progress.postflop_completed}/{mission.requirements.postflop_spots}
            </div>
          )}
          {mission.requirements.hand_reviews && (
            <div className={cn('flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg font-display font-medium', progress.hand_reviews_completed >= mission.requirements.hand_reviews ? 'bg-gto-green/15 text-gto-green' : 'bg-white/5 text-slate-400')}>
              🔍 Reviews: {progress.hand_reviews_completed}/{mission.requirements.hand_reviews}
            </div>
          )}
        </div>

        <ProgressBar value={pct} variant={isDone ? 'green' : 'teal'} className="mb-3" />

        {!isDone && (
          <Button variant="primary" size="sm" fullWidth onClick={() => navigate(getDrillRoute())}>
            {status === 'in_progress' ? 'Continue Mission →' : 'Start Mission →'}
          </Button>
        )}

        {isDone && (
          <div className="text-center text-sm text-gto-green font-display font-semibold py-1">
            🎉 Mission Complete! +{mission.xp_reward} XP earned
          </div>
        )}
      </Card>
    );
  }

  function StreakDisplay({ streak, longest }) {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date().getDay();

    return (
      <Card className="mb-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-xs font-display font-semibold text-slate-500 uppercase tracking-wider mb-1">Current Streak</div>
            <div className="flex items-center gap-2">
              <span className="streak-flame text-3xl">🔥</span>
              <span className="font-display font-bold text-gold-400 text-3xl">{streak}</span>
              <span className="text-slate-500 text-sm">days</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-slate-500 mb-1">Best streak</div>
            <div className="font-display font-bold text-slate-300 text-xl">{longest}</div>
          </div>
        </div>

        <div className="flex justify-between">
          {days.map((day, i) => {
            const isToday = i === today;
            const daysBack = (today - i + 7) % 7;
            const isActive = daysBack < streak;
            return (
              <div key={day} className="flex flex-col items-center gap-1.5">
                <div className={cn('w-8 h-8 rounded-full flex items-center justify-center text-sm', isActive && isToday ? 'bg-gold-400 text-navy-900 font-bold' : isActive ? 'bg-teal-500/30 text-teal-400' : 'bg-white/5 text-slate-600')}>
                  {isActive ? (isToday ? '🔥' : '✓') : ''}
                </div>
                <span className={cn('text-xs font-display', isToday ? 'text-gold-400 font-semibold' : 'text-slate-600')}>{day}</span>
              </div>
            );
          })}
        </div>
      </Card>
    );
  }

  function BadgesSection({ earnedBadges }) {
    const earnedSlugs = new Set(earnedBadges.map((b) => b.badge.slug));
    return (
      <div className="mb-6">
        <h2 className="font-display font-bold text-slate-200 text-base mb-3">Achievements</h2>
        <div className="grid grid-cols-3 gap-3">
          {ALL_BADGES.map((badge) => {
            const earned = earnedSlugs.has(badge.slug);
            return (
              <div key={badge.slug} className={cn('glass-card p-3 flex flex-col items-center text-center gap-2 transition-all', earned ? 'border border-gold-400/20' : 'opacity-40')} title={badge.description}>
                <span className={cn('text-2xl', !earned && 'grayscale')}>{badge.icon}</span>
                <div className="text-xs font-display font-semibold text-slate-300 leading-tight">{badge.name}</div>
                {earned && <Badge variant="gold" className="text-xs">Earned</Badge>}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  function MissionsPage({ navigate }) {
    const { profile, earnedBadges, allSessions } = useAppStore();
    const todayMission = React.useMemo(() => getTodayMission(), [allSessions]);

    React.useEffect(() => {
      if (todayMission.status === 'completed' && todayMission.xp_earned === 0) {
        completeMission();
      }
    }, [todayMission.status]);

    const levelPct = getLevelProgress(profile.xp, profile.level);

    return (
      <AppShell route="missions" navigate={navigate}>
        <div className="max-w-lg mx-auto px-4 pt-6 pb-4">
          <div className="mb-6">
            <h1 className="font-display font-bold text-2xl text-slate-100">Daily Missions</h1>
            <p className="text-slate-500 text-sm mt-1">Complete missions to earn XP and maintain your streak</p>
          </div>

          <Card className="mb-5">
            <div className="flex items-center justify-between mb-2 flex-wrap gap-1">
              <div>
                <span className="text-xs font-display font-semibold text-slate-500 uppercase tracking-wider">Level {profile.level}</span>
                <span className="text-xs text-slate-600 ml-2">· {getLevelTitle(profile.level)}</span>
              </div>
              <span className="text-xs text-gold-400 font-display font-semibold">{profile.xp.toLocaleString()} XP</span>
            </div>
            <ProgressBar value={levelPct} variant="gold" />
            <div className="text-xs text-slate-600 mt-1">{(getXPForNextLevel(profile.level) - profile.xp).toLocaleString()} XP to next level</div>
          </Card>

          <StreakDisplay streak={profile.current_streak} longest={profile.longest_streak} />

          <div className="mb-6">
            <h2 className="font-display font-bold text-slate-200 text-base mb-3">Today's Mission</h2>
            <MissionCard missionProgress={todayMission} navigate={navigate} />
          </div>

          <div className="mb-6">
            <h2 className="font-display font-bold text-slate-200 text-base mb-3">Quick Drills</h2>
            <div className="grid grid-cols-2 gap-3">
              <div className="glass-card-hover p-4 cursor-pointer text-center" onClick={() => navigate('preflop')}>
                <div className="text-2xl mb-2">🃏</div>
                <div className="font-display font-semibold text-sm text-slate-200">Preflop</div>
                <div className="text-xs text-slate-500 mt-0.5">10 XP per correct</div>
              </div>
              <div className="glass-card-hover p-4 cursor-pointer text-center" onClick={() => navigate('postflop')}>
                <div className="text-2xl mb-2">🎲</div>
                <div className="font-display font-semibold text-sm text-slate-200">Postflop</div>
                <div className="text-xs text-slate-500 mt-0.5">15 XP per correct</div>
              </div>
            </div>
          </div>

          <BadgesSection earnedBadges={earnedBadges} />

          <div className="text-center text-xs text-slate-600 mt-4">
            <a href="#/fair-play" onClick={(e) => { e.preventDefault(); navigate('fair-play'); }} className="hover:text-slate-500 transition-colors">
              🛡️ Off-table study only — Fair Play Policy
            </a>
          </div>
        </div>
      </AppShell>
    );
  }

  window.GTOPages = window.GTOPages || {};
  window.GTOPages.Missions = MissionsPage;
})();
