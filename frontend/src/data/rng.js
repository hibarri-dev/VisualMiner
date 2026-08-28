/** Deterministic PRNG so dummy IDs and telemetry stay stable across reloads. */
export function mulberry32(seed) {
  let a = seed >>> 0
  return function rng() {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function pick(rng, list) {
  return list[Math.floor(rng() * list.length)]
}

export function randInt(rng, min, max) {
  return min + Math.floor(rng() * (max - min + 1))
}

export function randFloat(rng, min, max, digits = 1) {
  const n = min + rng() * (max - min)
  const f = 10 ** digits
  return Math.round(n * f) / f
}

export function clamp(n, min, max) {
  return Math.min(max, Math.max(min, n))
}

export function uniqueCode(rng, used, length = 7) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let id = ''
  do {
    id = ''
    for (let i = 0; i < length; i += 1) {
      id += chars[Math.floor(rng() * chars.length)]
    }
  } while (used.has(id))
  used.add(id)
  return id
}

export function slugify(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export function jitter(rng, value, spread) {
  return value + (rng() - 0.5) * 2 * spread
}
