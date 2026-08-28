import React, { useCallback } from 'react'
import { Clone, useGLTF } from '@react-three/drei'
import { GEO_HALF_D, GEO_HALF_W, sampleGeoHeight } from '../../three/geoTerrain'
import { TERRAIN_GLB } from '../../three/modelCatalog'
import TerrainDressing from './TerrainDressing'

useGLTF.preload(TERRAIN_GLB)

export default function GeoTerrain3D() {
  const { scene } = useGLTF(TERRAIN_GLB)
  const heightFn = useCallback((x, z) => sampleGeoHeight(x, z), [])

  return (
    <group>
      <Clone object={scene} />
      <TerrainDressing
        innerRadius={Math.min(GEO_HALF_W, GEO_HALF_D) + 0.15}
        outerRadius={Math.max(GEO_HALF_W, GEO_HALF_D) + 1.8}
        heightFn={heightFn}
        rockCount={28}
        treeCount={10}
        seed={11}
      />
    </group>
  )
}
