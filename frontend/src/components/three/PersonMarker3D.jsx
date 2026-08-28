import React, { useMemo, useState } from 'react'
import { Html, useCursor } from '@react-three/drei'
import { buildPitLevels, elevationForBenchName, pitWorldPosition } from '../../three/pitProfile'
import { geoMarkerPosition, SCAN_RELIEF } from '../../three/geoTerrain'
import { MODEL_SIZE, WORKER_GLB } from '../../three/modelCatalog'
import ThermalGltf from './ThermalGltf'

export default function PersonMarker3D({ person, selected, onSelect, scan = false }) {
  const levels = useMemo(() => buildPitLevels(), [])
  const elevation = elevationForBenchName(person.zone)
  const position = useMemo(() => {
    if (scan) return geoMarkerPosition(person.x, person.y, SCAN_RELIEF)
    return pitWorldPosition(person.x, person.y, elevation, levels, -0.16)
  }, [scan, person.x, person.y, elevation, levels])
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
      <ThermalGltf url={WORKER_GLB} size={MODEL_SIZE.worker * 1.35} selected={selected} />
      {selected && (
        <Html position={[0, 0.52, 0]} center zIndexRange={[10, 0]} distanceFactor={9}>
          <div className="w-52 p-3.5 rounded-2xl bg-[#282b36] text-slate-200 shadow-2xl border border-cyan-400/30 font-sans pointer-events-auto select-text">
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
