import React, { useEffect, useMemo, useState } from 'react'
import { AlertTriangle, Globe2, RotateCcw } from 'lucide-react'
import StatusBadge from '../dashboard/StatusBadge'
import {
  AFRICA_OUTLINE,
  MADAGASCAR_OUTLINE,
  MAP_SIZE,
  pointAlong,
  project,
  toPath
} from '../../data/africaGeo'
import {
  COUNTRIES,
  MAP_LAYERS,
  ROAD_CORRIDORS,
  createPortfolioState,
  formatTons,
  portfolioRollup,
  tickPortfolio
} from '../../data/portfolio'

const AFRICA_PATH = toPath(AFRICA_OUTLINE)
const MADAGASCAR_PATH = toPath(MADAGASCAR_OUTLINE)

const LAND = '#c3c9d4'
const LAND_EDGE = '#8f97a6'

// Marker glyphs, drawn in viewBox units around a local origin so a marker can be
// dropped at any projected point with a single translate.
const GLYPHS = {
  mine: 'M -7 5 L -1.5 -4 L 2 1 L 4 -2 L 7 5 Z',
  plant: 'M -6 5 L -6 -1 L -1 -1 L -1 -4 L 6 -4 L 6 5 Z',
  port: 'M -5 -5 L 5 -5 L 5 1 L 0 5 L -5 1 Z',
  ship: 'M -8 1 L 8 1 L 5.5 5 L -5.5 5 Z M -0.6 1 L -0.6 -5 L 0.6 -5 L 0.6 1 Z',
  truck: 'M -7 -2 L 0 -2 L 0 -4.5 L 3.5 -4.5 L 6.5 -1 L 6.5 2.5 L -7 2.5 Z',
  siding: 'M 0 -4 L 4 0 L 0 4 L -4 0 Z'
}

const COLORS = {
  mine: '#c026d3',
  plant: '#fb923c',
  port: '#34d399',
  ship: '#f8fafc',
  truck: '#38bdf8',
  rail: '#a78bfa'
}

const STATUS_TONE = {
  producing: 'text-emerald-300',
  ramp_up: 'text-sky-300',
  degraded: 'text-amber-300',
  loading: 'text-emerald-300',
  waiting_cargo: 'text-amber-300',
  demurrage: 'text-rose-300',
  waiting_berth: 'text-amber-300',
  idle: 'text-slate-400',
  exploration: 'text-indigo-300'
}

function Kpi({ label, value, sub, tone = 'text-white' }) {
  return (
    <div className="px-3 py-2 rounded-xl bg-[#14151c] border border-[#242836] min-w-0">
      <div className="text-[9px] font-bold uppercase tracking-[0.14em] text-slate-500 truncate">{label}</div>
      <div className={`text-[15px] font-semibold tabular-nums leading-tight mt-0.5 ${tone}`}>{value}</div>
      {sub ? <div className="text-[10px] text-slate-500 leading-tight truncate">{sub}</div> : null}
    </div>
  )
}

/** Name + one number, rendered in SVG so it scales with the map rather than the page. */
function MapLabel({ x, y, title, detail }) {
  const width = Math.max(title.length, detail.length) * 5.6 + 16
  const flipX = x + width + 14 > MAP_SIZE.width
  const left = flipX ? x - width - 12 : x + 12
  const top = y - 26
  return (
    <g pointerEvents="none">
      <line x1={x} y1={y} x2={flipX ? left + width : left} y2={top + 20} stroke="#f8fafc" strokeWidth="1" opacity="0.5" />
      <rect x={left} y={top} width={width} height={30} rx="5" fill="#0b0d13" stroke="#3f4657" opacity="0.96" />
      <text x={left + 8} y={top + 12.5} fill="#f1f5f9" fontSize="10.5" fontWeight="600">{title}</text>
      <text x={left + 8} y={top + 24} fill="#94a3b8" fontSize="9.5" fontFamily="ui-monospace, monospace">{detail}</text>
    </g>
  )
}

export default function PortfolioMapView() {
  const [state, setState] = useState(() => createPortfolioState())
  const [layers, setLayers] = useState(() => new Set(MAP_LAYERS.map(l => l.id)))
  const [selectedId, setSelectedId] = useState('port-beira')

  useEffect(() => {
    const id = setInterval(() => setState(prev => tickPortfolio(prev)), 2500)
    return () => clearInterval(id)
  }, [])

  const rollup = useMemo(() => portfolioRollup(state), [state])
  const mapped = useMemo(() => state.assets.filter(a => a.region === 'africa'), [state.assets])
  // Assets, vessels, convoys and sidings are different shapes but the detail card
  // only ever reads a common subset — normalise the two odd ones on the way in.
  const selected = useMemo(() => {
    if (!selectedId) return null
    const asset = state.assets.find(a => a.id === selectedId)
    if (asset) return asset
    const vessel = state.vessels.find(v => v.id === selectedId)
    if (vessel) return vessel
    const convoy = state.convoys.find(c => c.id === selectedId)
    if (convoy) {
      return {
        name: convoy.label,
        status: 'hauling',
        commodity: `${convoy.trucks} × ${convoy.tonsPerTruck} t side tippers`,
        gradeLabel: `ETA ${Math.round(convoy.etaHours)} h`,
        stockpileTons: convoy.trucks * convoy.tonsPerTruck,
        note: convoy.note
      }
    }
    const railed = state.rail
      .flatMap(line => line.sidings.map(sd => ({ line, sd })))
      .find(({ sd }) => sd.id === selectedId)
    if (railed) {
      return {
        name: railed.sd.name,
        status: 'railed',
        country: railed.line.name,
        commodity: railed.line.commodity,
        gradeLabel: `${railed.sd.wagons} wagons @ ${railed.line.railcarTons} t`,
        stockpileTons: railed.sd.tons,
        manager: railed.line.operator
      }
    }
    return null
  }, [state, selectedId])

  const countryCounts = useMemo(() => {
    const counts = new Map()
    mapped.forEach(a => counts.set(a.countryCode, (counts.get(a.countryCode) || 0) + 1))
    return counts
  }, [mapped])

  const convoyPoints = useMemo(
    () =>
      state.convoys.map(c => {
        const corridor = ROAD_CORRIDORS.find(r => r.id === c.corridorId)
        const [lon, lat] = corridor ? pointAlong(corridor.path, c.t) : [0, 0]
        return { ...c, corridor, lon, lat }
      }),
    [state.convoys]
  )

  const toggleLayer = id =>
    setLayers(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })

  const on = id => layers.has(id)
  const riskVessels = state.vessels.filter(v => v.status === 'demurrage' || v.status === 'waiting_cargo')

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[#0d0e12] overflow-hidden">
      <div className="shrink-0 px-3 sm:px-5 pt-3 sm:pt-4 pb-2 flex flex-col lg:flex-row lg:items-end justify-between gap-2">
        <div className="min-w-0">
          <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500 mb-0.5 flex items-center gap-1.5">
            <Globe2 className="w-3 h-3" />
            Executive portfolio
          </div>
          <h1 className="text-[16px] sm:text-[18px] font-semibold text-white tracking-tight">
            {rollup.mines} mines · {rollup.plants} plants · {rollup.ports} ports across {rollup.countries} countries
          </h1>
          <p className="text-[11px] sm:text-[12px] text-slate-400 mt-0.5 max-w-3xl leading-relaxed">
            Every producing asset, its rail corridor, the trucks on the road and the ship waiting at
            the other end — on one map. Pick any marker to see what it is costing or earning right now.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setState(createPortfolioState())}
          className="self-start flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold bg-[#1a1d27] hover:bg-[#222636] text-slate-200 border border-[#2a2e3c] transition cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset day
        </button>
      </div>

      <div className="shrink-0 px-3 sm:px-5 pb-2 grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-2">
        <Kpi label="Portfolio output" value={`${Math.round(rollup.tpd / 1000).toLocaleString()} kt/d`} sub={`${rollup.mines} producing pits`} />
        <Kpi label="Trucks weighed today" value={rollup.trucksWeighedToday.toLocaleString()} sub="Gate in / gate out" />
        <Kpi label="On rail sidings" value={formatTons(rollup.railTons)} sub={`${state.rail.length} corridors`} />
        <Kpi label="At port stockpile" value={formatTons(rollup.portStockTons)} sub={`${rollup.ports} terminals`} />
        <Kpi label="On the road" value={`${rollup.convoyTrucks} trucks`} sub={`${formatTons(rollup.convoyTons)} in transit`} />
        <Kpi
          label="Demurrage exposure"
          value={`$${(rollup.demurrageUsdPerDay / 1000).toFixed(1)}k/day`}
          sub={`${rollup.vesselsAtRisk} vessels at risk`}
          tone={rollup.demurrageUsdPerDay > 0 ? 'text-rose-300' : 'text-white'}
        />
      </div>

      <div className="flex-1 min-h-0 grid grid-cols-1 xl:grid-cols-[1fr_20rem] gap-3 p-3 sm:p-5 pt-1">
        <div className="relative min-h-[340px] rounded-2xl overflow-hidden bg-[#07090f] border border-[#232634] shadow-xl">
          <div className="absolute left-3 top-3 z-20 flex flex-wrap items-center gap-1.5 pointer-events-none">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Africa operations</span>
            <StatusBadge value="live" />
          </div>

          <div className="absolute right-3 top-3 z-20 flex flex-wrap justify-end gap-1">
            {MAP_LAYERS.map(l => (
              <button
                key={l.id}
                type="button"
                onClick={() => toggleLayer(l.id)}
                aria-pressed={on(l.id)}
                className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-[9px] font-bold uppercase tracking-wider border backdrop-blur-sm transition-colors cursor-pointer ${
                  on(l.id)
                    ? 'bg-black/60 border-white/20 text-slate-100'
                    : 'bg-black/40 border-white/10 text-slate-500 hover:text-slate-300'
                }`}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: on(l.id) ? l.color : '#475569' }}
                />
                {l.label}
              </button>
            ))}
          </div>

          <svg
            viewBox={`0 0 ${MAP_SIZE.width} ${MAP_SIZE.height}`}
            className="absolute inset-0 w-full h-full"
            preserveAspectRatio="xMidYMid meet"
            onClick={() => setSelectedId(null)}
          >
            <path d={AFRICA_PATH} fill={LAND} stroke={LAND_EDGE} strokeWidth="1.2" strokeLinejoin="round" />
            <path d={MADAGASCAR_PATH} fill={LAND} stroke={LAND_EDGE} strokeWidth="1.2" strokeLinejoin="round" />

            {/* Country labels. No internal borders in the outline, so the asset count
                next to the name is what tells an executive where the book is concentrated. */}
            {COUNTRIES.map(c => {
              const [x, y] = project(c.lon, c.lat)
              const count = countryCounts.get(c.code) || 0
              return (
                <g key={c.code} pointerEvents="none">
                  <text
                    x={x}
                    y={y}
                    textAnchor="middle"
                    fill="#3f4757"
                    fontSize="10"
                    fontWeight="700"
                    letterSpacing="0.4"
                  >
                    {c.name.toUpperCase()}
                  </text>
                  {count ? (
                    <text x={x} y={y + 11} textAnchor="middle" fill="#5b6478" fontSize="9" fontFamily="ui-monospace, monospace">
                      {count} assets
                    </text>
                  ) : null}
                </g>
              )
            })}

            {/* Rail corridors + sidings */}
            {on('rail')
              ? state.rail.map(line => (
                  <g key={line.id}>
                    <path
                      d={toPath(line.path, false)}
                      fill="none"
                      stroke={COLORS.rail}
                      strokeWidth="2"
                      strokeDasharray="7 4"
                      opacity="0.85"
                    />
                    {line.sidings.map(s => {
                      const [x, y] = project(s.lon, s.lat)
                      return (
                        <g
                          key={s.id}
                          transform={`translate(${x} ${y})`}
                          className="cursor-pointer"
                          onClick={e => {
                            e.stopPropagation()
                            setSelectedId(s.id)
                          }}
                        >
                          {selectedId === s.id ? (
                            <circle r="10" fill="none" stroke="#f8fafc" strokeWidth="1.4" opacity="0.9" />
                          ) : null}
                          <path d={GLYPHS.siding} fill={COLORS.rail} stroke="#0b0d13" strokeWidth="1" />
                          <circle r="12" fill="transparent" />
                        </g>
                      )
                    })}
                  </g>
                ))
              : null}

            {/* Road corridors under the truck layer */}
            {on('trucks')
              ? ROAD_CORRIDORS.map(r => (
                  <path
                    key={r.id}
                    d={toPath(r.path, false)}
                    fill="none"
                    stroke={COLORS.truck}
                    strokeWidth="1.4"
                    strokeDasharray="2 5"
                    opacity="0.5"
                  />
                ))
              : null}

            {/* Mines and plants */}
            {mapped
              .filter(a => (a.type === 'mine' && on('mines')) || (a.type === 'plant' && on('plants')))
              .map(a => {
                const [x, y] = project(a.lon, a.lat)
                const active = selectedId === a.id
                return (
                  <g
                    key={a.id}
                    transform={`translate(${x} ${y})`}
                    className="cursor-pointer"
                    onClick={e => {
                      e.stopPropagation()
                      setSelectedId(a.id)
                    }}
                  >
                    {active ? <circle r="13" fill="none" stroke="#f8fafc" strokeWidth="1.4" opacity="0.9" /> : null}
                    <path
                      d={a.type === 'mine' ? GLYPHS.mine : GLYPHS.plant}
                      fill={a.type === 'mine' ? COLORS.mine : COLORS.plant}
                      stroke="#0b0d13"
                      strokeWidth="1"
                    />
                    <circle r="14" fill="transparent" />
                  </g>
                )
              })}

            {/* Ports */}
            {on('ports')
              ? mapped
                  .filter(a => a.type === 'port')
                  .map(a => {
                    const [x, y] = project(a.lon, a.lat)
                    const active = selectedId === a.id
                    return (
                      <g
                        key={a.id}
                        transform={`translate(${x} ${y})`}
                        className="cursor-pointer"
                        onClick={e => {
                          e.stopPropagation()
                          setSelectedId(a.id)
                        }}
                      >
                        {active ? <circle r="13" fill="none" stroke="#f8fafc" strokeWidth="1.4" opacity="0.9" /> : null}
                        <path d={GLYPHS.port} fill={COLORS.port} stroke="#0b0d13" strokeWidth="1" />
                        <circle r="14" fill="transparent" />
                      </g>
                    )
                  })
              : null}

            {/* Vessels offshore */}
            {on('ports')
              ? state.vessels.map(v => {
                  const [x, y] = project(v.lon, v.lat)
                  const risk = v.status === 'demurrage' || v.status === 'waiting_cargo'
                  const active = selectedId === v.id
                  return (
                    <g
                      key={v.id}
                      transform={`translate(${x} ${y})`}
                      className="cursor-pointer"
                      onClick={e => {
                        e.stopPropagation()
                        setSelectedId(v.id)
                      }}
                    >
                      {active ? <circle r="13" fill="none" stroke="#f8fafc" strokeWidth="1.4" opacity="0.9" /> : null}
                      {risk ? <circle r="10" fill="#f43f5e" opacity="0.22" /> : null}
                      <path d={GLYPHS.ship} fill={risk ? '#fda4af' : COLORS.ship} stroke="#0b0d13" strokeWidth="0.8" />
                      <circle r="13" fill="transparent" />
                    </g>
                  )
                })
              : null}

            {/* Truck convoys, position advanced each tick */}
            {on('trucks')
              ? convoyPoints.map(c => {
                  const [x, y] = project(c.lon, c.lat)
                  const active = selectedId === c.id
                  return (
                    <g
                      key={c.id}
                      transform={`translate(${x} ${y})`}
                      className="cursor-pointer"
                      onClick={e => {
                        e.stopPropagation()
                        setSelectedId(c.id)
                      }}
                    >
                      {active ? <circle r="13" fill="none" stroke="#f8fafc" strokeWidth="1.4" opacity="0.9" /> : null}
                      <path d={GLYPHS.truck} fill={COLORS.truck} stroke="#0b0d13" strokeWidth="1" />
                      <circle r="13" fill="transparent" />
                    </g>
                  )
                })
              : null}

            {/* Callout for whatever is selected, drawn last so it sits above every marker */}
            {(() => {
              if (!selectedId) return null
              const asset = state.assets.find(a => a.id === selectedId)
              if (asset) {
                const [x, y] = project(asset.lon, asset.lat)
                const detail =
                  asset.type === 'port'
                    ? `${formatTons(asset.stockpileTons)} · ${asset.loadRateTph} t/h`
                    : `${asset.tpd.toLocaleString()} t/d · ${asset.trucksWeighedToday} trucks`
                return <MapLabel x={x} y={y} title={asset.name} detail={detail} />
              }
              const vessel = state.vessels.find(v => v.id === selectedId)
              if (vessel) {
                const [x, y] = project(vessel.lon, vessel.lat)
                return (
                  <MapLabel
                    x={x}
                    y={y}
                    title={`${vessel.name} (${vessel.flag})`}
                    detail={`${formatTons(vessel.loadedTons)} / ${formatTons(vessel.capacityTons)}`}
                  />
                )
              }
              const convoy = convoyPoints.find(c => c.id === selectedId)
              if (convoy) {
                const [x, y] = project(convoy.lon, convoy.lat)
                return (
                  <MapLabel
                    x={x}
                    y={y}
                    title={convoy.label}
                    detail={`${convoy.trucks} × ${convoy.tonsPerTruck} t · ETA ${Math.round(convoy.etaHours)} h`}
                  />
                )
              }
              const siding = state.rail.flatMap(l => l.sidings).find(s => s.id === selectedId)
              if (siding) {
                const [x, y] = project(siding.lon, siding.lat)
                return (
                  <MapLabel x={x} y={y} title={siding.name} detail={`${formatTons(siding.tons)} · ${siding.wagons} wagons`} />
                )
              }
              return null
            })()}
          </svg>
        </div>

        <div className="flex flex-col gap-3 min-h-0 overflow-y-auto">
          <div className="p-3 rounded-2xl bg-[#14151c] border border-[#242836]">
            <div className="text-[9px] font-bold uppercase tracking-[0.14em] text-slate-500 mb-1.5">Selected</div>
            {selected ? (
              <>
                <div className="text-[13px] font-semibold text-white leading-tight">{selected.name}</div>
                <div className="flex items-center gap-1.5 mt-1">
                  <StatusBadge value={selected.status} />
                  <span className={`text-[10px] font-mono ${STATUS_TONE[selected.status] || 'text-slate-400'}`}>
                    {selected.country || selected.flag}
                  </span>
                </div>
                <dl className="mt-2 space-y-1 text-[11px]">
                  {selected.commodity ? (
                    <div className="flex justify-between gap-2">
                      <dt className="text-slate-500">Commodity</dt>
                      <dd className="text-slate-200 text-right">{selected.commodity}</dd>
                    </div>
                  ) : null}
                  {selected.cargo ? (
                    <div className="flex justify-between gap-2">
                      <dt className="text-slate-500">Cargo</dt>
                      <dd className="text-slate-200 text-right">{selected.cargo}</dd>
                    </div>
                  ) : null}
                  {selected.gradeLabel ? (
                    <div className="flex justify-between gap-2">
                      <dt className="text-slate-500">Grade</dt>
                      <dd className="text-slate-200 text-right">{selected.gradeLabel}</dd>
                    </div>
                  ) : null}
                  {selected.tpd ? (
                    <div className="flex justify-between gap-2">
                      <dt className="text-slate-500">Rate</dt>
                      <dd className="text-slate-200 tabular-nums">{selected.tpd.toLocaleString()} t/d</dd>
                    </div>
                  ) : null}
                  {selected.loadRateTph != null ? (
                    <div className="flex justify-between gap-2">
                      <dt className="text-slate-500">Load rate</dt>
                      <dd className="text-slate-200 tabular-nums">{selected.loadRateTph.toLocaleString()} t/h</dd>
                    </div>
                  ) : null}
                  {selected.stockpileTons != null ? (
                    <div className="flex justify-between gap-2">
                      <dt className="text-slate-500">Stockpile</dt>
                      <dd className="text-slate-200 tabular-nums">{formatTons(selected.stockpileTons)}</dd>
                    </div>
                  ) : null}
                  {selected.trucksWeighedToday ? (
                    <div className="flex justify-between gap-2">
                      <dt className="text-slate-500">Trucks weighed</dt>
                      <dd className="text-slate-200 tabular-nums">{selected.trucksWeighedToday}</dd>
                    </div>
                  ) : null}
                  {selected.capacityTons ? (
                    <div className="flex justify-between gap-2">
                      <dt className="text-slate-500">Loaded</dt>
                      <dd className="text-slate-200 tabular-nums">
                        {formatTons(selected.loadedTons)} / {formatTons(selected.capacityTons)}
                      </dd>
                    </div>
                  ) : null}
                  {selected.manager ? (
                    <div className="flex justify-between gap-2">
                      <dt className="text-slate-500">Manager</dt>
                      <dd className="text-slate-200 text-right">{selected.manager}</dd>
                    </div>
                  ) : null}
                </dl>
                {selected.note ? (
                  <p className="mt-2 text-[10.5px] leading-relaxed text-slate-400 border-t border-[#242836] pt-2">
                    {selected.note}
                  </p>
                ) : null}
              </>
            ) : (
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Nothing selected. Click a mine, plant, siding, convoy, port or ship on the map.
              </p>
            )}
          </div>

          <div className="p-3 rounded-2xl bg-[#14151c] border border-[#242836]">
            <div className="text-[9px] font-bold uppercase tracking-[0.14em] text-slate-500 mb-1.5 flex items-center gap-1.5">
              <AlertTriangle className="w-3 h-3 text-rose-400" />
              Vessels at risk
            </div>
            {riskVessels.length === 0 ? (
              <p className="text-[11px] text-slate-500">No laycan or demurrage exposure right now.</p>
            ) : (
              <ul className="space-y-1.5">
                {riskVessels.map(v => (
                  <li key={v.id}>
                    <button
                      type="button"
                      onClick={() => setSelectedId(v.id)}
                      className="w-full text-left px-2 py-1.5 rounded-lg bg-[#1a1d27] hover:bg-[#222636] border border-[#2a2e3c] transition cursor-pointer"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] font-semibold text-slate-200 truncate">{v.name}</span>
                        <StatusBadge value={v.status} />
                      </div>
                      <div className="text-[10px] text-slate-500 tabular-nums mt-0.5">
                        Laycan {v.laycanUsed}/{v.laycanDays} d
                        {v.demurrageUsdPerDay ? ` · $${v.demurrageUsdPerDay.toLocaleString()}/d` : ''}
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="p-3 rounded-2xl bg-[#14151c] border border-[#242836]">
            <div className="text-[9px] font-bold uppercase tracking-[0.14em] text-slate-500 mb-1.5">Rail sidings</div>
            <ul className="space-y-2">
              {state.rail.map(l => (
                <li key={l.id}>
                  <div className="text-[10.5px] font-semibold text-slate-300 leading-tight">{l.name}</div>
                  <div className="text-[9.5px] text-slate-500 mb-1">
                    {l.operator} · {l.lengthKm} km
                  </div>
                  {l.sidings.map(s => (
                    <div key={s.id} className="flex justify-between gap-2 text-[10.5px] py-0.5">
                      <button
                        type="button"
                        onClick={() => setSelectedId(s.id)}
                        className="text-slate-400 hover:text-slate-200 truncate cursor-pointer text-left"
                      >
                        {s.name}
                      </button>
                      <span className="text-slate-300 tabular-nums shrink-0">
                        {formatTons(s.tons)} · {s.wagons}w
                      </span>
                    </div>
                  ))}
                </li>
              ))}
            </ul>
          </div>

          <div className="p-3 rounded-2xl bg-[#14151c] border border-[#242836]">
            <div className="text-[9px] font-bold uppercase tracking-[0.14em] text-slate-500 mb-1.5">
              Outside map extent
            </div>
            <ul className="space-y-1">
              {rollup.unmappedAssets.map(a => (
                <li key={a.id} className="flex justify-between gap-2 text-[10.5px]">
                  <span className="text-slate-400 truncate">{a.name}</span>
                  <span className="text-slate-500 shrink-0">{a.country}</span>
                </li>
              ))}
            </ul>
            <p className="mt-1.5 text-[9.5px] text-slate-600 leading-tight">
              Counted in the book, not drawn on the Africa view.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
