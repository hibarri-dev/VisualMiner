/**
 * Bakes real African country borders into src/data/africaBorders.json.
 *
 * The portfolio map used to draw the continent as a single ~100-point blob with country
 * names floated on top, which reads as a diagram rather than a map. This pulls actual
 * Natural Earth geometry (via world-atlas) so borders, coastline and islands are real.
 *
 * Baked at dev time, not fetched at runtime: the demo has to work on a venue network,
 * and this keeps topojson out of the app bundle entirely.
 *
 *   node scripts/bake-africa-borders.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { feature } from 'topojson-client'

const require = createRequire(import.meta.url)

// ISO 3166-1 numeric for the African states. An explicit list rather than a bounding
// box, which would drag in southern Europe and the Arabian peninsula.
const AFRICA_ISO = new Set([
  12, 24, 72, 108, 120, 132, 140, 148, 174, 178, 180, 204, 226, 231, 232, 262, 266,
  270, 288, 324, 384, 404, 426, 430, 434, 450, 454, 466, 478, 480, 504, 508, 516,
  562, 566, 624, 646, 678, 686, 690, 694, 706, 710, 716, 728, 729, 732, 748, 768,
  788, 800, 818, 834, 854, 894
])

const PRECISION = 2 // ~1 km at the equator; far finer than this map ever renders

const topo = JSON.parse(readFileSync(require.resolve('world-atlas/countries-50m.json'), 'utf8'))
const fc = feature(topo, topo.objects.countries)

const round = n => +n.toFixed(PRECISION)

/** Drop rings too small to be visible, and de-duplicate points collapsed by rounding. */
function cleanRing(ring) {
  const out = []
  for (const [lon, lat] of ring) {
    const p = [round(lon), round(lat)]
    const last = out[out.length - 1]
    if (!last || last[0] !== p[0] || last[1] !== p[1]) out.push(p)
  }
  return out.length >= 4 ? out : null
}

function ringsOf(geometry) {
  const polys = geometry.type === 'Polygon' ? [geometry.coordinates] : geometry.coordinates
  const rings = []
  for (const poly of polys) {
    // Outer ring only — holes (enclaves like Lesotho) are drawn by their own country.
    const cleaned = cleanRing(poly[0])
    if (cleaned) rings.push(cleaned)
  }
  return rings
}

const countries = []
for (const f of fc.features) {
  const id = Number(f.id)
  if (!AFRICA_ISO.has(id)) continue
  const rings = ringsOf(f.geometry)
  if (!rings.length) continue
  countries.push({ id, name: f.properties.name, rings })
}

countries.sort((a, b) => a.name.localeCompare(b.name))

const points = countries.reduce((s, c) => s + c.rings.reduce((n, r) => n + r.length, 0), 0)
const out = {
  source: 'Natural Earth 1:50m via world-atlas, baked ' + new Date().toISOString().slice(0, 10),
  countryCount: countries.length,
  pointCount: points,
  countries
}

writeFileSync(new URL('../src/data/africaBorders.json', import.meta.url), JSON.stringify(out))
console.log(`baked ${countries.length} countries, ${points} points`)
