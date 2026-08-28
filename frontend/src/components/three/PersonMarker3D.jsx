import React, { useEffect, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html, useCursor } from '@react-three/drei'
import { quarryMarkerPosition, quarrySlope, sampleQuarryHeight } from '../../three/quarryTerrain'
import { clearCrewPose, crewTooClose, separateCrew } from '../../three/crewTraffic'
import { MODEL_SIZE, WORKER_GLB } from '../../three/modelCatalog'
import WorkerGltf from './WorkerGltf'

const MARGIN = 20

const SCATTER = [
  [24, 30],
  [40, 26],
  [58, 28],
  [74, 34],
  [26, 46],
  [48, 44],
  [70, 48],
  [32, 60],
  [54, 58],
  [76, 62],
  [28, 74],
  [46, 72],
  [64, 76],
  [52, 36]
]

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

function pickWalk(rng, x, y, id) {
  let best = { x: clampPad(x), y: clampPad(y) }
  for (let i = 0; i < 12; i += 1) {
    const dist = 8 + rng() * 16
    const ang = rng() * Math.PI * 2
    const candidate = {
      x: clampPad(x + Math.cos(ang) * dist),
      y: clampPad(y + Math.sin(ang) * dist)
    }
    if (!crewTooClose(id, candidate.x, candidate.y, 8)) return candidate
    best = candidate
  }
  return best
}

export default function PersonMarker3D({ person, selected, onSelect, slot = 0 }) {
  const size = MODEL_SIZE.worker
  const groupRef = useRef()
  const driveRef = useRef(null)
  if (!driveRef.current) {
    const rng = seedRng(person.id)
    const home = SCATTER[slot % SCATTER.length]
    const x = clampPad(home[0] + (rng() - 0.5) * 6)
    const y = clampPad(home[1] + (rng() - 0.5) * 6)
    const walking = rng() > 0.4
    const next = pickWalk(rng, x, y, person.id)
    driveRef.current = {
      rng,
      x,
      y,
      tx: walking ? next.x : x,
      ty: walking ? next.y : y,
      yaw: null,
      mode: walking ? 'walk' : 'check',
      timer: rng() * 1.2,
      walkFor: 4 + rng() * 3,
      checkFor: 3 + rng() * 2.2
    }
  }

  const [hovered, setHovered] = useState(false)
  const [clip, setClip] = useState(driveRef.current.mode === 'walk' ? 'walk' : 'check')
  useCursor(hovered)

  useEffect(() => () => clearCrewPose(person.id), [person.id])

  useFrame((_, dt) => {
    const g = groupRef.current
    const drive = driveRef.current
    if (!g || !drive) return
    const clampedDt = Math.min(dt, 0.05)
    drive.timer += clampedDt

    if (drive.mode === 'check') {
      if (drive.timer >= drive.checkFor) {
        const next = pickWalk(drive.rng, drive.x, drive.y, person.id)
        drive.mode = 'walk'
        drive.timer = 0
        drive.walkFor = 4 + drive.rng() * 3
        drive.tx = next.x
        drive.ty = next.y
        setClip('walk')
      }
    } else {
      const dx = drive.tx - drive.x
      const dy = drive.ty - drive.y
      const dist = Math.hypot(dx, dy)
      const step = 0.55 * clampedDt
      if (dist > 1e-3 && dist > step) {
        drive.x += (dx / dist) * step
        drive.y += (dy / dist) * step
      } else {
        drive.x = drive.tx
        drive.y = drive.ty
      }
      if (drive.timer >= drive.walkFor || dist <= step) {
        drive.mode = 'check'
        drive.timer = 0
        drive.checkFor = 3 + drive.rng() * 2.2
        setClip('check')
      }
    }

    let [wx, , wz] = quarryMarkerPosition(drive.x, drive.y, 0)
    ;[wx, wz] = separateCrew(person.id, wx, wz, 0.22, drive.x, drive.y)
    const wy = sampleQuarryHeight(wx, wz)
    g.position.set(wx, wy, wz)

    const look = quarryMarkerPosition(drive.tx, drive.ty, 0)
    const lx = look[0] - wx
    const lz = look[2] - wz
    if (Math.hypot(lx, lz) > 1e-4) {
      const yaw = Math.atan2(lx, lz)
      if (drive.yaw == null) {
        // Snap on the first frame; lerping in from a random angle made everyone
        // visibly spin for the first few seconds after load.
        drive.yaw = yaw
      } else if (drive.mode === 'walk') {
        let diff = yaw - drive.yaw
        while (diff > Math.PI) diff -= Math.PI * 2
        while (diff < -Math.PI) diff += Math.PI * 2
        drive.yaw += diff * (1 - Math.exp(-clampedDt * 3.2))
      }
    }
    if (drive.yaw == null) drive.yaw = 0

    const slope = quarrySlope(wx, wz, 0.05, drive.yaw)
    g.rotation.order = 'YXZ'
    g.rotation.y = drive.yaw
    g.rotation.x = slope.pitch * 0.35
    g.rotation.z = slope.roll * 0.35
  })

  return (
    <group
      ref={groupRef}
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
      <WorkerGltf url={WORKER_GLB} size={size} selected={selected} clip={clip} />
      {selected && (
        <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.16, 0.2, 24]} />
          <meshBasicMaterial color="#38bdf8" transparent opacity={0.85} />
        </mesh>
      )}
      {selected && (
        <Html position={[0, 0.32, 0]} center zIndexRange={[10, 0]}>
          <div className="w-32 p-2 rounded-lg bg-[#282b36] text-slate-200 shadow-xl border border-cyan-400/30 font-sans pointer-events-auto select-text">
            <div className="font-bold text-[10px] text-white tracking-tight leading-tight truncate">{person.name}</div>
            <div className="mt-0.5 space-y-0.5 text-[9px] leading-snug text-slate-300 font-medium">
              <div className="truncate">
                {person.age}, {person.role}
              </div>
              <div>Clearance L{person.clearanceLevel}</div>
              <div className="truncate">{person.assignedMachineId ? `Machine ${person.assignedMachineId}` : person.zone}</div>
            </div>
          </div>
        </Html>
      )}
    </group>
  )
}
