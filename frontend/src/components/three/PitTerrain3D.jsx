import React, { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { LatheGeometry, Vector2 } from 'three'
import { buildPitLevels, elevationToY, depthColor, PIT_GROUND_RADIUS, PIT_RADIUS } from '../../three/pitProfile'

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

  const geometry = new LatheGeometry(points, 72)
  const position = geometry.attributes.position
  const minY = elevationToY(levels[levels.length - 1].elevation)
  const maxY = elevationToY(levels[0].elevation)
  const span = maxY - minY || 1
  const colors = new Float32Array(position.count * 3)

  for (let i = 0; i < position.count; i += 1) {
    const x = position.getX(i)
    const y = position.getY(i)
    const z = position.getZ(i)
    const r = Math.hypot(x, z)
    const wallNoise = Math.sin(x * 9.2 + z * 7.1) * Math.cos(r * 4.4) * 0.045
    if (r < PIT_RADIUS - 0.05) position.setY(i, y + wallNoise)
    const t = (position.getY(i) - minY) / span
    const c = depthColor(t)
    colors[i * 3] = c.r
    colors[i * 3 + 1] = c.g
    colors[i * 3 + 2] = c.b
  }
  geometry.computeVertexNormals()
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  return { geometry, levels, minY, maxY }
}

function ScanRings({ levels }) {
  return (
    <group>
      {levels.map((level, i) => (
        <mesh
          key={level.elevation}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, elevationToY(level.elevation) + 0.02, 0]}
        >
          <ringGeometry args={[Math.max(0.08, level.radius - 0.015), level.radius + 0.015, 72]} />
          <meshBasicMaterial color="#67e8f9" transparent opacity={0.28 - i * 0.02} depthWrite={false} />
        </mesh>
      ))}
    </group>
  )
}

function ScanPulse() {
  const ref = useRef()
  useFrame(state => {
    if (!ref.current) return
    const t = (state.clock.elapsedTime * 0.28) % 1
    const r = 0.35 + t * (PIT_GROUND_RADIUS + 0.4)
    ref.current.scale.setScalar(r)
    ref.current.material.opacity = 0.45 * (1 - t)
    ref.current.position.y = -0.05 + t * 0.12
  })
  return (
    <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[0.9, 1.02, 80]} />
      <meshBasicMaterial color="#22d3ee" transparent opacity={0.4} depthWrite={false} blending={THREE.AdditiveBlending} />
    </mesh>
  )
}

export default function PitTerrain3D() {
  const { geometry, levels } = useMemo(() => buildGeometry(), [])
  const wire = useMemo(() => new THREE.WireframeGeometry(geometry), [geometry])

  return (
    <group>
      <mesh geometry={geometry}>
        <meshStandardMaterial
          vertexColors
          flatShading
          roughness={0.42}
          metalness={0.18}
          emissive="#0b1220"
          emissiveIntensity={0.35}
          side={THREE.DoubleSide}
        />
      </mesh>
      <lineSegments geometry={wire}>
        <lineBasicMaterial color="#e2e8f0" transparent opacity={0.14} />
      </lineSegments>
      <ScanRings levels={levels} />
      <ScanPulse />
    </group>
  )
}
