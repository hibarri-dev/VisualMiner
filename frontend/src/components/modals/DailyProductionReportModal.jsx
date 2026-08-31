import React, { useState } from 'react'
import {
  FileCheck2,
  X,
  Send,
  Building2,
  Mountain,
  Truck,
  Flame,
  AlertTriangle,
  MessageSquare
} from 'lucide-react'

export default function DailyProductionReportModal({
  isOpen,
  onClose,
  onSubmitReport,
  currentSite = 'Kulilia Mine'
}) {
  const [formData, setFormData] = useState({
    site: currentSite,
    shift: 'Shift B (14:00 - 22:00)',
    managerName: 'Vasanth (Mine Manager)',
    extractionTons: '4,080',
    drilledHoles: '92',
    truckTrips: '64',
    plantStatus: 'X17 Jaw Crusher Down (Eccentric Bearing Seized)',
    gateTippersHeld: '17',
    financialRiskNote: 'Crusher downtime costing $18.5k/hr; coal rail siding loading prioritized for Jindal Rake 104.',
    managerNotes: 'Shift B operational summary: Pit extraction rate on QZ-1 high grade reached 170 t/h (+40%). 2 tippers held at Gate 1 for weight mismatch fraud audit.'
  })

  if (!isOpen) return null

  const handleSubmit = e => {
    e.preventDefault()
    if (onSubmitReport) {
      onSubmitReport({
        ...formData,
        id: `DPR-${Date.now()}`,
        submittedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      })
    }
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 animate-fadeIn">
      <div className="w-full max-w-xl bg-[#16171e] border border-[#262835] rounded-2xl shadow-2xl p-6 text-slate-200 space-y-4 max-h-[90vh] overflow-y-auto animate-scaleUp">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#232532] pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white">
                Submit Daily Mine Production Report
              </h3>
              <p className="text-[11px] text-slate-400">
                Transmits real-time operational telemetry &amp; notes directly to Executive Oversight
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#20222c] transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          {/* Site & Shift Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                Active Mining Asset
              </label>
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#111217] border border-[#262835] text-slate-200">
                <Building2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <input
                  type="text"
                  value={formData.site}
                  onChange={e => setFormData({ ...formData, site: e.target.value })}
                  className="bg-transparent w-full focus:outline-none text-white font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                Operating Shift &amp; Manager
              </label>
              <div className="p-2.5 rounded-xl bg-[#111217] border border-[#262835] text-slate-200">
                <input
                  type="text"
                  value={formData.managerName}
                  onChange={e => setFormData({ ...formData, managerName: e.target.value })}
                  className="bg-transparent w-full focus:outline-none text-indigo-300 font-medium font-mono"
                />
              </div>
            </div>
          </div>

          {/* KPI Inputs Grid */}
          <div className="grid grid-cols-3 gap-2.5">
            <div className="p-2.5 rounded-xl bg-[#111217] border border-[#262835]">
              <span className="text-[10px] text-slate-400 block mb-1">ROM Mined (Tons)</span>
              <input
                type="text"
                value={formData.extractionTons}
                onChange={e => setFormData({ ...formData, extractionTons: e.target.value })}
                className="bg-transparent w-full font-bold text-emerald-400 text-sm focus:outline-none font-mono"
              />
            </div>
            <div className="p-2.5 rounded-xl bg-[#111217] border border-[#262835]">
              <span className="text-[10px] text-slate-400 block mb-1">Drill Holes Drilled</span>
              <input
                type="text"
                value={formData.drilledHoles}
                onChange={e => setFormData({ ...formData, drilledHoles: e.target.value })}
                className="bg-transparent w-full font-bold text-white text-sm focus:outline-none font-mono"
              />
            </div>
            <div className="p-2.5 rounded-xl bg-[#111217] border border-[#262835]">
              <span className="text-[10px] text-slate-400 block mb-1">Truck Trips Loaded</span>
              <input
                type="text"
                value={formData.truckTrips}
                onChange={e => setFormData({ ...formData, truckTrips: e.target.value })}
                className="bg-transparent w-full font-bold text-amber-400 text-sm focus:outline-none font-mono"
              />
            </div>
          </div>

          {/* Bottleneck Warning Note */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-300 mb-1">
              Plant Bottleneck / Maintenance Status
            </label>
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-rose-950/20 border border-rose-500/30 text-rose-300">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              <input
                type="text"
                value={formData.plantStatus}
                onChange={e => setFormData({ ...formData, plantStatus: e.target.value })}
                className="bg-transparent w-full focus:outline-none text-rose-200"
              />
            </div>
          </div>

          {/* Tactical Manager Notes */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />
              Mine Manager Directives for Executives
            </label>
            <textarea
              rows={3}
              value={formData.managerNotes}
              onChange={e => setFormData({ ...formData, managerNotes: e.target.value })}
              className="w-full p-2.5 rounded-xl bg-[#111217] border border-[#262835] focus:border-indigo-500 focus:outline-none text-slate-200 text-xs leading-relaxed"
              placeholder="Provide context regarding weighbridge fraud flags, rail siding loading, or shift handover..."
            />
          </div>

          {/* Submit Footer */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#232532]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-[#20222c] hover:bg-[#282a36] text-slate-300 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-semibold shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit Report &amp; Alert Executive</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
