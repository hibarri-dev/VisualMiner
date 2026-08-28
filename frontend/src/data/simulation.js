import { SITE, GEOFENCES, PORTS, WORKER_PERSONA } from './catalog'
import { createMachines, MACHINE_TYPES } from './machines'
import { createPersonnel } from './personnel'
import {
  createProduction,
  createPlants,
  createStockpiles,
  createTippers,
  createAlerts,
  createSchedule,
  createMessages,
  createFeeds
} from './operations'
import { createSiteReports } from './siteReports'
import { clamp, mulberry32, randInt, uniqueCode } from './rng'

export function createMineState() {
  const machines = createMachines()
  const personnel = createPersonnel(machines)
  return {
    site: SITE,
    machines,
    personnel,
    production: createProduction(),
    plants: createPlants(),
    stockpiles: createStockpiles(),
    tippers: createTippers(),
    alerts: createAlerts(),
    feeds: createFeeds(),
    reports: createSiteReports(),
    geofences: GEOFENCES.map(g => ({ ...g })),
    schedule: createSchedule(),
    messages: createMessages(),
    ports: PORTS.map(p => ({ ...p })),
    lastTickAt: Date.now()
  }
}

function pushHistory(series, value, max = 12) {
  return [...series.slice(-(max - 1)), value]
}

function refreshNarrative(mine) {
  const crushed = mine.stockpiles.find(s => s.id === 'sp-crushed')
  const x17 = mine.plants.find(p => p.id === 'X17')
  const queue = mine.tippers.filter(t => t.status === 'queued').length
  const failureLine =
    x17?.status === 'mechanical_failure'
      ? 'Mechanical failure plant X17'
      : x17?.status === 'degraded'
        ? `Plant X17 degraded — ${x17.throughputTph} t/h`
        : `Plant X17 running ${x17?.throughputTph ?? 0} t/h`

  return {
    ...mine.production,
    narrative: {
      extraction: [
        `${mine.production.extractionTph} tons per hour`,
        `${mine.production.predictedTpd} tons per day predicted yield`
      ],
      throughput: [
        `${mine.production.crushingTph} tons per hour crushing`,
        `${mine.production.screeningTph} tons per hour screening`,
        failureLine
      ],
      shipments: [
        `${queue} Side Tippers in queue`,
        x17?.status === 'mechanical_failure' ? 'Processing plant delays' : 'Processing recovering',
        crushed?.tons === 0 ? 'No crushed stockpiles loaded' : `${crushed.tons} t crushed fines on pad`
      ]
    }
  }
}

export function tickMine(mine) {
  const rng = mulberry32((Date.now() ^ 0x9e3779b9) >>> 0)

  const machines = mine.machines.map(m => {
    if (m.featured && m.id === 'X7UIH53') {
      return {
        ...m,
        fuelPercent: Math.round(clamp(m.fuelPercent + (rng() - 0.5) * 0.6, 84, 90) * 10) / 10,
        payloadKg: Math.round(clamp(m.payloadKg + (rng() - 0.5) * 90, 6500, 6900))
      }
    }
    if (m.status === 'Breakdown' || m.status === 'Maintenance') {
      return { ...m, fuelPercent: m.fuelPercent }
    }
    const nextFuel = clamp(m.fuelPercent - rng() * 0.35, 8, 100)
    const payloadDelta = m.type === 'haul_truck' ? Math.round((rng() - 0.45) * 1200) : 0
    return {
      ...m,
      fuelPercent: Math.round(nextFuel * 10) / 10,
      payloadKg:
        m.type === 'haul_truck'
          ? Math.round(clamp(m.payloadKg + payloadDelta, 0, m.payloadCapacityKg || 90000))
          : 0,
      x: m.onMap ? clamp(m.x + (rng() - 0.5) * 0.6, 8, 92) : m.x,
      y: m.onMap ? clamp(m.y + (rng() - 0.5) * 0.6, 10, 90) : m.y
    }
  })

  const personnel = mine.personnel.map(p => {
    if (p.featured && p.id === 'arvind-chopra') return p
    if (!p.onMap) return p
    return {
      ...p,
      x: clamp(p.x + (rng() - 0.5) * 0.5, 8, 92),
      y: clamp(p.y + (rng() - 0.5) * 0.5, 8, 90)
    }
  })

  const extractionTph = Math.round(clamp(mine.production.extractionTph + (rng() - 0.5) * 2.4, 166, 174))
  const crushingLocked = mine.plants.find(p => p.id === 'X17')?.status === 'mechanical_failure'
  const crushingTph = crushingLocked
    ? Math.round(clamp(mine.production.crushingTph + (rng() - 0.5) * 0.6, 8, 12))
    : Math.round(clamp(mine.production.crushingTph + (rng() - 0.45) * 3, 10, 90))
  const screeningTph = crushingLocked
    ? Math.round(clamp(mine.production.screeningTph + (rng() - 0.5) * 0.4, 4, 6))
    : Math.round(clamp(crushingTph * 0.5, 4, 80))

  const feeds = mine.feeds.map(f => ({
    ...f,
    latency: Math.max(12, Math.round(f.latency + (rng() - 0.5) * 8))
  }))

  const production = refreshNarrative({
    ...mine,
    machines,
    production: {
      ...mine.production,
      extractionTph,
      crushingTph,
      screeningTph,
      extractionHistory: pushHistory(mine.production.extractionHistory, extractionTph),
      crushingHistory: pushHistory(mine.production.crushingHistory, crushingTph),
      shipmentHistory: pushHistory(mine.production.shipmentHistory, mine.production.shipmentMovementPercent)
    }
  })

  return {
    ...mine,
    machines,
    personnel,
    production,
    feeds,
    lastTickAt: Date.now()
  }
}

export function ingestSiteReport(mine, submission) {
  const { type, title, notes } = submission
  const now = new Date()
  const at = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  const report = {
    id: `rep-${Date.now()}`,
    type,
    title: title || `${type} report`,
    summary: notes || `Ingested ${type} report. Model recalibrated against live telemetry.`,
    source: 'Site Report ingest',
    status: 'ai_updated',
    yieldHint: null,
    zone: 'Bench 4 North',
    at
  }

  let next = {
    ...mine,
    reports: [report, ...mine.reports]
  }

  let predictedYieldChange = '+0.0%'
  let geofenceAffected = 'Bench 4 North'
  let summary = `AI interpreted the ${type} report.`

  if (type === 'geological') {
    const predictedTpd = Math.round(mine.production.predictedTpd * 1.032)
    const weekTrendPercent = Math.round((mine.production.weekTrendPercent + 3.2) * 10) / 10
    predictedYieldChange = '+3.2%'
    geofenceAffected = 'Bench 4 North'
    summary = `Geological yield model updated with +3.2% efficiency adjustment. Predicted day output ${predictedTpd} t.`
    report.yieldHint = '+3.2%'
    next = {
      ...next,
      production: {
        ...next.production,
        predictedTpd,
        weekTrendPercent
      }
    }
  } else if (type === 'maintenance') {
    geofenceAffected = 'Crusher X17 Exclusion'
    predictedYieldChange = '+0.0% (throughput restoring)'
    summary =
      'Maintenance report applied. Plant X17 marked degraded, crushing lifted off the floor, side-tipper queue starting to clear.'
    next = {
      ...next,
      plants: next.plants.map(p =>
        p.id === 'X17'
          ? { ...p, status: 'degraded', throughputTph: 48, note: 'Jaw freed — commissioning at reduced load' }
          : p.id === 'SCR-1'
            ? { ...p, status: 'normal', throughputTph: 22, note: 'Taking restored crusher feed' }
            : p
      ),
      production: {
        ...next.production,
        crushingTph: 48,
        screeningTph: 22,
        crushingWeekTrendPercent: -12,
        shipmentMovementPercent: 8
      },
      stockpiles: next.stockpiles.map(s =>
        s.id === 'sp-crushed' ? { ...s, tons: 180, status: 'ok' } : s
      ),
      tippers: next.tippers.map((t, i) =>
        i < 5 ? { ...t, status: 'dispatched', waitMin: 0, cargo: 'crushed fines' } : t
      ),
      alerts: next.alerts.map(a =>
        a.id === 'al-x17'
          ? { ...a, severity: 'warning', title: 'Plant X17 degraded — commissioning', detail: 'Crushing 48 t/h after jaw reset.' }
          : a
      )
    }
  } else if (type === 'blast') {
    geofenceAffected = 'Bench 3 East Blast Radius'
    summary = 'Blast report synced. Exclusion geofence remains armed for tomorrow 14:00.'
  } else if (type === 'safety') {
    geofenceAffected = 'Crusher X17 Exclusion'
    summary = 'Safety report logged. L2 clearance broadcast retained on the pit map.'
  } else if (type === 'environmental') {
    geofenceAffected = 'Bench 1 Rim'
    summary = 'Environmental sensors ingested. Dust cart already on Bench 1 — no production change.'
  } else {
    summary = `AI has analyzed the ${type} report. Geological yield model held; telemetry overlay refreshed.`
  }

  next = {
    ...next,
    production: refreshNarrative(next)
  }

  return {
    mine: next,
    aiResult: {
      summary,
      predictedYieldChange,
      geofenceAffected,
      timestamp: at,
      syncedFeeds: 'CAT Fleet, Deswik, Micromine'
    }
  }
}

export function addMachineToMine(mine, { type, name }) {
  const rng = mulberry32(Date.now() >>> 0)
  const used = new Set(mine.machines.map(m => m.id))
  const spec = MACHINE_TYPES[type] || MACHINE_TYPES.haul_truck
  const id = uniqueCode(rng, used)
  const machine = {
    id,
    name: name || `${spec.models[0]} (manual)`,
    type: MACHINE_TYPES[type] ? type : 'haul_truck',
    fuelPercent: 100,
    payloadKg: 0,
    payloadCapacityKg: type === 'haul_truck' ? 90000 : 0,
    status: 'Idle',
    bench: 'Heavy Workshop',
    zone: 'Heavy Workshop',
    x: 82,
    y: 18,
    onMap: type === 'haul_truck',
    featured: false
  }
  return { mine: { ...mine, machines: [machine, ...mine.machines] }, machine }
}

export function addPersonToMine(mine, payload) {
  const idBase = payload.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
  const id = mine.personnel.some(p => p.id === idBase) ? `${idBase}-${randInt(mulberry32(Date.now() >>> 0), 2, 99)}` : idBase
  const person = {
    id,
    name: payload.name,
    age: Number(payload.age) || 30,
    role: payload.role || 'Machine Operator',
    roleGroup: payload.roleGroup || 'operators',
    clearanceLevel: Number(payload.clearanceLevel) || 1,
    assignedMachineId: payload.assignedMachineId || null,
    zone: payload.zone || 'ROM Pad',
    status: 'on_shift',
    shift: 'B',
    x: 50,
    y: 50,
    onMap: true,
    featured: false
  }
  return { mine: { ...mine, personnel: [person, ...mine.personnel] }, person }
}

export function buildSearchIndex(mine) {
  const machines = mine.machines.slice(0, 12).map(m => ({
    type: 'machine',
    id: m.id,
    title: `${m.id} (${MACHINE_TYPES[m.type]?.label || m.type})`,
    subtitle: `Payload: ${m.payloadKg}kg • Fuel: ${Math.round(m.fuelPercent)}%`,
    tag: m.status
  }))
  const people = mine.personnel
    .filter(p => p.featured || p.status === 'on_shift')
    .slice(0, 10)
    .map(p => ({
      type: 'worker',
      id: p.id,
      title: p.name,
      subtitle: `${p.role} • Clearance L${p.clearanceLevel}`,
      tag: p.zone
    }))
  const plants = mine.plants.map(p => ({
    type: 'zone',
    id: p.id,
    title: p.name,
    subtitle: `Throughput ${p.throughputTph} t/h • ${p.note}`,
    tag: p.status === 'mechanical_failure' ? 'Alert' : p.status
  }))
  const reports = mine.reports.slice(0, 8).map(r => ({
    type: 'report',
    id: r.id,
    title: r.title,
    subtitle: r.summary,
    tag: 'Site Report'
  }))

  const featured = [
    machines.find(m => m.id === 'X7UIH53'),
    people.find(p => p.id === 'arvind-chopra'),
    plants.find(p => p.id === 'X17'),
    reports.find(r => r.id === 'rep-assay-204')
  ].filter(Boolean)

  const rest = [...machines, ...people, ...plants, ...reports].filter(
    item => !featured.some(f => f.type === item.type && f.id === item.id)
  )
  return [...featured, ...rest]
}

export function liveStats(mine) {
  const activeMachines = mine.machines.filter(m => m.status !== 'Breakdown' && m.status !== 'Maintenance').length
  const onSite = mine.personnel.filter(p => p.status !== 'off_site').length
  const operators = mine.personnel.filter(p => p.roleGroup === 'operators').length
  const geologists = mine.personnel.filter(p => p.roleGroup === 'geologists').length
  const safety = mine.personnel.filter(p => p.roleGroup === 'safety').length
  const haulers = mine.machines.filter(m => m.type === 'haul_truck').length
  const excavators = mine.machines.filter(m => m.type === 'excavator').length
  const drills = mine.machines.filter(m => m.type === 'drill').length
  const queued = mine.tippers.filter(t => t.status === 'queued').length
  const unread = mine.messages.filter(m => m.unread).length
  const x17 = mine.plants.find(p => p.id === 'X17')

  return {
    machinesActive: activeMachines,
    machinesTotal: mine.machines.length,
    haulers,
    excavators,
    drills,
    onSite,
    personnelTotal: mine.personnel.length,
    operators,
    geologists,
    safety,
    queuedTippers: queued,
    unreadMessages: unread,
    extractionTph: mine.production.extractionTph,
    crushingTph: mine.production.crushingTph,
    screeningTph: mine.production.screeningTph,
    weekTrendPercent: mine.production.weekTrendPercent,
    feeds: mine.feeds.length,
    plantAlert: x17?.status === 'mechanical_failure',
    geofencesActive: mine.geofences.filter(g => g.status === 'active' || g.status === 'armed').length
  }
}

export function filterMineForRole(mine, role) {
  if (role !== 'worker') return mine
  const person = mine.personnel.find(p => p.id === WORKER_PERSONA.personId)
  const machine = mine.machines.find(m => m.id === WORKER_PERSONA.machineId)
  return {
    ...mine,
    machines: machine ? [machine] : [],
    personnel: person ? [person] : [],
    messages: mine.messages.filter(m => m.channel !== 'Process')
  }
}
