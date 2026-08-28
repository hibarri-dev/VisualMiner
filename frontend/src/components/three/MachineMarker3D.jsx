import React, { useEffect, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html, useCursor } from '@react-three/drei'
import { MACHINE_TYPES } from '../../data/machines'
import { quarryMarkerPosition, quarrySlope, sampleQuarryHeight } from '../../three/quarryTerrain'
import { clearFleetPose, mapTooClose, separateFleet } from '../../three/fleetTraffic'
import { MACHINE_GLB, MODEL_SIZE } from '../../three/modelCatalog'
import FittedGltf from './FittedGltf'
import MachineModel from './MachineModel'

const MARGIN = 20

function clampPad(v) {
  return Math.min(100 - MARGIN, Math.max(MARGIN, v))
}

function seedRng(id) {
  let h = 2166136261
  for (let i = 0; i < id.length; i += 1) h = Math.imul(h ^ id.charCodeAt(i), 16777619)
  return () => {
    h ^= h << 13
    h ^= h >>> 17
    h ^= h << 5
    return ((h >>> 0) % 10000) / 10000
  }
}

function driveSpeed(type) {
  const spec = MACHINE_TYPES[type]
  if (spec?.path === 'haul') return 1.15
  if (spec?.path === 'rim') return 0.72
  return 0.85
}

function workLabel(type) {
  const spec = MACHINE_TYPES[type]
  if (spec?.path === 'haul') return type.includes('water') ? 'Watering' : type.includes('fuel') ? 'Refueling' : 'Dumping'
  if (spec?.path === 'rim') return 'Drilling'
  if (type === 'dozer' || type === 'grader') return 'Pushing'
  if (type === 'front_loader') return 'Loading'
  return 'Digging'
}

function driveLabel(type) {
  const spec = MACHINE_TYPES[type]
  if (spec?.path === 'rim') return 'Relocating'
  if (type === 'dozer' || type === 'grader') return 'Pushing'
  if (spec?.path === 'bench') return 'Relocating'
  return 'Hauling'
}

const SCATTER = [
  [24, 28],
  [50, 24],
  [76, 30],
  [22, 50],
  [78, 52],
  [26, 72],
  [50, 76],
  [74, 70],
  [50, 50]
]

function pickInside(rng, x, y, id) {
  let best = { x: clampPad(x), y: clampPad(y) }
  for (let i = 0; i < 14; i += 1) {
    const dist = 14 + rng() * 32
    const ang = rng() * Math.PI * 2
    const candidate = {
      x: clampPad(x + Math.cos(ang) * dist),
      y: clampPad(y + Math.sin(ang) * dist)
    }
    if (!mapTooClose(id, candidate.x, candidate.y, 18)) return candidate
    best = candidate
  }
  return best
}

export default function MachineMarker3D({ machine, selected, operator, onSelect, slot = 0 }) {
  const spec = MACHINE_TYPES[machine.type]
  const size = MODEL_SIZE[machine.type] || 0.8
  const radius = Math.max(size * 0.9, 0.55)

  const groupRef = useRef()
  const driveRef = useRef(null)
  if (!driveRef.current) {
    const rng = seedRng(machine.id)
    const home = SCATTER[slot % SCATTER.length]
    const x = clampPad(home[0] + (rng() - 0.5) * 8)
    const y = clampPad(home[1] + (rng() - 0.5) * 8)
    const startWork = rng() > 0.45
    const next = pickInside(rng, x, y, machine.id)
    driveRef.current = {
      rng,
      x,
      y,
      tx: startWork ? x : next.x,
      ty: startWork ? y : next.y,
      yaw: rng() * Math.PI * 2,
      mode: startWork ? 'work' : 'drive',
      timer: rng() * 1.4,
      driveFor: 3 + rng() * 2,
      workFor: 3 + rng() * 1.2,
      status: startWork ? workLabel(machine.type) : driveLabel(machine.type)
    }
  }

  const [hovered, setHovered] = useState(false)
  const [localStatus, setLocalStatus] = useState(driveRef.current.status)
  useCursor(hovered)

  useEffect(() => () => clearFleetPose(machine.id), [machine.id])

  useFrame((state, dt) => {
    const g = groupRef.current
    const drive = driveRef.current
    if (!g || !drive) return
    const clampedDt = Math.min(dt, 0.05)
    const broken = machine.status === 'Breakdown' || machine.status === 'Maintenance'
    drive.timer += clampedDt

    if (!broken) {
      if (drive.mode === 'work') {
        if (spec?.path === 'bench') {
          drive.yaw += Math.sin(state.clock.elapsedTime * 1.15 + drive.workFor) * 0.006
        }
        if (drive.timer >= drive.workFor) {
          const next = pickInside(drive.rng, drive.x, drive.y, machine.id)
          drive.mode = 'drive'
          drive.timer = 0
          drive.driveFor = 3 + drive.rng() * 2
          drive.tx = next.x
          drive.ty = next.y
          drive.status = driveLabel(machine.type)
          setLocalStatus(drive.status)
        }
      } else {
        const dx = drive.tx - drive.x
        const dy = drive.ty - drive.y
        const dist = Math.hypot(dx, dy)
        const step = driveSpeed(machine.type) * clampedDt
        if (dist > 1e-3 && dist > step) {
          drive.x += (dx / dist) * step
          drive.y += (dy / dist) * step
        } else {
          drive.x = drive.tx
          drive.y = drive.ty
        }
        if (drive.timer >= drive.driveFor || dist <= step) {
          drive.mode = 'work'
          drive.timer = 0
          drive.workFor = 3 + drive.rng() * 1.2
          drive.status = workLabel(machine.type)
          setLocalStatus(drive.status)
        }
      }
    }

    let [wx, , wz] = quarryMarkerPosition(drive.x, drive.y, 0)
    ;[wx, wz] = separateFleet(machine.id, wx, wz, radius, drive.x, drive.y)
    const wy = sampleQuarryHeight(wx, wz) + 0.002
    g.position.set(wx, wy, wz)

    if (drive.mode === 'drive' && !broken) {
      const look = quarryMarkerPosition(drive.tx, drive.ty, 0)
      const lx = look[0] - wx
      const lz = look[2] - wz
      if (Math.hypot(lx, lz) > 1e-4) {
        const yaw = Math.atan2(lx, lz)
        let diff = yaw - drive.yaw
        while (diff > Math.PI) diff -= Math.PI * 2
        while (diff < -Math.PI) diff += Math.PI * 2
        drive.yaw += diff * (1 - Math.exp(-clampedDt * 2.4))
      }
    }

    const slope = quarrySlope(wx, wz, size * 0.38)
    g.rotation.order = 'YXZ'
    g.rotation.y = drive.yaw
    g.rotation.x = slope.pitch
    g.rotation.z = slope.roll
  })

  const payloadPercent = machine.payloadCapacityKg ? (machine.payloadKg / machine.payloadCapacityKg) * 100 : 0
  const glb = MACHINE_GLB[machine.type]
  const broken = machine.status === 'Breakdown' || machine.status === 'Maintenance'
  const shownStatus = broken ? machine.status : localStatus

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
        <MachineModel type={machine.type} status={shownStatus} payloadPercent={payloadPercent} selected={selected} />
      )}
      {selected && (
        <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.28, 0.34, 40]} />
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
                      shownStatus === 'Breakdown'
                        ? '#ef4444'
                        : shownStatus === 'Dumping' || shownStatus === 'Loading' || shownStatus === 'Digging'
                          ? '#f59e0b'
                          : '#22c55e'
                  }}
                />
                {shownStatus}
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
