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
    processing: ['Processing', 'ROM → named concentrate piles (42 / 50 / 60%). Plant yield is the bottleneck, not the pit.'],
    shipments: ['Shipments', 'Gate queue + weighbridge. Sold cargo cannot load until crushed / certified piles exist.'],
    collections: ['Collections', 'Named stockpiles by purity — including chrome concentrate and anthracite sold raw.']
  }
  const [title, description] = titles[activeTab] || titles.production

  return (
    <ViewFrame eyebrow={mine.site.name} title={title} description={description}>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 shrink-0">
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

      {activeTab === 'production' && (mine.alerts || []).length > 0 && (
        <DataTable
          columns={[
            { key: 'title', label: 'Alert' },
            { key: 'detail', label: 'Detail' },
            { key: 'source', label: 'Feed' },
            { key: 'severity', label: 'Severity', render: r => <StatusBadge value={r.severity} /> }
          ]}
          rows={mine.alerts}
        />
      )}

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

      {(activeTab === 'production' || activeTab === 'processing') && (
        <DataTable
          columns={[
            { key: 'name', label: 'Ore body / seam' },
            { key: 'commodity', label: 'Commodity' },
            { key: 'headGrade', label: 'Head grade' },
            { key: 'status', label: 'Status', render: r => <StatusBadge value={r.status} /> }
          ]}
          rows={mine.oreBodies || []}
        />
      )}

      {(activeTab === 'processing' || activeTab === 'collections') && (
        <DataTable
          columns={[
            { key: 'name', label: 'Named stockpile' },
            { key: 'gradeLabel', label: 'Purity' },
            { key: 'tons', label: 'Tons' },
            { key: 'capacity', label: 'Capacity' },
            { key: 'status', label: 'Status', render: r => <StatusBadge value={r.status} /> }
          ]}
          rows={mine.stockpiles}
        />
      )}

      {activeTab === 'processing' && (
        <DataTable
          columns={[
            { key: 'sample', label: 'Lab sample' },
            { key: 'result', label: 'Result' },
            { key: 'stage', label: 'Cycle stage' },
            { key: 'status', label: 'Status', render: r => <StatusBadge value={r.status} /> },
            { key: 'at', label: 'At' }
          ]}
          rows={mine.labTests || []}
        />
      )}

      {activeTab === 'shipments' && (
        <>
          <DataTable
            columns={[
              { key: 'id', label: 'Tipper' },
              { key: 'type', label: 'Type' },
              { key: 'status', label: 'Status', render: r => <StatusBadge value={r.status} /> },
              { key: 'waitMin', label: 'Wait', render: r => `${r.waitMin} min` },
              { key: 'cargo', label: 'Cargo' },
              { key: 'destination', label: 'Destination' }
            ]}
            rows={mine.tippers}
          />
          <DataTable
            columns={[
              { key: 'vehicle', label: 'Weighbridge' },
              { key: 'pile', label: 'Named pile' },
              { key: 'plannedKg', label: 'Planned kg' },
              { key: 'actualKg', label: 'Actual kg' },
              { key: 'waitMin', label: 'Gate wait', render: r => `${r.waitMin} min` },
              { key: 'status', label: 'Status', render: r => <StatusBadge value={r.status} /> }
            ]}
            rows={mine.weighbridge || []}
          />
        </>
      )}
    </ViewFrame>
  )
}
