import React, { useMemo, useState } from 'react'
import { X, Plus, Radio } from 'lucide-react'
import { BENCHES, MACHINE_TYPE_LIST, MACHINE_TYPES, MACHINE_ZONES } from '../../data'
import { useMineData } from '../../context/useMineData'

export default function AddMachineModal({ isOpen, onClose, onTracked }) {
  const { addMachine, mine } = useMineData()
  const [type, setType] = useState('haul_truck')
  const [model, setModel] = useState(MACHINE_TYPES.haul_truck.models[0])
  const [trackerId, setTrackerId] = useState('')
  const [assetId, setAssetId] = useState('')
  const [bench, setBench] = useState('Bench 4 North')
  const [zone, setZone] = useState('ROM Pad')
  const [operatorId, setOperatorId] = useState('')
  const [trackLive, setTrackLive] = useState(true)

  const spec = MACHINE_TYPES[type]
  const operators = useMemo(
    () => mine.personnel.filter(p => p.roleGroup === 'operators' && p.status === 'on_shift').slice(0, 40),
    [mine.personnel]
  )

  if (!isOpen) return null

  const handleType = nextType => {
    setType(nextType)
    setModel(MACHINE_TYPES[nextType].models[0])
  }

  const handleSubmit = e => {
    e.preventDefault()
    addMachine({ type, model, trackerId, assetId, bench, zone, operatorId, trackLive })
    setTrackerId('')
    setAssetId('')
    onClose()
    if (onTracked) onTracked()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl bg-[#14161e] border border-[#2a2d3c] rounded-2xl shadow-2xl text-slate-200 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#232635]">
          <div>
            <h3 className="font-bold text-white text-base">Add yellow machine</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Pick the iron, attach a GPS tracker, it runs live on the pit.</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400">
            <X className="w-4 h-4" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">Yellow fleet catalog</div>
            <div className="grid grid-cols-3 gap-2">
              {MACHINE_TYPE_LIST.map(item => {
                const active = item.id === type
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleType(item.id)}
                    className={`text-left px-3 py-2.5 rounded-xl border text-xs transition ${
                      active
                        ? 'bg-amber-500/15 border-amber-400 text-amber-100'
                        : 'bg-[#1a1c25] border-[#262835] text-slate-300 hover:border-slate-500'
                    }`}
                  >
                    <div className="font-semibold text-slate-100">{item.label}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5 truncate">{item.models[0]}</div>
                  </button>
                )
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Model
              <select
                value={model}
                onChange={e => setModel(e.target.value)}
                className="mt-1.5 w-full px-3 py-2.5 rounded-lg bg-[#1a1c25] border border-[#262835] text-sm text-white font-normal normal-case tracking-normal"
              >
                {spec.models.map(m => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">
              GPS / RFID tracker ID
              <input
                value={trackerId}
                onChange={e => setTrackerId(e.target.value)}
                placeholder="GPS-7K4…"
                className="mt-1.5 w-full px-3 py-2.5 rounded-lg bg-[#1a1c25] border border-[#262835] text-sm text-white font-mono font-normal normal-case tracking-normal"
              />
            </label>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Asset ID (optional)
              <input
                value={assetId}
                onChange={e => setAssetId(e.target.value)}
                placeholder="Auto if empty"
                className="mt-1.5 w-full px-3 py-2.5 rounded-lg bg-[#1a1c25] border border-[#262835] text-sm text-white font-mono font-normal normal-case tracking-normal"
              />
            </label>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Operator
              <select
                value={operatorId}
                onChange={e => setOperatorId(e.target.value)}
                className="mt-1.5 w-full px-3 py-2.5 rounded-lg bg-[#1a1c25] border border-[#262835] text-sm text-white font-normal normal-case tracking-normal"
              >
                <option value="">Unassigned</option>
                {operators.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Start bench
              <select
                value={bench}
                onChange={e => setBench(e.target.value)}
                className="mt-1.5 w-full px-3 py-2.5 rounded-lg bg-[#1a1c25] border border-[#262835] text-sm text-white font-normal normal-case tracking-normal"
              >
                {BENCHES.map(b => (
                  <option key={b.id} value={b.name}>
                    {b.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Start zone
              <select
                value={zone}
                onChange={e => setZone(e.target.value)}
                className="mt-1.5 w-full px-3 py-2.5 rounded-lg bg-[#1a1c25] border border-[#262835] text-sm text-white font-normal normal-case tracking-normal"
              >
                {MACHINE_ZONES.map(z => (
                  <option key={z} value={z}>
                    {z}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={trackLive}
              onChange={e => setTrackLive(e.target.checked)}
              className="accent-amber-400"
            />
            Live track on pit map (moves with dummy GPS)
          </label>

          <button
            type="submit"
            className="w-full py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-[#1a1205] text-xs font-semibold flex items-center justify-center gap-2"
          >
            <Radio className="w-4 h-4" />
            <Plus className="w-3.5 h-3.5" />
            Attach tracker & run live
          </button>
        </form>
      </div>
    </div>
  )
}
