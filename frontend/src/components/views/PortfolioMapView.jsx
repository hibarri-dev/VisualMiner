import React, { useCallback, useEffect, useMemo, useState } from 'react'
import {
  AlertTriangle,
  Anchor,
  Crosshair,
  Factory,
  Globe2,
  Maximize2,
  Minus,
  Mountain,
  Pickaxe,
  Plus,
  RotateCcw,
  Ship,
  TrainFront,
  Truck
} from 'lucide-react'
import StatusBadge from '../dashboard/StatusBadge'
import useZoomPan from '../../hooks/useZoomPan'
import {
  MAP_SIZE,
  headingAlong,
  pointAlong,
  project,
  toPath
} from '../../data/africaGeo'
import { COUNTRY_SHAPES, GRATICULE, isoForAlpha2 } from '../../data/africaCountries'
import {
  COUNTRIES,
  MAP_LAYERS,
  ROAD_CORRIDORS,
  TRUCK_FLEET,
  createPortfolioState,
  formatTons,
  portfolioRollup,
  tickPortfolio
} from '../../data/portfolio'

// Light land on dark water. Countries holding assets are lifted a shade so the map
// itself shows where the book is concentrated before you read a single label.
const LAND = '#b7c0cd'
const LAND_ACTIVE = '#e4eaf3'
const LAND_EDGE = '#7d8798'
const OCEAN_TOP = '#0a1119'
const OCEAN_BOTTOM = '#070b12'
const GRATICULE_INK = '#16202e'

/**
 * Real icons on coloured map-pin badges rather than hand-drawn polygons.
 *
 * Each entry pairs a lucide glyph with the fill it sits on and the ink it is drawn in.
 * The ink is picked per fill rather than being a single white: an anchor drawn white on
 * the mint port badge, or a ship drawn white on the near-white vessel badge, disappears.
 */
const MARKER_SPEC = {
  mine: { Icon: Pickaxe, fill: '#c026d3', ink: '#ffffff' },
  plant: { Icon: Factory, fill: '#fb923c', ink: '#231204' },
  port: { Icon: Anchor, fill: '#34d399', ink: '#04291d' },
  ship: { Icon: Ship, fill: '#f1f5f9', ink: '#0b1220' },
  shipRisk: { Icon: Ship, fill: '#fda4af', ink: '#450a18' },
  truck: { Icon: Truck, fill: '#38bdf8', ink: '#052a3d' },
  truckEmpty: { Icon: Truck, fill: '#7f93aa', ink: '#0c1620' },
  siding: { Icon: TrainFront, fill: '#a78bfa', ink: '#1e1145' }
}

// Line work only — marker fills now live in MARKER_SPEC.
const COLORS = {
  truck: '#38bdf8',
  rail: '#a78bfa'
}

// Glyphs are authored around a ~14 unit box. Markers counter-scale by 1/k to hold a
// constant screen size, so this multiplier is the one place that sets how big they read.
const MARKER_SCALE = 1.55
// Trucks are the most numerous thing on the map, so they sit a little under the assets
// to stop the corridors reading as a wall of icons.
const TRUCK_SCALE = 1.2

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

// One viewBox unit is 0.1 degrees, and a degree of latitude is ~111 km.
const KM_PER_UNIT = 11.1
const SCALE_STEPS = [50, 100, 200, 250, 500, 1000, 2000]

function Kpi({ label, value, sub, tone = 'text-white' }) {
  return (
    <div className="px-3 py-2 rounded-xl bg-[#14151c] border border-[#242836] min-w-0">
      <div className="text-[9px] font-bold uppercase tracking-[0.14em] text-slate-500 truncate">{label}</div>
      <div className={`text-[15px] font-semibold tabular-nums leading-tight mt-0.5 ${tone}`}>{value}</div>
      {sub ? <div className="text-[10px] text-slate-500 leading-tight truncate">{sub}</div> : null}
    </div>
  )
}

/**
 * A map pin. Lives inside the zoomed group so it tracks its geography, but
 * counter-scales by 1/k so it stays the same size on screen at every zoom level.
 */
function Marker({
  x,
  y,
  k,
  spec,
  active,
  hovered,
  risk,
  onSelect,
  onFocus,
  title,
  scale = MARKER_SCALE,
  radius = 11,
  heading = null
}) {
  const { Icon, fill, ink } = spec
  const size = radius * 1.45
  return (
    <g
      transform={`translate(${x} ${y}) scale(${scale / k})`}
      className="cursor-pointer"
      role="button"
      aria-label={title}
      onClick={onSelect}
      onDoubleClick={onFocus}
      onPointerEnter={hovered.enter}
      onPointerLeave={hovered.leave}
    >
      {risk ? <circle r={radius + 5} fill="#f43f5e" opacity="0.22" /> : null}
      {active ? (
        <circle r={radius + 4} fill="none" stroke="#f8fafc" strokeWidth="1.6" opacity="0.95" />
      ) : hovered.on ? (
        <circle r={radius + 3} fill="none" stroke="#f8fafc" strokeWidth="1.2" opacity="0.5" />
      ) : null}
      {/* Offset disc instead of an SVG drop-shadow filter: ~70 of these repaint at 30fps
          while the trucks roll, and filters are the one thing that makes that expensive. */}
      <circle cy="1.3" r={radius} fill="#000" opacity="0.38" />
      <circle r={radius} fill={fill} stroke="#0b0d13" strokeWidth="1.2" />
      {/* Direction pip for vehicles. The badge and its icon stay upright — rotating the
          badge itself would just hang the truck upside down on southbound legs. */}
      {heading !== null ? (
        <path
          d={`M ${radius + 4} 0 L ${radius - 1.5} -3.2 L ${radius - 1.5} 3.2 Z`}
          fill={fill}
          stroke="#0b0d13"
          strokeWidth="0.8"
          strokeLinejoin="round"
          transform={`rotate(${heading})`}
        />
      ) : null}
      <Icon x={-size / 2} y={-size / 2} size={size} color={ink} strokeWidth={2.9} />
      <circle r={radius + 4} fill="transparent" />
    </g>
  )
}

/**
 * Name + one number. Rendered in the overlay layer (screen space, outside the zoom
 * group) so it is always legible and its edge-flip test can use the real frame width.
 */
function MapLabel({ x, y, title, detail, dim }) {
  if (x < -40 || y < -40 || x > MAP_SIZE.width + 40 || y > MAP_SIZE.height + 40) return null
  const width = Math.max(title.length, detail.length) * 5.6 + 16
  const flipX = x + width + 14 > MAP_SIZE.width
  const left = flipX ? x - width - 12 : x + 12
  const top = y - 26
  return (
    <g pointerEvents="none" opacity={dim ? 0.85 : 1}>
      <line x1={x} y1={y} x2={flipX ? left + width : left} y2={top + 20} stroke="#f8fafc" strokeWidth="1" opacity="0.5" />
      <rect x={left} y={top} width={width} height={30} rx="5" fill="#0b0d13" stroke="#3f4657" opacity="0.96" />
      <text x={left + 8} y={top + 12.5} fill="#f1f5f9" fontSize="10.5" fontWeight="600">{title}</text>
      <text x={left + 8} y={top + 24} fill="#94a3b8" fontSize="9.5" fontFamily="ui-monospace, monospace">{detail}</text>
    </g>
  )
}

function ZoomButton({ label, onClick, disabled, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={label}
      aria-label={label}
      className="w-7 h-7 flex items-center justify-center rounded-md bg-black/60 border border-white/15 text-slate-200 backdrop-blur-sm transition-colors hover:bg-black/80 hover:text-white disabled:opacity-35 disabled:cursor-not-allowed cursor-pointer"
    >
      {children}
    </button>
  )
}

export default function PortfolioMapView({ onNavigate }) {
  const [state, setState] = useState(() => createPortfolioState())
  const [layers, setLayers] = useState(() => new Set(MAP_LAYERS.map(l => l.id)))
  const [selectedId, setSelectedId] = useState('port-beira')
  const [hoverId, setHoverId] = useState(null)

  const {
    svgRef,
    view,
    panning,
    transform,
    handlers,
    zoomBy,
    focusOn,
    reset,
    panBy,
    wasDragged,
    minScale,
    maxScale
  } = useZoomPan({ width: MAP_SIZE.width, height: MAP_SIZE.height, minScale: 1, maxScale: 16 })

  useEffect(() => {
    const id = setInterval(() => setState(prev => tickPortfolio(prev)), 2500)
    return () => clearInterval(id)
  }, [])

  const rollup = useMemo(() => portfolioRollup(state), [state])
  const mapped = useMemo(() => state.assets.filter(a => a.region === 'africa'), [state.assets])

  // The 2.5s data heartbeat is the wrong clock for vehicles — it makes trucks teleport
  // in visible hops. Positions run off their own rAF clock instead, so the icons roll
  // smoothly while tonnages and weighbridge counts keep stepping on the slow tick.
  const [clock, setClock] = useState(0)
  useEffect(() => {
    let raf = 0
    const t0 = performance.now()
    let last = 0
    const step = now => {
      // ~30fps. A truck takes over a minute to cross its corridor, so the extra frames
      // are invisible, and capping halves the cost of re-rendering the map each tick.
      if (now - last >= 33) {
        last = now
        setClock((now - t0) / 1000)
      }
      raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [])

  const trucks = useMemo(
    () =>
      TRUCK_FLEET.map(tr => {
        const corridor = ROAD_CORRIDORS.find(r => r.id === tr.corridorId)
        if (!corridor) return { ...tr, lon: 0, lat: 0, heading: 0 }
        const p = (tr.phase + clock * tr.speed) % 1
        // Laden trucks run pit -> port; empties run the same road backwards.
        const t = tr.laden ? p : 1 - p
        const [lon, lat] = pointAlong(corridor.path, t)
        const heading = headingAlong(corridor.path, t)
        return {
          ...tr,
          lon,
          lat,
          // The glyph is drawn nose-right, so the tangent is the rotation; empties are
          // travelling against it and get flipped.
          heading: (heading * 180) / Math.PI + (tr.laden ? 0 : 180)
        }
      }),
    [clock]
  )

  // Assets, vessels, convoys and sidings are different shapes but the detail card
  // only ever reads a common subset — normalise the odd ones on the way in.
  const selected = useMemo(() => {
    if (!selectedId) return null
    const asset = state.assets.find(a => a.id === selectedId)
    if (asset) return asset
    const vessel = state.vessels.find(v => v.id === selectedId)
    if (vessel) return vessel
    const tr = TRUCK_FLEET.find(t => t.id === selectedId)
    if (tr) {
      const convoy = state.convoys.find(c => c.id === tr.convoyId)
      return {
        name: `${tr.laden ? 'Laden' : 'Empty'} tipper — ${tr.label}`,
        status: tr.laden ? 'hauling' : 'returning',
        commodity: `${tr.tonsPerTruck} t side tipper`,
        payloadLabel: tr.laden
          ? `${tr.tonsPerTruck} t — weighed out at the pit gate`
          : 'Empty — inbound for loading',
        gradeLabel: convoy ? `Convoy ETA ${Math.round(convoy.etaHours)} h` : null,
        note: convoy ? convoy.note : null
      }
    }
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

  /** Geographic position of anything selectable, so the map can fly to it. */
  const locate = useCallback(
    id => {
      const asset = state.assets.find(a => a.id === id)
      if (asset) return [asset.lon, asset.lat]
      const vessel = state.vessels.find(v => v.id === id)
      if (vessel) return [vessel.lon, vessel.lat]
      const truck = trucks.find(t => t.id === id)
      if (truck) return [truck.lon, truck.lat]
      const siding = state.rail.flatMap(l => l.sidings).find(s => s.id === id)
      if (siding) return [siding.lon, siding.lat]
      return null
    },
    [state, trucks]
  )

  const focusId = useCallback(
    (id, k = 5.5) => {
      const at = locate(id)
      if (!at) return
      const [wx, wy] = project(at[0], at[1])
      focusOn(wx, wy, Math.max(view.k, k))
    },
    [locate, focusOn, view.k]
  )

  /** Select from a side panel: highlight it and bring it into frame. */
  const pickAndFocus = useCallback(
    id => {
      setSelectedId(id)
      focusId(id)
    },
    [focusId]
  )

  /**
   * Drop from the continent straight into a pit. Mines carry their own identity into
   * the 3D view; the terrain mesh itself is the shared reference twin, so the view
   * labels which asset it is standing in for.
   */
  const openPit = useCallback(
    asset => {
      setSelectedId(asset.id)
      onNavigate?.('maps', { asset })
    },
    [onNavigate]
  )

  // Clicks arriving after a drag are the tail of a pan gesture, not a selection.
  const guarded = useCallback(
    fn => e => {
      e.stopPropagation()
      if (wasDragged()) return
      fn()
    },
    [wasDragged]
  )

  const countryCounts = useMemo(() => {
    const counts = new Map()
    mapped.forEach(a => counts.set(a.countryCode, (counts.get(a.countryCode) || 0) + 1))
    return counts
  }, [mapped])

  // ISO numerics of the countries we actually operate in, for the land highlight.
  const activeIso = useMemo(() => {
    const set = new Set()
    mapped.forEach(a => {
      const iso = isoForAlpha2(a.countryCode)
      if (iso) set.add(iso)
    })
    return set
  }, [mapped])

  const toggleLayer = id =>
    setLayers(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })

  const on = id => layers.has(id)
  const riskVessels = state.vessels.filter(v => v.status === 'demurrage' || v.status === 'waiting_cargo')

  /** World (lon/lat) -> overlay coordinates, i.e. after pan and zoom. */
  const toScreen = useCallback(
    (lon, lat) => {
      const [wx, wy] = project(lon, lat)
      return [wx * view.k + view.x, wy * view.k + view.y]
    },
    [view]
  )

  const hoverFor = id => ({
    on: hoverId === id,
    enter: () => setHoverId(id),
    leave: () => setHoverId(current => (current === id ? null : current))
  })

  const onKeyDown = e => {
    const step = 60 / view.k
    if (e.key === 'ArrowLeft') panBy(step, 0)
    else if (e.key === 'ArrowRight') panBy(-step, 0)
    else if (e.key === 'ArrowUp') panBy(0, step)
    else if (e.key === 'ArrowDown') panBy(0, -step)
    else if (e.key === '+' || e.key === '=') zoomBy(1.5)
    else if (e.key === '-' || e.key === '_') zoomBy(1 / 1.5)
    else if (e.key === '0') reset()
    else if (e.key === 'Escape') setSelectedId(null)
    else return
    e.preventDefault()
  }

  // Scale bar: pick the round distance that renders closest to ~90 units wide.
  const scaleKm = SCALE_STEPS.reduce((best, km) => {
    const target = (90 * KM_PER_UNIT) / view.k
    return Math.abs(km - target) < Math.abs(best - target) ? km : best
  }, SCALE_STEPS[0])
  const scaleUnits = (scaleKm * view.k) / KM_PER_UNIT

  // Country names are geography, not data — hold them at a constant screen size and
  // fade them back once the zoom is deep enough that the assets are the subject.
  const labelScale = 1 / view.k
  const countryOpacity = view.k > 6 ? 0.35 : 1

  const labelFor = id => {
    const asset = state.assets.find(a => a.id === id)
    if (asset) {
      const [x, y] = toScreen(asset.lon, asset.lat)
      const detail =
        asset.type === 'port'
          ? `${formatTons(asset.stockpileTons)} · ${asset.loadRateTph} t/h`
          : `${asset.tpd.toLocaleString()} t/d · ${asset.trucksWeighedToday} trucks`
      return { x, y, title: asset.name, detail }
    }
    const vessel = state.vessels.find(v => v.id === id)
    if (vessel) {
      const [x, y] = toScreen(vessel.lon, vessel.lat)
      return {
        x,
        y,
        title: `${vessel.name} (${vessel.flag})`,
        detail: `${formatTons(vessel.loadedTons)} / ${formatTons(vessel.capacityTons)}`
      }
    }
    const truck = trucks.find(t => t.id === id)
    if (truck) {
      const [x, y] = toScreen(truck.lon, truck.lat)
      return {
        x,
        y,
        title: truck.label,
        detail: truck.laden ? `Laden · ${truck.tonsPerTruck} t` : 'Empty · returning to pit'
      }
    }
    const siding = state.rail.flatMap(l => l.sidings).find(s => s.id === id)
    if (siding) {
      const [x, y] = toScreen(siding.lon, siding.lat)
      return { x, y, title: siding.name, detail: `${formatTons(siding.tons)} · ${siding.wagons} wagons` }
    }
    return null
  }

  const selectedLabel = selectedId ? labelFor(selectedId) : null
  const hoverLabel = hoverId && hoverId !== selectedId ? labelFor(hoverId) : null

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[#0d0e12] overflow-y-auto xl:overflow-hidden">
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
        <div
          className="relative min-h-[58vh] sm:min-h-[62vh] xl:min-h-[340px] rounded-2xl overflow-hidden bg-[#07090f] border border-[#232634] shadow-xl"
        >
          <div className="absolute left-3 top-3 z-20 flex flex-wrap items-center gap-1.5 pointer-events-none">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Africa operations</span>
            <StatusBadge value="live" />
          </div>

          <div className="absolute right-3 top-3 z-20 flex flex-wrap justify-end gap-1 max-w-[70%]">
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

          {/* Zoom controls */}
          <div className="absolute right-3 bottom-3 z-20 flex flex-col items-end gap-1">
            <div className="px-1.5 py-0.5 rounded-md bg-black/60 border border-white/15 backdrop-blur-sm text-[9px] font-mono text-slate-300 tabular-nums">
              {view.k.toFixed(1)}×
            </div>
            <ZoomButton label="Zoom in" onClick={() => zoomBy(1.6)} disabled={view.k >= maxScale - 0.01}>
              <Plus className="w-3.5 h-3.5" />
            </ZoomButton>
            <ZoomButton label="Zoom out" onClick={() => zoomBy(1 / 1.6)} disabled={view.k <= minScale + 0.01}>
              <Minus className="w-3.5 h-3.5" />
            </ZoomButton>
            <ZoomButton label="Zoom to selection" onClick={() => selectedId && focusId(selectedId, 6)} disabled={!selectedId}>
              <Crosshair className="w-3.5 h-3.5" />
            </ZoomButton>
            <ZoomButton label="Fit continent" onClick={reset} disabled={view.k <= minScale + 0.01}>
              <Maximize2 className="w-3.5 h-3.5" />
            </ZoomButton>
          </div>

          <div className="absolute left-3 bottom-3 z-20 pointer-events-none text-[9px] text-slate-500 leading-tight">
            Scroll to zoom · drag to pan · double-click a mine for its 3D pit
          </div>

          <svg
            ref={svgRef}
            viewBox={`0 0 ${MAP_SIZE.width} ${MAP_SIZE.height}`}
            className={`absolute inset-0 w-full h-full outline-none ${panning ? 'cursor-grabbing' : 'cursor-grab'}`}
            preserveAspectRatio="xMidYMid meet"
            style={{ touchAction: 'none' }}
            tabIndex={0}
            role="application"
            aria-label="Africa operations map. Arrow keys pan, plus and minus zoom, 0 resets."
            onKeyDown={onKeyDown}
            onClick={() => {
              if (!wasDragged()) setSelectedId(null)
            }}
            {...handlers}
          >
            <defs>
              <linearGradient id="pm-ocean" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={OCEAN_TOP} />
                <stop offset="100%" stopColor={OCEAN_BOTTOM} />
              </linearGradient>
            </defs>

            <rect width={MAP_SIZE.width} height={MAP_SIZE.height} fill="url(#pm-ocean)" />

            <g transform={transform}>
              {/* Graticule first: gives the water some depth without competing with the land. */}
              <path
                d={GRATICULE}
                fill="none"
                stroke={GRATICULE_INK}
                strokeWidth="1"
                vectorEffect="non-scaling-stroke"
              />

              {/* Real borders, one path per country. */}
              {COUNTRY_SHAPES.map(c => (
                <path
                  key={c.id}
                  d={c.d}
                  fill={activeIso.has(c.id) ? LAND_ACTIVE : LAND}
                  stroke={LAND_EDGE}
                  strokeWidth="0.6"
                  strokeLinejoin="round"
                  vectorEffect="non-scaling-stroke"
                />
              ))}

              {/* Country labels. No internal borders in the outline, so the asset count
                  next to the name is what tells an executive where the book is concentrated. */}
              {COUNTRIES.map(c => {
                const [x, y] = project(c.lon, c.lat)
                const count = countryCounts.get(c.code) || 0
                return (
                  <g
                    key={c.code}
                    pointerEvents="none"
                    opacity={countryOpacity}
                    transform={`translate(${x} ${y}) scale(${labelScale})`}
                  >
                    <text textAnchor="middle" fill="#3f4757" fontSize="10" fontWeight="700" letterSpacing="0.4">
                      {c.name.toUpperCase()}
                    </text>
                    {count ? (
                      <text y="11" textAnchor="middle" fill="#5b6478" fontSize="9" fontFamily="ui-monospace, monospace">
                        {count} assets
                      </text>
                    ) : null}
                  </g>
                )
              })}

              {/* Rail corridors + sidings */}
              {on('rail')
                ? /* Corridor paths run pit -> port, so a negative dash offset makes the
                   dashes crawl the way the coal actually travels. */
                state.rail.map(line => (
                    <g key={line.id}>
                      <path
                        d={toPath(line.path, false)}
                        fill="none"
                        stroke={COLORS.rail}
                        strokeWidth="2"
                        strokeDasharray="7 4"
                        strokeDashoffset={-clock * 9}
                        opacity="0.85"
                        vectorEffect="non-scaling-stroke"
                      />
                      {line.sidings.map(s => {
                        const [x, y] = project(s.lon, s.lat)
                        return (
                          <Marker
                            key={s.id}
                            x={x}
                            y={y}
                            k={view.k}
                            spec={MARKER_SPEC.siding}
                            radius={9}
                            title={s.name}
                            active={selectedId === s.id}
                            hovered={hoverFor(s.id)}
                            onSelect={guarded(() => setSelectedId(s.id))}
                            onFocus={guarded(() => pickAndFocus(s.id))}
                          />
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
                      strokeDashoffset={-clock * 6}
                      opacity="0.5"
                      vectorEffect="non-scaling-stroke"
                    />
                  ))
                : null}

              {/* Mines and plants */}
              {mapped
                .filter(a => (a.type === 'mine' && on('mines')) || (a.type === 'plant' && on('plants')))
                .map(a => {
                  const [x, y] = project(a.lon, a.lat)
                  return (
                    <Marker
                      key={a.id}
                      x={x}
                      y={y}
                      k={view.k}
                      spec={a.type === 'mine' ? MARKER_SPEC.mine : MARKER_SPEC.plant}
                      title={a.name}
                      active={selectedId === a.id}
                      hovered={hoverFor(a.id)}
                      onSelect={guarded(() => setSelectedId(a.id))}
                      onFocus={guarded(() => (a.type === 'mine' ? openPit(a) : pickAndFocus(a.id)))}
                    />
                  )
                })}

              {/* Ports */}
              {on('ports')
                ? mapped
                    .filter(a => a.type === 'port')
                    .map(a => {
                      const [x, y] = project(a.lon, a.lat)
                      return (
                        <Marker
                          key={a.id}
                          x={x}
                          y={y}
                          k={view.k}
                          spec={MARKER_SPEC.port}
                          title={a.name}
                          active={selectedId === a.id}
                          hovered={hoverFor(a.id)}
                          onSelect={guarded(() => setSelectedId(a.id))}
                          onFocus={guarded(() => pickAndFocus(a.id))}
                        />
                      )
                    })
                : null}

              {/* Vessels offshore */}
              {on('ports')
                ? state.vessels.map(v => {
                    const [x, y] = project(v.lon, v.lat)
                    const risk = v.status === 'demurrage' || v.status === 'waiting_cargo'
                    return (
                      <Marker
                        key={v.id}
                        x={x}
                        y={y}
                        k={view.k}
                        spec={risk ? MARKER_SPEC.shipRisk : MARKER_SPEC.ship}
                        title={v.name}
                        risk={risk}
                        active={selectedId === v.id}
                        hovered={hoverFor(v.id)}
                        onSelect={guarded(() => setSelectedId(v.id))}
                        onFocus={guarded(() => pickAndFocus(v.id))}
                      />
                    )
                  })
                : null}

              {/* Trucks rolling the corridors, laden out and empty back */}
              {on('trucks')
                ? trucks.map(tr => {
                    const [x, y] = project(tr.lon, tr.lat)
                    return (
                      <Marker
                        key={tr.id}
                        x={x}
                        y={y}
                        k={view.k}
                        scale={TRUCK_SCALE}
                        radius={8.5}
                        heading={tr.heading}
                        spec={tr.laden ? MARKER_SPEC.truck : MARKER_SPEC.truckEmpty}
                        title={`${tr.laden ? 'Laden' : 'Empty'} tipper — ${tr.label}`}
                        active={selectedId === tr.id}
                        hovered={hoverFor(tr.id)}
                        onSelect={guarded(() => setSelectedId(tr.id))}
                        onFocus={guarded(() => pickAndFocus(tr.id))}
                      />
                    )
                  })
                : null}
            </g>

            {/* Overlay layer: screen space, so callouts stay legible at any zoom. */}
            {hoverLabel ? <MapLabel {...hoverLabel} dim /> : null}
            {selectedLabel ? <MapLabel {...selectedLabel} /> : null}

            {/* Scale bar, also outside the zoom group so it can restate itself in km. */}
            <g transform={`translate(14 ${MAP_SIZE.height - 34})`} pointerEvents="none">
              <line x1="0" y1="0" x2={scaleUnits} y2="0" stroke="#94a3b8" strokeWidth="1.5" />
              <line x1="0" y1="-4" x2="0" y2="4" stroke="#94a3b8" strokeWidth="1.5" />
              <line x1={scaleUnits} y1="-4" x2={scaleUnits} y2="4" stroke="#94a3b8" strokeWidth="1.5" />
              <text x={scaleUnits / 2} y="-8" textAnchor="middle" fill="#94a3b8" fontSize="10" fontFamily="ui-monospace, monospace">
                {scaleKm.toLocaleString()} km
              </text>
            </g>
          </svg>
        </div>

        <div className="flex flex-col gap-3 min-h-0 xl:overflow-y-auto">
          <div className="p-3 rounded-2xl bg-[#14151c] border border-[#242836]">
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <div className="text-[9px] font-bold uppercase tracking-[0.14em] text-slate-500">Selected</div>
              {selected ? (
                <button
                  type="button"
                  onClick={() => focusId(selectedId, 6)}
                  className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-slate-400 hover:text-slate-100 transition cursor-pointer"
                >
                  <Crosshair className="w-3 h-3" />
                  Zoom to
                </button>
              ) : null}
            </div>
            {selected ? (
              <>
                <div className="text-[13px] font-semibold text-white leading-tight">{selected.name}</div>
                <div className="flex items-center gap-1.5 mt-1">
                  <StatusBadge value={selected.status} />
                  <span className={`text-[10px] font-mono ${STATUS_TONE[selected.status] || 'text-slate-400'}`}>
                    {selected.country || selected.flag}
                  </span>
                </div>
                {selected.type === 'mine' ? (
                  <button
                    type="button"
                    onClick={() => openPit(selected)}
                    className="mt-2 w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold bg-indigo-500/15 hover:bg-indigo-500/25 text-indigo-200 border border-indigo-500/40 transition cursor-pointer"
                  >
                    <Mountain className="w-3.5 h-3.5" />
                    Open 3D pit view
                  </button>
                ) : null}
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
                  {selected.payloadLabel ? (
                    <div className="flex justify-between gap-2">
                      <dt className="text-slate-500">Payload</dt>
                      <dd className="text-slate-200 text-right">{selected.payloadLabel}</dd>
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
                      onClick={() => pickAndFocus(v.id)}
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
                        onClick={() => pickAndFocus(s.id)}
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
