import fs from 'node:fs'
import path from 'node:path'
import * as THREE from 'three'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js'

if (typeof FileReader === 'undefined') {
  globalThis.FileReader = class FileReader {
    result = null
    onloadend = null
    onload = null
    readAsArrayBuffer(blob) {
      Promise.resolve(blob.arrayBuffer()).then(buf => {
        this.result = buf
        this.onloadend?.()
        this.onload?.({ target: this })
      })
    }
  }
}

const ROOT = path.resolve(import.meta.dirname, '..')
const OBJ = path.join(
  ROOT,
  'public/models/841220181419/V4_1_27.84_-26.45_tile_1_1.obj'
)
const OUT = path.join(ROOT, 'public/models/pit-terrain.glb')

const TARGET_WIDTH = 14.4
const TARGET_RELIEF = 2.75
const TOP_Z = 0.4

const raw = fs.readFileSync(OBJ, 'utf8').replaceAll(',', ' ')
const group = new OBJLoader().parse(raw)

const geos = []
group.traverse(obj => {
  if (obj.isMesh && obj.geometry) geos.push(obj.geometry)
})
if (!geos.length) throw new Error('No meshes in OBJ')

let merged = mergeGeometries(geos, false)
const pos = merged.attributes.position
const srcIndex = merged.index ? merged.index.array : null
const triCount = srcIndex ? srcIndex.length / 3 : pos.count / 3
const keep = []

for (let t = 0; t < triCount; t += 1) {
  const a = srcIndex ? srcIndex[t * 3] : t * 3
  const b = srcIndex ? srcIndex[t * 3 + 1] : t * 3 + 1
  const c = srcIndex ? srcIndex[t * 3 + 2] : t * 3 + 2
  if (pos.getZ(a) > TOP_Z && pos.getZ(b) > TOP_Z && pos.getZ(c) > TOP_Z) {
    keep.push(a, b, c)
  }
}

merged.setIndex(keep)
merged = merged.toNonIndexed()

const p = merged.attributes.position
let minX = Infinity
let minY = Infinity
let minZ = Infinity
let maxX = -Infinity
let maxY = -Infinity
let maxZ = -Infinity
for (let i = 0; i < p.count; i += 1) {
  minX = Math.min(minX, p.getX(i))
  maxX = Math.max(maxX, p.getX(i))
  minY = Math.min(minY, p.getY(i))
  maxY = Math.max(maxY, p.getY(i))
  minZ = Math.min(minZ, p.getZ(i))
  maxZ = Math.max(maxZ, p.getZ(i))
}

const spanX = maxX - minX || 1
const spanY = maxY - minY || 1
const spanZ = maxZ - minZ || 1
const scaleXZ = TARGET_WIDTH / spanX
const scaleY = TARGET_RELIEF / spanZ
const cx = (minX + maxX) / 2
const cy = (minY + maxY) / 2

const colors = new Float32Array(p.count * 3)
const STOPS = [
  [0, new THREE.Color('#1e3a8a')],
  [0.16, new THREE.Color('#0284c7')],
  [0.34, new THREE.Color('#059669')],
  [0.5, new THREE.Color('#eab308')],
  [0.66, new THREE.Color('#ea580c')],
  [0.84, new THREE.Color('#991b1b')],
  [1, new THREE.Color('#78350f')]
]

function depthColor(t) {
  const clamped = Math.min(1, Math.max(0, t))
  let lo = STOPS[0]
  let hi = STOPS[STOPS.length - 1]
  for (let i = 0; i < STOPS.length - 1; i += 1) {
    if (clamped >= STOPS[i][0] && clamped <= STOPS[i + 1][0]) {
      lo = STOPS[i]
      hi = STOPS[i + 1]
      break
    }
  }
  const localT = (clamped - lo[0]) / (hi[0] - lo[0] || 1)
  return lo[1].clone().lerp(hi[1], localT)
}

for (let i = 0; i < p.count; i += 1) {
  const x = (p.getX(i) - cx) * scaleXZ
  const h = (p.getZ(i) - minZ) * scaleY
  const z = (cy - p.getY(i)) * scaleXZ
  p.setXYZ(i, x, h, z)
  const c = depthColor(h / TARGET_RELIEF)
  colors[i * 3] = c.r
  colors[i * 3 + 1] = c.g
  colors[i * 3 + 2] = c.b
}

merged.setAttribute('color', new THREE.BufferAttribute(colors, 3))
merged.computeVertexNormals()
merged.computeBoundingBox()
merged.computeBoundingSphere()

const mesh = new THREE.Mesh(
  merged,
  new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.88, metalness: 0.04, side: THREE.DoubleSide })
)
const scene = new THREE.Scene()
scene.add(mesh)

const glb = await new GLTFExporter().parseAsync(scene, { binary: true })
fs.writeFileSync(OUT, Buffer.from(glb))
console.log('Wrote', OUT, 'bytes', fs.statSync(OUT).size)
console.log('bbox', merged.boundingBox.min.toArray(), merged.boundingBox.max.toArray())
console.log('kept tris', keep.length / 3, 'of', triCount)
