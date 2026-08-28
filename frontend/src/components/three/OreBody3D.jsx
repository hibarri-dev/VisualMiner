import React, { useLayoutEffect, useMemo, useRef } from 'react'
import { Color, CylinderGeometry, Object3D, SphereGeometry, Vector3 } from 'three'
import {
  M_PER_UNIT,
  appletonFaultWorld,
  gradeColor,
  gradeNorm,
  toWorld
} from '../../three/oreBody'

const Y_UP = new Vector3(0, 1, 0)
const dummy = new Object3D()
const tint = new Color()

function AssayTubes({ samples }) {
  const mesh = useRef()
  const geom = useMemo(() => new CylinderGeometry(1, 1, 1, 7, 1, false), [])

  useLayoutEffect(() => {
    const inst = mesh.current
    if (!inst || !samples.length) return
    samples.forEach((s, i) => {
      const a = new Vector3(...toWorld(s.from))
      const b = new Vector3(...toWorld(s.to))
      const dir = b.clone().sub(a)
      const len = Math.max(dir.length(), 0.02)
      dummy.position.copy(a).add(b).multiplyScalar(0.5)
      dummy.quaternion.setFromUnitVectors(Y_UP, dir.normalize())
      const r = 0.04 + gradeNorm(s.grade) * 0.12
      dummy.scale.set(r, len, r)
      dummy.updateMatrix()
      inst.setMatrixAt(i, dummy.matrix)
      inst.setColorAt(i, gradeColor(s.grade, tint))
    })
    inst.instanceMatrix.needsUpdate = true
    if (inst.instanceColor) inst.instanceColor.needsUpdate = true
  }, [samples])

  if (!samples.length) return null
  return (
    <instancedMesh ref={mesh} args={[geom, undefined, samples.length]} frustumCulled={false}>
      <meshStandardMaterial roughness={0.4} metalness={0.2} />
    </instancedMesh>
  )
}

function CollarDots({ traces }) {
  const mesh = useRef()
  const geom = useMemo(() => new SphereGeometry(1, 8, 8), [])

  useLayoutEffect(() => {
    const inst = mesh.current
    if (!inst || !traces.length) return
    traces.forEach((t, i) => {
      dummy.position.set(...toWorld(t.collar))
      dummy.scale.setScalar(t.seismic ? 0.07 : 0.055)
      dummy.rotation.set(0, 0, 0)
      dummy.updateMatrix()
      inst.setMatrixAt(i, dummy.matrix)
      inst.setColorAt(i, tint.set(t.seismic ? '#22d3ee' : '#e2e8f0'))
    })
    inst.instanceMatrix.needsUpdate = true
    if (inst.instanceColor) inst.instanceColor.needsUpdate = true
  }, [traces])

  if (!traces.length) return null
  return (
    <instancedMesh ref={mesh} args={[geom, undefined, traces.length]} frustumCulled={false}>
      <meshStandardMaterial roughness={0.5} />
    </instancedMesh>
  )
}

function HoleTraces({ traces, seismic }) {
  const geom = useMemo(() => {
    const pts = traces.filter(t => !!t.seismic === seismic)
    const arr = new Float32Array(pts.length * 6)
    pts.forEach((t, i) => {
      const a = toWorld(t.collar)
      const b = toWorld(t.toe)
      arr.set(a, i * 6)
      arr.set(b, i * 6 + 3)
    })
    return arr
  }, [traces, seismic])

  const count = geom.length / 3
  if (!count) return null
  return (
    <lineSegments>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[geom, 3]} />
      </bufferGeometry>
      <lineBasicMaterial color={seismic ? '#22d3ee' : '#64748b'} transparent opacity={seismic ? 0.7 : 0.45} />
    </lineSegments>
  )
}

function BlockCloud({ model, cutoff }) {
  const visible = useMemo(
    () => (model?.blocks || []).filter(b => b.grade >= cutoff),
    [model, cutoff]
  )
  const mesh = useRef()

  useLayoutEffect(() => {
    const inst = mesh.current
    if (!inst || !visible.length || !model) return
    const sx = model.blockE / M_PER_UNIT
    const sy = model.blockRL / M_PER_UNIT
    const sz = model.blockN / M_PER_UNIT
    visible.forEach((b, i) => {
      dummy.position.set(...toWorld(b))
      dummy.scale.set(sx * 0.92, sy * 0.92, sz * 0.92)
      dummy.rotation.set(0, 0, 0)
      dummy.updateMatrix()
      inst.setMatrixAt(i, dummy.matrix)
      inst.setColorAt(i, gradeColor(b.grade, tint))
    })
    inst.instanceMatrix.needsUpdate = true
    if (inst.instanceColor) inst.instanceColor.needsUpdate = true
  }, [visible, model])

  if (!visible.length) return null
  return (
    <instancedMesh key={`${cutoff}-${visible.length}`} ref={mesh} args={[undefined, undefined, visible.length]} frustumCulled={false}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial transparent opacity={0.62} roughness={0.55} depthWrite={false} />
    </instancedMesh>
  )
}

function FaultPlane() {
  const { a, b, c, d } = appletonFaultWorld()
  const positions = useMemo(() => new Float32Array([...a, ...b, ...c, ...a, ...c, ...d]), [a, b, c, d])
  return (
    <mesh renderOrder={-1}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <meshBasicMaterial color="#38bdf8" transparent opacity={0.12} side={2} depthWrite={false} />
    </mesh>
  )
}

function SurfaceGrid() {
  return (
    <gridHelper args={[36, 18, '#1e293b', '#151a24']} position={[0, 0.02, 0]} />
  )
}

export default function OreBody3D({
  traces,
  samples,
  model,
  cutoff,
  showTraces,
  showAssays,
  showBlocks,
  showSeismic
}) {
  return (
    <group>
      <SurfaceGrid />
      {showSeismic && <FaultPlane />}
      {showTraces && (
        <>
          <HoleTraces traces={traces} seismic={false} />
          <HoleTraces traces={traces} seismic />
          <CollarDots traces={traces} />
        </>
      )}
      {showAssays && <AssayTubes samples={samples} />}
      {showBlocks && <BlockCloud model={model} cutoff={cutoff} />}
    </group>
  )
}
