import React, { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { LatheGeometry, Vector2 } from 'three'
import { buildPitLevels, elevationToY, PIT_GROUND_RADIUS, PIT_RADIUS } from '../../three/pitProfile'
import { QuarryWallMaterial } from './QuarryWallMaterial'

function buildGeometry() {
  const levels = buildPitLevels()
  const points = [new Vector2(PIT_GROUND_RADIUS, 0.04)]

  levels.forEach((level, i) => {
    const y = elevationToY(level.elevation)
    const next = levels[i + 1]
    points.push(new Vector2(level.radius, y))
    if (next) points.push(new Vector2(next.radius, y))
  })
  points.push(new Vector2(0, points[points.length - 1].y))

  const geometry = new LatheGeometry(points, 96)
  const position = geometry.attributes.position
  const levelYs = levels.map(l => elevationToY(l.elevation))
  for (let i = 0; i < position.count; i += 1) {
    const x = position.getX(i)
    const y = position.getY(i)
    const z = position.getZ(i)
    const r = Math.hypot(x, z)
    const onBench = levelYs.some(ly => Math.abs(y - ly) < 0.018)
    const wallNoise = Math.sin(x * 9.2 + z * 7.1) * Math.cos(r * 4.4) * 0.045
    if (!onBench && r < PIT_RADIUS - 0.05) position.setY(i, y + wallNoise)
  }
  geometry.computeVertexNormals()
  return { geometry, levels }
}

function ScanPulse() {
  const ref = useRef()
  useFrame(state => {
    if (!ref.current) return
    const t = (state.clock.elapsedTime * 0.28) % 1
    const r = 0.35 + t * (PIT_GROUND_RADIUS + 0.4)
    ref.current.scale.setScalar(r)
    ref.current.material.opacity = 0.22 * (1 - t)
    ref.current.position.y = -0.05 + t * 0.12
  })
  return (
    <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[0.9, 1.02, 80]} />
      <meshBasicMaterial color="#d6c4a8" transparent opacity={0.2} depthWrite={false} />
    </mesh>
  )
}

export default function PitTerrain3D() {
  const { geometry, levels } = useMemo(() => buildGeometry(), [])
  const rimY = elevationToY(levels[0].elevation)

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, rimY - 0.04, 0]} receiveShadow>
        <circleGeometry args={[PIT_GROUND_RADIUS + 4.2, 80]} />
        <QuarryWallMaterial repeatX={14} repeatY={14} />
      </mesh>
      <mesh geometry={geometry} receiveShadow>
        <QuarryWallMaterial repeatX={12} repeatY={7} />
      </mesh>
      <ScanPulse />
    </group>
  )
}
