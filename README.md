# GTO Drill Coach — Static Build (GitHub Pages Ready)

A fully static, build-free version of GTO Drill Coach. Runs entirely in the
browser — **no Node.js, no build step, no backend, no API key required**.
Deploy by uploading these files anywhere static files are served (GitHub
Pages, Netlify, Vercel static, or even opened directly from disk).

---

## 🎯 Training coverage

**Preflop — Cash (100bb, 6-max)**
- Open raising (RFI) from UTG, CO, BTN, SB
- Facing an open: BB vs BTN, CO vs UTG, BTN vs UTG, SB vs BTN
- Facing a limper: BTN, SB, and BB (isolate-raise, overcall, or check)
- 3-bet (BTN vs CO) and facing a 4-bet after 3-betting

**Preflop — MTT Push/Fold (short stack)**
- Blind-vs-blind shoves: UTG 10bb, CO 15bb, BTN 10bb, SB 10bb vs BB
- Facing a limper at 12bb (punish a capped range)
- Facing a raise in the BB at 10bb (tighter than blind-vs-blind)

**Postflop (28 spots)**
- Flop, turn, and river decisions across dry/wet/monotone/paired boards,
  single-raised pots, 3-bet pots, and a 4-bet pot
- Stack depths from 40bb to 150bb

Every range and spot is labeled with its data source — see the in-app Fair
Play policy.

## 🃏 Visual table simulation

The preflop trainer renders a 2D oval poker table for every spot: 6 seats
positioned around the table (hero always at the bottom seat), a dealer
button, face-up hole cards for hero, face-down cards for any villain
involved in the action, a pot-size display, and an action bubble showing
what the villain did (e.g. "Raises 2.5bb", "Limps (calls 1bb)", "4-Bets").
The table scales fluidly on any screen size via CSS `clamp()`/`aspect-ratio`,
just like the rest of the app.

## 🚀 Deploy to GitHub Pages (3 steps)

1. Create a new GitHub repository (or use an existing one).
2. Upload the contents of this folder — including the **`.nojekyll` file**
   (it has no extension and may be hidden by your file manager/Finder/
   Explorer by default — make sure it's included!) — to the repository
   root (or to a `/docs` folder — your choice).
3. In the repo settings → **Pages**, set the source to the branch/folder you
   uploaded to. Save.

> ⚠️ **Critical:** the `.nojekyll` file must be present in the deployed
> folder. Without it, GitHub Pages runs every file through Jekyll by
> default, and Jekyll's templating engine misinterprets the `{{ ... }}`
> syntax that appears throughout the JSX files (e.g. `style={{ width: ... }}`)
> as its own template tags — this silently corrupts the JS and the app gets
> stuck on the "Loading GTO Drill Coach…" screen forever with no visible
> error. If your deployed site is stuck loading, this is almost always why
> — check that `.nojekyll` made it into your repo (GitHub's file browser
> will show it at the repo root; some local file managers hide dotfiles by
> default, so when uploading via drag-and-drop, double check it went up).

GitHub will give you a URL like `https://yourusername.github.io/your-repo/`.
Open it in any modern Chrome (or other) browser — the app loads immediately.

No `npm install`, no `npm run build`, no environment variables. Everything
runs client-side via CDN-hosted React, ReactDOM, and Babel standalone.

---

## 🧱 How it works

| Layer | Technology |
|---|---|
| UI framework | React 18 (UMD build via unpkg CDN) |
| JSX transform | Babel standalone, runs in-browser (`type="text/babel"`) |
| Styling | Tailwind CSS (Play CDN, JIT) + `css/styles.css` for custom theme/animations |
| State | Custom localStorage-backed store (`js/store.js`) — replaces Zustand |
| Routing | Hash-based (`#/dashboard`, `#/drill/preflop`, etc.) — no server routing needed |
| AI explanations | Fully client-side rule-based generator (`js/explain.js`) — no API calls |
| Data | All preflop ranges + postflop spots inlined in `js/data.js`, clearly labeled |

### File structure

```
index.html                    Entry point — loads all CDN scripts + app files
css/styles.css                Dark theme, fluid typography, responsive rules
js/data.js                    Preflop ranges (cash + MTT push/fold) + postflop spots
js/utils.js                   Scoring, XP/level math, formatting helpers
js/hand-parser.js             PokerStars/GGPoker hand history parser
js/explain.js                 Client-side coaching explanation generator
js/store.js                   localStorage-backed state + React hook
js/components.js              Shared UI components, Sidebar, BottomNav, AppShell
js/page-dashboard.js           Dashboard page
js/page-preflop.js             Preflop trainer (Cash 100bb + MTT Push/Fold)
js/page-postflop.js            Postflop quiz trainer (28 spots)
js/page-missions.js            Daily missions, streaks, badges
js/page-progress.js            Progress analytics, leak heatmap
js/page-review.js              Hand history review
js/page-library.js             Browse all spots/ranges
js/page-settings-fairplay.js   Settings + Fair Play policy
js/app.js                      Hash router + React mount
tests/                          Node-based test suite (see below)
```

---

## 📱 Responsive design

The app is fully responsive and adapts to any screen size:

- **Phones (< 768px)**: bottom tab navigation, single-column layouts, fluid
  `clamp()`-based font sizes and button sizes so nothing is ever too small to
  tap (minimum 48px touch targets).
- **Tablets (768–1023px)**: narrower sidebar (180px), same touch-friendly
  sizing.
- **Desktops (≥ 768px)**: left sidebar navigation, multi-column grids.
- **Large monitors (≥ 1440px)**: content is centered with a capped max-width
  so text doesn't stretch uncomfortably wide.
- **Landscape phones**: bottom nav height reduces to avoid eating vertical
  space.
- **Very small screens (< 360px)**: extra padding reduction.
- The 13×13 preflop range grid and playing cards scale fluidly via
  `clamp()` and `aspect-ratio` so they never overflow horizontally on any
  device.
- Respects `prefers-reduced-motion` for accessibility.

---

## 🧪 Testing

A full Node-based test suite lives in `tests/`. It uses `jsdom` + `@babel/core`
to load the entire app (transforming JSX exactly as the browser's Babel
standalone would) and exercises every page and user flow.

To run the tests:

```bash
cd tests
npm install jsdom @babel/core @babel/preset-react react react-dom
node test-harness.js       # renders every route, checks expected content
node interaction-test.js   # full drill sessions, hand review, settings, reset
node data-test.js          # data integrity + localStorage persistence
node responsive-test.js    # CSS structure / media query validation
```

All four suites pass with **0 errors** as of this build.

---

## 🛡️ Data integrity & fair play

Every preflop range and postflop spot is labeled with its data source:

- `✓ Solver Verified` — none currently (would require licensed solver runs)
- `📊 Imported Chart` — the 6 cash-game preflop ranges
- `~ Estimated` — the 4 MTT push/fold ranges (Nash-style approximations, not ICM-adjusted)
- `⚠ Sample Training Data` — all 28 postflop spots

See the in-app **Fair Play** page for the full policy. This app is for
**off-table study only** — no real-time assistance, no live poker client
integration.

---

## 🔧 Local development

No build step needed — just serve the folder:

```bash
python3 -m http.server 8000
# or
npx serve .
```

Then open `http://localhost:8000`.

> Note: opening `index.html` directly via `file://` also works in most
> browsers, since all scripts are loaded from CDNs and localStorage works
> on `file://` origins in Chrome. If you see CORS issues with `file://`,
> use a local HTTP server instead (a one-line command above).

---

## ⚙️ Customizing / extending data

All training data lives in `js/data.js` as plain JavaScript objects — no
build step required. To add a new postflop spot or preflop range, just add
an entry to the `POSTFLOP_SPOTS` or `PREFLOP_RANGES` / `MTT_PUSH_FOLD_RANGES`
arrays following the existing shape, and make sure to set an honest
`source_type` and `accuracy_level`.

---

## 🩺 Troubleshooting

**Stuck on "Loading GTO Drill Coach…" forever (GitHub Pages):**
Almost always means the `.nojekyll` file didn't make it into the deployed
repo — see the warning in the deploy steps above. Check your repo's root
on GitHub.com; you should see `.nojekyll` listed alongside `index.html`,
`css/`, and `js/`. If it's missing, add it and re-push.

**Stuck on loading (local `file://` double-click):**
Some browsers restrict `localStorage` and certain script behaviors on
`file://` pages. Run a local server instead (see "Local development"
above) rather than double-clicking `index.html`.

**Stuck on loading (any context) — how to see the real error:**
Open the browser's Developer Tools (F12 in Chrome) → Console tab. A
genuine JavaScript error will be printed there in red, which will say
exactly which file and line failed. If you see CDN-related network errors
(react/react-dom/babel failing to load), check your internet connection
or any browser extensions/firewalls that might block `unpkg.com` or
`cdn.tailwindcss.com`.

**Site loads but looks unstyled / broken layout:**
Check that `css/styles.css` actually deployed and that the path is exactly
`css/styles.css` relative to `index.html` (case-sensitive on GitHub Pages,
unlike some local setups).
