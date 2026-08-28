import { clampToQuarry } from './quarryTerrain'

const poses = new Map()
export const FLEET_GAP = 1.35

export function clearFleetPose(id) {
  poses.delete(id)
}

export function mapTooClose(id, mapX, mapY, gap = 18) {
  let close = false
  poses.forEach((pose, otherId) => {
    if (otherId === id || pose.mapX == null) return
    if (Math.hypot(mapX - pose.mapX, mapY - pose.mapY) < gap) close = true
  })
  return close
}

export function separateFleet(id, x, z, radius, mapX, mapY) {
  let ax = x
  let az = z
  poses.forEach((pose, otherId) => {
    if (otherId === id) return
    const dx = ax - pose.x
    const dz = az - pose.z
    const dist = Math.hypot(dx, dz)
    const min = Math.max(radius + pose.r, FLEET_GAP)
    if (dist >= min || dist < 1e-5) return
    const push = (min - dist) / dist
    ax += dx * push
    az += dz * push
  })
  const [sx, sz] = clampToQuarry(ax, az)
  poses.set(id, { x: sx, z: sz, r: radius, mapX, mapY })
  return [sx, sz]
}
