import React, { useEffect, useState } from 'react'
import {
  Compass,
  MapPin,
  Flame,
  Wrench,
  Mountain,
  Anchor,
  CheckCircle2,
  Clock,
  FileSpreadsheet,
  Plus,
  ArrowUpRight
} from 'lucide-react'
import { useVisibleMine } from '../../context/useMineData'
import { SITE_STAGES } from '../../data'
import ViewFrame from './ViewFrame'

function siteRows(rows, siteId) {
  return (rows || []).filter(r => r.siteId === siteId)
}

function CaptureLine({ children }) {
  return (
    <div className="text-[11px] text-slate-300 px-2 py-1.5 rounded bg-[#191b24] border border-[#272b3b]">
      {children}
    </div>
  )
}

export default function SitesView({ currentRole, onOpenModal, activeSubTab }) {
  const { mine, selectedSiteId, setSelectedSiteId } = useVisibleMine(currentRole)
  const [stageFilter, setStageFilter] = useState('all')

  useEffect(() => {
    if (typeof activeSubTab === 'string' && activeSubTab.startsWith('site-')) {
      const id = activeSubTab.slice('site-'.length)
      if (mine.sites?.some(s => s.id === id) && setSelectedSiteId) setSelectedSiteId(id)
    }
  }, [activeSubTab, mine.sites, setSelectedSiteId])

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
                  onClick={() => setSelectedSiteId && setSelectedSiteId(site.id)}
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
                  <span>Current cycle stage: {selectedSite.stageLabel}</span>
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  {SITE_STAGES.find(s => s.id === selectedSite.stage)?.desc}
                </p>
                {selectedSite.sellsRaw && (
                  <p className="text-amber-300/90 text-[11px] pt-1">This site sells ROM as extracted (e.g. anthracite). No concentrate plant.</p>
                )}
                <div className="flex flex-wrap gap-1 pt-1">
                  {(SITE_STAGES.find(s => s.id === selectedSite.stage)?.relevant || []).map(tag => (
                    <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-[#252838] text-slate-300 font-mono">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {selectedSite.stage === 'rehabilitation' && (
                <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-xs text-cyan-200">
                  Dormant. No extraction, processing, or loading. Community + piezometers only.
                </div>
              )}
              {selectedSite.stage === 'prospecting' && (
                <div className="p-3 rounded-xl bg-sky-500/10 border border-sky-500/20 text-xs text-sky-200">
                  Lab grade is the product. Do not expect crushing, named concentrate piles, or a weighbridge.
                  {selectedSite.id === 'queensway-nfg' && (
                    <span className="block mt-1.5 text-sky-100">
                      Live 3D model is under Mines → 3D Mine Models — generated from public NI 43-101 drill + seismic filings.
                    </span>
                  )}
                </div>
              )}
              {selectedSite.stage === 'surveying' && (
                <div className="p-3 rounded-xl bg-violet-500/10 border border-violet-500/20 text-xs text-violet-200">
                  Targets only. No ore body named yet — no fleet hours, no plant.
                </div>
              )}
              {selectedSite.stage === 'licensing' && (
                <div className="p-3 rounded-xl bg-pink-500/10 border border-pink-500/20 text-xs text-pink-200">
                  Permits, rehab bond, and village jobs/royalties. Extraction and plant KPIs are not the focus yet.
                </div>
              )}
              {selectedSite.stage === 'testing' && (
                <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-200">
                  Lab certifies named stockpile percentages before sale. Off-spec piles must not go to the weighbridge.
                </div>
              )}
              {selectedSite.stage === 'transport' && (
                <div className="p-3 rounded-xl bg-orange-500/10 border border-orange-500/20 text-xs text-orange-200">
                  Product is sold. Gate queue, named-pile loading, and weighbridge tickets are the live data.
                </div>
              )}

              {/* Stage-specific unique capture — not the generic lithology tiles */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                    <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Stage capture</span>
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

                {selectedSite.stage === 'surveying' && siteRows(mine.surveyTargets, selectedSite.id).map(t => (
                  <CaptureLine key={t.id}>
                    {t.name} · density {t.densityIndex} · {t.magNt} nT · {t.nextAction}
                    <div className="text-[10px] text-slate-500 mt-0.5">Drill cost {t.estDrillCostUsd ? `$${t.estDrillCostUsd.toLocaleString()}` : '—'} · {t.note}</div>
                  </CaptureLine>
                ))}

                {selectedSite.stage === 'surveying' && siteRows(mine.cycleCapture?.surveying?.flights, selectedSite.id).map(f => (
                  <CaptureLine key={f.id}>
                    {f.date} · {f.method} · {f.areaKm2} km² · GSD {f.gsdCm} cm · {f.coveragePercent}% coverage
                  </CaptureLine>
                ))}

                {selectedSite.stage === 'prospecting' && siteRows(mine.cycleCapture?.prospecting?.collars, selectedSite.id).map(c => (
                  <CaptureLine key={c.id}>
                    {c.holeId} · az {c.azimuth}° · dip {c.dip}° · {c.depthM} m · rec {c.recoveryPercent}% · {c.resourceClass}
                  </CaptureLine>
                ))}

                {selectedSite.stage === 'prospecting' && siteRows(mine.cycleCapture?.prospecting?.intercepts, selectedSite.id).map(i => (
                  <CaptureLine key={i.id}>
                    {i.holeId} · true width {i.trueWidthM} m · {i.grade} · lab {i.labTurnaroundH} h ({i.labStatus})
                  </CaptureLine>
                ))}

                {(selectedSite.stage === 'extraction' || selectedSite.stage === 'processing') && siteRows(mine.cycleCapture?.production?.blasts, selectedSite.id).map(b => (
                  <CaptureLine key={b.id}>
                    {b.bench} · {b.easting}E {b.northing}N RL {b.rl} · az {b.azimuth}° · dip {b.dip}° · {b.holes} holes
                  </CaptureLine>
                ))}

                {siteRows(mine.cycleCapture?.production?.extraction, selectedSite.id).map(r => (
                  <CaptureLine key={r.id}>
                    {r.pit} · {r.ore} · {r.tons} t · {r.timeSpentH} h · {r.method} · yield {r.yieldPercent}%
                  </CaptureLine>
                ))}

                {siteRows(mine.cycleCapture?.production?.diesel, selectedSite.id).map(d => (
                  <CaptureLine key={d.id}>
                    {d.asset} · {d.litres} L · {d.litresPerTon} L/t · cycle {d.cycleMin} min
                  </CaptureLine>
                ))}

                {(selectedSite.stage === 'transport' || selectedSite.stage === 'extraction' || selectedSite.stage === 'processing') &&
                  siteRows(mine.cycleCapture?.production?.fraud, selectedSite.id).map(f => (
                    <CaptureLine key={f.id}>
                      {f.vehicle} · variance {f.variancePercent}% · {f.flag} · {f.note}
                    </CaptureLine>
                  ))}

                {siteRows(mine.cycleCapture?.production?.weather, selectedSite.id).map(w => (
                  <CaptureLine key={w.id}>
                    {w.at} · wind {w.windKph} kph · rain {w.rainMm} mm · blast {w.blastWindow} · {w.note}
                  </CaptureLine>
                ))}

                {(selectedSite.stage === 'licensing' || selectedSite.stage === 'extraction') &&
                  siteRows(mine.cycleCapture?.production?.licenses, selectedSite.id).map(l => (
                    <CaptureLine key={l.id}>
                      {l.permitId} · {l.type} · {l.expires} · bond {l.rehabBondInr} · {l.status}
                      {l.note ? <div className="text-[10px] text-slate-500 mt-0.5">{l.note}</div> : null}
                    </CaptureLine>
                  ))}

                {siteRows(mine.cycleCapture?.production?.coal, selectedSite.id).map(c => (
                  <CaptureLine key={c.id}>
                    {c.index} ${c.usdPerT}/t · {c.basis} · as of {c.asOf} · {c.note}
                  </CaptureLine>
                ))}

                {!selectedSite.testResults.hasData && selectedSite.stage !== 'surveying' && selectedSite.stage !== 'prospecting' && (
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

              {(mine.oreBodies || []).filter(b => b.siteId === selectedSite.id).length > 0 && (
                <div className="space-y-1.5">
                  <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Named ore bodies / seams</h4>
                  {(mine.oreBodies || []).filter(b => b.siteId === selectedSite.id).map(b => (
                    <div key={b.id} className="flex justify-between text-[11px] text-slate-300 px-2 py-1 rounded bg-[#191b24] border border-[#272b3b]">
                      <span>{b.name}</span>
                      <span className="font-mono text-emerald-300">{b.headGrade}</span>
                    </div>
                  ))}
                </div>
              )}

              {(mine.labTests || []).filter(t => t.siteId === selectedSite.id).length > 0 && (
                <div className="space-y-1.5">
                  <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Laboratory tests</h4>
                  {(mine.labTests || []).filter(t => t.siteId === selectedSite.id).map(t => (
                    <div key={t.id} className="flex justify-between gap-2 text-[11px] text-slate-300 px-2 py-1 rounded bg-[#191b24] border border-[#272b3b]">
                      <span>{t.sample}</span>
                      <span className="font-mono text-indigo-300 shrink-0">{t.result}</span>
                    </div>
                  ))}
                </div>
              )}

              {(mine.communities || []).filter(c => c.siteId === selectedSite.id).length > 0 && (
                <div className="space-y-1.5">
                  <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Communities</h4>
                  {(mine.communities || []).filter(c => c.siteId === selectedSite.id).map(c => (
                    <div key={c.id} className="text-[11px] text-slate-300 px-2 py-1.5 rounded bg-[#191b24] border border-[#272b3b]">
                      {c.village} · jobs {c.jobsFilled}/{c.jobsPromised} · {c.royaltyDueInr}
                    </div>
                  ))}
                </div>
              )}
            </div>

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
