import fs from 'node:fs'
import path from 'node:path'
import { Blob } from 'node:buffer'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

globalThis.self = globalThis
globalThis.Blob = Blob
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
    readAsDataURL() {
      this.result = 'data:,'
      this.onloadend?.()
      this.onload?.({ target: this })
    }
  }
}

const ROOT = path.resolve(import.meta.dirname, '..')
const GLB = path.join(ROOT, 'public/models/quarry_gcp.glb')
const OUT = path.join(ROOT, 'src/three/quarry-height.json')

const TARGET_WIDTH = 16
const Y_EXAG = 2.15
const GRID = 160

const buf = fs.readFileSync(GLB)
const ab = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength)
const loader = new GLTFLoader()
const gltf = await new Promise((resolve, reject) => loader.parse(ab, '', resolve, reject))
const scene = gltf.scene
scene.updateMatrixWorld(true)

const box = new THREE.Box3().setFromObject(scene)
const size = box.getSize(new THREE.Vector3())
const center = box.getCenter(new THREE.Vector3())
const scaleXZ = TARGET_WIDTH / Math.max(size.x, size.z)
const scaleY = scaleXZ * Y_EXAG
const halfW = (size.x * scaleXZ) / 2
const halfD = (size.z * scaleXZ) / 2

const heights = new Float64Array(GRID * GRID).fill(Number.NEGATIVE_INFINITY)
const tmp = new THREE.Vector3()

scene.traverse(obj => {
  if (!obj.isMesh || !obj.geometry?.attributes?.position) return
  const pos = obj.geometry.attributes.position
  obj.updateWorldMatrix(true, false)
  for (let i = 0; i < pos.count; i += 1) {
    tmp.fromBufferAttribute(pos, i).applyMatrix4(obj.matrixWorld)
    const x = (tmp.x - center.x) * scaleXZ
    const y = (tmp.y - box.min.y) * scaleY
    const z = (tmp.z - center.z) * scaleXZ
    const u = (x / halfW + 1) * 0.5
    const v = (z / halfD + 1) * 0.5
    if (u < 0 || u > 1 || v < 0 || v > 1) continue
    const ix = Math.min(GRID - 1, Math.max(0, Math.round(u * (GRID - 1))))
    const iz = Math.min(GRID - 1, Math.max(0, Math.round(v * (GRID - 1))))
    const idx = iz * GRID + ix
    if (y > heights[idx]) heights[idx] = y
  }
})

const filled = Array.from(heights)
const missing = filled.map(h => !Number.isFinite(h))
const hit = missing.map(empty => !empty)

function morph(mask, radius, keepIf) {
  const next = mask.slice()
  for (let iz = 0; iz < GRID; iz += 1) {
    for (let ix = 0; ix < GRID; ix += 1) {
      const idx = iz * GRID + ix
      let ok = keepIf === 'erode' ? true : false
      for (let dz = -radius; dz <= radius; dz += 1) {
        for (let dx = -radius; dx <= radius; dx += 1) {
          const nx = ix + dx
          const nz = iz + dz
          const inside = nx >= 0 && nz >= 0 && nx < GRID && nz < GRID && mask[nz * GRID + nx]
          if (keepIf === 'erode') {
            if (!inside) ok = false
          } else if (inside) {
            ok = true
          }
        }
      }
      next[idx] = ok
    }
  }
  return next
}

const coverMask = morph(morph(hit, 7, 'erode'), 3, 'dilate')

for (let pass = 0; pass < 12; pass += 1) {
  let changed = 0
  for (let iz = 0; iz < GRID; iz += 1) {
    for (let ix = 0; ix < GRID; ix += 1) {
      const idx = iz * GRID + ix
      if (!missing[idx]) continue
      let sum = 0
      let n = 0
      for (let dz = -1; dz <= 1; dz += 1) {
        for (let dx = -1; dx <= 1; dx += 1) {
          if (!dx && !dz) continue
          const nx = ix + dx
          const nz = iz + dz
          if (nx < 0 || nz < 0 || nx >= GRID || nz >= GRID) continue
          const nidx = nz * GRID + nx
          if (missing[nidx]) continue
          sum += filled[nidx]
          n += 1
        }
      }
      if (n) {
        filled[idx] = sum / n
        missing[idx] = false
        changed += 1
      }
    }
  }
  if (!changed) break
}
for (let i = 0; i < filled.length; i += 1) {
  if (!Number.isFinite(filled[i])) filled[i] = 0
}

let minIx = GRID
let maxIx = 0
let minIz = GRID
let maxIz = 0
let coverCount = 0
for (let iz = 0; iz < GRID; iz += 1) {
  for (let ix = 0; ix < GRID; ix += 1) {
    if (!coverMask[iz * GRID + ix]) continue
    coverCount += 1
    if (ix < minIx) minIx = ix
    if (ix > maxIx) maxIx = ix
    if (iz < minIz) minIz = iz
    if (iz > maxIz) maxIz = iz
  }
}

const json = {
  cols: GRID,
  rows: GRID,
  halfW: +halfW.toFixed(5),
  halfD: +halfD.toFixed(5),
  scaleXZ: +scaleXZ.toFixed(8),
  scaleY: +scaleY.toFixed(8),
  yExag: Y_EXAG,
  center: center.toArray().map(n => +n.toFixed(5)),
  minY: +box.min.y.toFixed(5),
  size: size.toArray().map(n => +n.toFixed(5)),
  coverMinIx: minIx,
  coverMaxIx: maxIx,
  coverMinIz: minIz,
  coverMaxIz: maxIz,
  cover: coverMask.map(v => (v ? '1' : '0')).join(''),
  heights: filled.map(n => +n.toFixed(4))
}

fs.writeFileSync(OUT, JSON.stringify(json))
console.log(
  JSON.stringify(
    {
      out: path.relative(ROOT, OUT),
      cells: GRID,
      halfW,
      halfD,
      scaleXZ,
      scaleY,
      yMin: Math.min(...filled),
      yMax: Math.max(...filled),
      coverCount,
      coverBounds: [minIx, maxIx, minIz, maxIz]
    },
    null,
    2
  )
)
