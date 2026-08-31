import React from 'react'

const TONES = {
  Dumping: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
  Hauling: 'bg-sky-500/15 text-sky-300 border-sky-500/30',
  Loading: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  Digging: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  Drilling: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30',
  Idle: 'bg-slate-500/15 text-slate-300 border-slate-500/30',
  Queued: 'bg-orange-500/15 text-orange-300 border-orange-500/30',
  Breakdown: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
  Maintenance: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
  critical: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
  warning: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
  mechanical_failure: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
  degraded: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
  on_shift: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  live: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  connected: 'bg-sky-500/15 text-sky-300 border-sky-500/30',
  syncing: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
  empty: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
  accepted: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  draft: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
  held_gate: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
  ticketed: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  watch: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
  cleared: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  queued: 'bg-orange-500/15 text-orange-300 border-orange-500/30',
  follow_up: 'bg-violet-500/15 text-violet-300 border-violet-500/30',
  deprioritised: 'bg-slate-500/15 text-slate-300 border-slate-500/30',
  fraud_review: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
  indicated: 'bg-sky-500/15 text-sky-300 border-sky-500/30',
  inferred: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30',
  assays_pending: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
  pending: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
  complete: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  stemmed: 'bg-sky-500/15 text-sky-300 border-sky-500/30',
  charged: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30',
  open: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  hold: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
  valid: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  renewal_in_progress: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
  submitted: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  unread: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30',
  arrive_empty: 'bg-orange-500/15 text-orange-300 border-orange-500/30',
  depart_loaded: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  loading: 'bg-sky-500/15 text-sky-300 border-sky-500/30',
  departed: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  pending: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
  extracting: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  deferred_low_grade: 'bg-slate-500/15 text-slate-300 border-slate-500/30',
  extracting_sell_raw: 'bg-amber-500/15 text-amber-300 border-amber-500/30'
}

export default function StatusBadge({ value }) {
  if (value == null || value === '') return null
  const label = String(value).replace(/_/g, ' ')
  const tone = TONES[value] || 'bg-[#252835] text-slate-300 border-slate-700/50'
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono capitalize border ${tone}`}>
      {label}
    </span>
  )
}
