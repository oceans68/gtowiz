/**
 * GTO Drill Coach — Static Store (Zustand replacement)
 * Minimal pub-sub store persisted to localStorage.
 */
(function () {
  const STORAGE_KEY = 'gto-drill-coach-store';

  const DEFAULT_PROFILE = {
    id: 'local-user',
    username: 'Poker Student',
    game_type_preference: 'cash',
    stakes_level: 'low',
    level: 1,
    xp: 0,
    current_streak: 0,
    longest_streak: 0,
    last_drill_date: null,
  };

  const MISSIONS_POOL = [
    {
      title: 'Daily Warm-Up',
      description: 'Complete 10 preflop drill spots to sharpen your opening ranges.',
      requirements: { preflop_spots: 10 },
      xp_reward: 50,
    },
    {
      title: 'Postflop Focus',
      description: 'Complete 5 postflop quiz spots and study board textures.',
      requirements: { postflop_spots: 5 },
      xp_reward: 60,
    },
    {
      title: 'Full Session',
      description: 'Complete 8 preflop and 4 postflop spots.',
      requirements: { preflop_spots: 8, postflop_spots: 4 },
      xp_reward: 80,
    },
    {
      title: 'Hand Review',
      description: 'Submit a hand history for light review.',
      requirements: { hand_reviews: 1 },
      xp_reward: 40,
    },
    {
      title: 'Range Mastery',
      description: 'Complete 15 preflop spots with 70%+ accuracy.',
      requirements: { preflop_spots: 15, min_accuracy_pct: 70 },
      xp_reward: 75,
    },
  ];

  const ALL_BADGES = [
    { slug: 'first-drill', name: 'First Drill', description: 'Completed your first drill spot.', icon: '🎯', category: 'milestone' },
    { slug: 'perfect-session', name: 'Perfect Session', description: '100% accuracy in a session of 10+ spots.', icon: '💎', category: 'accuracy' },
    { slug: 'streak-7', name: '7-Day Streak', description: 'Drilled 7 days in a row.', icon: '🔥', category: 'streak' },
    { slug: 'streak-30', name: '30-Day Streak', description: 'Drilled 30 days in a row.', icon: '🏆', category: 'streak' },
    { slug: 'preflop-100', name: 'Preflop Purist', description: 'Completed 100 preflop spots.', icon: '🃏', category: 'volume' },
    { slug: 'postflop-50', name: 'Postflop Warrior', description: 'Completed 50 postflop spots.', icon: '🎰', category: 'volume' },
    { slug: 'hand-detective', name: 'Hand Detective', description: 'Submitted your first hand review.', icon: '🔍', category: 'milestone' },
    { slug: 'ev-saver', name: 'EV Saver', description: 'Session EV loss under 0.1bb over 10+ spots.', icon: '💰', category: 'accuracy' },
    { slug: 'mission-complete', name: 'Mission Complete', description: 'Completed your first daily mission.', icon: '✅', category: 'milestone' },
  ];

  const { calculateAccuracy, isStreakAlive, isDrilledToday, getLevelFromXP } = window.GTOUtils;

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  function saveState(state) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        profile: state.profile,
        earnedBadges: state.earnedBadges,
        allSessions: state.allSessions,
        todayMission: state.todayMission,
      }));
    } catch {
      // localStorage unavailable (private mode etc.) — fail silently
    }
  }

  // ── Internal mutable state + subscriber list ──────────────────────────────

  const persisted = loadState();

  let state = {
    profile: (persisted && persisted.profile) || { ...DEFAULT_PROFILE },
    earnedBadges: (persisted && persisted.earnedBadges) || [],
    allSessions: (persisted && persisted.allSessions) || [],
    activeSession: null,
    todayMission: (persisted && persisted.todayMission) || null,
  };

  const listeners = new Set();

  function notify() {
    saveState(state);
    listeners.forEach((fn) => fn(state));
  }

  function setState(updater) {
    const partial = typeof updater === 'function' ? updater(state) : updater;
    state = { ...state, ...partial };
    notify();
  }

  function getState() {
    return state;
  }

  // ── Actions ────────────────────────────────────────────────────────────────

  function updateProfile(updates) {
    setState((s) => ({ profile: { ...s.profile, ...updates } }));
  }

  function addXP(amount) {
    setState((s) => {
      const newXP = s.profile.xp + amount;
      const newLevel = getLevelFromXP(newXP);
      return { profile: { ...s.profile, xp: newXP, level: newLevel } };
    });
  }

  function startSession(type) {
    const sessionId = `session-${Date.now()}`;
    const session = {
      id: sessionId,
      session_type: type,
      started_at: new Date().toISOString(),
      ended_at: null,
      total_spots: 0,
      correct_count: 0,
      accuracy_pct: 0,
      total_ev_loss_bb: 0,
      estimated_ev: false,
      answers: [],
    };
    setState({ activeSession: session });
  }

  function recordAnswer(answer) {
    setState((s) => {
      if (!s.activeSession) return s;
      const updated = {
        ...s.activeSession,
        total_spots: s.activeSession.total_spots + 1,
        correct_count: s.activeSession.correct_count + (answer.is_correct ? 1 : 0),
        total_ev_loss_bb: s.activeSession.total_ev_loss_bb + (answer.ev_loss_bb ?? 0),
        estimated_ev: s.activeSession.estimated_ev || answer.ev_is_estimated,
        answers: [...s.activeSession.answers, answer],
      };
      updated.accuracy_pct = calculateAccuracy(updated.correct_count, updated.total_spots);
      return { activeSession: updated };
    });
  }

  function endSession() {
    const s = getState();
    if (!s.activeSession) return null;

    const ended = { ...s.activeSession, ended_at: new Date().toISOString() };

    const today = new Date().toISOString().split('T')[0];
    const wasAlive = isStreakAlive(s.profile.last_drill_date);
    const drilledToday = isDrilledToday(s.profile.last_drill_date);
    let newStreak = s.profile.current_streak;
    if (!drilledToday) {
      newStreak = wasAlive ? s.profile.current_streak + 1 : 1;
    }
    const newLongest = Math.max(newStreak, s.profile.longest_streak);

    setState((st) => ({
      activeSession: null,
      allSessions: [...st.allSessions, ended],
      profile: {
        ...st.profile,
        last_drill_date: today,
        current_streak: newStreak,
        longest_streak: newLongest,
      },
    }));

    return ended;
  }

  function getTodayMission() {
    const s = getState();
    const today = new Date().toISOString().split('T')[0];

    if (s.todayMission && s.todayMission.mission.mission_date === today) {
      return s.todayMission;
    }

    const dayOfYear = Math.floor(
      (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
    );
    const template = MISSIONS_POOL[dayOfYear % MISSIONS_POOL.length];
    const mission = {
      id: `mission-${today}`,
      mission_date: today,
      ...template,
    };

    const missionProgress = {
      mission,
      status: 'not_started',
      progress: { preflop_completed: 0, postflop_completed: 0, hand_reviews_completed: 0 },
      completed_at: null,
      xp_earned: 0,
    };

    setState({ todayMission: missionProgress });
    return missionProgress;
  }

  function updateMissionProgress(type) {
    setState((s) => {
      if (!s.todayMission) return s;
      const m = s.todayMission;
      if (m.status === 'completed') return s;

      const newProgress = { ...m.progress };
      if (type === 'preflop') newProgress.preflop_completed += 1;
      if (type === 'postflop') newProgress.postflop_completed += 1;
      if (type === 'review') newProgress.hand_reviews_completed += 1;

      const req = m.mission.requirements;
      const preflopDone = !req.preflop_spots || newProgress.preflop_completed >= req.preflop_spots;
      const postflopDone = !req.postflop_spots || newProgress.postflop_completed >= req.postflop_spots;
      const reviewDone = !req.hand_reviews || newProgress.hand_reviews_completed >= req.hand_reviews;
      const isComplete = preflopDone && postflopDone && reviewDone;

      return {
        todayMission: {
          ...m,
          progress: newProgress,
          status: isComplete ? 'completed' : 'in_progress',
          completed_at: isComplete ? new Date().toISOString() : null,
        },
      };
    });
  }

  function completeMission() {
    const s = getState();
    if (!s.todayMission || s.todayMission.status !== 'completed' || s.todayMission.xp_earned > 0) return;
    const xp = s.todayMission.mission.xp_reward;
    addXP(xp);
    setState((st) => ({
      todayMission: st.todayMission ? { ...st.todayMission, xp_earned: xp } : null,
    }));
  }

  function checkAndAwardBadges() {
    const s = getState();
    const earned = s.earnedBadges.map((b) => b.badge.slug);
    const newBadges = [];

    const totalSessions = s.allSessions.length;
    const totalPreflop = s.allSessions.reduce(
      (sum, sess) => sum + sess.answers.filter((a) => a.spot_type === 'preflop').length, 0
    );
    const totalPostflop = s.allSessions.reduce(
      (sum, sess) => sum + sess.answers.filter((a) => a.spot_type === 'postflop').length, 0
    );

    const checks = [
      { slug: 'first-drill', condition: totalSessions >= 1 },
      { slug: 'preflop-100', condition: totalPreflop >= 100 },
      { slug: 'postflop-50', condition: totalPostflop >= 50 },
      { slug: 'streak-7', condition: s.profile.longest_streak >= 7 },
      { slug: 'streak-30', condition: s.profile.longest_streak >= 30 },
      { slug: 'perfect-session', condition: s.allSessions.some((sess) => sess.total_spots >= 10 && sess.accuracy_pct === 100) },
      { slug: 'ev-saver', condition: s.allSessions.some((sess) => sess.total_spots >= 10 && sess.total_ev_loss_bb < 0.1) },
      { slug: 'mission-complete', condition: s.todayMission && s.todayMission.status === 'completed' },
    ];

    for (const { slug, condition } of checks) {
      if (condition && !earned.includes(slug)) {
        const badge = ALL_BADGES.find((b) => b.slug === slug);
        if (badge) newBadges.push({ badge, earned_at: new Date().toISOString() });
      }
    }

    if (newBadges.length > 0) {
      setState((st) => ({ earnedBadges: [...st.earnedBadges, ...newBadges] }));
    }

    return newBadges;
  }

  function getProgressData() {
    const s = getState();
    const sessions = s.allSessions;

    if (sessions.length === 0) {
      return {
        overall_accuracy: 0,
        total_spots_completed: 0,
        sessions_count: 0,
        total_ev_loss_bb: 0,
        by_position: [],
        by_spot_type: [],
        weekly_sessions: [],
        weakest_position: null,
        weakest_spot_type: null,
      };
    }

    const allAnswers = sessions.flatMap((s2) => s2.answers);
    const totalCorrect = allAnswers.filter((a) => a.is_correct).length;
    const totalSpots = allAnswers.length;
    const totalEVLoss = sessions.reduce((sum, s2) => sum + s2.total_ev_loss_bb, 0);

    const positionMap = new Map();
    for (const ans of allAnswers) {
      if (ans.position) {
        const cur = positionMap.get(ans.position) ?? { correct: 0, total: 0 };
        positionMap.set(ans.position, {
          correct: cur.correct + (ans.is_correct ? 1 : 0),
          total: cur.total + 1,
        });
      }
    }

    const byPosition = Array.from(positionMap.entries())
      .map(([position, { correct, total }]) => ({
        position,
        accuracy_pct: calculateAccuracy(correct, total),
        total_attempts: total,
      }))
      .sort((a, b) => a.accuracy_pct - b.accuracy_pct);

    const spotTypeMap = new Map();
    for (const ans of allAnswers) {
      const key = ans.action_type ?? ans.spot_type;
      const cur = spotTypeMap.get(key) ?? { correct: 0, total: 0 };
      spotTypeMap.set(key, {
        correct: cur.correct + (ans.is_correct ? 1 : 0),
        total: cur.total + 1,
      });
    }

    const bySpotType = Array.from(spotTypeMap.entries())
      .map(([spot_type, { correct, total }]) => ({
        spot_type,
        accuracy_pct: calculateAccuracy(correct, total),
        total_attempts: total,
      }))
      .sort((a, b) => a.accuracy_pct - b.accuracy_pct);

    const now = new Date();
    const weeklySessions = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const daySessions = sessions.filter((s2) => s2.ended_at && s2.ended_at.startsWith(dateStr));
      if (daySessions.length > 0) {
        const spots = daySessions.reduce((sum, s2) => sum + s2.total_spots, 0);
        const correct = daySessions.reduce((sum, s2) => sum + s2.correct_count, 0);
        const evLoss = daySessions.reduce((sum, s2) => sum + s2.total_ev_loss_bb, 0);
        weeklySessions.push({
          date: dateStr,
          accuracy_pct: calculateAccuracy(correct, spots),
          ev_loss_bb: evLoss,
          spots_completed: spots,
        });
      }
    }

    return {
      overall_accuracy: calculateAccuracy(totalCorrect, totalSpots),
      total_spots_completed: totalSpots,
      sessions_count: sessions.length,
      total_ev_loss_bb: Math.round(totalEVLoss * 100) / 100,
      by_position: byPosition,
      by_spot_type: bySpotType,
      weekly_sessions: weeklySessions,
      weakest_position: byPosition[0]?.position ?? null,
      weakest_spot_type: bySpotType[0]?.spot_type ?? null,
    };
  }

  function resetProgress() {
    setState({
      profile: { ...DEFAULT_PROFILE },
      earnedBadges: [],
      allSessions: [],
      activeSession: null,
      todayMission: null,
    });
  }

  // ── React hook ─────────────────────────────────────────────────────────────
  // Subscribes a component to store changes. Re-renders on every state change
  // (sufficient for this app's scale — avoids needing a selector diffing layer).

  function useAppStore() {
    const [, forceRender] = React.useState(0);
    React.useEffect(() => {
      const listener = () => forceRender((n) => n + 1);
      listeners.add(listener);
      return () => listeners.delete(listener);
    }, []);
    return getState();
  }

  window.GTOStore = {
    ALL_BADGES,
    MISSIONS_POOL,
    useAppStore,
    getState,
    updateProfile,
    addXP,
    startSession,
    recordAnswer,
    endSession,
    getTodayMission,
    updateMissionProgress,
    completeMission,
    checkAndAwardBadges,
    getProgressData,
    resetProgress,
  };
})();
