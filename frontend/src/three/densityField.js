import { buildBlockModel, buildIntervalSamples, dataExtent } from './oreBody'
import { quarryExtent } from './quarryTerrain'

/**
 * Mineral-density field for the LiDAR view.
 *
 * The point cloud used to be coloured by height, which makes it a depth model —
 * useful for volumes and bench survey, useless for deciding where to dig. This
 * builds the other half: an interpolated grade (g/t Au) field from the drillhole
 * assays in `drillholes.json`, so the same scan can be shaded by what is *in* the
 * rock rather than how far down it sits.
 *
 * The assay data is the public Queensway NI 43-101 composite set — a ~2.2 x 3.0 km
 * footprint over 1,245 vertical metres. The quarry tile the scene renders is only
 * ~600 x 820 m, so the block model is fitted onto the tile (uniform horizontal
 * scale, aspect preserved) and the RL range is stretched down into the empty space
 * below the terrain. It is a modelled IDW field draped onto a demo pit, not a
 * survey of this specific quarry — see `FIELD_NOTE`.
 */

export const FIELD_NOTE =
  'IDW block model from public NI 43-101 drillhole assays, fitted to the scanned tile. Modelled grade, not a resource estimate.'

// Fraction of the quarry tile the ore-body footprint is allowed to occupy. Leaves
// a margin so the shoots read as a body inside the pit rather than a full-bleed slab.
const HORIZ_FILL = 0.82
// World-Y the top of the assayed interval maps to. Sits just under the lowest
// terrain height (0.90) so ore never pokes through the surface skin.
const TOP_Y = 0.72
const BOTTOM_Y = -3.6

const BLOCK = { blockE: 45, blockN: 45, blockRL: 35, radius: 130, power: 2, minSamples: 1 }

let cached = null

function build() {
  const samples = buildIntervalSamples()
  const model = buildBlockModel(samples, BLOCK)
  const ext = dataExtent(samples)

  const spanE = Math.max(1, ext.maxE - ext.minE)
  const spanN = Math.max(1, ext.maxN - ext.minN)
  const midE = (ext.minE + ext.maxE) / 2
  const midN = (ext.minN + ext.maxN) / 2

  // One horizontal scale for both axes, chosen so the longer axis is the one that
  // hits the fill limit. Scaling E and N independently would shear the shoots.
  const unitsPerMetre = Math.min(
    (quarryExtent.halfW * 2 * HORIZ_FILL) / spanE,
    (quarryExtent.halfD * 2 * HORIZ_FILL) / spanN
  )

  const topRL = ext.maxRL
  const spanRL = Math.max(1, ext.maxRL - ext.minRL)
  const yPerMetre = (TOP_Y - BOTTOM_Y) / spanRL

  const toWorld = (e, n, rl) => [
    (e - midE) * unitsPerMetre,
    TOP_Y - (topRL - rl) * yPerMetre,
    -(n - midN) * unitsPerMetre
  ]

  const blocks = model.blocks.map(b => {
    const [x, y, z] = toWorld(b.e, b.n, b.rl)
    return { x, y, z, grade: b.grade, samples: b.samples }
  })

  let maxGrade = 0
  for (const b of blocks) maxGrade = Math.max(maxGrade, b.grade)

  // Column raster: for every (x, z) cell, the richest grade anywhere in the column
  // beneath it. This is what tints the surface cloud, so a hot shoot at depth shows
  // as a hot patch of ground directly above it.
  const cols = 96
  const rows = 96
  const column = new Float32Array(cols * rows)
  const halfX = (spanE / 2) * unitsPerMetre
  const halfZ = (spanN / 2) * unitsPerMetre
  const cellX = (halfX * 2) / cols
  const cellZ = (halfZ * 2) / rows
  // Smear each block over a small footprint — the block grid is coarser than the
  // raster, so writing single cells would leave a visible waffle pattern.
  const smear = Math.ceil((BLOCK.blockE * unitsPerMetre) / cellX)

  for (const b of blocks) {
    const ix = Math.round((b.x + halfX) / cellX)
    const iz = Math.round((b.z + halfZ) / cellZ)
    for (let dz = -smear; dz <= smear; dz += 1) {
      for (let dx = -smear; dx <= smear; dx += 1) {
        const cx = ix + dx
        const cz = iz + dz
        if (cx < 0 || cz < 0 || cx >= cols || cz >= rows) continue
        // Falloff so the halo fades outward instead of ending on a hard square.
        const fall = 1 - Math.min(1, Math.hypot(dx, dz) / (smear + 1))
        const v = b.grade * fall
        const i = cz * cols + cx
        if (v > column[i]) column[i] = v
      }
    }
  }

  return { blocks, column, cols, rows, halfX, halfZ, cellX, cellZ, maxGrade, unitsPerMetre, toWorld }
}

export function densityField() {
  if (!cached) cached = build()
  return cached
}

/** Richest modelled grade (g/t) in the rock column under a surface point. */
export function columnGrade(x, z) {
  const f = densityField()
  const ix = Math.floor((x + f.halfX) / f.cellX)
  const iz = Math.floor((z + f.halfZ) / f.cellZ)
  if (ix < 0 || iz < 0 || ix >= f.cols || iz >= f.rows) return 0
  return f.column[iz * f.cols + ix]
}

/** Subsurface blocks at or above `cutoff` g/t, already in scene world space. */
export function oreBlocks(cutoff = 1) {
  return densityField().blocks.filter(b => b.grade >= cutoff)
}
