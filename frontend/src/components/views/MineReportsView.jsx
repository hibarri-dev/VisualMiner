import React, { useState } from 'react'
import {
  FileText,
  Plus,
  Table,
  Upload,
  Calendar,
  Layers,
  FileCheck,
  FlaskConical,
  MessageSquare,
  CheckCircle,
  Clock,
  Sparkles,
  Paperclip,
  Download,
  Search,
  ChevronRight
} from 'lucide-react'
import { INITIAL_SHIFT_REPORTS } from '../../data/mineReportsData'

export default function MineReportsView() {
  const [reports, setReports] = useState(INITIAL_SHIFT_REPORTS)
  const [selectedReport, setSelectedReport] = useState(INITIAL_SHIFT_REPORTS[0])
  const [showNewModal, setShowNewModal] = useState(false)

  // New Shift Report Form State
  const [date, setDate] = useState('2026-09-22')
  const [shift, setShift] = useState('Day Shift (06:00 - 18:00)')
  const [mineName, setMineName] = useState('Kolar North Open Pit')
  const [managerName, setManagerName] = useState('Devraj Mudaliar')
  const [oreType, setOreType] = useState('Thermal Coal')
  const [oreSpec, setOreSpec] = useState('RB1 (6000 kcal/kg Export Quality)')
  const [tonsExtracted, setTonsExtracted] = useState(19000)
  const [tonsProcessed, setTonsProcessed] = useState(17500)
  const [tonsInStockpile, setTonsInStockpile] = useState(88000)
  const [tonsLoadedForTrucking, setTonsLoadedForTrucking] = useState(15000)
  const [tonsDispatchedOnTrucks, setTonsDispatchedOnTrucks] = useState(14800)
  const [managerNotes, setManagerNotes] = useState('Shift executed smoothly. Heavy excavator EX-02 achieved record haulage rate.')
  const [handoverNotes, setHandoverNotes] = useState('Proceed with Bench 5 drilling setup during night shift.')

  const handleCreateReport = e => {
    e.preventDefault()
    const newRep = {
      id: `REP-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      date,
      shift,
      mineName,
      managerName,
      oreType,
      oreSpec,
      tonsExtracted: Number(tonsExtracted),
      tonsProcessed: Number(tonsProcessed),
      tonsInStockpile: Number(tonsInStockpile),
      tonsLoadedForTrucking: Number(tonsLoadedForTrucking),
      tonsDispatchedOnTrucks: Number(tonsDispatchedOnTrucks),
      managerNotes,
      handoverNotes,
      pdfAttachment: { name: `Shift_Log_${mineName.replace(/\s+/g, '_')}_${date}.pdf`, size: '2.1 MB', uploadedAt: 'Just Now' },
      labSpecSheet: { name: `Assay_Spec_${oreSpec.split(' ')[0]}.pdf`, size: '1.5 MB', ashContent: '12.0%', moisture: '8.0%', volatileMatter: '24.0%', calorificValue: '6000 kcal/kg' }
    }
    setReports([newRep, ...reports])
    setSelectedReport(newRep)
    setShowNewModal(false)
  }

  return (
    <div className="min-h-full pb-16 bg-[#0c0d11] text-slate-100 p-4 sm:p-6 space-y-6 flex-1">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-[#13151f] to-indigo-950/40 border border-[#232636] rounded-2xl p-5 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider">
            <FileText className="w-4 h-4" />
            <span>Executive Shift Reporting Engine</span>
          </div>
          <h1 className="text-2xl font-black text-white mt-1">Mine Shift Reports</h1>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Standard shift templates reported by Mine Managers to Executives per shift: tonnage extracted, processed, stockpiled, loaded, and dispatched.
          </p>
        </div>

        <button
          onClick={() => setShowNewModal(true)}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition flex items-center gap-2 shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Submit Shift Report</span>
        </button>
      </div>

      {/* Main Grid: Shift Table & In-Page Notes Reader */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Table View (2 Cols) */}
        <div className="lg:col-span-2 bg-[#12141c] border border-[#212433] rounded-2xl p-4 sm:p-5 space-y-4 shadow-xl overflow-hidden">
          <div className="flex items-center justify-between pb-2 border-b border-[#212433]">
            <div className="flex items-center gap-2">
              <Table className="w-4 h-4 text-indigo-400" />
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">Shift Report Log Table</h2>
            </div>
            <span className="text-xs text-slate-400 font-mono">{reports.length} Reports Logged</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#26293a] text-slate-400 font-bold uppercase text-[10px] tracking-wider bg-[#171924]">
                  <th className="p-3">Shift / Date</th>
                  <th className="p-3">Mine / Manager</th>
                  <th className="p-3">Ore Type & Spec</th>
                  <th className="p-3 text-right">Extracted</th>
                  <th className="p-3 text-right">Processed</th>
                  <th className="p-3 text-right">Dispatched</th>
                  <th className="p-3 text-center">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e212d]">
                {reports.map(rep => {
                  const isSelected = selectedReport?.id === rep.id
                  return (
                    <tr
                      key={rep.id}
                      onClick={() => setSelectedReport(rep)}
                      className={`cursor-pointer transition hover:bg-[#1a1d2b] ${
                        isSelected ? 'bg-indigo-950/40 border-l-4 border-indigo-500' : ''
                      }`}
                    >
                      <td className="p-3 font-medium">
                        <div className="text-slate-100 font-bold">{rep.shift}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{rep.date}</div>
                      </td>
                      <td className="p-3">
                        <div className="text-indigo-300 font-semibold">{rep.mineName}</div>
                        <div className="text-[10px] text-slate-400">{rep.managerName}</div>
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-bold text-[10px]">
                          {rep.oreSpec}
                        </span>
                        <div className="text-[10px] text-slate-400 mt-0.5">{rep.oreType}</div>
                      </td>
                      <td className="p-3 text-right font-mono font-bold text-slate-200">
                        {rep.tonsExtracted.toLocaleString()} T
                      </td>
                      <td className="p-3 text-right font-mono font-bold text-emerald-400">
                        {rep.tonsProcessed.toLocaleString()} T
                      </td>
                      <td className="p-3 text-right font-mono font-bold text-amber-400">
                        {rep.tonsDispatchedOnTrucks.toLocaleString()} T
                      </td>
                      <td className="p-3 text-center">
                        <button
                          onClick={e => {
                            e.stopPropagation()
                            setSelectedReport(rep)
                          }}
                          className="px-2.5 py-1 rounded bg-[#242738] hover:bg-indigo-600 hover:text-white text-indigo-300 text-[10px] font-bold transition inline-flex items-center gap-1"
                        >
                          <MessageSquare className="w-3 h-3" />
                          <span>View</span>
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* In-Page Interactive Notes & Attachments Panel (1 Col) */}
        <div className="space-y-4">
          {selectedReport ? (
            <div className="bg-[#12141c] border border-indigo-500/40 rounded-2xl p-5 space-y-4 shadow-xl animate-fadeIn">
              <div className="flex items-center justify-between border-b border-[#212433] pb-3">
                <div>
                  <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Shift Details Reader</span>
                  <h3 className="text-base font-bold text-white">{selectedReport.mineName}</h3>
                  <p className="text-xs text-slate-400">{selectedReport.shift} • {selectedReport.date}</p>
                </div>
                <span className="px-2.5 py-1 rounded bg-indigo-600/20 text-indigo-300 text-xs font-mono font-bold">
                  {selectedReport.id}
                </span>
              </div>

              {/* Tonnage Summary Grid */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 bg-[#171924] rounded-xl border border-[#242738]">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Tons Extracted</span>
                  <div className="font-bold text-slate-100 text-sm mt-0.5">{selectedReport.tonsExtracted.toLocaleString()} T</div>
                </div>
                <div className="p-2.5 bg-[#171924] rounded-xl border border-[#242738]">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Tons Processed</span>
                  <div className="font-bold text-emerald-400 text-sm mt-0.5">{selectedReport.tonsProcessed.toLocaleString()} T</div>
                </div>
                <div className="p-2.5 bg-[#171924] rounded-xl border border-[#242738]">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Tons Stockpiled</span>
                  <div className="font-bold text-indigo-400 text-sm mt-0.5">{selectedReport.tonsInStockpile.toLocaleString()} T</div>
                </div>
                <div className="p-2.5 bg-[#171924] rounded-xl border border-[#242738]">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Tons Dispatched</span>
                  <div className="font-bold text-amber-400 text-sm mt-0.5">{selectedReport.tonsDispatchedOnTrucks.toLocaleString()} T</div>
                </div>
              </div>

              {/* Manager's Notes */}
              <div className="p-3.5 bg-[#171a26] border border-[#252838] rounded-xl space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-300 uppercase">
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Manager's Shift Notes</span>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed pt-1">
                  "{selectedReport.managerNotes}"
                </p>
                <div className="text-[10px] text-slate-400 text-right pt-1">— Manager: {selectedReport.managerName}</div>
              </div>

              {/* Shift Handover Notes */}
              <div className="p-3.5 bg-[#171a26] border border-[#252838] rounded-xl space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300 uppercase">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Shift Handover Instructions</span>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed pt-1">
                  "{selectedReport.handoverNotes}"
                </p>
              </div>

              {/* Attachments & Lab Spec Sheet */}
              <div className="space-y-2 pt-2 border-t border-[#212433]">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Attachments & Lab Assay Sheet</span>
                {selectedReport.pdfAttachment && (
                  <div className="flex items-center justify-between p-2.5 bg-[#181b28] rounded-xl border border-[#282b3d] text-xs">
                    <div className="flex items-center gap-2">
                      <Paperclip className="w-4 h-4 text-indigo-400 shrink-0" />
                      <div className="truncate">
                        <div className="font-bold text-slate-200 truncate">{selectedReport.pdfAttachment.name}</div>
                        <div className="text-[10px] text-slate-400">{selectedReport.pdfAttachment.size}</div>
                      </div>
                    </div>
                    <button className="p-1.5 rounded-lg bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600 hover:text-white transition cursor-pointer">
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {selectedReport.labSpecSheet && (
                  <div className="p-3 bg-[#181b28] rounded-xl border border-[#282b3d] text-xs space-y-2">
                    <div className="flex items-center justify-between text-indigo-300 font-bold">
                      <div className="flex items-center gap-1.5">
                        <FlaskConical className="w-4 h-4" />
                        <span>Laboratory Assay Spec Sheet</span>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 bg-indigo-500/20 rounded font-mono">
                        {selectedReport.labSpecSheet.calorificValue}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-[10px] font-mono text-slate-300 pt-1">
                      <div>Ash: <strong>{selectedReport.labSpecSheet.ashContent}</strong></div>
                      <div>Moisture: <strong>{selectedReport.labSpecSheet.moisture}</strong></div>
                      <div>VM: <strong>{selectedReport.labSpecSheet.volatileMatter}</strong></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="p-8 text-center bg-[#12141c] border border-[#212433] rounded-2xl text-slate-400 text-xs">
              Select a shift report from the table to read manager notes and spec sheets.
            </div>
          )}
        </div>

      </div>

      {/* New Shift Report Modal */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-[#141620] border border-indigo-500/50 rounded-2xl w-full max-w-xl p-6 space-y-4 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#252838] pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-400" />
                <h3 className="text-lg font-bold text-white">Submit Mine Manager Shift Report</h3>
              </div>
              <button
                onClick={() => setShowNewModal(false)}
                className="text-xs text-slate-400 hover:text-white"
              >
                ✕ Close
              </button>
            </div>

            <form onSubmit={handleCreateReport} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Shift Date</label>
                  <input
                    type="date"
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    className="w-full h-9 px-3 rounded-lg bg-[#1a1c28] border border-[#2b2f42] text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Shift Type</label>
                  <select
                    value={shift}
                    onChange={e => setShift(e.target.value)}
                    className="w-full h-9 px-3 rounded-lg bg-[#1a1c28] border border-[#2b2f42] text-white"
                  >
                    <option value="Day Shift (06:00 - 18:00)">Day Shift (06:00 - 18:00)</option>
                    <option value="Night Shift (18:00 - 06:00)">Night Shift (18:00 - 06:00)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Ore Type</label>
                  <input
                    type="text"
                    value={oreType}
                    onChange={e => setOreType(e.target.value)}
                    className="w-full h-9 px-3 rounded-lg bg-[#1a1c28] border border-[#2b2f42] text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Ore Spec (RB1, RB2, etc)</label>
                  <input
                    type="text"
                    value={oreSpec}
                    onChange={e => setOreSpec(e.target.value)}
                    className="w-full h-9 px-3 rounded-lg bg-[#1a1c28] border border-[#2b2f42] text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Tons Extracted</label>
                  <input
                    type="number"
                    value={tonsExtracted}
                    onChange={e => setTonsExtracted(e.target.value)}
                    className="w-full h-9 px-2.5 rounded-lg bg-[#1a1c28] border border-[#2b2f42] text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Tons Processed</label>
                  <input
                    type="number"
                    value={tonsProcessed}
                    onChange={e => setTonsProcessed(e.target.value)}
                    className="w-full h-9 px-2.5 rounded-lg bg-[#1a1c28] border border-[#2b2f42] text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Tons Dispatched</label>
                  <input
                    type="number"
                    value={tonsDispatchedOnTrucks}
                    onChange={e => setTonsDispatchedOnTrucks(e.target.value)}
                    className="w-full h-9 px-2.5 rounded-lg bg-[#1a1c28] border border-[#2b2f42] text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Manager's Shift Notes</label>
                <textarea
                  rows={2}
                  value={managerNotes}
                  onChange={e => setManagerNotes(e.target.value)}
                  className="w-full p-2.5 rounded-lg bg-[#1a1c28] border border-[#2b2f42] text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Shift Handover Notes</label>
                <textarea
                  rows={2}
                  value={handoverNotes}
                  onChange={e => setHandoverNotes(e.target.value)}
                  className="w-full p-2.5 rounded-lg bg-[#1a1c28] border border-[#2b2f42] text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[#252838]">
                <div className="p-3 border border-dashed border-[#34384e] rounded-xl text-center">
                  <Upload className="w-5 h-5 mx-auto text-indigo-400" />
                  <span className="block text-[11px] text-slate-300 font-bold mt-1">Upload Shift Log PDF (Optional)</span>
                </div>
                <div className="p-3 border border-dashed border-[#34384e] rounded-xl text-center">
                  <Upload className="w-5 h-5 mx-auto text-emerald-400" />
                  <span className="block text-[11px] text-slate-300 font-bold mt-1">Upload Lab Spec Sheet (Optional)</span>
                </div>
              </div>

              <div className="pt-3 border-t border-[#252838] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="px-4 py-2 rounded-xl bg-[#202332] text-slate-300 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30"
                >
                  Save & Submit Shift Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
