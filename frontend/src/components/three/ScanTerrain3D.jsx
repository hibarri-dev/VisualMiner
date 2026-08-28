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
import { QuarryWallMaterial } from './QuarryWallMaterial'

function buildScanMesh() {
  const segsX = 96
  const segsZ = 68
  const geometry = new THREE.PlaneGeometry(GEO_HALF_W * 2, GEO_HALF_D * 2, segsX, segsZ)
  geometry.rotateX(-Math.PI / 2)
  const position = geometry.attributes.position
  for (let i = 0; i < position.count; i += 1) {
    const x = position.getX(i)
    const z = position.getZ(i)
    position.setY(i, sampleGeoHeight(x, z, SCAN_RELIEF))
  }
  geometry.computeVertexNormals()
  return geometry
}

function buildUvRays() {
  const zSpan = terrainZMax - terrainZMin || 1
  const positions = []
  const colors = []
  const step = 4
  for (let iz = 0; iz < terrainRows; iz += step) {
    for (let ix = 0; ix < terrainCols; ix += step) {
      const x = ((ix / (terrainCols - 1)) * 2 - 1) * GEO_HALF_W
      const z = ((iz / (terrainRows - 1)) * 2 - 1) * GEO_HALF_D
      const y = sampleGeoHeight(x, z, SCAN_RELIEF)
      const t = (terrainHeights[iz * terrainCols + ix] - terrainZMin) / zSpan
      const h = 0.05 + t * 0.18
      positions.push(x, y + 0.01, z, x, y + h, z)
      colors.push(0.82, 0.72, 0.55, 0.45, 0.85, 0.95)
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

  return (
    <group>
      <mesh geometry={mesh} receiveShadow>
        <QuarryWallMaterial repeatX={16} repeatY={12} />
      </mesh>
      <lineSegments geometry={rays}>
        <lineBasicMaterial vertexColors transparent opacity={0.28} blending={THREE.AdditiveBlending} depthWrite={false} />
      </lineSegments>
    </group>
  )
}
