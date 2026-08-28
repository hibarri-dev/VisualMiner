/**
 * Normalises a standard collar/survey/assay drillhole export into the compact JSON
 * the 3D exploration view consumes.
 *
 * This is the "Phase 0" ingestion path from the Data Integration Roadmap: it takes
 * the same three-table schema that Micromine / Vulcan / Leapfrog / Datamine all
 * export, and that JORC and NI 43-101 technical reports tabulate, and emits
 * spatial-vector + document records. Point it at a different export (a real GSQ /
 * WAMEX / SARIG download, or a drillhole table lifted from an ASX or SEDAR+ filing)
 * and nothing downstream has to change.
 *
 *   node scripts/bake-drillholes.mjs <dir-with-collar,survey,assay.csv> [--sep ';'] [--element NI]
 */
import fs from 'node:fs'
import path from 'node:path'

const args = process.argv.slice(2)
const srcDir = args[0]
if (!srcDir) throw new Error('usage: bake-drillholes.mjs <dir> [--sep ;] [--element NI]')
const sepArg = args.indexOf('--sep')
const SEP = sepArg > -1 ? args[sepArg + 1] : ';'
const elArg = args.indexOf('--element')
const ELEMENT = elArg > -1 ? args[elArg + 1] : 'NI'

const OUT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../src/data/drillholes.json')

function readCsv(file) {
  const text = fs.readFileSync(path.join(srcDir, file), 'utf8').trim()
  const [head, ...rows] = text.split(/\r?\n/)
  const cols = head.split(SEP).map(c => c.trim())
  return rows.filter(Boolean).map(line => {
    const cells = line.split(SEP)
    const rec = {}
    cols.forEach((c, i) => { rec[c] = (cells[i] ?? '').trim() })
    return rec
  })
}

const num = v => { const n = Number(v); return Number.isFinite(n) ? n : null }
const pick = (rec, ...names) => {
  for (const n of names) {
    const hit = Object.keys(rec).find(k => k.toLowerCase() === n.toLowerCase())
    if (hit !== undefined) return rec[hit]
  }
  return undefined
}

const collarRows = readCsv('collar.csv')
const surveyRows = readCsv('survey.csv')
const assayRows = readCsv('assay.csv')

// --- collars -------------------------------------------------------------
const collars = collarRows.map(r => ({
  id: pick(r, 'Hole_ID', 'HOLEID', 'DHID', 'hole_id'),
  x: num(pick(r, 'X', 'EAST', 'Easting')),
  y: num(pick(r, 'Y', 'NORTH', 'Northing')),
  z: num(pick(r, 'Z', 'RL', 'Elevation'))
})).filter(c => c.id && c.x != null && c.y != null && c.z != null)

// Localise to the survey centroid: source grids are UTM-style (7-figure northings),
// which blow past float32 precision once they reach the GPU.
const cx = collars.reduce((s, c) => s + c.x, 0) / collars.length
const cy = collars.reduce((s, c) => s + c.y, 0) / collars.length
const zTop = Math.max(...collars.map(c => c.z))

// --- survey (hole orientation) ------------------------------------------
const survey = new Map()
surveyRows.forEach(r => {
  const id = pick(r, 'Hole_ID', 'HOLEID', 'DHID', 'hole_id')
  if (!id) return
  const depth = num(pick(r, 'Depth', 'DEPTH', 'AT'))
  const dip = num(pick(r, 'Dip', 'DIP'))
  const azi = num(pick(r, 'Azimuth', 'AZIMUTH', 'AZI'))
  if (!survey.has(id)) survey.set(id, [])
  survey.get(id).push({ depth: depth ?? 0, dip: dip ?? -90, azi: azi ?? 0 })
})
survey.forEach(list => list.sort((a, b) => a.depth - b.depth))

// --- assays --------------------------------------------------------------
// Physically impossible grades are kept but flagged rather than silently dropped:
// a % assay above 100 is a transcription error, and quietly deleting rows from a
// resource dataset is exactly the kind of thing that invalidates an estimate.
const GRADE_CEILING = ELEMENT === 'Au' || ELEMENT === 'AU' ? 1e6 : 100
const intervals = []
let suspect = 0
assayRows.forEach(r => {
  const id = pick(r, 'Hole_ID', 'HOLEID', 'DHID', 'hole_id')
  const from = num(pick(r, 'depth_from', 'FROM', 'From'))
  const to = num(pick(r, 'depth_to', 'TO', 'To'))
  const grade = num(pick(r, ELEMENT, ELEMENT.toLowerCase(), 'GRADE', 'VALUE'))
  if (!id || from == null || to == null || grade == null) return
  const bad = grade > GRADE_CEILING || grade < 0
  if (bad) suspect += 1
  intervals.push({ id, from, to, grade, ...(bad ? { suspect: true } : {}) })
})

const clean = intervals.filter(i => !i.suspect).map(i => i.grade).sort((a, b) => a - b)
const q = p => clean[Math.floor(p * (clean.length - 1))]

const payload = {
  meta: {
    element: ELEMENT,
    unit: '%',
    holeCount: collars.length,
    intervalCount: intervals.length,
    suspectCount: suspect,
    origin: { easting: cx, northing: cy, topRL: zTop },
    grade: { min: q(0), p50: q(0.5), p90: q(0.9), p99: q(0.99), max: q(1) },
    bakedAt: new Date().toISOString().slice(0, 10)
  },
  collars: collars.map(c => ({
    id: c.id,
    x: +(c.x - cx).toFixed(2),
    y: +(c.y - cy).toFixed(2),
    z: +c.z.toFixed(2),
    survey: (survey.get(c.id) || [{ depth: 0, dip: -90, azi: 0 }]).map(s => ({
      d: +s.depth.toFixed(1), dip: +s.dip.toFixed(1), azi: +s.azi.toFixed(1)
    }))
  })),
  intervals: intervals.map(i => ({
    id: i.id, f: +i.from.toFixed(2), t: +i.to.toFixed(2), g: +i.grade.toFixed(3),
    ...(i.suspect ? { s: 1 } : {})
  }))
}

fs.writeFileSync(OUT, JSON.stringify(payload))
console.log('holes', payload.collars.length, 'intervals', payload.intervals.length, 'suspect', suspect)
console.log('grade p50', payload.meta.grade.p50, 'p90', payload.meta.grade.p90, 'max(clean)', payload.meta.grade.max)
console.log('wrote', OUT, (fs.statSync(OUT).size / 1024).toFixed(0) + 'KB')
