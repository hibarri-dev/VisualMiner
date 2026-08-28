/** Full mining cycle — what data is relevant at each stage. */

export const SITE_STAGES = [
  {
    id: 'surveying',
    label: 'Surveying',
    color: '#a855f7',
    desc: 'LiDAR and topo to guess where ore might sit. No extraction, no plant.',
    relevant: ['lidar', 'targets']
  },
  {
    id: 'prospecting',
    label: 'Prospecting',
    color: '#38bdf8',
    desc: 'Locate the ore body and send core to lab. Grade matters. No concentrate yet.',
    relevant: ['core', 'lab', 'grade']
  },
  {
    id: 'licensing',
    label: 'Licensing & communities',
    color: '#f472b6',
    desc: 'Permits, rehab bond, and the villages that expect jobs or payment.',
    relevant: ['permits', 'communities', 'rehabPlan']
  },
  {
    id: 'extraction',
    label: 'Extraction',
    color: '#10b981',
    desc: 'Mine the named seam using survey + prospecting. Some sites sell ROM raw (anthracite).',
    relevant: ['oreBodies', 'fleet', 'handovers', 'survey']
  },
  {
    id: 'processing',
    label: 'Processing',
    color: '#f59e0b',
    desc: 'Crush, screen, wash ROM into named concentrate stockpiles by purity.',
    relevant: ['plants', 'stockpiles', 'yield']
  },
  {
    id: 'testing',
    label: 'Testing',
    color: '#818cf8',
    desc: 'Lab confirms stockpile percentages before sale.',
    relevant: ['lab', 'stockpileAssay']
  },
  {
    id: 'transport',
    label: 'Transport',
    color: '#fb923c',
    desc: 'Sold cargo: gate queue, load named piles, weighbridge, then road/rail.',
    relevant: ['gateQueue', 'weighbridge', 'congestion']
  },
  {
    id: 'rehabilitation',
    label: 'Rehabilitation',
    color: '#06b6d4',
    desc: 'Pit is dormant. Monitoring and community close-out only.',
    relevant: ['dormant', 'monitoring', 'community']
  }
]

export function createOreBodies() {
  return [
    { id: 'qz-1', siteId: 'kolar-north', name: 'QZ-1 Quartz Lode', commodity: 'Gold', headGrade: '3.42 g/t Au', status: 'extracting', usesProspecting: true },
    { id: 'qz-2', siteId: 'kolar-north', name: 'QZ-2 Footwall', commodity: 'Gold', headGrade: '1.1 g/t Au', status: 'deferred_low_grade', usesProspecting: true },
    { id: 'mg1', siteId: 'bellary-chrome', name: 'MG1 Chromite (RB1 analogue)', commodity: 'Chrome', headGrade: '24% Cr2O3', status: 'extracting', usesProspecting: true },
    { id: 'mg2', siteId: 'bellary-chrome', name: 'MG2 Chromite (RB2 analogue)', commodity: 'Chrome', headGrade: '18% Cr2O3', status: 'watch_low_grade', usesProspecting: true },
    { id: 'anth-a', siteId: 'talcher-anthracite', name: 'Anthracite Seam A', commodity: 'Anthracite', headGrade: 'Fixed C 86%', status: 'extracting_sell_raw', sellsRaw: true }
  ]
}

export function createShiftHandovers() {
  return [
    {
      id: 'ho-a-b',
      fromShift: 'A',
      toShift: 'B',
      at: '06:05',
      recordedBy: 'Rajesh Reddy',
      acceptedBy: 'Arvind Chopra',
      status: 'accepted',
      notes: 'X17 jaw seized overnight. Do not feed ROM. 17 tippers held at gate. Bench 3 sleepers in.',
      openActions: ['Millwrights on X17', 'Hold weighbridge', 'Keep QZ-2 idle (low grade)']
    },
    {
      id: 'ho-b-c',
      fromShift: 'B',
      toShift: 'C',
      at: '14:00 (due)',
      recordedBy: '—',
      acceptedBy: '—',
      status: 'draft',
      notes: 'To be recorded before 14:00. Current: plant still down, chrome 24% ROM stacking.',
      openActions: ['Write B→C handover', 'Confirm blast 14:00 tomorrow']
    }
  ]
}

export function createLabTests() {
  return [
    { id: 'lab-204', siteId: 'kolar-north', sample: 'Bench 4 North channel', result: '3.42 g/t Au', stage: 'prospecting', status: 'cleared', at: '08:40' },
    { id: 'lab-ch-12', siteId: 'bellary-chrome', sample: 'ROM MG1', result: '24.1% Cr2O3', stage: 'testing', status: 'cleared', at: '07:10' },
    { id: 'lab-ch-13', siteId: 'bellary-chrome', sample: 'Conc 42% pile', result: '41.6% Cr2O3 (off spec vs 42%)', stage: 'testing', status: 'watch', at: '09:02' },
    { id: 'lab-ch-14', siteId: 'bellary-chrome', sample: 'Conc 50% pile', result: '50.2% Cr2O3', stage: 'testing', status: 'cleared', at: '09:04' },
    { id: 'lab-ch-15', siteId: 'bellary-conc-lab', sample: 'Conc 42% pile', result: '41.6% Cr2O3 (off spec vs 42%)', stage: 'testing', status: 'watch', at: '09:02' },
    { id: 'lab-ch-16', siteId: 'bellary-conc-lab', sample: 'Conc 50% pile', result: '50.2% Cr2O3', stage: 'testing', status: 'cleared', at: '09:04' },
    { id: 'lab-ch-17', siteId: 'bellary-conc-lab', sample: 'Conc 60% pile', result: 'no tonnes on pad', stage: 'testing', status: 'watch', at: '09:05' },
    { id: 'lab-cde', siteId: 'chitradurga-prospect', sample: 'Hole CD-18', result: '1.85% Cu, 0.22% Co', stage: 'prospecting', status: 'feasibility', at: 'Today' },
    { id: 'lab-anth-1', siteId: 'talcher-anthracite', sample: 'Seam A ROM (sold raw)', result: 'Fixed carbon 86% — no concentrate plant', stage: 'testing', status: 'cleared', at: '08:15' }
  ]
}

export function createSurveyTargets() {
  return [
    { id: 'tgt-a', siteId: 'kolar-survey-grid', name: 'Anomaly A — west mag high', method: 'Drone LiDAR + ground mag', status: 'follow_up', note: 'No core yet. Surveying only.' },
    { id: 'tgt-b', siteId: 'kolar-survey-grid', name: 'Anomaly B — quartz ridge', method: 'Photogrammetry', status: 'watch', note: 'Possible QZ-1 strike extension.' },
    { id: 'tgt-c', siteId: 'kolar-survey-grid', name: 'Anomaly C — low mag', method: 'Drone LiDAR', status: 'deprioritised', note: 'Likely barren. Do not drill first.' }
  ]
}

export function createWeighbridge() {
  return [
    { id: 'wb-01', vehicle: 'ST-04', pile: 'Concentrate 50%', plannedKg: 28000, actualKg: 0, status: 'held_gate', waitMin: 71 },
    { id: 'wb-02', vehicle: 'ST-09', pile: 'Concentrate 42%', plannedKg: 26000, actualKg: 0, status: 'held_gate', waitMin: 54 },
    { id: 'wb-03', vehicle: 'ST-11', pile: 'Anthracite Seam A (raw)', plannedKg: 30000, actualKg: 29840, status: 'ticketed', waitMin: 12 }
  ]
}

export function createCommunities() {
  return [
    { id: 'com-kolar', siteId: 'kolar-north', village: 'Robertsonpet', households: 420, jobsPromised: 60, jobsFilled: 38, royaltyDueInr: '12.4 L this month', sentiment: 'watch' },
    { id: 'com-bellary', siteId: 'bellary-chrome', village: 'Sandur fringe', households: 180, jobsPromised: 22, jobsFilled: 22, royaltyDueInr: 'paid', sentiment: 'ok' },
    { id: 'com-license', siteId: 'kolar-ml-renewal', village: 'Robertsonpet', households: 420, jobsPromised: 60, jobsFilled: 38, royaltyDueInr: '12.4 L this month', sentiment: 'watch' },
    { id: 'com-void', siteId: 'kolar-old-void', village: 'Robertsonpet close-out', households: 420, jobsPromised: 8, jobsFilled: 8, royaltyDueInr: 'rehab stipend', sentiment: 'ok' }
  ]
}

export function acceptDraftHandover(mine) {
  const at = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  const handovers = (mine.handovers || []).map(h =>
    h.status === 'draft'
      ? {
          ...h,
          status: 'accepted',
          at,
          recordedBy: 'Arvind Chopra',
          acceptedBy: 'Shift C captain',
          notes: 'X17 still degraded. Chrome Conc 42% lab 41.6% off-spec. Hold QZ-2. Tippers stay at gate unless crushed fines exist.'
        }
      : h
  )
  const next = { ...mine, handovers }
  next.insights = buildDailyInsights(next)
  return next
}

export function buildDailyInsights(mine) {
  const queued = (mine.tippers || []).filter(t => t.status === 'queued').length
  const x17 = (mine.plants || []).find(p => p.id === 'X17')
  const conc60 = (mine.stockpiles || []).find(s => s.id === 'sp-conc-60')
  const romChrome = (mine.stockpiles || []).find(s => s.id === 'sp-rom-chrome')
  const handover = (mine.handovers || []).find(h => h.status === 'draft')

  return [
    {
      id: 'ins-yield',
      severity: 'critical',
      area: 'Processing yield',
      title: 'Plant yield is the bottleneck, not the pit',
      detail: x17?.status === 'mechanical_failure'
        ? `Pit still extracts ${mine.production?.extractionTph ?? 170} t/h while X17 crushes ${mine.production?.crushingTph ?? 10} t/h vs 210 nameplate. Money is spent mining ore that cannot become a named concentrate pile.`
        : 'Plant recovering. Watch Conc 42% off-spec vs lab.'
    },
    {
      id: 'ins-grade',
      severity: 'warning',
      area: 'Ore body',
      title: 'High-grade QZ-1 vs deferred QZ-2',
      detail: 'QZ-1 (3.42 g/t) is in extraction. QZ-2 (1.1 g/t) is parked — do not spend fleet hours on low-grade while the plant is down.'
    },
    {
      id: 'ins-chrome',
      severity: 'warning',
      area: 'Chrome concentrate',
      title: '24% ROM is not a sellable product',
      detail: romChrome
        ? `${romChrome.tons} t sitting as ROM Chrome 24%. Target piles: Conc 42% / 50% / 60%. Conc 60% pad is ${conc60?.tons ?? 0} t. Lab flagged Conc 42% at 41.6%.`
        : 'Chrome ROM not stacking.'
    },
    {
      id: 'ins-logistics',
      severity: 'critical',
      area: 'Transport',
      title: `${queued} trucks at the gate, weighbridge idle`,
      detail: 'Sold cargo cannot load named piles. Anthracite raw tickets still clear; chrome/gold crushed loads are blocked.'
    },
    {
      id: 'ins-handover',
      severity: handover ? 'info' : 'ok',
      area: 'Shift handover',
      title: handover ? 'Shift B→C handover not recorded yet' : 'Handovers current',
      detail: handover
        ? handover.notes
        : 'A→B accepted: X17 down, tippers held, QZ-2 idle.'
    },
    {
      id: 'ins-community',
      severity: 'info',
      area: 'Communities',
      title: 'Robertsonpet jobs 38 / 60 promised',
      detail: 'License cycle expects local employment. Rehab bond still active on Kolar North — do not treat the pit as finished.'
    }
  ]
}

export function addSiteToMine(mine, payload) {
  const stage = SITE_STAGES.find(s => s.id === payload.stage) || SITE_STAGES[3]
  const id = `site-${Date.now()}`
  const site = {
    id,
    name: payload.name,
    code: `NEW-${String(mine.sites.length + 1).padStart(2, '0')}`,
    location: payload.location,
    type: payload.type || 'open_pit',
    typeLabel: payload.type === 'wash_plant' ? 'Wash Plant (No Mine)' : payload.type === 'crushing_plant' ? 'Crushing Hub' : payload.type === 'port_terminal' ? 'Customer-Owned Port' : 'Open Pit Mine',
    stage: stage.id,
    stageLabel: stage.label,
    commodity: payload.commodity || 'Unspecified',
    activeAlerts: 0,
    sellsRaw: false,
    testResults: {
      hasData: !payload.skipTestData,
      lithology: payload.lithology || 'Pending',
      assayGrade: payload.assayGrade || 'Pending',
      recoveryRate: 'Pending',
      waterQualityIndex: 'N/A',
      ambientDust: 'N/A',
      lastSurveyDate: new Date().toISOString().slice(0, 10)
    },
    metrics: { extraction: '—', personnel: 0, machines: 0 }
  }
  return { mine: { ...mine, sites: [site, ...mine.sites] }, site }
}
