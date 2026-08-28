import React, { useMemo } from 'react'
import { useVisibleMine } from '../../context/useMineData'
import ViewFrame from './ViewFrame'
import DataTable from '../dashboard/DataTable'
import StatusBadge from '../dashboard/StatusBadge'

const SUB_FILTERS = {
  'hum-operators': 'operators',
  'hum-geologists': 'geologists',
  'hum-safety': 'safety'
}

export default function HumansView({ activeSubTab, currentRole, onOpenModal }) {
  const { mine, selectedPersonId, setSelectedPersonId, stats } = useVisibleMine(currentRole)
  const group = SUB_FILTERS[activeSubTab]

  const rows = useMemo(() => {
    return mine.personnel.filter(p => !group || p.roleGroup === group)
  }, [mine.personnel, group])

  return (
    <ViewFrame
      eyebrow="RFID / IoT tags"
      title={`${stats.onSite} on site · ${stats.personnelTotal} in roster`}
      description="Dummy personnel tags with clearance and machine assignment. Worker role only sees Arvind Chopra's slice."
      actions={
        <button
          onClick={() => onOpenModal('add-person')}
          className="px-3 py-1.5 rounded-lg text-[11px] font-semibold bg-indigo-600 hover:bg-indigo-500 text-white"
        >
          Add Person
        </button>
      }
    >
      <div className="grid grid-cols-4 gap-2 shrink-0">
        {[
          ['Operators', stats.operators],
          ['Geologists & engineers', stats.geologists],
          ['Safety', stats.safety],
          ['On shift', mine.personnel.filter(p => p.status === 'on_shift').length]
        ].map(([label, n]) => (
          <div key={label} className="rounded-xl border border-[#232634] bg-[#16171d] px-3 py-2">
            <div className="text-[10px] text-slate-500 uppercase tracking-wider">{label}</div>
            <div className="text-lg font-semibold text-white font-mono">{n}</div>
          </div>
        ))}
      </div>
      <DataTable
        selectedId={selectedPersonId}
        onSelect={row => setSelectedPersonId(row.id)}
        columns={[
          { key: 'name', label: 'Name' },
          { key: 'age', label: 'Age' },
          { key: 'role', label: 'Role' },
          { key: 'clearanceLevel', label: 'Clearance', render: r => `Level ${r.clearanceLevel}` },
          { key: 'assignedMachineId', label: 'Machine', render: r => r.assignedMachineId || '—' },
          { key: 'zone', label: 'Zone' },
          { key: 'shift', label: 'Shift' },
          { key: 'status', label: 'Status', render: r => <StatusBadge value={r.status} /> }
        ]}
        rows={rows}
      />
    </ViewFrame>
  )
}
