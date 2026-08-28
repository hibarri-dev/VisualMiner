import React, { useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html, useCursor } from '@react-three/drei'
import { MACHINE_TYPES, TRACK_PATHS } from '../../data/machines'
import { buildPitLevels, elevationForBenchName, headingY, pitWorldPosition } from '../../three/pitProfile'
import { MACHINE_GLB, MODEL_SIZE } from '../../three/modelCatalog'
import FittedGltf from './FittedGltf'
import MachineModel from './MachineModel'

export default function MachineMarker3D({ machine, selected, operator, onSelect }) {
  const levels = useMemo(() => buildPitLevels(), [])
  const elevation = machine.elevation ?? elevationForBenchName(machine.bench)
  const targetPos = useMemo(
    () => pitWorldPosition(machine.x, machine.y, elevation, levels, -0.2),
    [machine.x, machine.y, elevation, levels]
  )

  const spec = MACHINE_TYPES[machine.type]
  const path = TRACK_PATHS[spec?.path || 'bench']
  const waypoint = path[(machine.waypointIndex ?? 0) % path.length]
  const lookTarget = useMemo(
    () => pitWorldPosition(waypoint.x, waypoint.y, waypoint.elevation ?? elevation, levels, -0.2),
    [waypoint.x, waypoint.y, waypoint.elevation, elevation, levels]
  )

  const groupRef = useRef()
  const yawRef = useRef(null)
  const placedRef = useRef(false)
  const [hovered, setHovered] = useState(false)
  useCursor(hovered)

  useLayoutEffect(() => {
    if (!groupRef.current || placedRef.current) return
    groupRef.current.position.set(targetPos[0], targetPos[1], targetPos[2])
    placedRef.current = true
  }, [targetPos])

  useFrame((_, dt) => {
    const g = groupRef.current
    if (!g) return
    const k = 1 - Math.exp(-dt * 3.4)
    g.position.x += (targetPos[0] - g.position.x) * k
    g.position.y += (targetPos[1] - g.position.y) * k
    g.position.z += (targetPos[2] - g.position.z) * k

    const yaw = headingY([g.position.x, g.position.y, g.position.z], lookTarget)
    if (yaw == null) return
    if (yawRef.current == null) {
      yawRef.current = yaw
    } else {
      let diff = yaw - yawRef.current
      while (diff > Math.PI) diff -= Math.PI * 2
      while (diff < -Math.PI) diff += Math.PI * 2
      yawRef.current += diff * (1 - Math.exp(-dt * 4.2))
    }
    g.rotation.y = yawRef.current
  })

  const payloadPercent = machine.payloadCapacityKg ? (machine.payloadKg / machine.payloadCapacityKg) * 100 : 0
  const glb = MACHINE_GLB[machine.type]
  const size = MODEL_SIZE[machine.type] || 0.8

  return (
    <group
      ref={groupRef}
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
      {glb ? (
        <FittedGltf url={glb} size={size} selected={selected} />
      ) : (
        <MachineModel type={machine.type} status={machine.status} payloadPercent={payloadPercent} selected={selected} />
      )}
      {selected && (
        <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.42, 0.5, 40]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.85} />
        </mesh>
      )}
      {selected && (
        <Html position={[0, 0.95, 0]} center zIndexRange={[10, 0]} distanceFactor={9}>
          <div className="w-52 p-3.5 rounded-2xl bg-[#282b36] text-slate-200 shadow-2xl border border-[#3b4050] font-sans pointer-events-auto select-text">
            <div className="font-bold text-[14px] text-white tracking-tight">{machine.id}</div>
            <div className="mt-1 space-y-0.5 text-[12px] text-slate-300 font-medium">
              <div>{machine.name || spec?.label || machine.type}</div>
              <div>Fuel Tank: {Math.round(machine.fuelPercent)}%</div>
              <div>Payload: {machine.payloadKg}kg</div>
              <div className="flex items-center gap-1.5">
                <span
                  className="inline-block w-1.5 h-1.5 rounded-full"
                  style={{
                    background:
                      machine.status === 'Breakdown'
                        ? '#ef4444'
                        : machine.status === 'Dumping'
                          ? '#f59e0b'
                          : '#22c55e'
                  }}
                />
                {machine.status}
              </div>
              {machine.trackerId && <div className="text-slate-500 font-mono text-[11px]">{machine.trackerId}</div>}
              {operator && <div className="text-slate-500 font-normal">{operator.name}</div>}
            </div>
          </div>
        </Html>
      )}
    </group>
  )
}
