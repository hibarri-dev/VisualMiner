/**
 * Phase 0 bake: public NI 43-101 drill tables → compact drillholes.json.
 *
 * Source is New Found Gold Corp. (TSX-V: NFG, NYSE-A: NFGC) Queensway Project —
 * a listed explorer with no operating mine. Tables are transcribed from SEC
 * Exhibit 99.1 filings (investor drill results + 3-D seismic targeting).
 *
 *   node scripts/bake-queensway.mjs
 */
import fs from 'node:fs'
import path from 'node:path'

const OUT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../src/data/drillholes.json')

// Collar RL is not published in these releases. Queensway North sits on a low
// plateau west of Gander; a constant 115 m AMSL keeps relative geometry honest.
const RL = 115

const FILINGS = [
  {
    id: 'nfg-2024-07-11',
    date: '2024-07-11',
    title: 'Nine new gold zones to 820 m — first deep holes from 3-D seismic',
    url: 'https://www.sec.gov/Archives/edgar/data/1840616/000127956924000885/ex991.htm',
    kind: 'NI 43-101 drill + seismic'
  },
  {
    id: 'nfg-2024-10-31',
    date: '2024-10-31',
    title: 'Golden Dome discovery: 343 g/t Au over 2.15 m',
    url: 'https://www.sec.gov/Archives/edgar/data/1840616/000127956924001299/ex991.htm',
    kind: 'NI 43-101 drill'
  },
  {
    id: 'nfg-2025-04-29',
    date: '2025-04-29',
    title: '38.7 g/t Au over 6.55 m at Dome; deepest intercept 1,150 m',
    url: 'https://www.sec.gov/Archives/edgar/data/1840616/000127956925000431/ex991.htm',
    kind: 'NI 43-101 drill + seismic follow-up'
  }
]

// Hole_ID, azi, dip, length_m, utm_e, utm_n, prospect, seismic_target
const COLLARS = [
  ['NFGC-21-469', 298, -57, 1556, 658318, 5427234, 'Keats', false],
  ['NFGC-22-808', 120, -45, 881, 658058, 5428076, 'Keats West', true],
  ['NFGC-23-1268', 300, -45, 1234, 658513, 5427870, 'Iceberg', false],
  ['NFGC-23-1304', 300, -45, 1247, 658432, 5427632, 'Iceberg', false],
  ['NFGC-23-1838', 299, -45.5, 1058, 658385, 5427800, 'Iceberg', false],
  ['NFGC-24-2080', 294, -54, 1022, 658843, 5427624, 'Iceberg East', true],
  ['NFGC-24-2083', 308, -59, 945, 659509, 5429493, 'Jackpot', true],
  ['NFGC-24-2090A', 274, -48, 881, 659370, 5429020, 'Lotto North', true],
  ['NFGC-24-2092', 120, -69, 1121, 657841, 5428443, 'Little Zone', true],
  ['NFGC-24-2093A', 299, -61, 986, 659107, 5427814, 'Iceberg East', true],
  ['NFGC-24-2094', 62, -67, 641, 658671, 5429398, 'Monte Carlo', true],
  ['NFGC-24-2096', 335, -45, 350, 659364, 5428536, 'Iceberg Alley', false],
  ['NFGC-24-2098', 335, -45, 233, 659416, 5428618, 'Iceberg Alley', false],
  ['NFGC-24-2100', 335, -45, 296, 659505, 5428620, 'Iceberg Alley', false],
  ['NFGC-24-2101A', 282, -52.5, 1112, 658075, 5426899, 'Keats South', true],
  ['NFGC-24-2103B', 335, -59, 563, 658102, 5427995, 'Keats West', false],
  ['NFGC-24-2104', 268, -45.5, 251, 659512, 5428796, 'Iceberg Alley', false],
  ['NFGC-24-2106', 335, -45, 203, 659233, 5428640, 'Iceberg Alley', false],
  ['NFGC-24-2112', 320, -50, 1157, 657840, 5426411, 'Keats South', false],
  ['NFGC-24-2112-W1', 320, -50, 1136, 657840, 5426411, 'Keats South', false],
  ['NFGC-24-2112-W2', 319, -49, 1121, 657840, 5426411, 'Keats South', false],
  ['NFGC-24-2112-W3', 319, -49, 1121, 657840, 5426411, 'Keats South', false],
  ['NFGC-24-2112-W4', 320, -50, 882, 657840, 5426411, 'Keats South', false],
  ['NFGC-24-2112-W5', 320, -50, 1091, 657840, 5426411, 'Keats South', false],
  ['NFGC-24-2117C', 268, -61.5, 1169, 659373, 5429026, 'Lotto North', true],
  ['NFGC-24-2123', 285, -48, 1541, 657952, 5426405, 'Keats South', false],
  ['NFGC-24-2135', 119, -69, 929, 657670, 5427896, 'Keats West', false],
  ['NFGC-24-2146', 300, -45, 203, 658281, 5426623, 'Keats South', false],
  ['NFGC-24-2148', 300, -45, 173, 658200, 5426555, 'Keats South', false],
  ['NFGC-24-2154', 300, -45, 431, 658941, 5428647, 'Dome', false],
  ['NFGC-24-2157', 294, -48, 1142, 657953, 5426406, 'Keats South', false],
  ['NFGC-24-2158', 300, -45, 578, 658854, 5428376, 'Dome', false],
  ['NFGC-24-2168', 300, -45, 1178, 658264, 5427319, 'Keats', false],
  ['NFGC-24-2169', 300, -45, 710, 658826, 5427912, 'Iceberg East', true],
  ['NFGC-24-2175', 116, -58, 227, 658019, 5427962, 'Keats West', false],
  ['NFGC-24-2189', 119, -60, 746, 657498, 5427556, 'Cokes', false],
  ['NFGC-24-2229', 93, -56.5, 596, 658233, 5428564, 'Powerline', false],
  ['NFGC-24-2234', 305, -45, 449, 658882, 5428465, 'Road', false],
  ['NFGC-24-2236', 297, -55, 287, 658799, 5428602, 'Dome', false],
  ['NFGC-24-2238', 300, -50, 329, 658816, 5428566, 'Dome', false]
]

// Composite intervals only (parent / "And" rows). Nested "Including" rows are
// skipped so the IDW pass does not double-count high-grade cores.
const ASSAYS = [
  ['NFGC-24-2112', 772.05, 774.7, 10.98, 'Keats South Deep'],
  ['NFGC-24-2112', 915.4, 917.45, 1.98, 'Keats South Deep'],
  ['NFGC-24-2112', 919.25, 923.95, 2.17, 'Keats South Deep'],
  ['NFGC-24-2112', 936.7, 940.2, 1.69, 'Keats South Deep'],
  ['NFGC-24-2112', 1016.5, 1019.2, 7.66, 'Keats South Deep'],
  ['NFGC-23-1304', 768.4, 770.55, 3.27, 'Iceberg-AFZ Deep'],
  ['NFGC-23-1304', 829.85, 832.0, 12.01, 'Iceberg-AFZ Deep'],
  ['NFGC-23-1304', 842.6, 845.0, 1.01, 'Iceberg-AFZ Deep'],
  ['NFGC-23-1304', 960.3, 962.65, 1.16, 'Iceberg-AFZ Deep'],
  ['NFGC-24-2103B', 7.0, 22.45, 3.34, 'Keats West'],
  ['NFGC-24-2103B', 44.0, 59.35, 3.71, 'Keats West'],
  ['NFGC-24-2094', 19.85, 22.35, 1.15, 'Monte Carlo'],
  ['NFGC-24-2094', 254.1, 256.45, 2.17, 'Unknown'],
  ['NFGC-24-2094', 336.2, 338.5, 1.11, 'K2 Deep'],
  ['NFGC-24-2094', 594.2, 601.2, 1.5, 'Deep Seismic Target'],
  ['NFGC-24-2158', 482.1, 489.55, 9.51, 'Golden Dome'],
  ['NFGC-24-2158', 492.35, 494.5, 343.12, 'Golden Dome'],
  ['NFGC-24-2158', 511.0, 513.2, 40.59, 'Golden Dome'],
  ['NFGC-24-2158', 520.65, 523.35, 1.45, 'Golden Dome'],
  ['NFGC-23-1268', 1045.55, 1048.0, 1.96, 'Iceberg-AFZ Deep'],
  ['NFGC-23-1268', 1061.0, 1063.0, 2.9, 'Iceberg-AFZ Deep'],
  ['NFGC-23-1838', 14.1, 19.95, 40.51, 'Iceberg'],
  ['NFGC-23-1838', 214.9, 217.6, 12.97, 'Keats North'],
  ['NFGC-23-1838', 224.0, 226.1, 2.21, 'Keats North'],
  ['NFGC-23-1838', 946.65, 949.55, 1.04, 'Iceberg-AFZ Deep'],
  ['NFGC-24-2106', 35.1, 37.45, 1.14, 'Iceberg Alley'],
  ['NFGC-24-2135', 536.05, 538.75, 1.21, 'Keats-AFZ Deep'],
  ['NFGC-24-2135', 561.65, 566.5, 13.68, 'Keats-AFZ Deep'],
  ['NFGC-24-2135', 607.8, 610.0, 1.17, 'Keats-AFZ Deep'],
  ['NFGC-24-2135', 649.35, 651.65, 1.23, 'Keats-AFZ Deep'],
  ['NFGC-24-2112-W1', 850.7, 852.9, 23.31, 'Keats South Deep'],
  ['NFGC-24-2112-W1', 924.55, 926.9, 2.79, 'Keats South Deep'],
  ['NFGC-24-2112-W1', 944.6, 947.0, 1.14, 'Keats South Deep'],
  ['NFGC-24-2112-W2', 886.6, 888.6, 1.15, 'Keats South Deep'],
  ['NFGC-24-2112-W2', 892.25, 895.2, 1.61, 'Keats South Deep'],
  ['NFGC-24-2112-W2', 921.85, 924.6, 1.64, 'Keats South Deep'],
  ['NFGC-24-2112-W3', 880.15, 882.45, 2.51, 'Keats South Deep'],
  ['NFGC-24-2112-W3', 988.65, 995.85, 1.97, 'Keats South Deep'],
  ['NFGC-24-2112-W3', 1016.7, 1019.25, 1.14, 'Keats South Deep'],
  ['NFGC-24-2112-W3', 1037.85, 1039.85, 1.26, 'Keats South Deep'],
  ['NFGC-24-2123', 1446.75, 1449.4, 2.64, 'Keats South Deep'],
  ['NFGC-24-2112-W4', 852.75, 854.9, 2.4, 'Keats South Deep'],
  ['NFGC-24-2112-W4', 861.25, 864.0, 9.25, 'Keats South Deep'],
  ['NFGC-24-2112-W5', 780.55, 783.0, 1.1, 'Keats South Deep'],
  ['NFGC-24-2112-W5', 818.0, 820.8, 1.03, 'Keats South Deep'],
  ['NFGC-24-2112-W5', 899.0, 901.75, 2.37, 'Keats South Deep'],
  ['NFGC-24-2112-W5', 997.05, 1005.25, 10.27, 'Keats South Deep'],
  ['NFGC-24-2157', 350.85, 352.95, 1.3, 'Keats South Deep'],
  ['NFGC-21-469', 1498.0, 1500.0, 3.11, 'Keats-AFZ Deep'],
  ['NFGC-24-2168', 766.3, 773.35, 2.1, 'Keats-AFZ Deep'],
  ['NFGC-24-2168', 989.0, 991.0, 1.15, 'Keats-AFZ Deep'],
  ['NFGC-24-2168', 991.65, 994.55, 1.07, 'Keats-AFZ Deep'],
  ['NFGC-24-2168', 1010.65, 1013.75, 6.16, 'Keats-AFZ Deep'],
  ['NFGC-24-2168', 1057.5, 1059.6, 2.07, 'Keats-AFZ Deep'],
  ['NFGC-24-2168', 1080.25, 1085.4, 1.63, 'Keats-AFZ Deep'],
  ['NFGC-24-2168', 1136.85, 1139.7, 2.55, 'Keats-AFZ Deep'],
  ['NFGC-24-2189', 528.95, 533.5, 1.7, 'Keats-AFZ Deep'],
  ['NFGC-24-2189', 555.55, 557.55, 1.89, 'Keats-AFZ Deep'],
  ['NFGC-24-2189', 620.85, 623.4, 3.63, 'Keats-AFZ Deep'],
  ['NFGC-24-2189', 641.0, 643.0, 2.2, 'Keats-AFZ Deep'],
  ['NFGC-24-2189', 667.7, 669.7, 1.18, 'Keats-AFZ Deep'],
  ['NFGC-24-2175', 14.95, 27.0, 2.58, 'Keats West'],
  ['NFGC-24-2175', 80.5, 84.15, 1.1, 'Keats West'],
  ['NFGC-24-2175', 93.75, 108.55, 1.53, 'Keats West'],
  ['NFGC-24-2229', 323.3, 325.6, 1.51, 'Golden Joint'],
  ['NFGC-24-2229', 342.1, 344.4, 1.09, 'Golden Joint'],
  ['NFGC-24-2229', 521.75, 524.15, 1.31, 'Golden Dome'],
  ['NFGC-24-2236', 240.4, 243.2, 1.28, 'Dome'],
  ['NFGC-24-2238', 317.0, 323.55, 38.66, 'Dome']
]

const collars = COLLARS.map(([id, azi, dip, length, e, n, prospect, seismic]) => ({
  id, azi, dip, length, e, n, prospect, seismic
}))

const cx = collars.reduce((s, c) => s + c.e, 0) / collars.length
const cy = collars.reduce((s, c) => s + c.n, 0) / collars.length

const grades = ASSAYS.map(a => a[3]).sort((a, b) => a - b)
const q = p => grades[Math.min(grades.length - 1, Math.floor(p * (grades.length - 1)))]
const best = ASSAYS.reduce((m, a) => (a[3] > m[3] ? a : m), ASSAYS[0])
const metres = collars.reduce((s, c) => s + c.length, 0)

const metresByYear = { 2021: 0, 2022: 0, 2023: 0, 2024: 0 }
for (const c of collars) {
  const y = c.id.includes('-21-') ? 2021 : c.id.includes('-22-') ? 2022 : c.id.includes('-23-') ? 2023 : 2024
  metresByYear[y] += c.length
}

const payload = {
  meta: {
    element: 'Au',
    unit: 'g/t',
    holeCount: collars.length,
    intervalCount: ASSAYS.length,
    suspectCount: 0,
    origin: { easting: cx, northing: cy, topRL: RL, crs: 'NAD83 / UTM zone 21N' },
    grade: { min: q(0), p50: q(0.5), p90: q(0.9), p99: q(0.99), max: q(1) },
    metresDrilled: metres,
    bestIntercept: { id: best[0], from: best[1], to: best[2], grade: best[3], zone: best[4] },
    metresByYear,
    project: {
      id: 'queensway-nfg',
      name: 'Queensway Gold Project',
      company: 'New Found Gold Corp.',
      ticker: 'TSX-V: NFG · NYSE-A: NFGC',
      stage: 'prospecting',
      location: '15 km west of Gander, Newfoundland and Labrador',
      commodity: 'Gold',
      disclosure: 'NI 43-101',
      seismic: '3-D seismic survey (2023) used to site the deep-hole program along the Appleton Fault Zone',
      note: 'Listed explorer. No operating mine. Composites from public investor filings — not a resource estimate.',
      filings: FILINGS
    },
    bakedAt: new Date().toISOString().slice(0, 10)
  },
  collars: collars.map(c => ({
    id: c.id,
    x: +(c.e - cx).toFixed(2),
    y: +(c.n - cy).toFixed(2),
    z: RL,
    prospect: c.prospect,
    seismic: c.seismic ? 1 : 0,
    length: c.length,
    survey: [{ d: 0, dip: c.dip, azi: c.azi }]
  })),
  intervals: ASSAYS.map(([id, f, t, g, z]) => ({
    id, f: +f.toFixed(2), t: +t.toFixed(2), g: +g.toFixed(3), z
  }))
}

fs.writeFileSync(OUT, JSON.stringify(payload))
console.log('holes', payload.collars.length, 'intervals', payload.intervals.length)
console.log('metres', metres, 'best', best[3], 'g/t', best[0])
console.log('wrote', OUT, (fs.statSync(OUT).size / 1024).toFixed(1) + 'KB')
