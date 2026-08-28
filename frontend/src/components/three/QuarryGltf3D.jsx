import React, { useLayoutEffect } from 'react'
import { Clone, useGLTF } from '@react-three/drei'
import { DoubleSide, SRGBColorSpace } from 'three'
import { QUARRY_GCP } from '../../three/modelCatalog'
import { quarryFit } from '../../three/quarryTerrain'

useGLTF.preload(QUARRY_GCP)

export default function QuarryGltf3D() {
  const { scene } = useGLTF(QUARRY_GCP)
  const { scaleXZ, scaleY, center, minY } = quarryFit

  useLayoutEffect(() => {
    scene.traverse(obj => {
      if (!obj.isMesh) return
      const mats = Array.isArray(obj.material) ? obj.material : [obj.material]
      mats.forEach(mat => {
        if (!mat) return
        mat.side = DoubleSide
        if (mat.map) mat.map.colorSpace = SRGBColorSpace
      })
    })
  }, [scene])

  return (
    <group scale={[scaleXZ, scaleY, scaleXZ]}>
      <group position={[-center[0], -minY, -center[2]]}>
        <Clone object={scene} />
      </group>
    </group>
  )
}
