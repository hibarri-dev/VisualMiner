import React, { useState } from 'react'
import {
  X,
  Sparkles,
  FileText,
  Upload,
  CheckCircle2,
  AlertCircle,
  Cpu,
  Layers
} from 'lucide-react'

const REPORT_TYPES = [
  { id: 'inspection', name: 'Inspection Reports', desc: 'Equipment condition and bench integrity' },
  { id: 'maintenance', name: 'Maintenance Reports', desc: 'Breakdown reports and spare parts logs' },
  { id: 'geological', name: 'Geological Reports', desc: 'Ore grade, lithology & fault line maps' },
  { id: 'blast', name: 'Blast Reports', desc: 'Pattern fragmentation & vibration assays' },
  { id: 'safety', name: 'Safety Reports', desc: 'Incident logs, PPE adherence & hazard flags' },
  { id: 'engineering', name: 'Engineering Drawings', desc: 'nanoCAD/CAD pit design alterations' },
  { id: 'sops', name: 'SOPs', desc: 'Standard Operating Procedures & checklists' },
  { id: 'permits', name: 'Permits', desc: 'Environmental & blasting statutory approvals' },
  { id: 'environmental', name: 'Environmental Reports', desc: 'Dust, water runoff & noise sensors' },
  { id: 'contractor', name: 'Contractor Reports', desc: 'Third-party haulage & drilling logs' }
]

export default function SubmitReportModal({ isOpen, onClose, onReportSubmitted }) {
  const [selectedType, setSelectedType] = useState('geological')
  const [reportTitle, setReportTitle] = useState('')
  const [notes, setNotes] = useState('')
  const [isProcessingAi, setIsProcessingAi] = useState(false)
  const [aiResult, setAiResult] = useState(null)

  if (!isOpen) return null

  const handleSubmit = e => {
    e.preventDefault()
    setIsProcessingAi(true)

    // Simulate AI model interpretation and dynamic parameter adjustment
    setTimeout(() => {
      setIsProcessingAi(false)
      const mockResult = {
        summary: `AI has analyzed the ${selectedType} report. Geological yield model updated with +3.2% efficiency adjustment.`,
        predictedYieldChange: '+3.2%',
        geofenceAffected: 'Bench 4 North',
        timestamp: new Date().toLocaleTimeString()
      }
      setAiResult(mockResult)
      if (onReportSubmitted) onReportSubmitted(mockResult)
    }, 1200)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="relative w-full max-w-xl bg-[#14161e] border border-[#2a2d3c] rounded-2xl shadow-2xl overflow-hidden text-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#232635]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Submit Site Report</h3>
              <p className="text-xs text-slate-400">AI auto-interprets telemetry & adjusts 3D pit model</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {!aiResult ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Category selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Report Category (10 Feeds)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {REPORT_TYPES.map(type => (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => setSelectedType(type.id)}
                      className={`text-left p-2.5 rounded-lg text-xs font-medium border transition cursor-pointer ${
                        selectedType === type.id
                          ? 'bg-indigo-600/25 border-indigo-500 text-white shadow-xs'
                          : 'bg-[#1a1c25] border-[#262835] text-slate-400 hover:text-slate-200 hover:bg-[#202330]'
                      }`}
                    >
                      <div className="font-semibold text-slate-200">{type.name}</div>
                      <div className="text-[10px] text-slate-400 truncate mt-0.5">{type.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Title Input */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Report Identifier / Title
                </label>
                <input
                  type="text"
                  required
                  value={reportTitle}
                  onChange={e => setReportTitle(e.target.value)}
                  placeholder="e.g., Bench 4 Core Sample Assay Log #409"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#1a1c25] border border-[#262835] text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              {/* Data & Observations */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Report Findings & Sensor Logs
                </label>
                <textarea
                  rows="3"
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="Paste laboratory assays, lithology strata, or maintenance fault codes for AI model recalculation..."
                  className="w-full px-3.5 py-2 rounded-lg bg-[#1a1c25] border border-[#262835] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                ></textarea>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-white transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isProcessingAi}
                  className="px-5 py-2.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition cursor-pointer disabled:opacity-50"
                >
                  {isProcessingAi ? (
                    <>
                      <Sparkles className="w-4 h-4 animate-spin" />
                      <span>AI Recalibrating 3D Model...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Submit & Auto-Adjust Model</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4 py-2 text-center">
              <div className="w-12 h-12 mx-auto rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-white text-base">AI Model Recalibrated Successfully</h4>
                <p className="text-xs text-slate-400 mt-1">{aiResult.summary}</p>
              </div>
              <div className="p-3 bg-[#1c1e28] rounded-xl border border-[#2d3040] text-xs text-left space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-400">Predicted Yield Delta:</span>
                  <span className="text-emerald-400 font-bold">{aiResult.predictedYieldChange}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Affected 3D Zone:</span>
                  <span className="text-indigo-300 font-mono">{aiResult.geofenceAffected}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Synced to Feeds:</span>
                  <span className="text-slate-300">CAT Fleet, Deswik, Micromine</span>
                </div>
              </div>
              <button
                onClick={() => {
                  setAiResult(null)
                  setReportTitle('')
                  setNotes('')
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
