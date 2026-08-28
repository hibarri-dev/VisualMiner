import React, { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { isQuarryLand, quarryExtent, sampleQuarryHeight } from '../../three/quarryTerrain'
import { lidarColor } from '../../three/lidarPalette'

// Points per height-grid cell along each axis. The stored grid is 160x160, which on
// its own reads as a coarse dot screen, so we supersample it into a denser cloud.
const DENSITY = 2
// Jitter keeps the samples off a perfect lattice — a regular grid moires badly and
// looks like a printed pattern rather than returns from a scanner.
const JITTER = 0.35

function buildCloud() {
  const { halfW, halfD, cols, rows } = quarryExtent
  const nx = (cols - 1) * DENSITY
  const nz = (rows - 1) * DENSITY
  const stepX = (halfW * 2) / nx
  const stepZ = (halfD * 2) / nz

  const positions = []
  const colors = []
  const color = new THREE.Color()

  // Deterministic jitter so the cloud is identical between reloads.
  let seed = 0x9e3779b9
  const rand = () => {
    seed ^= seed << 13
    seed ^= seed >>> 17
    seed ^= seed << 5
    return ((seed >>> 0) % 10000) / 10000 - 0.5
  }

  const pending = []

  for (let iz = 0; iz <= nz; iz += 1) {
    for (let ix = 0; ix <= nx; ix += 1) {
      const x = -halfW + ix * stepX + rand() * stepX * JITTER * 2
      const z = -halfD + iz * stepZ + rand() * stepZ * JITTER * 2
      if (!isQuarryLand(x, z)) continue
      pending.push(x, sampleQuarryHeight(x, z), z)
    }
  }

  // Stretch the ramp over the 2nd-98th percentile rather than min/max: a handful of
  // spire-like rock pillars sit far above everything else, and normalising on the
  // raw extent squashes all the real bench detail into the bottom of the ramp.
  const sorted = []
  for (let i = 1; i < pending.length; i += 3) sorted.push(pending[i])
  sorted.sort((a, b) => a - b)
  const at = p => sorted[Math.floor(p * (sorted.length - 1))]
  const loY = at(0.02)
  const span = at(0.98) - loY || 1

  for (let i = 0; i < pending.length; i += 3) {
    const y = pending[i + 1]
    positions.push(pending[i], y, pending[i + 2])
    lidarColor((y - loY) / span, color)
    colors.push(color.r, color.g, color.b)
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3))
  geometry.computeBoundingSphere()
  return { geometry, count: positions.length / 3 }
}

const VERT = `
  attribute vec3 color;
  varying vec3 vColor;
  varying float vSweep;
  uniform float uTime;
  uniform float uHalfD;
  uniform float uSize;
  uniform float uSweepSpeed;
  void main() {
    vColor = color;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = uSize * (1.0 / max(-mv.z, 0.001));
    gl_Position = projectionMatrix * mv;
    float sweepZ = mod(uTime * uSweepSpeed, uHalfD * 2.4) - uHalfD * 1.2;
    vSweep = smoothstep(0.85, 0.0, abs(position.z - sweepZ));
  }
`

const FRAG = `
  varying vec3 vColor;
  varying float vSweep;
  void main() {
    vec2 d = gl_PointCoord - vec2(0.5);
    if (dot(d, d) > 0.25) discard;
    vec3 col = vColor + vec3(0.5, 0.9, 1.0) * vSweep * 0.85;
    gl_FragColor = vec4(col, 0.9);
  }
`

export default function LidarTerrain3D({ pointSize = 34, sweepSpeed = 1.6 }) {
  const { geometry } = useMemo(() => buildCloud(), [])
  const matRef = useRef()

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uHalfD: { value: quarryExtent.halfD },
      uSize: { value: pointSize },
      uSweepSpeed: { value: sweepSpeed }
    }),
    [pointSize, sweepSpeed]
  )

  useFrame(state => {
    if (matRef.current) matRef.current.uniforms.uTime.value = state.clock.elapsedTime
  })

  return (
    <points geometry={geometry} frustumCulled={false}>
      <shaderMaterial
        ref={matRef}
        uniforms={uniforms}
        vertexShader={VERT}
        fragmentShader={FRAG}
        transparent
        depthWrite
      />
    </points>
  )
}
