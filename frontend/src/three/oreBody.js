import data from '../data/drillholes.json'
import { Color } from 'three'
import { lidarColor } from './lidarPalette'

export const drillMeta = data.meta

// Queensway is ~3 km along strike and 1.5 km deep. This scale keeps the model
// inside the same camera envelope as the pit scenes.
export const M_PER_UNIT = 100

const DEG = Math.PI / 180

/**
 * Tangent-method desurvey: walk the hole segment by segment, applying each survey
 * station's dip/azimuth. Returns local mine-grid metres {e, n, rl}.
 */
export function desurvey(collar, depth) {
  const stations = collar.survey
  let e = collar.x
  let n = collar.y
  let rl = collar.z
  let done = 0

  for (let i = 0; i < stations.length && done < depth; i += 1) {
    const s = stations[i]
    const next = stations[i + 1]
    const segEnd = next ? Math.min(next.d, depth) : depth
    const len = segEnd - done
    if (len <= 0) continue
    const dip = s.dip * DEG
    const azi = s.azi * DEG
    const horiz = Math.cos(dip) * len
    rl += Math.sin(dip) * len
    n += Math.cos(azi) * horiz
    e += Math.sin(azi) * horiz
    done = segEnd
  }
  return { e, n, rl }
}

export function toWorld({ e, n, rl }) {
  return [e / M_PER_UNIT, (rl - data.meta.origin.topRL) / M_PER_UNIT, -n / M_PER_UNIT]
}

const byHole = new Map()
data.collars.forEach(c => byHole.set(c.id, c))

export function buildIntervalSamples() {
  const out = []
  for (const iv of data.intervals) {
    if (iv.s) continue
    const collar = byHole.get(iv.id)
    if (!collar) continue
    const a = desurvey(collar, iv.f)
    const b = desurvey(collar, iv.t)
    out.push({
      id: iv.id,
      grade: iv.g,
      zone: iv.z,
      from: a,
      to: b,
      mid: { e: (a.e + b.e) / 2, n: (a.n + b.n) / 2, rl: (a.rl + b.rl) / 2 },
      length: iv.t - iv.f
    })
  }
  return out
}

export function buildHoleTraces() {
  return data.collars.map(c => ({
    id: c.id,
    prospect: c.prospect,
    seismic: !!c.seismic,
    collar: { e: c.x, n: c.y, rl: c.z },
    toe: desurvey(c, c.length || 0),
    depth: c.length || 0
  }))
}

export function dataExtent(samples) {
  const ext = { minE: Infinity, maxE: -Infinity, minN: Infinity, maxN: -Infinity, minRL: Infinity, maxRL: -Infinity }
  for (const s of samples) {
    ext.minE = Math.min(ext.minE, s.mid.e)
    ext.maxE = Math.max(ext.maxE, s.mid.e)
    ext.minN = Math.min(ext.minN, s.mid.n)
    ext.maxN = Math.max(ext.maxN, s.mid.n)
    ext.minRL = Math.min(ext.minRL, s.mid.rl)
    ext.maxRL = Math.max(ext.maxRL, s.mid.rl)
  }
  return ext
}

export function buildBlockModel(samples, opts = {}) {
  const { blockE = 30, blockN = 30, blockRL = 20, radius = 70, power = 2, minSamples = 2 } = opts
  const ext = dataExtent(samples)
  const pad = blockE

  const originE = ext.minE - pad
  const originN = ext.minN - pad
  const originRL = ext.minRL - blockRL
  const nE = Math.ceil((ext.maxE + pad - originE) / blockE)
  const nN = Math.ceil((ext.maxN + pad - originN) / blockN)
  const nRL = Math.ceil((ext.maxRL + blockRL - originRL) / blockRL)

  const cell = radius
  const hash = new Map()
  const key = (i, j, k) => `${i}|${j}|${k}`
  for (const s of samples) {
    const i = Math.floor(s.mid.e / cell)
    const j = Math.floor(s.mid.n / cell)
    const k = Math.floor(s.mid.rl / cell)
    const kk = key(i, j, k)
    let bucket = hash.get(kk)
    if (!bucket) {
      bucket = []
      hash.set(kk, bucket)
    }
    bucket.push(s)
  }

  const blocks = []
  const r2 = radius * radius

  for (let bi = 0; bi < nE; bi += 1) {
    const e = originE + (bi + 0.5) * blockE
    const ci = Math.floor(e / cell)
    for (let bj = 0; bj < nN; bj += 1) {
      const n = originN + (bj + 0.5) * blockN
      const cj = Math.floor(n / cell)
      for (let bk = 0; bk < nRL; bk += 1) {
        const rl = originRL + (bk + 0.5) * blockRL
        const ck = Math.floor(rl / cell)

        let wsum = 0
        let gsum = 0
        let used = 0
        for (let di = -1; di <= 1; di += 1) {
          for (let dj = -1; dj <= 1; dj += 1) {
            for (let dk = -1; dk <= 1; dk += 1) {
              const bucket = hash.get(key(ci + di, cj + dj, ck + dk))
              if (!bucket) continue
              for (const s of bucket) {
                const dx = s.mid.e - e
                const dy = s.mid.n - n
                const dz = s.mid.rl - rl
                const d2 = dx * dx + dy * dy + dz * dz
                if (d2 > r2) continue
                const w = 1 / Math.pow(Math.max(d2, 1e-4), power / 2)
                wsum += w
                gsum += w * s.grade
                used += 1
              }
            }
          }
        }
        if (used < minSamples || wsum === 0) continue
        blocks.push({ e, n, rl, grade: gsum / wsum, samples: used })
      }
    }
  }

  return { blocks, blockE, blockN, blockRL }
}

const OZ = 31.1034768

/**
 * Tonnage roll-up above a cutoff. Gold is g/t, so contained metal is
 * tonnes × grade grams, reported as troy ounces. Density defaults to a
 * typical orogenic-host 2.7 t/m³. This is an IDW illustration, not a resource.
 */
export function resourceEstimate(model, cutoff, density = 2.7) {
  const volume = model.blockE * model.blockN * model.blockRL
  let blocks = 0
  let gradeSum = 0
  for (const b of model.blocks) {
    if (b.grade < cutoff) continue
    blocks += 1
    gradeSum += b.grade
  }
  const tonnes = blocks * volume * density
  const avgGrade = blocks ? gradeSum / blocks : 0
  const grams = tonnes * avgGrade
  return {
    blocks,
    tonnes,
    avgGrade,
    ounces: grams / OZ,
    volume: blocks * volume
  }
}

const scratch = new Color()

/** Log-scaled grade → LiDAR ramp so 1 g/t and 300 g/t both read. */
export function gradeColor(grade, target = scratch) {
  const max = data.meta.grade?.max || 50
  const t = Math.log10(1 + Math.max(0, grade)) / Math.log10(1 + max)
  return lidarColor(t, target)
}

export function gradeNorm(grade) {
  const max = data.meta.grade?.max || 50
  return Math.log10(1 + Math.max(0, grade)) / Math.log10(1 + max)
}

/**
 * Schematic Appleton Fault Zone: a vertical plane striking ~015° through the
 * survey centroid. Not a migrated seismic volume — it is the structure the
 * 2023 3-D seismic program was acquired to image, and the one the deep holes
 * were aimed at.
 */
export function appletonFaultWorld() {
  const strike = 15 * DEG
  const half = 1600 / M_PER_UNIT
  const deep = 1300 / M_PER_UNIT
  const dx = Math.sin(strike) * half
  const dz = -Math.cos(strike) * half
  return {
    a: [dx, 0.15, dz],
    b: [-dx, 0.15, -dz],
    c: [-dx, -deep, -dz],
    d: [dx, -deep, dz]
  }
}

export function formatGrade(g) {
  if (g >= 10) return `${g.toFixed(1)} g/t Au`
  return `${g.toFixed(2)} g/t Au`
}

export function formatMetres(n) {
  return `${Math.round(n).toLocaleString()} m`
}
