import React, { useMemo } from 'react'
import * as THREE from 'three'
import TerrainDressing from './TerrainDressing'

export const RIDGE_HALF = 6

export function ridgeHeight(x, z) {
  return (
    Math.sin(x * 0.35) * 0.6 +
    Math.cos(z * 0.3) * 0.5 +
    Math.sin((x + z) * 0.18) * 0.9 +
    1.1
  )
}

const RIDGE_COLOR_STOPS = [
  [0, '#047857'],
  [0.35, '#10b981'],
  [0.65, '#06b6d4'],
  [0.85, '#3b82f6'],
  [1, '#8b5cf6']
]

function ridgeColor(t) {
  const clamped = Math.min(1, Math.max(0, t))
  for (let i = 0; i < RIDGE_COLOR_STOPS.length - 1; i += 1) {
    const [t0, c0] = RIDGE_COLOR_STOPS[i]
    const [t1, c1] = RIDGE_COLOR_STOPS[i + 1]
    if (clamped >= t0 && clamped <= t1) {
      const localT = (clamped - t0) / (t1 - t0 || 1)
      return new THREE.Color(c0).lerp(new THREE.Color(c1), localT)
    }
  }
  return new THREE.Color(RIDGE_COLOR_STOPS[RIDGE_COLOR_STOPS.length - 1][1])
}

function buildGeometry() {
  const size = RIDGE_HALF * 2
  const segments = 64
  const geometry = new THREE.PlaneGeometry(size, size, segments, segments)
  geometry.rotateX(-Math.PI / 2)

  const position = geometry.attributes.position
  let minY = Infinity
  let maxY = -Infinity
  for (let i = 0; i < position.count; i += 1) {
    const x = position.getX(i)
    const z = position.getZ(i)
    const y = ridgeHeight(x, z)
    position.setY(i, y)
    if (y < minY) minY = y
    if (y > maxY) maxY = y
  }
  geometry.computeVertexNormals()

  const colors = new Float32Array(position.count * 3)
  for (let i = 0; i < position.count; i += 1) {
    const t = (position.getY(i) - minY) / (maxY - minY || 1)
    const c = ridgeColor(t)
    colors[i * 3] = c.r
    colors[i * 3 + 1] = c.g
    colors[i * 3 + 2] = c.b
  }
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

  return geometry
}

export default function RidgeTerrain3D() {
  const geometry = useMemo(() => buildGeometry(), [])

  return (
    <group>
      <mesh geometry={geometry} receiveShadow>
        <meshStandardMaterial vertexColors roughness={0.9} metalness={0} side={THREE.DoubleSide} />
      </mesh>
      <TerrainDressing innerRadius={0.6} outerRadius={RIDGE_HALF * 0.92} heightFn={ridgeHeight} rockCount={26} treeCount={20} seed={13} />
    </group>
  )
}
