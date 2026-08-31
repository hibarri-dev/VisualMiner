/**
 * Dummy stage P&L for the client demo.
 * Same unit on every card (USD today / this shift) so an executive can
 * decide where money is made vs lost: geology, pit, plant, haul, gate.
 * Numbers follow the live dummy plant + gate — not a finance feed.
 */

import { gateKpis } from './logistics'

const RANGE_SCALE = {
  today: 1,
  yesterday: 0.92,
  this_week: 6.2,
  this_month: 24
}

export function formatUsdShift(n) {
  const rounded = Math.round(Number(n) || 0)
  const sign = rounded > 0 ? '+' : rounded < 0 ? '-' : ''
  const abs = Math.abs(rounded)
  if (abs >= 1000) return `${sign}$${Math.round(abs / 1000).toLocaleString()}k`
  return `${sign}$${abs}`
}

function row({ id, label, clientLabel, revenue, cost, decision }) {
  const net = Math.round(revenue - cost)
  const verdict = net >= 0 ? 'making' : 'losing'
  return {
    id,
    label,
    clientLabel,
    revenue: Math.round(revenue),
    cost: Math.round(cost),
    net,
    verdict,
    decision,
    metric: formatUsdShift(net),
    metricColor: verdict === 'making' ? 'text-emerald-400' : 'text-rose-400'
  }
}

export function buildStagePnl(mine, timeRange = 'today') {
  const scale = RANGE_SCALE[timeRange] || 1
  const x17 = (mine.plants || []).find(p => p.id === 'X17')
  const plantDown = x17?.status === 'mechanical_failure'
  const plantDegraded = x17?.status === 'degraded'
  const gate = gateKpis(mine.tippers || [])
  const waiting = gate.arrivedEmpty + gate.loading + gate.held
  const extractionTph = mine.production?.extractionTph || 170
  const crushingTph = mine.production?.crushingTph || 10

  const preparation = row({
    id: 'preparation',
    label: 'Preparation',
    clientLabel: 'Geology / blast',
    revenue: 22000 * scale,
    cost: 11800 * scale,
    decision: 'Fragmentation is paying. Hold the 14:00 blast window — do not slip it.'
  })

  const extraction = row({
    id: 'extraction',
    label: 'Extraction',
    clientLabel: 'Pit',
    revenue: extractionTph * 82 * 6 * scale,
    cost: 36000 * scale,
    decision: 'The pit is making money on QZ-1. Do not spend fleet hours on low-grade QZ-2.'
  })

  let processing
  if (plantDown) {
    processing = row({
      id: 'processing',
      label: 'Processing',
      clientLabel: 'Plant',
      revenue: 18000 * scale,
      cost: (210 - crushingTph) * 920 * scale + 42000 * scale,
      decision: 'This is the loss. ROM is mined faster than X17 can crush it. Fix the plant before you mine more.'
    })
  } else if (plantDegraded) {
    processing = row({
      id: 'processing',
      label: 'Processing',
      clientLabel: 'Plant',
      revenue: 92000 * scale,
      cost: 78000 * scale,
      decision: 'Plant recovering. Do not sell Conc 42% until the lab is on spec.'
    })
  } else {
    processing = row({
      id: 'processing',
      label: 'Processing',
      clientLabel: 'Plant',
      revenue: 186000 * scale,
      cost: 94000 * scale,
      decision: 'Named concentrate is the product. Keep 42 / 50 / 60% piles on spec.'
    })
  }

  const haulage = row({
    id: 'haulage',
    label: 'Haulage',
    clientLabel: 'Haul',
    revenue: (plantDown ? 8200 : 42000) * scale,
    cost: (6400 + waiting * 420) * scale,
    decision: plantDown
      ? 'Trucks are burning diesel in the queue. Do not hire more tippers until crushed fines exist.'
      : 'Cycle time is the cost. Clear the ramp before adding trucks.'
  })

  const shipping = row({
    id: 'shipping',
    label: 'Shipping',
    clientLabel: 'Gate / sale',
    revenue: (plantDown ? 12400 : 78000) * scale,
    cost: (waiting * 480 + gate.fraudFlags * 3100) * scale,
    decision: plantDown
      ? 'Empty in, nothing to load. Standing time at the gate is the leak.'
      : 'Weighbridge vs declared is catching theft. Keep the 26 / 30 / 34 / 42 t check.'
  })

  const stages = { preparation, extraction, processing, haulage, shipping }
  const list = [preparation, extraction, processing, haulage, shipping]
  const metrics = Object.fromEntries(list.map(s => [s.id, { metric: s.metric, metricColor: s.metricColor, verdict: s.verdict }]))
  const worst = list.reduce((a, b) => (a.net <= b.net ? a : b))
  const best = list.reduce((a, b) => (a.net >= b.net ? a : b))

  return {
    stages,
    metrics,
    list,
    worst,
    best,
    totalNet: list.reduce((sum, s) => sum + s.net, 0)
  }
}
