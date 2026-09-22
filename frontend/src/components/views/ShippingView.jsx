import React, { useState, useEffect } from 'react'
import {
  Anchor,
  Truck,
  AlertTriangle,
  Building2,
  Ship,
  Compass,
  CheckCircle2,
  Plus,
  MapPin,
  Wind,
  Navigation,
  Activity,
  DollarSign,
  Clock,
  X,
  CloudRain,
  Radio,
  TrendingDown
} from 'lucide-react'
import { INCOTERMS, DEMO_CLIENTS, MOCK_TRUCKS, MOCK_VESSELS, DEMO_SCENARIOS } from '../../data/shippingData'

/* ─────────────────────────────────────────────────────────────
   SVG Live Ocean Map
   Indian Ocean corridor: South Africa → Mozambique → India
   Coordinates are normalised inside a 900×480 viewBox
   lat/lon → x,y  :  x = (lon+20)/160*900  y = (30-lat)/70*480
───────────────────────────────────────────────────────────── */
function project(lon, lat) {
  const x = ((lon + 20) / 160) * 900
  const y = ((30 - lat) / 70) * 480
  return { x, y }
}

const PORTS = [
  { id: 'rb',      name: 'Richards Bay',    lon: 32.1,  lat: -28.8, status: 'loading',   tomTomIdx: 95 },
  { id: 'maputo',  name: 'Maputo Terminal', lon: 32.6,  lat: -25.9, status: 'active',    tomTomIdx: 12 },
  { id: 'mangalore',name: 'Mangalore Port', lon: 74.8,  lat: 12.9,  status: 'congested', tomTomIdx: 85 },
  { id: 'mundra',  name: 'Mundra Port',     lon: 70.2,  lat: 22.8,  status: 'clear',     tomTomIdx: 40 },
]

// Vessel positions (lon, lat along Indian Ocean)
const VESSEL_POSITIONS = [
  {
    id: 'VES-JINDAL-ENT',
    name: 'MV Jindal Enterprise',
    lon: 65.0, lat: -5.0,
    status: 'HIGH_DEMURRAGE_RISK',
    heading: 45,
    cargo: '68,500 T  RB1',
    incoterm: 'DAP',
    client: 'Jindal Steel & Power Ltd',
    from: 'Richards Bay, SA',
    to: 'Mangalore, India',
    demurrage: '$98,000',
  },
  {
    id: 'VES-AFRICAN-FLAME',
    name: 'MV African Flame',
    lon: 38.0, lat: -12.0,
    status: 'ON_SCHEDULE',
    heading: 35,
    cargo: '42,000 T  RB2',
    incoterm: 'FOB',
    client: 'ArcelorMittal Global Trading',
    from: 'Maputo, Mozambique',
    to: 'Mundra, India',
    demurrage: '$0',
  },
]

// Animated dashed route paths (SVG polyline points)
const ROUTES = [
  {
    id: 'route-jindal',
    status: 'HIGH_DEMURRAGE_RISK',
    // Richards Bay → open ocean → Mangalore
    points: [
      project(32.1, -28.8),
      project(40, -25),
      project(55, -15),
      project(65, -5),
      project(72, 5),
      project(74.8, 12.9),
    ]
  },
  {
    id: 'route-flame',
    status: 'ON_SCHEDULE',
    // Maputo → open ocean → Mundra
    points: [
      project(32.6, -25.9),
      project(38, -12),
      project(55, -5),
      project(65, 5),
      project(70.2, 22.8),
    ]
  }
]

// Risk zone circles (lon, lat, radius in svg units)
const RISK_ZONES = [
  { lon: 74.8, lat: 12.9, r: 35, type: 'danger',  label: 'Mangalore: 0 Berth Slots' },
  { lon: 32.1, lat: -28.8, r: 25, type: 'safe',   label: 'Richards Bay: Loading Active' },
  { lon: 32.6, lat: -25.9, r: 22, type: 'safe',   label: 'Maputo: Clear' },
  { lon: 70.2, lat: 22.8,  r: 22, type: 'safe',   label: 'Mundra: Slots Available' },
]

function pointsToString(pts) {
  return pts.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')
}

function ShipIcon({ x, y, status, scale = 1, onClick, label, pulsing }) {
  const color = status === 'HIGH_DEMURRAGE_RISK' ? '#f43f5e' : '#10b981'
  const glow   = status === 'HIGH_DEMURRAGE_RISK' ? '#f43f5e55' : '#10b98144'
  return (
    <g
      transform={`translate(${x},${y})`}
      onClick={onClick}
      style={{ cursor: 'pointer' }}
    >
      {/* Pulse ring */}
      {pulsing && (
        <circle r="22" fill="none" stroke={color} strokeWidth="1.5" opacity="0.5">
          <animate attributeName="r" from="14" to="28" dur="2s" repeatCount="indefinite" />
          <animate attributeName="opacity" from="0.6" to="0" dur="2s" repeatCount="indefinite" />
        </circle>
      )}
      {/* Glow halo */}
      <circle r="12" fill={glow} />
      {/* Ship body */}
      <polygon
        points="0,-10 7,6 0,3 -7,6"
        fill={color}
        stroke="white"
        strokeWidth="0.8"
      />
      {/* Label */}
      <text
        y="20"
        textAnchor="middle"
        fill="white"
        fontSize="7"
        fontFamily="monospace"
        fontWeight="bold"
        style={{ pointerEvents: 'none' }}
      >
        {label}
      </text>
    </g>
  )
}

function PortDot({ port }) {
  const p = project(port.lon, port.lat)
  const isHighTraffic = port.tomTomIdx > 80
  const color = port.status === 'congested' ? '#f43f5e' : (isHighTraffic ? '#f59e0b' : '#6366f1')
  return (
    <g>
      {/* TomTom Traffic Radar Map */}
      {isHighTraffic && (
        <circle cx={p.x} cy={p.y} r="18" fill={color} opacity="0.15">
          <animate attributeName="r" from="5" to="35" dur="3s" repeatCount="indefinite" />
          <animate attributeName="opacity" from="0.3" to="0" dur="3s" repeatCount="indefinite" />
        </circle>
      )}
      <circle cx={p.x} cy={p.y} r="5" fill={color} stroke="white" strokeWidth="1" />
      <circle cx={p.x} cy={p.y} r="9" fill="none" stroke={color} strokeWidth="0.8" opacity="0.5" />
      <text x={p.x + 8} y={p.y + 3} fill="#e2e8f0" fontSize="7.5" fontWeight="bold" fontFamily="sans-serif">
        {port.name}
      </text>
      {(port.status === 'congested' || isHighTraffic) && (
        <text x={p.x + 8} y={p.y + 13} fill={color} fontSize="6" fontFamily="sans-serif">
          {port.status === 'congested' ? '⚠ CONGESTED' : `⚠ TOMTOM IDX: ${port.tomTomIdx}`}
        </text>
      )}
    </g>
  )
}

export default function ShippingView() {
  const [activeScenarioId, setActiveScenarioId]   = useState('scen-dap-sa-india')
  const [showAdminForm, setShowAdminForm]          = useState(false)
  const [selectedTruck, setSelectedTruck]          = useState(null)
  const [selectedVessel, setSelectedVessel]        = useState(null)
  const [hoveredVessel, setHoveredVessel]          = useState(null)
  const [tick, setTick]                            = useState(0)

  const [newClient, setNewClient]       = useState(DEMO_CLIENTS[0].name)
  const [newProduct, setNewProduct]     = useState('RB1 High CV Export Coal')
  const [newVolume, setNewVolume]       = useState(50000)
  const [newLoadingPort, setNewLoadingPort] = useState('Richards Bay Dry Bulk Terminal')
  const [newIncoterm, setNewIncoterm]   = useState('CIF')
  const [newDestPort, setNewDestPort]   = useState('New Mangalore Bulk Port (India)')
  const [deals, setDeals]               = useState([
    { id: 'DEAL-8901', client: 'Jindal Steel & Power Ltd', product: 'RB1 High CV Coal', volumeTons: 68500, portOfLoading: 'Richards Bay', portOfDestination: 'Mangalore', incoterm: 'DAP', status: 'HIGH_DEMURRAGE_RISK' },
    { id: 'DEAL-4412', client: 'ArcelorMittal Global Trading', product: 'RB2 Export Coal', volumeTons: 42000, portOfLoading: 'Maputo', portOfDestination: 'Mundra', incoterm: 'FOB', status: 'ON_SCHEDULE' },
  ])

  const activeIncotermObj = INCOTERMS.find(i => i.code === newIncoterm) || INCOTERMS[0]

  // Animate vessel movement tick
  useEffect(() => {
    const t = setInterval(() => setTick(p => p + 1), 1800)
    return () => clearInterval(t)
  }, [])

  const handleAddDeal = e => {
    e.preventDefault()
    setDeals([{
      id: `DEAL-${Math.floor(1000 + Math.random() * 9000)}`,
      client: newClient, product: newProduct, volumeTons: Number(newVolume),
      portOfLoading: newLoadingPort, portOfDestination: activeIncotermObj.buyerPortRequired ? newDestPort : 'N/A',
      incoterm: newIncoterm, status: 'ON_SCHEDULE'
    }, ...deals])
    setShowAdminForm(false)
  }

  // Animate vessel position slightly along route
  function animatedPos(v) {
    const offset = Math.sin(tick * 0.15 + (v.id === 'VES-JINDAL-ENT' ? 0 : Math.PI)) * 0.6
    return project(v.lon + offset, v.lat + offset * 0.3)
  }

  const fullVessel = id => MOCK_VESSELS.find(v => v.id === id)

  return (
    <div className="min-h-full pb-16 bg-[#0a0b0f] text-slate-100 flex-1 space-y-0">

      {/* ── TOP HEADER ── */}
      <div className="bg-gradient-to-r from-[#0d0f1a] via-[#111527] to-[#0d0f1a] border-b border-indigo-900/40 px-5 sm:px-7 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 text-[11px] font-bold uppercase tracking-widest">
            <Anchor className="w-4 h-4" />
            <span>Pit-to-Port Live Operations</span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-mono animate-pulse">● LIVE</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white mt-0.5 tracking-tight">Shipping & Demurrage Control Hub</h1>
          <p className="text-slate-400 text-xs mt-0.5">Live vessel tracking · Laycan timers · Berth congestion · Demurrage prediction</p>
        </div>
        <button
          onClick={() => setShowAdminForm(!showAdminForm)}
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-indigo-600/30 cursor-pointer transition shrink-0"
        >
          <Plus className="w-4 h-4" />
          Configure Deal & Incoterm
        </button>
      </div>

      {/* ── KPI STRIP ── */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-0 border-b border-[#1a1d2a]">
        {[
          { label: 'Active Vessels', value: '3', sub: 'Indian Ocean', color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
          { label: 'Demurrage Risk', value: '$143,000', sub: 'across 2 vessels', color: 'text-rose-400', bg: 'bg-rose-500/10' },
          { label: 'Missing Coal / Yield Loss', value: '1,900 T', sub: 'Flagged Discrepancies', color: 'text-rose-400', bg: 'bg-rose-950/20', icon: TrendingDown },
          { label: 'Laytime Remaining', value: 'Avg 8 hrs', sub: 'DAP Shipments', color: 'text-amber-400', bg: 'bg-amber-500/10' },
          { label: 'On-Time Vessels', value: '1 / 3', sub: 'MV African Flame OK', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
        ].map(k => (
          <div key={k.label} className={`${k.bg} border-r border-[#1a1d2a] last:border-r-0 px-4 py-3 relative overflow-hidden`}>
            {k.icon && <k.icon className="absolute -right-2 -bottom-2 w-12 h-12 opacity-5 text-rose-500 pointer-events-none" />}
            <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">{k.label}</div>
            <div className={`text-xl font-black mt-0.5 ${k.color}`}>{k.value}</div>
            <div className="text-[10px] text-slate-500 mt-0.5">{k.sub}</div>
          </div>
        ))}
      </div>

      {/* ── LIVE OCEAN MAP ── */}
      <div className="relative bg-[#07090f] border-b border-[#1a1d2a] overflow-hidden">
        {/* Map legend */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-rose-300">
            <span className="w-3 h-3 rounded-full bg-rose-500/50 border border-rose-400 block" />
            Demurrage Risk Zone
          </div>
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-300">
            <span className="w-3 h-3 rounded-full bg-emerald-500/30 border border-emerald-400 block" />
            Clear / On-Schedule
          </div>
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-indigo-300">
            <span className="w-3 h-3 rounded-full bg-indigo-500/50 border border-indigo-400 block" />
            Active Port
          </div>
        </div>

        {/* Title badge */}
        <div className="absolute top-3 right-3 z-10 px-2.5 py-1 rounded-lg bg-black/60 border border-indigo-500/30 text-[10px] font-mono text-indigo-300">
          Indian Ocean Trade Route  ·  Live MarineTraffic Sync
        </div>

        <svg
          viewBox="0 0 900 480"
          className="w-full"
          style={{ maxHeight: '480px' }}
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <radialGradient id="oceanGrad" cx="50%" cy="50%" r="70%">
              <stop offset="0%" stopColor="#0c1a3a" />
              <stop offset="100%" stopColor="#060a14" />
            </radialGradient>
            <radialGradient id="dangerZone" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#f43f5e" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="safeZone" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
            </radialGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <filter id="shipGlow">
              <feGaussianBlur stdDeviation="5" result="coloredBlur" />
              <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>

          {/* Ocean background */}
          <rect width="900" height="480" fill="url(#oceanGrad)" />

          {/* Ocean grid lines */}
          {[0, 80, 160, 240, 320, 400, 480, 560, 640, 720, 800, 880].map(x => (
            <line key={`vg${x}`} x1={x} y1={0} x2={x} y2={480} stroke="#1e3a5f" strokeWidth="0.4" />
          ))}
          {[0, 60, 120, 180, 240, 300, 360, 420, 480].map(y => (
            <line key={`hg${y}`} x1={0} y1={y} x2={900} y2={y} stroke="#1e3a5f" strokeWidth="0.4" />
          ))}

          {/* Africa landmass (simplified polygon) */}
          <polygon
            points="70,80 120,60 160,70 190,140 200,200 185,280 165,340 150,390 140,420 100,440 60,420 30,360 20,280 30,200 50,140"
            fill="#0f1e10"
            stroke="#1a3320"
            strokeWidth="1"
          />
          {/* Indian subcontinent */}
          <polygon
            points="680,40 740,30 800,50 840,80 860,140 840,200 800,240 750,260 700,240 660,200 640,160 650,100"
            fill="#0f1e10"
            stroke="#1a3320"
            strokeWidth="1"
          />
          {/* Arabian peninsula */}
          <polygon
            points="680,30 720,10 780,0 820,20 820,60 780,80 720,60 680,50"
            fill="#0f1e10"
            stroke="#1a3320"
            strokeWidth="1"
          />

          {/* Risk zones */}
          {RISK_ZONES.map(z => {
            const p = project(z.lon, z.lat)
            return (
              <g key={z.id}>
                <circle
                  cx={p.x} cy={p.y}
                  r={z.r * 2.2}
                  fill={z.type === 'danger' ? 'url(#dangerZone)' : 'url(#safeZone)'}
                />
                <circle
                  cx={p.x} cy={p.y}
                  r={z.r}
                  fill="none"
                  stroke={z.type === 'danger' ? '#f43f5e' : '#10b981'}
                  strokeWidth="0.8"
                  strokeDasharray="4 3"
                  opacity="0.6"
                />
              </g>
            )
          })}

          {/* Route lines */}
          {ROUTES.map(route => {
            const color = route.status === 'HIGH_DEMURRAGE_RISK' ? '#f43f5e' : '#10b981'
            return (
              <polyline
                key={route.id}
                points={pointsToString(route.points)}
                fill="none"
                stroke={color}
                strokeWidth="1.8"
                strokeDasharray="8 5"
                opacity="0.7"
                filter="url(#glow)"
              >
                <animate attributeName="stroke-dashoffset" from="0" to="-52" dur="3s" repeatCount="indefinite" />
              </polyline>
            )
          })}

          {/* Port dots */}
          {PORTS.map(port => <PortDot key={port.id} port={port} />)}

          {/* Vessel icons */}
          {VESSEL_POSITIONS.map(v => {
            const pos = animatedPos(v)
            return (
              <ShipIcon
                key={v.id}
                x={pos.x}
                y={pos.y}
                status={v.status}
                label={v.name.split(' ').slice(0,3).join(' ')}
                pulsing={v.status === 'HIGH_DEMURRAGE_RISK'}
                onClick={() => {
                  const full = fullVessel(v.id)
                  setSelectedVessel(full || v)
                }}
              />
            )
          })}
        </svg>
      </div>

      {/* ── SCENARIO PRESETS ── */}
      <div className="px-5 sm:px-7 py-4 bg-[#0c0e16] border-b border-[#1a1d2a]">
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Quick Demo Scenarios — Click to Load</div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {DEMO_SCENARIOS.map(scen => {
            const isActive = scen.id === activeScenarioId
            return (
              <div
                key={scen.id}
                onClick={() => {
                  setActiveScenarioId(scen.id)
                  const v = MOCK_VESSELS.find(v => v.id === scen.vesselId)
                  if (v) setSelectedVessel(v)
                }}
                className={`p-3.5 rounded-xl border cursor-pointer transition flex flex-col justify-between ${
                  isActive
                    ? 'bg-indigo-900/40 border-indigo-500/60 ring-1 ring-indigo-500/40'
                    : 'bg-[#111422] border-[#242638] hover:border-indigo-500/40'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="text-xs font-bold text-slate-100">{scen.title}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                    scen.badgeColor === 'rose' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                    scen.badgeColor === 'amber' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                    'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  }`}>{scen.badge}</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-2 line-clamp-2">{scen.description}</p>
                <div className="mt-3 flex items-center justify-between text-[11px] font-mono text-slate-300 pt-2 border-t border-[#252a3d]">
                  <span>{scen.incoterm} · {Number(scen.volume).toLocaleString()} T</span>
                  <span className={scen.demurrageAmountUSD > 0 ? 'text-rose-400 font-bold' : 'text-emerald-400 font-bold'}>
                    {scen.demurrageAmountUSD > 0 ? `Est. Fine: $${scen.demurrageAmountUSD.toLocaleString()}` : '$0 Fine'}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* ── ADMIN FORM ── */}
      {showAdminForm && (
        <div className="px-5 sm:px-7 py-5 bg-[#0e1019] border-b border-indigo-500/30">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-indigo-400" />
              <h2 className="text-sm font-bold text-white">Admin Deal & Incoterm Contract Editor</h2>
            </div>
            <button onClick={() => setShowAdminForm(false)} className="text-slate-400 hover:text-white text-xs cursor-pointer">✕ Close</button>
          </div>
          <form onSubmit={handleAddDeal} className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Client Name</label>
              <select value={newClient} onChange={e => setNewClient(e.target.value)} className="w-full h-9 px-3 rounded-lg bg-[#1a1c26] border border-[#2e3244] text-xs text-slate-100 focus:outline-none focus:border-indigo-500">
                {DEMO_CLIENTS.map(c => <option key={c.id} value={c.name}>{c.name} ({c.country})</option>)}
              </select>
            </div>
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Product & Grade</label>
              <input type="text" value={newProduct} onChange={e => setNewProduct(e.target.value)} className="w-full h-9 px-3 rounded-lg bg-[#1a1c26] border border-[#2e3244] text-xs text-slate-100 focus:outline-none focus:border-indigo-500" />
            </div>
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Volume (Tons)</label>
              <input type="number" value={newVolume} onChange={e => setNewVolume(e.target.value)} className="w-full h-9 px-3 rounded-lg bg-[#1a1c26] border border-[#2e3244] text-xs text-slate-100 focus:outline-none focus:border-indigo-500" />
            </div>
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Incoterm Rule</label>
              <select value={newIncoterm} onChange={e => setNewIncoterm(e.target.value)} className="w-full h-9 px-3 rounded-lg bg-[#1a1c26] border border-[#2e3244] text-xs text-indigo-300 font-bold focus:outline-none focus:border-indigo-500">
                {INCOTERMS.map(inc => <option key={inc.code} value={inc.code}>{inc.code} – {inc.name}</option>)}
              </select>
              <p className="text-[10px] text-slate-400 mt-1 italic">{activeIncotermObj.buyerRisk}</p>
            </div>
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Port of Loading</label>
              <input type="text" value={newLoadingPort} onChange={e => setNewLoadingPort(e.target.value)} className="w-full h-9 px-3 rounded-lg bg-[#1a1c26] border border-[#2e3244] text-xs text-slate-100 focus:outline-none focus:border-indigo-500" />
            </div>
            <div>
              <label className="block font-semibold text-slate-300 mb-1 flex items-center justify-between">
                Port of Destination
                <span className={`text-[9px] font-bold uppercase ${activeIncotermObj.buyerPortRequired ? 'text-emerald-400' : 'text-slate-500'}`}>
                  {activeIncotermObj.buyerPortRequired ? `Required for ${newIncoterm}` : `N/A for ${newIncoterm}`}
                </span>
              </label>
              <input
                type="text"
                disabled={!activeIncotermObj.buyerPortRequired}
                value={activeIncotermObj.buyerPortRequired ? newDestPort : 'N/A — Seller Port Delivery'}
                onChange={e => setNewDestPort(e.target.value)}
                className={`w-full h-9 px-3 rounded-lg border text-xs focus:outline-none ${
                  activeIncotermObj.buyerPortRequired
                    ? 'bg-[#1a1c26] border-indigo-500/50 text-slate-100'
                    : 'bg-[#0f1018] border-[#1e2233] text-slate-500 cursor-not-allowed'
                }`}
              />
            </div>
            <div className="md:col-span-3 flex justify-end">
              <button type="submit" className="px-6 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition shadow-lg shadow-indigo-600/30 cursor-pointer">
                Save Contract & Calculate Risk
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── VESSEL & TRUCK PANELS ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-5 sm:p-7">

        {/* Vessel cards (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Ship className="w-4 h-4 text-indigo-400" />
              <h2 className="text-sm font-bold text-white">Chartered Vessels & Laycan Monitor</h2>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">Click vessel to inspect</span>
          </div>

          {MOCK_VESSELS.map(vessel => {
            const isRisk = vessel.demurrageRiskStatus === 'HIGH_DEMURRAGE_RISK'
            return (
              <div
                key={vessel.id}
                onClick={() => setSelectedVessel(vessel)}
                className={`p-4 rounded-xl border cursor-pointer transition hover:ring-1 hover:ring-indigo-500 ${
                  isRisk ? 'bg-gradient-to-r from-rose-950/25 to-[#0f1118] border-rose-500/40' : 'bg-[#0f1118] border-[#1e2330]'
                }`}
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm font-bold text-white">{vessel.name}</h3>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-[#1e2133] font-mono text-indigo-300">{vessel.imo}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-600/20 text-indigo-300 font-bold">{vessel.incoterm}</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      {vessel.client} · <span className="text-slate-300">{vessel.cargoSpec}</span>
                      <span className="font-mono ml-1">({vessel.loadedTons.toLocaleString()} / {vessel.capacityTons.toLocaleString()} T)</span>
                    </p>
                  </div>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full inline-flex items-center gap-1 ${
                    isRisk ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  }`}>
                    {isRisk ? <AlertTriangle className="w-3 h-3" /> : <CheckCircle2 className="w-3 h-3" />}
                    {isRisk ? 'DEMURRAGE WARNING' : 'ON SCHEDULE'}
                  </span>
                </div>
                <div className="mt-3 pt-3 border-t border-[#1e2333] grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div><div className="text-[10px] text-slate-500 uppercase font-bold">Laycan</div><div className="text-slate-200 font-mono mt-0.5">{vessel.laycanStart} → {vessel.laycanEnd}</div></div>
                  <div><div className="text-[10px] text-slate-500 uppercase font-bold">Laytime Left</div><div className="text-indigo-400 font-mono font-bold mt-0.5">{vessel.laytimeRemainingHours} hrs</div></div>
                  <div><div className="text-[10px] text-slate-500 uppercase font-bold">Berth Status</div><div className={`font-bold mt-0.5 ${isRisk ? 'text-rose-400' : 'text-emerald-400'}`}>{vessel.destinationBerthStatus}</div></div>
                  <div><div className="text-[10px] text-slate-500 uppercase font-bold">Est. Fine</div><div className={`font-bold mt-0.5 ${isRisk ? 'text-rose-400' : 'text-emerald-400'}`}>${vessel.predictedCostUSD.toLocaleString()}</div></div>
                </div>
              </div>
            )
          })}

          {/* Incoterm matrix */}
          <div>
            <div className="flex items-center gap-2 mb-3 mt-4">
              <Compass className="w-4 h-4 text-indigo-400" />
              <h2 className="text-sm font-bold text-white">Incoterm Demurrage Liability Matrix</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {INCOTERMS.map(inc => (
                <div key={inc.code} className="p-2.5 rounded-lg bg-[#0f1118] border border-[#1e2330] text-xs">
                  <div className="flex items-center justify-between font-bold text-indigo-300">
                    <span>{inc.code} – {inc.name}</span>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded ${inc.buyerPortRequired ? 'bg-indigo-500/20 text-indigo-300' : 'bg-slate-700/50 text-slate-400'}`}>
                      {inc.buyerPortRequired ? 'Buyer Port' : 'Seller Port'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{inc.buyerRisk}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Truck dock panel (1 col) */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-indigo-400" />
              <h2 className="text-sm font-bold text-white">Truck Dock Appointments</h2>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">Click to inspect</span>
          </div>
          <div className="space-y-3">
            {MOCK_TRUCKS.map(truck => {
              const isDelayed = truck.dockStatus === 'DELAYED'
              const isComplete = truck.status === 'UNLOADED_COMPLETE'
              return (
                <div
                  key={truck.id}
                  onClick={() => setSelectedTruck(truck)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition hover:ring-1 hover:ring-indigo-500 ${
                    isDelayed ? 'bg-amber-950/20 border-amber-500/40' :
                    isComplete ? 'bg-emerald-950/20 border-emerald-500/30' :
                    'bg-[#0f1118] border-[#1e2330]'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm">{truck.id}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          isDelayed ? 'bg-amber-500/20 text-amber-300' :
                          isComplete ? 'bg-emerald-500/20 text-emerald-300' :
                          'bg-indigo-500/20 text-indigo-300'
                        }`}>{truck.dockStatus}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">{truck.cargoSpec}</p>
                    </div>
                  </div>
                  <div className="mt-2 pt-2 border-t border-[#1e2333] flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-300">
                      Net: <strong className={truck.varianceKg > 500 ? 'text-rose-400' : 'text-white'}>{truck.netPayloadTons} T</strong>
                      {truck.varianceKg > 500 && <span className="ml-1 text-[9px] text-rose-500">(-{(truck.varianceKg / 1000).toFixed(2)}T Loss)</span>}
                    </span>
                    <span className="text-indigo-400 text-[10px]">{truck.dockSlot}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* ── TRUCK INSPECTION MODAL ── */}
      {selectedTruck && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0e1120] border border-indigo-500/60 rounded-2xl w-full max-w-xl shadow-2xl shadow-indigo-900/30">
            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-[#1e2430]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-600/20 flex items-center justify-center">
                  <Truck className="w-4 h-4 text-indigo-400" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Truck Telemetry & Weighbridge Report</h3>
                  <p className="text-[10px] text-slate-400">{selectedTruck.id} · {selectedTruck.carrier}</p>
                </div>
              </div>
              <button onClick={() => setSelectedTruck(null)} className="text-slate-400 hover:text-white transition cursor-pointer p-1.5 rounded-lg hover:bg-white/10">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 grid grid-cols-2 gap-3 text-xs">
              {[
                { label: 'Driver & Carrier', value: `${selectedTruck.driver}`, sub: selectedTruck.carrier },
                { label: 'Cargo Specification', value: selectedTruck.cargoSpec },
                { label: 'Gross Weight', value: `${selectedTruck.grossWeightTons} T`, mono: true },
                { label: 'Tare Weight', value: `${selectedTruck.tareWeightTons} T`, mono: true },
                { label: 'Net Payload (Cargo)', value: `${selectedTruck.netPayloadTons} T`, mono: true, highlight: 'indigo' },
                { label: 'Tare Variance', value: `${selectedTruck.varianceKg} kg`, mono: true, highlight: selectedTruck.varianceKg > 500 ? 'rose' : 'emerald' },
                { label: 'Weighbridge Certificate', value: selectedTruck.weighbridgeCertId, mono: true },
                { label: 'Weighbridge Status', value: selectedTruck.weighbridgeStatus, mono: true, highlight: selectedTruck.weighbridgeStatus === 'VERIFIED_MATCH' ? 'emerald' : 'rose' },
                { label: 'Related Terminal / Port', value: selectedTruck.destination },
                { label: 'Mine Origin', value: selectedTruck.origin },
                { label: 'Dock Appointment Slot', value: selectedTruck.dockSlot, highlight: 'amber' },
                { label: 'Delivery Time Slot Status', value: selectedTruck.dockStatus, highlight: selectedTruck.dockStatus === 'ON_TIME' ? 'emerald' : 'rose' },
              ].map(item => (
                <div key={item.label} className="p-3 bg-[#131626] rounded-xl border border-[#242840]">
                  <div className="text-[10px] text-slate-500 uppercase font-bold">{item.label}</div>
                  <div className={`font-bold mt-1 ${
                    item.highlight === 'indigo' ? 'text-indigo-400' :
                    item.highlight === 'rose' ? 'text-rose-400' :
                    item.highlight === 'emerald' ? 'text-emerald-400' :
                    item.highlight === 'amber' ? 'text-amber-300' :
                    'text-white'
                  } ${item.mono ? 'font-mono' : ''}`}>
                    {item.value}
                  </div>
                  {item.sub && <div className="text-[10px] text-slate-400 mt-0.5">{item.sub}</div>}
                </div>
              ))}
            </div>

            <div className="px-6 pb-5 flex justify-end">
              <button onClick={() => setSelectedTruck(null)} className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs cursor-pointer transition">Done Inspecting</button>
            </div>
          </div>
        </div>
      )}

      {/* ── VESSEL INSPECTION MODAL ── */}
      {selectedVessel && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0e1120] border border-indigo-500/60 rounded-2xl w-full max-w-2xl shadow-2xl shadow-indigo-900/30 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-[#1e2430] sticky top-0 bg-[#0e1120] z-10">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-lg bg-indigo-600/20 flex items-center justify-center">
                  <Ship className="w-5 h-5 text-indigo-400" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">{selectedVessel.name}</h3>
                  <p className="text-[10px] text-slate-400 font-mono">{selectedVessel.imo} · Flag: {selectedVessel.flag} · {selectedVessel.incoterm}</p>
                </div>
              </div>
              <button onClick={() => setSelectedVessel(null)} className="text-slate-400 hover:text-white transition cursor-pointer p-1.5 rounded-lg hover:bg-white/10">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Route banner */}
            <div className="mx-6 mt-4 p-3 bg-[#131a30] border border-indigo-500/20 rounded-xl flex items-center gap-2 text-xs">
              <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="text-slate-300">{selectedVessel.originPort}</span>
              <span className="text-slate-500">→</span>
              <span className="text-slate-300">{selectedVessel.destinationPort}</span>
              <span className="ml-auto font-bold text-indigo-300">{selectedVessel.client}</span>
            </div>

            <div className="p-6 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              {/* Weather & TomTom Map API */}
              <div className="sm:col-span-3 p-3 bg-indigo-950/20 rounded-xl border border-indigo-500/30 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <CloudRain className="w-5 h-5 text-sky-400" />
                  <div>
                    <div className="text-[10px] text-sky-400/70 font-bold uppercase">Ocean/Port Weather Conditions</div>
                    <div className="text-white font-bold">{selectedVessel.weatherCondition}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Radio className="w-5 h-5 text-amber-400" />
                  <div>
                    <div className="text-[10px] text-amber-400/70 font-bold uppercase">TomTom Traffic Index (Port Gate)</div>
                    <div className="text-white font-bold font-mono">Idx: {selectedVessel.tomTomCongestionIndex} / 100 <span className="text-slate-400 text-[10px]">live API</span></div>
                  </div>
                </div>
              </div>

              {/* Cargo */}
              <div className={`p-3 rounded-xl border ${selectedVessel.discrepancyTons > 0 ? 'bg-rose-950/20 border-rose-500/40' : 'bg-[#131626] border-[#242840]'}`}>
                <div className="text-[10px] text-slate-500 uppercase font-bold">Cargo & Capacity</div>
                <div className="text-white font-bold mt-1">{selectedVessel.cargoSpec}</div>
                <div className="text-indigo-400 font-mono mt-0.5">
                  {selectedVessel.loadedTons?.toLocaleString()} / {selectedVessel.expectedTons?.toLocaleString()} T Expected
                  {selectedVessel.discrepancyTons > 0 && <div className="text-rose-400 text-[10px] mt-1 font-bold">⚠ {selectedVessel.discrepancyTons} T MISSING YIELD</div>}
                </div>
              </div>
              {/* Laycan */}
              <div className="p-3 bg-[#131626] rounded-xl border border-[#242840]">
                <div className="text-[10px] text-slate-500 uppercase font-bold">Laycan Window & Laydays</div>
                <div className="text-indigo-300 font-mono font-bold mt-1">{selectedVessel.laycanStart} → {selectedVessel.laycanEnd}</div>
                <div className="text-rose-400 text-[10px] font-bold mt-0.5">Cancelling: {selectedVessel.cancellingDate ? new Date(selectedVessel.cancellingDate).toLocaleDateString() : '—'}</div>
              </div>
              {/* NOR */}
              <div className="p-3 bg-[#131626] rounded-xl border border-[#242840]">
                <div className="text-[10px] text-slate-500 uppercase font-bold">Notice of Readiness (NOR)</div>
                <div className="text-slate-200 mt-1">{selectedVessel.noticeOfReadiness}</div>
                <div className="text-emerald-400 font-mono font-bold mt-0.5">Laytime: {selectedVessel.laytimeRemainingHours}h Left / {selectedVessel.laytimeAllowedHours}h Allowed</div>
              </div>
              {/* Berth Slot */}
              <div className="p-3 bg-[#131626] rounded-xl border border-[#242840]">
                <div className="text-[10px] text-slate-500 uppercase font-bold">Berth Slot</div>
                <div className="text-indigo-300 font-bold mt-1">{selectedVessel.berthSlot}</div>
              </div>
              {/* Berth Window */}
              <div className="p-3 bg-[#131626] rounded-xl border border-[#242840]">
                <div className="text-[10px] text-slate-500 uppercase font-bold">Berth Window</div>
                <div className="text-slate-200 font-mono mt-1 text-[10px]">{selectedVessel.berthWindow}</div>
              </div>
              {/* MarineTraffic AIS */}
              <div className="p-3 bg-[#131626] rounded-xl border border-[#242840]">
                <div className="text-[10px] text-slate-500 uppercase font-bold">MarineTraffic AIS Arrival Window</div>
                <div className="text-emerald-400 font-mono font-bold mt-1 text-[10px]">{selectedVessel.marineTrafficStatus}</div>
                <div className="text-[10px] text-slate-500 mt-0.5">Live Satellite ETA Sync</div>
              </div>
              {/* Terminal slots */}
              <div className="p-3 bg-[#131626] rounded-xl border border-[#242840]">
                <div className="text-[10px] text-slate-500 uppercase font-bold">Terminal Delivery Slots</div>
                <div className={`font-bold mt-1 ${selectedVessel.destinationBerthStatus?.includes('0_SLOTS') || selectedVessel.destinationBerthStatus?.includes('CLOSED') ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {selectedVessel.destinationBerthStatus}
                </div>
              </div>
              {/* Terminal weighbridge */}
              <div className="p-3 bg-[#131626] rounded-xl border border-[#242840]">
                <div className="text-[10px] text-slate-500 uppercase font-bold">Terminal Weighbridge Result</div>
                <div className="text-white font-bold mt-1">{selectedVessel.loadedTons?.toLocaleString()} T Verified</div>
                <div className="text-emerald-400 text-[10px] font-mono mt-0.5">Cert: VERIFIED_PASSED</div>
              </div>
              {/* Demurrage */}
              <div className={`p-3 rounded-xl border ${selectedVessel.predictedCostUSD > 0 ? 'bg-rose-950/30 border-rose-500/40' : 'bg-emerald-950/20 border-emerald-500/30'}`}>
                <div className="text-[10px] text-slate-500 uppercase font-bold">Demurrage Prediction</div>
                <div className={`font-black text-lg mt-1 ${selectedVessel.predictedCostUSD > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                  ${selectedVessel.predictedCostUSD?.toLocaleString()}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  {selectedVessel.predictedDemurrageDays} days @ ${selectedVessel.demurrageRatePerDay?.toLocaleString()}/day
                </div>
              </div>
            </div>

            {selectedVessel.predictedCostUSD > 0 && (
              <div className="mx-6 mb-5 p-3.5 bg-rose-950/30 border border-rose-500/40 rounded-xl flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <p className="text-xs text-slate-300">
                  Vessel under <strong className="text-indigo-300">{selectedVessel.incoterm}</strong> terms for <strong className="text-white">{selectedVessel.client}</strong>.
                  Destination berth congested: <strong className="text-rose-400">{selectedVessel.destinationBerthStatus}</strong>.
                  Estimated demurrage fine: <strong className="text-rose-400">${selectedVessel.predictedCostUSD?.toLocaleString()}</strong>.
                </p>
              </div>
            )}

            <div className="px-6 pb-5 flex justify-end">
              <button onClick={() => setSelectedVessel(null)} className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs cursor-pointer transition">Close Inspector</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
