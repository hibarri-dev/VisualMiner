import React, { useState, useMemo } from 'react'
import { useVisibleMine } from '../../context/useMineData'
import ViewFrame from './ViewFrame'
import DataTable from '../dashboard/DataTable'
import StatusBadge from '../dashboard/StatusBadge'
import Sparkline from '../dashboard/Sparkline'
import StageControlBar from '../dashboard/StageControlBar'
import MiningStageCards from '../dashboard/MiningStageCards'
import StageBreakdownChart from '../dashboard/StageBreakdownChart'
import WeighbridgeLogistics from '../dashboard/WeighbridgeLogistics'
import ProfitLossIndicators from '../dashboard/ProfitLossIndicators'
import ManagerExecNotes from '../dashboard/ManagerExecNotes'
import DailyProductionReportModal from '../modals/DailyProductionReportModal'
import { getStageData } from '../../data/stageDummyData'
import { MANAGER_SITE_ID } from '../../data/managerDesk'
import {
  Flame,
  Truck,
  Mountain,
  HardHat,
  AlertTriangle,
  Layers,
  Activity,
  Workflow,
  CheckCircle2,
  Clock,
  Gauge
} from 'lucide-react'

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

// Stage Specific Summary Cards (Preparation, Extraction, Processing, Haulage, Shipping)
function StageContextTelemetry({ stage, stats, mine }) {
  if (stage === 'preparation') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 my-3">
        <div className="p-3.5 rounded-xl bg-[#16171d] border border-[#232634]">
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold mb-1">
            <Mountain className="w-4 h-4" /> Drill Grid Progress
          </div>
          <div className="text-xl font-bold text-white">92 / 120 Holes</div>
          <div className="text-[11px] text-slate-400 mt-1">Bench 4 North · 15m spacing</div>
        </div>
        <div className="p-3.5 rounded-xl bg-[#16171d] border border-[#232634]">
          <div className="flex items-center gap-2 text-rose-400 text-xs font-semibold mb-1">
            <AlertTriangle className="w-4 h-4" /> Blast Schedule
          </div>
          <div className="text-xl font-bold text-white">Tomorrow 14:00</div>
          <div className="text-[11px] text-slate-400 mt-1">54,000 m³ planned volume</div>
        </div>
        <div className="p-3.5 rounded-xl bg-[#16171d] border border-[#232634]">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold mb-1">
            <Activity className="w-4 h-4" /> Explosives Loaded
          </div>
          <div className="text-xl font-bold text-white">42,000 kg</div>
          <div className="text-[11px] text-slate-400 mt-1">Emulsion bulk density 1.18 g/cc</div>
        </div>
        <div className="p-3.5 rounded-xl bg-[#16171d] border border-[#232634]">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold mb-1">
            <Gauge className="w-4 h-4" /> Active Drill Rigs
          </div>
          <div className="text-xl font-bold text-white">{stats.drills || 5} Rigs Active</div>
          <div className="text-[11px] text-slate-400 mt-1">Avg penetration 24.2 m/h</div>
        </div>
      </div>
    )
  }

  if (stage === 'extraction') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 my-3">
        <div className="p-3.5 rounded-xl bg-[#16171d] border border-[#232634]">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold mb-1">
            <Activity className="w-4 h-4" /> Pit Extraction Rate
          </div>
          <div className="text-xl font-bold text-white">{stats.extractionTph} t/h</div>
          <div className="text-[11px] text-slate-400 mt-1">+40% vs baseline target</div>
        </div>
        <div className="p-3.5 rounded-xl bg-[#16171d] border border-[#232634]">
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold mb-1">
            <Layers className="w-4 h-4" /> Active Seam / Lode
          </div>
          <div className="text-xl font-bold text-white">QZ-1 Quartz Lode</div>
          <div className="text-[11px] text-slate-400 mt-1">Grade 3.42 g/t Au (High)</div>
        </div>
        <div className="p-3.5 rounded-xl bg-[#16171d] border border-[#232634]">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold mb-1">
            <Truck className="w-4 h-4" /> Shovels &amp; Excavators
          </div>
          <div className="text-xl font-bold text-white">{stats.excavators || 11} Units</div>
          <div className="text-[11px] text-slate-400 mt-1">Bench 4 North &amp; Bench 2</div>
        </div>
        <div className="p-3.5 rounded-xl bg-[#16171d] border border-[#232634]">
          <div className="flex items-center gap-2 text-sky-400 text-xs font-semibold mb-1">
            <Clock className="w-4 h-4" /> Predicted Daily ROM
          </div>
          <div className="text-xl font-bold text-white">{mine.production?.predictedTpd || 4080} t/day</div>
          <div className="text-[11px] text-slate-400 mt-1">Shift B in progress</div>
        </div>
      </div>
    )
  }

  if (stage === 'processing') {
    const x17 = (mine.plants || []).find(p => p.id === 'X17')
    return (
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 my-3">
        <div className="p-3.5 rounded-xl bg-[#16171d] border border-rose-900/30">
          <div className="flex items-center gap-2 text-rose-400 text-xs font-semibold mb-1">
            <AlertTriangle className="w-4 h-4" /> Primary Crusher X17
          </div>
          <div className="text-xl font-bold text-rose-300">{stats.crushingTph} t/h</div>
          <div className="text-[11px] text-rose-400/80 mt-1">{x17?.note || 'Jaw seized overnight'}</div>
        </div>
        <div className="p-3.5 rounded-xl bg-[#16171d] border border-[#232634]">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold mb-1">
            <Workflow className="w-4 h-4" /> Screening &amp; Washing
          </div>
          <div className="text-xl font-bold text-white">{stats.screeningTph || 5} t/h</div>
          <div className="text-[11px] text-slate-400 mt-1">Wash Plant operational</div>
        </div>
        <div className="p-3.5 rounded-xl bg-[#16171d] border border-[#232634]">
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold mb-1">
            <Layers className="w-4 h-4" /> Conc 50% Purity Pad
          </div>
          <div className="text-xl font-bold text-white">11,400 t</div>
          <div className="text-[11px] text-emerald-400 mt-1">Lab assay 50.2% (Passed)</div>
        </div>
        <div className="p-3.5 rounded-xl bg-[#16171d] border border-[#232634]">
          <div className="flex items-center gap-2 text-rose-400 text-xs font-semibold mb-1">
            <AlertTriangle className="w-4 h-4" /> Conc 42% Pad
          </div>
          <div className="text-xl font-bold text-white">8,200 t</div>
          <div className="text-[11px] text-amber-400 mt-1">Lab assay 41.6% (Off-spec)</div>
        </div>
      </div>
    )
  }

  if (stage === 'haulage') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 my-3">
        <div className="p-3.5 rounded-xl bg-[#16171d] border border-[#232634]">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold mb-1">
            <Truck className="w-4 h-4" /> Active Haul Trucks
          </div>
          <div className="text-xl font-bold text-white">{stats.haulers || 16} Trucks</div>
          <div className="text-[11px] text-slate-400 mt-1">Pit to Crusher ramp</div>
        </div>
        <div className="p-3.5 rounded-xl bg-[#16171d] border border-[#232634]">
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold mb-1">
            <Clock className="w-4 h-4" /> Avg Cycle Time
          </div>
          <div className="text-xl font-bold text-white">22.4 min</div>
          <div className="text-[11px] text-rose-400 mt-1">+6.2 min ramp congestion</div>
        </div>
        <div className="p-3.5 rounded-xl bg-[#16171d] border border-[#232634]">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold mb-1">
            <Activity className="w-4 h-4" /> Avg Payload / Load
          </div>
          <div className="text-xl font-bold text-white">58.2 t</div>
          <div className="text-[11px] text-slate-400 mt-1">97% rated capacity</div>
        </div>
        <div className="p-3.5 rounded-xl bg-[#16171d] border border-[#232634]">
          <div className="flex items-center gap-2 text-sky-400 text-xs font-semibold mb-1">
            <Gauge className="w-4 h-4" /> Fleet Fuel Efficiency
          </div>
          <div className="text-xl font-bold text-white">42.5 L/h</div>
          <div className="text-[11px] text-slate-400 mt-1">Live telematics tracking</div>
        </div>
      </div>
    )
  }

  if (stage === 'shipping') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 my-3">
        <div className="p-3.5 rounded-xl bg-[#16171d] border border-amber-900/30">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold mb-1">
            <Truck className="w-4 h-4" /> Gate Queue
          </div>
          <div className="text-xl font-bold text-amber-300">{stats.queuedTippers} Tippers</div>
          <div className="text-[11px] text-amber-400 mt-1">Held until crushed fines exist</div>
        </div>
        <div className="p-3.5 rounded-xl bg-[#16171d] border border-[#232634]">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold mb-1">
            <CheckCircle2 className="w-4 h-4" /> Weighbridge Throughput
          </div>
          <div className="text-xl font-bold text-white">240 t/h</div>
          <div className="text-[11px] text-slate-400 mt-1">Anthracite raw clearing</div>
        </div>
        <div className="p-3.5 rounded-xl bg-[#16171d] border border-[#232634]">
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold mb-1">
            <Workflow className="w-4 h-4" /> Mangalore Port Terminal
          </div>
          <div className="text-xl font-bold text-white">Pier C Loading</div>
          <div className="text-[11px] text-slate-400 mt-1">450 t/h transshipment rate</div>
        </div>
        <div className="p-3.5 rounded-xl bg-[#16171d] border border-[#232634]">
          <div className="flex items-center gap-2 text-sky-400 text-xs font-semibold mb-1">
            <Activity className="w-4 h-4" /> Daily Dispatch
          </div>
          <div className="text-xl font-bold text-white">3,850 t</div>
          <div className="text-[11px] text-slate-400 mt-1">Target 4,500 t/day</div>
        </div>
      </div>
    )
  }

  return null
}

export default function OpsView({ activeTab, currentRole }) {
  const { mine, stats } = useVisibleMine(currentRole)
  const crushed = mine.stockpiles.find(s => s.id === 'sp-crushed')
  const x17 = mine.plants.find(p => p.id === 'X17')

  // Stage Control and Mining Cycle State
  const [activeTimeRange, setActiveTimeRange] = useState('today')
  const [selectedMine, setSelectedMine] = useState(
    currentRole === 'mine_manager' ? MANAGER_SITE_ID : 'kulilia'
  )
  const [activeMode, setActiveMode] = useState('production')
  const [activeStage, setActiveStage] = useState(activeTab === 'shipments' ? 'shipping' : 'extraction')
  const [isDailyReportModalOpen, setIsDailyReportModalOpen] = useState(false)
  const [notificationBanner, setNotificationBanner] = useState(null)

  // Dynamic stage data based on user selection
  const stageData = useMemo(() => {
    return getStageData(selectedMine, activeTimeRange, activeStage)
  }, [selectedMine, activeTimeRange, activeStage])

  const handleDailyReportSubmitted = report => {
    setNotificationBanner({
      title: `Daily Production Report Received (${report.site} · ${report.shift})`,
      message: `Submitted by ${report.managerName}: ${report.extractionTons}t ROM mined. Note: ${report.managerNotes}`
    })
  }

  const titles = {
    production: ['Production Stage', 'Executive mining cycle overview, stage yield & bottleneck telemetry.'],
    processing: ['Processing', 'ROM → named concentrate piles (42 / 50 / 60%). Plant yield is the bottleneck, not the pit.'],
    shipments: ['Shipments & Logistics Hub', 'Gate queue, weighbridge fraud detection & Jindal captive rail sidings.'],
    collections: ['Collections', 'Named stockpiles by purity — including chrome concentrate and anthracite sold raw.']
  }
  const [title, description] = titles[activeTab] || titles.production

  return (
    <ViewFrame eyebrow={mine.site?.name || 'Kulilia Mine'} title={title} description={description}>
      {/* 1. Executive Top Controls (Date Pills + Mine & Mode Switchers) */}
      <StageControlBar
        activeTimeRange={activeTimeRange}
        onSelectTimeRange={setActiveTimeRange}
        selectedMine={currentRole === 'mine_manager' ? MANAGER_SITE_ID : selectedMine}
        onSelectMine={setSelectedMine}
        activeMode={activeMode}
        onSelectMode={setActiveMode}
        showMineSelect={currentRole !== 'mine_manager'}
      />

      {/* 2. Mining Cycle Stage Cards (Preparation, Extraction, Processing, Haulage, Shipping) */}
      <MiningStageCards
        activeStage={activeStage}
        onSelectStage={setActiveStage}
      />

      {/* 3. Stage Breakdown Chart Container with Gradient Border */}
      <StageBreakdownChart
        activeStage={activeStage}
        timeRange={activeTimeRange}
        customData={stageData.chart}
      />

      {/* 4. Live Context Telemetry Cards for the Selected Stage */}
      <StageContextTelemetry
        stage={activeStage}
        stats={stats}
        mine={mine}
      />

      {/* 5. Economic Impact Analysis: Money-Making vs Money-Losing Bottlenecks */}
      <ProfitLossIndicators activeStage={activeStage} />

      {/* 6. Gate & Weighbridge Logistics + Jindal Captive Rail Section */}
      <WeighbridgeLogistics />

      {/* 7. Shared Executive & Mine Manager Directives Stream */}
      <ManagerExecNotes
        currentRole={currentRole}
        onOpenReportModal={() => setIsDailyReportModalOpen(true)}
        notificationBanner={notificationBanner}
        onDismissNotification={() => setNotificationBanner(null)}
      />

      {/* 8. Detailed Data Tables & Alerts */}
      {activeStage === 'extraction' && (
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

      {activeStage === 'processing' && (
        <>
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
        </>
      )}

      {activeStage === 'haulage' && (
        <DataTable
          columns={[
            { key: 'name', label: 'Machine' },
            { key: 'type', label: 'Type' },
            { key: 'status', label: 'Status', render: r => <StatusBadge value={r.status} /> },
            { key: 'fuelPercent', label: 'Fuel', render: r => `${r.fuelPercent}%` },
            { key: 'operator', label: 'Operator' },
            { key: 'bench', label: 'Bench / Zone' }
          ]}
          rows={(mine.machines || []).filter(m => m.type === 'haul_truck' || m.type === 'front_loader')}
        />
      )}

      {activeStage === 'preparation' && (
        <DataTable
          columns={[
            { key: 'id', label: 'Item' },
            { key: 'title', label: 'Operation' },
            { key: 'detail', label: 'Specification' },
            { key: 'severity', label: 'Status', render: r => <StatusBadge value={r.severity} /> }
          ]}
          rows={[
            { id: 'dr-1', title: 'Bench 4 North Pattern', detail: '120 blast holes drilled at 15m depth', severity: 'normal' },
            { id: 'bl-2', title: 'ANFO / Emulsion Loading', detail: '42,000 kg loaded with non-electric delay detonators', severity: 'warning' },
            { id: 'sf-3', title: '500m Safety Geofence', detail: 'Personnel clearance radius established for 14:00 blast', severity: 'critical' }
          ]}
        />
      )}

      {/* Daily Production Report Modal */}
      <DailyProductionReportModal
        isOpen={isDailyReportModalOpen}
        onClose={() => setIsDailyReportModalOpen(false)}
        onSubmitReport={handleDailyReportSubmitted}
        currentSite={selectedMine === 'kulilia' ? 'Kulilia Mine' : selectedMine}
      />
    </ViewFrame>
  )
}
