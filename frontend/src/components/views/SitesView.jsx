import React, { useState } from 'react'
import {
  Compass,
  MapPin,
  Flame,
  Wrench,
  Mountain,
  Anchor,
  Sparkles,
  CheckCircle2,
  Clock,
  FileSpreadsheet,
  Layers,
  AlertCircle,
  Plus,
  ArrowUpRight
} from 'lucide-react'
import { useVisibleMine } from '../../context/useMineData'
import { SITE_STAGES } from '../../data'
import ViewFrame from './ViewFrame'
import StatusBadge from '../dashboard/StatusBadge'

export default function SitesView({ currentRole, onOpenModal }) {
  const { mine } = useVisibleMine(currentRole)
  const [selectedSiteId, setSelectedSiteId] = useState('kolar-north')
  const [stageFilter, setStageFilter] = useState('all')

  const sites = mine.sites || []

  const filteredSites = stageFilter === 'all'
    ? sites
    : sites.filter(s => s.stage === stageFilter)

  const selectedSite = sites.find(s => s.id === selectedSiteId) || sites[0]

  const getStageBadge = stageKey => {
    const stage = SITE_STAGES.find(s => s.id === stageKey) || { label: stageKey, color: '#94a3b8' }
    return (
      <span
        className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full border"
        style={{
          color: stage.color,
          borderColor: `${stage.color}40`,
          backgroundColor: `${stage.color}15`
        }}
      >
        {stage.label}
      </span>
    )
  }

  const getTypeIcon = type => {
    if (type === 'wash_plant') return <Flame className="w-4 h-4 text-amber-400" />
    if (type === 'crushing_plant') return <Wrench className="w-4 h-4 text-cyan-400" />
    if (type === 'exploration') return <Compass className="w-4 h-4 text-purple-400" />
    if (type === 'port_terminal') return <Anchor className="w-4 h-4 text-emerald-400" />
    return <Mountain className="w-4 h-4 text-indigo-400" />
  }

  return (
    <ViewFrame
      eyebrow="Asset Portfolio & Operations"
      title="Managed Mining & Processing Sites"
      description="Supports full open pits, standalone wash/crushing plants with no mine, exploration prospects, and customer-owned port terminals."
      actions={
        <button
          onClick={() => onOpenModal && onOpenModal('register-site')}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/25 transition cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Register New Site</span>
        </button>
      }
    >
      {/* Stage Filters Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 shrink-0">
        <button
          onClick={() => setStageFilter('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
            stageFilter === 'all'
              ? 'bg-slate-200 text-slate-900 font-semibold shadow-xs'
              : 'bg-[#181a22] text-slate-400 hover:text-slate-200 border border-[#232635]'
          }`}
        >
          All Stages ({sites.length})
        </button>

        {SITE_STAGES.map(st => {
          const count = sites.filter(s => s.stage === st.id).length
          const isSelected = stageFilter === st.id
          return (
            <button
              key={st.id}
              onClick={() => setStageFilter(st.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer border ${
                isSelected
                  ? 'bg-indigo-600/20 text-indigo-200 border-indigo-500 font-semibold'
                  : 'bg-[#181a22] text-slate-400 hover:text-slate-200 border-[#232635]'
              }`}
            >
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: st.color }} />
              <span>{st.label}</span>
              <span className="text-[10px] opacity-70 font-mono">({count})</span>
            </button>
          )
        })}
      </div>

      {/* Main Grid: Sites Master List & Selected Site Detail Hub */}
      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-4 overflow-hidden">
        {/* Sites Roster */}
        <div className="rounded-2xl border border-[#232634] bg-[#14151c] p-3 flex flex-col overflow-hidden">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 py-2 border-b border-[#202330] flex items-center justify-between">
            <span>Operational Assets ({filteredSites.length})</span>
            <span className="text-[10px] text-slate-500 font-mono">Real-time telemetry</span>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-[#1e212d] pr-1">
            {filteredSites.map(site => {
              const isSelected = selectedSite?.id === site.id
              return (
                <div
                  key={site.id}
                  onClick={() => setSelectedSiteId(site.id)}
                  className={`p-3.5 rounded-xl transition cursor-pointer my-1 ${
                    isSelected
                      ? 'bg-[#1f2330] border border-indigo-500/50 shadow-md'
                      : 'hover:bg-[#191b24] border border-transparent'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-[#272b3a] border border-[#373d52] shrink-0 mt-0.5">
                        {getTypeIcon(site.type)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-sm text-white tracking-tight">{site.name}</h4>
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 font-mono">
                            {site.code}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-0.5">
                          <MapPin className="w-3.5 h-3.5 text-slate-500" />
                          <span>{site.location}</span>
                        </div>
                      </div>
                    </div>

                    <div className="shrink-0 flex flex-col items-end gap-1">
                      {getStageBadge(site.stage)}
                      <span className="text-[10px] text-slate-400">{site.typeLabel}</span>
                    </div>
                  </div>

                  {/* Quick Metric Bar */}
                  <div className="mt-2.5 pt-2 border-t border-[#262938]/60 flex items-center justify-between text-[11px] text-slate-400">
                    <div>Commodity: <strong className="text-slate-200">{site.commodity}</strong></div>
                    <div className="flex items-center gap-3 font-mono text-[10px]">
                      <span>{site.metrics.personnel} Personnel</span>
                      <span>{site.metrics.machines} Equipment</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Selected Site Deep Inspection & Test Results Drawer */}
        {selectedSite && (
          <div className="rounded-2xl border border-[#232634] bg-[#14151c] p-5 flex flex-col justify-between overflow-y-auto space-y-4">
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between pb-3 border-b border-[#202330]">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                      {selectedSite.typeLabel}
                    </span>
                    {getStageBadge(selectedSite.stage)}
                  </div>
                  <h3 className="text-lg font-bold text-white mt-1">{selectedSite.name}</h3>
                  <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                    {selectedSite.location}
                  </p>
                </div>
              </div>

              {/* Stage Description & Status */}
              <div className="p-3.5 rounded-xl bg-[#191b24] border border-[#262a38] space-y-1 text-xs">
                <div className="font-semibold text-slate-200 flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Current Lifecycle Stage: {selectedSite.stageLabel}</span>
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  {SITE_STAGES.find(s => s.id === selectedSite.stage)?.desc}
                </p>
              </div>

              {/* Test Results & All Site Data to Date */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                    <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Test Results & Site Data to Date</span>
                  </h4>
                  {selectedSite.testResults.hasData ? (
                    <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-mono">
                      <CheckCircle2 className="w-3 h-3" /> Data Ingested
                    </span>
                  ) : (
                    <span className="text-[10px] text-amber-400 flex items-center gap-1 font-mono">
                      <Clock className="w-3 h-3" /> Skipped (Add Later)
                    </span>
                  )}
                </div>

                {selectedSite.testResults.hasData ? (
                  <div className="grid grid-cols-2 gap-2.5 text-xs">
                    <div className="p-3 rounded-xl bg-[#191b24] border border-[#272b3b]">
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Lithology & Strata</span>
                      <strong className="text-slate-100 font-medium mt-0.5 block">{selectedSite.testResults.lithology}</strong>
                    </div>
                    <div className="p-3 rounded-xl bg-[#191b24] border border-[#272b3b]">
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Assay / Grade Test</span>
                      <strong className="text-emerald-300 font-mono mt-0.5 block">{selectedSite.testResults.assayGrade}</strong>
                    </div>
                    <div className="p-3 rounded-xl bg-[#191b24] border border-[#272b3b]">
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Recovery / Throughput Rate</span>
                      <strong className="text-indigo-300 font-mono mt-0.5 block">{selectedSite.testResults.recoveryRate}</strong>
                    </div>
                    <div className="p-3 rounded-xl bg-[#191b24] border border-[#272b3b]">
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Water & Dust Environmental</span>
                      <strong className="text-slate-200 mt-0.5 block">{selectedSite.testResults.waterQualityIndex} • {selectedSite.testResults.ambientDust}</strong>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 text-xs text-amber-300 space-y-2">
                    <p className="leading-relaxed">
                      This site was provisioned without initial test records (skipped by user). Assay logs, geological core assays, or water quality sensors can be attached at any time.
                    </p>
                    <button
                      onClick={() => onOpenModal && onOpenModal('submit-report')}
                      className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 font-semibold text-[11px] border border-amber-500/30 transition flex items-center gap-1.5"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Attach Test Results & Laboratory Data Now</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Action Footer */}
            <div className="pt-3 border-t border-[#202330] flex items-center justify-between text-xs">
              <span className="text-slate-400">Last survey: <span className="text-slate-200 font-mono">{selectedSite.testResults.lastSurveyDate}</span></span>
              <button
                onClick={() => onOpenModal && onOpenModal('submit-report')}
                className="text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1"
              >
                <span>Upload Site Report</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </ViewFrame>
  )
}
