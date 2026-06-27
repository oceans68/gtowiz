/**
 * GTO Drill Coach (Static) — Full app smoke test harness
 * Loads index.html in jsdom, transforms each JSX file with Babel,
 * mounts the React app, and exercises every page via hash navigation.
 */
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');
const babel = require('@babel/core');

const ROOT = require('path').join(__dirname, '..');

function transform(file) {
  const code = fs.readFileSync(path.join(ROOT, 'js', file), 'utf8');
  const result = babel.transform(code, {
    presets: ['@babel/preset-react'],
    filename: file,
  });
  return result.code;
}

async function main() {
  const errors = [];

  const html = `<!DOCTYPE html><html><head></head><body>
    <div id="initial-loader"></div>
    <div id="root"></div>
  </body></html>`;

  const dom = new JSDOM(html, {
    url: 'http://localhost/index.html#/dashboard',
    runScripts: 'outside-only',
    pretendToBeVisual: true,
  });

  const { window } = dom;
  global.window = window;
  global.document = window.document;
  global.navigator = window.navigator;
  global.localStorage = window.localStorage;
  global.location = window.location;

  window.onerror = (msg) => errors.push('window.onerror: ' + msg);
  window.addEventListener('error', (e) => errors.push('window error event: ' + (e.error ? e.error.stack : e.message)));

  // matchMedia polyfill (some libs check this)
  window.matchMedia = window.matchMedia || function () {
    return { matches: false, addListener: () => {}, removeListener: () => {} };
  };

  // React / ReactDOM globals
  global.React = require('react');
  window.React = global.React;
  global.ReactDOM = require('react-dom/client');
  window.ReactDOM = global.ReactDOM;

  // Plain JS files — execute directly via vm in window context
  const vm = require('vm');
  function runInWindow(code, filename) {
    vm.runInContext(code, dom.getInternalVMContext(), { filename });
  }

  const plainFiles = ['data.js', 'utils.js', 'hand-parser.js', 'explain.js', 'store.js'];
  for (const f of plainFiles) {
    const code = fs.readFileSync(path.join(ROOT, 'js', f), 'utf8');
    runInWindow(code, f);
  }

  const jsxFiles = [
    'components.js',
    'page-dashboard.js',
    'page-preflop.js',
    'page-postflop.js',
    'page-plo.js',
    'page-missions.js',
    'page-progress.js',
    'page-review.js',
    'page-library.js',
    'page-settings-fairplay.js',
    'app.js',
  ];

  for (const f of jsxFiles) {
    const code = transform(f);
    try {
      runInWindow(code, f);
    } catch (e) {
      errors.push(`Error executing ${f}: ${e.stack}`);
    }
  }

  // Wait a tick for initial render
  await new Promise((r) => setTimeout(r, 300));

  function bodyText() {
    return window.document.body.textContent;
  }

  function reportRoute(name, expectedTexts) {
    const text = bodyText();
    for (const exp of expectedTexts) {
      if (!text.includes(exp)) {
        errors.push(`[${name}] Expected text not found: "${exp}"`);
      }
    }
  }

  console.log('=== Initial render (dashboard) ===');
  reportRoute('dashboard', ['Welcome back', 'Quick Start', "Today's Mission", 'Preflop Trainer', 'Postflop Quiz', 'Hand Review', 'My Leaks']);
  console.log('body length:', bodyText().length);

  // Navigate to each route via hash change
  const routes = [
    { hash: '#/preflop', name: 'preflop', expect: ['Preflop Trainer', 'Select Spots', 'Cash 100bb', 'MTT Push/Fold'] },
    { hash: '#/plo', name: 'plo', expect: ['PLO Trainer', 'Pot-Limit Omaha', 'Cash 100bb', 'MTT Push/Fold'] },
    { hash: '#/postflop', name: 'postflop', expect: ['Postflop Quiz', 'Difficulty', 'Spots per Session'] },
    { hash: '#/missions', name: 'missions', expect: ['Daily Missions', "Today's Mission", 'Achievements', 'Current Streak'] },
    { hash: '#/progress', name: 'progress', expect: ['Progress & Leaks'] },
    { hash: '#/review', name: 'review', expect: ['Hand Review', 'Off-Table Study Only', 'Paste Hand History'] },
    { hash: '#/library', name: 'library', expect: ['Study Library', 'Postflop', 'Preflop', 'Data Accuracy Policy'] },
    { hash: '#/settings', name: 'settings', expect: ['Settings', 'Display Name', 'Game Preferences', 'Danger Zone'] },
    { hash: '#/fair-play', name: 'fair-play', expect: ['Fair Play Policy', 'Off-Table Study Only', 'Real-Time Assistance', 'Responsible Gaming'] },
    { hash: '#/dashboard', name: 'dashboard-return', expect: ['Welcome back', 'Quick Start'] },
  ];

  for (const r of routes) {
    window.location.hash = r.hash;
    window.dispatchEvent(new window.Event('hashchange'));
    await new Promise((res) => setTimeout(res, 150));
    console.log(`=== Route: ${r.name} (${r.hash}) ===`);
    reportRoute(r.name, r.expect);
    console.log('body length:', bodyText().length);
  }

  console.log('\n=== ERRORS ===');
  if (errors.length === 0) {
    console.log('NONE — all routes rendered expected content with no runtime errors.');
  } else {
    errors.forEach((e) => console.log('- ' + e));
  }

  process.exit(errors.length > 0 ? 1 : 0);
}

main().catch((e) => {
  console.error('FATAL:', e);
  process.exit(1);
});
