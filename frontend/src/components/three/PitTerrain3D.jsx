import React, { useMemo, useCallback } from 'react'
import * as THREE from 'three'
import { LatheGeometry, Vector2 } from 'three'
import { buildPitLevels, elevationToY, depthColor, PIT_GROUND_RADIUS } from '../../three/pitProfile'
import TerrainDressing from './TerrainDressing'

function buildGeometry() {
  const levels = buildPitLevels()
  const points = [new Vector2(PIT_GROUND_RADIUS, 0)]

  levels.forEach((level, i) => {
    const y = elevationToY(level.elevation)
    points.push(new Vector2(level.radius, y))
    const next = levels[i + 1]
    if (next) points.push(new Vector2(next.radius, y))
  })
  points.push(new Vector2(0, points[points.length - 1].y))

  const geometry = new LatheGeometry(points, 96)
  geometry.computeVertexNormals()

  const position = geometry.attributes.position
  const minY = elevationToY(levels[levels.length - 1].elevation)
  const maxY = elevationToY(levels[0].elevation)
  const colors = new Float32Array(position.count * 3)
  for (let i = 0; i < position.count; i += 1) {
    const y = position.getY(i)
    const t = (y - minY) / (maxY - minY || 1)
    const c = depthColor(t)
    colors[i * 3] = c.r
    colors[i * 3 + 1] = c.g
    colors[i * 3 + 2] = c.b
  }
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

  return { geometry, levels }
}

export default function PitTerrain3D() {
  const { geometry, levels } = useMemo(() => buildGeometry(), [])
  const groundHeight = useCallback(() => 0, [])
  const roadRadius = levels[0].radius + (PIT_GROUND_RADIUS - levels[0].radius) * 0.5

  return (
    <group>
      <mesh geometry={geometry} receiveShadow>
        <meshStandardMaterial vertexColors roughness={0.85} metalness={0.05} side={THREE.DoubleSide} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.004, 0]} receiveShadow>
        <ringGeometry args={[roadRadius - 0.14, roadRadius + 0.14, 96]} />
        <meshStandardMaterial color="#3f3f46" roughness={0.95} />
      </mesh>
      <TerrainDressing innerRadius={PIT_GROUND_RADIUS + 0.15} outerRadius={PIT_GROUND_RADIUS + 2.4} heightFn={groundHeight} seed={7} />
    </group>
  )
}
