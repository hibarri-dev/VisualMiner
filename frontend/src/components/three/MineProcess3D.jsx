import React, { useLayoutEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { Html } from '@react-three/drei'
import {
  buildPitLevels,
  elevationToY,
  pitWorldPosition,
  radiusForElevation,
  PIT_RADIUS
} from '../../three/pitProfile'

function rampPoint(t, levels) {
  const elev = 900 - Math.sin(t * Math.PI) * 145
  const angle = t * Math.PI * 2 * 1.7 + 0.55
  const radius = radiusForElevation(elev, levels) + 0.1
  const y = elevationToY(elev) + 0.035
  return new THREE.Vector3(Math.cos(angle) * radius, y, Math.sin(angle) * radius)
}

function HaulRamp() {
  const count = 90
  const ref = useRef()
  const levels = useMemo(() => buildPitLevels(), [])

  useLayoutEffect(() => {
    if (!ref.current) return
    const dummy = new THREE.Object3D()
    for (let i = 0; i < count; i += 1) {
      const p0 = rampPoint(i / count, levels)
      const p1 = rampPoint((i + 1) / count, levels)
      dummy.position.set((p0.x + p1.x) / 2, (p0.y + p1.y) / 2, (p0.z + p1.z) / 2)
      dummy.lookAt(p1)
      dummy.rotateX(Math.PI / 2)
      dummy.scale.set(0.3, 1, p0.distanceTo(p1) * 1.08)
      dummy.updateMatrix()
      ref.current.setMatrixAt(i, dummy.matrix)
    }
    ref.current.instanceMatrix.needsUpdate = true
  }, [levels])

  return (
    <instancedMesh ref={ref} args={[null, null, count]}>
      <boxGeometry args={[1, 0.025, 1]} />
      <meshStandardMaterial color="#8a7a66" roughness={0.95} metalness={0.04} />
    </instancedMesh>
  )
}

function SiteLabel({ children, position }) {
  return (
    <Html position={position} center distanceFactor={16} zIndexRange={[8, 0]}>
      <div className="px-2 py-0.5 rounded-md bg-cyan-950/80 text-[8px] font-bold uppercase tracking-wider text-cyan-100 whitespace-nowrap pointer-events-none border border-cyan-400/30">
        {children}
      </div>
    </Html>
  )
}

function OrePile({ position, scale = 1, color = '#6b4423' }) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.12, 0]} castShadow>
        <coneGeometry args={[0.28, 0.24, 10]} />
        <meshStandardMaterial color={color} roughness={1} />
      </mesh>
      <mesh position={[0.12, 0.07, 0.08]}>
        <coneGeometry args={[0.16, 0.14, 8]} />
        <meshStandardMaterial color="#7a5230" roughness={1} />
      </mesh>
    </group>
  )
}

function CrusherPlant({ position, showLabels }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.02, 0]} receiveShadow>
        <boxGeometry args={[0.7, 0.04, 0.55]} />
        <meshStandardMaterial color="#52525b" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.28, 0]} castShadow>
        <boxGeometry args={[0.32, 0.36, 0.28]} />
        <meshStandardMaterial color="#3f3f46" roughness={0.55} metalness={0.35} />
      </mesh>
      <mesh position={[0, 0.52, 0]} rotation={[0, 0, Math.PI]} castShadow>
        <coneGeometry args={[0.2, 0.22, 4]} />
        <meshStandardMaterial color="#71717a" roughness={0.5} metalness={0.3} />
      </mesh>
      <mesh position={[0.28, 0.18, 0]} rotation={[0, 0, -0.45]} castShadow>
        <boxGeometry args={[0.42, 0.05, 0.1]} />
        <meshStandardMaterial color="#27272a" roughness={0.7} />
      </mesh>
      <mesh position={[0.48, 0.08, 0]}>
        <boxGeometry args={[0.12, 0.1, 0.12]} />
        <meshStandardMaterial color="#3f3f46" roughness={0.6} />
      </mesh>
      <mesh position={[0.08, 0.42, 0.16]}>
        <boxGeometry args={[0.06, 0.06, 0.06]} />
        <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={0.8} />
      </mesh>
      {[-1, 1].map(side => (
        <mesh key={side} position={[0.14 * side, 0.12, 0.14]}>
          <boxGeometry args={[0.04, 0.22, 0.04]} />
          <meshStandardMaterial color="#27272a" roughness={0.7} />
        </mesh>
      ))}
      {showLabels && <SiteLabel position={[0, 0.78, 0]}>Crusher X17 · offline</SiteLabel>}
    </group>
  )
}

function RomPad({ position, showLabels }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.015, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[0.55, 24]} />
        <meshStandardMaterial color="#3f3f46" roughness={0.95} />
      </mesh>
      <OrePile position={[0.08, 0, -0.06]} scale={1.15} />
      <OrePile position={[-0.18, 0, 0.12]} scale={0.7} color="#5c3b1e" />
      {showLabels && <SiteLabel position={[0, 0.48, 0]}>ROM Pad</SiteLabel>}
    </group>
  )
}

function LoadingFace({ position, showLabels }) {
  return (
    <group position={position}>
      <OrePile position={[0, 0, 0]} scale={0.85} color="#5a3a1c" />
      <mesh position={[0.2, 0.08, -0.12]} rotation={[0.4, 0.3, 0.1]}>
        <boxGeometry args={[0.16, 0.1, 0.12]} />
        <meshStandardMaterial color="#4a3318" roughness={1} />
      </mesh>
      {showLabels && <SiteLabel position={[0, 0.42, 0]}>Loading face</SiteLabel>}
    </group>
  )
}

export default function MineProcess3D({ showLabels = false }) {
  const levels = useMemo(() => buildPitLevels(), [])
  const rom = useMemo(() => {
    const [x, , z] = pitWorldPosition(72, 78, 920, levels)
    const len = Math.hypot(x, z) || 1
    const r = PIT_RADIUS + 0.85
    return [(x / len) * r, 0.02, (z / len) * r]
  }, [levels])
  const crusher = useMemo(() => {
    const [x, , z] = pitWorldPosition(84, 62, 920, levels)
    const len = Math.hypot(x, z) || 1
    const r = PIT_RADIUS + 1.55
    return [(x / len) * r, 0.02, (z / len) * r]
  }, [levels])
  const face = useMemo(() => pitWorldPosition(31, 24, 760, levels), [levels])

  return (
    <group>
      <HaulRamp />
      <RomPad position={rom} showLabels={showLabels} />
      <CrusherPlant position={crusher} showLabels={showLabels} />
      <LoadingFace position={[face[0], face[1], face[2]]} showLabels={showLabels} />
    </group>
  )
}
