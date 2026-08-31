/**
 * Shared dummy store for the two-persona demo.
 * Mine Manager writes notes + daily reports here.
 * Executive / logistics UI should READ these arrays (do not replace the shapes).
 *
 * notes:          { id, fromRole, toRole, siteId, author, body, at, unread, attachedTo? }
 * dailyReports:   { id, type, siteId, siteName, tonnes, trucks, plantStatus, notes, submittedAt, submittedDate, submittedBy, fromRole }
 * notifications:  { id, type, forRole, unread, title, detail, siteId, reportId, at }
 */

export const MANAGER_SITE_ID = 'kolar-north'

export const ROLE_PERSONAS = {
  executive: { name: 'Oliver Vance', title: 'Executive · portfolio' },
  mine_manager: { name: 'Rajesh Reddy', title: 'Mine Manager · Kolar North' },
  admin: { name: 'Priya Nair', title: 'Admin' },
  worker: { name: 'Arvind Chopra', title: 'Machine Operator' }
}

export const PLANT_STATUS_OPTIONS = [
  { id: 'normal', label: 'Running' },
  { id: 'degraded', label: 'Degraded — reduced t/h' },
  { id: 'mechanical_failure', label: 'Down — mechanical failure' }
]

function clock() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function todayIso() {
  return new Date().toISOString().slice(0, 10)
}

export function createNotes() {
  return [
    {
      id: 'note-exec-blast',
      fromRole: 'executive',
      toRole: 'mine_manager',
      siteId: MANAGER_SITE_ID,
      author: ROLE_PERSONAS.executive.name,
      body: 'Confirm Bench 3 East blast window stays 14:00 tomorrow. Do not slip it past the storm cell.',
      at: '08:10',
      unread: true
    },
    {
      id: 'note-mgr-x17',
      fromRole: 'mine_manager',
      toRole: 'executive',
      siteId: MANAGER_SITE_ID,
      author: ROLE_PERSONAS.mine_manager.name,
      body: 'X17 still down. Holding tippers at the gate. Daily report will flag plant as mechanical failure.',
      at: '08:22',
      unread: true
    }
  ]
}

export function createDailyReports() {
  return [
    {
      id: 'daily-yesterday',
      type: 'daily_production',
      siteId: MANAGER_SITE_ID,
      siteName: 'Kolar North Open Pit',
      tonnes: 3280,
      trucks: 14,
      plantStatus: 'mechanical_failure',
      notes: 'Crushing starved. ROM stacked. No crushed fines loaded.',
      submittedAt: '17:42',
      submittedDate: '2026-08-30',
      submittedBy: ROLE_PERSONAS.mine_manager.name,
      fromRole: 'mine_manager'
    }
  ]
}

export function createNotifications() {
  return [
    {
      id: 'ntf-yesterday',
      type: 'daily_production',
      forRole: 'executive',
      unread: false,
      title: 'Daily production report · Kolar North Open Pit',
      detail: '3280 t ROM · 14 trucks · plant mechanical_failure',
      siteId: MANAGER_SITE_ID,
      reportId: 'daily-yesterday',
      at: '17:42'
    }
  ]
}

export function sendNote(mine, payload) {
  const fromRole = payload.fromRole || 'mine_manager'
  const toRole = payload.toRole || 'executive'
  const siteId = payload.siteId || MANAGER_SITE_ID
  const note = {
    id: `note-${Date.now()}`,
    fromRole,
    toRole,
    siteId,
    author: payload.author || ROLE_PERSONAS[fromRole]?.name || fromRole,
    body: String(payload.body || '').trim(),
    at: clock(),
    unread: true
  }
  if (!note.body) return { mine, note: null }
  return { mine: { ...mine, notes: [note, ...(mine.notes || [])] }, note }
}

export function submitDailyReport(mine, payload) {
  const siteId = payload.siteId || MANAGER_SITE_ID
  const site = (mine.sites || []).find(s => s.id === siteId)
  const siteName = site?.name || 'Kolar North Open Pit'
  const at = clock()
  const tonnes = Number(payload.tonnes) || 0
  const trucks = Number(payload.trucks) || 0
  const plantStatus = payload.plantStatus || 'degraded'
  const notesText = String(payload.notes || '').trim()

  const report = {
    id: `daily-${Date.now()}`,
    type: 'daily_production',
    siteId,
    siteName,
    tonnes,
    trucks,
    plantStatus,
    notes: notesText,
    submittedAt: at,
    submittedDate: payload.submittedDate || todayIso(),
    submittedBy: ROLE_PERSONAS.mine_manager.name,
    fromRole: 'mine_manager'
  }

  const notification = {
    id: `ntf-${Date.now()}`,
    type: 'daily_production',
    forRole: 'executive',
    unread: true,
    title: `Daily production report · ${siteName}`,
    detail: `${tonnes} t ROM · ${trucks} trucks · plant ${plantStatus}`,
    siteId,
    reportId: report.id,
    at
  }

  let notes = mine.notes || []
  if (notesText) {
    notes = [
      {
        id: `note-${Date.now()}`,
        fromRole: 'mine_manager',
        toRole: 'executive',
        siteId,
        author: ROLE_PERSONAS.mine_manager.name,
        body: notesText,
        at,
        unread: true,
        attachedTo: report.id
      },
      ...notes
    ]
  }

  const siteReport = {
    id: `rep-daily-${Date.now()}`,
    type: 'daily_production',
    title: `Daily production · ${siteName}`,
    summary: `${tonnes} t extracted, ${trucks} trucks dispatched. Plant: ${plantStatus}.${notesText ? ` ${notesText}` : ''}`,
    source: 'Mine Manager daily submit',
    status: 'submitted',
    yieldHint: null,
    zone: siteName,
    at
  }

  return {
    mine: {
      ...mine,
      dailyReports: [report, ...(mine.dailyReports || [])],
      notifications: [notification, ...(mine.notifications || [])],
      notes,
      reports: [siteReport, ...(mine.reports || [])]
    },
    report,
    notification
  }
}

export function inboxRole(role) {
  return role === 'admin' ? 'executive' : role
}

export function markNotificationsRead(mine, role = 'executive') {
  const forRole = inboxRole(role)
  return {
    ...mine,
    notifications: (mine.notifications || []).map(n =>
      n.forRole === forRole ? { ...n, unread: false } : n
    )
  }
}

export function markNotesRead(mine, role = 'executive') {
  const toRole = inboxRole(role)
  return {
    ...mine,
    notes: (mine.notes || []).map(n => (n.toRole === toRole ? { ...n, unread: false } : n))
  }
}

export function markInboxRead(mine, role = 'executive') {
  return markNotesRead(markNotificationsRead(mine, role), role)
}

function siteScoped(rows, siteId) {
  return (rows || []).filter(r => !r.siteId || r.siteId === siteId)
}

function filterCaptureList(block, keys, siteId) {
  if (!block) return block
  const next = { ...block }
  keys.forEach(key => {
    if (Array.isArray(next[key])) next[key] = siteScoped(next[key], siteId)
  })
  return next
}

export function filterMineForManager(mine, siteId = MANAGER_SITE_ID) {
  const capture = mine.cycleCapture
  return {
    ...mine,
    sites: (mine.sites || []).filter(s => s.id === siteId),
    oreBodies: siteScoped(mine.oreBodies, siteId),
    stockpiles: siteScoped(mine.stockpiles, siteId),
    labTests: siteScoped(mine.labTests, siteId),
    communities: siteScoped(mine.communities, siteId),
    surveyTargets: siteScoped(mine.surveyTargets, siteId),
    dailyReports: siteScoped(mine.dailyReports, siteId),
    notes: (mine.notes || []).filter(
      n => n.siteId === siteId && (n.fromRole === 'mine_manager' || n.toRole === 'mine_manager')
    ),
    notifications: siteScoped(mine.notifications, siteId),
    insights: (mine.insights || []).filter(i =>
      ['ins-yield', 'ins-grade', 'ins-logistics', 'ins-handover'].includes(i.id)
    ),
    cycleCapture: capture
      ? {
          ...capture,
          surveying: filterCaptureList(capture.surveying, ['flights'], siteId),
          prospecting: filterCaptureList(capture.prospecting, ['collars', 'intercepts'], siteId),
          production: filterCaptureList(capture.production, [
            'blasts',
            'extraction',
            'diesel',
            'fraud',
            'weather',
            'licenses',
            'coal'
          ], siteId)
        }
      : capture
  }
}
