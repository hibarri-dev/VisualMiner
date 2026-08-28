import React, { useMemo } from 'react'
import { useVisibleMine } from '../../context/useMineData'
import { MACHINE_TYPES } from '../../data'
import ViewFrame from './ViewFrame'
import DataTable from '../dashboard/DataTable'
import StatusBadge from '../dashboard/StatusBadge'

const SUB_FILTERS = {
  'mach-haulers': 'haul_truck',
  'mach-excavators': 'excavator',
  'mach-drills': 'drill'
}

export default function FleetView({ activeSubTab, currentRole, onOpenModal }) {
  const { mine, selectedMachineId, setSelectedMachineId, stats } = useVisibleMine(currentRole)
  const typeFilter = SUB_FILTERS[activeSubTab]

  const rows = useMemo(() => {
    return mine.machines.filter(m => !typeFilter || m.type === typeFilter)
  }, [mine.machines, typeFilter])

  return (
    <ViewFrame
      eyebrow="Yellow fleet"
      title={`${stats.machinesTotal} machines · ${stats.machinesActive} active`}
      description="Live fuel, payload and status from CAT Fleet + Hexagon. Positions are dummy pit coordinates for Sahil's 3D layer."
      actions={
        <button
          onClick={() => onOpenModal('add-machine')}
          className="px-3 py-1.5 rounded-lg text-[11px] font-semibold bg-indigo-600 hover:bg-indigo-500 text-white"
        >
          Add Machine
        </button>
      }
    >
      <div className="grid grid-cols-4 gap-2 shrink-0">
        {[
          ['Haul trucks', stats.haulers],
          ['Excavators', stats.excavators],
          ['Drill rigs', stats.drills],
          ['Breakdown / maint.', mine.machines.filter(m => m.status === 'Breakdown' || m.status === 'Maintenance').length]
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
          { key: 'status', label: 'Status', render: r => <StatusBadge value={r.status} /> },
          { key: 'fuelPercent', label: 'Fuel', render: r => `${Math.round(r.fuelPercent)}%` },
          { key: 'payloadKg', label: 'Payload', render: r => `${r.payloadKg} kg` },
          { key: 'bench', label: 'Bench' },
          { key: 'zone', label: 'Zone' }
        ]}
        rows={rows}
      />
    </ViewFrame>
  )
}
