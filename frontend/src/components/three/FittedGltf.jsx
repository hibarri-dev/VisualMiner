import React, { useMemo } from 'react'
import { Clone, useGLTF } from '@react-three/drei'
import * as THREE from 'three'

export default function FittedGltf({ url, size = 0.7, selected = false }) {
  const { scene } = useGLTF(url)
  const fit = useMemo(() => {
    const box = new THREE.Box3().setFromObject(scene)
    const dim = box.getSize(new THREE.Vector3())
    const max = Math.max(dim.x, dim.y, dim.z) || 1
    const scale = size / max
    return { scale, y: -box.min.y * scale }
  }, [scene, size])

  const scale = selected ? fit.scale * 1.18 : fit.scale

  return (
    <group position={[0, fit.y, 0]}>
      <group scale={scale}>
        <Clone object={scene} castShadow receiveShadow />
      </group>
    </group>
  )
}

export function preloadGltfs(urls) {
  urls.forEach(url => useGLTF.preload(url))
}
