import React from 'react'
import { Truck, Wrench, Activity } from 'lucide-react'
import { useVisibleMine } from '../../context/useMineData'
import { personForMachine } from '../../data'
import StatusBadge from '../dashboard/StatusBadge'

function MachineMarker({ machine, selected, operator, onSelect }) {
  return (
    <div
      className="absolute flex flex-col items-center z-10"
      style={{ left: `${machine.x}%`, top: `${machine.y}%`, transform: 'translate(-50%, -50%)' }}
    >
      {selected && (
        <div className="mb-2 w-48 p-3.5 rounded-2xl bg-white text-slate-900 shadow-2xl border border-white/80 font-sans pointer-events-auto select-text">
          <div className="font-bold text-[14px] text-slate-900 tracking-tight">{machine.id}</div>
          <div className="mt-1 space-y-0.5 text-[12px] text-slate-600 font-medium">
            <div>Fuel Tank: {Math.round(machine.fuelPercent)}%</div>
            <div>Payload: {machine.payloadKg}kg</div>
            <div>{machine.status}</div>
            {operator && <div className="text-slate-400 font-normal">{operator.name}</div>}
          </div>
        </div>
      )}
      {selected && <div className="w-[1.5px] h-7 bg-white" />}
      {selected && <div className="w-2 h-2 rounded-full bg-white ring-2 ring-white/50" />}
      <button
        type="button"
        onClick={() => onSelect(machine.id)}
        className={`mt-1 rounded-md bg-[#f59e0b] border-2 border-[#fbbf24] shadow-xl flex items-center justify-center cursor-pointer ${
          selected ? 'w-14 h-10' : 'w-8 h-6 opacity-90 hover:opacity-100'
        }`}
      >
        {machine.type === 'excavator' ? (
          <Wrench className={selected ? 'w-6 h-6 text-[#78350f]' : 'w-3.5 h-3.5 text-[#78350f]'} />
        ) : machine.type === 'drill' ? (
          <Activity className={selected ? 'w-6 h-6 text-[#78350f]' : 'w-3.5 h-3.5 text-[#78350f]'} />
        ) : (
          <Truck className={selected ? 'w-7 h-7 text-[#78350f] fill-[#fde68a]' : 'w-4 h-4 text-[#78350f] fill-[#fde68a]'} />
        )}
      </button>
    </div>
  )
}

function PersonMarker({ person, selected, onSelect }) {
  return (
    <div
      className="absolute flex flex-col items-center z-10"
      style={{ left: `${person.x}%`, top: `${person.y}%`, transform: 'translate(-50%, -50%)' }}
    >
      {selected && (
        <div className="mb-2 w-52 p-3.5 rounded-2xl bg-[#282b36] text-slate-200 shadow-2xl border border-[#3b4050] font-sans pointer-events-auto select-text">
          <div className="font-bold text-[14px] text-white tracking-tight">{person.name}</div>
          <div className="mt-1 space-y-0.5 text-[12px] text-slate-300 font-medium">
            <div>
              {person.age}, {person.role}
            </div>
            <div>Clearance Level {person.clearanceLevel}</div>
            <div>{person.assignedMachineId ? `Machine ${person.assignedMachineId}` : person.zone}</div>
          </div>
        </div>
      )}
      {selected && <div className="w-[1.5px] h-7 bg-white" />}
      {selected && <div className="w-2 h-2 rounded-full bg-white ring-2 ring-white/50" />}
      <button type="button" onClick={() => onSelect(person.id)} className="mt-1 relative flex flex-col items-center cursor-pointer">
        <div className={`rounded-full bg-amber-400 border border-red-500 shadow-lg shadow-amber-400/80 ${selected ? 'w-4 h-4' : 'w-3 h-3'}`} />
        <div
          className={`rounded-t-lg bg-gradient-to-b from-amber-400 via-cyan-400 to-blue-600 border border-cyan-300 ${
            selected ? 'w-6 h-9' : 'w-4 h-7 opacity-90'
          }`}
        />
      </button>
    </div>
  )
}

function PitTerrain() {
  return (
    <svg className="w-full h-full object-cover" preserveAspectRatio="none" viewBox="0 0 900 450">
      <defs>
        <radialGradient id="pitDepression" cx="52%" cy="48%" r="48%">
          <stop offset="0%" stopColor="#040b3c" />
          <stop offset="18%" stopColor="#03309a" />
          <stop offset="35%" stopColor="#0284c7" />
          <stop offset="48%" stopColor="#059669" />
          <stop offset="62%" stopColor="#eab308" />
          <stop offset="78%" stopColor="#ea580c" />
          <stop offset="92%" stopColor="#991b1b" />
          <stop offset="100%" stopColor="#451a03" />
        </radialGradient>
        <linearGradient id="rockTexture" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#78350f" stopOpacity="0.8" />
          <stop offset="50%" stopColor="#b45309" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#451a03" stopOpacity="0.9" />
        </linearGradient>
      </defs>
      <rect width="900" height="450" fill="url(#rockTexture)" />
      <ellipse cx="468" cy="216" rx="420" ry="195" fill="url(#pitDepression)" />
      <ellipse cx="468" cy="216" rx="370" ry="170" fill="none" stroke="#ea580c" strokeWidth="2.5" opacity="0.85" />
      <ellipse cx="468" cy="216" rx="310" ry="142" fill="none" stroke="#eab308" strokeWidth="2.5" opacity="0.9" />
      <ellipse cx="468" cy="216" rx="250" ry="114" fill="none" stroke="#10b981" strokeWidth="2.5" opacity="0.9" />
      <ellipse cx="468" cy="216" rx="190" ry="86" fill="none" stroke="#06b6d4" strokeWidth="2.5" opacity="0.95" />
      <ellipse cx="468" cy="216" rx="130" ry="58" fill="none" stroke="#3b82f6" strokeWidth="2.5" opacity="0.95" />
      <ellipse cx="468" cy="216" rx="70" ry="32" fill="#020826" stroke="#1e40af" strokeWidth="2" opacity="1" />
      <path d="M 120 120 Q 300 240 470 216 T 820 310" fill="none" stroke="#fbbf24" strokeWidth="4" strokeDasharray="8 6" opacity="0.85" />
    </svg>
  )
}

function RidgeTerrain() {
  return (
    <svg className="w-full h-full object-cover" preserveAspectRatio="none" viewBox="0 0 900 380">
      <defs>
        <linearGradient id="elevationGrad" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#047857" />
          <stop offset="35%" stopColor="#10b981" />
          <stop offset="65%" stopColor="#06b6d4" />
          <stop offset="85%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>
      </defs>
      <path d="M 0 380 L 0 220 Q 200 90 450 180 T 900 120 L 900 380 Z" fill="url(#elevationGrad)" opacity="0.3" />
      <path d="M 0 280 Q 220 140 450 220 T 900 160" fill="none" stroke="#10b981" strokeWidth="2" strokeDasharray="3 3" />
      <path d="M 0 240 Q 240 100 480 180 T 900 110" fill="none" stroke="#06b6d4" strokeWidth="2" strokeDasharray="3 3" />
      <path d="M 0 200 Q 260 70 510 140 T 900 70" fill="none" stroke="#3b82f6" strokeWidth="2" strokeDasharray="3 3" />
      <path d="M 0 160 Q 280 40 540 100 T 900 30" fill="none" stroke="#8b5cf6" strokeWidth="2" strokeDasharray="3 3" />
      {Array.from({ length: 18 }).map((_, i) => (
        <line
          key={i}
          x1={i * 50}
          y1="380"
          x2={i * 50 + 20}
          y2={120 + Math.sin(i) * 60}
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="1"
        />
      ))}
    </svg>
  )
}

export default function MapsView({ currentRole }) {
  const {
    mine,
    selectedMachineId,
    selectedPersonId,
    setSelectedMachineId,
    setSelectedPersonId
  } = useVisibleMine(currentRole)

  const mapMachines = mine.machines.filter(m => m.onMap)
  const mapPeople = mine.personnel.filter(p => p.onMap)

  return (
    <div className="flex-1 flex flex-col gap-4 p-5 overflow-y-auto bg-[#0d0e12]">
      <div className="relative flex-1 min-h-[320px] rounded-2xl overflow-hidden bg-[#16171d] border border-[#232634] shadow-xl select-none">
        <div className="absolute left-4 top-3 z-20 flex items-center gap-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Machine monitoring</span>
          <StatusBadge value={`${mapMachines.length} on pit`} />
        </div>
        <div className="absolute inset-0">
          <PitTerrain />
        </div>
        {mapMachines.map(machine => (
          <MachineMarker
            key={machine.id}
            machine={machine}
            selected={machine.id === selectedMachineId}
            operator={personForMachine(mine.personnel, machine.id)}
            onSelect={setSelectedMachineId}
          />
        ))}
      </div>

      <div className="relative flex-1 min-h-[300px] rounded-2xl overflow-hidden bg-[#16171d] border border-[#232634] shadow-xl select-none">
        <div className="absolute left-4 top-3 z-20 flex items-center gap-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Personnel monitoring</span>
          <StatusBadge value={`${mapPeople.length} tagged`} />
        </div>
        <div className="absolute inset-0">
          <RidgeTerrain />
        </div>
        {mapPeople.map(person => (
          <PersonMarker
            key={person.id}
            person={person}
            selected={person.id === selectedPersonId}
            onSelect={setSelectedPersonId}
          />
        ))}
      </div>
    </div>
  )
}
