import borders from './africaBorders.json'
import { MAP_BOUNDS, project, toPath } from './africaGeo'

/**
 * Real African country geometry, pre-projected into SVG path strings at module load.
 *
 * Replaces the hand-typed continent outline: 55 countries with actual borders, coastline
 * and islands, baked from Natural Earth 1:50m by scripts/bake-africa-borders.mjs.
 */
export const COUNTRY_SHAPES = borders.countries.map(c => ({
  id: c.id,
  name: c.name,
  d: c.rings.map(ring => toPath(ring)).join(' ')
}))

/**
 * Assets carry ISO alpha-2; the baked borders carry ISO numeric. Mapped explicitly
 * rather than by name — Natural Earth calls the DRC "Dem. Rep. Congo", so name
 * matching silently fails on exactly the country we have assets in.
 */
const ALPHA2_TO_ISO = {
  MZ: 508,
  ZM: 894,
  CD: 180,
  ZA: 710,
  NA: 516,
  TZ: 834,
  GH: 288,
  GN: 324
}

export function isoForAlpha2(code) {
  return ALPHA2_TO_ISO[code]
}

/** 10-degree graticule, drawn under the land to give the ocean some depth. */
export const GRATICULE = (() => {
  const lines = []
  const step = 10
  const startLon = Math.ceil(MAP_BOUNDS.minLon / step) * step
  for (let lon = startLon; lon <= MAP_BOUNDS.maxLon; lon += step) {
    const [x] = project(lon, 0)
    lines.push(`M${x.toFixed(1)} 0 L${x.toFixed(1)} ${((MAP_BOUNDS.maxLat - MAP_BOUNDS.minLat) * 10).toFixed(1)}`)
  }
  const startLat = Math.ceil(MAP_BOUNDS.minLat / step) * step
  for (let lat = startLat; lat <= MAP_BOUNDS.maxLat; lat += step) {
    const [, y] = project(0, lat)
    lines.push(`M0 ${y.toFixed(1)} L${((MAP_BOUNDS.maxLon - MAP_BOUNDS.minLon) * 10).toFixed(1)} ${y.toFixed(1)}`)
  }
  return lines.join(' ')
})()

export const BORDERS_SOURCE = borders.source
