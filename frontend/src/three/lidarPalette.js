import { Color } from 'three'

// Colorized-LiDAR / false-colour elevation ramp: deep indigo at the pit floor
// climbing through cyan and green to hot orange-red on the high benches. Chosen to
// read the same way an intensity-mapped laser scan does, not as a literal material.
const STOPS = [
  [0, '#10036b'],
  [0.15, '#1560ff'],
  [0.32, '#00d4e8'],
  [0.48, '#22e07a'],
  [0.62, '#c8f024'],
  [0.75, '#ffd21e'],
  [0.87, '#ff7a18'],
  [1, '#ff2d2d']
]

const PARSED = STOPS.map(([at, hex]) => [at, new Color(hex)])

export function lidarColor(t, target = new Color()) {
  const clamped = Math.min(1, Math.max(0, t))
  let lo = PARSED[0]
  let hi = PARSED[PARSED.length - 1]
  for (let i = 0; i < PARSED.length - 1; i += 1) {
    if (clamped >= PARSED[i][0] && clamped <= PARSED[i + 1][0]) {
      lo = PARSED[i]
      hi = PARSED[i + 1]
      break
    }
  }
  const span = hi[0] - lo[0] || 1
  return target.copy(lo[1]).lerp(hi[1], (clamped - lo[0]) / span)
}

export const LIDAR_BG = '#03060c'
