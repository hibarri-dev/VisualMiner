import React from 'react'
import { useVisibleMine } from '../../context/useMineData'
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
  return (
    <ViewFrame eyebrow="Timetable" title="Drilling, blasting, shifts" description="Dummy shift plan. Blast window tomorrow 14:00 is the safety overlay.">
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
    <ViewFrame eyebrow="Harbor" title="Terminal 2" description="Bulk loading blocked because crushed stockpiles are empty.">
      <DataTable
        columns={[
          { key: 'name', label: 'Terminal' },
          { key: 'berth', label: 'Berth' },
          { key: 'vessel', label: 'Vessel' },
          { key: 'status', label: 'Status', render: r => <StatusBadge value={r.status} /> },
          { key: 'note', label: 'Note' }
        ]}
        rows={mine.ports}
      />
    </ViewFrame>
  )
}
