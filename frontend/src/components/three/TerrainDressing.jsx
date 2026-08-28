import React, { useMemo } from 'react'
import * as THREE from 'three'

function mulberry32(seed) {
  let a = seed
  return function () {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function Rocks({ innerRadius, outerRadius, heightFn, count = 40, seed = 7 }) {
  const ref = React.useRef()
  const rng = useMemo(() => mulberry32(seed), [seed])

  useMemo(() => {}, [])

  React.useLayoutEffect(() => {
    if (!ref.current) return
    const dummy = new THREE.Object3D()
    for (let i = 0; i < count; i += 1) {
      const angle = rng() * Math.PI * 2
      const radius = innerRadius + rng() * (outerRadius - innerRadius)
      const x = Math.cos(angle) * radius
      const z = Math.sin(angle) * radius
      const y = heightFn(x, z)
      const scale = 0.05 + rng() * 0.09
      dummy.position.set(x, y + scale * 0.4, z)
      dummy.rotation.set(rng() * Math.PI, rng() * Math.PI, rng() * Math.PI)
      dummy.scale.setScalar(scale)
      dummy.updateMatrix()
      ref.current.setMatrixAt(i, dummy.matrix)
      ref.current.setColorAt(i, new THREE.Color().setHSL(0.08, 0.15, 0.25 + rng() * 0.15))
    }
    ref.current.instanceMatrix.needsUpdate = true
    if (ref.current.instanceColor) ref.current.instanceColor.needsUpdate = true
  }, [count, innerRadius, outerRadius, heightFn, rng])

  return (
    <instancedMesh ref={ref} args={[null, null, count]} castShadow receiveShadow>
      <icosahedronGeometry args={[1, 0]} />
      <meshStandardMaterial roughness={1} />
    </instancedMesh>
  )
}

function Tree({ position, scale = 1 }) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.09, 0]} castShadow>
        <cylinderGeometry args={[0.012, 0.016, 0.18, 6]} />
        <meshStandardMaterial color="#4b3621" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.22, 0]} castShadow>
        <coneGeometry args={[0.09, 0.26, 8]} />
        <meshStandardMaterial color="#1f5c3a" roughness={0.85} />
      </mesh>
      <mesh position={[0, 0.32, 0]} castShadow>
        <coneGeometry args={[0.065, 0.18, 8]} />
        <meshStandardMaterial color="#256b45" roughness={0.85} />
      </mesh>
    </group>
  )
}

function Trees({ innerRadius, outerRadius, heightFn, count = 14, seed = 21 }) {
  const rng = useMemo(() => mulberry32(seed), [seed])
  const trees = useMemo(() => {
    const items = []
    for (let i = 0; i < count; i += 1) {
      const angle = rng() * Math.PI * 2
      const radius = innerRadius + rng() * (outerRadius - innerRadius)
      const x = Math.cos(angle) * radius
      const z = Math.sin(angle) * radius
      items.push({ position: [x, heightFn(x, z), z], scale: 0.8 + rng() * 0.7, key: i })
    }
    return items
  }, [count, innerRadius, outerRadius, heightFn, rng])

  return (
    <>
      {trees.map(t => (
        <Tree key={t.key} position={t.position} scale={t.scale} />
      ))}
    </>
  )
}

export default function TerrainDressing({ innerRadius, outerRadius, heightFn, rockCount = 40, treeCount = 14, seed = 7 }) {
  return (
    <group>
      <Rocks innerRadius={innerRadius} outerRadius={outerRadius} heightFn={heightFn} count={rockCount} seed={seed} />
      <Trees innerRadius={innerRadius} outerRadius={outerRadius * 1.15} heightFn={heightFn} count={treeCount} seed={seed + 100} />
    </group>
  )
}
