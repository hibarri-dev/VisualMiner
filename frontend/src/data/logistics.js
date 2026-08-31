/**
 * Gate + weighbridge dummy logistics for the client demo.
 * Empty tipper in → loaded tipper out. Payload class is 26 / 30 / 34 / 42 t.
 * Declared load vs weighbridge kg is the fraud check.
 */

export const PAYLOAD_TONS = [26, 30, 34, 42]

export const GATE_EVENTS = [
  { id: 'arrive_empty', label: 'Arrived empty' },
  { id: 'loading', label: 'Loading' },
  { id: 'depart_loaded', label: 'Departed loaded' },
  { id: 'held_gate', label: 'Held at gate' }
]

function kg(tons) {
  return Math.round(Number(tons) * 1000)
}

function flagFor(declaredTons, weighbridgeTons, event) {
  if (event === 'arrive_empty' || event === 'loading') return 'pending'
  if (event === 'held_gate') return 'held_gate'
  if (weighbridgeTons == null) return 'pending'
  if (weighbridgeTons === 0 && declaredTons > 0) return 'fraud_review'
  const variancePercent =
    declaredTons === 0 ? 0 : Math.round(((weighbridgeTons - declaredTons) / declaredTons) * 1000) / 10
  if (Math.abs(variancePercent) >= 5) return 'fraud_review'
  return 'cleared'
}

function statusFor(event, flag) {
  if (event === 'arrive_empty') return 'queued'
  if (event === 'loading') return 'loading'
  if (event === 'held_gate') return flag === 'fraud_review' ? 'fraud_review' : 'held_gate'
  if (event === 'depart_loaded') return flag === 'fraud_review' ? 'fraud_review' : 'departed'
  return event
}

function ticket(t) {
  const declaredTons = t.declaredTons ?? 0
  const weighbridgeTons = t.weighbridgeTons
  const varianceTons =
    weighbridgeTons == null ? null : Math.round((weighbridgeTons - declaredTons) * 10) / 10
  const variancePercent =
    weighbridgeTons == null || declaredTons === 0
      ? weighbridgeTons === 0
        ? -100
        : null
      : Math.round(((weighbridgeTons - declaredTons) / declaredTons) * 1000) / 10
  const flag = t.flag || flagFor(declaredTons, weighbridgeTons, t.event)
  return {
    ...t,
    declaredKg: kg(declaredTons),
    actualKg: weighbridgeTons == null ? 0 : kg(weighbridgeTons),
    plannedKg: kg(declaredTons),
    varianceTons,
    variancePercent,
    flag,
    status: statusFor(t.event, flag)
  }
}

export function createTippers() {
  const rows = [
    {
      id: 'ST-04',
      type: 'Side Tipper',
      event: 'held_gate',
      cargo: 'empty',
      payloadTons: 34,
      declaredTons: 28,
      weighbridgeTons: 0,
      pile: 'Concentrate 50%',
      destination: 'Terminal 2',
      waitMin: 71,
      flag: 'fraud_review',
      note: 'Gate hold — empty ticket vs declared 28 t. Fraud review.'
    },
    {
      id: 'ST-07',
      type: 'Side Tipper',
      event: 'arrive_empty',
      cargo: 'empty',
      payloadTons: 34,
      declaredTons: 0,
      weighbridgeTons: null,
      pile: '—',
      destination: 'ROM Pad',
      waitMin: 8,
      note: 'Empty at weighbridge in. Waiting for a named pile.'
    },
    {
      id: 'ST-09',
      type: 'Side Tipper',
      event: 'held_gate',
      cargo: 'empty',
      payloadTons: 30,
      declaredTons: 26,
      weighbridgeTons: 0,
      pile: 'Concentrate 42%',
      destination: 'Crushed Fines Yard',
      waitMin: 54,
      flag: 'held_gate',
      note: 'Held — no crushed fines. Not a theft flag yet.'
    },
    {
      id: 'ST-11',
      type: 'Side Tipper',
      event: 'depart_loaded',
      cargo: 'loaded',
      payloadTons: 34,
      declaredTons: 34,
      weighbridgeTons: 33.84,
      pile: 'Anthracite Seam A (raw)',
      destination: 'Terminal 2',
      waitMin: 12,
      note: 'Within 1% of declared. Cleared.'
    },
    {
      id: 'ST-12',
      type: 'Side Tipper',
      event: 'loading',
      cargo: 'empty',
      payloadTons: 42,
      declaredTons: 42,
      weighbridgeTons: null,
      pile: 'ROM Coarse (QZ-1)',
      destination: 'ROM Pad',
      waitMin: 6,
      note: 'On the pad. Scale on the way out.'
    },
    {
      id: 'ST-15',
      type: 'Side Tipper',
      event: 'depart_loaded',
      cargo: 'loaded',
      payloadTons: 26,
      declaredTons: 26,
      weighbridgeTons: 25.7,
      pile: 'Washed silica',
      destination: 'Barge Pier C',
      waitMin: 4,
      note: '26 t class. Cleared.'
    },
    {
      id: 'ST-18',
      type: 'Side Tipper',
      event: 'depart_loaded',
      cargo: 'loaded',
      payloadTons: 42,
      declaredTons: 27,
      weighbridgeTons: 31.22,
      pile: 'ROM MG1',
      destination: 'Terminal 2',
      waitMin: 3,
      flag: 'fraud_review',
      note: 'Declared 27 t on a 42 t truck. Weighbridge 31.22 t (+15.6%). Fraud review.'
    }
  ]

  const extra = []
  for (let i = 1; i <= 17; i += 1) {
    const id = `ST-${String(i).padStart(2, '0')}`
    if (rows.some(r => r.id === id)) continue
    extra.push({
      id,
      type: 'Side Tipper',
      event: 'arrive_empty',
      cargo: 'empty',
      payloadTons: 34,
      declaredTons: 0,
      weighbridgeTons: null,
      pile: '—',
      destination: 'ROM Pad',
      waitMin: 12 + i * 3,
      note: 'Empty tipper arrived for loading.'
    })
  }

  const payloads = [34, 30, 42, 26, 34, 34, 30, 42, 26, 34]
  extra.forEach((t, idx) => {
    t.payloadTons = payloads[idx % payloads.length]
    t.destination = ['Terminal 2', 'Crushed Fines Yard', 'ROM Pad'][idx % 3]
  })

  return [...rows, ...extra].map(ticket)
}

export function createWeighbridge(tippers) {
  const source = tippers || createTippers()
  return source
    .filter(t => t.event === 'depart_loaded' || t.event === 'held_gate' || t.weighbridgeTons != null)
    .map(t => ({
      id: `wb-${t.id}`,
      vehicle: t.id,
      pile: t.pile,
      payloadTons: t.payloadTons,
      declaredKg: t.declaredKg,
      actualKg: t.actualKg,
      plannedKg: t.declaredKg,
      variancePercent: t.variancePercent,
      waitMin: t.waitMin,
      status: t.flag,
      flag: t.flag,
      note: t.note
    }))
}

function clock() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

/**
 * Advance one empty arrival into loading, and one loading truck out over the scale.
 * Held trucks (plant down) stay put. ST-18 stays a fraud example.
 */
export function tickGate(mine) {
  const plantDown = mine.plants?.find(p => p.id === 'X17')?.status === 'mechanical_failure'
  let tippers = (mine.tippers || []).map(t => ({
    ...t,
    waitMin: t.event === 'depart_loaded' ? t.waitMin : t.waitMin + 1
  }))

  const loading = tippers.find(t => t.event === 'loading' && t.id !== 'ST-18')
  if (loading) {
    const declaredTons = loading.declaredTons || loading.payloadTons
    const jitter = loading.id === 'ST-12' ? -0.4 : 0.1
    const weighbridgeTons = Math.round((declaredTons + jitter) * 100) / 100
    tippers = tippers.map(t =>
      t.id === loading.id
        ? ticket({
            ...t,
            event: 'depart_loaded',
            cargo: 'loaded',
            declaredTons,
            weighbridgeTons,
            waitMin: 2,
            note: `Departed loaded ${weighbridgeTons} t vs declared ${declaredTons} t (${t.payloadTons} t class).`
          })
        : t
    )
  } else if (!plantDown) {
    const incoming = tippers.find(t => t.event === 'arrive_empty')
    if (incoming) {
      tippers = tippers.map(t =>
        t.id === incoming.id
          ? ticket({
              ...t,
              event: 'loading',
              declaredTons: t.payloadTons,
              pile: t.pile === '—' ? 'ROM Coarse (QZ-1)' : t.pile,
              note: `Loading a ${t.payloadTons} t class tipper.`
            })
          : t
      )
    }
  }

  const departed = tippers.filter(t => t.event === 'depart_loaded').length
  const arriving = tippers.filter(t => t.event === 'arrive_empty').length
  if (departed > 4 && arriving < 3) {
    const recycle = tippers.find(t => t.event === 'depart_loaded' && t.id !== 'ST-18' && t.id !== 'ST-11')
    if (recycle) {
      tippers = tippers.map(t =>
        t.id === recycle.id
          ? ticket({
              ...t,
              event: 'arrive_empty',
              cargo: 'empty',
              declaredTons: 0,
              weighbridgeTons: null,
              pile: '—',
              waitMin: 1,
              flag: undefined,
              note: `Empty return at ${clock()}.`
            })
          : t
      )
    }
  }

  const weighbridge = createWeighbridge(tippers)
  const fraud = fraudRowsFromTippers(tippers)
  const capture = mine.cycleCapture
  return {
    ...mine,
    tippers,
    weighbridge,
    cycleCapture: capture?.production
      ? { ...capture, production: { ...capture.production, fraud } }
      : capture
  }
}

export function fraudRowsFromTippers(tippers = []) {
  return tippers
    .filter(t => t.flag === 'fraud_review')
    .map(t => ({
      id: `fr-${String(t.id).toLowerCase()}`,
      siteId: 'kolar-north',
      vehicle: t.id,
      pile: t.pile,
      plannedKg: t.declaredKg,
      actualKg: t.actualKg,
      varianceKg: t.varianceTons == null ? null : Math.round(t.varianceTons * 1000),
      variancePercent: t.variancePercent,
      flag: t.flag,
      note: t.note
    }))
}

export function gateKpis(tippers = []) {
  const fraud = tippers.filter(t => t.flag === 'fraud_review')
  return {
    arrivedEmpty: tippers.filter(t => t.event === 'arrive_empty').length,
    loading: tippers.filter(t => t.event === 'loading').length,
    departedLoaded: tippers.filter(t => t.event === 'depart_loaded').length,
    held: tippers.filter(t => t.event === 'held_gate').length,
    fraudFlags: fraud.length,
    payloadClasses: PAYLOAD_TONS.join(' / ') + ' t'
  }
}
