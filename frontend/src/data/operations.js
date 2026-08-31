import { mulberry32 } from './rng'
import { FEED_CATALOG, PLANTS, STOCKPILES } from './catalog'

function sparkline(rng, points, center, spread, digits = 0) {
  const series = []
  for (let i = 0; i < points; i += 1) {
    const n = center + (rng() - 0.5) * 2 * spread
    const f = 10 ** digits
    series.push(Math.round(n * f) / f)
  }
  return series
}

export function createProduction() {
  const rng = mulberry32(110022)
  const extractionHistory = sparkline(rng, 12, 168, 6)
  extractionHistory[extractionHistory.length - 1] = 170
  const crushingHistory = sparkline(rng, 12, 18, 4)
  crushingHistory[crushingHistory.length - 1] = 10
  const shipmentHistory = sparkline(rng, 12, 0.4, 0.4)
  return {
    extractionTph: 170,
    predictedTpd: 3400,
    weekTrendPercent: 5,
    crushingTph: 10,
    screeningTph: 5,
    washingTph: 4,
    crushingWeekTrendPercent: -51,
    shipmentMovementPercent: 0,
    extractionHistory,
    crushingHistory,
    shipmentHistory,
    narrative: {
      extraction: ['170 tons per hour', '3400 tons per day predicted yield'],
      throughput: [
        '10 tons per hour crushing',
        '5 tons per hour screening',
        'Mechanical failure plant X17'
      ],
      shipments: [
        '17 Side Tippers in queue',
        'Processing plant delays',
        'No crushed stockpiles loaded'
      ]
    }
  }
}

export function createPlants() {
  return PLANTS.map(p => ({ ...p }))
}

export function createStockpiles() {
  return STOCKPILES.map(s => ({ ...s }))
}

export { createTippers } from './logistics'

export function createAlerts() {
  return [
    {
      id: 'al-x17',
      severity: 'critical',
      title: 'Mechanical failure plant X17',
      detail: 'Primary jaw crusher seized. Crushing 10 t/h vs 210 t/h nameplate.',
      assetId: 'X17',
      source: 'SCADA Telemetry'
    },
    {
      id: 'al-queue',
      severity: 'warning',
      title: '17 side tippers queued',
      detail: 'No crushed stock to load. Dispatch frozen at 0% movement.',
      assetId: 'shipments',
      source: 'SAP ERP'
    },
    {
      id: 'al-blast',
      severity: 'info',
      title: 'Blast window tomorrow 14:00',
      detail: 'Bench 3 East exclusion geofence armed. Clear personnel by 13:20.',
      assetId: 'gf-blast',
      source: 'Deswik Mine Planning'
    }
  ]
}

export function createSchedule() {
  return [
    { id: 'sch-1', kind: 'drilling', title: 'Bench 5 pattern 18 holes', when: 'Today 11:00–15:30', status: 'in_progress' },
    { id: 'sch-2', kind: 'blasting', title: 'Bench 3 East production blast', when: 'Tomorrow 14:00', status: 'scheduled' },
    { id: 'sch-3', kind: 'shift', title: 'Shift B → C handover', when: 'Today 14:00', status: 'scheduled' },
    { id: 'sch-4', kind: 'maintenance', title: 'X17 jaw replacement', when: 'Today — ongoing', status: 'critical' },
    { id: 'sch-5', kind: 'drilling', title: 'Pre-split Bench 2 West', when: 'Tomorrow 06:00', status: 'scheduled' }
  ]
}

export function createMessages() {
  return [
    { id: 'msg-1', from: 'Dispatch', channel: 'Haul', text: 'Hold all side tippers at ROM. Crusher X17 down.', unread: true, at: '09:12' },
    { id: 'msg-2', from: 'Safety', channel: 'All', text: 'X17 exclusion zone live. L2 clearance only.', unread: true, at: '09:18' },
    { id: 'msg-3', from: 'Plant', channel: 'Process', text: 'Millwright ETA 40 min. Do not feed jaw.', unread: true, at: '09:21' },
    { id: 'msg-4', from: 'Geology', channel: 'Pit', text: 'Assay 204: Bench 4 North grade +3.1% vs model.', unread: false, at: '08:44' },
    { id: 'msg-5', from: 'Blast crew', channel: 'Bench 3', text: 'Sleepers in. Stemming starts 06:30 tomorrow.', unread: false, at: '08:02' }
  ]
}

export function createFeeds() {
  return FEED_CATALOG.map(f => ({ ...f }))
}
