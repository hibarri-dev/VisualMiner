import data from './quarry-height.json'

export const QUARRY_HALF_W = data.halfW
export const QUARRY_HALF_D = data.halfD

export const quarryFit = {
  scaleXZ: data.scaleXZ,
  scaleY: data.scaleY,
  center: data.center,
  minY: data.minY
}

const { cols, rows, heights, cover } = data
const INSET = 0.2
const x0 = ((data.coverMinIx / (cols - 1)) * 2 - 1) * QUARRY_HALF_W
const x1 = ((data.coverMaxIx / (cols - 1)) * 2 - 1) * QUARRY_HALF_W
const z0 = ((data.coverMinIz / (rows - 1)) * 2 - 1) * QUARRY_HALF_D
const z1 = ((data.coverMaxIz / (rows - 1)) * 2 - 1) * QUARRY_HALF_D
const xPad = (x1 - x0) * INSET
const zPad = (z1 - z0) * INSET
const mapMinX = x0 + xPad
const mapMaxX = x1 - xPad
const mapMinZ = z0 + zPad
const mapMaxZ = z1 - zPad

const nearest = new Int32Array(cols * rows).fill(-1)

function buildNearest() {
  const queue = []
  for (let i = 0; i < cover.length; i += 1) {
    if (cover[i] !== '1') continue
    nearest[i] = i
    queue.push(i)
  }
  for (let q = 0; q < queue.length; q += 1) {
    const idx = queue[q]
    const ix = idx % cols
    const iz = (idx / cols) | 0
    for (let dz = -1; dz <= 1; dz += 1) {
      for (let dx = -1; dx <= 1; dx += 1) {
        if (!dx && !dz) continue
        const nx = ix + dx
        const nz = iz + dz
        if (nx < 0 || nz < 0 || nx >= cols || nz >= rows) continue
        const nidx = nz * cols + nx
        if (nearest[nidx] !== -1) continue
        nearest[nidx] = nearest[idx]
        queue.push(nidx)
      }
    }
  }
}

buildNearest()

function rawHeight(ix, iz) {
  const x = Math.max(0, Math.min(cols - 1, ix))
  const z = Math.max(0, Math.min(rows - 1, iz))
  return heights[z * cols + x]
}

function cellOf(x, z) {
  const u = (x / QUARRY_HALF_W + 1) * 0.5
  const v = (z / QUARRY_HALF_D + 1) * 0.5
  const ix = Math.max(0, Math.min(cols - 1, Math.round(u * (cols - 1))))
  const iz = Math.max(0, Math.min(rows - 1, Math.round(v * (rows - 1))))
  return iz * cols + ix
}

function snapToLand(x, z) {
  const idx = cellOf(x, z)
  if (cover[idx] === '1') return [x, z]
  const nidx = nearest[idx]
  if (nidx < 0) return [x, z]
  const ix = nidx % cols
  const iz = (nidx / cols) | 0
  return [((ix / (cols - 1)) * 2 - 1) * QUARRY_HALF_W, ((iz / (rows - 1)) * 2 - 1) * QUARRY_HALF_D]
}

export function sampleQuarryHeight(x, z) {
  const [sx, sz] = snapToLand(x, z)
  const u = (sx / QUARRY_HALF_W + 1) * 0.5
  const v = (sz / QUARRY_HALF_D + 1) * 0.5
  const fx = Math.max(0, Math.min(cols - 1.001, u * (cols - 1)))
  const fz = Math.max(0, Math.min(rows - 1.001, v * (rows - 1)))
  const x0c = Math.floor(fx)
  const z0c = Math.floor(fz)
  const tx = fx - x0c
  const tz = fz - z0c
  return (
    rawHeight(x0c, z0c) * (1 - tx) * (1 - tz) +
    rawHeight(x0c + 1, z0c) * tx * (1 - tz) +
    rawHeight(x0c, z0c + 1) * (1 - tx) * tz +
    rawHeight(x0c + 1, z0c + 1) * tx * tz
  )
}

export function clampToQuarry(x, z) {
  return snapToLand(x, z)
}

// True when (x, z) falls on a scanned cell rather than the empty space around the
// tile. Used to keep generated overlays (point clouds, markers) on real terrain.
export function isQuarryLand(x, z) {
  return cover[cellOf(x, z)] === '1'
}

export const quarryExtent = {
  halfW: QUARRY_HALF_W,
  halfD: QUARRY_HALF_D,
  cols,
  rows
}

const MAX_TILT = 0.42 // ~24deg; the height grid is coarser than the mesh, so raw
// gradients near cliff edges would otherwise lay a vehicle on its side.

// Tilt for a body sitting at (x, z) facing `yaw`. The height gradient is measured
// along world axes, so it has to be rotated into the body frame — applying it
// directly as rotation.x/z (as this used to) makes a turning vehicle lean sideways
// on climbs and pitch while crossing a slope, which reads as sliding/ghosting.
export function quarrySlope(x, z, span = 0.1, yaw = 0) {
  const hL = sampleQuarryHeight(x - span, z)
  const hR = sampleQuarryHeight(x + span, z)
  const hD = sampleQuarryHeight(x, z - span)
  const hU = sampleQuarryHeight(x, z + span)
  const gx = (hR - hL) / (span * 2)
  const gz = (hU - hD) / (span * 2)
  const s = Math.sin(yaw)
  const c = Math.cos(yaw)
  const alongForward = gx * s + gz * c
  const alongRight = gx * c - gz * s
  const clamp = v => Math.max(-MAX_TILT, Math.min(MAX_TILT, v))
  return {
    pitch: clamp(-Math.atan(alongForward)),
    roll: clamp(Math.atan(alongRight))
  }
}

export function quarryMarkerPosition(mapX, mapY, lift = 0.003) {
  const x = mapMinX + (Math.max(0, Math.min(100, mapX)) / 100) * (mapMaxX - mapMinX)
  const z = mapMinZ + (Math.max(0, Math.min(100, mapY)) / 100) * (mapMaxZ - mapMinZ)
  const [sx, sz] = snapToLand(x, z)
  return [sx, sampleQuarryHeight(sx, sz) + lift, sz]
}
