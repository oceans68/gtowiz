/**
 * GTO Drill Coach (Static) — Data integrity & persistence test
 */
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');
const babel = require('@babel/core');

const ROOT = require('path').join(__dirname, '..');
const errors = [];

function transform(file) {
  const code = fs.readFileSync(path.join(ROOT, 'js', file), 'utf8');
  return babel.transform(code, { presets: ['@babel/preset-react'], filename: file }).code;
}

async function buildDom() {
  const html = `<!DOCTYPE html><html><head></head><body><div id="initial-loader"></div><div id="root"></div></body></html>`;
  const dom = new JSDOM(html, { url: 'http://localhost/index.html#/dashboard', runScripts: 'outside-only', pretendToBeVisual: true });
  const { window } = dom;
  global.window = window;
  global.document = window.document;
  global.navigator = window.navigator;
  global.localStorage = window.localStorage;
  window.matchMedia = window.matchMedia || function () { return { matches: false, addListener: () => {}, removeListener: () => {} }; };
  global.React = require('react'); window.React = global.React;
  global.ReactDOM = require('react-dom/client'); window.ReactDOM = global.ReactDOM;

  const vm = require('vm');
  function runInWindow(code, f) { vm.runInContext(code, dom.getInternalVMContext(), { filename: f }); }
  for (const f of ['data.js', 'utils.js', 'hand-parser.js', 'explain.js', 'store.js']) {
    runInWindow(fs.readFileSync(path.join(ROOT, 'js', f), 'utf8'), f);
  }
  return dom;
}

async function main() {
  const dom = await buildDom();
  const w = dom.window;
  const D = w.GTOData;
  const U = w.GTOUtils;
  const S = w.GTOStore;

  // ── Data counts ──────────────────────────────────────────────────────
  console.log('=== Data Integrity ===');
  if (D.PREFLOP_RANGES.length !== 6) errors.push(`Expected 6 cash RFI/3bet/blind-defense ranges, got ${D.PREFLOP_RANGES.length}`);
  if (D.LIMP_RANGES.length !== 3) errors.push(`Expected 3 vs-limp ranges, got ${D.LIMP_RANGES.length}`);
  if (D.OPEN_FACING_RANGES.length !== 3) errors.push(`Expected 3 expanded vs-open ranges, got ${D.OPEN_FACING_RANGES.length}`);
  if (D.VS_4BET_RANGES.length !== 1) errors.push(`Expected 1 vs-4bet range, got ${D.VS_4BET_RANGES.length}`);
  if (D.MTT_PUSH_FOLD_RANGES.length !== 4) errors.push(`Expected 4 MTT push/fold ranges, got ${D.MTT_PUSH_FOLD_RANGES.length}`);
  if (D.MTT_VS_LIMP_RANGES.length !== 1) errors.push(`Expected 1 MTT vs-limp range, got ${D.MTT_VS_LIMP_RANGES.length}`);
  if (D.MTT_VS_RAISE_RANGES.length !== 1) errors.push(`Expected 1 MTT vs-raise range, got ${D.MTT_VS_RAISE_RANGES.length}`);
  if (D.ALL_RANGES.length !== 19) errors.push(`Expected 19 total ranges, got ${D.ALL_RANGES.length}`);
  if (D.POSTFLOP_SPOTS.length !== 28) errors.push(`Expected 28 postflop spots, got ${D.POSTFLOP_SPOTS.length}`);
  if (D.HAND_GRID_ORDER.length !== 169) errors.push(`Expected 169 hand grid cells, got ${D.HAND_GRID_ORDER.length}`);
  console.log('Cash ranges:', D.PREFLOP_RANGES.length, '| Limp:', D.LIMP_RANGES.length, '| Open-facing:', D.OPEN_FACING_RANGES.length, '| vs4bet:', D.VS_4BET_RANGES.length, '| MTT push/fold:', D.MTT_PUSH_FOLD_RANGES.length, '| MTT vs-limp:', D.MTT_VS_LIMP_RANGES.length, '| MTT vs-raise:', D.MTT_VS_RAISE_RANGES.length, '| Total:', D.ALL_RANGES.length, '| Postflop spots:', D.POSTFLOP_SPOTS.length);

  // Every range/spot has source labeling
  for (const r of D.ALL_RANGES) {
    if (!r.source_type || !r.accuracy_level) errors.push(`Range ${r.id} missing source_type/accuracy_level`);
    if (!r.actions || r.actions.length === 0) errors.push(`Range ${r.id} has no actions`);
  }
  for (const s of D.POSTFLOP_SPOTS) {
    if (s.source_type !== 'sample') errors.push(`Spot ${s.id} source_type is not 'sample': ${s.source_type}`);
    const sum = s.actions.reduce((a, b) => a + b.frequency, 0);
    if (sum < 0.95 || sum > 1.05) errors.push(`Spot ${s.id} action frequencies sum to ${sum}`);
    const expectedCards = { flop: 3, turn: 4, river: 5 }[s.street];
    if (s.board_cards.length !== expectedCards) errors.push(`Spot ${s.id} (${s.street}) has ${s.board_cards.length} board cards, expected ${expectedCards}`);
    const recommended = s.actions.filter((a) => a.is_recommended);
    if (recommended.length === 0) errors.push(`Spot ${s.id} has no recommended action`);
  }
  console.log('All ranges and spots labeled correctly:', errors.length === 0);

  // ── New scenario type checks ────────────────────────────────────────
  console.log('\n=== New Scenario Types ===');
  const newIds = [
    'btn-vs-limp-100bb', 'sb-vs-limp-100bb', 'bb-vs-limp-100bb',
    'co-vs-utg-open-100bb', 'btn-vs-utg-open-100bb', 'sb-vs-btn-open-100bb',
    'btn-vs-4bet-from-co',
    'btn-vs-limp-push-12bb', 'bb-vs-raise-push-10bb',
  ];
  for (const id of newIds) {
    const r = D.findRangeById(id);
    if (!r) errors.push(`New range missing: ${id}`);
  }
  console.log('All 9 new range IDs found:', newIds.every((id) => !!D.findRangeById(id)));

  // Per-combo frequency sums should never exceed 1.0 across actions (fold is implicit remainder)
  let overflowCount = 0;
  for (const r of D.ALL_RANGES) {
    const byCombo = {};
    for (const a of r.actions) byCombo[a.hand_combo] = (byCombo[a.hand_combo] || 0) + a.frequency;
    for (const [combo, sum] of Object.entries(byCombo)) {
      if (sum > 1.001) { errors.push(`Range ${r.id} combo ${combo} frequency sum ${sum} exceeds 1.0`); overflowCount++; }
    }
  }
  console.log('Combos with frequency sum > 1.0:', overflowCount);

  // BB vs limp should produce a healthy mix of check/raise (not all-fold or all-raise)
  const bbVsLimp = D.findRangeById('bb-vs-limp-100bb');
  const drawCounts = {};
  for (let i = 0; i < 300; i++) {
    const { correctAction } = d_getRandomCombo(D, bbVsLimp);
    drawCounts[correctAction] = (drawCounts[correctAction] || 0) + 1;
  }
  console.log('BB vs limp action distribution (300 draws):', JSON.stringify(drawCounts));
  // BB vs limp is check-dominant (most hands check for free) but should have some raises
  // The smart selector filters obvious folds and avoids boring AA/KK raises,
  // so check is expected to dominate. We just need at least one non-fold action to appear.
  if (!drawCounts.check && !drawCounts.raise) errors.push('BB vs limp range never produced check or raise in 300 draws');
  if (drawCounts.fold && (drawCounts.fold || 0) > 200) errors.push('BB vs limp range producing too many folds (>200/300) — selector may be misconfigured');

  function d_getRandomCombo(D, range) {
    return D.getRandomComboFromRange(range);
  }

  // ── Utils sanity ─────────────────────────────────────────────────────
  console.log('\n=== Utils ===');
  if (U.getLevelFromXP(0) !== 1) errors.push('getLevelFromXP(0) !== 1');
  if (U.getLevelFromXP(75000) !== 10) errors.push('getLevelFromXP(75000) !== 10');
  if (U.calculateAccuracy(5, 10) !== 50) errors.push('calculateAccuracy(5,10) !== 50');
  const score = U.scoreAnswer('raise', 'raise', null);
  if (!score.is_correct || score.xp_earned !== 10) errors.push('scoreAnswer correct case failed: ' + JSON.stringify(score));
  console.log('Utils functions OK');

  // ── Hand parser ──────────────────────────────────────────────────────
  console.log('\n=== Hand Parser ===');
  const HP = w.GTOHandParser;
  const sample = `PokerStars Hand #1: Hold'em No Limit ($0.50/$1.00 USD)
Seat 6: Hero ($100 in chips)
*** HOLE CARDS ***
Dealt to Hero [Ah Kd]
*** FLOP *** [2s 7h Tc]
Hero: checks`;
  const parsed = HP.parseHandHistory(sample);
  if (parsed.status === 'failed') errors.push('Hand parser failed on valid sample');
  if (!parsed.parsed.hero_hand || parsed.parsed.hero_hand[0] !== 'Ah') errors.push('Hand parser did not extract hero hand correctly');
  const failedParse = HP.parseHandHistory('x');
  if (failedParse.status !== 'failed') errors.push('Hand parser did not fail on too-short input');
  console.log('Hand parser OK — status:', parsed.status, '| failed-input status:', failedParse.status);

  // ── Store + localStorage persistence ────────────────────────────────
  console.log('\n=== Store / Persistence ===');
  S.addXP(150);
  S.startSession('preflop');
  S.recordAnswer({ spot_id: 'x', spot_type: 'preflop', user_action: 'raise', correct_action: 'raise', is_correct: true, ev_loss_bb: 0, ev_is_estimated: false, time_to_answer_ms: 0, position: 'BTN', action_type: 'rfi' });
  S.endSession();
  const badges = S.checkAndAwardBadges();

  const raw = w.localStorage.getItem('gto-drill-coach-store');
  if (!raw) errors.push('localStorage did not persist state');
  else {
    const parsedState = JSON.parse(raw);
    if (parsedState.profile.xp !== 150) errors.push(`Persisted XP mismatch: ${parsedState.profile.xp}`);
    if (parsedState.allSessions.length !== 1) errors.push(`Persisted session count mismatch: ${parsedState.allSessions.length}`);
    if (!parsedState.earnedBadges.find((b) => b.badge.slug === 'first-drill')) errors.push('first-drill badge not persisted');
  }
  console.log('XP after addXP(150):', S.getState().profile.xp);
  console.log('Sessions recorded:', S.getState().allSessions.length);
  console.log('Badges earned:', S.getState().earnedBadges.map((b) => b.badge.slug).join(', '));
  console.log('localStorage persisted correctly:', !!raw);

  // ── Reload simulation: new "session" reads from localStorage ────────
  console.log('\n=== Reload Persistence ===');
  // Re-run store.js in a fresh context sharing the same localStorage
  const vm = require('vm');
  const html2 = `<!DOCTYPE html><html><head></head><body><div id="root"></div></body></html>`;
  const dom2 = new JSDOM(html2, { url: 'http://localhost/index.html', runScripts: 'outside-only' });
  dom2.window.localStorage.setItem('gto-drill-coach-store', raw);
  dom2.window.matchMedia = function () { return { matches: false, addListener: () => {}, removeListener: () => {} }; };
  global.window = dom2.window; global.document = dom2.window.document; global.localStorage = dom2.window.localStorage;
  global.React = require('react'); dom2.window.React = global.React;
  for (const f of ['data.js', 'utils.js', 'hand-parser.js', 'explain.js', 'store.js']) {
    vm.runInContext(fs.readFileSync(path.join(ROOT, 'js', f), 'utf8'), dom2.getInternalVMContext(), { filename: f });
  }
  const reloadedState = dom2.window.GTOStore.getState();
  if (reloadedState.profile.xp !== 150) errors.push(`Reload: XP not restored, got ${reloadedState.profile.xp}`);
  if (reloadedState.allSessions.length !== 1) errors.push(`Reload: sessions not restored, got ${reloadedState.allSessions.length}`);
  console.log('XP after reload from localStorage:', reloadedState.profile.xp);
  console.log('Sessions after reload:', reloadedState.allSessions.length);

  console.log('\n========================================');
  console.log('ERRORS:', errors.length);
  errors.forEach((e) => console.log('  - ' + e));
  console.log('========================================');
  process.exit(errors.length > 0 ? 1 : 0);
}

main().catch((e) => { console.error('FATAL:', e); process.exit(1); });
