import data from './terrain-height.json'

export const GEO_HALF_W = 7.2
export const GEO_HALF_D = GEO_HALF_W * (data.rows / data.cols)
export const GEO_RELIEF = 2.75
export const SCAN_RELIEF = 1.65

const { cols, rows, heights, zMin, zMax } = data
const zSpan = zMax - zMin || 1

export const terrainCols = cols
export const terrainRows = rows
export const terrainHeights = heights
export const terrainZMin = zMin
export const terrainZMax = zMax

function rawHeight(ix, iz) {
  const x = Math.max(0, Math.min(cols - 1, ix))
  const z = Math.max(0, Math.min(rows - 1, iz))
  return heights[z * cols + x]
}

export function sampleGeoHeight(x, z, relief = GEO_RELIEF) {
  const u = (x / GEO_HALF_W + 1) * 0.5
  const v = (z / GEO_HALF_D + 1) * 0.5
  const fx = Math.max(0, Math.min(cols - 1.001, u * (cols - 1)))
  const fz = Math.max(0, Math.min(rows - 1.001, v * (rows - 1)))
  const x0 = Math.floor(fx)
  const z0 = Math.floor(fz)
  const tx = fx - x0
  const tz = fz - z0
  const h =
    rawHeight(x0, z0) * (1 - tx) * (1 - tz) +
    rawHeight(x0 + 1, z0) * tx * (1 - tz) +
    rawHeight(x0, z0 + 1) * (1 - tx) * tz +
    rawHeight(x0 + 1, z0 + 1) * tx * tz
  return ((h - zMin) / zSpan) * relief
}

export function geoMarkerPosition(mapX, mapY, relief = GEO_RELIEF) {
  const x = ((mapX - 50) / 50) * GEO_HALF_W
  const z = ((mapY - 50) / 50) * GEO_HALF_D
  return [x, sampleGeoHeight(x, z, relief), z]
}
