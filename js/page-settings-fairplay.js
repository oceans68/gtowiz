/**
 * GTO Drill Coach — Settings + Fair Play Pages (Static Bundle)
 */
(function () {
  const { Card, Button, Badge, AppShell } = window.GTOComponents;
  const { cn, getLevelTitle, getLevelProgress } = window.GTOUtils;
  const { useAppStore, updateProfile, resetProgress } = window.GTOStore;

  // ── Settings ──────────────────────────────────────────────────────────

  function SettingsPage({ navigate }) {
    const { profile, allSessions } = useAppStore();
    const [username, setUsername] = React.useState(profile.username);
    const [saved, setSaved] = React.useState(false);
    const [confirmReset, setConfirmReset] = React.useState(false);

    const handleSave = () => {
      if (username.trim()) {
        updateProfile({ username: username.trim() });
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }
    };

    const handleReset = () => {
      if (confirmReset) {
        resetProgress();
        setConfirmReset(false);
        setUsername('Poker Student');
      } else {
        setConfirmReset(true);
        setTimeout(() => setConfirmReset(false), 5000);
      }
    };

    const levelPct = getLevelProgress(profile.xp, profile.level);

    return (
      <AppShell route="settings" navigate={navigate}>
        <div className="max-w-lg mx-auto px-4 pt-6 pb-4">
          <div className="mb-6">
            <h1 className="font-display font-bold text-2xl text-slate-100">Settings</h1>
            <p className="text-slate-500 text-sm mt-1">Your profile and preferences</p>
          </div>

          <Card className="mb-4">
            <div className="flex items-center gap-4 mb-5">
              <div className="w-14 h-14 rounded-full bg-teal-500/15 flex items-center justify-center text-2xl font-display font-bold text-teal-400">
                {profile.username.slice(0, 1).toUpperCase()}
              </div>
              <div>
                <div className="font-display font-bold text-slate-200 text-lg">{profile.username}</div>
                <div className="flex items-center gap-2">
                  <Badge variant="teal">Level {profile.level}</Badge>
                  <span className="text-xs text-slate-500">{getLevelTitle(profile.level)}</span>
                </div>
              </div>
            </div>

            <div className="mb-1 flex justify-between text-xs text-slate-500">
              <span>XP Progress</span><span>{profile.xp.toLocaleString()} XP</span>
            </div>
            <div className="progress-bar mb-4">
              <div className="progress-bar-fill" style={{ width: `${levelPct}%`, background: 'linear-gradient(90deg, #e5a500, #ffb800)' }} />
            </div>

            <div className="mb-4">
              <label className="text-xs font-display font-semibold text-slate-500 uppercase tracking-wider block mb-2">Display Name</label>
              <div className="flex gap-2">
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} maxLength={30} className="gto-input flex-1" placeholder="Your name" />
                <Button variant={saved ? 'gold' : 'primary'} size="md" onClick={handleSave} disabled={!username.trim() || username === profile.username}>
                  {saved ? '✓ Saved' : 'Save'}
                </Button>
              </div>
            </div>
          </Card>

          <Card className="mb-4">
            <div className="text-xs font-display font-semibold text-slate-500 uppercase tracking-wider mb-4">Game Preferences</div>
            <div className="mb-4">
              <label className="text-xs text-slate-400 block mb-2">Primary Game Type</label>
              <div className="flex gap-2">
                {['cash', 'mtt', 'both'].map((type) => (
                  <button key={type} onClick={() => updateProfile({ game_type_preference: type })} className={cn('flex-1 py-2 rounded-lg font-display font-semibold text-xs border transition-all', profile.game_type_preference === type ? 'border-teal-400/40 bg-teal-400/10 text-teal-400' : 'border-white/6 text-slate-500 hover:text-slate-400')}>
                    {type === 'cash' ? 'Cash Game' : type === 'mtt' ? 'Tournament' : 'Both'}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-2">Stakes Level</label>
              <div className="flex gap-2">
                {['micro', 'low', 'mid', 'high'].map((level) => (
                  <button key={level} onClick={() => updateProfile({ stakes_level: level })} className={cn('flex-1 py-2 rounded-lg font-display font-semibold text-xs border transition-all capitalize', profile.stakes_level === level ? 'border-teal-400/40 bg-teal-400/10 text-teal-400' : 'border-white/6 text-slate-500 hover:text-slate-400')}>
                    {level}
                  </button>
                ))}
              </div>
            </div>
          </Card>

          <Card className="mb-4">
            <div className="text-xs font-display font-semibold text-slate-500 uppercase tracking-wider mb-4">Your Statistics</div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Total Sessions', value: allSessions.length },
                { label: 'Total Spots', value: allSessions.reduce((s, sess) => s + sess.total_spots, 0) },
                { label: 'Best Streak', value: `${profile.longest_streak} days` },
                { label: 'Current Streak', value: `${profile.current_streak} days` },
                { label: 'Total XP', value: profile.xp.toLocaleString() },
                { label: 'Level', value: `${profile.level} · ${getLevelTitle(profile.level)}` },
              ].map(({ label, value }) => (
                <div key={label} className="bg-white/3 rounded-lg p-3">
                  <div className="text-xs text-slate-500 mb-1">{label}</div>
                  <div className="font-display font-bold text-slate-200 text-sm">{value}</div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="mb-4">
            <div className="text-xs font-display font-semibold text-slate-500 uppercase tracking-wider mb-3">Legal & Policy</div>
            <div className="space-y-1">
              <a href="#/fair-play" onClick={(e) => { e.preventDefault(); navigate('fair-play'); }} className="flex items-center justify-between py-2.5 text-sm text-slate-400 hover:text-slate-200 transition-colors">
                <span>🛡️ Fair Play Policy</span><span className="text-slate-600">→</span>
              </a>
              <div className="border-t border-white/5" />
              <div className="py-2.5 text-sm text-slate-500">📊 All training data is labeled with source accuracy</div>
              <div className="border-t border-white/5" />
              <div className="py-2.5 text-sm text-slate-500">🔒 Data stored locally in your browser only (localStorage)</div>
            </div>
          </Card>

          <Card className="mb-4 border border-gto-red/15">
            <div className="text-xs font-display font-semibold text-gto-red uppercase tracking-wider mb-3">Danger Zone</div>
            <p className="text-sm text-slate-500 mb-4">Reset all progress, sessions, XP, streaks, and badges. This cannot be undone.</p>
            <Button variant="danger" size="md" onClick={handleReset} fullWidth>
              {confirmReset ? '⚠️ Click again to confirm reset' : 'Reset All Progress'}
            </Button>
            {confirmReset && <p className="text-xs text-gto-red text-center mt-2">This will permanently delete all your data. Click again within 5 seconds to confirm.</p>}
          </Card>

          <p className="text-center text-xs text-slate-600 mt-4">GTO Drill Coach · Static build · Off-table study only</p>
        </div>
      </AppShell>
    );
  }

  // ── Fair Play ─────────────────────────────────────────────────────────

  function FairPlayPage({ navigate }) {
    const sectionStyle = { background: 'rgba(22, 27, 36, 0.85)', border: '1px solid rgba(255, 255, 255, 0.07)', borderRadius: '12px', padding: '20px' };

    return (
      <AppShell route="fair-play" navigate={navigate}>
        <div className="max-w-2xl mx-auto px-4 py-8 py-8">
          <a href="#/dashboard" onClick={(e) => { e.preventDefault(); navigate('dashboard'); }} className="inline-flex items-center gap-2 text-teal-400 hover:text-teal-300 text-sm font-display font-medium mb-8 transition-colors">← Back to App</a>

          <div className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-teal-500/15 flex items-center justify-center text-xl">🛡️</div>
              <div>
                <h1 className="font-display font-bold text-2xl text-slate-100">Fair Play Policy</h1>
                <p className="text-slate-500 text-sm">GTO Drill Coach · Static Build</p>
              </div>
            </div>
            <div style={{ background: 'rgba(0, 212, 255, 0.06)', border: '1px solid rgba(0, 212, 255, 0.2)', borderRadius: '12px', padding: '16px' }}>
              <p className="text-teal-400 font-display font-semibold text-sm">GTO Drill Coach is an off-table poker study tool. It is not permitted to use this application during any active, real-money poker session.</p>
            </div>
          </div>

          <div className="space-y-8">
            <section>
              <h2 className="font-display font-bold text-xl text-slate-100 mb-4 flex items-center gap-2"><span className="text-teal-400">1.</span> Off-Table Study Only</h2>
              <div style={sectionStyle}>
                <p className="text-slate-400 leading-relaxed">GTO Drill Coach is designed and intended exclusively for use <strong className="text-slate-200">away from any active poker session</strong>. This includes online poker on any platform, mobile poker apps, and live games where a mobile device might be used.</p>
                <p className="text-slate-400 leading-relaxed mt-3">The purpose of this application is to help you build better poker habits, internalize GTO preflop ranges, and develop postflop pattern recognition through structured study sessions — not to assist in real-time decision-making during play.</p>
              </div>
            </section>

            <section>
              <h2 className="font-display font-bold text-xl text-slate-100 mb-4 flex items-center gap-2"><span className="text-teal-400">2.</span> No Real-Time Assistance (RTA)</h2>
              <div style={sectionStyle}>
                <p className="text-slate-400 leading-relaxed mb-4">Using any external decision aid during a live hand — whether online or live — is widely considered cheating and constitutes a violation of the Terms of Service of virtually all online poker platforms.</p>
                <p className="text-slate-400 leading-relaxed mb-4">GTO Drill Coach is not an RTA tool and provides none of the following:</p>
                <ul className="space-y-2">
                  {['Real-time hand input from an active poker session', 'Live overlay or HUD integration with poker clients', 'Browser extension functionality', 'Screen reading capability', 'Live poker client connectivity or API access', '"Tell me what to do right now" real-time mode', 'Active game monitoring or alert systems'].map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-500"><span className="text-gto-red flex-shrink-0 mt-0.5">✗</span>{item}</li>
                  ))}
                </ul>
              </div>
            </section>

            <section>
              <h2 className="font-display font-bold text-xl text-slate-100 mb-4 flex items-center gap-2"><span className="text-teal-400">3.</span> Honest Data Representation</h2>
              <div style={sectionStyle}>
                <p className="text-slate-400 leading-relaxed mb-4">Every drill spot in GTO Drill Coach is labeled with its data accuracy level. We do not claim that training data is equivalent to certified solver outputs unless explicitly verified.</p>
                <div className="space-y-3">
                  {[
                    { label: '✓ Solver Verified', desc: 'Computed by a recognized solver with documented methodology.', color: '#00cc66', bg: 'rgba(0,204,102,0.08)' },
                    { label: '📊 Imported Chart', desc: 'Derived from published range charts with cited educational sources.', color: '#00d4ff', bg: 'rgba(0,212,255,0.08)' },
                    { label: '👨‍🏫 Coach Entered', desc: 'Manually entered by a verified poker coach or educator.', color: '#60a5fa', bg: 'rgba(96,165,250,0.08)' },
                    { label: '~ Estimated', desc: 'Algorithmically approximated based on GTO principles. Not solver-computed. Used for MTT push/fold ranges and EV-loss scoring.', color: '#ffb800', bg: 'rgba(255,184,0,0.08)' },
                    { label: '⚠ Sample Training Data', desc: 'Training examples for building habits. Not claimed as GTO-accurate.', color: '#fb923c', bg: 'rgba(251,146,60,0.08)' },
                  ].map(({ label, desc, color, bg }) => (
                    <div key={label} style={{ background: bg, borderRadius: '8px', padding: '12px 14px' }}>
                      <span style={{ color, fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, fontSize: '13px' }}>{label}</span>
                      <p className="text-xs text-slate-500 mt-1">{desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section>
              <h2 className="font-display font-bold text-xl text-slate-100 mb-4 flex items-center gap-2"><span className="text-teal-400">4.</span> Responsible Gaming</h2>
              <div style={sectionStyle}>
                <p className="text-slate-400 leading-relaxed mb-3">Poker is a game of skill and probability. Improving your decision-making through study can reduce mistakes, but does not guarantee financial results. Study tools improve understanding, not outcomes.</p>
                <p className="text-slate-400 leading-relaxed">If you or someone you know may have a gambling problem, please seek help. Resources include:</p>
                <ul className="mt-3 space-y-1 text-sm text-slate-500">
                  <li>• <strong className="text-slate-400">GamCare</strong> (UK): gamcare.org.uk</li>
                  <li>• <strong className="text-slate-400">National Problem Gambling Helpline</strong> (US): 1-800-522-4700</li>
                  <li>• <strong className="text-slate-400">Gamblers Anonymous</strong>: gamblersanonymous.org</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="font-display font-bold text-xl text-slate-100 mb-4 flex items-center gap-2"><span className="text-teal-400">5.</span> Age Requirement</h2>
              <div style={sectionStyle}>
                <p className="text-slate-400 leading-relaxed">This platform is intended for users aged <strong className="text-slate-200">18 years or older</strong>. In some jurisdictions the minimum age for poker-related activities may be higher — please comply with your local laws.</p>
              </div>
            </section>

            <section>
              <h2 className="font-display font-bold text-xl text-slate-100 mb-4 flex items-center gap-2"><span className="text-teal-400">6.</span> User Responsibility</h2>
              <div style={sectionStyle}>
                <p className="text-slate-400 leading-relaxed">Violation of this policy — including using GTO Drill Coach during a live or online poker session — is solely the user's responsibility. GTO Drill Coach and its developers disclaim any liability for violations of online poker platform Terms of Service resulting from user misuse of this study application.</p>
                <p className="text-slate-400 leading-relaxed mt-3">By using this application, you confirm that you have read, understood, and agree to use GTO Drill Coach only as an off-table study tool.</p>
              </div>
            </section>
          </div>

          <div className="mt-12 pt-8 border-t border-white/6 text-center">
            <p className="text-slate-600 text-sm mb-4">GTO Drill Coach · Off-table study tool · Static build</p>
            <Button variant="primary" onClick={() => navigate('dashboard')}>Return to App →</Button>
          </div>
        </div>
      </AppShell>
    );
  }

  window.GTOPages = window.GTOPages || {};
  window.GTOPages.Settings = SettingsPage;
  window.GTOPages.FairPlay = FairPlayPage;
})();
