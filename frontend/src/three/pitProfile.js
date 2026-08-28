import { Color } from 'three'
import { SITE, BENCHES } from '../data/catalog'

export const PIT_RADIUS = 5.35
export const PIT_GROUND_RADIUS = 7.1
export const PIT_FLOOR_RADIUS = 1.05
export const PIT_DEPTH = 3.35

const DEPTH_COLOR_STOPS = [
  [0, '#1d4ed8'],
  [0.16, '#0ea5e9'],
  [0.32, '#10b981'],
  [0.48, '#a3e635'],
  [0.64, '#facc15'],
  [0.8, '#f97316'],
  [1, '#dc2626']
]

export function elevationToT(elevation) {
  const { rim, floor } = SITE.elevation
  return (elevation - floor) / (rim - floor)
}

export function elevationToY(elevation) {
  return -PIT_DEPTH * (1 - elevationToT(elevation))
}

export function depthColor(t) {
  const clamped = Math.min(1, Math.max(0, t))
  let lo = DEPTH_COLOR_STOPS[0]
  let hi = DEPTH_COLOR_STOPS[DEPTH_COLOR_STOPS.length - 1]
  for (let i = 0; i < DEPTH_COLOR_STOPS.length - 1; i += 1) {
    if (clamped >= DEPTH_COLOR_STOPS[i][0] && clamped <= DEPTH_COLOR_STOPS[i + 1][0]) {
      lo = DEPTH_COLOR_STOPS[i]
      hi = DEPTH_COLOR_STOPS[i + 1]
      break
    }
  }
  const span = hi[0] - lo[0] || 1
  const localT = (clamped - lo[0]) / span
  return new Color(lo[1]).lerp(new Color(hi[1]), localT)
}

// Rim-to-floor list of {elevation, radius}, deduping near-identical bench elevations
// (e.g. Bench 4 North / South) so the terraced profile doesn't get zero-height steps.
export function buildPitLevels() {
  const sortedBenches = [...BENCHES].sort((a, b) => b.elevation - a.elevation)
  const raw = [SITE.elevation.rim, ...sortedBenches.map(b => b.elevation), SITE.elevation.floor]
  const elevations = []
  raw.forEach(e => {
    if (!elevations.length || Math.abs(elevations[elevations.length - 1] - e) > 5) elevations.push(e)
  })
  const n = elevations.length
  return elevations.map((elevation, i) => ({
    elevation,
    radius: PIT_FLOOR_RADIUS + (PIT_RADIUS - PIT_FLOOR_RADIUS) * (1 - i / (n - 1))
  }))
}

export function radiusForElevation(elevation, levels) {
  if (elevation >= levels[0].elevation) return levels[0].radius
  if (elevation <= levels[levels.length - 1].elevation) return levels[levels.length - 1].radius
  for (let i = 0; i < levels.length - 1; i += 1) {
    const a = levels[i]
    const b = levels[i + 1]
    if (elevation <= a.elevation && elevation >= b.elevation) {
      const span = a.elevation - b.elevation || 1
      const t = (a.elevation - elevation) / span
      return a.radius + (b.radius - a.radius) * t
    }
  }
  return levels[levels.length - 1].radius
}

export function elevationForBenchName(name) {
  const bench = BENCHES.find(b => b.name === name)
  if (bench) return bench.elevation
  const key = (name || '').toLowerCase()
  if (key.includes('floor')) return SITE.elevation.floor + 40
  if (key.includes('crusher') || key.includes('rom') || key.includes('workshop') || key.includes('haul')) {
    return SITE.elevation.rim
  }
  return SITE.elevation.rim
}

export function nearestPitLevel(elevation, levels) {
  let best = levels[0]
  let bestDist = Infinity
  levels.forEach(level => {
    const dist = Math.abs(level.elevation - elevation)
    if (dist < bestDist) {
      best = level
      bestDist = dist
    }
  })
  return best
}

export function benchRadius(level, levels, t = 0.55) {
  const idx = levels.indexOf(level)
  const next = levels[idx + 1]
  if (!next) return Math.max(0.35, level.radius * 0.72)
  return next.radius + (level.radius - next.radius) * t
}

const BENCH_SURFACE_LIFT = 0.028

export function pitWorldPosition(x, y, elevation, levels, radiusBias = 0) {
  const level = nearestPitLevel(elevation ?? levels[0].elevation, levels)
  const worldY = elevationToY(level.elevation) + BENCH_SURFACE_LIFT
  const radius = benchRadius(level, levels) + radiusBias
  const nx = (x - 50) / 50
  const nz = (y - 50) / 50
  const len = Math.hypot(nx, nz) || 1
  return [(nx / len) * radius, worldY, (nz / len) * radius]
}

export function pitMarkerPosition(x, y, benchOrZoneName, levels) {
  return pitWorldPosition(x, y, elevationForBenchName(benchOrZoneName), levels)
}

export function headingY(from, to) {
  const dx = to[0] - from[0]
  const dz = to[2] - from[2]
  if (Math.hypot(dx, dz) < 1e-5) return null
  return Math.atan2(dx, dz)
}
