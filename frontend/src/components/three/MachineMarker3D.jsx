import React, { useMemo, useState } from 'react'
import { Html, useCursor } from '@react-three/drei'
import { MACHINE_TYPES } from '../../data'
import { buildPitLevels, pitMarkerPosition } from '../../three/pitProfile'
import MachineModel from './MachineModel'

export default function MachineMarker3D({ machine, selected, operator, onSelect }) {
  const levels = useMemo(() => buildPitLevels(), [])
  const position = useMemo(
    () => pitMarkerPosition(machine.x, machine.y, machine.bench, levels),
    [machine.x, machine.y, machine.bench, levels]
  )
  const [hovered, setHovered] = useState(false)
  useCursor(hovered)

  const payloadPercent = machine.payloadCapacityKg ? (machine.payloadKg / machine.payloadCapacityKg) * 100 : 0

  return (
    <group
      position={position}
      onClick={e => {
        e.stopPropagation()
        onSelect(machine.id)
      }}
      onPointerOver={e => {
        e.stopPropagation()
        setHovered(true)
      }}
      onPointerOut={() => setHovered(false)}
    >
      <MachineModel type={machine.type} status={machine.status} payloadPercent={payloadPercent} selected={selected} />
      {selected && (
        <Html position={[0, 0.58, 0]} center zIndexRange={[10, 0]} distanceFactor={9}>
          <div className="w-52 p-3.5 rounded-2xl bg-white text-slate-900 shadow-2xl border border-white/80 font-sans pointer-events-auto select-text">
            <div className="font-bold text-[14px] text-slate-900 tracking-tight">{machine.id}</div>
            <div className="mt-1 space-y-0.5 text-[12px] text-slate-600 font-medium">
              <div>{MACHINE_TYPES[machine.type]?.label || machine.type}</div>
              <div>Fuel Tank: {Math.round(machine.fuelPercent)}%</div>
              <div>Payload: {machine.payloadKg}kg</div>
              <div>{machine.status}</div>
              {machine.trackerId && <div className="text-slate-400 font-mono text-[11px]">{machine.trackerId}</div>}
              {operator && <div className="text-slate-400 font-normal">{operator.name}</div>}
            </div>
          </div>
        </Html>
      )}
    </group>
  )
}
