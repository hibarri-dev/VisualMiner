import React, { useEffect, useMemo } from 'react'
import { useAnimations, useGLTF } from '@react-three/drei'
import { clone } from 'three/examples/jsm/utils/SkeletonUtils.js'
import { Box3 } from 'three'

const CLIP = {
  walk: 'CharacterArmature|Walk',
  check: 'CharacterArmature|Interact',
  idle: 'CharacterArmature|Idle'
}

export default function WorkerGltf({ url, size = 0.08, selected = false, clip = 'idle' }) {
  const { scene, animations } = useGLTF(url)
  const copied = useMemo(() => clone(scene), [scene])
  const { actions } = useAnimations(animations, copied)

  const fit = useMemo(() => {
    copied.updateMatrixWorld(true)
    const box = new Box3().setFromObject(copied)
    const height = Math.max(box.max.y - box.min.y, 0.01)
    const scale = size / height
    return { scale, y: -box.min.y * scale }
  }, [copied, size])

  useEffect(() => {
    const key = CLIP[clip] || CLIP.idle
    Object.values(actions).forEach(action => action?.fadeOut(0.18))
    const next = actions[key] || actions[CLIP.idle]
    next?.reset().fadeIn(0.18).play()
    return () => {
      next?.fadeOut(0.12)
    }
  }, [actions, clip])

  const scale = selected ? fit.scale * 1.1 : fit.scale

  return (
    <group position={[0, fit.y, 0]}>
      <group scale={scale}>
        <primitive object={copied} />
      </group>
    </group>
  )
}
