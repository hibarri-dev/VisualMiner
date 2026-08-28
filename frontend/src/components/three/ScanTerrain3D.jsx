import React, { useMemo } from 'react'
import * as THREE from 'three'
import {
  GEO_HALF_D,
  GEO_HALF_W,
  SCAN_RELIEF,
  sampleGeoHeight,
  terrainCols,
  terrainHeights,
  terrainRows,
  terrainZMax,
  terrainZMin
} from '../../three/geoTerrain'
import { depthColor } from '../../three/pitProfile'

function buildScanMesh() {
  const segsX = 96
  const segsZ = 68
  const geometry = new THREE.PlaneGeometry(GEO_HALF_W * 2, GEO_HALF_D * 2, segsX, segsZ)
  geometry.rotateX(-Math.PI / 2)
  const position = geometry.attributes.position
  let minY = Infinity
  let maxY = -Infinity
  for (let i = 0; i < position.count; i += 1) {
    const x = position.getX(i)
    const z = position.getZ(i)
    const y = sampleGeoHeight(x, z, SCAN_RELIEF)
    position.setY(i, y)
    if (y < minY) minY = y
    if (y > maxY) maxY = y
  }
  geometry.computeVertexNormals()
  const span = maxY - minY || 1
  const colors = new Float32Array(position.count * 3)
  for (let i = 0; i < position.count; i += 1) {
    const t = (position.getY(i) - minY) / span
    const c = depthColor(t)
    colors[i * 3] = c.r
    colors[i * 3 + 1] = c.g
    colors[i * 3 + 2] = c.b
  }
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  return geometry
}

function buildUvRays() {
  const zSpan = terrainZMax - terrainZMin || 1
  const positions = []
  const colors = []
  const step = 3
  for (let iz = 0; iz < terrainRows; iz += step) {
    for (let ix = 0; ix < terrainCols; ix += step) {
      const x = ((ix / (terrainCols - 1)) * 2 - 1) * GEO_HALF_W
      const z = ((iz / (terrainRows - 1)) * 2 - 1) * GEO_HALF_D
      const y = sampleGeoHeight(x, z, SCAN_RELIEF)
      const t = (terrainHeights[iz * terrainCols + ix] - terrainZMin) / zSpan
      const c = depthColor(t)
      const h = 0.07 + t * 0.28
      positions.push(x, y + 0.01, z, x, y + h, z)
      colors.push(c.r, c.g, c.b, 0.2, 0.95, 1)
    }
  }
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3))
  return geometry
}

function buildPoints() {
  const zSpan = terrainZMax - terrainZMin || 1
  const positions = []
  const colors = []
  const step = 2
  for (let iz = 0; iz < terrainRows; iz += step) {
    for (let ix = 0; ix < terrainCols; ix += step) {
      const x = ((ix / (terrainCols - 1)) * 2 - 1) * GEO_HALF_W
      const z = ((iz / (terrainRows - 1)) * 2 - 1) * GEO_HALF_D
      const y = sampleGeoHeight(x, z, SCAN_RELIEF)
      const t = (terrainHeights[iz * terrainCols + ix] - terrainZMin) / zSpan
      const c = depthColor(t)
      positions.push(x, y + 0.02, z)
      colors.push(c.r, c.g, c.b)
    }
  }
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3))
  return geometry
}

export default function ScanTerrain3D() {
  const mesh = useMemo(() => buildScanMesh(), [])
  const rays = useMemo(() => buildUvRays(), [])
  const points = useMemo(() => buildPoints(), [])
  const wire = useMemo(() => new THREE.WireframeGeometry(mesh), [mesh])

  return (
    <group>
      <mesh geometry={mesh}>
        <meshStandardMaterial
          vertexColors
          flatShading
          roughness={0.38}
          metalness={0.22}
          emissive="#081018"
          emissiveIntensity={0.4}
          side={THREE.DoubleSide}
        />
      </mesh>
      <lineSegments geometry={wire}>
        <lineBasicMaterial color="#f8fafc" transparent opacity={0.08} />
      </lineSegments>
      <lineSegments geometry={rays}>
        <lineBasicMaterial vertexColors transparent opacity={0.55} blending={THREE.AdditiveBlending} depthWrite={false} />
      </lineSegments>
      <points geometry={points}>
        <pointsMaterial
          vertexColors
          size={0.045}
          sizeAttenuation
          transparent
          opacity={0.85}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
    </group>
  )
}
