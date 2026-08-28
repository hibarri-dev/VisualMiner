import React, { useMemo } from 'react'
import { useVisibleMine } from '../../context/useMineData'
import { MACHINE_TYPES } from '../../data'
import ViewFrame from './ViewFrame'
import DataTable from '../dashboard/DataTable'
import StatusBadge from '../dashboard/StatusBadge'

const SUB_FILTERS = {
  'mach-haulers': ['haul_truck'],
  'mach-excavators': ['excavator', 'shovel'],
  'mach-loaders': ['front_loader'],
  'mach-dozers': ['dozer', 'grader'],
  'mach-drills': ['drill'],
  'mach-support': ['water_truck', 'fuel_truck']
}

export default function FleetView({ activeSubTab, currentRole, onOpenModal }) {
  const { mine, selectedMachineId, setSelectedMachineId, stats } = useVisibleMine(currentRole)
  const typeFilter = SUB_FILTERS[activeSubTab]

  const rows = useMemo(() => {
    return mine.machines.filter(m => !typeFilter || typeFilter.includes(m.type))
  }, [mine.machines, typeFilter])

  return (
    <ViewFrame
      eyebrow="Yellow fleet"
      title={`${stats.machinesTotal} machines · ${stats.machinesActive} tracked live`}
      description="Pick a class in Add Machine, attach a GPS tracker, and the unit runs the pit haul / bench loop."
      actions={
        <button
          onClick={() => onOpenModal('add-machine')}
          className="px-3 py-1.5 rounded-lg text-[11px] font-semibold bg-amber-500 hover:bg-amber-400 text-[#1a1205]"
        >
          Add Machine
        </button>
      }
    >
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 shrink-0">
        {[
          ['Dump trucks', stats.haulers],
          ['Excavators', stats.excavators],
          ['Loaders', stats.loaders],
          ['Dozers / graders', stats.dozers],
          ['Drills', stats.drills],
          ['Water / fuel', stats.support]
        ].map(([label, n]) => (
          <div key={label} className="rounded-xl border border-[#232634] bg-[#16171d] px-3 py-2">
            <div className="text-[10px] text-slate-500 uppercase tracking-wider">{label}</div>
            <div className="text-lg font-semibold text-white font-mono">{n}</div>
          </div>
        ))}
      </div>
      <DataTable
        selectedId={selectedMachineId}
        onSelect={row => setSelectedMachineId(row.id)}
        columns={[
          { key: 'id', label: 'ID' },
          { key: 'name', label: 'Asset' },
          { key: 'type', label: 'Class', render: r => MACHINE_TYPES[r.type]?.label || r.type },
          { key: 'trackerId', label: 'Tracker', render: r => r.trackerId || '—' },
          { key: 'status', label: 'Status', render: r => <StatusBadge value={r.status} /> },
          { key: 'fuelPercent', label: 'Fuel', render: r => `${Math.round(r.fuelPercent)}%` },
          { key: 'payloadKg', label: 'Payload', render: r => `${r.payloadKg} kg` },
          { key: 'bench', label: 'Bench' }
        ]}
        rows={rows}
      />
    </ViewFrame>
  )
}
