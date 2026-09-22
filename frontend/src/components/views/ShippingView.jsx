import React, { useState } from 'react'
import {
  Anchor,
  Truck,
  AlertTriangle,
  Clock,
  ShieldCheck,
  Building2,
  Ship,
  FileText,
  DollarSign,
  Compass,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Plus,
  Edit2,
  Calendar,
  Layers,
  Sparkles,
  Search,
  ExternalLink,
  MapPin,
  Scale
} from 'lucide-react'
import { INCOTERMS, DEMO_CLIENTS, MOCK_TRUCKS, MOCK_VESSELS, DEMO_SCENARIOS } from '../../data/shippingData'

export default function ShippingView() {
  const [scenarios, setScenarios] = useState(DEMO_SCENARIOS)
  const [activeScenarioId, setActiveScenarioId] = useState('scen-dap-sa-india')
  
  // Deals State
  const [deals, setDeals] = useState([
    {
      id: 'DEAL-8901',
      client: 'Jindal Steel & Power Ltd',
      product: 'RB1 High CV Coal (6000 kcal/kg)',
      volumeTons: 68500,
      portOfLoading: 'Richards Bay Dry Bulk Terminal (South Africa)',
      portOfDestination: 'New Mangalore Bulk Port (India)',
      incoterm: 'DAP',
      status: 'HIGH_DEMURRAGE_RISK'
    },
    {
      id: 'DEAL-4412',
      client: 'ArcelorMittal Global Trading',
      product: 'RB2 Export Grade Coal (5500 kcal/kg)',
      volumeTons: 42000,
      portOfLoading: 'Maputo Bulk Terminal (Mozambique)',
      portOfDestination: 'Mundra Port Bulk Siding (India)',
      incoterm: 'FOB',
      status: 'ON_SCHEDULE'
    }
  ])

  // New/Edit Deal Form State
  const [showAdminForm, setShowAdminForm] = useState(false)
  const [newClient, setNewClient] = useState(DEMO_CLIENTS[0].name)
  const [newProduct, setNewProduct] = useState('RB1 High CV Export Coal')
  const [newVolume, setNewVolume] = useState(50000)
  const [newLoadingPort, setNewLoadingPort] = useState('Richards Bay Dry Bulk Terminal')
  const [newIncoterm, setNewIncoterm] = useState('CIF')
  const [newDestPort, setNewDestPort] = useState('New Mangalore Bulk Port (India)')

  // Telemetry Inspectors State
  const [selectedTruck, setSelectedTruck] = useState(null)
  const [selectedVessel, setSelectedVessel] = useState(null)

  const activeIncotermObj = INCOTERMS.find(i => i.code === newIncoterm) || INCOTERMS[0]

  const handleAddDeal = e => {
    e.preventDefault()
    const isBuyerPortReq = activeIncotermObj.buyerPortRequired
    const newDealObj = {
      id: `DEAL-${Math.floor(1000 + Math.random() * 9000)}`,
      client: newClient,
      product: newProduct,
      volumeTons: Number(newVolume),
      portOfLoading: newLoadingPort,
      portOfDestination: isBuyerPortReq ? newDestPort : 'N/A (Seller Port Handoff)',
      incoterm: newIncoterm,
      status: 'ON_SCHEDULE'
    }
    setDeals([newDealObj, ...deals])
    setShowAdminForm(false)
  }

  const handleSelectScenario = scenario => {
    setActiveScenarioId(scenario.id)
    if (scenario.vesselId) {
      const v = MOCK_VESSELS.find(v => v.id === scenario.vesselId)
      if (v) setSelectedVessel(v)
    }
  }

  return (
    <div className="min-h-full pb-16 bg-[#0d0e12] text-slate-100 p-4 sm:p-6 space-y-6 flex-1">
      {/* 1. Header Banner & Quick Scenario Bar */}
      <div className="bg-gradient-to-r from-indigo-950/60 via-[#131622] to-slate-900 border border-indigo-500/30 rounded-2xl p-5 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
          <Ship className="w-80 h-80 text-indigo-400" />
        </div>
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-widest">
              <Anchor className="w-4 h-4" />
              <span>Pit-to-Port Supply Chain & Telemetry</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-mono">LIVE PREDICTIVE ENGINE</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">
              Shipping & Demurrage Control Hub
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-2xl">
              Track real-time haulage, weighbridge reports, port terminal dock slots, laycans, berth windows, and predictive demurrage penalties.
            </p>
          </div>

          {/* Quick Scenario Selector */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setShowAdminForm(!showAdminForm)}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition flex items-center gap-2 shadow-lg shadow-indigo-600/30 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Configure Admin Deal / Incoterm</span>
            </button>
          </div>
        </div>

        {/* Demo Presets Bar */}
        <div className="mt-5 pt-4 border-t border-[#252938] grid grid-cols-1 md:grid-cols-3 gap-3">
          {scenarios.map(scen => {
            const isActive = scen.id === activeScenarioId
            return (
              <div
                key={scen.id}
                onClick={() => handleSelectScenario(scen)}
                className={`p-3.5 rounded-xl border cursor-pointer transition flex flex-col justify-between ${
                  isActive
                    ? 'bg-indigo-900/40 border-indigo-500/60 shadow-lg ring-1 ring-indigo-500/40'
                    : 'bg-[#161822] border-[#252836] hover:bg-[#1d202d]'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="text-xs font-bold text-slate-100">{scen.title}</span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                      scen.badgeColor === 'rose'
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        : scen.badgeColor === 'amber'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    }`}
                  >
                    {scen.badge}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-2 line-clamp-2">{scen.description}</p>
                <div className="mt-3 flex items-center justify-between text-[11px] font-mono text-slate-300 pt-2 border-t border-[#282b3a]">
                  <span>{scen.incoterm} • {scen.volume.toLocaleString()} Tons</span>
                  {scen.demurrageAmountUSD > 0 ? (
                    <span className="text-rose-400 font-bold">Est. Fine: ${scen.demurrageAmountUSD.toLocaleString()}</span>
                  ) : (
                    <span className="text-emerald-400 font-bold">$0 Fine</span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* 2. Admin Incoterm & Deal Configuration Panel (Collapsible / Dynamic) */}
      {showAdminForm && (
        <div className="bg-[#13151c] border border-indigo-500/40 rounded-2xl p-5 shadow-2xl space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-indigo-400" />
              <h2 className="text-base font-bold text-white">Admin Deal & Incoterm Contract Editor</h2>
            </div>
            <button
              onClick={() => setShowAdminForm(false)}
              className="text-xs text-slate-400 hover:text-slate-200"
            >
              Close ✕
            </button>
          </div>

          <form onSubmit={handleAddDeal} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Client Name</label>
              <select
                value={newClient}
                onChange={e => setNewClient(e.target.value)}
                className="w-full h-9 px-3 rounded-lg bg-[#1a1c26] border border-[#2e3244] text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
              >
                {DEMO_CLIENTS.map(c => (
                  <option key={c.id} value={c.name}>{c.name} ({c.country})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Product & Grade</label>
              <input
                type="text"
                value={newProduct}
                onChange={e => setNewProduct(e.target.value)}
                className="w-full h-9 px-3 rounded-lg bg-[#1a1c26] border border-[#2e3244] text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                placeholder="e.g. RB1 High CV Coal"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Volume (Tons)</label>
              <input
                type="number"
                value={newVolume}
                onChange={e => setNewVolume(e.target.value)}
                className="w-full h-9 px-3 rounded-lg bg-[#1a1c26] border border-[#2e3244] text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Incoterm Rule</label>
              <select
                value={newIncoterm}
                onChange={e => setNewIncoterm(e.target.value)}
                className="w-full h-9 px-3 rounded-lg bg-[#1a1c26] border border-[#2e3244] text-xs text-indigo-300 font-bold focus:outline-none focus:border-indigo-500"
              >
                {INCOTERMS.map(inc => (
                  <option key={inc.code} value={inc.code}>{inc.code} - {inc.name}</option>
                ))}
              </select>
              <p className="text-[10px] text-slate-400 mt-1 italic">{activeIncotermObj.buyerRisk}</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Port of Loading (Seller Side)</label>
              <input
                type="text"
                value={newLoadingPort}
                onChange={e => setNewLoadingPort(e.target.value)}
                className="w-full h-9 px-3 rounded-lg bg-[#1a1c26] border border-[#2e3244] text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Dynamic Buyer Port of Destination field */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center justify-between">
                <span>Port of Destination (Buyer Side)</span>
                {activeIncotermObj.buyerPortRequired ? (
                  <span className="text-[9px] font-bold text-emerald-400 uppercase">Required for {newIncoterm}</span>
                ) : (
                  <span className="text-[9px] font-bold text-slate-500 uppercase">Optional for {newIncoterm}</span>
                )}
              </label>
              <input
                type="text"
                disabled={!activeIncotermObj.buyerPortRequired}
                value={activeIncotermObj.buyerPortRequired ? newDestPort : 'N/A (Seller Port Delivery)'}
                onChange={e => setNewDestPort(e.target.value)}
                className={`w-full h-9 px-3 rounded-lg border text-xs focus:outline-none ${
                  activeIncotermObj.buyerPortRequired
                    ? 'bg-[#1a1c26] border-indigo-500/50 text-slate-100'
                    : 'bg-[#14151e] border-[#222533] text-slate-500 cursor-not-allowed'
                }`}
              />
            </div>

            <div className="md:col-span-3 flex justify-end">
              <button
                type="submit"
                className="px-6 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition shadow-lg shadow-indigo-600/30 cursor-pointer"
              >
                Save Contract Deal & Calculate Risk
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 3. Main Operational Telemetry Grid: Vessels & Truck Haulage */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (2 Cols): Vessels & Laycan Timers */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#13151b] border border-[#202330] rounded-2xl p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Ship className="w-5 h-5 text-indigo-400" />
                <h2 className="text-base font-bold text-white">Chartered Bulk Vessels & Laycan Monitoring</h2>
              </div>
              <span className="text-xs text-slate-400 font-mono">Live MarineTraffic Sync</span>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {MOCK_VESSELS.map(vessel => {
                const isHighRisk = vessel.demurrageRiskStatus === 'HIGH_DEMURRAGE_RISK'
                return (
                  <div
                    key={vessel.id}
                    onClick={() => setSelectedVessel(vessel)}
                    className={`p-4 rounded-xl border cursor-pointer transition hover:border-indigo-500/60 ${
                      isHighRisk
                        ? 'bg-gradient-to-r from-rose-950/30 to-[#181a24] border-rose-500/40'
                        : 'bg-[#181a24] border-[#262938]'
                    }`}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-bold text-white">{vessel.name}</h3>
                          <span className="text-xs px-2 py-0.5 rounded bg-[#252838] font-mono text-indigo-300">
                            {vessel.imo}
                          </span>
                          <span className="text-xs px-2 py-0.5 rounded bg-indigo-600/20 text-indigo-300 font-bold">
                            {vessel.incoterm}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-1">
                          Client: <strong className="text-slate-200">{vessel.client}</strong> • {vessel.cargoSpec} ({vessel.loadedTons.toLocaleString()} / {vessel.capacityTons.toLocaleString()} Tons)
                        </p>
                      </div>

                      <div className="text-right">
                        <span
                          className={`text-xs font-bold px-2.5 py-1 rounded-full inline-flex items-center gap-1 ${
                            isHighRisk
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse'
                              : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          }`}
                        >
                          {isHighRisk ? <AlertTriangle className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                          {isHighRisk ? 'DEMURRAGE WARNING' : 'ON SCHEDULE'}
                        </span>
                      </div>
                    </div>

                    {/* Route & Laycan Stats Bar */}
                    <div className="mt-4 pt-3 border-t border-[#262a3a] grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-bold">Route</span>
                        <div className="text-slate-200 truncate mt-0.5 font-medium">{vessel.originPort} $\rightarrow$ {vessel.destinationPort}</div>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-bold">Laydays / Laycan</span>
                        <div className="text-slate-200 mt-0.5 font-mono">{vessel.laycanStart} to {vessel.laycanEnd}</div>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-bold">Laytime Remaining</span>
                        <div className="text-indigo-400 mt-0.5 font-mono font-bold">{vessel.laytimeRemainingHours} Hours Left</div>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-bold">Berth Status</span>
                        <div className={`mt-0.5 font-bold ${isHighRisk ? 'text-rose-400' : 'text-emerald-400'}`}>
                          {vessel.destinationBerthStatus}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Active Incoterm Rules Cheat-Sheet */}
          <div className="bg-[#13151b] border border-[#202330] rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-2">
              <Compass className="w-5 h-5 text-indigo-400" />
              <h2 className="text-base font-bold text-white">Incoterm Demurrage Liability Matrix</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 text-xs">
              {INCOTERMS.map(inc => (
                <div key={inc.code} className="p-2.5 rounded-lg bg-[#181a24] border border-[#242736]">
                  <div className="flex items-center justify-between font-bold text-indigo-300">
                    <span>{inc.code} - {inc.name}</span>
                    {inc.buyerPortRequired ? (
                      <span className="text-[9px] px-1.5 py-0.5 bg-indigo-500/20 text-indigo-300 rounded">Buyer Port</span>
                    ) : (
                      <span className="text-[9px] px-1.5 py-0.5 bg-slate-700/50 text-slate-300 rounded">Seller Port</span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{inc.buyerRisk}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (1 Col): Truck Haulage & Weighbridge Slot Inspector */}
        <div className="space-y-6">
          <div className="bg-[#13151b] border border-[#202330] rounded-2xl p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-indigo-400" />
                <h2 className="text-base font-bold text-white">Truck Dock Appointments</h2>
              </div>
              <span className="text-xs text-slate-400 font-mono">Weighbridge Telemetry</span>
            </div>

            <div className="space-y-3">
              {MOCK_TRUCKS.map(truck => {
                const isDelayed = truck.dockStatus === 'DELAYED'
                return (
                  <div
                    key={truck.id}
                    onClick={() => setSelectedTruck(truck)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition hover:border-indigo-500/60 ${
                      isDelayed ? 'bg-amber-950/20 border-amber-500/40' : 'bg-[#181a24] border-[#252836]'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-sm">{truck.id}</span>
                          <span className="text-xs text-slate-400 font-mono">({truck.carrier})</span>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">{truck.cargoSpec}</p>
                      </div>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          isDelayed ? 'bg-amber-500/20 text-amber-300' : 'bg-emerald-500/20 text-emerald-300'
                        }`}
                      >
                        {truck.dockStatus}
                      </span>
                    </div>

                    <div className="mt-3 pt-2 border-t border-[#262a3a] flex items-center justify-between text-xs font-mono">
                      <span className="text-slate-300">Payload: <strong className="text-white">{truck.netPayloadTons} T</strong></span>
                      <span className="text-indigo-400">{truck.dockSlot}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

      </div>

      {/* 4. Interactive Truck Telemetry Modal */}
      {selectedTruck && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-[#14161f] border border-indigo-500/50 rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-[#252838] pb-3">
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-indigo-400" />
                <h3 className="text-lg font-bold text-white">Truck Telemetry & Weighbridge Report</h3>
              </div>
              <button
                onClick={() => setSelectedTruck(null)}
                className="text-xs text-slate-400 hover:text-white"
              >
                ✕ Close
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-[#1a1c28] rounded-xl border border-[#272b3c]">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Truck ID / Driver</span>
                <div className="font-bold text-white text-sm mt-0.5">{selectedTruck.id}</div>
                <div className="text-slate-400">{selectedTruck.driver} ({selectedTruck.carrier})</div>
              </div>

              <div className="p-3 bg-[#1a1c28] rounded-xl border border-[#272b3c]">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Weighbridge Cert</span>
                <div className="font-bold text-indigo-300 mt-0.5">{selectedTruck.weighbridgeCertId}</div>
                <div className="text-emerald-400 font-mono mt-0.5">{selectedTruck.weighbridgeStatus}</div>
              </div>

              <div className="p-3 bg-[#1a1c28] rounded-xl border border-[#272b3c]">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Payload Weight Breakdown</span>
                <div className="text-slate-300 mt-1 space-y-0.5 font-mono">
                  <div>Gross: {selectedTruck.grossWeightTons} T</div>
                  <div>Tare: {selectedTruck.tareWeightTons} T</div>
                  <div className="text-indigo-400 font-bold">Net Payload: {selectedTruck.netPayloadTons} T</div>
                </div>
              </div>

              <div className="p-3 bg-[#1a1c28] rounded-xl border border-[#272b3c]">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Dock Appointment Slot</span>
                <div className="font-bold text-amber-300 mt-1">{selectedTruck.dockSlot}</div>
                <div className="text-slate-400 mt-0.5">Delay: {selectedTruck.delayMinutes} mins</div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#252838] flex justify-end">
              <button
                onClick={() => setSelectedTruck(null)}
                className="px-5 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-500"
              >
                Done Inspecting
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. Interactive Vessel & Laycan Inspection Modal */}
      {selectedVessel && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-[#14161f] border border-indigo-500/50 rounded-2xl w-full max-w-2xl p-6 space-y-5 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-[#252838] pb-3">
              <div className="flex items-center gap-2">
                <Ship className="w-5 h-5 text-indigo-400" />
                <div>
                  <h3 className="text-lg font-bold text-white">{selectedVessel.name} ({selectedVessel.imo})</h3>
                  <p className="text-xs text-slate-400">{selectedVessel.originPort} $\rightarrow$ {selectedVessel.destinationPort}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedVessel(null)}
                className="text-xs text-slate-400 hover:text-white"
              >
                ✕ Close
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-[#1a1c28] rounded-xl border border-[#272b3c]">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Laycan Window & Laydays</span>
                <div className="font-bold text-indigo-300 mt-1 font-mono">{selectedVessel.laycanStart} to {selectedVessel.laycanEnd}</div>
                <div className="text-[10px] text-rose-400 mt-1 font-bold">Cancelling Date: {new Date(selectedVessel.cancellingDate).toLocaleDateString()}</div>
              </div>

              <div className="p-3 bg-[#1a1c28] rounded-xl border border-[#272b3c]">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Notice of Readiness (NOR)</span>
                <div className="font-medium text-slate-200 mt-1">{selectedVessel.noticeOfReadiness}</div>
                <div className="text-emerald-400 font-mono mt-1 font-bold">Laytime: {selectedVessel.laytimeRemainingHours}h Left (Allowed: {selectedVessel.laytimeAllowedHours}h)</div>
              </div>

              <div className="p-3 bg-[#1a1c28] rounded-xl border border-[#272b3c]">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Demurrage Risk & Daily Rate</span>
                <div className="font-bold text-rose-400 text-sm mt-1">Est. Fine: ${selectedVessel.predictedCostUSD.toLocaleString()}</div>
                <div className="text-slate-400 mt-0.5">{selectedVessel.predictedDemurrageDays} Days @ ${selectedVessel.demurrageRatePerDay.toLocaleString()}/day</div>
              </div>

              <div className="p-3 bg-[#1a1c28] rounded-xl border border-[#272b3c]">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Berth Slot & Berth Window</span>
                <div className="font-bold text-indigo-300 mt-1">{selectedVessel.berthSlot}</div>
                <div className="text-slate-300 text-[10px] font-mono mt-0.5">{selectedVessel.berthWindow}</div>
              </div>

              <div className="p-3 bg-[#1a1c28] rounded-xl border border-[#272b3c]">
                <span className="text-[10px] text-slate-400 uppercase font-bold">MarineTraffic Vessel Arrival Window</span>
                <div className="font-bold text-emerald-400 mt-1 font-mono">{selectedVessel.marineTrafficStatus}</div>
                <div className="text-slate-400 text-[10px] mt-0.5">ETA Sync: Active Satellite Telemetry</div>
              </div>

              <div className="p-3 bg-[#1a1c28] rounded-xl border border-[#272b3c]">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Terminal Weighbridge Verification</span>
                <div className="font-bold text-white mt-1">68,500 T Cargo Verified</div>
                <div className="text-emerald-400 text-[10px] font-mono mt-0.5">Terminal Siding Cert: VERIFIED_PASSED</div>
              </div>
            </div>

            <div className="p-4 bg-rose-950/30 border border-rose-500/40 rounded-xl space-y-2">
              <div className="flex items-center gap-2 text-rose-300 font-bold text-xs uppercase">
                <AlertTriangle className="w-4 h-4" />
                <span>MarineTraffic Bottleneck & Demurrage Alert</span>
              </div>
              <p className="text-xs text-slate-300">
                Vessel is operating under <strong className="text-indigo-300">{selectedVessel.incoterm}</strong> terms for client <strong className="text-white">{selectedVessel.client}</strong>. Destination berth status: <strong className="text-rose-400">{selectedVessel.destinationBerthStatus}</strong>.
              </p>
            </div>

            <div className="pt-3 border-t border-[#252838] flex justify-end">
              <button
                onClick={() => setSelectedVessel(null)}
                className="px-5 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-500"
              >
                Close Vessel Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
