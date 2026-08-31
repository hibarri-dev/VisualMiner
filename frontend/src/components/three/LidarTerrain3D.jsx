import React, { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { isQuarryLand, quarryExtent, sampleQuarryHeight } from '../../three/quarryTerrain'
import { lidarColor } from '../../three/lidarPalette'
import { columnGrade, oreBlocks } from '../../three/densityField'
import { gradeColor, gradeNorm } from '../../three/oreBody'

// Points per height-grid cell along each axis. The stored grid is 160x160, which on
// its own reads as a coarse dot screen, so we supersample it into a denser cloud.
const DENSITY = 2
// Jitter keeps the samples off a perfect lattice — a regular grid moires badly and
// looks like a printed pattern rather than returns from a scanner.
const JITTER = 0.35

// Barren rock in the density channel. Deliberately near-black so the mineralised
// halos are the only thing carrying colour — the whole point of the view.
const BARREN = new THREE.Color('#12202e')

function buildCloud() {
  const { halfW, halfD, cols, rows } = quarryExtent
  const nx = (cols - 1) * DENSITY
  const nz = (rows - 1) * DENSITY
  const stepX = (halfW * 2) / nx
  const stepZ = (halfD * 2) / nz

  const positions = []
  const depthColors = []
  const densityColors = []
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
    const x = pending[i]
    const y = pending[i + 1]
    const z = pending[i + 2]
    positions.push(x, y, z)

    lidarColor((y - loY) / span, color)
    depthColors.push(color.r, color.g, color.b)

    // Surface shading for the density channel: the richest grade modelled anywhere
    // in the rock column below this return. Ground over a barren column stays dark,
    // ground over a shoot lights up — so the ore body reads through the skin.
    const grade = columnGrade(x, z)
    if (grade > 0) {
      gradeColor(grade, color)
      const t = gradeNorm(grade)
      // Fade toward barren at the edge of a halo so shoots have soft margins.
      color.lerp(BARREN, Math.max(0, 1 - t * 2.4))
    } else {
      color.copy(BARREN)
    }
    densityColors.push(color.r, color.g, color.b)
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  geometry.setAttribute('cDepth', new THREE.Float32BufferAttribute(depthColors, 3))
  geometry.setAttribute('cDensity', new THREE.Float32BufferAttribute(densityColors, 3))
  geometry.computeBoundingSphere()
  return { geometry, count: positions.length / 3 }
}

const VERT = `
  attribute vec3 cDepth;
  attribute vec3 cDensity;
  varying vec3 vColor;
  varying float vSweep;
  uniform float uTime;
  uniform float uHalfD;
  uniform float uSize;
  uniform float uSweepSpeed;
  uniform float uChannel;
  void main() {
    vColor = mix(cDepth, cDensity, uChannel);
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
  uniform float uAlpha;
  void main() {
    vec2 d = gl_PointCoord - vec2(0.5);
    if (dot(d, d) > 0.25) discard;
    vec3 col = vColor + vec3(0.5, 0.9, 1.0) * vSweep * 0.85;
    gl_FragColor = vec4(col, uAlpha);
  }
`

const ORE_VERT = `
  attribute vec3 color;
  attribute float aSize;
  varying vec3 vColor;
  uniform float uSize;
  void main() {
    vColor = color;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = uSize * aSize * (1.0 / max(-mv.z, 0.001));
    gl_Position = projectionMatrix * mv;
  }
`

const ORE_FRAG = `
  varying vec3 vColor;
  void main() {
    vec2 d = gl_PointCoord - vec2(0.5);
    float r2 = dot(d, d);
    if (r2 > 0.25) discard;
    // Soft core so overlapping blocks fuse into a body instead of reading as dots.
    float a = smoothstep(0.25, 0.02, r2);
    gl_FragColor = vec4(vColor, a * 0.85);
  }
`

function buildOre(cutoff) {
  const blocks = oreBlocks(cutoff)
  const positions = new Float32Array(blocks.length * 3)
  const colors = new Float32Array(blocks.length * 3)
  const sizes = new Float32Array(blocks.length)
  const color = new THREE.Color()

  blocks.forEach((b, i) => {
    positions[i * 3] = b.x
    positions[i * 3 + 1] = b.y
    positions[i * 3 + 2] = b.z
    gradeColor(b.grade, color)
    colors[i * 3] = color.r
    colors[i * 3 + 1] = color.g
    colors[i * 3 + 2] = color.b
    // Richer blocks draw bigger, so a high-grade shoot is visually heavier than
    // the low-grade envelope around it.
    sizes[i] = 0.75 + gradeNorm(b.grade) * 1.9
  })

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  geometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1))
  geometry.computeBoundingSphere()
  return { geometry, count: blocks.length }
}

/** The interpolated ore bodies sitting below the scanned surface. */
function OreCloud({ cutoff = 1, pointSize = 90 }) {
  const { geometry } = useMemo(() => buildOre(cutoff), [cutoff])
  const uniforms = useMemo(() => ({ uSize: { value: pointSize } }), [pointSize])

  return (
    <points geometry={geometry} frustumCulled={false} renderOrder={2}>
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={ORE_VERT}
        fragmentShader={ORE_FRAG}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

export default function LidarTerrain3D({
  pointSize = 34,
  sweepSpeed = 1.6,
  channel = 'density',
  oreCutoff = 1
}) {
  const { geometry } = useMemo(() => buildCloud(), [])
  const matRef = useRef()
  const density = channel === 'density'

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uHalfD: { value: quarryExtent.halfD },
      uSize: { value: pointSize },
      uSweepSpeed: { value: sweepSpeed },
      uChannel: { value: density ? 1 : 0 },
      // Thin the surface skin in density mode so the ore bodies below show through
      // it rather than being hidden by their own overburden.
      uAlpha: { value: density ? 0.42 : 0.9 }
    }),
    [pointSize, sweepSpeed, density]
  )

  useFrame(state => {
    if (matRef.current) matRef.current.uniforms.uTime.value = state.clock.elapsedTime
  })

  return (
    <>
      <points geometry={geometry} frustumCulled={false} renderOrder={1}>
        <shaderMaterial
          ref={matRef}
          uniforms={uniforms}
          vertexShader={VERT}
          fragmentShader={FRAG}
          transparent
          depthWrite={!density}
        />
      </points>
      {density ? <OreCloud cutoff={oreCutoff} /> : null}
    </>
  )
}
