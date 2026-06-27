/**
 * GTO Drill Coach — Utilities Bundle
 * Plain-JS port of lib/utils.ts
 */
(function () {

  const LEVEL_TITLES = {
    1: 'Fish',
    2: 'Shark Bait',
    3: 'Reg',
    4: 'Solid Reg',
    5: 'TAG Pro',
    6: 'GTO Student',
    7: 'Range Wizard',
    8: 'Drill Master',
    9: 'GTO Ninja',
    10: 'GTO Drill Coach Legend',
  };

  const XP_THRESHOLDS = {
    1: 0,
    2: 200,
    3: 500,
    4: 1200,
    5: 2500,
    6: 5000,
    7: 10000,
    8: 20000,
    9: 40000,
    10: 75000,
  };

  // ── className merger (simplified clsx) ──────────────────────────────────
  function cn(...inputs) {
    const classes = [];
    for (const input of inputs) {
      if (!input) continue;
      if (typeof input === 'string') classes.push(input);
      else if (Array.isArray(input)) classes.push(cn(...input));
      else if (typeof input === 'object') {
        for (const key in input) if (input[key]) classes.push(key);
      }
    }
    // Simple de-dupe by splitting on space (no tailwind-merge conflict resolution,
    // but our class lists rarely conflict in ways that matter for this app)
    return classes.join(' ').split(' ').filter(Boolean).join(' ');
  }

  // ── XP / Level ────────────────────────────────────────────────────────────

  function getLevelFromXP(xp) {
    const levels = [10, 9, 8, 7, 6, 5, 4, 3, 2, 1];
    for (const level of levels) {
      if (xp >= XP_THRESHOLDS[level]) return level;
    }
    return 1;
  }

  function getXPForNextLevel(level) {
    if (level >= 10) return XP_THRESHOLDS[10];
    return XP_THRESHOLDS[level + 1];
  }

  function getLevelProgress(xp, level) {
    if (level >= 10) return 100;
    const currentThreshold = XP_THRESHOLDS[level];
    const nextThreshold = XP_THRESHOLDS[level + 1];
    return Math.round(((xp - currentThreshold) / (nextThreshold - currentThreshold)) * 100);
  }

  function getLevelTitle(level) {
    return LEVEL_TITLES[level];
  }

  // ── Scoring engine ────────────────────────────────────────────────────────

  // ── GTO Wizard-style scoring ─────────────────────────────────────────────
  // Mirrors GTO Wizard's -100 to +100 GTOW Score:
  //   Best Move (highest freq): +100 score, full XP
  //   Correct (taken at some freq): 0 to +80 based on frequency
  //   Inaccuracy (<3.5% GTO freq but small EV loss): 0 score, no XP loss
  //   Wrong Move (never GTO): -50 to -100 based on EV cost
  //   Blunder (costly wrong move): -100
  //
  // Additionally tracks action distribution to power the balanced drill selector.
  function scoreAnswer(userAction, correctAction, evLossAvailable, postflopActions, comboAllActions, frequency) {
    const isCorrect = userAction === correctAction;
    const freq = frequency ?? 1.0;

    if (postflopActions) {
      const chosen = postflopActions.find((a) => a.action === userAction);
      if (chosen) {
        const evLoss = chosen.ev_loss_vs_best ?? 0;
        const gtowScore = chosen.is_recommended ? 100 : chosen.is_acceptable ? 30 : Math.max(-100, -50 - evLoss * 100);
        return {
          is_correct: chosen.is_recommended,
          ev_loss_bb: evLoss,
          ev_is_estimated: true,
          xp_earned: chosen.is_recommended ? 15 : chosen.is_acceptable ? 8 : 2,
          gtow_score: gtowScore,
          feedback_label: chosen.label === 'best' ? 'correct' : chosen.label === 'acceptable' ? 'acceptable' : chosen.label === 'minor_mistake' ? 'minor_mistake' : chosen.label === 'mistake' ? 'mistake' : 'big_mistake',
        };
      }
    }

    // Preflop scoring
    if (comboAllActions && comboAllActions.length > 0) {
      // Check if user action is taken at any frequency in GTO
      const userActionData = comboAllActions.find((a) => a.action === userAction);
      const userFreq = userActionData ? userActionData.frequency : 0;
      const correctData = comboAllActions.find((a) => a.action === correctAction);
      const correctFreq = correctData ? correctData.frequency : freq;

      let gtowScore, feedbackLabel, xpEarned;

      if (userAction === correctAction) {
        // Best move — full credit scaled by how obvious it was
        // If freq=0.5 (mixed), it's harder to know → give more credit than freq=1.0
        const difficulty_bonus = freq < 0.7 ? 20 : 0;
        gtowScore = 100;
        feedbackLabel = 'correct';
        xpEarned = 10 + difficulty_bonus;
      } else if (userFreq >= 0.15) {
        // Valid at some GTO frequency (not the best, but not wrong)
        gtowScore = Math.round(userFreq * 60); // 15% freq → +9, 40% freq → +24
        feedbackLabel = 'acceptable';
        xpEarned = 5;
      } else if (userFreq > 0 && userFreq < 0.15) {
        // Taken but rarely in GTO — inaccuracy
        gtowScore = 0;
        feedbackLabel = 'minor_mistake';
        xpEarned = 2;
      } else {
        // Never taken in GTO — wrong or blunder
        // Severity based on how clear-cut the correct answer was
        const isBlunder = correctFreq > 0.85 && userFreq === 0;
        gtowScore = isBlunder ? -100 : -50;
        feedbackLabel = isBlunder ? 'big_mistake' : 'mistake';
        xpEarned = 0;
      }

      return {
        is_correct: userAction === correctAction,
        ev_loss_bb: evLossAvailable ?? (isCorrect ? 0 : correctFreq > 0.7 ? 0.8 : 0.3),
        ev_is_estimated: true,
        xp_earned: xpEarned,
        gtow_score: gtowScore,
        feedback_label: feedbackLabel,
        user_freq: userFreq,
        correct_freq: correctFreq,
      };
    }

    // Fallback
    if (isCorrect) {
      return { is_correct: true, ev_loss_bb: 0, ev_is_estimated: true, xp_earned: 10, gtow_score: 100, feedback_label: 'correct' };
    }
    return { is_correct: false, ev_loss_bb: 0.5, ev_is_estimated: true, xp_earned: 0, gtow_score: -50, feedback_label: 'mistake' };
  }

  // ── Accuracy ──────────────────────────────────────────────────────────────

  function calculateAccuracy(correct, total) {
    if (total === 0) return 0;
    return Math.round((correct / total) * 100);
  }

  // ── Streak logic ──────────────────────────────────────────────────────────

  function isStreakAlive(lastDrillDate) {
    if (!lastDrillDate) return false;
    const last = new Date(lastDrillDate);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const lastStr = last.toISOString().split('T')[0];
    const todayStr = today.toISOString().split('T')[0];
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    return lastStr === todayStr || lastStr === yesterdayStr;
  }

  function isDrilledToday(lastDrillDate) {
    if (!lastDrillDate) return false;
    const last = new Date(lastDrillDate);
    const today = new Date();
    return last.toISOString().split('T')[0] === today.toISOString().split('T')[0];
  }

  // ── Source labels ─────────────────────────────────────────────────────────

  function getSourceLabel(sourceType) {
    const labels = {
      solver_verified: '✓ Solver Verified',
      imported_chart: '📊 Imported Chart',
      coach_entered: '👨‍🏫 Coach Entered',
      estimated: '~ Estimated',
      sample: '⚠ Sample Training Data',
    };
    return labels[sourceType];
  }

  function getSourceColor(sourceType) {
    const colors = {
      solver_verified: 'text-green-400 bg-green-400/10',
      imported_chart: 'text-teal-400 bg-teal-400/10',
      coach_entered: 'text-blue-400 bg-blue-400/10',
      estimated: 'text-amber-400 bg-amber-400/10',
      sample: 'text-orange-400 bg-orange-400/10',
    };
    return colors[sourceType];
  }

  // ── Action display ────────────────────────────────────────────────────────

  // ── GTOW Score label ──────────────────────────────────────────────────────
  function getGTOWScoreLabel(score) {
    if (score === null || score === undefined) return { label: '—', color: '#64748b', emoji: '—' };
    if (score >= 90) return { label: 'Elite', color: '#00cc66', emoji: '🏆' };
    if (score >= 70) return { label: 'Strong', color: '#00d4ff', emoji: '💎' };
    if (score >= 50) return { label: 'Good', color: '#7b61ff', emoji: '✅' };
    if (score >= 20) return { label: 'Average', color: '#ffb800', emoji: '📈' };
    if (score >= 0) return { label: 'Weak', color: '#ff8c42', emoji: '⚠️' };
    return { label: 'Leaking', color: '#ff4444', emoji: '🚨' };
  }

  function getActionLabel(action) {
    const labels = {
      fold: 'Fold',
      call: 'Call',
      raise: 'Raise',
      three_bet: '3-Bet',
      four_bet: '4-Bet',
      allin: 'All-In',
      check: 'Check',
      bet_25: 'Bet 25%',
      bet_33: 'Bet 33%',
      bet_50: 'Bet 50%',
      bet_75: 'Bet 75%',
      bet_100: 'Bet 100%',
      bet_125: 'Bet 125%',
    };
    return labels[action] ?? action;
  }

  function getActionColor(action) {
    if (action === 'fold') return 'bg-slate-600 hover:bg-slate-500 text-white';
    if (action === 'check' || action === 'call') return 'bg-blue-600 hover:bg-blue-500 text-white';
    if (action === 'allin') return 'bg-red-600 hover:bg-red-500 text-white';
    if (action.startsWith('bet') || action === 'raise')
      return 'bg-teal-600 hover:bg-teal-500 text-white';
    if (action === 'three_bet' || action === 'four_bet')
      return 'bg-purple-600 hover:bg-purple-500 text-white';
    return 'bg-slate-600 hover:bg-slate-500 text-white';
  }

  // ── Position display ──────────────────────────────────────────────────────

  function getPositionFull(position) {
    const labels = {
      UTG: 'Under the Gun',
      UTG1: 'UTG+1',
      MP: 'Middle Position',
      CO: 'Cutoff',
      BTN: 'Button',
      SB: 'Small Blind',
      BB: 'Big Blind',
    };
    return labels[position] ?? position;
  }

  function getActionTypeFull(actionType) {
    const labels = {
      rfi: 'Open Raise (RFI)',
      vs_open: 'Facing Open',
      vs_limp: 'Facing Limp',
      three_bet: '3-Bet',
      vs_three_bet: 'Facing 3-Bet',
      four_bet: '4-Bet',
      vs_four_bet: 'Facing 4-Bet',
      squeeze: 'Squeeze',
      blind_defense: 'Blind Defense',
      push_fold: 'Push/Fold',
    };
    return labels[actionType] ?? actionType;
  }

  // ── Number formatting ─────────────────────────────────────────────────────

  function formatEV(ev, estimated) {
    if (ev === null || ev === undefined) return 'N/A';
    const sign = ev >= 0 ? '+' : '';
    return `${sign}${ev.toFixed(2)} bb${estimated ? ' (est.)' : ''}`;
  }

  function formatPct(pct) {
    return `${Math.round(pct)}%`;
  }

  // ── Mission progress ──────────────────────────────────────────────────────

  function getMissionProgressPct(progress, requirements) {
    const parts = [];
    if (requirements.preflop_spots) {
      parts.push(Math.min(1, progress.preflop_completed / requirements.preflop_spots));
    }
    if (requirements.postflop_spots) {
      parts.push(Math.min(1, progress.postflop_completed / requirements.postflop_spots));
    }
    if (requirements.hand_reviews) {
      parts.push(Math.min(1, progress.hand_reviews_completed / requirements.hand_reviews));
    }
    if (parts.length === 0) return 0;
    return Math.round((parts.reduce((a, b) => a + b, 0) / parts.length) * 100);
  }

  window.GTOUtils = {
    LEVEL_TITLES,
    XP_THRESHOLDS,
    cn,
    getLevelFromXP,
    getXPForNextLevel,
    getLevelProgress,
    getLevelTitle,
    scoreAnswer,
    calculateAccuracy,
    isStreakAlive,
    isDrilledToday,
    getSourceLabel,
    getSourceColor,
    getActionLabel,
    getGTOWScoreLabel,
    getActionColor,
    getPositionFull,
    getActionTypeFull,
    formatEV,
    formatPct,
    getMissionProgressPct,
  };
})();
