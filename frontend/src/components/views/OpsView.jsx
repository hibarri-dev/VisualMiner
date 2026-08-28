import React from 'react'
import { useVisibleMine } from '../../context/useMineData'
import ViewFrame from './ViewFrame'
import DataTable from '../dashboard/DataTable'
import StatusBadge from '../dashboard/StatusBadge'
import Sparkline from '../dashboard/Sparkline'

function Kpi({ label, value, hint, color, series }) {
  return (
    <div className="rounded-xl border border-[#232634] bg-[#16171d] p-4 space-y-2">
      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{label}</div>
      <div className="text-2xl font-semibold text-white tracking-tight">{value}</div>
      {hint && <div className="text-[12px] text-slate-400">{hint}</div>}
      {series && <Sparkline values={series} color={color} />}
    </div>
  )
}

export default function OpsView({ activeTab, currentRole }) {
  const { mine, stats } = useVisibleMine(currentRole)
  const crushed = mine.stockpiles.find(s => s.id === 'sp-crushed')
  const x17 = mine.plants.find(p => p.id === 'X17')

  const titles = {
    production: ['Production', 'Pit extraction vs plant bottleneck — the demo story.'],
    processing: ['Processing', 'Crushing, screening and stockpile yield from SCADA + CMMS.'],
    shipments: ['Shipments', 'Side tipper queue frozen until crushed fines exist.'],
    collections: ['Collections', 'Yard inventory and reclaimer feeders.']
  }
  const [title, description] = titles[activeTab] || titles.production

  return (
    <ViewFrame eyebrow={mine.site.name} title={title} description={description}>
      <div className="grid grid-cols-3 gap-3 shrink-0">
        <Kpi
          label="Extraction"
          value={`${stats.extractionTph} t/h`}
          hint={`${mine.production.predictedTpd} t/day predicted · ${mine.production.weekTrendPercent > 0 ? '+' : ''}${mine.production.weekTrendPercent}% vs last week`}
          color="#ec4899"
          series={mine.production.extractionHistory}
        />
        <Kpi
          label="Crushing"
          value={`${stats.crushingTph} t/h`}
          hint={x17 ? `${x17.name}: ${x17.note}` : ''}
          color="#38bdf8"
          series={mine.production.crushingHistory}
        />
        <Kpi
          label="Shipments"
          value={`${stats.queuedTippers} queued`}
          hint={`${mine.production.shipmentMovementPercent}% movement · crushed pad ${crushed?.tons ?? 0} t`}
          color="#f97316"
          series={mine.production.shipmentHistory}
        />
      </div>

      {(activeTab === 'processing' || activeTab === 'production') && (
        <DataTable
          columns={[
            { key: 'name', label: 'Plant' },
            { key: 'type', label: 'Type' },
            { key: 'throughputTph', label: 't/h', render: r => `${r.throughputTph} / ${r.nameplateTph}` },
            { key: 'status', label: 'Status', render: r => <StatusBadge value={r.status} /> },
            { key: 'note', label: 'Note' }
          ]}
          rows={mine.plants}
        />
      )}

      {(activeTab === 'shipments' || activeTab === 'collections') && (
        <DataTable
          columns={
            activeTab === 'shipments'
              ? [
                  { key: 'id', label: 'Tipper' },
                  { key: 'type', label: 'Type' },
                  { key: 'status', label: 'Status', render: r => <StatusBadge value={r.status} /> },
                  { key: 'waitMin', label: 'Wait', render: r => `${r.waitMin} min` },
                  { key: 'cargo', label: 'Cargo' },
                  { key: 'destination', label: 'Destination' }
                ]
              : [
                  { key: 'name', label: 'Stockpile' },
                  { key: 'tons', label: 'Tons' },
                  { key: 'capacity', label: 'Capacity' },
                  { key: 'status', label: 'Status', render: r => <StatusBadge value={r.status} /> }
                ]
          }
          rows={activeTab === 'shipments' ? mine.tippers : mine.stockpiles}
        />
      )}
    </ViewFrame>
  )
}
