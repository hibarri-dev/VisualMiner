import React, { useState } from 'react'
import {
  X,
  Compass,
  MapPin,
  Flame,
  Wrench,
  Mountain,
  Anchor,
  Sparkles,
  CheckCircle2,
  FileSpreadsheet
} from 'lucide-react'
import { SITE_STAGES } from '../../data'
import { useMineData } from '../../context/useMineData'

export default function RegisterSiteModal({ isOpen, onClose, onRegistered }) {
  const { addSite } = useMineData()
  const [name, setName] = useState('')
  const [location, setLocation] = useState('')
  const [type, setType] = useState('wash_plant')
  const [stage, setStage] = useState('processing')
  const [commodity, setCommodity] = useState('Industrial Sand')
  const [skipTestData, setSkipTestData] = useState(true)
  const [lithology, setLithology] = useState('')
  const [assayGrade, setAssayGrade] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)

  if (!isOpen) return null

  const handleSubmit = e => {
    e.preventDefault()
    addSite({ name, location, type, stage, commodity, skipTestData, lithology, assayGrade })
    setIsSuccess(true)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="relative w-full max-w-lg bg-[#14161e] border border-[#2a2d3c] rounded-2xl shadow-2xl overflow-hidden text-slate-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#232635]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Register New Site</h3>
              <p className="text-xs text-slate-400">Add Open Pit, Standalone Wash/Crushing Plant, or Port</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[75vh] overflow-y-auto space-y-4">
          {!isSuccess ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Site Name & Location */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Site Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g., Bellary Sand Wash Plant #3"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#1a1c25] border border-[#262835] text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Location / Coordinates
                </label>
                <input
                  type="text"
                  required
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  placeholder="e.g., Bellary South Industrial Belt, Karnataka"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#1a1c25] border border-[#262835] text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Site Type / Facility Mode */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Facility Archetype
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {[
                    { id: 'open_pit', label: 'Full Open Pit Mine' },
                    { id: 'wash_plant', label: 'Wash Plant (No Mine)' },
                    { id: 'crushing_plant', label: 'Crushing Hub (No Mine)' },
                    { id: 'port_terminal', label: 'Customer-Owned Port' }
                  ].map(item => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setType(item.id)}
                      className={`p-2 rounded-lg border text-left transition cursor-pointer ${
                        type === item.id
                          ? 'bg-indigo-600/20 text-indigo-200 border-indigo-500 font-medium'
                          : 'bg-[#1a1c25] text-slate-400 border-[#262835]'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Commodity / ore body
                </label>
                <input
                  type="text"
                  value={commodity}
                  onChange={e => setCommodity(e.target.value)}
                  placeholder="e.g. Chrome, Anthracite, Gold"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#1a1c25] border border-[#262835] text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Lifecycle Stage
                </label>
                <select
                  value={stage}
                  onChange={e => setStage(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#1a1c25] border border-[#262835] text-sm text-white focus:outline-none focus:border-indigo-500"
                >
                  {SITE_STAGES.map(st => (
                    <option key={st.id} value={st.id}>
                      {st.label} — {st.desc}
                    </option>
                  ))}
                </select>
              </div>

              {/* Test Results & Site Data Checkbox (Optional / Skip & Add Later) */}
              <div className="p-3.5 rounded-xl bg-[#191b24] border border-[#262a38] space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                    <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Test Results & Initial Site Data</span>
                  </span>
                  <label className="flex items-center gap-2 text-[11px] text-slate-400 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={skipTestData}
                      onChange={e => setSkipTestData(e.target.checked)}
                      className="rounded bg-slate-800 border-slate-700 text-indigo-600 focus:ring-0"
                    />
                    <span>Skip for now (Add later)</span>
                  </label>
                </div>

                {!skipTestData ? (
                  <div className="space-y-2 pt-2 border-t border-[#242735] text-xs animate-fadeIn">
                    <input
                      type="text"
                      value={lithology}
                      onChange={e => setLithology(e.target.value)}
                      placeholder="Lithology / Ore strata description"
                      className="w-full px-3 py-2 rounded-lg bg-[#14151c] border border-[#262835] text-white"
                    />
                    <input
                      type="text"
                      value={assayGrade}
                      onChange={e => setAssayGrade(e.target.value)}
                      placeholder="Initial core assay / grade results (e.g. 2.8% Cu)"
                      className="w-full px-3 py-2 rounded-lg bg-[#14151c] border border-[#262835] text-white"
                    />
                  </div>
                ) : (
                  <p className="text-[11px] text-slate-500">
                    You can register this facility immediately. Geologists and lab teams can attach assays and sensor streams later.
                  </p>
                )}
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30"
                >
                  Register Site Asset
                </button>
              </div>
            </form>
          ) : (
            <div className="text-center py-4 space-y-4">
              <div className="w-12 h-12 mx-auto rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-white text-base">Site Successfully Registered</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Asset provisioned under {stage.toUpperCase()} stage. Visible across navigation and portfolio maps.
                </p>
              </div>
              <button
                onClick={() => {
                  setIsSuccess(false)
                  setName('')
                  setLocation('')
                  if (onRegistered) onRegistered()
                  onClose()
                }}
                className="w-full py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold"
              >
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
