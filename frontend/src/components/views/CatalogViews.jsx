import React, { useEffect, useState } from 'react'
import { Send } from 'lucide-react'
import { useVisibleMine, useMineData } from '../../context/useMineData'
import { ROLE_PERSONAS, inboxRole } from '../../data/managerDesk'
import ViewFrame from './ViewFrame'
import DataTable from '../dashboard/DataTable'
import StatusBadge from '../dashboard/StatusBadge'

export default function FeedsView({ currentRole }) {
  const { mine, stats } = useVisibleMine(currentRole)

  return (
    <ViewFrame
      eyebrow="Data feed APIs"
      title={`${stats.feeds} supplier feeds`}
      description="These are the site-report / telemetry suppliers VisualMiner aggregates — not sensors we install in the pit."
    >
      <DataTable
        columns={[
          { key: 'name', label: 'Supplier' },
          { key: 'domain', label: 'Domain' },
          { key: 'status', label: 'Status', render: r => <StatusBadge value={r.status} /> },
          { key: 'latency', label: 'Latency', render: r => `${r.latency} ms` },
          { key: 'lastPayload', label: 'Last payload' }
        ]}
        rows={mine.feeds}
      />
    </ViewFrame>
  )
}

export function GeofenceView({ currentRole }) {
  const { mine } = useVisibleMine(currentRole)
  return (
    <ViewFrame eyebrow="Mines" title="Geofence & zones" description="Six active work / exclusion polygons used by the dummy personnel layer.">
      <DataTable
        columns={[
          { key: 'name', label: 'Zone' },
          { key: 'type', label: 'Type' },
          { key: 'status', label: 'Status', render: r => <StatusBadge value={r.status} /> },
          { key: 'personnel', label: 'People' },
          { key: 'machines', label: 'Machines' }
        ]}
        rows={mine.geofences}
      />
    </ViewFrame>
  )
}

export function ScheduleView({ currentRole }) {
  const { mine } = useVisibleMine(currentRole)
  const { acceptHandover } = useMineData()
  const draft = (mine.handovers || []).find(h => h.status === 'draft')

  return (
    <ViewFrame
      eyebrow="Timetable"
      title="Drilling, blasting, shift handovers"
      description="Between-shift handovers are recorded for the next crew. Dummy blast window tomorrow 14:00."
      actions={
        draft ? (
          <button
            onClick={() => acceptHandover()}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/25 transition cursor-pointer"
          >
            Record B→C handover
          </button>
        ) : null
      }
    >
      <DataTable
        columns={[
          { key: 'fromShift', label: 'From' },
          { key: 'toShift', label: 'To' },
          { key: 'at', label: 'When' },
          { key: 'recordedBy', label: 'Recorded by' },
          { key: 'acceptedBy', label: 'Accepted by' },
          { key: 'status', label: 'Status', render: r => <StatusBadge value={r.status} /> },
          { key: 'notes', label: 'Notes' },
          { key: 'openActions', label: 'Open actions', render: r => (r.openActions || []).join(' · ') }
        ]}
        rows={mine.handovers || []}
      />
      <DataTable
        columns={[
          { key: 'kind', label: 'Kind' },
          { key: 'title', label: 'Activity' },
          { key: 'when', label: 'When' },
          { key: 'status', label: 'Status', render: r => <StatusBadge value={r.status} /> }
        ]}
        rows={mine.schedule}
      />
    </ViewFrame>
  )
}

export function MessagesView({ currentRole }) {
  const { mine, postNote, readInbox } = useVisibleMine(currentRole)
  const [body, setBody] = useState('')
  const [flash, setFlash] = useState(null)
  const worker = currentRole === 'worker'
  const peer = inboxRole(currentRole)
  const counterpart = currentRole === 'mine_manager' ? 'executive' : 'mine_manager'
  const notes = (mine.notes || []).filter(
    n => n.fromRole === peer || n.toRole === peer || n.fromRole === counterpart || n.toRole === counterpart
  )
  const reports = currentRole === 'mine_manager' ? [] : mine.dailyReports || []

  useEffect(() => {
    if (!worker) readInbox(currentRole)
  }, [currentRole, worker, readInbox])

  const handleNote = e => {
    e.preventDefault()
    const note = postNote({
      fromRole: peer,
      toRole: counterpart,
      author: ROLE_PERSONAS[peer]?.name,
      body
    })
    if (note) {
      setBody('')
      setFlash('Note saved in the dummy store. Switch persona to read it on the other desk.')
      window.setTimeout(() => setFlash(null), 4000)
    }
  }

  return (
    <ViewFrame
      scrollPage
      eyebrow={worker ? 'Radio dispatch' : 'Inbox'}
      title={worker ? 'Channels & AI safety alerts' : 'Notes between manager and executives'}
      description={
        worker
          ? 'Dummy dispatch traffic tied to the X17 failure.'
          : 'Daily production reports notify executives. Notes stay on this shared dummy store — switch the header persona to see the other side.'
      }
    >
      {!worker && flash && (
        <div className="shrink-0 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2.5 text-xs text-emerald-200">
          {flash}
        </div>
      )}

      {!worker && reports.length > 0 && (
        <div className="rounded-xl border border-[#232634] bg-[#16171d] p-4 space-y-2 shrink-0">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Daily production reports</div>
          {reports.map(r => (
            <div key={r.id} className="flex items-start justify-between gap-3 text-xs border-b border-[#232530] pb-2 last:border-0 last:pb-0">
              <div>
                <div className="text-slate-200 font-medium">
                  {r.siteName} · {r.tonnes.toLocaleString()} t · {r.trucks} trucks
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Plant {r.plantStatus.replace('_', ' ')}
                  {r.notes ? ` · ${r.notes}` : ''}
                </p>
              </div>
              <span className="text-[10px] font-mono text-slate-500 shrink-0">
                {r.submittedDate} {r.submittedAt}
              </span>
            </div>
          ))}
        </div>
      )}

      {!worker && (
        <div className="rounded-xl border border-[#232634] bg-[#14151c] p-4 space-y-3 shrink-0">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Leave a note for {counterpart.replace('_', ' ')}
          </div>
          <form onSubmit={handleNote} className="space-y-2">
            <textarea
              className="w-full px-3.5 py-2.5 rounded-lg bg-[#1a1c25] border border-[#262835] text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 min-h-[64px] resize-none"
              rows={2}
              required
              value={body}
              onChange={e => setBody(e.target.value)}
              placeholder={`You are ${ROLE_PERSONAS[peer]?.name || peer}…`}
            />
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              Send note
            </button>
          </form>
          <div className="space-y-2">
            {notes.length === 0 && <p className="text-[11px] text-slate-500">No notes yet.</p>}
            {notes.map(n => (
              <div key={n.id} className="rounded-xl border border-[#272b3b] bg-[#191b24] px-3 py-2.5 space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-semibold text-slate-200">
                    {n.author}{' '}
                    <span className="text-slate-500 font-normal">→ {n.toRole.replace('_', ' ')}</span>
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">{n.at}</span>
                </div>
                <p className="text-[12px] text-slate-300 leading-relaxed">{n.body}</p>
                {n.unread && n.toRole === peer && <StatusBadge value="unread" />}
              </div>
            ))}
          </div>
        </div>
      )}

      <DataTable
        columns={[
          { key: 'at', label: 'Time' },
          { key: 'from', label: 'From' },
          { key: 'channel', label: 'Channel' },
          { key: 'text', label: 'Message' },
          { key: 'unread', label: 'State', render: r => (r.unread ? 'New' : 'Read') }
        ]}
        rows={mine.messages}
      />
    </ViewFrame>
  )
}

export function PortsView({ currentRole }) {
  const { mine } = useVisibleMine(currentRole)
  return (
    <ViewFrame
      eyebrow="Customer-Owned Marine Logistics"
      title="Private Ports & Bulk Loading Terminals"
      description="Full transshipment oversight for customer-owned deepwater berths, barge piers, and draft surveys connecting washplants and mines directly to ocean bulk carriers."
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 shrink-0">
        <div className="p-4 rounded-xl border border-[#232634] bg-[#16171d] space-y-1">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Berths Managed</span>
          <div className="text-xl font-bold text-white font-mono">2 Active Berths</div>
          <p className="text-[11px] text-emerald-400">Deepwater & Barge Piers</p>
        </div>
        <div className="p-4 rounded-xl border border-[#232634] bg-[#16171d] space-y-1">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Active Bulk Carrier</span>
          <div className="text-xl font-bold text-white font-mono">MV Deccan Bulk</div>
          <p className="text-[11px] text-amber-400">65,000 DWT Capesize</p>
        </div>
        <div className="p-4 rounded-xl border border-[#232634] bg-[#16171d] space-y-1">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Transshipment Rate</span>
          <div className="text-xl font-bold text-white font-mono">450 t/h</div>
          <p className="text-[11px] text-indigo-400">South Basin Silica Sand Loading</p>
        </div>
      </div>

      <DataTable
        columns={[
          { key: 'name', label: 'Terminal Name' },
          { key: 'berth', label: 'Berth' },
          { key: 'vessel', label: 'Active Vessel' },
          { key: 'status', label: 'Status', render: r => <StatusBadge value={r.status} /> },
          { key: 'note', label: 'Live Dispatch Note' }
        ]}
        rows={mine.ports}
      />
    </ViewFrame>
  )
}
