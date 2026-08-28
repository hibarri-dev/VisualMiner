import React, { useMemo, useState } from 'react'
import { Html, useCursor } from '@react-three/drei'
import { RIDGE_HALF, ridgeHeight } from './RidgeTerrain3D'
import PersonModel from './PersonModel'

function ridgeMarkerPosition(x, y) {
  const nx = (x - 50) / 50
  const nz = (y - 50) / 50
  const worldX = nx * RIDGE_HALF
  const worldZ = nz * RIDGE_HALF
  return [worldX, ridgeHeight(worldX, worldZ), worldZ]
}

export default function PersonMarker3D({ person, selected, onSelect }) {
  const position = useMemo(() => ridgeMarkerPosition(person.x, person.y), [person.x, person.y])
  const [hovered, setHovered] = useState(false)
  useCursor(hovered)

  return (
    <group
      position={position}
      onClick={e => {
        e.stopPropagation()
        onSelect(person.id)
      }}
      onPointerOver={e => {
        e.stopPropagation()
        setHovered(true)
      }}
      onPointerOut={() => setHovered(false)}
    >
      <PersonModel roleGroup={person.roleGroup} selected={selected} />
      {selected && (
        <Html position={[0, 0.4, 0]} center zIndexRange={[10, 0]} distanceFactor={9}>
          <div className="w-52 p-3.5 rounded-2xl bg-[#282b36] text-slate-200 shadow-2xl border border-[#3b4050] font-sans pointer-events-auto select-text">
            <div className="font-bold text-[14px] text-white tracking-tight">{person.name}</div>
            <div className="mt-1 space-y-0.5 text-[12px] text-slate-300 font-medium">
              <div>
                {person.age}, {person.role}
              </div>
              <div>Clearance Level {person.clearanceLevel}</div>
              <div>{person.assignedMachineId ? `Machine ${person.assignedMachineId}` : person.zone}</div>
            </div>
          </div>
        </Html>
      )}
    </group>
  )
}
