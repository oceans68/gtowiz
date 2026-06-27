/**
 * GTO Drill Coach — Hand History Parser (Static Bundle)
 * Plain-JS port of lib/hand-parser.ts
 * Off-table study only — no real-time assistance functionality.
 */
(function () {

  const PS_HAND_ID = /PokerStars Hand #(\d+)/i;
  const GG_HAND_ID = /RC\d+|HH\d+|\bGGPoker\b/i;
  const BLINDS_PATTERN = /\(\$?([\d.]+)\/\$?([\d.]+)\s*(?:USD|EUR)?\s*NL\b/i;
  const BLINDS_BB = /blinds\s+\$?([\d.]+)\/\$?([\d.]+)/i;
  const SEAT_PATTERN = /Seat\s+\d+:\s+(\w+)\s+\(\$?([\d,]+(?:\.\d+)?)\s*in chips\)/gi;
  const HOLE_CARDS_DEALT = /Dealt to (\w+)\s*\[([2-9TJQKA][cdhs])\s+([2-9TJQKA][cdhs])\]/i;
  const FOLD_ACTION = /(\w+): folds/i;
  const CALL_ACTION = /(\w+): calls \$?([\d.]+)/i;
  const RAISE_ACTION = /(\w+): raises \$?([\d.]+) to \$?([\d.]+)/i;
  const BET_ACTION = /(\w+): bets \$?([\d.]+)/i;
  const CHECK_ACTION = /(\w+): checks/i;
  const ALLIN_ACTION = /(\w+): (?:raises|calls|bets).+all-in/i;

  function parseHandHistory(rawText) {
    if (!rawText || rawText.trim().length < 50) {
      return {
        status: 'failed',
        parsed: null,
        error: 'Hand history is too short or empty.',
        notes: 'Please paste a complete hand history.',
      };
    }

    const isPokerStars = PS_HAND_ID.test(rawText);
    const isGGPoker = GG_HAND_ID.test(rawText);

    if (!isPokerStars && !isGGPoker) {
      return parseGeneric(rawText);
    }

    return parseStandard(rawText);
  }

  function parseStandard(raw) {
    const hand = {
      hero_hand: null,
      positions: {},
      stack_sizes: {},
      blinds: { small: 0, big: 0 },
      preflop: { actions: [], pot_after: 0 },
      flop: null,
      turn: null,
      river: null,
      key_decision_points: [],
      leak_categories: [],
      suggested_drill_types: [],
    };

    const blindsMatch = raw.match(BLINDS_PATTERN) || raw.match(BLINDS_BB);
    if (blindsMatch) {
      hand.blinds = {
        small: parseFloat(blindsMatch[1]),
        big: parseFloat(blindsMatch[2]),
      };
    }

    const seatMatches = [...raw.matchAll(SEAT_PATTERN)];
    for (const m of seatMatches) {
      const player = m[1];
      const stack = parseFloat(m[2].replace(',', ''));
      hand.stack_sizes[player] = stack;
    }

    const holeMatch = raw.match(HOLE_CARDS_DEALT);
    if (holeMatch) {
      hand.hero_hand = [holeMatch[2], holeMatch[3]];
    }

    const preflopStart = raw.indexOf('*** HOLE CARDS ***') !== -1
      ? raw.indexOf('*** HOLE CARDS ***')
      : raw.indexOf('HOLE CARDS');
    const flopStart = raw.indexOf('*** FLOP ***') !== -1
      ? raw.indexOf('*** FLOP ***')
      : raw.indexOf('FLOP [');
    const turnStart = raw.indexOf('*** TURN ***') !== -1
      ? raw.indexOf('*** TURN ***')
      : raw.indexOf('TURN [');
    const riverStart = raw.indexOf('*** RIVER ***') !== -1
      ? raw.indexOf('*** RIVER ***')
      : raw.indexOf('RIVER [');
    const summaryStart = raw.indexOf('*** SUMMARY ***') !== -1
      ? raw.indexOf('*** SUMMARY ***')
      : raw.length;

    if (preflopStart !== -1) {
      const end = flopStart !== -1 ? flopStart : summaryStart;
      hand.preflop = parseStreetActions(raw.slice(preflopStart, end), undefined);
    }

    if (flopStart !== -1) {
      const end = turnStart !== -1 ? turnStart : (riverStart !== -1 ? riverStart : summaryStart);
      const flopText = raw.slice(flopStart, end);
      const boardMatch = flopText.match(/\[([2-9TJQKAcdhs ]+)\]/);
      const cards = boardMatch ? boardMatch[1].split(' ').filter(Boolean) : [];
      hand.flop = parseStreetActions(flopText, cards);
    }

    if (turnStart !== -1) {
      const end = riverStart !== -1 ? riverStart : summaryStart;
      const turnText = raw.slice(turnStart, end);
      const allCards = [...raw.slice(flopStart, end).matchAll(/\[([2-9TJQKAcdhs ]+)\]/g)];
      const turnCard = allCards.length >= 2 ? allCards[allCards.length - 1][1].split(' ').filter(Boolean) : [];
      hand.turn = parseStreetActions(turnText, turnCard);
    }

    if (riverStart !== -1) {
      const riverText = raw.slice(riverStart, summaryStart);
      const allCards = [...riverText.matchAll(/\[([2-9TJQKAcdhs ]+)\]/g)];
      const riverCard = allCards.length > 0 ? [allCards[allCards.length - 1][1].split(' ').filter(Boolean).pop()] : [];
      hand.river = parseStreetActions(riverText, riverCard);
    }

    analyzeDecisionPoints(hand);

    const hasMinimum = hand.blinds.big > 0 || hand.preflop.actions.length > 0;

    return {
      status: hasMinimum ? (hand.hero_hand ? 'success' : 'partial') : 'partial',
      parsed: hand,
      error: null,
      notes: hand.hero_hand
        ? 'Hand parsed successfully. Review is for study purposes only.'
        : "Hero hand not detected — ensure the hand is from hero's perspective.",
    };
  }

  function parseGeneric(raw) {
    const hand = {
      hero_hand: null,
      positions: {},
      stack_sizes: {},
      blinds: { small: 0.5, big: 1 },
      preflop: { actions: [], pot_after: 0 },
      flop: null,
      turn: null,
      river: null,
      key_decision_points: ['Could not fully parse hand structure'],
      leak_categories: [],
      suggested_drill_types: ['preflop', 'postflop'],
    };

    const cardPattern = /\b([2-9TJQKA][cdhs])\b/g;
    const foundCards = [...raw.matchAll(cardPattern)].map((m) => m[1]);

    if (foundCards.length >= 2) {
      hand.hero_hand = [foundCards[0], foundCards[1]];
    }

    if (foundCards.length >= 5) {
      hand.flop = {
        cards: [foundCards[2], foundCards[3], foundCards[4]],
        actions: [],
        pot_after: 0,
      };
    }

    return {
      status: 'partial',
      parsed: hand,
      error: null,
      notes: 'Format not fully recognized. Showing partial extraction. For best results, paste PokerStars or GGPoker hand histories.',
    };
  }

  function parseStreetActions(text, cards) {
    const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
    const actions = [];
    let pot = 0;

    for (const line of lines) {
      const fold = line.match(FOLD_ACTION);
      if (fold) { actions.push({ player: fold[1], action: 'folds' }); continue; }

      const check = line.match(CHECK_ACTION);
      if (check) { actions.push({ player: check[1], action: 'checks' }); continue; }

      const call = line.match(CALL_ACTION);
      if (call) {
        const amount = parseFloat(call[2]);
        pot += amount;
        actions.push({ player: call[1], action: 'calls', amount }); continue;
      }

      const bet = line.match(BET_ACTION);
      if (bet) {
        const amount = parseFloat(bet[2]);
        pot += amount;
        actions.push({ player: bet[1], action: 'bets', amount }); continue;
      }

      const raise = line.match(RAISE_ACTION);
      if (raise) {
        const amount = parseFloat(raise[3]);
        pot += amount;
        actions.push({ player: raise[1], action: 'raises', amount }); continue;
      }

      const allin = line.match(ALLIN_ACTION);
      if (allin) {
        actions.push({ player: allin[1], action: 'all-in' }); continue;
      }
    }

    return { cards, actions, pot_after: pot };
  }

  function analyzeDecisionPoints(hand) {
    const points = [];
    const leaks = [];
    const drillTypes = [];

    const preflopRaises = hand.preflop.actions.filter(
      (a) => a.action === 'raises' || a.action === 'all-in'
    );
    const preflopCalls = hand.preflop.actions.filter((a) => a.action === 'calls');

    if (preflopRaises.length > 1) {
      points.push('3-bet or 4-bet situation preflop');
      leaks.push('3-bet pot dynamics');
      drillTypes.push('preflop-3bet');
    } else if (preflopCalls.length > 0) {
      points.push('Preflop call vs open');
      drillTypes.push('preflop-vs-open');
    }

    if (hand.hero_hand) {
      const [c1, c2] = hand.hero_hand;
      const r1 = c1.slice(0, -1);
      const r2 = c2.slice(0, -1);
      const suited = c1.slice(-1) === c2.slice(-1);
      const isPremium = ['A', 'K', 'Q', 'J'].includes(r1) && ['A', 'K', 'Q', 'J'].includes(r2);
      if (!isPremium && !suited) {
        leaks.push('Offsuit non-premium hand selection');
      }
    }

    if (hand.flop) {
      points.push(`Flop decision: ${hand.flop.cards ? hand.flop.cards.join(' ') : 'unknown board'}`);
      if (hand.flop.actions.length === 0) {
        points.push('No flop action recorded — hand may have ended preflop');
      } else {
        const flopBets = hand.flop.actions.filter((a) => a.action === 'bets' || a.action === 'raises');
        if (flopBets.length > 0) {
          leaks.push('C-bet sizing and frequency');
          drillTypes.push('postflop-cbet');
        }
      }
    }

    if (hand.turn && hand.flop) {
      points.push(`Turn decision: ${hand.turn.cards ? hand.turn.cards.join(' ') : ''} on ${hand.flop.cards ? hand.flop.cards.join(' ') : ''}`);
      leaks.push('Turn barrel or check strategy');
      drillTypes.push('postflop-turn');
    }

    if (hand.river) {
      points.push('River decision point');
      leaks.push('River bet sizing and polarization');
      drillTypes.push('postflop-river');
    }

    hand.key_decision_points = points.length > 0 ? points : ['Complete action sequence not detected'];
    hand.leak_categories = [...new Set(leaks)];
    hand.suggested_drill_types = [...new Set(drillTypes.length > 0 ? drillTypes : ['preflop', 'postflop'])];
  }

  function formatParsedHand(parsed) {
    const lines = [];

    if (parsed.hero_hand) {
      lines.push(`Hero hand: ${parsed.hero_hand.join(' ')}`);
    }

    lines.push(`Blinds: ${parsed.blinds.small}/${parsed.blinds.big}`);

    if (Object.keys(parsed.stack_sizes).length > 0) {
      lines.push('Stacks: ' + Object.entries(parsed.stack_sizes)
        .map(([p, s]) => `${p}: $${s}`)
        .join(', '));
    }

    if (parsed.preflop.actions.length > 0) {
      lines.push('Preflop: ' + parsed.preflop.actions
        .map((a) => `${a.player} ${a.action}${a.amount ? ` $${a.amount}` : ''}`)
        .join(', '));
    }

    if (parsed.flop) {
      lines.push(`Flop [${parsed.flop.cards ? parsed.flop.cards.join(' ') : '?'}]: ` +
        parsed.flop.actions.map((a) => `${a.player} ${a.action}${a.amount ? ` $${a.amount}` : ''}`).join(', '));
    }

    if (parsed.turn) {
      lines.push(`Turn [${parsed.turn.cards ? parsed.turn.cards.join(' ') : '?'}]: ` +
        parsed.turn.actions.map((a) => `${a.player} ${a.action}${a.amount ? ` $${a.amount}` : ''}`).join(', '));
    }

    if (parsed.river) {
      lines.push(`River [${parsed.river.cards ? parsed.river.cards.join(' ') : '?'}]: ` +
        parsed.river.actions.map((a) => `${a.player} ${a.action}${a.amount ? ` $${a.amount}` : ''}`).join(', '));
    }

    return lines.join('\n');
  }

  window.GTOHandParser = {
    parseHandHistory,
    formatParsedHand,
  };
})();
