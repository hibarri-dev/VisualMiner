import React, { useState } from 'react'
import { useVisibleMine } from '../../context/useMineData'
import ViewFrame from './ViewFrame'
import DataTable from '../dashboard/DataTable'
import StatusBadge from '../dashboard/StatusBadge'
import { CYCLE_PERIODS, CYCLE_STAGES, PRODUCTION_SLICES, cycleKpis } from '../../data/cycleCapture'

function Kpi({ label, value, hint }) {
  return (
    <div className="rounded-xl border border-[#232634] bg-[#16171d] p-4 space-y-2">
      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{label}</div>
      <div className="text-2xl font-semibold text-white tracking-tight">{value}</div>
      {hint && <div className="text-[12px] text-slate-400">{hint}</div>}
    </div>
  )
}

function Pill({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer border ${
        active
          ? 'bg-indigo-600/20 text-indigo-200 border-indigo-500 font-semibold'
          : 'bg-[#181a22] text-slate-400 hover:text-slate-200 border-[#232635]'
      }`}
    >
      {children}
    </button>
  )
}

function usd(n) {
  return `$${Number(n).toLocaleString()}`
}

export default function CycleView({ currentRole }) {
  const { mine } = useVisibleMine(currentRole)
  const [period, setPeriod] = useState('today')
  const [stage, setStage] = useState('surveying')
  const [prodSlice, setProdSlice] = useState('blast')
  const capture = mine.cycleCapture
  const kpis = cycleKpis(capture, stage, period)
  const insight = (capture?.insights || []).find(i => i.stage === stage)
  const prod = capture?.production || {}
  const coalLive = (prod.coal || []).some(r => r.source === 'live')

  const titles = {
    surveying: ['Surveying capture', 'Mineral density, mag, grid coverage, and drill-or-skip cost. Not a second LiDAR view.'],
    prospecting: ['Prospecting capture', 'Collar azimuth / dip / depth / recovery, intercept true width, lab turnaround, resource class.'],
    production: ['Production capture', 'Blast geometry, pit time/method/yield, diesel, weighbridge fraud, weather, licenses, live API4.']
  }
  const [title, description] = titles[stage] || titles.surveying

  return (
    <ViewFrame eyebrow={mine.site.name} title={title} description={description}>
      <div className="flex items-center gap-2 overflow-x-auto pb-1 shrink-0">
        {CYCLE_PERIODS.map(p => (
          <Pill key={p.id} active={period === p.id} onClick={() => setPeriod(p.id)}>
            {p.label}
          </Pill>
        ))}
        <span className="w-px h-5 bg-[#2a2d39] mx-1 shrink-0" />
        {CYCLE_STAGES.map(s => (
          <Pill key={s.id} active={stage === s.id} onClick={() => setStage(s.id)}>
            {s.label}
          </Pill>
        ))}
      </div>

      {stage === 'production' && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 shrink-0">
          {PRODUCTION_SLICES.map(s => (
            <Pill key={s.id} active={prodSlice === s.id} onClick={() => setProdSlice(s.id)}>
              {s.label}
            </Pill>
          ))}
        </div>
      )}

      {stage === 'surveying' && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 shrink-0">
          <Kpi label="Grid coverage" value={`${kpis.coveragePercent}%`} hint="LiDAR + mag block" />
          <Kpi label="Density contrast" value={kpis.densityContrast} hint="A vs barren C" />
          <Kpi label="Follow-up targets" value={kpis.followUp} hint="Do not drill C first" />
          <Kpi label="Drill cost avoided" value={usd(kpis.costAvoidedUsd)} hint="Anomaly C skipped" />
        </div>
      )}

      {stage === 'prospecting' && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 shrink-0">
          <Kpi label="Metres drilled" value={`${Number(kpis.metresDrilled).toLocaleString()} m`} hint="Published collars" />
          <Kpi label="Pending assays" value={kpis.pendingAssays} hint="Lab turnaround open" />
          <Kpi label="Best true width" value={`${kpis.bestTrueWidthM} m`} hint="Golden Dome intercept" />
          <Kpi label="Lab turnaround" value={`${kpis.turnaroundH} h`} hint="Median this period" />
        </div>
      )}

      {stage === 'production' && (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 shrink-0">
          <Kpi label="Blast holes" value={kpis.blastHoles} hint="Geometry this period" />
          <Kpi label="Time spent" value={`${kpis.extractionHours} h`} hint="Pit hours" />
          <Kpi label="Diesel" value={`${Number(kpis.dieselL).toLocaleString()} L`} hint="Haul + shovel" />
          <Kpi label="Fraud flags" value={kpis.fraudFlags} hint="Weighbridge variance" />
          <Kpi label="API4" value={`$${kpis.api4Usd}`} hint={coalLive ? 'Live Richards Bay print' : 'Waiting on live feed'} />
        </div>
      )}

      {insight && (
        <div className="p-3.5 rounded-xl bg-[#191b24] border border-[#262a38] text-xs shrink-0">
          <div className="font-semibold text-slate-200">{insight.title}</div>
          <p className="text-slate-400 text-[11px] leading-relaxed mt-1">{insight.detail}</p>
        </div>
      )}

      <div className="flex-1 min-h-0 overflow-y-auto flex flex-col gap-3">
        {stage === 'surveying' && (
          <>
            <DataTable
              columns={[
                { key: 'name', label: 'Target' },
                { key: 'densityIndex', label: 'Density index' },
                { key: 'magNt', label: 'Mag nT' },
                { key: 'lat', label: 'Lat' },
                { key: 'lon', label: 'Lon' },
                { key: 'nextAction', label: 'Next action' },
                { key: 'estDrillCostUsd', label: 'Drill cost $', render: r => usd(r.estDrillCostUsd) },
                { key: 'status', label: 'Status', render: r => <StatusBadge value={r.status} /> }
              ]}
              rows={mine.surveyTargets || []}
            />
            <DataTable
              columns={[
                { key: 'date', label: 'Flight' },
                { key: 'method', label: 'Method' },
                { key: 'areaKm2', label: 'Area km²' },
                { key: 'gsdCm', label: 'GSD cm' },
                { key: 'coveragePercent', label: 'Coverage %' }
              ]}
              rows={capture?.surveying?.flights || []}
            />
          </>
        )}

        {stage === 'prospecting' && (
          <>
            <DataTable
              columns={[
                { key: 'holeId', label: 'Hole' },
                { key: 'azimuth', label: 'Azimuth' },
                { key: 'dip', label: 'Dip' },
                { key: 'depthM', label: 'Depth m' },
                { key: 'recoveryPercent', label: 'Recovery %' },
                { key: 'resourceClass', label: 'Resource class', render: r => <StatusBadge value={r.resourceClass} /> },
                { key: 'status', label: 'Status', render: r => <StatusBadge value={r.status} /> }
              ]}
              rows={capture?.prospecting?.collars || []}
            />
            <DataTable
              columns={[
                { key: 'holeId', label: 'Hole' },
                { key: 'fromM', label: 'From m' },
                { key: 'toM', label: 'To m' },
                { key: 'trueWidthM', label: 'True width m' },
                { key: 'grade', label: 'Grade' },
                { key: 'labTurnaroundH', label: 'Lab h' },
                { key: 'labStatus', label: 'Lab', render: r => <StatusBadge value={r.labStatus} /> }
              ]}
              rows={capture?.prospecting?.intercepts || []}
            />
          </>
        )}

        {stage === 'production' && prodSlice === 'blast' && (
          <DataTable
            columns={[
              { key: 'bench', label: 'Bench' },
              { key: 'easting', label: 'Easting' },
              { key: 'northing', label: 'Northing' },
              { key: 'rl', label: 'RL' },
              { key: 'azimuth', label: 'Azimuth' },
              { key: 'dip', label: 'Dip' },
              { key: 'holes', label: 'Holes' },
              { key: 'burdenM', label: 'Burden m' },
              { key: 'delayMs', label: 'Delay ms' },
              { key: 'status', label: 'Status', render: r => <StatusBadge value={r.status} /> }
            ]}
            rows={prod.blasts || []}
          />
        )}

        {stage === 'production' && prodSlice === 'extraction' && (
          <DataTable
            columns={[
              { key: 'pit', label: 'Pit' },
              { key: 'ore', label: 'Ore' },
              { key: 'tons', label: 'Tons' },
              { key: 'timeSpentH', label: 'Time spent h' },
              { key: 'method', label: 'Method' },
              { key: 'yieldPercent', label: 'Yield %' },
              { key: 'status', label: 'Status', render: r => <StatusBadge value={r.status} /> }
            ]}
            rows={prod.extraction || []}
          />
        )}

        {stage === 'production' && prodSlice === 'diesel' && (
          <DataTable
            columns={[
              { key: 'asset', label: 'Asset' },
              { key: 'litres', label: 'Litres' },
              { key: 'litresPerTon', label: 'L / t' },
              { key: 'cycleMin', label: 'Cycle min' },
              { key: 'shift', label: 'Shift' },
              { key: 'status', label: 'Status', render: r => <StatusBadge value={r.status} /> }
            ]}
            rows={prod.diesel || []}
          />
        )}

        {stage === 'production' && prodSlice === 'fraud' && (
          <DataTable
            columns={[
              { key: 'vehicle', label: 'Vehicle' },
              { key: 'pile', label: 'Declared pile' },
              { key: 'plannedKg', label: 'Planned kg' },
              { key: 'actualKg', label: 'Actual kg' },
              { key: 'variancePercent', label: 'Variance %' },
              { key: 'flag', label: 'Flag', render: r => <StatusBadge value={r.flag} /> },
              { key: 'note', label: 'Note' }
            ]}
            rows={prod.fraud || []}
          />
        )}

        {stage === 'production' && prodSlice === 'weather' && (
          <DataTable
            columns={[
              { key: 'at', label: 'When' },
              { key: 'windKph', label: 'Wind kph' },
              { key: 'rainMm', label: 'Rain mm' },
              { key: 'visibilityKm', label: 'Vis km' },
              { key: 'lightning', label: 'Lightning' },
              { key: 'blastWindow', label: 'Blast window', render: r => <StatusBadge value={r.blastWindow} /> },
              { key: 'note', label: 'Note' }
            ]}
            rows={prod.weather || []}
          />
        )}

        {stage === 'production' && prodSlice === 'licenses' && (
          <DataTable
            columns={[
              { key: 'permitId', label: 'Permit / bill' },
              { key: 'type', label: 'Type' },
              { key: 'expires', label: 'Expires' },
              { key: 'rehabBondInr', label: 'Rehab bond' },
              { key: 'status', label: 'Status', render: r => <StatusBadge value={r.status} /> },
              { key: 'note', label: 'Note' }
            ]}
            rows={prod.licenses || []}
          />
        )}

        {stage === 'production' && prodSlice === 'coal' && (
          <DataTable
            columns={[
              { key: 'index', label: 'Index' },
              { key: 'basis', label: 'Basis' },
              { key: 'usdPerT', label: 'USD / t', render: r => `$${r.usdPerT}` },
              { key: 'asOf', label: 'As of' },
              { key: 'vsWeekPercent', label: 'vs week %' },
              { key: 'provider', label: 'Source' },
              { key: 'note', label: 'Note' }
            ]}
            rows={prod.coal || []}
          />
        )}
      </div>
    </ViewFrame>
  )
}
