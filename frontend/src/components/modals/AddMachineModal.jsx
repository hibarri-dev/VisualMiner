import React, { useState } from 'react'
import { X, Plus } from 'lucide-react'
import { MACHINE_TYPES } from '../../data'
import { useMineData } from '../../context/useMineData'

export default function AddMachineModal({ isOpen, onClose }) {
  const { addMachine } = useMineData()
  const [type, setType] = useState('haul_truck')
  const [name, setName] = useState('')

  if (!isOpen) return null

  const handleSubmit = e => {
    e.preventDefault()
    addMachine({ type, name })
    setName('')
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-[#14161e] border border-[#2a2d3c] rounded-2xl shadow-2xl text-slate-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#232635]">
          <h3 className="font-bold text-white text-base">Add Machine</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400">
            <X className="w-4 h-4" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
            Class
            <select
              value={type}
              onChange={e => setType(e.target.value)}
              className="mt-1.5 w-full px-3 py-2.5 rounded-lg bg-[#1a1c25] border border-[#262835] text-sm text-white"
            >
              {Object.entries(MACHINE_TYPES).map(([id, spec]) => (
                <option key={id} value={id}>
                  {spec.label}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
            Name (optional)
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="CAT 777G (manual)"
              className="mt-1.5 w-full px-3 py-2.5 rounded-lg bg-[#1a1c25] border border-[#262835] text-sm text-white"
            />
          </label>
          <button
            type="submit"
            className="w-full py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add to dummy fleet
          </button>
        </form>
      </div>
    </div>
  )
}
