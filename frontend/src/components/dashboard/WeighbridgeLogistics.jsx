import React, { useState } from 'react'
import {
  Truck,
  Train,
  AlertTriangle,
  CheckCircle2,
  Scale,
  ShieldAlert,
  ArrowRight,
  Filter,
  Eye,
  Check,
  RefreshCw,
  Clock,
  Boxes,
  MapPin,
  ExternalLink
} from 'lucide-react'
import {
  WEIGHBRIDGE_LOGS,
  JINDAL_RAIL_SIDINGS,
  TIPPER_CAPACITY_OPTIONS
} from '../../data/logisticsData'

export default function WeighbridgeLogistics({ onInspectTruck }) {
  const [logisticsMode, setLogisticsMode] = useState('road') // 'road' | 'rail'
  const [statusFilter, setStatusFilter] = useState('all') // 'all' | 'fraud' | 'empty_in' | 'loading' | 'ticketed'
  const [capacityFilter, setCapacityFilter] = useState('all')
  const [trucksList, setTrucksList] = useState(WEIGHBRIDGE_LOGS)
  const [selectedTruck, setSelectedTruck] = useState(null)
  const [inspectionSuccessToast, setInspectionSuccessToast] = useState(null)

  const fraudCount = trucksList.filter(t => t.status === 'fraud_flagged').length

  const filteredTrucks = trucksList.filter(truck => {
    if (statusFilter === 'fraud' && truck.status !== 'fraud_flagged') return false
    if (statusFilter === 'empty_in' && truck.status !== 'empty_in') return false
    if (statusFilter === 'loading' && truck.status !== 'loading') return false
    if (statusFilter === 'ticketed' && truck.status !== 'ticketed') return false

    if (capacityFilter === '34t' && !truck.config.includes('34t')) return false
    if (capacityFilter === '42t' && !truck.config.includes('42t')) return false
    if (capacityFilter === '55t' && !truck.config.includes('55t')) return false

    return true
  })

  const handleResolveFraud = (truckId, resolutionNote) => {
    setTrucksList(prev =>
      prev.map(t =>
        t.id === truckId
          ? {
              ...t,
              status: 'ticketed',
              fraudSeverity: 'clean',
              gateStatus: 'DISPATCHED_CLEARED',
              fraudReason: `Cleared by Security: ${resolutionNote}`
            }
          : t
      )
    )
    setSelectedTruck(null)
    setInspectionSuccessToast(`Vehicle ${truckId} cleared and gate barrier opened.`)
    setTimeout(() => setInspectionSuccessToast(null), 4000)
  }

  return (
    <div className="space-y-4 my-2">
      {/* 1. Header Mode Switcher & Quick KPIs */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#16171d] border border-[#232634] p-3 sm:p-4 rounded-2xl">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setLogisticsMode('road')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer ${
              logisticsMode === 'road'
                ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-[#20232d]'
            }`}
          >
            <Truck className="w-4 h-4 text-amber-400" />
            <span>Road Tippers & Weighbridge</span>
            {fraudCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-bold animate-pulse">
                {fraudCount} Fraud Flags
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setLogisticsMode('rail')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer ${
              logisticsMode === 'rail'
                ? 'bg-gradient-to-r from-sky-500/20 to-indigo-500/20 text-sky-300 border border-sky-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-[#20232d]'
            }`}
          >
            <Train className="w-4 h-4 text-sky-400" />
            <span>Jindal Coal Rail Sidings (58 BOXN)</span>
          </button>
        </div>

        {/* Quick KPI stats */}
        <div className="flex items-center gap-3 sm:gap-6 text-xs text-slate-300 font-mono">
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-sans">Gate Queue</span>
            <span className="font-bold text-white text-sm">17 Tippers</span>
          </div>
          <div className="h-6 w-px bg-[#262837]" />
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-sans">Weighbridge Scale</span>
            <span className="font-bold text-emerald-400 text-sm">240 t/h Active</span>
          </div>
          <div className="h-6 w-px bg-[#262837]" />
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-sans">Rail Siding Buffer</span>
            <span className="font-bold text-sky-400 text-sm">42,500 t Pad</span>
          </div>
        </div>
      </div>

      {/* Success Notification Toast */}
      {inspectionSuccessToast && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center justify-between text-xs text-emerald-300 animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{inspectionSuccessToast}</span>
          </div>
          <button
            onClick={() => setInspectionSuccessToast(null)}
            className="text-emerald-400 hover:text-white"
          >
            ✕
          </button>
        </div>
      )}

      {/* 2. Mode A: ROAD TIPPERS & WEIGHBRIDGE DISCREPANCY FRAUD ENGINE */}
      {logisticsMode === 'road' && (
        <div className="space-y-3">
          {/* Filters Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2.5 bg-[#121318] border border-[#20232d] p-2.5 rounded-xl text-xs">
            {/* Status Filter */}
            <div className="flex flex-wrap items-center gap-1">
              <span className="text-slate-400 mr-1 flex items-center gap-1">
                <Filter className="w-3 h-3" /> Status:
              </span>
              {[
                { id: 'all', label: 'All (6)' },
                { id: 'fraud', label: `Fraud Flags (${fraudCount})`, alert: fraudCount > 0 },
                { id: 'empty_in', label: 'Empty In (Tare)' },
                { id: 'loading', label: 'Loading Pad' },
                { id: 'ticketed', label: 'Dispatched (Clean)' }
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setStatusFilter(f.id)}
                  className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                    statusFilter === f.id
                      ? f.alert
                        ? 'bg-rose-600 text-white font-semibold shadow-xs'
                        : 'bg-[#e2e8f0] text-[#0f1115] font-semibold'
                      : f.alert
                        ? 'bg-rose-500/10 text-rose-300 border border-rose-500/30 hover:bg-rose-500/20'
                        : 'text-slate-400 hover:text-white hover:bg-[#1a1c22]'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Capacity Size Filter (34t vs 42t vs 55t) */}
            <div className="flex items-center gap-1">
              <span className="text-slate-400 mr-1">Axle Config:</span>
              {[
                { id: 'all', label: 'All Axles' },
                { id: '34t', label: '34t Standard' },
                { id: '42t', label: '42t Heavy' },
                { id: '55t', label: '55t Semi' }
              ].map(c => (
                <button
                  key={c.id}
                  onClick={() => setCapacityFilter(c.id)}
                  className={`px-2 py-0.8 rounded-md transition text-[11px] cursor-pointer ${
                    capacityFilter === c.id
                      ? 'bg-indigo-600 text-white font-medium'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-[#1a1c22]'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Fraud Banner Info */}
          {fraudCount > 0 && (
            <div className="p-3.5 bg-gradient-to-r from-rose-950/40 via-rose-900/20 to-transparent border border-rose-600/40 rounded-xl flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5 animate-pulse" />
              <div className="text-xs">
                <span className="font-bold text-rose-200 block text-sm">
                  Automatic Weighbridge Fraud & Payload Discrepancy Detection Active
                </span>
                <p className="text-slate-300 mt-0.5">
                  VisualMiner detected {fraudCount} vehicles with gross scale weight deviating &gt;5% from declared Bill of Lading (BOL). Security barriers at Bay 1 &amp; 2 locked until physical tare audit is verified.
                </p>
              </div>
            </div>
          )}

          {/* Detailed Weighbridge Table */}
          <div className="overflow-x-auto rounded-xl border border-[#232634] bg-[#14151b]">
            <table className="w-full text-left text-xs text-slate-300 font-sans">
              <thead className="bg-[#181a22] text-slate-400 font-semibold text-[11px] uppercase tracking-wider border-b border-[#232634]">
                <tr>
                  <th className="py-3 px-3.5">Tipper ID & Carrier</th>
                  <th className="py-3 px-3">Axle / Config</th>
                  <th className="py-3 px-3">Empty Tare</th>
                  <th className="py-3 px-3">Declared Target</th>
                  <th className="py-3 px-3">Actual Scale Net</th>
                  <th className="py-3 px-3">Weight Delta</th>
                  <th className="py-3 px-3">Fraud / Audit Status</th>
                  <th className="py-3 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e202c]">
                {filteredTrucks.map(truck => {
                  const isFraud = truck.status === 'fraud_flagged'
                  return (
                    <tr
                      key={truck.id}
                      className={`hover:bg-[#1a1c24] transition ${
                        isFraud ? 'bg-rose-950/15' : ''
                      }`}
                    >
                      {/* Tipper ID */}
                      <td className="py-3 px-3.5">
                        <div className="font-semibold text-white font-mono flex items-center gap-1.5">
                          {truck.vehicleId}
                          {isFraud && (
                            <span className="px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-400 text-[10px] border border-rose-500/30 font-bold">
                              HELD
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-400">{truck.carrier} · {truck.driver}</div>
                      </td>

                      {/* Config */}
                      <td className="py-3 px-3">
                        <span className="font-medium text-slate-200 block">{truck.config.split(' ')[0]}</span>
                        <span className="text-[10px] text-slate-400">{truck.bay}</span>
                      </td>

                      {/* Tare */}
                      <td className="py-3 px-3 font-mono text-slate-300">
                        {truck.tareKg ? `${(truck.tareKg / 1000).toFixed(2)} t` : '—'}
                      </td>

                      {/* Declared Target */}
                      <td className="py-3 px-3 font-mono text-slate-200">
                        {(truck.plannedKg / 1000).toFixed(2)} t
                      </td>

                      {/* Actual Scale Net */}
                      <td className="py-3 px-3 font-mono">
                        {truck.actualCargoKg ? (
                          <span className={`font-semibold ${isFraud ? 'text-rose-300' : 'text-emerald-300'}`}>
                            {(truck.actualCargoKg / 1000).toFixed(2)} t
                          </span>
                        ) : (
                          <span className="text-slate-400 italic">At Loading Pad</span>
                        )}
                      </td>

                      {/* Weight Delta */}
                      <td className="py-3 px-3 font-mono">
                        {truck.actualCargoKg ? (
                          <span
                            className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                              truck.discrepancyKg > 1000
                                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                                : truck.discrepancyKg < -1000
                                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                                  : 'bg-emerald-500/10 text-emerald-400'
                            }`}
                          >
                            {truck.discrepancyKg > 0 ? '+' : ''}
                            {(truck.discrepancyKg / 1000).toFixed(2)} t ({truck.discrepancyPct > 0 ? '+' : ''}
                            {truck.discrepancyPct}%)
                          </span>
                        ) : (
                          <span className="text-slate-500">0.00 t</span>
                        )}
                      </td>

                      {/* Fraud Reason */}
                      <td className="py-3 px-3 max-w-[220px]">
                        {isFraud ? (
                          <div className="text-[11px] text-rose-300 font-medium leading-tight">
                            <span className="font-bold flex items-center gap-1 text-rose-400">
                              <AlertTriangle className="w-3 h-3" /> Fraud Risk
                            </span>
                            {truck.fraudReason}
                          </div>
                        ) : (
                          <div className="text-[11px] text-slate-400 truncate">
                            <span className="text-emerald-400 font-medium">✓ Scale Matched</span> · {truck.cargo}
                          </div>
                        )}
                      </td>

                      {/* Action */}
                      <td className="py-3 px-3 text-right">
                        <button
                          type="button"
                          onClick={() => setSelectedTruck(truck)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                            isFraud
                              ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-600/30'
                              : 'bg-[#222530] hover:bg-[#2b2f3d] text-slate-200'
                          }`}
                        >
                          {isFraud ? 'Audit / Clear' : 'View Pass'}
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. Mode B: JINDAL CAPTIVE COAL RAIL LOGISTICS & SIDINGS */}
      {logisticsMode === 'rail' && (
        <div className="space-y-4 animate-fadeIn">
          {/* Rail Siding Header Overview */}
          <div className="bg-[#14151b] border border-[#232634] p-4 rounded-2xl">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#20232e] pb-3 mb-4">
              <div>
                <span className="text-[10px] font-bold text-sky-400 uppercase tracking-wider font-mono">
                  {JINDAL_RAIL_SIDINGS.division} · {JINDAL_RAIL_SIDINGS.connectedLine}
                </span>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Train className="w-5 h-5 text-sky-400" />
                  {JINDAL_RAIL_SIDINGS.sidingName}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs text-slate-300 font-mono">Rapid Silo Feed Live (650 t/h)</span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
              <div className="p-3 rounded-xl bg-[#181a22] border border-[#262835]">
                <span className="text-[10px] text-slate-400 block font-sans">Daily Siding Capacity</span>
                <span className="text-base font-bold text-white">{JINDAL_RAIL_SIDINGS.dailyCapacityTons.toLocaleString()} t</span>
              </div>
              <div className="p-3 rounded-xl bg-[#181a22] border border-[#262835]">
                <span className="text-[10px] text-slate-400 block font-sans">Dispatched Today</span>
                <span className="text-base font-bold text-emerald-400">{JINDAL_RAIL_SIDINGS.dispatchedTodayTons.toLocaleString()} t</span>
              </div>
              <div className="p-3 rounded-xl bg-[#181a22] border border-[#262835]">
                <span className="text-[10px] text-slate-400 block font-sans">Siding Buffer Stockpile</span>
                <span className="text-base font-bold text-sky-400">{JINDAL_RAIL_SIDINGS.sidingBufferStockpileTons.toLocaleString()} t</span>
              </div>
              <div className="p-3 rounded-xl bg-[#181a22] border border-[#262835]">
                <span className="text-[10px] text-slate-400 block font-sans">Rake Dispatch Frequency</span>
                <span className="text-base font-bold text-amber-400">3 Rakes / Day (58 BOXN)</span>
              </div>
            </div>
          </div>

          {/* Rakes List */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3.5">
            {JINDAL_RAIL_SIDINGS.rakes.map(rake => (
              <div
                key={rake.id}
                className="p-4 rounded-2xl bg-[#16171d] border border-[#232634] hover:border-sky-500/40 transition flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono font-bold text-sky-300 text-sm">{rake.id}</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        rake.status === 'in_transit'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : rake.status === 'loading'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse'
                            : 'bg-slate-700/40 text-slate-300'
                      }`}
                    >
                      {rake.status.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="text-xs text-slate-200 font-medium">{rake.locoNumber}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">{rake.wagonCount} × {rake.wagonType}</div>
                </div>

                {/* Progress bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] text-slate-300 font-mono">
                    <span>{rake.commodity}</span>
                    <span className="font-bold">{rake.loadedTons} / {rake.targetTons} t</span>
                  </div>
                  <div className="w-full h-2 bg-[#20222a] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-sky-500 to-indigo-500 rounded-full transition-all duration-500"
                      style={{ width: `${(rake.loadedTons / rake.targetTons) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Route & Destination */}
                <div className="pt-2 border-t border-[#20222a] text-[11px] text-slate-400 space-y-1">
                  <div className="flex items-center gap-1.5 text-slate-300 truncate">
                    <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span className="truncate">{rake.destination}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-slate-400">{rake.track}</span>
                    <span className="text-emerald-400 font-mono">{rake.rakeIntegrity}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Inspection & Weighbridge Verification Modal */}
      {selectedTruck && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="w-full max-w-lg bg-[#181a21] border border-[#2a2d39] rounded-2xl shadow-2xl p-6 text-slate-200 space-y-4 animate-scaleUp">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#252836] pb-3">
              <div>
                <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider font-mono">
                  {selectedTruck.status === 'fraud_flagged' ? 'Security Weighbridge Audit' : 'Weighbridge Gate Pass'}
                </span>
                <h3 className="text-lg font-bold text-white font-mono">{selectedTruck.vehicleId}</h3>
              </div>
              <button
                onClick={() => setSelectedTruck(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-[#222530]"
              >
                ✕
              </button>
            </div>

            {/* Scale Comparison Card */}
            <div className="p-4 rounded-xl bg-[#121318] border border-[#242735] space-y-2.5 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-slate-400">Carrier / Driver:</span>
                <span className="text-white font-medium">{selectedTruck.carrier} ({selectedTruck.driver})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Config:</span>
                <span className="text-slate-200">{selectedTruck.config}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Tare Weight (Empty In):</span>
                <span className="text-slate-200">{selectedTruck.tareKg ? `${selectedTruck.tareKg} kg` : 'Pending'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Declared BOL Cargo Target:</span>
                <span className="text-white font-semibold">{selectedTruck.plannedKg} kg</span>
              </div>
              <div className="flex justify-between border-t border-[#20232e] pt-2">
                <span className="text-slate-400">Actual Measured Cargo Weight:</span>
                <span className={`font-bold ${selectedTruck.status === 'fraud_flagged' ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {selectedTruck.actualCargoKg ? `${selectedTruck.actualCargoKg} kg` : 'Loading Pad'}
                </span>
              </div>
              <div className="flex justify-between font-bold">
                <span className="text-slate-400">Weight Discrepancy Delta:</span>
                <span className={selectedTruck.discrepancyKg > 0 ? 'text-rose-400' : selectedTruck.discrepancyKg < 0 ? 'text-amber-400' : 'text-emerald-400'}>
                  {selectedTruck.discrepancyKg > 0 ? '+' : ''}{selectedTruck.discrepancyKg} kg ({selectedTruck.discrepancyPct}%)
                </span>
              </div>
            </div>

            {/* Flag Detail */}
            {selectedTruck.fraudReason && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-300">
                <span className="font-bold block mb-0.5">Audit Flag:</span>
                {selectedTruck.fraudReason}
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-[#252836]">
              <button
                type="button"
                onClick={() => setSelectedTruck(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#222530] hover:bg-[#2b2f3d] text-slate-300 transition"
              >
                Close
              </button>
              {selectedTruck.status === 'fraud_flagged' && (
                <button
                  type="button"
                  onClick={() => handleResolveFraud(selectedTruck.id, 'Supervisory re-weigh confirmed calibration tolerance')}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30 transition flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Verify Tare &amp; Authorize Gate Pass</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
