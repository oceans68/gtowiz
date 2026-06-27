/**
 * GTO Drill Coach — Static Data Bundle
 * Plain-JS port of preflop-ranges.ts + postflop-spots.ts
 * All data labeled per data integrity policy (see fair-play page).
 */
(function () {
/**
 * GTO Drill Coach — Preflop Range Seed Data
 *
 * SOURCE: Derived from publicly available 100bb 6-max No-Limit Hold'em
 * GTO opening ranges as described in educational resources.
 * All ranges labeled as 'imported_chart' per data integrity policy.
 *
 * DATA ACCURACY: imported_chart — Not claimed as solver-verified.
 * These are training ranges suitable for building correct preflop habits.
 * Exact frequencies may differ from site-specific rake-adjusted solves.
 */


// All 169 hand combos in standard notation
// Pocket pairs: AA, KK, QQ, JJ, TT, 99, 88, 77, 66, 55, 44, 33, 22
// Suited: AKs, AQs ... 32s
// Offsuit: AKo, AQo ... 32o


// =============================================
// UTG Open Raise Ranges (100bb, 6-max, ~15-16%)
// =============================================
const UTG_RFI_ACTIONS = [
  // Pocket pairs
  ['AA', 'raise', 1.0],
  ['KK', 'raise', 1.0],
  ['QQ', 'raise', 1.0],
  ['JJ', 'raise', 1.0],
  ['TT', 'raise', 1.0],
  ['99', 'raise', 1.0],
  ['88', 'raise', 1.0],
  ['77', 'raise', 0.7],
  ['66', 'raise', 0.5],
  ['55', 'raise', 0.4],
  ['44', 'raise', 0.2],
  ['33', 'raise', 0.1],
  ['22', 'raise', 0.0],
  // Suited aces
  ['AKs', 'raise', 1.0],
  ['AQs', 'raise', 1.0],
  ['AJs', 'raise', 1.0],
  ['ATs', 'raise', 1.0],
  ['A9s', 'raise', 0.7],
  ['A8s', 'raise', 0.5],
  ['A7s', 'raise', 0.4],
  ['A6s', 'raise', 0.5],
  ['A5s', 'raise', 0.8],
  ['A4s', 'raise', 0.5],
  ['A3s', 'raise', 0.3],
  ['A2s', 'raise', 0.2],
  // Offsuit aces
  ['AKo', 'raise', 1.0],
  ['AQo', 'raise', 1.0],
  ['AJo', 'raise', 0.9],
  ['ATo', 'raise', 0.5],
  ['A9o', 'raise', 0.0],
  // King combos
  ['KQs', 'raise', 1.0],
  ['KJs', 'raise', 1.0],
  ['KTs', 'raise', 0.9],
  ['K9s', 'raise', 0.5],
  ['K8s', 'raise', 0.2],
  ['KQo', 'raise', 0.9],
  ['KJo', 'raise', 0.5],
  ['KTo', 'raise', 0.2],
  // Queen combos
  ['QJs', 'raise', 1.0],
  ['QTs', 'raise', 1.0],
  ['Q9s', 'raise', 0.4],
  ['QJo', 'raise', 0.6],
  ['QTo', 'raise', 0.2],
  // Jack combos
  ['JTs', 'raise', 1.0],
  ['J9s', 'raise', 0.5],
  ['JTo', 'raise', 0.3],
  // Ten combos
  ['T9s', 'raise', 0.7],
  ['T8s', 'raise', 0.3],
  // Nine and below
  ['98s', 'raise', 0.4],
  ['87s', 'raise', 0.2],
];

// =============================================
// CO Open Raise Ranges (100bb, 6-max, ~27-30%)
// =============================================
const CO_RFI_ACTIONS = [
  // All pocket pairs raise
  ['AA', 'raise', 1.0], ['KK', 'raise', 1.0], ['QQ', 'raise', 1.0],
  ['JJ', 'raise', 1.0], ['TT', 'raise', 1.0], ['99', 'raise', 1.0],
  ['88', 'raise', 1.0], ['77', 'raise', 1.0], ['66', 'raise', 1.0],
  ['55', 'raise', 0.9], ['44', 'raise', 0.8], ['33', 'raise', 0.6],
  ['22', 'raise', 0.5],
  // Suited aces — all raise
  ['AKs', 'raise', 1.0], ['AQs', 'raise', 1.0], ['AJs', 'raise', 1.0],
  ['ATs', 'raise', 1.0], ['A9s', 'raise', 1.0], ['A8s', 'raise', 1.0],
  ['A7s', 'raise', 1.0], ['A6s', 'raise', 1.0], ['A5s', 'raise', 1.0],
  ['A4s', 'raise', 1.0], ['A3s', 'raise', 1.0], ['A2s', 'raise', 1.0],
  // Offsuit aces
  ['AKo', 'raise', 1.0], ['AQo', 'raise', 1.0], ['AJo', 'raise', 1.0],
  ['ATo', 'raise', 1.0], ['A9o', 'raise', 0.8], ['A8o', 'raise', 0.5],
  // King suited
  ['KQs', 'raise', 1.0], ['KJs', 'raise', 1.0], ['KTs', 'raise', 1.0],
  ['K9s', 'raise', 1.0], ['K8s', 'raise', 0.8], ['K7s', 'raise', 0.6],
  ['K6s', 'raise', 0.5], ['K5s', 'raise', 0.5],
  // King offsuit
  ['KQo', 'raise', 1.0], ['KJo', 'raise', 1.0], ['KTo', 'raise', 0.9],
  ['K9o', 'raise', 0.5], ['K8o', 'raise', 0.2],
  // Queen suited
  ['QJs', 'raise', 1.0], ['QTs', 'raise', 1.0], ['Q9s', 'raise', 1.0],
  ['Q8s', 'raise', 0.7], ['Q7s', 'raise', 0.3],
  // Queen offsuit
  ['QJo', 'raise', 1.0], ['QTo', 'raise', 0.9], ['Q9o', 'raise', 0.5],
  // Jack suited
  ['JTs', 'raise', 1.0], ['J9s', 'raise', 1.0], ['J8s', 'raise', 0.8],
  ['J7s', 'raise', 0.3],
  // Jack offsuit
  ['JTo', 'raise', 0.9], ['J9o', 'raise', 0.5],
  // Ten suited and below
  ['T9s', 'raise', 1.0], ['T8s', 'raise', 0.9], ['T7s', 'raise', 0.5],
  ['98s', 'raise', 1.0], ['97s', 'raise', 0.7], ['87s', 'raise', 0.9],
  ['86s', 'raise', 0.5], ['76s', 'raise', 0.8], ['75s', 'raise', 0.4],
  ['65s', 'raise', 0.6], ['54s', 'raise', 0.4],
];

// =============================================
// BTN Open Raise Ranges (100bb, 6-max, ~45-50%)
// =============================================
const BTN_RFI_ACTIONS = [
  // All pocket pairs
  ['AA', 'raise', 1.0], ['KK', 'raise', 1.0], ['QQ', 'raise', 1.0],
  ['JJ', 'raise', 1.0], ['TT', 'raise', 1.0], ['99', 'raise', 1.0],
  ['88', 'raise', 1.0], ['77', 'raise', 1.0], ['66', 'raise', 1.0],
  ['55', 'raise', 1.0], ['44', 'raise', 1.0], ['33', 'raise', 1.0],
  ['22', 'raise', 1.0],
  // Suited aces — all raise
  ['AKs', 'raise', 1.0], ['AQs', 'raise', 1.0], ['AJs', 'raise', 1.0],
  ['ATs', 'raise', 1.0], ['A9s', 'raise', 1.0], ['A8s', 'raise', 1.0],
  ['A7s', 'raise', 1.0], ['A6s', 'raise', 1.0], ['A5s', 'raise', 1.0],
  ['A4s', 'raise', 1.0], ['A3s', 'raise', 1.0], ['A2s', 'raise', 1.0],
  // Offsuit aces
  ['AKo', 'raise', 1.0], ['AQo', 'raise', 1.0], ['AJo', 'raise', 1.0],
  ['ATo', 'raise', 1.0], ['A9o', 'raise', 1.0], ['A8o', 'raise', 1.0],
  ['A7o', 'raise', 0.8], ['A6o', 'raise', 0.6], ['A5o', 'raise', 0.7],
  ['A4o', 'raise', 0.5], ['A3o', 'raise', 0.4], ['A2o', 'raise', 0.3],
  // King suited — all raise
  ['KQs', 'raise', 1.0], ['KJs', 'raise', 1.0], ['KTs', 'raise', 1.0],
  ['K9s', 'raise', 1.0], ['K8s', 'raise', 1.0], ['K7s', 'raise', 1.0],
  ['K6s', 'raise', 1.0], ['K5s', 'raise', 0.9], ['K4s', 'raise', 0.8],
  ['K3s', 'raise', 0.7], ['K2s', 'raise', 0.6],
  // King offsuit
  ['KQo', 'raise', 1.0], ['KJo', 'raise', 1.0], ['KTo', 'raise', 1.0],
  ['K9o', 'raise', 1.0], ['K8o', 'raise', 0.8], ['K7o', 'raise', 0.5],
  ['K6o', 'raise', 0.3],
  // Queen suited
  ['QJs', 'raise', 1.0], ['QTs', 'raise', 1.0], ['Q9s', 'raise', 1.0],
  ['Q8s', 'raise', 1.0], ['Q7s', 'raise', 0.9], ['Q6s', 'raise', 0.7],
  ['Q5s', 'raise', 0.5],
  // Queen offsuit
  ['QJo', 'raise', 1.0], ['QTo', 'raise', 1.0], ['Q9o', 'raise', 1.0],
  ['Q8o', 'raise', 0.7], ['Q7o', 'raise', 0.3],
  // Jack suited
  ['JTs', 'raise', 1.0], ['J9s', 'raise', 1.0], ['J8s', 'raise', 1.0],
  ['J7s', 'raise', 0.9], ['J6s', 'raise', 0.5],
  // Jack offsuit
  ['JTo', 'raise', 1.0], ['J9o', 'raise', 0.9], ['J8o', 'raise', 0.6],
  // Ten suited
  ['T9s', 'raise', 1.0], ['T8s', 'raise', 1.0], ['T7s', 'raise', 0.9],
  ['T6s', 'raise', 0.6],
  // Ten offsuit
  ['T9o', 'raise', 0.8], ['T8o', 'raise', 0.4],
  // Lower suited connectors
  ['98s', 'raise', 1.0], ['97s', 'raise', 1.0], ['96s', 'raise', 0.7],
  ['87s', 'raise', 1.0], ['86s', 'raise', 0.9], ['85s', 'raise', 0.5],
  ['76s', 'raise', 1.0], ['75s', 'raise', 0.8], ['65s', 'raise', 1.0],
  ['64s', 'raise', 0.6], ['54s', 'raise', 0.9], ['53s', 'raise', 0.6],
  ['43s', 'raise', 0.4],
];

// =============================================
// SB RFI (100bb, 6-max — wider than CO, IP vs BB)
// =============================================
const SB_RFI_ACTIONS = [
  // Essentially same as BTN+ with all pairs and most broadways/suited
  ['AA', 'raise', 1.0], ['KK', 'raise', 1.0], ['QQ', 'raise', 1.0],
  ['JJ', 'raise', 1.0], ['TT', 'raise', 1.0], ['99', 'raise', 1.0],
  ['88', 'raise', 1.0], ['77', 'raise', 1.0], ['66', 'raise', 1.0],
  ['55', 'raise', 1.0], ['44', 'raise', 0.9], ['33', 'raise', 0.8],
  ['22', 'raise', 0.7],
  ['AKs', 'raise', 1.0], ['AQs', 'raise', 1.0], ['AJs', 'raise', 1.0],
  ['ATs', 'raise', 1.0], ['A9s', 'raise', 1.0], ['A8s', 'raise', 1.0],
  ['A7s', 'raise', 1.0], ['A6s', 'raise', 1.0], ['A5s', 'raise', 1.0],
  ['A4s', 'raise', 1.0], ['A3s', 'raise', 1.0], ['A2s', 'raise', 1.0],
  ['AKo', 'raise', 1.0], ['AQo', 'raise', 1.0], ['AJo', 'raise', 1.0],
  ['ATo', 'raise', 1.0], ['A9o', 'raise', 1.0], ['A8o', 'raise', 0.9],
  ['A7o', 'raise', 0.7], ['A6o', 'raise', 0.5], ['A5o', 'raise', 0.6],
  ['KQs', 'raise', 1.0], ['KJs', 'raise', 1.0], ['KTs', 'raise', 1.0],
  ['K9s', 'raise', 1.0], ['K8s', 'raise', 1.0], ['K7s', 'raise', 0.9],
  ['KQo', 'raise', 1.0], ['KJo', 'raise', 1.0], ['KTo', 'raise', 1.0],
  ['K9o', 'raise', 0.8], ['K8o', 'raise', 0.4],
  ['QJs', 'raise', 1.0], ['QTs', 'raise', 1.0], ['Q9s', 'raise', 1.0],
  ['Q8s', 'raise', 0.8], ['QJo', 'raise', 1.0], ['QTo', 'raise', 0.9],
  ['JTs', 'raise', 1.0], ['J9s', 'raise', 1.0], ['J8s', 'raise', 0.8],
  ['JTo', 'raise', 0.8],
  ['T9s', 'raise', 1.0], ['T8s', 'raise', 0.9],
  ['98s', 'raise', 1.0], ['97s', 'raise', 0.8], ['87s', 'raise', 0.9],
  ['76s', 'raise', 0.8], ['65s', 'raise', 0.7], ['54s', 'raise', 0.6],
];

// =============================================
// BB vs BTN Open — Defending Range
// =============================================
const BB_VS_BTN_OPEN_ACTIONS = [
  // Premium hands — 3-bet
  ['AA', 'raise', 1.0], ['KK', 'raise', 1.0], ['QQ', 'raise', 1.0],
  ['JJ', 'raise', 0.7], ['AKs', 'raise', 1.0], ['AKo', 'raise', 1.0],
  ['AQs', 'raise', 0.8], ['AQo', 'raise', 0.4],
  // Call range — pairs
  ['JJ', 'call', 0.3],
  ['TT', 'call', 1.0], ['99', 'call', 1.0], ['88', 'call', 1.0],
  ['77', 'call', 1.0], ['66', 'call', 1.0], ['55', 'call', 1.0],
  ['44', 'call', 1.0], ['33', 'call', 1.0], ['22', 'call', 1.0],
  // Suited aces — call or 3-bet bluff
  ['AJs', 'raise', 0.5], ['AJs', 'call', 0.5],
  ['ATs', 'call', 1.0], ['A9s', 'call', 1.0], ['A8s', 'call', 1.0],
  ['A7s', 'call', 1.0], ['A6s', 'call', 1.0], ['A5s', 'raise', 0.5], ['A5s', 'call', 0.5],
  ['A4s', 'call', 1.0], ['A3s', 'call', 1.0], ['A2s', 'call', 1.0],
  // Offsuit aces
  ['AJo', 'call', 1.0], ['ATo', 'call', 1.0], ['A9o', 'call', 0.6],
  // Kings
  ['KQs', 'raise', 0.4], ['KQs', 'call', 0.6],
  ['KJs', 'call', 1.0], ['KTs', 'call', 1.0], ['K9s', 'call', 1.0],
  ['K8s', 'call', 0.8], ['K7s', 'call', 0.5],
  ['KQo', 'call', 1.0], ['KJo', 'call', 1.0], ['KTo', 'call', 0.8],
  // Queens and below suited
  ['QJs', 'call', 1.0], ['QTs', 'call', 1.0], ['Q9s', 'call', 1.0],
  ['Q8s', 'call', 0.7], ['Q7s', 'call', 0.4],
  ['QJo', 'call', 1.0], ['QTo', 'call', 0.8], ['Q9o', 'call', 0.4],
  ['JTs', 'call', 1.0], ['J9s', 'call', 1.0], ['J8s', 'call', 0.8],
  ['JTo', 'call', 0.8], ['J9o', 'call', 0.4],
  ['T9s', 'call', 1.0], ['T8s', 'call', 1.0], ['T7s', 'call', 0.6],
  ['T9o', 'call', 0.5],
  ['98s', 'call', 1.0], ['97s', 'call', 0.9], ['96s', 'call', 0.5],
  ['87s', 'call', 1.0], ['86s', 'call', 0.8], ['76s', 'call', 0.9],
  ['75s', 'call', 0.6], ['65s', 'call', 0.8], ['64s', 'call', 0.4],
  ['54s', 'call', 0.7], ['53s', 'call', 0.4], ['43s', 'call', 0.3],
];

// =============================================
// BTN 3-Bet vs CO Open
// =============================================
const BTN_3BET_VS_CO_ACTIONS = [
  // Value 3-bets
  ['AA', 'raise', 1.0], ['KK', 'raise', 1.0], ['QQ', 'raise', 1.0],
  ['JJ', 'raise', 0.7], ['TT', 'raise', 0.3],
  ['AKs', 'raise', 1.0], ['AKo', 'raise', 1.0],
  ['AQs', 'raise', 0.8], ['AQo', 'raise', 0.5],
  ['AJs', 'raise', 0.4],
  // Bluff 3-bets (blockers + equity)
  ['A5s', 'raise', 0.7], ['A4s', 'raise', 0.6], ['A3s', 'raise', 0.5],
  ['K9s', 'raise', 0.3], ['K8s', 'raise', 0.3],
  ['Q9s', 'raise', 0.3], ['J9s', 'raise', 0.3],
  ['T9s', 'raise', 0.2], ['98s', 'raise', 0.2],
  // Call range
  ['JJ', 'call', 0.3], ['TT', 'call', 0.7],
  ['99', 'call', 1.0], ['88', 'call', 0.8], ['77', 'call', 0.6],
  ['AJs', 'call', 0.6], ['ATs', 'call', 1.0], ['A9s', 'call', 0.8],
  ['KQs', 'call', 1.0], ['KJs', 'call', 1.0], ['KTs', 'call', 0.8],
  ['QJs', 'call', 1.0], ['QTs', 'call', 0.9],
  ['JTs', 'call', 1.0], ['T9s', 'call', 0.8], ['98s', 'call', 0.8],
  ['KQo', 'call', 0.8], ['KJo', 'call', 0.5], ['QJo', 'call', 0.5],
  ['AQo', 'call', 0.5],
];

// =============================================
// MTT Push/Fold Ranges — Short Stack Shoves
// SOURCE: Educational approximations of Nash-style
// push/fold charts for MTT short stacks. Labeled
// 'estimated' — not exact ICM-adjusted solver output.
// =============================================

// UTG 10bb shove (6-max MTT, ~20% of hands)
const UTG_10BB_PUSH = [
  ['AA', 'raise', 1.0], ['KK', 'raise', 1.0], ['QQ', 'raise', 1.0],
  ['JJ', 'raise', 1.0], ['TT', 'raise', 1.0], ['99', 'raise', 1.0],
  ['88', 'raise', 1.0], ['77', 'raise', 1.0], ['66', 'raise', 1.0],
  ['55', 'raise', 1.0], ['44', 'raise', 0.8], ['33', 'raise', 0.6], ['22', 'raise', 0.5],
  ['AKs', 'raise', 1.0], ['AQs', 'raise', 1.0], ['AJs', 'raise', 1.0], ['ATs', 'raise', 1.0],
  ['A9s', 'raise', 1.0], ['A8s', 'raise', 1.0], ['A7s', 'raise', 0.8], ['A6s', 'raise', 0.6],
  ['A5s', 'raise', 0.8], ['A4s', 'raise', 0.6], ['A3s', 'raise', 0.5], ['A2s', 'raise', 0.4],
  ['AKo', 'raise', 1.0], ['AQo', 'raise', 1.0], ['AJo', 'raise', 1.0], ['ATo', 'raise', 0.9],
  ['A9o', 'raise', 0.5], ['KQs', 'raise', 1.0], ['KJs', 'raise', 1.0], ['KTs', 'raise', 1.0],
  ['K9s', 'raise', 0.7], ['KQo', 'raise', 0.9], ['KJo', 'raise', 0.6], ['QJs', 'raise', 1.0],
  ['QTs', 'raise', 0.8], ['JTs', 'raise', 0.7], ['T9s', 'raise', 0.4],
];

// CO 15bb shove (6-max MTT, ~16% of hands — tighter than 10bb)
const CO_15BB_PUSH = [
  ['AA', 'raise', 1.0], ['KK', 'raise', 1.0], ['QQ', 'raise', 1.0],
  ['JJ', 'raise', 1.0], ['TT', 'raise', 1.0], ['99', 'raise', 1.0],
  ['88', 'raise', 0.9], ['77', 'raise', 0.7], ['66', 'raise', 0.5], ['55', 'raise', 0.4],
  ['AKs', 'raise', 1.0], ['AQs', 'raise', 1.0], ['AJs', 'raise', 1.0], ['ATs', 'raise', 1.0],
  ['A9s', 'raise', 0.7], ['A8s', 'raise', 0.5], ['A5s', 'raise', 0.4],
  ['AKo', 'raise', 1.0], ['AQo', 'raise', 1.0], ['AJo', 'raise', 0.8], ['ATo', 'raise', 0.5],
  ['KQs', 'raise', 1.0], ['KJs', 'raise', 0.9], ['KTs', 'raise', 0.6],
  ['KQo', 'raise', 0.7], ['QJs', 'raise', 0.6], ['JTs', 'raise', 0.3],
];

// BTN 10bb shove (6-max MTT, ~38% of hands — wide due to fold equity)
const BTN_10BB_PUSH = [
  ['AA', 'raise', 1.0], ['KK', 'raise', 1.0], ['QQ', 'raise', 1.0], ['JJ', 'raise', 1.0],
  ['TT', 'raise', 1.0], ['99', 'raise', 1.0], ['88', 'raise', 1.0], ['77', 'raise', 1.0],
  ['66', 'raise', 1.0], ['55', 'raise', 1.0], ['44', 'raise', 1.0], ['33', 'raise', 1.0], ['22', 'raise', 1.0],
  ['AKs', 'raise', 1.0], ['AQs', 'raise', 1.0], ['AJs', 'raise', 1.0], ['ATs', 'raise', 1.0],
  ['A9s', 'raise', 1.0], ['A8s', 'raise', 1.0], ['A7s', 'raise', 1.0], ['A6s', 'raise', 1.0],
  ['A5s', 'raise', 1.0], ['A4s', 'raise', 1.0], ['A3s', 'raise', 1.0], ['A2s', 'raise', 1.0],
  ['AKo', 'raise', 1.0], ['AQo', 'raise', 1.0], ['AJo', 'raise', 1.0], ['ATo', 'raise', 1.0],
  ['A9o', 'raise', 1.0], ['A8o', 'raise', 0.9], ['A7o', 'raise', 0.7], ['A6o', 'raise', 0.5],
  ['A5o', 'raise', 0.6], ['A4o', 'raise', 0.4], ['A3o', 'raise', 0.3], ['A2o', 'raise', 0.3],
  ['KQs', 'raise', 1.0], ['KJs', 'raise', 1.0], ['KTs', 'raise', 1.0], ['K9s', 'raise', 1.0],
  ['K8s', 'raise', 0.8], ['K7s', 'raise', 0.6], ['K6s', 'raise', 0.5], ['K5s', 'raise', 0.4],
  ['KQo', 'raise', 1.0], ['KJo', 'raise', 1.0], ['KTo', 'raise', 0.9], ['K9o', 'raise', 0.6],
  ['QJs', 'raise', 1.0], ['QTs', 'raise', 1.0], ['Q9s', 'raise', 0.8], ['Q8s', 'raise', 0.5],
  ['QJo', 'raise', 0.9], ['QTo', 'raise', 0.6],
  ['JTs', 'raise', 1.0], ['J9s', 'raise', 0.7], ['JTo', 'raise', 0.5],
  ['T9s', 'raise', 0.8], ['98s', 'raise', 0.6], ['87s', 'raise', 0.5], ['76s', 'raise', 0.4], ['65s', 'raise', 0.3],
];

// SB 10bb shove vs BB only (6-max MTT, ~50% of hands)
const SB_10BB_PUSH = [
  ['AA', 'raise', 1.0], ['KK', 'raise', 1.0], ['QQ', 'raise', 1.0], ['JJ', 'raise', 1.0],
  ['TT', 'raise', 1.0], ['99', 'raise', 1.0], ['88', 'raise', 1.0], ['77', 'raise', 1.0],
  ['66', 'raise', 1.0], ['55', 'raise', 1.0], ['44', 'raise', 1.0], ['33', 'raise', 1.0], ['22', 'raise', 1.0],
  ['AKs', 'raise', 1.0], ['AQs', 'raise', 1.0], ['AJs', 'raise', 1.0], ['ATs', 'raise', 1.0],
  ['A9s', 'raise', 1.0], ['A8s', 'raise', 1.0], ['A7s', 'raise', 1.0], ['A6s', 'raise', 1.0],
  ['A5s', 'raise', 1.0], ['A4s', 'raise', 1.0], ['A3s', 'raise', 1.0], ['A2s', 'raise', 1.0],
  ['AKo', 'raise', 1.0], ['AQo', 'raise', 1.0], ['AJo', 'raise', 1.0], ['ATo', 'raise', 1.0],
  ['A9o', 'raise', 1.0], ['A8o', 'raise', 1.0], ['A7o', 'raise', 1.0], ['A6o', 'raise', 1.0],
  ['A5o', 'raise', 1.0], ['A4o', 'raise', 1.0], ['A3o', 'raise', 0.9], ['A2o', 'raise', 0.9],
  ['KQs', 'raise', 1.0], ['KJs', 'raise', 1.0], ['KTs', 'raise', 1.0], ['K9s', 'raise', 1.0],
  ['K8s', 'raise', 1.0], ['K7s', 'raise', 1.0], ['K6s', 'raise', 0.9], ['K5s', 'raise', 0.8],
  ['K4s', 'raise', 0.7], ['K3s', 'raise', 0.6], ['K2s', 'raise', 0.6],
  ['KQo', 'raise', 1.0], ['KJo', 'raise', 1.0], ['KTo', 'raise', 1.0], ['K9o', 'raise', 0.9],
  ['K8o', 'raise', 0.7], ['K7o', 'raise', 0.5],
  ['QJs', 'raise', 1.0], ['QTs', 'raise', 1.0], ['Q9s', 'raise', 1.0], ['Q8s', 'raise', 0.9],
  ['Q7s', 'raise', 0.6], ['QJo', 'raise', 1.0], ['QTo', 'raise', 0.9], ['Q9o', 'raise', 0.6],
  ['JTs', 'raise', 1.0], ['J9s', 'raise', 1.0], ['J8s', 'raise', 0.7], ['JTo', 'raise', 0.9], ['J9o', 'raise', 0.5],
  ['T9s', 'raise', 1.0], ['T8s', 'raise', 0.8], ['T9o', 'raise', 0.5],
  ['98s', 'raise', 0.9], ['97s', 'raise', 0.6], ['87s', 'raise', 0.8], ['76s', 'raise', 0.7],
  ['65s', 'raise', 0.6], ['54s', 'raise', 0.5],
];

// =============================================
// BTN Isolating a Limper (Cash, 100bb, 6-max)
// One player limps from MP, action to BTN.
// Isolation ranges are wider than RFI since hero
// gets to act against a single weak(er) range with
// good position and no other players left to act
// behind (blinds still need to fold/call, but the
// limper's range is capped).
// =============================================
const BTN_VS_LIMP_ACTIONS = [
  // Pocket pairs — isolate wide, limp-call small pairs only when deep implied odds
  ['AA', 'raise', 1.0], ['KK', 'raise', 1.0], ['QQ', 'raise', 1.0], ['JJ', 'raise', 1.0],
  ['TT', 'raise', 1.0], ['99', 'raise', 1.0], ['88', 'raise', 1.0], ['77', 'raise', 1.0],
  ['66', 'raise', 0.8], ['55', 'raise', 0.7], ['44', 'raise', 0.6], ['33', 'raise', 0.5], ['22', 'raise', 0.5],
  // Suited aces
  ['AKs', 'raise', 1.0], ['AQs', 'raise', 1.0], ['AJs', 'raise', 1.0], ['ATs', 'raise', 1.0],
  ['A9s', 'raise', 1.0], ['A8s', 'raise', 1.0], ['A7s', 'raise', 0.9], ['A6s', 'raise', 0.8],
  ['A5s', 'raise', 0.9], ['A4s', 'raise', 0.7], ['A3s', 'raise', 0.6], ['A2s', 'raise', 0.6],
  // Offsuit aces
  ['AKo', 'raise', 1.0], ['AQo', 'raise', 1.0], ['AJo', 'raise', 1.0], ['ATo', 'raise', 0.9],
  ['A9o', 'raise', 0.6], ['A8o', 'raise', 0.4],
  // Kings
  ['KQs', 'raise', 1.0], ['KJs', 'raise', 1.0], ['KTs', 'raise', 1.0], ['K9s', 'raise', 0.9],
  ['K8s', 'raise', 0.6], ['K7s', 'raise', 0.4],
  ['KQo', 'raise', 1.0], ['KJo', 'raise', 0.9], ['KTo', 'raise', 0.6],
  // Queens, Jacks
  ['QJs', 'raise', 1.0], ['QTs', 'raise', 1.0], ['Q9s', 'raise', 0.8], ['Q8s', 'raise', 0.5],
  ['QJo', 'raise', 0.8], ['QTo', 'raise', 0.5],
  ['JTs', 'raise', 1.0], ['J9s', 'raise', 0.8], ['J8s', 'raise', 0.5],
  ['JTo', 'raise', 0.5],
  // Suited connectors / one-gappers (good vs capped limp range, isolate for value+playability)
  ['T9s', 'raise', 0.9], ['T8s', 'raise', 0.6],
  ['98s', 'raise', 0.8], ['97s', 'raise', 0.4],
  ['87s', 'raise', 0.7], ['86s', 'raise', 0.4],
  ['76s', 'raise', 0.6], ['75s', 'raise', 0.3],
  ['65s', 'raise', 0.5], ['54s', 'raise', 0.4],
  // Limp-call (overcall) with speculative hands when isolating isn't ideal — small pairs/weaker offsuit
  ['66', 'call', 0.2], ['55', 'call', 0.3], ['44', 'call', 0.4], ['33', 'call', 0.5], ['22', 'call', 0.5],
  ['T9o', 'call', 0.3], ['98o', 'call', 0.2],
];

// =============================================
// SB Isolating a Limper (Cash, 100bb, 6-max)
// SB acting after a single MP limper, with BB still
// to act behind — slightly tighter than BTN since
// position is worse and BB can still wake up.
// =============================================
const SB_VS_LIMP_ACTIONS = [
  ['AA', 'raise', 1.0], ['KK', 'raise', 1.0], ['QQ', 'raise', 1.0], ['JJ', 'raise', 1.0],
  ['TT', 'raise', 1.0], ['99', 'raise', 0.9], ['88', 'raise', 0.8], ['77', 'raise', 0.6],
  ['66', 'raise', 0.4], ['55', 'raise', 0.3],
  ['AKs', 'raise', 1.0], ['AQs', 'raise', 1.0], ['AJs', 'raise', 1.0], ['ATs', 'raise', 0.9],
  ['A9s', 'raise', 0.7], ['A8s', 'raise', 0.5], ['A5s', 'raise', 0.5],
  ['AKo', 'raise', 1.0], ['AQo', 'raise', 1.0], ['AJo', 'raise', 0.8], ['ATo', 'raise', 0.5],
  ['KQs', 'raise', 1.0], ['KJs', 'raise', 0.9], ['KTs', 'raise', 0.7],
  ['KQo', 'raise', 0.8], ['KJo', 'raise', 0.5],
  ['QJs', 'raise', 0.9], ['QTs', 'raise', 0.6],
  ['JTs', 'raise', 0.7], ['T9s', 'raise', 0.5],
  ['98s', 'raise', 0.4], ['87s', 'raise', 0.3],
  // Limp-call with small pairs / speculative suited hands
  ['44', 'call', 0.4], ['33', 'call', 0.5], ['22', 'call', 0.5],
  ['76s', 'call', 0.3], ['65s', 'call', 0.3], ['54s', 'call', 0.2],
];

// =============================================
// BB Facing a Single Limper (Cash, 100bb, 6-max)
// Closing the action with a free/cheap option to see
// a flop. Wide check-back range, but BB can also raise
// (isolate) strong hands for value since the limper's
// range is capped and dead money is in the pot.
// =============================================
const BB_VS_LIMP_ACTIONS = [
  // Value raise / isolate
  ['AA', 'raise', 1.0], ['KK', 'raise', 1.0], ['QQ', 'raise', 1.0], ['JJ', 'raise', 0.8],
  ['AKs', 'raise', 1.0], ['AKo', 'raise', 1.0], ['AQs', 'raise', 0.7], ['AQo', 'raise', 0.4],
  ['KQs', 'raise', 0.3],
  // Everything else: check and realize equity for free (or call to keep range wide pre-flop, functionally a check since BB owes nothing extra)
  ['JJ', 'check', 0.2], ['TT', 'check', 1.0], ['99', 'check', 1.0], ['88', 'check', 1.0],
  ['77', 'check', 1.0], ['66', 'check', 1.0], ['55', 'check', 1.0], ['44', 'check', 1.0],
  ['33', 'check', 1.0], ['22', 'check', 1.0],
  ['AQs', 'check', 0.3], ['AQo', 'check', 0.6], ['AJs', 'check', 1.0], ['ATs', 'check', 1.0],
  ['A9s', 'check', 1.0], ['A8s', 'check', 1.0], ['A7s', 'check', 1.0], ['A6s', 'check', 1.0],
  ['A5s', 'check', 1.0], ['A4s', 'check', 1.0], ['A3s', 'check', 1.0], ['A2s', 'check', 1.0],
  ['AJo', 'check', 1.0], ['ATo', 'check', 1.0], ['A9o', 'check', 1.0], ['A8o', 'check', 1.0],
  ['A7o', 'check', 1.0], ['A6o', 'check', 1.0], ['A5o', 'check', 1.0], ['A4o', 'check', 1.0],
  ['A3o', 'check', 1.0], ['A2o', 'check', 1.0],
  ['KQs', 'check', 0.7], ['KQo', 'check', 1.0], ['KJs', 'check', 1.0], ['KTs', 'check', 1.0],
  ['K9s', 'check', 1.0], ['K8s', 'check', 1.0], ['K7s', 'check', 1.0], ['K6s', 'check', 1.0],
  ['K5s', 'check', 1.0], ['K4s', 'check', 1.0], ['K3s', 'check', 1.0], ['K2s', 'check', 1.0],
  ['KJo', 'check', 1.0], ['KTo', 'check', 1.0], ['K9o', 'check', 1.0],
  ['QJs', 'check', 1.0], ['QTs', 'check', 1.0], ['Q9s', 'check', 1.0], ['Q8s', 'check', 1.0],
  ['Q7s', 'check', 1.0], ['Q6s', 'check', 1.0], ['QJo', 'check', 1.0], ['QTo', 'check', 1.0],
  ['JTs', 'check', 1.0], ['J9s', 'check', 1.0], ['J8s', 'check', 1.0], ['J7s', 'check', 1.0],
  ['JTo', 'check', 1.0],
  ['T9s', 'check', 1.0], ['T8s', 'check', 1.0], ['T7s', 'check', 1.0], ['T9o', 'check', 1.0],
  ['98s', 'check', 1.0], ['97s', 'check', 1.0], ['96s', 'check', 1.0],
  ['87s', 'check', 1.0], ['86s', 'check', 1.0], ['85s', 'check', 1.0],
  ['76s', 'check', 1.0], ['75s', 'check', 1.0], ['65s', 'check', 1.0], ['64s', 'check', 1.0],
  ['54s', 'check', 1.0], ['53s', 'check', 1.0], ['43s', 'check', 1.0],
];

// =============================================
// vs Open-Raise — expanded coverage beyond BB vs BTN
// CO facing a UTG open, BTN facing a UTG open, SB facing a BTN open
// =============================================
const CO_VS_UTG_OPEN_ACTIONS = [
  ['AA', 'raise', 1.0], ['KK', 'raise', 1.0], ['QQ', 'raise', 1.0], ['JJ', 'raise', 0.6],
  ['AKs', 'raise', 1.0], ['AKo', 'raise', 0.9], ['AQs', 'raise', 0.6],
  ['JJ', 'call', 0.4], ['TT', 'call', 1.0], ['99', 'call', 0.8], ['88', 'call', 0.6], ['77', 'call', 0.4],
  ['AKo', 'call', 0.1], ['AQs', 'call', 0.4], ['AQo', 'call', 0.6],
  ['AJs', 'call', 0.8], ['ATs', 'call', 0.6], ['KQs', 'call', 0.7], ['KJs', 'call', 0.5],
  ['QJs', 'call', 0.5], ['JTs', 'call', 0.4],
];

const BTN_VS_UTG_OPEN_ACTIONS = [
  ['AA', 'raise', 1.0], ['KK', 'raise', 1.0], ['QQ', 'raise', 1.0], ['JJ', 'raise', 0.5],
  ['AKs', 'raise', 1.0], ['AKo', 'raise', 0.8], ['AQs', 'raise', 0.5], ['A5s', 'raise', 0.3],
  ['JJ', 'call', 0.5], ['TT', 'call', 1.0], ['99', 'call', 1.0], ['88', 'call', 0.8],
  ['77', 'call', 0.7], ['66', 'call', 0.5], ['55', 'call', 0.4],
  ['AQs', 'call', 0.5], ['AQo', 'call', 0.7], ['AJs', 'call', 1.0], ['ATs', 'call', 0.9],
  ['A9s', 'call', 0.5], ['KQs', 'call', 1.0], ['KJs', 'call', 0.8], ['KTs', 'call', 0.6],
  ['QJs', 'call', 0.8], ['QTs', 'call', 0.5], ['JTs', 'call', 0.7], ['T9s', 'call', 0.4],
  ['KQo', 'call', 0.5], ['AJo', 'call', 0.4],
];

const SB_VS_BTN_OPEN_ACTIONS = [
  ['AA', 'raise', 1.0], ['KK', 'raise', 1.0], ['QQ', 'raise', 1.0], ['JJ', 'raise', 0.7],
  ['AKs', 'raise', 1.0], ['AKo', 'raise', 1.0], ['AQs', 'raise', 0.7], ['AQo', 'raise', 0.3],
  ['A5s', 'raise', 0.4], ['A4s', 'raise', 0.3], ['K9s', 'raise', 0.2],
  ['JJ', 'call', 0.3], ['TT', 'call', 0.8], ['99', 'call', 0.6], ['88', 'call', 0.4],
  ['AQs', 'call', 0.3], ['AJs', 'call', 0.6], ['ATs', 'call', 0.5],
  ['KQs', 'call', 0.6], ['KJs', 'call', 0.4], ['QJs', 'call', 0.3],
];

// =============================================
// vs 4-Bet — Hero 3-bet, was 4-bet, must decide
// BTN 3-bet vs CO open, CO 4-bets back
// =============================================
const BTN_VS_4BET_ACTIONS = [
  // Continue (call or all-in/5-bet) with the strongest part of the 3-betting range
  ['AA', 'raise', 1.0], ['KK', 'raise', 0.8], ['QQ', 'raise', 0.3],
  ['KK', 'call', 0.2], ['QQ', 'call', 0.5], ['JJ', 'call', 0.2],
  ['AKs', 'call', 0.8], ['AKo', 'call', 0.6],
  // Fold the rest of the 3-bet bluff range — it was bluffing, no equity to continue vs a 4-bet
  ['QQ', 'fold', 0.2], ['JJ', 'fold', 0.8], ['TT', 'fold', 1.0],
  ['AKs', 'fold', 0.2], ['AKo', 'fold', 0.4],
  ['AQs', 'fold', 1.0], ['AQo', 'fold', 1.0], ['AJs', 'fold', 1.0],
  ['A5s', 'fold', 1.0], ['A4s', 'fold', 1.0], ['A3s', 'fold', 1.0],
  ['K9s', 'fold', 1.0], ['K8s', 'fold', 1.0],
  ['Q9s', 'fold', 1.0], ['J9s', 'fold', 1.0], ['T9s', 'fold', 1.0], ['98s', 'fold', 1.0],
];

function buildOpenFacingRange(id, position, facingPosition, actions, stackBB = 100, openSizeBB = 2.5) {
  const rangeActions = [];
  for (const [combo, action, frequency] of actions) {
    if (frequency > 0) rangeActions.push({ hand_combo: combo, action, frequency, ev_bb: null });
  }
  return {
    id,
    game_type: 'cash',
    format: '6max',
    stack_depth_bb: stackBB,
    position_hero: position,
    action_type: 'vs_open',
    facing_position: facingPosition,
    raise_size_bb: openSizeBB,
    source_type: 'imported_chart',
    source_name: 'GTO Drill Coach Training Ranges v1.0',
    accuracy_level: 'medium',
    notes: `Facing a ${facingPosition} open from ${position}. Sample training range for 100bb 6-max cash. Not rake-adjusted.`,
    actions: rangeActions,
  };
}

function buildLimpFacingRange(id, position, actions, limperCount = 1, stackBB = 100) {
  const rangeActions = [];
  for (const [combo, action, frequency] of actions) {
    if (frequency > 0) rangeActions.push({ hand_combo: combo, action, frequency, ev_bb: null });
  }
  return {
    id,
    game_type: 'cash',
    format: '6max',
    stack_depth_bb: stackBB,
    position_hero: position,
    action_type: 'vs_limp',
    facing_position: null,
    source_type: 'imported_chart',
    source_name: 'GTO Drill Coach Training Ranges v1.0',
    accuracy_level: 'medium',
    notes: `${limperCount} player${limperCount > 1 ? 's' : ''} limped in front of you. Isolate-raise for value/equity or take a cheap flop in position. Sample training range, not rake-adjusted.`,
    actions: rangeActions,
  };
}

function buildVs4BetRange(id, position, facingPosition, actions, stackBB = 100) {
  const rangeActions = [];
  for (const [combo, action, frequency] of actions) {
    if (frequency > 0) rangeActions.push({ hand_combo: combo, action, frequency, ev_bb: null });
  }
  return {
    id,
    game_type: 'cash',
    format: '6max',
    stack_depth_bb: stackBB,
    position_hero: position,
    action_type: 'vs_four_bet',
    facing_position: facingPosition,
    source_type: 'imported_chart',
    source_name: 'GTO Drill Coach Training Ranges v1.0',
    accuracy_level: 'medium',
    notes: `You 3-bet, ${facingPosition} 4-bet back. Continuing range is narrow — most 3-bet bluffs give up here. Sample training range, not rake-adjusted.`,
    actions: rangeActions,
  };
}

// =============================================
// MTT — Facing a Limper or facing a Raise at short stack
// At 10-15bb, facing any limp or open usually collapses
// to push/fold too, but the *range* differs from the
// blind-vs-blind push charts since there's already
// money/action in front of you signaling strength.
// =============================================

// BTN 12bb facing a single UTG/MP limp — punish with a wide shove (limper is capped, fold equity high)
const BTN_VS_LIMP_12BB_PUSH = [
  ['AA', 'raise', 1.0], ['KK', 'raise', 1.0], ['QQ', 'raise', 1.0], ['JJ', 'raise', 1.0],
  ['TT', 'raise', 1.0], ['99', 'raise', 1.0], ['88', 'raise', 1.0], ['77', 'raise', 0.8],
  ['66', 'raise', 0.6], ['55', 'raise', 0.5], ['44', 'raise', 0.4], ['33', 'raise', 0.3], ['22', 'raise', 0.3],
  ['AKs', 'raise', 1.0], ['AQs', 'raise', 1.0], ['AJs', 'raise', 1.0], ['ATs', 'raise', 1.0],
  ['A9s', 'raise', 0.8], ['A8s', 'raise', 0.6], ['A5s', 'raise', 0.5],
  ['AKo', 'raise', 1.0], ['AQo', 'raise', 1.0], ['AJo', 'raise', 0.8], ['ATo', 'raise', 0.5],
  ['KQs', 'raise', 1.0], ['KJs', 'raise', 0.9], ['KTs', 'raise', 0.7],
  ['KQo', 'raise', 0.7], ['QJs', 'raise', 0.6], ['JTs', 'raise', 0.5], ['T9s', 'raise', 0.3],
];

// BB 10bb facing a single-raise (min-raise/2.2bb open) from BTN — wider than vs a limp but
// tighter than pure push/fold blind-vs-blind since the raiser showed strength
const BB_VS_RAISE_10BB_PUSH = [
  ['AA', 'raise', 1.0], ['KK', 'raise', 1.0], ['QQ', 'raise', 1.0], ['JJ', 'raise', 1.0],
  ['TT', 'raise', 1.0], ['99', 'raise', 0.9], ['88', 'raise', 0.7], ['77', 'raise', 0.5],
  ['66', 'raise', 0.4], ['55', 'raise', 0.3],
  ['AKs', 'raise', 1.0], ['AQs', 'raise', 1.0], ['AJs', 'raise', 0.9], ['ATs', 'raise', 0.8],
  ['A9s', 'raise', 0.6], ['A5s', 'raise', 0.4],
  ['AKo', 'raise', 1.0], ['AQo', 'raise', 0.9], ['AJo', 'raise', 0.6], ['ATo', 'raise', 0.4],
  ['KQs', 'raise', 0.8], ['KJs', 'raise', 0.6], ['KTs', 'raise', 0.4],
  ['KQo', 'raise', 0.5], ['QJs', 'raise', 0.4], ['JTs', 'raise', 0.3],
];

function buildPushFoldRange(
  id,
  position,
  stackBB,
  actions,
  facingPosition
) {
  const rangeActions = [];
  for (const [combo, action, frequency] of actions) {
    if (frequency > 0) {
      rangeActions.push({
        hand_combo: combo,
        action: 'allin',
        frequency,
        ev_bb: null,
      });
    }
  }

  return {
    id,
    game_type: 'mtt',
    format: '6max',
    stack_depth_bb: stackBB,
    position_hero: position,
    action_type: 'push_fold',
    facing_position: facingPosition,
    source_type: 'estimated',
    source_name: 'GTO Drill Coach MTT Push/Fold Charts v1.0',
    accuracy_level: 'low',
    notes: `Educational approximation of Nash-style push/fold ranges at ${stackBB}bb. Not ICM-adjusted — actual ranges tighten near the bubble and at final tables.`,
    actions: rangeActions,
  };
}

const MTT_PUSH_FOLD_RANGES = [
  buildPushFoldRange('utg-push-10bb', 'UTG', 10, UTG_10BB_PUSH),
  buildPushFoldRange('co-push-15bb', 'CO', 15, CO_15BB_PUSH),
  buildPushFoldRange('btn-push-10bb', 'BTN', 10, BTN_10BB_PUSH),
  buildPushFoldRange('sb-push-10bb', 'SB', 10, SB_10BB_PUSH, 'BB'),
];

// MTT spots facing prior action (limp or raise) rather than blind-vs-blind
function buildMTTFacingRange(id, position, stackBB, actions, facingType, notes) {
  const rangeActions = [];
  for (const [combo, action, frequency] of actions) {
    if (frequency > 0) rangeActions.push({ hand_combo: combo, action: 'allin', frequency, ev_bb: null });
  }
  return {
    id,
    game_type: 'mtt',
    format: '6max',
    stack_depth_bb: stackBB,
    position_hero: position,
    action_type: 'push_fold',
    facing_action: facingType,
    source_type: 'estimated',
    source_name: 'GTO Drill Coach MTT Push/Fold Charts v1.0',
    accuracy_level: 'low',
    notes,
    actions: rangeActions,
  };
}

const MTT_VS_LIMP_RANGES = [
  buildMTTFacingRange(
    'btn-vs-limp-push-12bb', 'BTN', 12, BTN_VS_LIMP_12BB_PUSH, 'limp',
    'A player limped in front of you at 12bb effective. Limpers are capped — punish with a wide shove. Educational approximation, not ICM-adjusted.'
  ),
];

const MTT_VS_RAISE_RANGES = [
  buildMTTFacingRange(
    'bb-vs-raise-push-10bb', 'BB', 10, BB_VS_RAISE_10BB_PUSH, 'raise',
    'BTN min-raised to 2.2bb and it folded to you in the BB at 10bb effective. Tighter than a pure blind-vs-blind push since the raiser showed strength. Educational approximation, not ICM-adjusted.'
  ),
];

// Helper to build PreflopRange objects
function buildRange(
  id,
  position,
  actionType,
  actions,
  facingPosition
) {
  const rangeActions = [];

  for (const [combo, action, frequency] of actions) {
    if (frequency > 0) {
      rangeActions.push({
        hand_combo: combo,
        action: action,
        frequency,
        ev_bb: null,
      });
    }
  }

  return {
    id,
    game_type: 'cash',
    format: '6max',
    stack_depth_bb: 100,
    position_hero: position,
    action_type: actionType,
    facing_position: facingPosition,
    raise_size_bb: actionType === 'rfi' ? 2.5 : undefined,
    source_type: 'imported_chart',
    source_name: 'GTO Drill Coach Training Ranges v1.0',
    accuracy_level: 'medium',
    notes: 'Sample training ranges for 100bb 6-max cash game. Not rake-adjusted. Suitable for building correct preflop habits.',
    actions: rangeActions,
  };
}

const PREFLOP_RANGES = [
  buildRange('utg-rfi-100bb', 'UTG', 'rfi', UTG_RFI_ACTIONS),
  buildRange('co-rfi-100bb', 'CO', 'rfi', CO_RFI_ACTIONS),
  buildRange('btn-rfi-100bb', 'BTN', 'rfi', BTN_RFI_ACTIONS),
  buildRange('sb-rfi-100bb', 'SB', 'rfi', SB_RFI_ACTIONS),
  buildRange('bb-vs-btn-open', 'BB', 'vs_open', BB_VS_BTN_OPEN_ACTIONS, 'BTN'),
  buildRange('btn-3bet-vs-co', 'BTN', 'three_bet', BTN_3BET_VS_CO_ACTIONS, 'CO'),
];

const LIMP_RANGES = [
  buildLimpFacingRange('btn-vs-limp-100bb', 'BTN', BTN_VS_LIMP_ACTIONS, 1),
  buildLimpFacingRange('sb-vs-limp-100bb', 'SB', SB_VS_LIMP_ACTIONS, 1),
  buildLimpFacingRange('bb-vs-limp-100bb', 'BB', BB_VS_LIMP_ACTIONS, 1),
];

const OPEN_FACING_RANGES = [
  buildOpenFacingRange('co-vs-utg-open-100bb', 'CO', 'UTG', CO_VS_UTG_OPEN_ACTIONS),
  buildOpenFacingRange('btn-vs-utg-open-100bb', 'BTN', 'UTG', BTN_VS_UTG_OPEN_ACTIONS),
  buildOpenFacingRange('sb-vs-btn-open-100bb', 'SB', 'BTN', SB_VS_BTN_OPEN_ACTIONS),
];

const VS_4BET_RANGES = [
  buildVs4BetRange('btn-vs-4bet-from-co', 'BTN', 'CO', BTN_VS_4BET_ACTIONS),
];

// Combined lookup across all range types
const ALL_RANGES = [
  ...PREFLOP_RANGES,
  ...LIMP_RANGES,
  ...OPEN_FACING_RANGES,
  ...VS_4BET_RANGES,
  ...MTT_PUSH_FOLD_RANGES,
  ...MTT_VS_LIMP_RANGES,
  ...MTT_VS_RAISE_RANGES,
];

// Lookup by position + action type
function findRange(
  position,
  actionType,
  facingPosition
) {
  return ALL_RANGES.find(
    (r) =>
      r.position_hero === position &&
      r.action_type === actionType &&
      (facingPosition ? r.facing_position === facingPosition : true)
  );
}

// Returns ALL matching ranges (useful when multiple ranges share the same
// position+action_type but differ by facing_position, e.g. several vs_open
// ranges for different raisers).
function findRanges(actionType, filterFn) {
  return ALL_RANGES.filter((r) => r.action_type === actionType && (!filterFn || filterFn(r)));
}

function findRangeById(id) {
  return ALL_RANGES.find((r) => r.id === id);
}

// Get action for a specific hand combo from a range
function getComboAction(
  range,
  combo
) {
  const entry = range.actions.find((a) => a.hand_combo === combo);
  if (!entry) return { action: 'fold', frequency: 1.0 };
  return { action: entry.action, frequency: entry.frequency };
}

// Generate a random combo from the active range's hands
// ── Smart Drill Selector ─────────────────────────────────────────────────
// This is the core learning engine. Instead of randomly picking any action
// with ≥30% frequency (which heavily biases toward obvious high-frequency
// "always raise" spots), this engine deliberately targets TRICKY spots
// where the correct action is non-obvious — exactly what GTO Wizard focuses
// on for effective training.
//
// A "tricky spot" is defined as any combo where:
//  a) The correct action isn't 100% obvious (frequency < 0.85)
//  b) A common mistake action exists (e.g. many players always raise/call)
//  c) Or the correct action is FOLD/CHECK for a seemingly decent hand
//
// The session balancer ensures fold/check/3bet/4bet all appear, not just raise.

function getRandomComboFromRange(range, sessionActionCounts) {
  const actions = range.actions;
  if (!actions || actions.length === 0) return { combo: 'AKs', correctAction: 'raise', frequency: 1.0, trickiness: 0 };

  // Group actions by combo to understand the full per-combo picture
  const byCombo = {};
  for (const a of actions) {
    if (!byCombo[a.hand_combo]) byCombo[a.hand_combo] = [];
    byCombo[a.hand_combo].push(a);
  }

  // Score each combo by "training value" — how much it teaches
  const scoredCombos = [];
  for (const [combo, comboActions] of Object.entries(byCombo)) {
    // Find the dominant (highest frequency) action
    const dominant = comboActions.reduce((best, a) => a.frequency > best.frequency ? a : best, comboActions[0]);
    const domFreq = dominant.frequency;

    // Trickiness: lower dominant frequency = trickier spot
    // 1.0 (pure raise) = trickiness 0, 0.5 (mixed) = trickiness 1.0
    const trickiness = Math.max(0, (1 - domFreq) * 2.0);

    // Trap score: is the "obvious wrong" action tempting?
    // e.g. a hand that LOOKS like a raise but should be folded = very high trap
    const actionSet = new Set(comboActions.map((a) => a.action));
    const isTrap = dominant.action === 'fold' || dominant.action === 'check';
    const trapBonus = isTrap ? 0.8 : 0;

    // Boring penalty: obvious pure raises (AA, KK, premium hands)
    const premiumPairs = ['AA', 'KK', 'QQ', 'JJ', 'AKs', 'AKo'];
    const isBoring = premiumPairs.includes(combo) && domFreq > 0.9 && dominant.action === 'raise';
    if (isBoring) continue; // always skip pure premium "easy" hands

    // Very low frequency hands (pure folds) are also not useful training
    if (domFreq < 0.15) continue;

    const trainingScore = trickiness + trapBonus + (Math.random() * 0.3); // small randomness
    scoredCombos.push({ combo, dominant, trickiness, trainingScore });
  }

  if (scoredCombos.length === 0) {
    // Fallback: any action
    const a = actions[Math.floor(Math.random() * actions.length)];
    return { combo: a.hand_combo, correctAction: a.action, frequency: a.frequency, trickiness: 0 };
  }

  // Session balancing: if we've drilled too many raises, boost non-raise spots
  const actionCounts = sessionActionCounts || {};
  const totalDrilled = Object.values(actionCounts).reduce((s, v) => s + v, 0);
  const raiseCount = (actionCounts.raise || 0) + (actionCounts.allin || 0);
  const overRaised = totalDrilled > 3 && raiseCount / totalDrilled > 0.6;
  const underFolded = totalDrilled > 3 && (actionCounts.fold || 0) / totalDrilled < 0.2;

  let candidates = scoredCombos;
  if (overRaised || underFolded) {
    // Prefer fold/check/call spots
    const nonRaise = scoredCombos.filter((c) => c.dominant.action !== 'raise' && c.dominant.action !== 'allin');
    if (nonRaise.length > 0) candidates = nonRaise;
  }

  // Sort by training score descending, take top 40% and pick randomly from them
  candidates.sort((a, b) => b.trainingScore - a.trainingScore);
  const topCount = Math.max(1, Math.ceil(candidates.length * 0.4));
  const pool = candidates.slice(0, topCount);
  const pick = pool[Math.floor(Math.random() * pool.length)];

  return {
    combo: pick.combo,
    correctAction: pick.dominant.action,
    frequency: pick.dominant.frequency,
    trickiness: pick.trickiness,
    allActions: byCombo[pick.combo], // full action data for this combo for EV display
  };
}

// Get a single "daily quiz" spot — deliberately picks the trickiest available
// combo across ALL ranges. This is the "Daily Dose of GTO" equivalent.
function getDailyQuizSpot() {
  // Pick from a curated list of known tricky spots
  const trickyRangeIds = [
    'bb-vs-btn-open',       // BB defense is famously tricky (wide range, many fold/call/3bet decisions)
    'btn-vs-4bet-from-co',  // vs 4-bet: most players over-call or over-fold
    'sb-vs-limp-100bb',     // SB vs limp: raise/check is non-obvious
    'co-vs-utg-open-100bb', // CO vs UTG: tight spot, many mistakenly call too wide
    'sb-vs-btn-open-100bb', // SB OOP vs BTN: very easy to make mistakes
    'btn-3bet-vs-co',       // 3-bet range: many players under-3bet or over-3bet
  ];
  const rangeId = trickyRangeIds[Math.floor(Math.random() * trickyRangeIds.length)];
  const range = findRangeById(rangeId);
  if (!range) return null;
  // Force high-trickiness selection
  const spot = getRandomComboFromRange(range, { raise: 5, fold: 5 }); // balanced context forces trickier picks
  return { range, ...spot };
}

// Get all action options for a combo (for EV comparison display)
function getComboAllActions(rangeId, combo) {
  const range = findRangeById(rangeId);
  if (!range) return [];
  return range.actions.filter((a) => a.hand_combo === combo);
}


// ═══════════════════════════════════════════════════════════════════════════
// PLO (Pot-Limit Omaha) DATA
// ═══════════════════════════════════════════════════════════════════════════

const PLO_CASH_HANDS = [
  // ── PREMIUM RUNDOWNS ──
  {
    id: 'plo-akqj-ds', label: 'AKQJ double-suited', display_cards: ['As', 'Kh', 'Qs', 'Jh'],
    category: 'premium_rundown', hand_strength: 5, nut_potential: 5, connectivity: 5,
    is_double_suited: true, is_single_suited: false,
    key_concept: 'Best rundown family. Double-suited adds massive flush equity. Open all positions, 3-bet BTN/CO.',
    common_mistake: 'Treating as a calling hand — this 3-bets aggressively from position.',
  },
  {
    id: 'plo-akqj-ss', label: 'AKQJ single-suited', display_cards: ['As', 'Kd', 'Qs', 'Jc'],
    category: 'premium_rundown', hand_strength: 4, nut_potential: 4, connectivity: 5,
    is_double_suited: false, is_single_suited: true,
    key_concept: 'Still premium, but loses equity vs double-suited. Open all positions, 3-bet selectively.',
    common_mistake: 'Overvaluing single-suited vs double-suited. The suit difference is enormous in PLO.',
  },
  {
    id: 'plo-akqj-us', label: 'AKQJ rainbow', display_cards: ['Ac', 'Kd', 'Qh', 'Js'],
    category: 'premium_rundown', hand_strength: 3, nut_potential: 3, connectivity: 5,
    is_double_suited: false, is_single_suited: false,
    key_concept: 'Same ranks, rainbow = much less valuable. Open BTN/CO/SB only. NOT a 3-bet without suits.',
    common_mistake: 'Over-3-betting rainbow Broadway. Without flush equity, hand is marginal vs 3-bets.',
  },
  {
    id: 'plo-kqjt-ds', label: 'KQJT double-suited', display_cards: ['Ks', 'Qh', 'Js', 'Th'],
    category: 'premium_rundown', hand_strength: 5, nut_potential: 5, connectivity: 5,
    is_double_suited: true, is_single_suited: false,
    key_concept: 'Second-best rundown. Open all positions, 3-bet from BTN/CO/SB. Dominates other rundowns.',
    common_mistake: 'Calling 3-bets too passively — KQJT DS should be 3-betting back from position.',
  },
  {
    id: 'plo-qjt9-ds', label: 'QJT9 double-suited', display_cards: ['Qs', 'Jh', 'Ts', '9h'],
    category: 'premium_rundown', hand_strength: 4, nut_potential: 4, connectivity: 5,
    is_double_suited: true, is_single_suited: false,
    key_concept: 'Strong in position. Huge wrap and flush potential. 3-bet from BTN/CO.',
    common_mistake: 'Playing OOP without initiative. This hand needs position to realize equity.',
  },
  // ── MEDIUM RUNDOWNS ──
  {
    id: 'plo-jt98-ds', label: 'JT98 double-suited', display_cards: ['Js', 'Th', '9s', '8h'],
    category: 'medium_rundown', hand_strength: 4, nut_potential: 4, connectivity: 5,
    is_double_suited: true, is_single_suited: false,
    key_concept: 'Strong double-suited. Open all positions, 3-bet from BTN. Makes huge wraps and nut flushes.',
    common_mistake: 'Folding vs a raise — this calls from CO/BTN comfortably and 3-bets with initiative.',
  },
  {
    id: 'plo-t987-ds', label: 'T987 double-suited', display_cards: ['Ts', '9h', '8s', '7h'],
    category: 'medium_rundown', hand_strength: 3, nut_potential: 3, connectivity: 5,
    is_double_suited: true, is_single_suited: false,
    key_concept: 'Good double-suited middle rundown. Open BTN/CO/SB, call raises from BTN/CO.',
    common_mistake: 'Over-calling 3-bets OOP. Medium rundowns lose too much equity out of position.',
  },
  {
    id: 'plo-9876-ss', label: '9876 single-suited', display_cards: ['9s', '8c', '7s', '6d'],
    category: 'medium_rundown', hand_strength: 3, nut_potential: 2, connectivity: 5,
    is_double_suited: false, is_single_suited: true,
    key_concept: 'Marginal in position, fold OOP. Makes straights but non-nut flush draws. Open BTN/CO only.',
    common_mistake: 'Opening from UTG or calling 3-bets. Medium rundowns need position to be profitable.',
  },
  {
    id: 'plo-8765-us', label: '8765 rainbow (FOLD)', display_cards: ['8c', '7d', '6h', '5s'],
    category: 'low_rundown', hand_strength: 2, nut_potential: 1, connectivity: 5,
    is_double_suited: false, is_single_suited: false,
    key_concept: 'FOLD from all positions. Low rainbow rundown: all draws are non-nut and loses to better rundowns.',
    common_mistake: 'Calling raises with low unsuited rundowns. Looks connected but has no nut potential.',
  },
  // ── PREMIUM PAIRS ──
  {
    id: 'plo-aakk-ds', label: 'AAKK double-suited', display_cards: ['As', 'Ah', 'Ks', 'Kh'],
    category: 'premium_pair', hand_strength: 5, nut_potential: 5, connectivity: 2,
    is_double_suited: true, is_single_suited: false,
    key_concept: 'Best non-rundown PLO hand. Mandatory 3-bet/4-bet. Massive set + nut flush equity.',
    common_mistake: 'Not 3-betting aggressively. AAKK DS should 3-bet/4-bet in all spots.',
  },
  {
    id: 'plo-aakk-us', label: 'AAKK rainbow', display_cards: ['Ac', 'Ad', 'Kh', 'Ks'],
    category: 'premium_pair', hand_strength: 4, nut_potential: 3, connectivity: 2,
    is_double_suited: false, is_single_suited: false,
    key_concept: 'Still strong but dramatically weaker without suits. 3-bet from all positions.',
    common_mistake: 'Over-committing postflop. AAKK rainbow needs a set to stack off comfortably.',
  },
  {
    id: 'plo-aaqj-ds', label: 'AAQJ double-suited', display_cards: ['As', 'Ah', 'Qs', 'Jh'],
    category: 'premium_pair', hand_strength: 5, nut_potential: 5, connectivity: 3,
    is_double_suited: true, is_single_suited: false,
    key_concept: 'Excellent — aces + connectivity + two flush draws. 3-bet from any position.',
    common_mistake: 'Limping or just calling. AA with connectivity/suits is a mandatory raise.',
  },
  {
    id: 'plo-aa76-ss', label: 'AA76 single-suited ace', display_cards: ['As', 'Ad', '7s', '6c'],
    category: 'premium_pair', hand_strength: 4, nut_potential: 4, connectivity: 2,
    is_double_suited: false, is_single_suited: true,
    key_concept: 'AA with nut flush draw. 3-bet from all positions. Nut draws matter more than rank.',
    common_mistake: 'Folding or just calling with AA. Even low connectivity, nut flush ace deserves 3-bet.',
  },
  {
    id: 'plo-aa62-us', label: 'AA62 rainbow (dangler)', display_cards: ['Ac', 'Ad', '6h', '2s'],
    category: 'premium_pair', hand_strength: 3, nut_potential: 2, connectivity: 1,
    is_double_suited: false, is_single_suited: false,
    key_concept: 'Weakest AA. "Dangler" (2 adds nothing). 3-bets preflop but struggles postflop on wet boards.',
    common_mistake: 'Stacking off with bare overpair. AA62r has no redraw — fold vs heavy pressure.',
  },
  // ── BROADWAY HANDS ──
  {
    id: 'plo-akjt-ds', label: 'AKJT double-suited', display_cards: ['As', 'Kh', 'Js', 'Th'],
    category: 'broadway_high', hand_strength: 5, nut_potential: 5, connectivity: 4,
    is_double_suited: true, is_single_suited: false,
    key_concept: 'Premium — nut flush + nut straight draws. 3-bet from all positions.',
    common_mistake: 'Under-3-betting. AKJT DS is top 3% of PLO hands — play it aggressively.',
  },
  {
    id: 'plo-aqjt-ds', label: 'AQJT double-suited', display_cards: ['As', 'Qh', 'Js', 'Th'],
    category: 'broadway_high', hand_strength: 5, nut_potential: 5, connectivity: 4,
    is_double_suited: true, is_single_suited: false,
    key_concept: 'Top tier. Nut flush + broadway connectivity. 3-bet/4-bet from all positions.',
    common_mistake: 'Treating as a call hand. This is a 3-bet, not a flat.',
  },
  // ── TRAP HANDS — most important for training ──
  {
    id: 'plo-kk32-us', label: 'KK32 rainbow (TRAP)', display_cards: ['Kc', 'Kd', '3h', '2s'],
    category: 'trap_hand', hand_strength: 2, nut_potential: 1, connectivity: 1,
    is_double_suited: false, is_single_suited: false,
    key_concept: 'FOLD or reluctant call BTN only. KK without connectivity/suits is the classic PLO trap.',
    common_mistake: 'Over-valuing high pairs from NLHE instincts. KK32r has terrible nut potential.',
  },
  {
    id: 'plo-qq87-us', label: 'QQ87 rainbow (weak pair)', display_cards: ['Qc', 'Qd', '8h', '7s'],
    category: 'trap_hand', hand_strength: 2, nut_potential: 1, connectivity: 2,
    is_double_suited: false, is_single_suited: false,
    key_concept: 'FOLD from most positions. Medium pair + low connectivity + no suits = negative EV.',
    common_mistake: 'Calling raises and 3-bets. Gets dominated by connected, suited hands.',
  },
  {
    id: 'plo-jj94-us', label: 'JJ94 rainbow (trap pair)', display_cards: ['Jc', 'Jd', '9h', '4s'],
    category: 'trap_hand', hand_strength: 2, nut_potential: 1, connectivity: 2,
    is_double_suited: false, is_single_suited: false,
    key_concept: 'Marginal open BTN only. JJ with poor backup (9-4 gap) and no suits is a leak.',
    common_mistake: 'Opening UTG/CO or calling 3-bets. The 4 is a dangler — no connectivity means no straights.',
  },
  {
    id: 'plo-k985-us', label: 'K985 rainbow (disconnected)', display_cards: ['Kc', '9d', '8h', '5s'],
    category: 'trap_hand', hand_strength: 1, nut_potential: 1, connectivity: 2,
    is_double_suited: false, is_single_suited: false,
    key_concept: 'FOLD preflop always. K985 is disconnected, unsuited, and has zero nut potential.',
    common_mistake: 'Playing hands with a high card + gappy low cards. The K adds zero value here.',
  },
  {
    id: 'plo-a432-ss', label: 'A432 single-suited (low trap)', display_cards: ['As', '4c', '3s', '2d'],
    category: 'trap_hand', hand_strength: 2, nut_potential: 2, connectivity: 3,
    is_double_suited: false, is_single_suited: true,
    key_concept: 'Rarely profitable. Nut flush draw but makes the lowest straights that lose to higher wraps.',
    common_mistake: 'Thinking nut flush draw saves this hand. A432 makes wheels that get counterfeited.',
  },
];

const PLO_MTT_HANDS = [
  {
    id: 'plo-mtt-akqj-ds-20bb', label: 'AKQJ double-suited (20bb)', display_cards: ['As', 'Kh', 'Qs', 'Jh'],
    category: 'premium_rundown', hand_strength: 5, nut_potential: 5, connectivity: 5,
    is_double_suited: true, stack_bb: 20, correct_action: 'allin',
    key_concept: 'SHOVE from all positions. AKQJ DS is a mandatory all-in at 20bb MTT.',
    common_mistake: 'Min-raising instead of shoving. Just get it in — this hand flips well vs any range.',
  },
  {
    id: 'plo-mtt-qjt9-ds-15bb', label: 'QJT9 double-suited (15bb)', display_cards: ['Qs', 'Jh', 'Ts', '9h'],
    category: 'premium_rundown', hand_strength: 4, nut_potential: 4, connectivity: 5,
    is_double_suited: true, stack_bb: 15, correct_action: 'allin',
    key_concept: 'SHOVE BTN/CO/SB at 15bb. Strong rundown + two flush draws plays great all-in.',
    common_mistake: 'Just calling the big blind. Calling at 15bb with speculative hands is a trap.',
  },
  {
    id: 'plo-mtt-aakk-us-20bb', label: 'AAKK rainbow (20bb)', display_cards: ['Ac', 'Ad', 'Kh', 'Ks'],
    category: 'premium_pair', hand_strength: 4, nut_potential: 3, connectivity: 2,
    is_double_suited: false, stack_bb: 20, correct_action: 'allin',
    key_concept: 'SHOVE from all positions. AAKK even without suits has enough equity to get it in.',
    common_mistake: 'Min-raising and folding to reshove. Always shove AAKK at 20bb.',
  },
  {
    id: 'plo-mtt-kk32-us-20bb', label: 'KK32 rainbow (20bb trap)', display_cards: ['Kc', 'Kd', '3h', '2s'],
    category: 'trap_hand', hand_strength: 2, nut_potential: 1, connectivity: 1,
    is_double_suited: false, stack_bb: 20, correct_action: 'fold',
    key_concept: 'FOLD or reluctant BB call only. KK32 rainbow is dominated by strong PLO hands 60%+ of the time.',
    common_mistake: 'Shoving with KK and poor backup. KK without connectivity/suits is 40-50% vs strong PLO hands.',
  },
  {
    id: 'plo-mtt-9876-ds-12bb', label: '9876 double-suited (12bb)', display_cards: ['9s', '8h', '7s', '6h'],
    category: 'medium_rundown', hand_strength: 3, nut_potential: 3, connectivity: 5,
    is_double_suited: true, stack_bb: 12, correct_action: 'allin',
    key_concept: 'SHOVE BTN/CO at 12bb. Double-suited rundown has enough equity vs calling range.',
    common_mistake: 'Folding at 12bb. Many players fold too tight in PLO MTTs with medium rundowns.',
  },
  {
    id: 'plo-mtt-8765-us-15bb', label: '8765 rainbow (15bb trap)', display_cards: ['8c', '7d', '6h', '5s'],
    category: 'low_rundown', hand_strength: 2, nut_potential: 1, connectivity: 5,
    is_double_suited: false, stack_bb: 15, correct_action: 'fold',
    key_concept: 'FOLD from all positions. Low rainbow has terrible equity vs strong hands at any stack depth.',
    common_mistake: 'Shoving from UTG/CO with any rundown. Low rainbow rundowns are massive underdogs.',
  },
  {
    id: 'plo-mtt-aa98-ss-18bb', label: 'AA98 single-suited (18bb)', display_cards: ['As', 'Ad', '9s', '8c'],
    category: 'premium_pair', hand_strength: 4, nut_potential: 4, connectivity: 3,
    is_double_suited: false, stack_bb: 18, correct_action: 'allin',
    key_concept: 'SHOVE from all positions. AA with connectivity and nut flush draw is a mandatory all-in.',
    common_mistake: 'Just limping. At 18bb in MTT, AA98 suited should always be shoving.',
  },
  {
    id: 'plo-mtt-qq87-us-20bb', label: 'QQ87 rainbow (20bb trap)', display_cards: ['Qc', 'Qd', '8h', '7s'],
    category: 'trap_hand', hand_strength: 2, nut_potential: 1, connectivity: 2,
    is_double_suited: false, stack_bb: 20, correct_action: 'fold',
    key_concept: 'FOLD from all positions. QQ87 rainbow is dominated 55-60% by strong PLO ranges.',
    common_mistake: 'Shoving medium pairs in PLO MTTs. QQ alone doesn\'t have enough equity at 20bb.',
  },
];

// PLO drill question generator
function getPLODrillSpot(isMTT, sessionCounts) {
  const hands = isMTT ? PLO_MTT_HANDS : PLO_CASH_HANDS;
  const positions = isMTT
    ? ['UTG', 'CO', 'BTN', 'SB']
    : ['UTG', 'CO', 'BTN', 'SB'];
  const scenarios = isMTT ? ['open'] : ['open', 'vs_open'];

  // Weight trap hands and medium-strength hands higher (they teach more)
  const totalRaises = (sessionCounts && sessionCounts.allin) || 0;
  const totalFolds = (sessionCounts && sessionCounts.fold) || 0;
  const overRaising = totalRaises > 3 && totalRaises > totalFolds * 2;

  const weighted = hands.map((h) => {
    let w = h.hand_strength >= 4 ? 1 : h.hand_strength <= 2 ? 2 : 3;
    if (h.category === 'trap_hand') w = 4; // always train traps frequently
    if (overRaising && (h.category === 'trap_hand' || h.category === 'low_rundown')) w += 2;
    return { hand: h, weight: w };
  });

  const total = weighted.reduce((s, x) => s + x.weight, 0);
  let r = Math.random() * total;
  let hand = weighted[0].hand;
  for (const { hand: h, weight: w } of weighted) {
    r -= w;
    if (r <= 0) { hand = h; break; }
  }

  const position = positions[Math.floor(Math.random() * positions.length)];
  const scenario = scenarios[Math.floor(Math.random() * scenarios.length)];

  let correctAction;
  if (isMTT) {
    correctAction = hand.correct_action || (hand.hand_strength >= 4 ? 'allin' : 'fold');
  } else {
    // Cash game: derive correct action from hand properties + position + scenario
    if (hand.category === 'trap_hand' || hand.category === 'low_rundown') {
      // Trap hands: fold always, except MAYBE call from BTN in very specific cases
      if (scenario === 'vs_open') correctAction = 'fold';
      else if (position === 'BTN' && hand.hand_strength >= 2) correctAction = 'fold'; // still fold
      else correctAction = 'fold';
    } else if (hand.category === 'premium_rundown' || hand.category === 'double_suited_ace') {
      // Premium hands: raise open, 3-bet vs open from position
      if (scenario === 'vs_open') {
        correctAction = (hand.is_double_suited || hand.hand_strength >= 5) ? 'raise' : 'call';
      } else {
        correctAction = (position === 'UTG' && hand.hand_strength < 5) ? 'raise' : 'raise';
      }
    } else if (hand.category === 'premium_pair') {
      if (scenario === 'vs_open') {
        correctAction = (hand.is_double_suited || hand.hand_strength >= 5) ? 'raise' : 'call';
      } else {
        correctAction = 'raise';
      }
    } else if (hand.category === 'medium_rundown') {
      if (scenario === 'vs_open') {
        correctAction = hand.is_double_suited && (position === 'BTN' || position === 'CO') ? 'call' : 'fold';
      } else {
        if (hand.is_double_suited) {
          correctAction = (position === 'UTG') ? 'fold' : 'raise';
        } else {
          correctAction = (position === 'BTN' || position === 'CO') ? 'raise' : 'fold';
        }
      }
    } else if (hand.category === 'broadway_high') {
      if (scenario === 'vs_open') {
        correctAction = (hand.is_double_suited && (position === 'BTN' || position === 'CO')) ? 'raise' : 'call';
      } else {
        correctAction = (position === 'UTG') ? 'fold' : 'raise';
      }
    } else {
      correctAction = 'fold';
    }
  }

  return { hand, position, scenario, correctAction };
}

const HAND_GRID_ORDER = [
  'AA', 'AKs', 'AQs', 'AJs', 'ATs', 'A9s', 'A8s', 'A7s', 'A6s', 'A5s', 'A4s', 'A3s', 'A2s',
  'AKo', 'KK', 'KQs', 'KJs', 'KTs', 'K9s', 'K8s', 'K7s', 'K6s', 'K5s', 'K4s', 'K3s', 'K2s',
  'AQo', 'KQo', 'QQ', 'QJs', 'QTs', 'Q9s', 'Q8s', 'Q7s', 'Q6s', 'Q5s', 'Q4s', 'Q3s', 'Q2s',
  'AJo', 'KJo', 'QJo', 'JJ', 'JTs', 'J9s', 'J8s', 'J7s', 'J6s', 'J5s', 'J4s', 'J3s', 'J2s',
  'ATo', 'KTo', 'QTo', 'JTo', 'TT', 'T9s', 'T8s', 'T7s', 'T6s', 'T5s', 'T4s', 'T3s', 'T2s',
  'A9o', 'K9o', 'Q9o', 'J9o', 'T9o', '99', '98s', '97s', '96s', '95s', '94s', '93s', '92s',
  'A8o', 'K8o', 'Q8o', 'J8o', 'T8o', '98o', '88', '87s', '86s', '85s', '84s', '83s', '82s',
  'A7o', 'K7o', 'Q7o', 'J7o', 'T7o', '97o', '87o', '77', '76s', '75s', '74s', '73s', '72s',
  'A6o', 'K6o', 'Q6o', 'J6o', 'T6o', '96o', '86o', '76o', '66', '65s', '64s', '63s', '62s',
  'A5o', 'K5o', 'Q5o', 'J5o', 'T5o', '95o', '85o', '75o', '65o', '55', '54s', '53s', '52s',
  'A4o', 'K4o', 'Q4o', 'J4o', 'T4o', '94o', '84o', '74o', '64o', '54o', '44', '43s', '42s',
  'A3o', 'K3o', 'Q3o', 'J3o', 'T3o', '93o', '83o', '73o', '63o', '53o', '43o', '33', '32s',
  'A2o', 'K2o', 'Q2o', 'J2o', 'T2o', '92o', '82o', '72o', '62o', '52o', '42o', '32o', '22',
];


/**
 * GTO Drill Coach — Postflop Training Spots
 *
 * SOURCE: Curated training spots based on common high-frequency
 * GTO postflop scenarios for 100bb 6-max cash games.
 *
 * DATA ACCURACY: All spots labeled as 'sample' training data.
 * Action recommendations are directionally correct for building
 * sound postflop fundamentals. Exact frequencies are educational
 * approximations, not solver outputs.
 *
 * LABEL: ⚠ Sample Training Data — Not solver-verified EV
 */


const POSTFLOP_SPOTS = [

  // ── BTN vs BB SRP — Dry boards ──────────────────────────────────────────

  {
    id: 'pf-001',
    game_type: 'cash',
    format: '6max',
    stack_depth_bb: 100,
    spr_approx: 6.5,
    position_hero: 'BTN',
    position_villain: 'BB',
    preflop_action_summary: 'BTN opens 2.5bb, BB calls',
    street: 'flop',
    board_cards: ['Ks', '7h', '2c'],
    pot_size_bb: 5.5,
    hero_stack_bb: 97.5,
    hand_combo: null,
    hand_range_description: 'BTN opening range vs BB defense',
    concept_tags: ['c-bet', 'dry-board', 'range-advantage', 'IP'],
    source_type: 'sample',
    source_name: 'GTO Drill Coach Training Spots v1.0',
    accuracy_level: 'sample',
    difficulty: 'beginner',
    is_active: true,
    explanation_hint: 'BTN has a significant range and nut advantage on K72r. This is a high c-bet frequency spot with mixed sizings.',
    actions: [
      { action: 'check', frequency: 0.15, ev_bb: null, is_recommended: false, is_acceptable: true, ev_loss_vs_best: 0.15, label: 'minor_mistake' },
      { action: 'bet_33', frequency: 0.55, ev_bb: null, is_recommended: true, is_acceptable: true, ev_loss_vs_best: 0, label: 'best' },
      { action: 'bet_75', frequency: 0.30, ev_bb: null, is_recommended: true, is_acceptable: true, ev_loss_vs_best: 0.05, label: 'acceptable' },
      { action: 'bet_125', frequency: 0.00, ev_bb: null, is_recommended: false, is_acceptable: false, ev_loss_vs_best: 0.50, label: 'mistake' },
    ],
  },

  {
    id: 'pf-002',
    game_type: 'cash',
    format: '6max',
    stack_depth_bb: 100,
    spr_approx: 6.5,
    position_hero: 'BTN',
    position_villain: 'BB',
    preflop_action_summary: 'BTN opens 2.5bb, BB calls',
    street: 'flop',
    board_cards: ['Ah', '6d', '2s'],
    pot_size_bb: 5.5,
    hero_stack_bb: 97.5,
    hand_combo: null,
    hand_range_description: 'BTN opening range vs BB defense',
    concept_tags: ['c-bet', 'dry-board', 'ace-high', 'IP'],
    source_type: 'sample',
    source_name: 'GTO Drill Coach Training Spots v1.0',
    accuracy_level: 'sample',
    difficulty: 'beginner',
    is_active: true,
    explanation_hint: 'On A62r, BTN has a strong range advantage. Small bet is the standard due to board dryness and BTN nut advantage.',
    actions: [
      { action: 'check', frequency: 0.10, ev_bb: null, is_recommended: false, is_acceptable: false, ev_loss_vs_best: 0.35, label: 'mistake' },
      { action: 'bet_33', frequency: 0.70, ev_bb: null, is_recommended: true, is_acceptable: true, ev_loss_vs_best: 0, label: 'best' },
      { action: 'bet_75', frequency: 0.20, ev_bb: null, is_recommended: false, is_acceptable: true, ev_loss_vs_best: 0.10, label: 'acceptable' },
      { action: 'bet_125', frequency: 0.00, ev_bb: null, is_recommended: false, is_acceptable: false, ev_loss_vs_best: 0.60, label: 'mistake' },
    ],
  },

  // ── BTN vs BB SRP — Wet boards ──────────────────────────────────────────

  {
    id: 'pf-003',
    game_type: 'cash',
    format: '6max',
    stack_depth_bb: 100,
    spr_approx: 6.5,
    position_hero: 'BTN',
    position_villain: 'BB',
    preflop_action_summary: 'BTN opens 2.5bb, BB calls',
    street: 'flop',
    board_cards: ['Jh', 'Td', '8s'],
    pot_size_bb: 5.5,
    hero_stack_bb: 97.5,
    hand_combo: null,
    hand_range_description: 'BTN opening range vs BB defense',
    concept_tags: ['wet-board', 'connected', 'c-bet', 'polarized'],
    source_type: 'sample',
    source_name: 'GTO Drill Coach Training Spots v1.0',
    accuracy_level: 'sample',
    difficulty: 'intermediate',
    is_active: true,
    explanation_hint: 'JT8 is a dynamic, connected board. BB connects well with suited connectors. BTN should bet larger or check back at higher frequency than dry boards.',
    actions: [
      { action: 'check', frequency: 0.45, ev_bb: null, is_recommended: true, is_acceptable: true, ev_loss_vs_best: 0, label: 'best' },
      { action: 'bet_33', frequency: 0.15, ev_bb: null, is_recommended: false, is_acceptable: true, ev_loss_vs_best: 0.20, label: 'minor_mistake' },
      { action: 'bet_75', frequency: 0.30, ev_bb: null, is_recommended: true, is_acceptable: true, ev_loss_vs_best: 0.05, label: 'acceptable' },
      { action: 'bet_125', frequency: 0.10, ev_bb: null, is_recommended: false, is_acceptable: true, ev_loss_vs_best: 0.10, label: 'acceptable' },
    ],
  },

  {
    id: 'pf-004',
    game_type: 'cash',
    format: '6max',
    stack_depth_bb: 100,
    spr_approx: 6.5,
    position_hero: 'BTN',
    position_villain: 'BB',
    preflop_action_summary: 'BTN opens 2.5bb, BB calls',
    street: 'flop',
    board_cards: ['7s', '6h', '5d'],
    pot_size_bb: 5.5,
    hero_stack_bb: 97.5,
    hand_combo: null,
    hand_range_description: 'BTN opening range vs BB defense',
    concept_tags: ['low-board', 'connected', 'BB-favored', 'OOP-equity'],
    source_type: 'sample',
    source_name: 'GTO Drill Coach Training Spots v1.0',
    accuracy_level: 'sample',
    difficulty: 'intermediate',
    is_active: true,
    explanation_hint: 'On 765 BTN range advantage evaporates. BB has more of this board with 6x, 7x, 8x, 5x. BTN should check back at high frequency.',
    actions: [
      { action: 'check', frequency: 0.65, ev_bb: null, is_recommended: true, is_acceptable: true, ev_loss_vs_best: 0, label: 'best' },
      { action: 'bet_33', frequency: 0.20, ev_bb: null, is_recommended: false, is_acceptable: true, ev_loss_vs_best: 0.15, label: 'minor_mistake' },
      { action: 'bet_75', frequency: 0.10, ev_bb: null, is_recommended: false, is_acceptable: false, ev_loss_vs_best: 0.35, label: 'mistake' },
      { action: 'bet_125', frequency: 0.05, ev_bb: null, is_recommended: false, is_acceptable: false, ev_loss_vs_best: 0.65, label: 'big_mistake' },
    ],
  },

  // ── BB vs BTN SRP — BB OOP ──────────────────────────────────────────────

  {
    id: 'pf-005',
    game_type: 'cash',
    format: '6max',
    stack_depth_bb: 100,
    spr_approx: 6.5,
    position_hero: 'BB',
    position_villain: 'BTN',
    preflop_action_summary: 'BTN opens 2.5bb, BB calls — BB acts first on flop',
    street: 'flop',
    board_cards: ['Qs', '8h', '3c'],
    pot_size_bb: 5.5,
    hero_stack_bb: 97.5,
    hand_combo: null,
    hand_range_description: 'BB defending range vs BTN open',
    concept_tags: ['OOP', 'donk-bet', 'check', 'probe'],
    source_type: 'sample',
    source_name: 'GTO Drill Coach Training Spots v1.0',
    accuracy_level: 'sample',
    difficulty: 'beginner',
    is_active: true,
    explanation_hint: 'BB OOP should check at high frequency on Q83r to allow BTN to c-bet. Donk betting is low frequency in GTO.',
    actions: [
      { action: 'check', frequency: 0.90, ev_bb: null, is_recommended: true, is_acceptable: true, ev_loss_vs_best: 0, label: 'best' },
      { action: 'bet_33', frequency: 0.05, ev_bb: null, is_recommended: false, is_acceptable: false, ev_loss_vs_best: 0.30, label: 'mistake' },
      { action: 'bet_75', frequency: 0.05, ev_bb: null, is_recommended: false, is_acceptable: false, ev_loss_vs_best: 0.45, label: 'mistake' },
    ],
  },

  {
    id: 'pf-006',
    game_type: 'cash',
    format: '6max',
    stack_depth_bb: 100,
    spr_approx: 6.5,
    position_hero: 'BB',
    position_villain: 'BTN',
    preflop_action_summary: 'BTN opens 2.5bb, BB calls — BTN checks, BB facing check',
    street: 'flop',
    board_cards: ['Qs', '8h', '3c'],
    pot_size_bb: 5.5,
    hero_stack_bb: 97.5,
    hand_combo: null,
    hand_range_description: 'BB acts after BTN check',
    concept_tags: ['OOP', 'probe-bet', 'BTN-checks', 'delayed-aggression'],
    source_type: 'sample',
    source_name: 'GTO Drill Coach Training Spots v1.0',
    accuracy_level: 'sample',
    difficulty: 'intermediate',
    is_active: true,
    explanation_hint: 'When BTN checks back Q83, BB should probe bet with strong parts of range and some bluffs. Checking is also fine with weak holdings.',
    actions: [
      { action: 'check', frequency: 0.40, ev_bb: null, is_recommended: true, is_acceptable: true, ev_loss_vs_best: 0.05, label: 'acceptable' },
      { action: 'bet_50', frequency: 0.45, ev_bb: null, is_recommended: true, is_acceptable: true, ev_loss_vs_best: 0, label: 'best' },
      { action: 'bet_75', frequency: 0.15, ev_bb: null, is_recommended: false, is_acceptable: true, ev_loss_vs_best: 0.10, label: 'acceptable' },
    ],
  },

  // ── CO vs BB SRP ────────────────────────────────────────────────────────

  {
    id: 'pf-007',
    game_type: 'cash',
    format: '6max',
    stack_depth_bb: 100,
    spr_approx: 6.5,
    position_hero: 'CO',
    position_villain: 'BB',
    preflop_action_summary: 'CO opens 2.5bb, BB calls',
    street: 'flop',
    board_cards: ['Th', '9s', '6h'],
    pot_size_bb: 5.5,
    hero_stack_bb: 97.5,
    hand_combo: null,
    hand_range_description: 'CO opening range vs BB defense',
    concept_tags: ['draw-heavy', 'flush-draw', 'straight-draw', 'SPR'],
    source_type: 'sample',
    source_name: 'GTO Drill Coach Training Spots v1.0',
    accuracy_level: 'sample',
    difficulty: 'intermediate',
    is_active: true,
    explanation_hint: 'T96 two-tone is a highly connected draw-heavy board. BB has strong equity here with connectors. CO should use larger bets or check back.',
    actions: [
      { action: 'check', frequency: 0.40, ev_bb: null, is_recommended: true, is_acceptable: true, ev_loss_vs_best: 0.05, label: 'acceptable' },
      { action: 'bet_33', frequency: 0.20, ev_bb: null, is_recommended: false, is_acceptable: true, ev_loss_vs_best: 0.15, label: 'minor_mistake' },
      { action: 'bet_75', frequency: 0.30, ev_bb: null, is_recommended: true, is_acceptable: true, ev_loss_vs_best: 0, label: 'best' },
      { action: 'bet_125', frequency: 0.10, ev_bb: null, is_recommended: false, is_acceptable: true, ev_loss_vs_best: 0.10, label: 'acceptable' },
    ],
  },

  // ── 3-Bet Pot Spots ─────────────────────────────────────────────────────

  {
    id: 'pf-008',
    game_type: 'cash',
    format: '6max',
    stack_depth_bb: 100,
    spr_approx: 2.5,
    position_hero: 'BTN',
    position_villain: 'BB',
    preflop_action_summary: 'BTN opens 2.5bb, BB 3-bets to 9bb, BTN calls',
    street: 'flop',
    board_cards: ['As', 'Kh', '7d'],
    pot_size_bb: 18.5,
    hero_stack_bb: 91.0,
    hand_combo: null,
    hand_range_description: 'BTN calling range vs BB 3-bet',
    concept_tags: ['3-bet-pot', 'high-card', 'SPR', 'low-SPR'],
    source_type: 'sample',
    source_name: 'GTO Drill Coach Training Spots v1.0',
    accuracy_level: 'sample',
    difficulty: 'advanced',
    is_active: true,
    explanation_hint: 'Low SPR 3-bet pot on AK7r. BB 3-bet range hits this extremely well. BTN should check at high frequency and call when BB bets.',
    actions: [
      { action: 'check', frequency: 0.85, ev_bb: null, is_recommended: true, is_acceptable: true, ev_loss_vs_best: 0, label: 'best' },
      { action: 'bet_33', frequency: 0.10, ev_bb: null, is_recommended: false, is_acceptable: false, ev_loss_vs_best: 0.40, label: 'mistake' },
      { action: 'bet_75', frequency: 0.05, ev_bb: null, is_recommended: false, is_acceptable: false, ev_loss_vs_best: 0.70, label: 'big_mistake' },
    ],
  },

  // ── Paired board spots ──────────────────────────────────────────────────

  {
    id: 'pf-009',
    game_type: 'cash',
    format: '6max',
    stack_depth_bb: 100,
    spr_approx: 6.5,
    position_hero: 'BTN',
    position_villain: 'BB',
    preflop_action_summary: 'BTN opens 2.5bb, BB calls',
    street: 'flop',
    board_cards: ['9h', '9d', '3s'],
    pot_size_bb: 5.5,
    hero_stack_bb: 97.5,
    hand_combo: null,
    hand_range_description: 'BTN opening range vs BB defense',
    concept_tags: ['paired-board', 'dry', 'range-bet', 'thin-value'],
    source_type: 'sample',
    source_name: 'GTO Drill Coach Training Spots v1.0',
    accuracy_level: 'sample',
    difficulty: 'beginner',
    is_active: true,
    explanation_hint: 'On 993, neither player connects strongly. BTN retains positional advantage and can range bet small. The pair neutralizes both ranges somewhat.',
    actions: [
      { action: 'check', frequency: 0.20, ev_bb: null, is_recommended: false, is_acceptable: true, ev_loss_vs_best: 0.10, label: 'acceptable' },
      { action: 'bet_33', frequency: 0.65, ev_bb: null, is_recommended: true, is_acceptable: true, ev_loss_vs_best: 0, label: 'best' },
      { action: 'bet_75', frequency: 0.15, ev_bb: null, is_recommended: false, is_acceptable: true, ev_loss_vs_best: 0.15, label: 'minor_mistake' },
      { action: 'bet_125', frequency: 0.00, ev_bb: null, is_recommended: false, is_acceptable: false, ev_loss_vs_best: 0.55, label: 'mistake' },
    ],
  },

  // ── Turn spots ──────────────────────────────────────────────────────────

  {
    id: 'pf-010',
    game_type: 'cash',
    format: '6max',
    stack_depth_bb: 100,
    spr_approx: 4.5,
    position_hero: 'BTN',
    position_villain: 'BB',
    preflop_action_summary: 'BTN opens, BB calls — BTN bets flop, BB calls',
    street: 'turn',
    board_cards: ['Ks', '7h', '2c', 'Qd'],
    pot_size_bb: 11.0,
    hero_stack_bb: 93.0,
    hand_combo: null,
    hand_range_description: 'BTN IP on turn after c-bet called',
    concept_tags: ['turn', 'overcard', 'barrel', 'double-barrel'],
    source_type: 'sample',
    source_name: 'GTO Drill Coach Training Spots v1.0',
    accuracy_level: 'sample',
    difficulty: 'intermediate',
    is_active: true,
    explanation_hint: 'Q turn on K72 board improves BTN range more than BB range (BTN has more QJ, QT). Balanced double-barrel with value and some bluffs.',
    actions: [
      { action: 'check', frequency: 0.35, ev_bb: null, is_recommended: true, is_acceptable: true, ev_loss_vs_best: 0.05, label: 'acceptable' },
      { action: 'bet_50', frequency: 0.45, ev_bb: null, is_recommended: true, is_acceptable: true, ev_loss_vs_best: 0, label: 'best' },
      { action: 'bet_75', frequency: 0.20, ev_bb: null, is_recommended: false, is_acceptable: true, ev_loss_vs_best: 0.10, label: 'acceptable' },
    ],
  },

  {
    id: 'pf-011',
    game_type: 'cash',
    format: '6max',
    stack_depth_bb: 100,
    spr_approx: 4.5,
    position_hero: 'BTN',
    position_villain: 'BB',
    preflop_action_summary: 'BTN opens, BB calls — BTN checks back flop',
    street: 'turn',
    board_cards: ['7s', '6h', '5d', 'Kh'],
    pot_size_bb: 5.5,
    hero_stack_bb: 97.5,
    hand_combo: null,
    hand_range_description: 'BTN checked back flop, now on K turn',
    concept_tags: ['turn', 'delayed-barrel', 'King-overcard', 'backdoor'],
    source_type: 'sample',
    source_name: 'GTO Drill Coach Training Spots v1.0',
    accuracy_level: 'sample',
    difficulty: 'advanced',
    is_active: true,
    explanation_hint: 'King turn after checking back 765 recovers some BTN range advantage. BTN can now begin delayed c-bets with Kx and some bluffs.',
    actions: [
      { action: 'check', frequency: 0.40, ev_bb: null, is_recommended: true, is_acceptable: true, ev_loss_vs_best: 0.05, label: 'acceptable' },
      { action: 'bet_50', frequency: 0.40, ev_bb: null, is_recommended: true, is_acceptable: true, ev_loss_vs_best: 0, label: 'best' },
      { action: 'bet_75', frequency: 0.20, ev_bb: null, is_recommended: false, is_acceptable: true, ev_loss_vs_best: 0.10, label: 'acceptable' },
    ],
  },

  // ── River spots ─────────────────────────────────────────────────────────

  {
    id: 'pf-012',
    game_type: 'cash',
    format: '6max',
    stack_depth_bb: 100,
    spr_approx: 3.0,
    position_hero: 'BTN',
    position_villain: 'BB',
    preflop_action_summary: 'BTN bets flop and turn, BB calls both',
    street: 'river',
    board_cards: ['Ks', '7h', '2c', 'Qd', '4s'],
    pot_size_bb: 22.0,
    hero_stack_bb: 85.0,
    hand_combo: null,
    hand_range_description: 'BTN IP river — BB called two streets',
    concept_tags: ['river', 'triple-barrel', 'value-bet', 'polarized'],
    source_type: 'sample',
    source_name: 'GTO Drill Coach Training Spots v1.0',
    accuracy_level: 'sample',
    difficulty: 'advanced',
    is_active: true,
    explanation_hint: 'River on KQ742 after two streets of BTN aggression. Range should be polarized: strong value bets large, bluffs use same size, weak hands check.',
    actions: [
      { action: 'check', frequency: 0.45, ev_bb: null, is_recommended: true, is_acceptable: true, ev_loss_vs_best: 0.05, label: 'acceptable' },
      { action: 'bet_50', frequency: 0.15, ev_bb: null, is_recommended: false, is_acceptable: false, ev_loss_vs_best: 0.30, label: 'mistake' },
      { action: 'bet_75', frequency: 0.20, ev_bb: null, is_recommended: false, is_acceptable: true, ev_loss_vs_best: 0.15, label: 'minor_mistake' },
      { action: 'bet_125', frequency: 0.20, ev_bb: null, is_recommended: true, is_acceptable: true, ev_loss_vs_best: 0, label: 'best' },
    ],
  },

  // ── Monotone board ──────────────────────────────────────────────────────

  {
    id: 'pf-013',
    game_type: 'cash',
    format: '6max',
    stack_depth_bb: 100,
    spr_approx: 6.5,
    position_hero: 'BTN',
    position_villain: 'BB',
    preflop_action_summary: 'BTN opens 2.5bb, BB calls',
    street: 'flop',
    board_cards: ['Kh', '8h', '3h'],
    pot_size_bb: 5.5,
    hero_stack_bb: 97.5,
    hand_combo: null,
    hand_range_description: 'BTN opening range vs BB defense',
    concept_tags: ['monotone', 'flush', 'range-check', 'texture'],
    source_type: 'sample',
    source_name: 'GTO Drill Coach Training Spots v1.0',
    accuracy_level: 'sample',
    difficulty: 'intermediate',
    is_active: true,
    explanation_hint: 'Monotone K83 — flush draw is complete. High check-back frequency for BTN unless holding a flush. Betting non-flushes is a significant mistake.',
    actions: [
      { action: 'check', frequency: 0.75, ev_bb: null, is_recommended: true, is_acceptable: true, ev_loss_vs_best: 0, label: 'best' },
      { action: 'bet_33', frequency: 0.15, ev_bb: null, is_recommended: false, is_acceptable: true, ev_loss_vs_best: 0.15, label: 'minor_mistake' },
      { action: 'bet_75', frequency: 0.10, ev_bb: null, is_recommended: false, is_acceptable: false, ev_loss_vs_best: 0.40, label: 'mistake' },
    ],
  },

  // ── High-card boards ─────────────────────────────────────────────────────

  {
    id: 'pf-014',
    game_type: 'cash',
    format: '6max',
    stack_depth_bb: 100,
    spr_approx: 6.5,
    position_hero: 'CO',
    position_villain: 'BB',
    preflop_action_summary: 'CO opens 2.5bb, BB calls',
    street: 'flop',
    board_cards: ['Ah', 'Qs', 'Js'],
    pot_size_bb: 5.5,
    hero_stack_bb: 97.5,
    hand_combo: null,
    hand_range_description: 'CO opening range vs BB defense',
    concept_tags: ['high-card', 'broadway', 'draw-heavy', 'IP'],
    source_type: 'sample',
    source_name: 'GTO Drill Coach Training Spots v1.0',
    accuracy_level: 'sample',
    difficulty: 'intermediate',
    is_active: true,
    explanation_hint: 'AQJ two-tone is a high card board with flush and straight potential. CO has strong range advantage but BB has nut straight (KT). Mixed strategy.',
    actions: [
      { action: 'check', frequency: 0.25, ev_bb: null, is_recommended: false, is_acceptable: true, ev_loss_vs_best: 0.15, label: 'minor_mistake' },
      { action: 'bet_33', frequency: 0.50, ev_bb: null, is_recommended: true, is_acceptable: true, ev_loss_vs_best: 0, label: 'best' },
      { action: 'bet_75', frequency: 0.25, ev_bb: null, is_recommended: true, is_acceptable: true, ev_loss_vs_best: 0.05, label: 'acceptable' },
    ],
  },

  // ── CO vs BB — low board ─────────────────────────────────────────────────

  {
    id: 'pf-015',
    game_type: 'cash',
    format: '6max',
    stack_depth_bb: 100,
    spr_approx: 6.5,
    position_hero: 'CO',
    position_villain: 'BB',
    preflop_action_summary: 'CO opens 2.5bb, BB calls',
    street: 'flop',
    board_cards: ['5h', '4c', '2s'],
    pot_size_bb: 5.5,
    hero_stack_bb: 97.5,
    hand_combo: null,
    hand_range_description: 'CO opening range vs BB defense',
    concept_tags: ['low-board', 'BB-favored', 'OOP-equity', 'check'],
    source_type: 'sample',
    source_name: 'GTO Drill Coach Training Spots v1.0',
    accuracy_level: 'sample',
    difficulty: 'intermediate',
    is_active: true,
    explanation_hint: '542 low board heavily favors BB calling range (A2-A5, low pairs, suited connectors). CO should check at very high frequency here.',
    actions: [
      { action: 'check', frequency: 0.70, ev_bb: null, is_recommended: true, is_acceptable: true, ev_loss_vs_best: 0, label: 'best' },
      { action: 'bet_33', frequency: 0.20, ev_bb: null, is_recommended: false, is_acceptable: false, ev_loss_vs_best: 0.35, label: 'mistake' },
      { action: 'bet_75', frequency: 0.10, ev_bb: null, is_recommended: false, is_acceptable: false, ev_loss_vs_best: 0.60, label: 'big_mistake' },
    ],
  },

  // ── SB vs BB SRP spots ───────────────────────────────────────────────────

  {
    id: 'pf-016',
    game_type: 'cash',
    format: '6max',
    stack_depth_bb: 100,
    spr_approx: 6.5,
    position_hero: 'SB',
    position_villain: 'BB',
    preflop_action_summary: 'SB opens 3bb, BB calls',
    street: 'flop',
    board_cards: ['Ad', 'Th', '4c'],
    pot_size_bb: 7.0,
    hero_stack_bb: 97.0,
    hand_combo: null,
    hand_range_description: 'SB opening range vs BB defense',
    concept_tags: ['high-card', 'IP', 'range-advantage', 'dry-board'],
    source_type: 'sample',
    source_name: 'GTO Drill Coach Training Spots v1.0',
    accuracy_level: 'sample',
    difficulty: 'beginner',
    is_active: true,
    explanation_hint: 'SB has a wide range advantage on AT4r — far more Ax combos than BB. High frequency c-bet, often small.',
    actions: [
      { action: 'check', frequency: 0.15, ev_bb: null, is_recommended: false, is_acceptable: true, ev_loss_vs_best: 0.15, label: 'minor_mistake' },
      { action: 'bet_33', frequency: 0.60, ev_bb: null, is_recommended: true, is_acceptable: true, ev_loss_vs_best: 0, label: 'best' },
      { action: 'bet_75', frequency: 0.25, ev_bb: null, is_recommended: false, is_acceptable: true, ev_loss_vs_best: 0.10, label: 'acceptable' },
    ],
  },

  {
    id: 'pf-017',
    game_type: 'cash',
    format: '6max',
    stack_depth_bb: 100,
    spr_approx: 6.5,
    position_hero: 'SB',
    position_villain: 'BB',
    preflop_action_summary: 'SB opens 3bb, BB calls',
    street: 'flop',
    board_cards: ['8h', '8s', '4d'],
    pot_size_bb: 7.0,
    hero_stack_bb: 97.0,
    hand_combo: null,
    hand_range_description: 'SB opening range vs BB defense',
    concept_tags: ['paired-board', 'middle-card', 'range-bet'],
    source_type: 'sample',
    source_name: 'GTO Drill Coach Training Spots v1.0',
    accuracy_level: 'sample',
    difficulty: 'intermediate',
    is_active: true,
    explanation_hint: 'Middle pair boards like 884 favor the preflop aggressor slightly. SB can bet small across most of its range.',
    actions: [
      { action: 'check', frequency: 0.30, ev_bb: null, is_recommended: false, is_acceptable: true, ev_loss_vs_best: 0.10, label: 'acceptable' },
      { action: 'bet_33', frequency: 0.60, ev_bb: null, is_recommended: true, is_acceptable: true, ev_loss_vs_best: 0, label: 'best' },
      { action: 'bet_75', frequency: 0.10, ev_bb: null, is_recommended: false, is_acceptable: true, ev_loss_vs_best: 0.15, label: 'minor_mistake' },
    ],
  },

  // ── CO vs BB — Turn/River continuations ──────────────────────────────────

  {
    id: 'pf-018',
    game_type: 'cash',
    format: '6max',
    stack_depth_bb: 100,
    spr_approx: 4.5,
    position_hero: 'CO',
    position_villain: 'BB',
    preflop_action_summary: 'CO opens, BB calls — CO bets flop, BB calls',
    street: 'turn',
    board_cards: ['Th', '9s', '6h', '2c'],
    pot_size_bb: 11.0,
    hero_stack_bb: 93.0,
    hand_combo: null,
    hand_range_description: 'CO IP on turn after c-bet called',
    concept_tags: ['turn', 'blank-card', 'barrel', 'pot-control'],
    source_type: 'sample',
    source_name: 'GTO Drill Coach Training Spots v1.0',
    accuracy_level: 'sample',
    difficulty: 'intermediate',
    is_active: true,
    explanation_hint: 'A blank 2 on the turn after T96 does not change either range much. CO should check back more often with marginal holdings and continue with strong hands/draws.',
    actions: [
      { action: 'check', frequency: 0.55, ev_bb: null, is_recommended: true, is_acceptable: true, ev_loss_vs_best: 0, label: 'best' },
      { action: 'bet_50', frequency: 0.30, ev_bb: null, is_recommended: false, is_acceptable: true, ev_loss_vs_best: 0.10, label: 'acceptable' },
      { action: 'bet_75', frequency: 0.15, ev_bb: null, is_recommended: false, is_acceptable: true, ev_loss_vs_best: 0.15, label: 'minor_mistake' },
    ],
  },

  {
    id: 'pf-019',
    game_type: 'cash',
    format: '6max',
    stack_depth_bb: 100,
    spr_approx: 2.0,
    position_hero: 'CO',
    position_villain: 'BB',
    preflop_action_summary: 'CO opens, BB calls — both barrel flop and turn',
    street: 'river',
    board_cards: ['Th', '9s', '6h', '2c', '2d'],
    pot_size_bb: 24.0,
    hero_stack_bb: 84.0,
    hand_combo: null,
    hand_range_description: 'CO IP on river — paired board',
    concept_tags: ['river', 'paired-river', 'blocker', 'thin-value'],
    source_type: 'sample',
    source_name: 'GTO Drill Coach Training Spots v1.0',
    accuracy_level: 'sample',
    difficulty: 'advanced',
    is_active: true,
    explanation_hint: 'The river pairs the board (2s). This generally favors the player who was ahead on the turn slightly, since it rarely improves either range much. Mostly a value/check decision.',
    actions: [
      { action: 'check', frequency: 0.55, ev_bb: null, is_recommended: true, is_acceptable: true, ev_loss_vs_best: 0, label: 'best' },
      { action: 'bet_50', frequency: 0.30, ev_bb: null, is_recommended: false, is_acceptable: true, ev_loss_vs_best: 0.10, label: 'acceptable' },
      { action: 'bet_125', frequency: 0.15, ev_bb: null, is_recommended: false, is_acceptable: false, ev_loss_vs_best: 0.35, label: 'mistake' },
    ],
  },

  // ── BB vs CO — defending wider, OOP play ─────────────────────────────────

  {
    id: 'pf-020',
    game_type: 'cash',
    format: '6max',
    stack_depth_bb: 100,
    spr_approx: 6.5,
    position_hero: 'BB',
    position_villain: 'CO',
    preflop_action_summary: 'CO opens 2.5bb, BB calls — CO checks back flop',
    street: 'turn',
    board_cards: ['Jh', '8d', '3c', '3s'],
    pot_size_bb: 5.5,
    hero_stack_bb: 97.5,
    hand_combo: null,
    hand_range_description: 'BB after CO checks back, paired turn',
    concept_tags: ['OOP', 'paired-turn', 'probe-bet', 'delayed-aggression'],
    source_type: 'sample',
    source_name: 'GTO Drill Coach Training Spots v1.0',
    accuracy_level: 'sample',
    difficulty: 'advanced',
    is_active: true,
    explanation_hint: 'When CO checks back J83 and the turn pairs the 3, BB gains a small range edge (more trips/sets in a wider calling range). Good spot for a probe bet with a polarized range.',
    actions: [
      { action: 'check', frequency: 0.45, ev_bb: null, is_recommended: true, is_acceptable: true, ev_loss_vs_best: 0.05, label: 'acceptable' },
      { action: 'bet_50', frequency: 0.40, ev_bb: null, is_recommended: true, is_acceptable: true, ev_loss_vs_best: 0, label: 'best' },
      { action: 'bet_75', frequency: 0.15, ev_bb: null, is_recommended: false, is_acceptable: true, ev_loss_vs_best: 0.10, label: 'acceptable' },
    ],
  },

  // ── 4-bet pot spot ────────────────────────────────────────────────────────

  {
    id: 'pf-021',
    game_type: 'cash',
    format: '6max',
    stack_depth_bb: 100,
    spr_approx: 1.2,
    position_hero: 'CO',
    position_villain: 'BTN',
    preflop_action_summary: 'CO opens, BTN 3-bets, CO 4-bets, BTN calls',
    street: 'flop',
    board_cards: ['Kc', '8h', '3d'],
    pot_size_bb: 48.0,
    hero_stack_bb: 76.0,
    hand_combo: null,
    hand_range_description: 'CO 4-bet range, BTN call range — very low SPR',
    concept_tags: ['4-bet-pot', 'low-SPR', 'range-vs-range', 'commitment'],
    source_type: 'sample',
    source_name: 'GTO Drill Coach Training Spots v1.0',
    accuracy_level: 'sample',
    difficulty: 'advanced',
    is_active: true,
    explanation_hint: 'In 4-bet pots, SPR is often below 1.5. Both ranges are extremely strong and condensed. Betting frequency is very high — checking is rare because most of the range is ready to get stacks in.',
    actions: [
      { action: 'check', frequency: 0.20, ev_bb: null, is_recommended: false, is_acceptable: true, ev_loss_vs_best: 0.20, label: 'minor_mistake' },
      { action: 'bet_50', frequency: 0.20, ev_bb: null, is_recommended: false, is_acceptable: true, ev_loss_vs_best: 0.15, label: 'minor_mistake' },
      { action: 'bet_125', frequency: 0.60, ev_bb: null, is_recommended: true, is_acceptable: true, ev_loss_vs_best: 0, label: 'best' },
    ],
  },

  // ── More dry/wet board variety ───────────────────────────────────────────

  {
    id: 'pf-022',
    game_type: 'cash',
    format: '6max',
    stack_depth_bb: 100,
    spr_approx: 6.5,
    position_hero: 'BTN',
    position_villain: 'BB',
    preflop_action_summary: 'BTN opens 2.5bb, BB calls',
    street: 'flop',
    board_cards: ['Qd', 'Jc', 'Th'],
    pot_size_bb: 5.5,
    hero_stack_bb: 97.5,
    hand_combo: null,
    hand_range_description: 'BTN opening range vs BB defense',
    concept_tags: ['wet-board', 'connected', 'straight-possible', 'check'],
    source_type: 'sample',
    source_name: 'GTO Drill Coach Training Spots v1.0',
    accuracy_level: 'sample',
    difficulty: 'advanced',
    is_active: true,
    explanation_hint: 'QJT is one of the most BB-favored textures — three connected high cards give BB many straights, two pairs, and strong draws from a calling range. BTN should check at very high frequency.',
    actions: [
      { action: 'check', frequency: 0.75, ev_bb: null, is_recommended: true, is_acceptable: true, ev_loss_vs_best: 0, label: 'best' },
      { action: 'bet_33', frequency: 0.10, ev_bb: null, is_recommended: false, is_acceptable: true, ev_loss_vs_best: 0.20, label: 'minor_mistake' },
      { action: 'bet_75', frequency: 0.15, ev_bb: null, is_recommended: false, is_acceptable: false, ev_loss_vs_best: 0.40, label: 'mistake' },
    ],
  },

  {
    id: 'pf-023',
    game_type: 'cash',
    format: '6max',
    stack_depth_bb: 100,
    spr_approx: 6.5,
    position_hero: 'CO',
    position_villain: 'BB',
    preflop_action_summary: 'CO opens 2.5bb, BB calls',
    street: 'flop',
    board_cards: ['Ac', 'Ah', '6d'],
    pot_size_bb: 5.5,
    hero_stack_bb: 97.5,
    hand_combo: null,
    hand_range_description: 'CO opening range vs BB defense',
    concept_tags: ['paired-board', 'ace-paired', 'dry', 'range-bet'],
    source_type: 'sample',
    source_name: 'GTO Drill Coach Training Spots v1.0',
    accuracy_level: 'sample',
    difficulty: 'intermediate',
    is_active: true,
    explanation_hint: 'AA6 — a paired ace board. CO has more Ax in range than BB and trips are rare for both. CO can bet small across a wide range since BB cannot have many strong holdings.',
    actions: [
      { action: 'check', frequency: 0.25, ev_bb: null, is_recommended: false, is_acceptable: true, ev_loss_vs_best: 0.10, label: 'acceptable' },
      { action: 'bet_33', frequency: 0.65, ev_bb: null, is_recommended: true, is_acceptable: true, ev_loss_vs_best: 0, label: 'best' },
      { action: 'bet_75', frequency: 0.10, ev_bb: null, is_recommended: false, is_acceptable: true, ev_loss_vs_best: 0.15, label: 'minor_mistake' },
    ],
  },

  {
    id: 'pf-024',
    game_type: 'cash',
    format: '6max',
    stack_depth_bb: 100,
    spr_approx: 6.5,
    position_hero: 'BTN',
    position_villain: 'BB',
    preflop_action_summary: 'BTN opens 2.5bb, BB calls',
    street: 'flop',
    board_cards: ['Th', '4h', '3h'],
    pot_size_bb: 5.5,
    hero_stack_bb: 97.5,
    hand_combo: null,
    hand_range_description: 'BTN opening range vs BB defense',
    concept_tags: ['monotone', 'low-flush', 'range-check', 'texture'],
    source_type: 'sample',
    source_name: 'GTO Drill Coach Training Spots v1.0',
    accuracy_level: 'sample',
    difficulty: 'intermediate',
    is_active: true,
    explanation_hint: 'Low monotone boards like T43 are tricky — BTN has range advantage in non-flush hands, but BB has more low flush combos. Mixed strategy with smaller sizing when betting.',
    actions: [
      { action: 'check', frequency: 0.55, ev_bb: null, is_recommended: true, is_acceptable: true, ev_loss_vs_best: 0, label: 'best' },
      { action: 'bet_33', frequency: 0.35, ev_bb: null, is_recommended: false, is_acceptable: true, ev_loss_vs_best: 0.10, label: 'acceptable' },
      { action: 'bet_75', frequency: 0.10, ev_bb: null, is_recommended: false, is_acceptable: true, ev_loss_vs_best: 0.20, label: 'minor_mistake' },
    ],
  },

  // ── Turn spots — overcard and blank variety ──────────────────────────────

  {
    id: 'pf-025',
    game_type: 'cash',
    format: '6max',
    stack_depth_bb: 100,
    spr_approx: 4.5,
    position_hero: 'BB',
    position_villain: 'BTN',
    preflop_action_summary: 'BTN opens, BB calls — BB probes turn after BTN checks flop',
    street: 'turn',
    board_cards: ['9h', '5c', '2d', 'Jh'],
    pot_size_bb: 5.5,
    hero_stack_bb: 97.5,
    hand_combo: null,
    hand_range_description: 'BB facing J turn after checking through 952 flop',
    concept_tags: ['turn', 'OOP', 'overcard', 'check-call'],
    source_type: 'sample',
    source_name: 'GTO Drill Coach Training Spots v1.0',
    accuracy_level: 'sample',
    difficulty: 'intermediate',
    is_active: true,
    explanation_hint: 'A Jack turn on a 952 board that went check-check is mostly a blank for BB range but slightly improves BTN Jx holdings. BB should mostly check again and react to BTN bet.',
    actions: [
      { action: 'check', frequency: 0.80, ev_bb: null, is_recommended: true, is_acceptable: true, ev_loss_vs_best: 0, label: 'best' },
      { action: 'bet_50', frequency: 0.15, ev_bb: null, is_recommended: false, is_acceptable: true, ev_loss_vs_best: 0.15, label: 'minor_mistake' },
      { action: 'bet_75', frequency: 0.05, ev_bb: null, is_recommended: false, is_acceptable: false, ev_loss_vs_best: 0.35, label: 'mistake' },
    ],
  },

  // ── CO vs BB — high SPR straight-forward spot ────────────────────────────

  {
    id: 'pf-026',
    game_type: 'cash',
    format: '6max',
    stack_depth_bb: 150,
    spr_approx: 10.0,
    position_hero: 'CO',
    position_villain: 'BB',
    preflop_action_summary: 'CO opens 2.5bb, BB calls (150bb effective)',
    street: 'flop',
    board_cards: ['Ks', '9d', '4h'],
    pot_size_bb: 5.5,
    hero_stack_bb: 147.5,
    hand_combo: null,
    hand_range_description: 'CO opening range vs BB defense — deeper stacks',
    concept_tags: ['deep-stack', 'high-SPR', 'dry-board', 'c-bet'],
    source_type: 'sample',
    source_name: 'GTO Drill Coach Training Spots v1.0',
    accuracy_level: 'sample',
    difficulty: 'intermediate',
    is_active: true,
    explanation_hint: 'At 150bb (high SPR), c-bet sizing on dry boards like K94 trends slightly larger than at 100bb because deep stacks favor bigger bets that set up profitable future streets with strong hands.',
    actions: [
      { action: 'check', frequency: 0.15, ev_bb: null, is_recommended: false, is_acceptable: true, ev_loss_vs_best: 0.15, label: 'minor_mistake' },
      { action: 'bet_33', frequency: 0.35, ev_bb: null, is_recommended: false, is_acceptable: true, ev_loss_vs_best: 0.10, label: 'acceptable' },
      { action: 'bet_75', frequency: 0.50, ev_bb: null, is_recommended: true, is_acceptable: true, ev_loss_vs_best: 0, label: 'best' },
    ],
  },

  // ── Short stack / low SPR cash spot ──────────────────────────────────────

  {
    id: 'pf-027',
    game_type: 'cash',
    format: '6max',
    stack_depth_bb: 40,
    spr_approx: 2.5,
    position_hero: 'BTN',
    position_villain: 'BB',
    preflop_action_summary: 'BTN opens 2.5bb, BB calls (40bb effective)',
    street: 'flop',
    board_cards: ['8c', '7d', '2h'],
    pot_size_bb: 5.5,
    hero_stack_bb: 37.5,
    hand_combo: null,
    hand_range_description: 'BTN opening range vs BB defense — 40bb short stack',
    concept_tags: ['short-stack', 'low-SPR', 'connected', 'commitment'],
    source_type: 'sample',
    source_name: 'GTO Drill Coach Training Spots v1.0',
    accuracy_level: 'sample',
    difficulty: 'intermediate',
    is_active: true,
    explanation_hint: 'At 40bb, SPR is much lower, so betting commits a larger portion of the stack. On connected boards like 872 where BB has range advantage, BTN should check more than at 100bb and avoid bloating low-SPR pots without a hand.',
    actions: [
      { action: 'check', frequency: 0.60, ev_bb: null, is_recommended: true, is_acceptable: true, ev_loss_vs_best: 0, label: 'best' },
      { action: 'bet_33', frequency: 0.25, ev_bb: null, is_recommended: false, is_acceptable: true, ev_loss_vs_best: 0.10, label: 'acceptable' },
      { action: 'bet_75', frequency: 0.15, ev_bb: null, is_recommended: false, is_acceptable: false, ev_loss_vs_best: 0.30, label: 'mistake' },
    ],
  },

  // ── River bluff-catcher spot ──────────────────────────────────────────────

  {
    id: 'pf-028',
    game_type: 'cash',
    format: '6max',
    stack_depth_bb: 100,
    spr_approx: 1.5,
    position_hero: 'BB',
    position_villain: 'BTN',
    preflop_action_summary: 'BTN opens, BB calls — BB check-called flop and turn, river facing bet',
    street: 'river',
    board_cards: ['Jd', '8c', '4h', '2s', '2c'],
    pot_size_bb: 30.0,
    hero_stack_bb: 70.0,
    hand_combo: 'JhTh',
    hand_range_description: 'BB holding top pair, facing a river bet',
    concept_tags: ['river', 'bluff-catcher', 'paired-river', 'pot-odds'],
    source_type: 'sample',
    source_name: 'GTO Drill Coach Training Spots v1.0',
    accuracy_level: 'sample',
    difficulty: 'advanced',
    is_active: true,
    explanation_hint: 'With top pair on a paired river facing a large bet, this is a classic bluff-catcher decision. The correct frequency depends on balancing the villain value-to-bluff ratio at this sizing.',
    actions: [
      { action: 'fold', frequency: 0.35, ev_bb: null, is_recommended: false, is_acceptable: true, ev_loss_vs_best: 0.10, label: 'acceptable' },
      { action: 'call', frequency: 0.65, ev_bb: null, is_recommended: true, is_acceptable: true, ev_loss_vs_best: 0, label: 'best' },
    ],
  },
];


// Get spots filtered by difficulty
function getSpotsByDifficulty(difficulty) {
  return POSTFLOP_SPOTS.filter((s) => s.is_active && s.difficulty === difficulty);
}

// Get a random active spot
function getRandomSpot(excludeIds = []) {
  const active = POSTFLOP_SPOTS.filter((s) => s.is_active && !excludeIds.includes(s.id));
  if (active.length === 0) return null;
  return active[Math.floor(Math.random() * active.length)];
}

// Get spots by concept tag
function getSpotsByTag(tag) {
  return POSTFLOP_SPOTS.filter(
    (s) => s.is_active && s.concept_tags.some((t) => t.toLowerCase().includes(tag.toLowerCase()))
  );
}

  window.GTOData = {
    PREFLOP_RANGES,
    LIMP_RANGES,
    OPEN_FACING_RANGES,
    VS_4BET_RANGES,
    MTT_PUSH_FOLD_RANGES,
    MTT_VS_LIMP_RANGES,
    MTT_VS_RAISE_RANGES,
    ALL_RANGES,
    HAND_GRID_ORDER,
    findRange,
    findRanges,
    findRangeById,
    getComboAction,
    getRandomComboFromRange,
    getDailyQuizSpot,
    getComboAllActions,
    POSTFLOP_SPOTS,
    getSpotsByDifficulty,
    getRandomSpot,
    getSpotsByTag,
    PLO_CASH_HANDS,
    PLO_MTT_HANDS,
    getPLODrillSpot,
  };
})();
