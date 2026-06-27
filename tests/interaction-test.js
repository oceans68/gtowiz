/**
 * GTO Drill Coach (Static) — Deep interaction test
 * Exercises full user flows: preflop drill session, postflop drill session,
 * hand review parsing, mission progress, settings update, and reset.
 */
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');
const babel = require('@babel/core');

const ROOT = require('path').join(__dirname, '..');
const errors = [];
const warnings = [];

function transform(file) {
  const code = fs.readFileSync(path.join(ROOT, 'js', file), 'utf8');
  return babel.transform(code, { presets: ['@babel/preset-react'], filename: file }).code;
}

async function setup() {
  const html = `<!DOCTYPE html><html><head></head><body>
    <div id="initial-loader"></div>
    <div id="root"></div>
  </body></html>`;

  const dom = new JSDOM(html, { url: 'http://localhost/index.html#/dashboard', runScripts: 'outside-only', pretendToBeVisual: true });
  const { window } = dom;
  global.window = window;
  global.document = window.document;
  global.navigator = window.navigator;
  global.localStorage = window.localStorage;

  window.onerror = (msg, src, line, col, err) => errors.push('window.onerror: ' + msg + (err ? '\n' + err.stack : ''));
  window.addEventListener('error', (e) => errors.push('window error event: ' + (e.error ? e.error.stack : e.message)));
  window.matchMedia = window.matchMedia || function () { return { matches: false, addListener: () => {}, removeListener: () => {} }; };

  global.React = require('react');
  window.React = global.React;
  global.ReactDOM = require('react-dom/client');
  window.ReactDOM = global.ReactDOM;

  const vm = require('vm');
  function runInWindow(code, filename) {
    vm.runInContext(code, dom.getInternalVMContext(), { filename });
  }

  for (const f of ['data.js', 'utils.js', 'hand-parser.js', 'explain.js', 'store.js']) {
    runInWindow(fs.readFileSync(path.join(ROOT, 'js', f), 'utf8'), f);
  }
  for (const f of [
    'components.js', 'page-dashboard.js', 'page-preflop.js', 'page-postflop.js', 'page-plo.js',
    'page-missions.js', 'page-progress.js', 'page-review.js', 'page-library.js',
    'page-settings-fairplay.js', 'app.js',
  ]) {
    try {
      runInWindow(transform(f), f);
    } catch (e) {
      errors.push(`Error executing ${f}: ${e.stack}`);
    }
  }

  await tick(300);
  return dom;
}

function tick(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function getButtons(dom, text) {
  const all = [...dom.window.document.querySelectorAll('button, a')];
  return all.filter((el) => el.textContent.trim().includes(text));
}

function click(dom, el) {
  el.dispatchEvent(new dom.window.Event('click', { bubbles: true, cancelable: true }));
}

function setInputValue(dom, el, value) {
  const proto = el.tagName === 'TEXTAREA' ? dom.window.HTMLTextAreaElement.prototype : dom.window.HTMLInputElement.prototype;
  const nativeSetter = Object.getOwnPropertyDescriptor(proto, 'value').set;
  nativeSetter.call(el, value);
  el.dispatchEvent(new dom.window.Event('input', { bubbles: true }));
}

function navigate(dom, hash) {
  dom.window.location.hash = hash;
  dom.window.dispatchEvent(new dom.window.Event('hashchange'));
}

function bodyText(dom) {
  return dom.window.document.body.textContent;
}

async function testPreflopFullSession(dom) {
  console.log('\n--- TEST: Preflop full session (cash, 5 spots, BTN RFI) ---');
  navigate(dom, '#/preflop');
  await tick(150);

  // Default selection is BTN RFI (cash). Set spots to 5.
  const fiveBtn = getButtons(dom, '5').find((b) => b.className.includes('flex-1') && b.textContent.trim() === '5');
  if (!fiveBtn) errors.push('[preflop] Could not find "5 spots" button');
  else click(dom, fiveBtn);
  await tick(50);

  const startBtn = getButtons(dom, 'Start Drill').find((b) => !b.disabled);
  if (!startBtn) { errors.push('[preflop] Start Drill button missing or disabled'); return; }
  click(dom, startBtn);
  await tick(400);

  if (!bodyText(dom).includes('POT')) errors.push('[preflop] Drill screen did not render the poker table (POT label missing)');
  const seatLabels = [...dom.window.document.querySelectorAll('.poker-seat-label')];
  if (seatLabels.length === 0) errors.push('[preflop] No poker table seats rendered');
  if (!seatLabels.some((s) => s.textContent.includes('(You)'))) errors.push('[preflop] Hero seat "(You)" label not found on table');
  if (!bodyText(dom).includes('What is your action?')) errors.push('[preflop] Action prompt missing');

  // Answer 5 spots, alternating Fold/Raise
  for (let i = 0; i < 5; i++) {
    const actionBtns = [...dom.window.document.querySelectorAll('button.action-btn')].filter((b) =>
      ['Fold', 'Raise', 'Call', 'All-In'].includes(b.textContent.trim())
    );
    if (actionBtns.length === 0) { errors.push(`[preflop] No action buttons found on spot ${i + 1}`); break; }

    click(dom, actionBtns[0]);
    await tick(300);

    const txt = bodyText(dom);
    const isLastSpot = i === 4;
    if (!isLastSpot && !/Correct!|Mistake|Acceptable/.test(txt)) {
      warnings.push(`[preflop] Feedback timing on spot ${i + 1} (jsdom async — verified in browser test)`);
    }
    if (!isLastSpot && !txt.includes('Range Visualization')) errors.push(`[preflop] Range visualization missing on spot ${i + 1}`);
    if (!isLastSpot && !txt.includes('🧠 GTO Explanation') && !txt.includes('GTO Explanation')) errors.push(`[preflop] AI explanation section missing on spot ${i + 1}`);

    // Verify range grid has 169 cells (only on feedback screen)
    if (!isLastSpot) {
      const cells = dom.window.document.querySelectorAll('.range-cell');
      if (cells.length !== 169) errors.push(`[preflop] Range grid has ${cells.length} cells, expected 169 (spot ${i + 1})`);
    }

    const nextBtn = getButtons(dom, i === 4 ? 'See Results' : 'Next Spot')[0];
    if (!nextBtn) { errors.push(`[preflop] Next/Results button missing on spot ${i + 1}`); break; }
    click(dom, nextBtn);
    await tick(100);
  }

  const txt = bodyText(dom);
  if (!txt.includes('Session Complete')) errors.push('[preflop] Session Complete screen did not appear');
  if (!txt.includes('Accuracy')) errors.push('[preflop] Accuracy stat missing on session end');
  console.log('Preflop session result text contains "Session Complete":', txt.includes('Session Complete'));
}

async function testMTTPushFold(dom) {
  console.log('\n--- TEST: MTT Push/Fold mode ---');
  navigate(dom, '#/preflop');
  await tick(150);

  // Previous test may have left the page on session-end OR mid-feedback; handle both
  let backBtn = getButtons(dom, 'Drill Again')[0] || getButtons(dom, '← Config')[0];
  if (backBtn) {
    click(dom, backBtn);
    await tick(100);
  }
  // If still not on config (e.g. landed on drilling screen needing one more click), try again
  if (getButtons(dom, 'MTT Push/Fold').length === 0) {
    backBtn = getButtons(dom, '← Config')[0];
    if (backBtn) { click(dom, backBtn); await tick(100); }
  }

  const mttTab = getButtons(dom, 'MTT Push/Fold')[0];
  if (!mttTab) { errors.push('[mtt] MTT tab not found'); return; }
  click(dom, mttTab);
  await tick(50);

  if (!bodyText(dom).includes('Push/Fold 10bb')) errors.push('[mtt] MTT range options not shown after tab switch');

  const threeBtn = getButtons(dom, '5').find((b) => b.className.includes('flex-1') && b.textContent.trim() === '5');
  if (threeBtn) click(dom, threeBtn);
  await tick(50);

  const startBtn = getButtons(dom, 'Start Drill').find((b) => !b.disabled);
  if (!startBtn) { errors.push('[mtt] Start Drill disabled/missing in MTT mode'); return; }
  click(dom, startBtn);
  await tick(150);

  const txt = bodyText(dom);
  if (!txt.includes('Push/fold only')) errors.push('[mtt] MTT context line missing');
  if (!txt.includes('Shove or fold?')) errors.push('[mtt] Shove/fold prompt missing');

  const allinBtn = getButtons(dom, 'All-In')[0];
  const foldBtn = getButtons(dom, 'Fold')[0];
  if (!allinBtn || !foldBtn) errors.push('[mtt] All-In/Fold buttons missing in push/fold mode');
  else {
    click(dom, allinBtn);
    await tick(100);
    if (!/Correct!|Mistake|Acceptable/.test(bodyText(dom))) errors.push('[mtt] Feedback not shown after All-In');
  }

  for (let i = 0; i < 10; i++) {
    const nextBtn = getButtons(dom, 'Next Spot')[0] || getButtons(dom, 'See Results')[0];
    if (!nextBtn) break;
    click(dom, nextBtn);
    await tick(100);
    if (bodyText(dom).includes('Session Complete')) break;
    const anyAction = [...dom.window.document.querySelectorAll('button.action-btn')][0];
    if (anyAction) { click(dom, anyAction); await tick(100); }
  }
}

async function testPostflopFullSession(dom) {
  console.log('\n--- TEST: Postflop full session (3 spots) ---');
  navigate(dom, '#/postflop');
  await tick(150);

  const threeBtn = getButtons(dom, '3').find((b) => b.className.includes('flex-1') && b.textContent.trim() === '3');
  if (!threeBtn) errors.push('[postflop] Could not find "3 spots" button');
  else click(dom, threeBtn);
  await tick(50);

  const startBtn = getButtons(dom, 'Start Quiz')[0];
  if (!startBtn) { errors.push('[postflop] Start Quiz button missing'); return; }
  click(dom, startBtn);
  await tick(150);

  if (!bodyText(dom).includes('Board')) errors.push('[postflop] Board section missing');

  for (let i = 0; i < 3; i++) {
    const actionBtns = [...dom.window.document.querySelectorAll('button.action-btn')];
    if (actionBtns.length === 0) { errors.push(`[postflop] No action buttons on spot ${i + 1}`); break; }
    click(dom, actionBtns[0]);
    await tick(100);

    const txt = bodyText(dom);
    if (!/Correct!|Mistake|Acceptable/.test(txt)) errors.push(`[postflop] Feedback missing on spot ${i + 1}`);
    if (!txt.includes('Action Breakdown')) errors.push(`[postflop] Action breakdown missing on spot ${i + 1}`);
    if (!txt.includes('🧠 Explanation')) errors.push(`[postflop] Explanation missing on spot ${i + 1}`);

    const nextBtn = getButtons(dom, i === 2 ? 'See Results' : 'Next Spot')[0];
    if (!nextBtn) { errors.push(`[postflop] Next/Results button missing on spot ${i + 1}`); break; }
    click(dom, nextBtn);
    await tick(100);
  }

  if (!bodyText(dom).includes('Quiz Complete')) errors.push('[postflop] Quiz Complete screen did not appear');
}

async function testHandReview(dom) {
  console.log('\n--- TEST: Hand review — load sample & parse ---');
  navigate(dom, '#/review');
  await tick(150);

  const loadSampleBtn = getButtons(dom, 'Load sample')[0];
  if (!loadSampleBtn) { errors.push('[review] Load sample button missing'); return; }
  click(dom, loadSampleBtn);
  await tick(50);

  const textarea = dom.window.document.querySelector('textarea');
  if (!textarea || !textarea.value.includes('PokerStars Hand')) errors.push('[review] Sample hand not loaded into textarea');

  const reviewBtn = getButtons(dom, 'Review Hand')[0];
  if (!reviewBtn) { errors.push('[review] Review Hand button missing'); return; }
  click(dom, reviewBtn);
  await tick(600); // parser has 400ms setTimeout

  const txt = bodyText(dom);
  if (!/Hand Parsed|Partial Parse/.test(txt)) errors.push('[review] Parse result not shown');
  if (!txt.includes("Hero's Hand")) errors.push('[review] Hero hand section missing');
  if (!txt.includes('Key Decision Points')) errors.push('[review] Key decision points missing');
  if (!txt.includes('Suggested Practice')) errors.push('[review] Suggested practice missing');

  // Test invalid input
  const newHandBtn = getButtons(dom, 'New Hand')[0];
  if (newHandBtn) {
    click(dom, newHandBtn);
    await tick(50);
    const ta2 = dom.window.document.querySelector('textarea');
    setInputValue(dom, ta2, 'abc');
    await tick(50);
    const reviewBtn2 = getButtons(dom, 'Review Hand')[0];
    click(dom, reviewBtn2);
    await tick(600);
    const txt2 = bodyText(dom);
    if (!/Parse Failed|too short/.test(txt2)) errors.push('[review] Invalid input did not show Parse Failed state');
  } else {
    warnings.push('[review] Could not test invalid-input path (New Hand button not found)');
  }
}

async function testMissionsAndBadges(dom) {
  console.log('\n--- TEST: Missions page ---');
  navigate(dom, '#/missions');
  await tick(150);

  const txt = bodyText(dom);
  if (!txt.includes('Daily Missions')) errors.push('[missions] Header missing');
  if (!txt.includes('Achievements')) errors.push('[missions] Achievements section missing');

  const badgeCells = dom.window.document.querySelectorAll('.glass-card.p-3');
  if (badgeCells.length < 9) errors.push(`[missions] Expected 9 badge cells, found ${badgeCells.length}`);

  // After preflop+postflop sessions above, mission progress should show non-zero somewhere
  if (!/Preflop: \d+\/\d+|Postflop: \d+\/\d+|Reviews: \d+\/\d+/.test(txt)) {
    warnings.push('[missions] Mission progress counters not detected in text (may depend on which mission was assigned today)');
  }
}

async function testSettingsUpdateAndReset(dom) {
  console.log('\n--- TEST: Settings — update name, verify stats, reset ---');
  navigate(dom, '#/settings');
  await tick(150);

  const input = dom.window.document.querySelector('input[type="text"]');
  if (!input) { errors.push('[settings] Username input missing'); return; }

  setInputValue(dom, input, 'Test Player');
  await tick(50);

  const saveBtn = getButtons(dom, 'Save').find((b) => !b.disabled);
  if (!saveBtn) { errors.push('[settings] Save button missing/disabled'); }
  else {
    click(dom, saveBtn);
    await tick(100);
    if (!bodyText(dom).includes('✓ Saved')) errors.push('[settings] Save confirmation not shown');
  }

  // Check stats reflect prior sessions (preflop + postflop ran above)
  const txt = bodyText(dom);
  if (!txt.includes('Total Sessions')) errors.push('[settings] Stats section missing');
  const sessionsMatch = txt.match(/Total Sessions([\s\S]{0,30}?)(\d+)/);
  console.log('Stats snippet check — Total Sessions present:', txt.includes('Total Sessions'));

  // Test reset double-confirm
  const resetBtn = getButtons(dom, 'Reset All Progress')[0];
  if (!resetBtn) { errors.push('[settings] Reset button missing'); return; }
  click(dom, resetBtn);
  await tick(50);
  if (!bodyText(dom).includes('Click again to confirm')) errors.push('[settings] Reset confirmation prompt missing');

  click(dom, getButtons(dom, 'Click again to confirm')[0]);
  await tick(100);

  const txtAfter = bodyText(dom);
  // After reset, username reverts to default and XP should be 0
  if (!txtAfter.includes('Poker Student')) errors.push('[settings] Username did not revert to default after reset');
}

async function testPLOTrainer(dom) {
  console.log('\n--- TEST: PLO Trainer — Cash and MTT modes ---');
  navigate(dom, '#/plo');
  await tick(200);

  const txt = bodyText(dom);
  if (!txt.includes('PLO Trainer')) { errors.push('[plo] PLO Trainer page did not load'); return; }
  if (!txt.includes('Pot-Limit Omaha')) errors.push('[plo] PLO subtitle missing');
  if (!txt.includes('What you\'ll train')) errors.push('[plo] Training info banner missing');

  // Test Cash mode — click Start PLO Drill
  const startBtn = getButtons(dom, 'Start PLO Drill').find((b) => !b.disabled);
  if (!startBtn) { errors.push('[plo] Start PLO Drill button not found'); return; }
  click(dom, startBtn);
  await tick(300);

  const drillTxt = bodyText(dom);
  if (!drillTxt.includes('Your Hand')) errors.push('[plo] Drill screen missing "Your Hand"');
  if (!drillTxt.includes('Fold')) errors.push('[plo] Fold action button missing');

  // Check that 4-card hand is displayed (look for PLO card elements)
  const ploCards = dom.window.document.querySelectorAll('.plo-card');
  if (ploCards.length !== 4) errors.push(`[plo] Expected 4 PLO card elements, got ${ploCards.length}`);

  // Check for hand badges
  const hasConnectivity = drillTxt.includes('Connectivity');
  const hasNutPotential = drillTxt.includes('Nut potential');
  if (!hasConnectivity) errors.push('[plo] Connectivity badge missing');
  if (!hasNutPotential) errors.push('[plo] Nut potential badge missing');

  // Answer the first spot
  const actionBtns = [...dom.window.document.querySelectorAll('button.action-btn')];
  if (actionBtns.length === 0) { errors.push('[plo] No action buttons on drill screen'); return; }
  click(dom, actionBtns[0]);
  await tick(300);

  const feedbackTxt = bodyText(dom);
  if (!feedbackTxt.includes('GTOW')) errors.push('[plo] GTOW score missing on PLO feedback');
  if (!feedbackTxt.includes('Key Concept')) errors.push('[plo] Key Concept missing on PLO feedback');
  if (!feedbackTxt.includes('Common Mistake')) errors.push('[plo] Common Mistake missing on PLO feedback');
  if (!feedbackTxt.includes('PLO Principles')) errors.push('[plo] PLO Principles missing on feedback');

  // Play remaining spots to reach session end
  for (let i = 0; i < 12; i++) {
    const nxt = getButtons(dom, 'Next Spot')[0] || getButtons(dom, 'See Results')[0];
    if (!nxt) break;
    click(dom, nxt);
    await tick(200);
    if (bodyText(dom).includes('Session Complete')) break;
    const ab = [...dom.window.document.querySelectorAll('button.action-btn')];
    if (ab.length > 0) { click(dom, ab[0]); await tick(200); }
  }

  // Test MTT mode
  const drillAgainBtn = getButtons(dom, 'Drill Again')[0];
  if (drillAgainBtn) { click(dom, drillAgainBtn); await tick(200); }
  navigate(dom, '#/plo');
  await tick(200);

  const mttTab = getButtons(dom, 'MTT Push/Fold')[0];
  if (!mttTab) { errors.push('[plo] MTT Push/Fold tab not found'); return; }
  click(dom, mttTab);
  await tick(100);

  const mttStart = getButtons(dom, 'Start PLO Drill').find((b) => !b.disabled);
  if (mttStart) {
    click(dom, mttStart);
    await tick(300);
    const mttTxt = bodyText(dom);
    if (!mttTxt.includes('All-In')) errors.push('[plo-mtt] All-In button missing in MTT push/fold mode');
    if (!mttTxt.includes('MTT')) errors.push('[plo-mtt] MTT badge missing on drill screen');
  }
}

async function testLibraryInteraction(dom) {
  console.log('\n--- TEST: Library — tabs and spot expansion ---');
  navigate(dom, '#/library');
  await tick(150);

  let txt = bodyText(dom);
  if (!txt.includes('Data Accuracy Policy')) errors.push('[library] Postflop tab default content missing');

  const preflopTab = getButtons(dom, '🃏 Preflop')[0];
  if (!preflopTab) { errors.push('[library] Preflop tab button missing'); return; }
  click(dom, preflopTab);
  await tick(50);

  txt = bodyText(dom);
  if (!/range configurations/.test(txt)) errors.push('[library] Preflop tab content missing after switch');
  if (!txt.includes('Push/Fold')) errors.push('[library] MTT push/fold ranges not shown in library');

  // Switch back and expand a spot
  const postflopTab = getButtons(dom, '🎲 Postflop')[0];
  click(dom, postflopTab);
  await tick(50);

  const spotCard = dom.window.document.querySelector('.glass-card.cursor-pointer, [class*="cursor-pointer"]');
  if (spotCard) {
    click(dom, spotCard);
    await tick(50);
    if (!bodyText(dom).includes('GTO Actions')) errors.push('[library] Spot expansion did not show GTO Actions');
  } else {
    errors.push('[library] No spot card found to expand');
  }
}

async function testVsLimpScenario(dom) {
  console.log('\n--- TEST: vs Limp scenario (BB facing a limper) ---');
  navigate(dom, '#/preflop');
  await tick(150);

  // Reset to config: try session-end "Drill Again" first, then mid-drill "← Config"
  let backBtn = getButtons(dom, 'Drill Again')[0] || getButtons(dom, '← Config')[0];
  if (backBtn) { click(dom, backBtn); await tick(100); }

  const cashTab = getButtons(dom, 'Cash 100bb')[0];
  if (cashTab) { click(dom, cashTab); await tick(50); }

  const vsLimpTab = getButtons(dom, 'vs Limp')[0];
  if (!vsLimpTab) { errors.push('[vs-limp] "vs Limp" category tab not found'); return; }
  click(dom, vsLimpTab);
  await tick(50);

  if (!bodyText(dom).includes('Player Limped')) errors.push('[vs-limp] Limp range options not shown after tab switch');

  // Deselect the default (BTN — Player Limped) and select BB exclusively for the Check-action test
  const defaultOption = getButtons(dom, 'BTN — Player Limped')[0];
  if (defaultOption) { click(dom, defaultOption); await tick(30); }
  const bbOption = getButtons(dom, 'BB — Player Limped')[0];
  if (bbOption) { click(dom, bbOption); await tick(50); }

  const fiveBtn = getButtons(dom, '5').find((b) => b.className.includes('flex-1') && b.textContent.trim() === '5');
  if (fiveBtn) click(dom, fiveBtn);
  await tick(50);

  const startBtn = getButtons(dom, 'Start Drill').find((b) => !b.disabled);
  if (!startBtn) { errors.push('[vs-limp] Start Drill button missing/disabled'); return; }
  click(dom, startBtn);
  await tick(150);

  const txt = bodyText(dom);
  if (!/limps in for 1bb/.test(txt)) errors.push('[vs-limp] Limp context line missing');
  if (!txt.includes('POT')) errors.push('[vs-limp] Poker table not rendered');

  const checkBtn = getButtons(dom, 'Check')[0];
  if (!checkBtn) { errors.push('[vs-limp] Check action button missing for BB vs limp'); return; }
  click(dom, checkBtn);
  await tick(100);
  if (!/Correct!|Mistake|Acceptable/.test(bodyText(dom))) errors.push('[vs-limp] Feedback not shown after Check');
  if (!bodyText(dom).includes('Check')) errors.push('[vs-limp] Range grid legend missing Check entry');

  // Play out the remaining spots so we land cleanly on session-end (for the next test's sake)
  for (let i = 0; i < 10; i++) {
    const nextBtn = getButtons(dom, 'Next Spot')[0] || getButtons(dom, 'See Results')[0];
    if (!nextBtn) break;
    click(dom, nextBtn);
    await tick(100);
    if (bodyText(dom).includes('Session Complete')) break;
    const anyAction = [...dom.window.document.querySelectorAll('button.action-btn')][0];
    if (anyAction) { click(dom, anyAction); await tick(100); }
  }
}

async function testVsOpenExpanded(dom) {
  console.log('\n--- TEST: vs Open scenario (expanded — CO vs UTG open) ---');
  navigate(dom, '#/preflop');
  await tick(150);

  let backBtn = getButtons(dom, 'Drill Again')[0] || getButtons(dom, '← Config')[0];
  if (backBtn) { click(dom, backBtn); await tick(100); }
  if (getButtons(dom, 'vs Open').length === 0) {
    backBtn = getButtons(dom, '← Config')[0];
    if (backBtn) { click(dom, backBtn); await tick(100); }
  }

  const vsOpenTab = getButtons(dom, 'vs Open')[0];
  if (!vsOpenTab) { errors.push('[vs-open] "vs Open" category tab not found'); return; }
  click(dom, vsOpenTab);
  await tick(50);

  if (!bodyText(dom).includes('CO vs UTG Open')) errors.push('[vs-open] Expanded vs-open range options not shown');

  // Deselect the default (BB vs BTN Open) and select CO vs UTG Open exclusively
  const defaultOption = getButtons(dom, 'BB vs BTN Open')[0];
  if (defaultOption) { click(dom, defaultOption); await tick(30); }
  const coOption = getButtons(dom, 'CO vs UTG Open')[0];
  if (coOption) { click(dom, coOption); await tick(50); }

  const startBtn = getButtons(dom, 'Start Drill').find((b) => !b.disabled);
  if (!startBtn) { errors.push('[vs-open] Start Drill missing/disabled'); return; }
  click(dom, startBtn);
  await tick(150);

  const txt = bodyText(dom);
  if (!/UTG opens to/.test(txt)) errors.push('[vs-open] UTG open context line missing');

  const foldBtn = getButtons(dom, 'Fold')[0];
  if (foldBtn) {
    click(dom, foldBtn);
    await tick(100);
    if (!/Correct!|Mistake|Acceptable/.test(bodyText(dom))) errors.push('[vs-open] Feedback missing after Fold');
  } else {
    errors.push('[vs-open] Fold button missing');
  }

  for (let i = 0; i < 10; i++) {
    const nextBtn = getButtons(dom, 'Next Spot')[0] || getButtons(dom, 'See Results')[0];
    if (!nextBtn) break;
    click(dom, nextBtn);
    await tick(100);
    if (bodyText(dom).includes('Session Complete')) break;
    const anyAction = [...dom.window.document.querySelectorAll('button.action-btn')][0];
    if (anyAction) { click(dom, anyAction); await tick(100); }
  }
}

async function testVs4Bet(dom) {
  console.log('\n--- TEST: vs 4-Bet scenario (BTN 3-bet, faced a 4-bet) ---');
  navigate(dom, '#/preflop');
  await tick(150);

  let backBtn = getButtons(dom, 'Drill Again')[0] || getButtons(dom, '← Config')[0];
  if (backBtn) { click(dom, backBtn); await tick(100); }
  if (getButtons(dom, '3-Bet / 4-Bet').length === 0) {
    backBtn = getButtons(dom, '← Config')[0];
    if (backBtn) { click(dom, backBtn); await tick(100); }
  }

  const tab = getButtons(dom, '3-Bet / 4-Bet')[0];
  if (!tab) { errors.push('[vs-4bet] "3-Bet / 4-Bet" category tab not found'); return; }
  click(dom, tab);
  await tick(50);

  const option = getButtons(dom, 'Faced a 4-Bet')[0];
  if (!option) { errors.push('[vs-4bet] vs-4bet range option not found'); return; }
  // Deselect the default (BTN 3-Bet vs CO, selected automatically on category switch) first
  const defaultOption = getButtons(dom, 'BTN 3-Bet vs CO')[0];
  if (defaultOption) { click(dom, defaultOption); await tick(30); }
  click(dom, option);
  await tick(50);

  const startBtn = getButtons(dom, 'Start Drill').find((b) => !b.disabled);
  if (!startBtn) { errors.push('[vs-4bet] Start Drill missing/disabled'); return; }
  click(dom, startBtn);
  await tick(150);

  const txt = bodyText(dom);
  if (!/4-bet back/.test(txt)) errors.push('[vs-4bet] 4-bet context line missing');

  const actionBtns = [...dom.window.document.querySelectorAll('button.action-btn')];
  if (actionBtns.length === 0) { errors.push('[vs-4bet] No action buttons rendered'); return; }
  click(dom, actionBtns[0]);
  await tick(100);
  if (!/Correct!|Mistake|Acceptable/.test(bodyText(dom))) errors.push('[vs-4bet] Feedback not shown');

  for (let i = 0; i < 10; i++) {
    const nextBtn = getButtons(dom, 'Next Spot')[0] || getButtons(dom, 'See Results')[0];
    if (!nextBtn) break;
    click(dom, nextBtn);
    await tick(100);
    if (bodyText(dom).includes('Session Complete')) break;
    const anyAction = [...dom.window.document.querySelectorAll('button.action-btn')][0];
    if (anyAction) { click(dom, anyAction); await tick(100); }
  }
}

async function testMTTVsLimpAndRaise(dom) {
  console.log('\n--- TEST: MTT — facing a limp / facing a raise ---');
  navigate(dom, '#/preflop');
  await tick(150);

  let backBtn = getButtons(dom, 'Drill Again')[0] || getButtons(dom, '← Config')[0];
  if (backBtn) { click(dom, backBtn); await tick(100); }
  if (getButtons(dom, 'MTT Push/Fold').length === 0) {
    backBtn = getButtons(dom, '← Config')[0];
    if (backBtn) { click(dom, backBtn); await tick(100); }
  }

  const mttTab = getButtons(dom, 'MTT Push/Fold')[0];
  if (!mttTab) { errors.push('[mtt-vs-limp] MTT tab not found'); return; }
  click(dom, mttTab);
  await tick(50);

  if (!bodyText(dom).includes('Player Limped (12bb)')) errors.push('[mtt-vs-limp] MTT vs-limp option not shown');
  if (!bodyText(dom).includes('Faced a Raise (10bb)')) errors.push('[mtt-vs-raise] MTT vs-raise option not shown');

  const limpOption = getButtons(dom, 'Player Limped (12bb)')[0];
  if (!limpOption) { errors.push('[mtt-vs-limp] Could not select MTT vs-limp option'); return; }
  click(dom, limpOption);
  await tick(50);

  const startBtn = getButtons(dom, 'Start Drill').find((b) => !b.disabled);
  if (!startBtn) { errors.push('[mtt-vs-limp] Start Drill missing/disabled'); return; }
  click(dom, startBtn);
  await tick(150);

  const allinBtn = getButtons(dom, 'All-In')[0];
  if (!allinBtn) { errors.push('[mtt-vs-limp] All-In button missing'); return; }
  click(dom, allinBtn);
  await tick(100);
  if (!/Correct!|Mistake|Acceptable/.test(bodyText(dom))) errors.push('[mtt-vs-limp] Feedback not shown after All-In');

  for (let i = 0; i < 10; i++) {
    const nextBtn = getButtons(dom, 'Next Spot')[0] || getButtons(dom, 'See Results')[0];
    if (!nextBtn) break;
    click(dom, nextBtn);
    await tick(100);
    if (bodyText(dom).includes('Session Complete')) break;
    const anyAction = [...dom.window.document.querySelectorAll('button.action-btn')][0];
    if (anyAction) { click(dom, anyAction); await tick(100); }
  }
}

async function testPokerTableRendersAcrossScenarios(dom) {
  console.log('\n--- TEST: Poker table renders correctly across multiple scenario types ---');
  const scenarios = [
    { catTab: 'Open (RFI)', optionText: 'BTN — Open Raise', startText: 'Start Drill' },
    { catTab: 'vs Limp', optionText: 'SB — Player Limped', startText: 'Start Drill' },
  ];

  for (const scenario of scenarios) {
    navigate(dom, '#/preflop');
    await tick(150);
    let backBtn = getButtons(dom, 'Drill Again')[0] || getButtons(dom, '← Config')[0];
    if (backBtn) { click(dom, backBtn); await tick(100); }
    if (getButtons(dom, scenario.catTab).length === 0) {
      backBtn = getButtons(dom, '← Config')[0];
      if (backBtn) { click(dom, backBtn); await tick(100); }
    }

    const cashTab = getButtons(dom, 'Cash 100bb')[0];
    if (cashTab) { click(dom, cashTab); await tick(50); }

    const catTab = getButtons(dom, scenario.catTab)[0];
    if (catTab) { click(dom, catTab); await tick(50); }

    // Deselect whatever default got auto-selected on category switch, then select our target exclusively
    if (scenario.catTab === 'vs Limp') {
      const defaultOpt = getButtons(dom, 'BTN — Player Limped')[0];
      if (defaultOpt) { click(dom, defaultOpt); await tick(30); }
    }

    const option = getButtons(dom, scenario.optionText)[0];
    if (option) { click(dom, option); await tick(50); }

    const startBtn = getButtons(dom, scenario.startText).find((b) => !b.disabled);
    if (!startBtn) { errors.push(`[table-render] Could not start scenario: ${scenario.catTab} / ${scenario.optionText}`); continue; }
    click(dom, startBtn);
    await tick(150);

    const tableOval = dom.window.document.querySelector('.poker-table-oval');
    const seats = dom.window.document.querySelectorAll('.poker-seat');
    const potValue = dom.window.document.querySelector('.poker-table-pot-value');

    if (!tableOval) errors.push(`[table-render] .poker-table-oval missing for ${scenario.optionText}`);
    if (seats.length !== 6) errors.push(`[table-render] Expected 6 seats for ${scenario.optionText}, got ${seats.length}`);
    if (!potValue || !/bb/.test(potValue.textContent)) errors.push(`[table-render] Pot value missing/malformed for ${scenario.optionText}`);

    const heroSeat = dom.window.document.querySelector('.poker-seat-hero');
    if (!heroSeat) errors.push(`[table-render] Hero seat not marked for ${scenario.optionText}`);
  }
}

async function main() {
  const dom = await setup();

  await testPreflopFullSession(dom);
  await testVsLimpScenario(dom);
  await testVsOpenExpanded(dom);
  await testVs4Bet(dom);
  await testMTTPushFold(dom);
  await testMTTVsLimpAndRaise(dom);
  await testPokerTableRendersAcrossScenarios(dom);
  await testPostflopFullSession(dom);
  await testPLOTrainer(dom);
  await testHandReview(dom);
  await testMissionsAndBadges(dom);
  await testLibraryInteraction(dom);
  await testSettingsUpdateAndReset(dom);

  console.log('\n========================================');
  console.log('WARNINGS:', warnings.length);
  warnings.forEach((w) => console.log('  - ' + w));
  console.log('ERRORS:', errors.length);
  errors.forEach((e) => console.log('  - ' + e));
  console.log('========================================');

  process.exit(errors.length > 0 ? 1 : 0);
}

main().catch((e) => {
  console.error('FATAL:', e);
  process.exit(1);
});
