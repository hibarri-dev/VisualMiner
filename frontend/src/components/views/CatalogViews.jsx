import React from 'react'
import { Anchor, Ship, ArrowUpRight, CheckCircle2, Clock, Layers } from 'lucide-react'
import { useVisibleMine, useMineData } from '../../context/useMineData'
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
          { key: 'latency', label: 'Latency', render: r => `${r.latency} ms` }
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
          { key: 'notes', label: 'Notes' }
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
  const { mine } = useVisibleMine(currentRole)
  return (
    <ViewFrame eyebrow="Radio dispatch" title="Channels & AI safety alerts" description="Dummy dispatch traffic tied to the X17 failure.">
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
