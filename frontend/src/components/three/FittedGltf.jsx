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
    // Vehicles are longer than they are wide, so the longer horizontal axis is the
    // body's length. Yaw is applied assuming forward is +Z, so a model authored along
    // X has to be turned a quarter turn or it drives sideways.
    const yaw = dim.x > dim.z ? Math.PI / 2 : 0
    return { scale, y: -box.min.y * scale, yaw }
  }, [scene, size])

  const scale = selected ? fit.scale * 1.18 : fit.scale

  return (
    <group position={[0, fit.y, 0]} rotation={[0, fit.yaw, 0]}>
      <group scale={scale}>
        <Clone object={scene} castShadow receiveShadow />
      </group>
    </group>
  )
}

export function preloadGltfs(urls) {
  urls.forEach(url => useGLTF.preload(url))
}
