/**
 * Coarse Africa coastline for the executive portfolio map.
 *
 * Deliberately not a shapefile: at the scale this renders (a whole continent inside
 * a dashboard panel) a ~100-point outline is indistinguishable from full-resolution
 * GeoJSON and costs no bundle weight or parse time. Points are real [lon, lat] pairs
 * so every asset marker projects through the same transform as the coastline — a
 * mine plotted at its actual coordinates lands in the right country.
 */

export const AFRICA_OUTLINE = [
  // Mediterranean coast, west to east
  [-5.9, 35.8], [-2.2, 35.1], [0.2, 36.0], [3.1, 36.8], [6.6, 37.1], [8.6, 36.9],
  [10.3, 37.1], [10.7, 35.6], [11.1, 33.9], [13.0, 32.9], [15.2, 32.4], [17.2, 31.0],
  [18.9, 30.4], [20.1, 32.0], [21.9, 32.9], [24.0, 32.1], [26.5, 31.6], [28.9, 30.8],
  [30.1, 31.4], [31.6, 31.4], [32.3, 31.2],
  // Red Sea, north to south
  [32.6, 29.9], [33.6, 27.8], [34.6, 26.0], [35.5, 23.9], [36.9, 21.9], [37.2, 21.0],
  [38.6, 18.0], [39.1, 15.6], [41.8, 14.0], [43.3, 12.7], [43.4, 11.6],
  // Horn of Africa
  [44.9, 10.4], [47.0, 11.2], [48.9, 11.3], [51.3, 11.9], [51.1, 10.4], [50.8, 8.9],
  [49.5, 6.5], [47.9, 4.4], [46.0, 2.5], [45.3, 2.0], [43.5, 0.5], [42.0, -0.9],
  // East coast, south to the Cape
  [41.0, -2.2], [40.2, -3.0], [39.7, -4.1], [39.3, -6.8], [39.5, -8.0], [40.5, -10.4],
  [40.7, -12.5], [40.7, -14.5], [39.3, -16.5], [36.9, -18.4], [34.9, -19.9],
  [35.3, -21.5], [35.5, -23.8], [32.9, -25.9], [32.4, -28.5], [31.1, -29.9],
  [29.3, -31.5], [27.9, -33.0], [25.6, -34.0], [22.6, -34.1], [20.0, -34.8],
  [18.4, -34.4],
  // West coast, Cape northward
  [18.0, -32.7], [17.2, -30.5], [16.5, -28.6], [15.2, -26.6], [14.5, -22.9],
  [13.4, -20.0], [12.0, -18.0], [11.7, -17.3], [11.8, -15.8], [12.0, -13.8],
  [13.0, -12.6], [13.2, -8.8], [12.9, -7.0], [12.4, -6.0], [11.8, -4.6], [9.5, -2.0],
  [9.3, 0.4], [9.8, 2.0], [9.7, 4.0], [8.8, 4.4], [7.0, 4.4], [5.5, 4.3], [4.5, 6.2],
  [3.4, 6.4], [1.2, 6.1], [-0.2, 5.5], [-2.0, 4.8], [-4.0, 5.3], [-6.0, 4.8],
  [-7.7, 4.4], [-9.5, 5.9], [-11.4, 7.1], [-13.2, 8.5], [-14.7, 10.8], [-15.5, 12.0],
  [-16.6, 13.4], [-17.5, 14.7], [-16.5, 16.0], [-16.0, 18.1], [-16.3, 20.0],
  [-17.0, 21.4], [-17.1, 23.0], [-15.9, 24.8], [-14.8, 26.1], [-13.2, 27.7],
  [-11.0, 28.8], [-9.8, 30.4], [-9.3, 32.3], [-7.6, 33.6], [-6.3, 34.8]
]

export const MADAGASCAR_OUTLINE = [
  [49.4, -12.3], [50.2, -14.0], [50.5, -15.5], [49.8, -16.9], [49.4, -18.0],
  [48.6, -20.5], [47.9, -22.4], [47.1, -24.9], [45.5, -25.6], [44.0, -25.0],
  [43.3, -22.2], [43.5, -21.2], [44.5, -19.9], [44.0, -18.0], [45.2, -16.0],
  [46.4, -15.6], [47.7, -14.6], [48.4, -13.4]
]

// Equirectangular. Africa straddles the equator, so the cos(lat) distortion a proper
// projection would correct is negligible across the extent shown — and keeping the
// transform this simple means marker positions are trivially invertible for hit-tests.
export const MAP_BOUNDS = { minLon: -19, maxLon: 53, minLat: -36, maxLat: 39 }
const PX_PER_DEG = 10

export const MAP_SIZE = {
  width: (MAP_BOUNDS.maxLon - MAP_BOUNDS.minLon) * PX_PER_DEG,
  height: (MAP_BOUNDS.maxLat - MAP_BOUNDS.minLat) * PX_PER_DEG
}

export function project(lon, lat) {
  return [
    (lon - MAP_BOUNDS.minLon) * PX_PER_DEG,
    (MAP_BOUNDS.maxLat - lat) * PX_PER_DEG
  ]
}

export function toPath(points, close = true) {
  const d = points.map(([lon, lat], i) => {
    const [x, y] = project(lon, lat)
    return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`
  })
  return d.join(' ') + (close ? ' Z' : '')
}

/** Point at fraction `t` (0-1) along a lon/lat polyline, by great-circle-free arc length. */
export function pointAlong(points, t) {
  if (points.length < 2) return points[0] || [0, 0]
  const segments = []
  let total = 0
  for (let i = 0; i < points.length - 1; i += 1) {
    const len = Math.hypot(points[i + 1][0] - points[i][0], points[i + 1][1] - points[i][1])
    segments.push(len)
    total += len
  }
  let target = Math.max(0, Math.min(1, t)) * total
  for (let i = 0; i < segments.length; i += 1) {
    if (target <= segments[i] || i === segments.length - 1) {
      const f = segments[i] === 0 ? 0 : target / segments[i]
      return [
        points[i][0] + (points[i + 1][0] - points[i][0]) * f,
        points[i][1] + (points[i + 1][1] - points[i][1]) * f
      ]
    }
    target -= segments[i]
  }
  return points[points.length - 1]
}

/**
 * Projected heading in radians at fraction `t` along a lon/lat polyline, measured in
 * SVG space (y grows downward). Used to point a vehicle glyph along its route.
 */
export function headingAlong(points, t) {
  const eps = 0.004
  const [alon, alat] = pointAlong(points, Math.max(0, t - eps))
  const [blon, blat] = pointAlong(points, Math.min(1, t + eps))
  const [ax, ay] = project(alon, alat)
  const [bx, by] = project(blon, blat)
  return Math.atan2(by - ay, bx - ax)
}
