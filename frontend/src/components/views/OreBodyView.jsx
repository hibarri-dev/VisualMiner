import React, { useEffect, useMemo, useState } from 'react'
import { Activity, Layers, RotateCcw } from 'lucide-react'
import Scene3D from '../three/Scene3D'
import OreBody3D from '../three/OreBody3D'
import StatusBadge from '../dashboard/StatusBadge'
import {
  buildBlockModel,
  buildHoleTraces,
  buildIntervalSamples,
  drillMeta,
  formatGrade,
  formatMetres,
  resourceEstimate
} from '../../three/oreBody'
import { PIPELINE_STEPS, explorationNarrative, normalizedLayer } from '../../data/explorationProject'

const CUTOFFS = [1, 2, 5, 10]

export default function OreBodyView() {
  const [pipeline, setPipeline] = useState(0)
  const [playing, setPlaying] = useState(true)
  const [cutoff, setCutoff] = useState(1)
  const [showTraces, setShowTraces] = useState(true)
  const [showAssays, setShowAssays] = useState(true)
  const [showBlocks, setShowBlocks] = useState(true)
  const [showSeismic, setShowSeismic] = useState(true)

  const traces = useMemo(() => buildHoleTraces(), [])
  const samples = useMemo(() => buildIntervalSamples(), [])
  const model = useMemo(() => buildBlockModel(samples), [samples])
  const estimate = useMemo(() => resourceEstimate(model, cutoff), [model, cutoff])
  const buckets = useMemo(() => normalizedLayer(), [])
  const narrative = useMemo(() => explorationNarrative(), [])
  const project = drillMeta.project || {}
  const best = drillMeta.bestIntercept || {}
  const done = pipeline >= PIPELINE_STEPS.length - 1 && !playing

  useEffect(() => {
    if (!playing) return undefined
    if (pipeline >= PIPELINE_STEPS.length - 1) {
      setPlaying(false)
      return undefined
    }
    const t = setTimeout(() => setPipeline(p => p + 1), 700)
    return () => clearTimeout(t)
  }, [playing, pipeline])

  const replay = () => {
    setPipeline(0)
    setPlaying(true)
  }

  const revealTraces = pipeline >= 2
  const revealAssays = pipeline >= 2
  const revealBlocks = pipeline >= 3

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[#0d0e12] overflow-hidden">
      <div className="shrink-0 px-3 sm:px-5 pt-3 sm:pt-4 pb-2 flex flex-col lg:flex-row lg:items-end justify-between gap-2">
        <div>
          <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500 mb-0.5">
            {project.disclosure} · {project.ticker}
          </div>
          <h1 className="text-[16px] sm:text-[18px] font-semibold text-white tracking-tight">
            {project.name}
          </h1>
          <p className="text-[11px] sm:text-[12px] text-slate-400 mt-0.5 max-w-3xl leading-relaxed">
            {project.company} — {project.location}. {project.note}
          </p>
        </div>
        <button
          type="button"
          onClick={replay}
          className="self-start flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold bg-[#1a1d27] hover:bg-[#222636] text-slate-200 border border-[#2a2e3c] transition cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Replay pipeline
        </button>
      </div>

      <div className="px-3 sm:px-5 pb-2 flex gap-1.5 overflow-x-auto shrink-0">
        {PIPELINE_STEPS.map((s, i) => {
          const active = i === pipeline && playing
          const complete = i < pipeline || (i === pipeline && done)
          return (
            <div
              key={s.id}
              className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg border text-[10px] min-w-[9.5rem] ${
                complete
                  ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-200'
                  : active
                    ? 'border-indigo-500/50 bg-indigo-500/15 text-indigo-100'
                    : 'border-[#2a2e3c] bg-[#14151c] text-slate-500'
              }`}
            >
              <span className="font-mono text-[9px] opacity-70">{i + 1}</span>
              <div>
                <div className="font-semibold leading-tight">{s.label}</div>
                <div className="text-[9px] opacity-80 leading-tight hidden sm:block">{s.detail}</div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="flex-1 min-h-0 grid grid-cols-1 xl:grid-cols-[1fr_20rem] gap-3 p-3 sm:p-5 pt-1">
        <div className="relative min-h-[320px] rounded-2xl overflow-hidden bg-[#07090f] border border-[#232634] shadow-xl">
          <div className="absolute left-3 top-3 z-20 flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Ore-body model</span>
            <StatusBadge value={done ? 'live' : 'syncing'} />
            <span className="text-[10px] font-mono text-slate-500">
              {drillMeta.holeCount} holes · {formatMetres(drillMeta.metresDrilled)}
            </span>
          </div>
          <div className="absolute right-3 top-3 z-20 flex flex-col items-end gap-1.5">
            <div className="flex items-center gap-0.5 p-0.5 rounded-md bg-black/55 border border-white/10 backdrop-blur-sm">
              {[
                ['traces', showTraces, setShowTraces, 'Holes'],
                ['assays', showAssays, setShowAssays, 'Assays'],
                ['blocks', showBlocks, setShowBlocks, 'IDW'],
                ['seismic', showSeismic, setShowSeismic, 'Seismic']
              ].map(([id, on, set, label]) => (
                <button
                  key={id}
                  type="button"
                  aria-pressed={on}
                  onClick={() => set(v => !v)}
                  className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider transition-colors ${
                    on ? 'bg-cyan-400/90 text-slate-900' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-0.5 p-0.5 rounded-md bg-black/55 border border-white/10 backdrop-blur-sm">
              {CUTOFFS.map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCutoff(c)}
                  className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider transition-colors ${
                    cutoff === c ? 'bg-amber-400/90 text-slate-900' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  ≥{c} g/t
                </button>
              ))}
            </div>
          </div>
          <Scene3D
            cameraPosition={[0.4, 4.8, 18]}
            controlsTarget={[0, -5, 0]}
            minDistance={4}
            maxDistance={48}
            sunPosition={[8, 14, 6]}
            fogColor="#0b1018"
            fogNear={22}
            fogFar={55}
            maxPolarAngle={Math.PI * 0.92}
            palette="geology"
          >
            <OreBody3D
              traces={traces}
              samples={samples}
              model={model}
              cutoff={cutoff}
              showTraces={showTraces && revealTraces}
              showAssays={showAssays && revealAssays}
              showBlocks={showBlocks && revealBlocks}
              showSeismic={showSeismic && pipeline >= 1}
            />
          </Scene3D>
          <div className="absolute left-3 bottom-3 z-20 max-w-[22rem] text-[10px] text-slate-400 bg-black/55 border border-white/10 rounded-lg px-2.5 py-1.5 backdrop-blur-sm leading-relaxed">
            Cyan collars tested 3-D seismic targets. Colored tubes are published ≥1 g/t composites.
            IDW blocks are an illustration — not a JORC / NI 43-101 resource.
          </div>
        </div>

        <aside className="rounded-2xl border border-[#232634] bg-[#14151c] p-4 overflow-y-auto space-y-4">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-indigo-400" />
              From live public data
            </div>
            <div className="mt-2 grid grid-cols-2 gap-2 text-[11px]">
              <Stat label="Holes" value={drillMeta.holeCount} />
              <Stat label="Metres" value={Math.round(drillMeta.metresDrilled).toLocaleString()} />
              <Stat label="Composites" value={drillMeta.intervalCount} />
              <Stat label="Best" value={`${best.grade} g/t`} />
            </div>
            <p className="mt-2 text-[11px] text-slate-300 leading-relaxed">
              {best.id}: {formatGrade(best.grade)} over {(best.to - best.from).toFixed(2)} m
              {best.zone ? ` · ${best.zone}` : ''}. Deepest published intercept ~1,150 m vertical.
            </p>
          </div>

          {pipeline >= 3 && (
            <div className="p-3 rounded-xl bg-[#191b24] border border-[#272b3b] text-[11px] space-y-1">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">IDW above {cutoff} g/t</div>
              <div className="font-mono text-emerald-300">{estimate.blocks.toLocaleString()} blocks</div>
              <div className="text-slate-400">Avg {formatGrade(estimate.avgGrade)} in the interpolant</div>
              <div className="text-[10px] text-slate-500">Illustrative IDW only — not a resource, not tonnes.</div>
            </div>
          )}

          {pipeline >= 1 && (
            <div className="space-y-1.5">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-cyan-400" />
                Normalized layer
              </div>
              {buckets.spatial.map(s => (
                <div key={s.name} className="flex justify-between gap-2 text-[11px] text-slate-300 px-2 py-1 rounded bg-[#191b24] border border-[#272b3b]">
                  <span>{s.name}</span>
                  <span className="font-mono text-cyan-300 shrink-0">{s.count}</span>
                </div>
              ))}
              <div className="text-[10px] text-slate-500 pt-1">
                Time-series: metres drilled {Object.entries(drillMeta.metresByYear || {}).map(([y, m]) => `${y} ${Math.round(m)} m`).join(' · ')}
              </div>
            </div>
          )}

          {pipeline >= 4 && (
            <div className="space-y-1.5">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">AI summary</div>
              <p className="text-[12px] text-slate-200 leading-relaxed">{narrative.extraction[0]}</p>
              <p className="text-[12px] text-slate-300 leading-relaxed">{narrative.extraction[1]}</p>
              {narrative.throughput.map(line => (
                <p key={line} className="text-[12px] text-slate-300 leading-relaxed">{line}</p>
              ))}
              {narrative.shipments.map(line => (
                <p key={line} className="text-[12px] text-slate-300 leading-relaxed">{line}</p>
              ))}
            </div>
          )}

          <div className="space-y-1.5 pt-1 border-t border-[#202330]">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Source documents</div>
            {(project.filings || []).map(f => (
              <a
                key={f.id}
                href={f.url}
                target="_blank"
                rel="noreferrer"
                className="block p-2 rounded-lg bg-[#191b24] border border-[#272b3b] hover:border-indigo-500/40 transition"
              >
                <div className="text-[10px] font-mono text-indigo-300">{f.date} · {f.kind}</div>
                <div className="text-[11px] text-slate-200 mt-0.5 leading-snug">{f.title}</div>
              </a>
            ))}
          </div>
        </aside>
      </div>
    </div>
  )
}

function Stat({ label, value }) {
  return (
    <div className="p-2 rounded-lg bg-[#191b24] border border-[#272b3b]">
      <div className="text-[9px] uppercase tracking-wider text-slate-500">{label}</div>
      <div className="font-mono text-slate-100">{value}</div>
    </div>
  )
}
