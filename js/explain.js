/**
 * GTO Drill Coach — Explanation Engine
 *
 * Inspired by GTO Wizard's "Daily Dose of GTO" approach:
 * - Explains the WHY behind each decision, not just right/wrong
 * - Addresses the specific common mistake the trainee made
 * - Teaches the underlying strategic principle (threshold thinking)
 * - Uses GTO Wizard terminology: EV, frequency, blunders, thresholds
 */
(function () {
  // ── Preflop explanation by scenario type ─────────────────────────────────

  const ACTION_REASONS = {
    // Why this is the right action for common preflop spots
    raise: {
      rfi: "Opening here adds dead money from the blinds to the pot and gives you the initiative.",
      vs_open: "3-betting here for value — your hand dominates the villain's opening range.",
      vs_limp: "Isolation raise forces the limper to play a big pot with a capped range, or fold.",
      three_bet: "Your hand has enough equity and playability to build the pot preflop.",
      vs_four_bet: "Going all-in here — villain's 4-bet range is often capped, and you have the best hand.",
      push_fold: "Shoving here is the highest EV play at this stack depth given fold equity.",
      default: "Raising captures equity from opponents with worse hands and takes the initiative.",
    },
    fold: {
      rfi: "This hand is below the opening threshold — the EV of opening is negative at this position.",
      vs_open: "Your hand is dominated too often by villain's raising range to continue profitably.",
      vs_limp: "Even against a capped limp range, this hand doesn't have sufficient equity to continue.",
      three_bet: "This hand is not strong enough to 3-bet for value, and not suited enough to 3-bet as a bluff.",
      vs_four_bet: "Against a 4-bet, this hand was a bluff in the 3-bet range — it has to give up now.",
      push_fold: "At this stack depth, this hand doesn't have enough fold equity or showdown equity to shove.",
      default: "Folding preserves your stack for better spots — this hand can't play well vs the action.",
    },
    call: {
      vs_open: "Calling keeps your range balanced and realizes equity without inflating the pot pre.",
      vs_limp: "Calling here (overcalling) takes a cheap, speculative flop in position.",
      three_bet: "Your hand is too strong to fold but not strong enough to 4-bet for value.",
      default: "Calling here realizes equity while keeping pot manageable.",
    },
    check: {
      vs_limp: "Checking back as BB costs nothing and lets you realize equity on many favorable flops.",
      default: "Checking here protects your range and avoids building a pot with a marginal holding.",
    },
    allin: {
      push_fold: "Shoving all-in is the only raise option at this stack depth — committing forces the best outcome.",
      default: "All-in is correct here — you have enough equity and fold equity at this stack depth.",
    },
  };

  // Common mistakes by action type — what most players do wrong
  const COMMON_MISTAKES = {
    fold_when_should_raise: "Most players fold too tightly here and give up EV by not opening strong enough hands.",
    call_when_should_raise: "Many players cold-call instead of 3-betting, letting villain realize equity cheaply.",
    raise_when_should_fold: "Players over-bluff here by raising hands that have no fold equity or showdown value.",
    raise_when_should_call: "Over-raising inflates the pot with a hand that plays better as a flatter — villain's range crushes your 4-bet range.",
    call_when_should_fold: "This is a common trap — hand looks decent but is dominated too often against this action.",
    check_when_should_raise: "Checking here gives free equity to villain's weak hands; raising forces them to fold or pay.",
    fold_when_should_check: "BB gets a free look here — folding before the flop gives up equity for zero cost.",
  };

  // Key poker concepts for each scenario type
  const THRESHOLD_CONCEPTS = {
    rfi: "In position, open wide but not recklessly. The threshold is how often your hand can c-bet or realize equity postflop.",
    vs_open: "vs open: threshold thinking means 3-bet the top X% of your range for value, fold the bottom Y%, and call the rest.",
    vs_limp: "vs limpers, isolate with any hand that profits from playing a heads-up pot in position vs a capped range.",
    three_bet: "3-bet range = value hands + bluffs. Bluff hands should have blockers and playability (A3-A5s, not random junk).",
    vs_four_bet: "vs 4-bet: only the strongest of your 3-bet range can continue. Most 3-bet bluffs are mandatory folds.",
    push_fold: "Push-fold is pure math: compare your equity vs calling range to pot odds, factoring fold equity.",
    blind_defense: "BB defense uses pot odds: at 2.5x, you need ~28% equity to call. You get a discount from the blind already posted.",
  };

  function getFallbackExplanation(req) {
    const {
      user_action,
      correct_action,
      is_correct,
      spot_type,
      preflop_action_type,
      position,
      combo,
      frequency,
      user_freq,
      correct_freq,
      gtow_score,
    } = req;

    const isPreflop = spot_type === 'preflop';
    const actionType = preflop_action_type || 'default';
    const freq = frequency ?? 1.0;
    const cFreq = correct_freq ?? freq;
    const uFreq = user_freq ?? 0;
    const score = gtow_score ?? (is_correct ? 100 : -50);

    const userLabel = getActionLabel(user_action);
    const correctLabel = getActionLabel(correct_action);
    const pos = position || 'this position';

    // Score line
    const scoreEmoji = score >= 70 ? '✅' : score >= 20 ? '⚠️' : score >= 0 ? '📉' : '❌';
    const scoreLine = `${scoreEmoji} **GTOW Score: ${score > 0 ? '+' : ''}${score}** — ${score >= 70 ? 'Well played!' : score >= 0 ? 'Inaccuracy.' : score >= -50 ? 'Mistake.' : 'Blunder!'}`;

    if (isPreflop) {
      // Get the why for the correct action
      const whyLines = ACTION_REASONS[correct_action] || {};
      const whyText = whyLines[actionType] || whyLines['default'] || `${correctLabel} is the GTO play in this spot.`;
      const concept = THRESHOLD_CONCEPTS[actionType] || '';

      if (is_correct) {
        // Correct — explain why and add depth
        const isMixed = cFreq < 0.75;
        const mixLine = isMixed
          ? `\n🎲 **Mixed spot (${Math.round(cFreq * 100)}% ${correctLabel}):** This is a genuine mixing spot — GTO plays ${correctLabel} only ${Math.round(cFreq * 100)}% of the time. You were right to ${correctLabel.toLowerCase()}, but so would a small ${correctLabel === 'Fold' ? 'bluff-catch or call' : 'fold'} be.`
          : '';
        return `${scoreLine}\n\n✅ **${correctLabel} — Correct!**\n🧠 **Why:** ${whyText}${mixLine}\n💡 **Concept:** ${concept}`;
      }

      // Wrong answer — address the specific mistake
      let mistakeType = `${user_action}_when_should_${correct_action}`;
      const mistakeText = COMMON_MISTAKES[mistakeType] || `The typical mistake here is defaulting to ${userLabel} without checking if ${correctLabel} is more profitable.`;

      // EV loss context
      const isBigMistake = score < -75;
      const evLine = isBigMistake
        ? `\n💸 **This is a blunder** — never played in GTO, costing significant EV. Memorize this threshold.`
        : uFreq > 0
        ? `\n📊 GTO plays ${userLabel} only ${Math.round(uFreq * 100)}% of the time here — it's not completely wrong, but it's low frequency.`
        : `\n📊 GTO never plays ${userLabel} here.`;

      return `${scoreLine}\n\n❌ **${correctLabel} — not ${userLabel}** in this spot\n🧠 **Why ${correctLabel}:** ${whyText}${evLine}\n🎭 **Common mistake:** ${mistakeText}\n💡 **Concept:** ${concept}`;
    }

    // Postflop explanation
    if (is_correct) {
      return `${scoreLine}\n\n✅ **${correctLabel} — Correct postflop decision!**\n🧠 Consider board texture, SPR, and your range advantage when deciding how to proceed.\n💡 GTO balances between value, bluffs, and pot control based on the specific board.`;
    }
    return `${scoreLine}\n\n❌ **${correctLabel} was correct — not ${userLabel}**\n🧠 On this board texture, your hand plays better with ${correctLabel.toLowerCase()} due to range advantage and SPR considerations.\n🎭 **Common mistake:** Defaulting to ${userLabel} without considering how this board hits both ranges.`;
  }

  function getActionLabel(action) {
    const labels = { fold: 'Fold', call: 'Call', raise: 'Raise', check: 'Check', allin: 'All-In', three_bet: '3-Bet', four_bet: '4-Bet' };
    return labels[action] || action;
  }

  window.GTOExplain = { getFallbackExplanation };
})();
