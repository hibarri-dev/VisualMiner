import React, { useMemo } from 'react'
import { useVisibleMine } from '../../context/useMineData'
import { REPORT_TYPES } from '../../data'
import ViewFrame from './ViewFrame'
import DataTable from '../dashboard/DataTable'
import StatusBadge from '../dashboard/StatusBadge'

const SUB_TYPE = {
  'rep-inspection': 'inspection',
  'rep-maintenance': 'maintenance',
  'rep-geological': 'geological',
  'rep-blast': 'blast',
  'rep-safety': 'safety',
  'rep-engineering': 'engineering',
  'rep-sops': 'sops',
  'rep-permits': 'permits',
  'rep-environmental': 'environmental',
  'rep-contractor': 'contractor'
}

export default function SiteReportsView({ activeSubTab, currentRole, onOpenModal }) {
  const { mine, selectedReportId, setSelectedReportId } = useVisibleMine(currentRole)
  const type = SUB_TYPE[activeSubTab]
  const rows = useMemo(() => mine.reports.filter(r => !type || r.type === type), [mine.reports, type])
  const selected = mine.reports.find(r => r.id === selectedReportId) || rows[0]
  const typeName = REPORT_TYPES.find(t => t.id === selected?.type)?.name

  return (
    <ViewFrame
      eyebrow="Aggregated site reports"
      title="10 report feeds · AI overlay"
      description="Dummy supplier payloads (lab, CMMS, Deswik, safety). Ingesting a report writes back into live KPIs."
      actions={
        <button
          onClick={() => onOpenModal('submit-report')}
          className="px-3 py-1.5 rounded-lg text-[11px] font-semibold bg-indigo-600 hover:bg-indigo-500 text-white"
        >
          Submit Report
        </button>
      }
    >
      <div className="flex-1 min-h-0 grid grid-cols-[1.2fr_0.8fr] gap-3">
        <DataTable
          selectedId={selected?.id}
          onSelect={row => setSelectedReportId(row.id)}
          columns={[
            { key: 'at', label: 'When' },
            { key: 'title', label: 'Report' },
            { key: 'type', label: 'Feed' },
            { key: 'zone', label: 'Zone' },
            { key: 'status', label: 'Status', render: r => <StatusBadge value={r.status} /> }
          ]}
          rows={rows}
        />
        {selected && (
          <aside className="rounded-xl border border-[#232634] bg-[#16171d] p-4 space-y-3 overflow-y-auto">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{typeName}</div>
            <h2 className="text-base font-semibold text-white">{selected.title}</h2>
            <p className="text-[13px] text-slate-300 leading-relaxed">{selected.summary}</p>
            <div className="text-[12px] text-slate-400 space-y-1">
              <div>Source: {selected.source}</div>
              <div>Zone: {selected.zone}</div>
              {selected.yieldHint && <div>Yield hint: {selected.yieldHint}</div>}
            </div>
          </aside>
        )}
      </div>
    </ViewFrame>
  )
}
