import React, { useState } from 'react'
import { X, Plus } from 'lucide-react'
import { useMineData } from '../../context/useMineData'

export default function AddPersonModal({ isOpen, onClose }) {
  const { addPerson, mine } = useMineData()
  const [name, setName] = useState('')
  const [role, setRole] = useState('Machine Operator')
  const [age, setAge] = useState('30')
  const [clearanceLevel, setClearanceLevel] = useState('2')
  const [assignedMachineId, setAssignedMachineId] = useState('')

  if (!isOpen) return null

  const handleSubmit = e => {
    e.preventDefault()
    addPerson({
      name,
      role,
      age,
      clearanceLevel,
      assignedMachineId: assignedMachineId || null,
      roleGroup: role === 'Safety Supervisor' ? 'safety' : role.includes('Geolog') || role.includes('Engineer') ? 'geologists' : 'operators'
    })
    setName('')
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-[#14161e] border border-[#2a2d3c] rounded-2xl shadow-2xl text-slate-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#232635]">
          <h3 className="font-bold text-white text-base">Add Person</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400">
            <X className="w-4 h-4" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-3">
          <input
            required
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Full name"
            className="w-full px-3 py-2.5 rounded-lg bg-[#1a1c25] border border-[#262835] text-sm text-white"
          />
          <div className="grid grid-cols-2 gap-2">
            <input
              value={age}
              onChange={e => setAge(e.target.value)}
              placeholder="Age"
              className="px-3 py-2.5 rounded-lg bg-[#1a1c25] border border-[#262835] text-sm text-white"
            />
            <select
              value={clearanceLevel}
              onChange={e => setClearanceLevel(e.target.value)}
              className="px-3 py-2.5 rounded-lg bg-[#1a1c25] border border-[#262835] text-sm text-white"
            >
              {[1, 2, 3, 4].map(n => (
                <option key={n} value={n}>
                  Clearance {n}
                </option>
              ))}
            </select>
          </div>
          <select
            value={role}
            onChange={e => setRole(e.target.value)}
            className="w-full px-3 py-2.5 rounded-lg bg-[#1a1c25] border border-[#262835] text-sm text-white"
          >
            {['Machine Operator', 'Geologist', 'Mining Engineer', 'Safety Supervisor', 'Plant Operator'].map(r => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
          <select
            value={assignedMachineId}
            onChange={e => setAssignedMachineId(e.target.value)}
            className="w-full px-3 py-2.5 rounded-lg bg-[#1a1c25] border border-[#262835] text-sm text-white"
          >
            <option value="">No machine assignment</option>
            {mine.machines.slice(0, 40).map(m => (
              <option key={m.id} value={m.id}>
                {m.id} · {m.name}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="w-full py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add to dummy roster
          </button>
        </form>
      </div>
    </div>
  )
}
