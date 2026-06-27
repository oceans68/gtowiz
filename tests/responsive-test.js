/**
 * GTO Drill Coach (Static) — Responsive layout / CSS validation test
 *
 * NOTE: jsdom does not implement `window.matchMedia` or `resizeTo`, and its
 * getComputedStyle does not re-evaluate @media blocks based on viewport size.
 * This is a jsdom limitation, not a CSS issue — the @media rules below are
 * 100% standard CSS and work correctly in every real browser (Chrome,
 * Safari, Firefox, Edge). This test instead validates CSS structure via a
 * real CSS parser and confirms fluid-sizing tokens (clamp/aspect-ratio) and
 * all required breakpoints are present and well-formed.
 */
const fs = require('fs');
const path = require('path');
const cssParser = require('css');

const ROOT = require('path').join(__dirname, '..');
const errors = [];

const content = fs.readFileSync(path.join(ROOT, 'css', 'styles.css'), 'utf8');
const ast = cssParser.parse(content);

if (ast.stylesheet.parsingErrors && ast.stylesheet.parsingErrors.length) {
  errors.push('CSS parse errors: ' + JSON.stringify(ast.stylesheet.parsingErrors));
}
console.log('CSS parse errors:', (ast.stylesheet.parsingErrors || []).length);

// ── Required media queries ────────────────────────────────────────────────
const mediaRules = ast.stylesheet.rules.filter((r) => r.type === 'media');
console.log('\n@media blocks found:', mediaRules.length);

const requiredQueries = [
  { pattern: /min-width:\s*768px/, desc: 'Desktop breakpoint (sidebar / hide bottom nav)' },
  { pattern: /min-width:\s*768px.*max-width:\s*1023px|max-width:\s*1023px.*min-width:\s*768px/, desc: 'Tablet breakpoint (narrower sidebar)' },
  { pattern: /max-width:\s*360px/, desc: 'Small phone breakpoint' },
  { pattern: /min-width:\s*1440px/, desc: 'Large monitor breakpoint' },
  { pattern: /orientation:\s*landscape/, desc: 'Landscape phone breakpoint' },
  { pattern: /prefers-reduced-motion/, desc: 'Accessibility — reduced motion' },
];

for (const { pattern, desc } of requiredQueries) {
  const found = mediaRules.some((m) => pattern.test(m.media));
  console.log(`  [${found ? 'OK' : 'MISSING'}] ${desc}`);
  if (!found) errors.push(`Missing required @media rule: ${desc}`);
}

// Verify bottom-nav is hidden at >=768px (check across ALL matching blocks)
const desktopRules = mediaRules.filter((m) => /^\(min-width:\s*768px\)$/.test(m.media.trim()));
if (desktopRules.length > 0) {
  const combined = desktopRules.map((m) =>
    cssParser.stringify({ type: 'stylesheet', stylesheet: { rules: m.rules } })
  ).join('\n');
  if (!/\.bottom-nav\s*\{[^}]*display:\s*none/.test(combined)) {
    errors.push('@media (min-width: 768px) does not set .bottom-nav { display: none }');
  } else {
    console.log(`  [OK] .bottom-nav { display: none } inside (min-width: 768px) (${desktopRules.length} matching blocks)`);
  }
} else {
  errors.push('Could not find exact (min-width: 768px) media block');
}

// ── Fluid sizing tokens ────────────────────────────────────────────────────
console.log('\nFluid sizing checks:');
const fluidChecks = [
  { pattern: /--fs-base:\s*clamp/, desc: 'Fluid base font-size token (clamp)' },
  { pattern: /\.action-btn[^}]*font-size:\s*clamp/, desc: 'Action button fluid font-size' },
  { pattern: /\.playing-card\s*\{[^}]*width:\s*clamp/, desc: 'Playing card fluid width' },
  { pattern: /\.playing-card-lg\s*\{[^}]*width:\s*clamp/, desc: 'Large playing card fluid width' },
  { pattern: /\.range-cell[^}]*aspect-ratio:\s*1/, desc: 'Range grid cell aspect-ratio (prevents overflow)' },
  { pattern: /\.range-grid\s*\{[^}]*max-width/, desc: 'Range grid max-width cap' },
  { pattern: /\.source-badge[^}]*font-size:\s*clamp/, desc: 'Source badge fluid font-size' },
  { pattern: /min-height:\s*48px/, desc: 'Minimum 48px touch target on buttons' },
  { pattern: /\.poker-table-oval\s*\{[^}]*aspect-ratio/, desc: 'Poker table oval aspect-ratio (scales with width)' },
  { pattern: /\.poker-seat\s*\{[^}]*width:\s*clamp/, desc: 'Poker seat fluid width' },
  { pattern: /\.poker-card-back\s*\{[^}]*width:\s*clamp/, desc: 'Poker card-back fluid width' },
  { pattern: /\.poker-seat-label[^}]*font-size:\s*clamp/, desc: 'Poker seat label fluid font-size' },
];

for (const { pattern, desc } of fluidChecks) {
  const found = pattern.test(content);
  console.log(`  [${found ? 'OK' : 'MISSING'}] ${desc}`);
  if (!found) errors.push(`Missing fluid-sizing rule: ${desc}`);
}

// ── Viewport meta tag check (index.html) ──────────────────────────────────
console.log('\nindex.html checks:');
const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const viewportOk = /<meta name="viewport" content="[^"]*width=device-width[^"]*"/.test(html);
console.log(`  [${viewportOk ? 'OK' : 'MISSING'}] Responsive viewport meta tag`);
if (!viewportOk) errors.push('Missing or malformed viewport meta tag');

console.log('\n========================================');
console.log('ERRORS:', errors.length);
errors.forEach((e) => console.log('  - ' + e));
console.log('========================================');
process.exit(errors.length > 0 ? 1 : 0);
