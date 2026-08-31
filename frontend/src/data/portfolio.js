import { mulberry32, clamp } from './rng'

/**
 * Multi-mine portfolio for the executive map.
 *
 * A mine manager works one pit; an executive works a corridor — pit, plant, rail
 * siding, port, vessel — across several countries at once. This is the dataset behind
 * that view: every asset carries the handful of numbers an executive actually acts on
 * (rate, stock, trucks weighed, tonnes waiting) rather than the full site telemetry.
 *
 * Coordinates are the real locations of these operations. Tonnages, truck counts and
 * vessel states are demo figures on a seeded RNG — they are illustrative, not feeds.
 */

export const REGIONS = {
  africa: { id: 'africa', label: 'Southern & West Africa', mapped: true },
  india: { id: 'india', label: 'India (Karnataka / Odisha)', mapped: false },
  canada: { id: 'canada', label: 'Canada (Newfoundland)', mapped: false }
}

export const COUNTRIES = [
  { code: 'MZ', name: 'Mozambique', lon: 35.2, lat: -17.6 },
  { code: 'ZM', name: 'Zambia', lon: 27.4, lat: -13.6 },
  { code: 'CD', name: 'DR Congo', lon: 23.5, lat: -4.0 },
  { code: 'ZA', name: 'South Africa', lon: 24.5, lat: -29.5 },
  { code: 'NA', name: 'Namibia', lon: 17.2, lat: -22.0 },
  { code: 'TZ', name: 'Tanzania', lon: 34.8, lat: -6.4 },
  { code: 'GH', name: 'Ghana', lon: -1.2, lat: 7.9 },
  { code: 'GN', name: 'Guinea', lon: -10.9, lat: 10.4 }
]

/** type: mine | plant | port. Mines and plants both report a rate; ports report a berth. */
export const ASSETS = [
  // --- Mozambique: the Tete coalfield and its two export corridors ---
  {
    id: 'moatize',
    name: 'Moatize Coal Complex',
    type: 'mine',
    subtype: 'open_pit',
    region: 'africa',
    country: 'Mozambique',
    countryCode: 'MZ',
    province: 'Tete',
    lon: 33.73,
    lat: -16.13,
    commodity: 'Coking & thermal coal',
    status: 'producing',
    tpd: 21400,
    gradeLabel: '62% coking / 38% thermal split',
    stockpileTons: 184000,
    trucksWeighedToday: 412,
    manager: 'A. Mucavele',
    corridor: 'sena',
    note: 'Both corridors feed from here — Sena to Beira, Nacala for the coking fraction.'
  },
  {
    id: 'chirodzi',
    name: 'Chirodzi Coal (Jindal)',
    type: 'mine',
    subtype: 'open_pit',
    region: 'africa',
    country: 'Mozambique',
    countryCode: 'MZ',
    province: 'Tete',
    lon: 33.28,
    lat: -16.42,
    commodity: 'Thermal coal',
    status: 'producing',
    tpd: 8600,
    gradeLabel: 'CV 5,400 kcal/kg NAR',
    stockpileTons: 71000,
    trucksWeighedToday: 188,
    manager: 'R. Bhattacharya',
    corridor: 'sena',
    note: 'Owner-operated rail and locomotives on the Sena line — no third-party haulage slot risk.'
  },
  {
    id: 'benga',
    name: 'Benga Coal',
    type: 'mine',
    subtype: 'open_pit',
    region: 'africa',
    country: 'Mozambique',
    countryCode: 'MZ',
    province: 'Tete',
    lon: 33.6,
    lat: -16.2,
    commodity: 'Thermal coal',
    status: 'ramp_up',
    tpd: 4200,
    gradeLabel: 'CV 5,100 kcal/kg NAR',
    stockpileTons: 28500,
    trucksWeighedToday: 96,
    manager: 'S. Chirwa',
    corridor: 'sena'
  },
  // --- Central African copperbelt ---
  {
    id: 'kolwezi',
    name: 'Kolwezi Cu-Co',
    type: 'mine',
    subtype: 'open_pit',
    region: 'africa',
    country: 'DR Congo',
    countryCode: 'CD',
    province: 'Lualaba',
    lon: 25.47,
    lat: -10.71,
    commodity: 'Copper & cobalt',
    status: 'producing',
    tpd: 12800,
    gradeLabel: '3.1% Cu · 0.34% Co',
    stockpileTons: 41200,
    trucksWeighedToday: 264,
    manager: 'J. Mwamba',
    corridor: 'tazara',
    note: 'Cobalt by-product carries the margin; copper price moves the headline.'
  },
  {
    id: 'tenke',
    name: 'Tenke Fungurume',
    type: 'mine',
    subtype: 'open_pit',
    region: 'africa',
    country: 'DR Congo',
    countryCode: 'CD',
    province: 'Lualaba',
    lon: 26.13,
    lat: -10.6,
    commodity: 'Copper & cobalt',
    status: 'producing',
    tpd: 9700,
    gradeLabel: '2.6% Cu · 0.28% Co',
    stockpileTons: 33800,
    trucksWeighedToday: 201,
    manager: 'P. Ilunga',
    corridor: 'tazara'
  },
  {
    id: 'lumwana',
    name: 'Lumwana Copper',
    type: 'mine',
    subtype: 'open_pit',
    region: 'africa',
    country: 'Zambia',
    countryCode: 'ZM',
    province: 'North-Western',
    lon: 25.55,
    lat: -12.15,
    commodity: 'Copper',
    status: 'producing',
    tpd: 7400,
    gradeLabel: '0.62% Cu',
    stockpileTons: 22100,
    trucksWeighedToday: 152,
    manager: 'C. Zulu',
    corridor: 'tazara'
  },
  {
    id: 'kansanshi',
    name: 'Kansanshi Copper',
    type: 'mine',
    subtype: 'open_pit',
    region: 'africa',
    country: 'Zambia',
    countryCode: 'ZM',
    province: 'North-Western',
    lon: 26.38,
    lat: -12.1,
    commodity: 'Copper & gold',
    status: 'producing',
    tpd: 11200,
    gradeLabel: '0.71% Cu · 0.11 g/t Au',
    stockpileTons: 30400,
    trucksWeighedToday: 233,
    manager: 'M. Banda',
    corridor: 'tazara'
  },
  {
    id: 'nchanga-plant',
    name: 'Nchanga Concentrator',
    type: 'plant',
    subtype: 'concentrator',
    region: 'africa',
    country: 'Zambia',
    countryCode: 'ZM',
    province: 'Copperbelt',
    lon: 27.87,
    lat: -12.53,
    commodity: 'Copper concentrate',
    status: 'degraded',
    tpd: 6100,
    nameplateTpd: 9800,
    gradeLabel: 'Conc 28% Cu (spec 30%)',
    stockpileTons: 9400,
    trucksWeighedToday: 118,
    manager: 'E. Phiri',
    corridor: 'tazara',
    note: 'Running 62% of nameplate on a float cell rebuild — concentrate off spec at 28% Cu.'
  },
  // --- South Africa & Namibia ---
  {
    id: 'mogalakwena',
    name: 'Mogalakwena PGM',
    type: 'mine',
    subtype: 'open_pit',
    region: 'africa',
    country: 'South Africa',
    countryCode: 'ZA',
    province: 'Limpopo',
    lon: 28.9,
    lat: -24.0,
    commodity: 'Platinum group metals',
    status: 'producing',
    tpd: 14600,
    gradeLabel: '2.9 g/t 4E',
    stockpileTons: 52300,
    trucksWeighedToday: 298,
    manager: 'T. Mokoena',
    corridor: 'richards'
  },
  {
    id: 'sishen',
    name: 'Sishen Iron Ore',
    type: 'mine',
    subtype: 'open_pit',
    region: 'africa',
    country: 'South Africa',
    countryCode: 'ZA',
    province: 'Northern Cape',
    lon: 22.99,
    lat: -27.7,
    commodity: 'Iron ore',
    status: 'producing',
    tpd: 28900,
    gradeLabel: '64.2% Fe lump',
    stockpileTons: 210000,
    trucksWeighedToday: 476,
    manager: 'D. van Wyk',
    corridor: 'orex',
    note: 'Highest tonnage asset in the book — the ore line to Saldanha is the constraint, not the pit.'
  },
  {
    id: 'husab',
    name: 'Husab Uranium',
    type: 'mine',
    subtype: 'open_pit',
    region: 'africa',
    country: 'Namibia',
    countryCode: 'NA',
    province: 'Erongo',
    lon: 15.05,
    lat: -22.55,
    commodity: 'Uranium (U3O8)',
    status: 'producing',
    tpd: 5100,
    gradeLabel: '440 ppm U3O8',
    stockpileTons: 14700,
    trucksWeighedToday: 84,
    manager: 'L. Shikongo',
    corridor: 'walvis'
  },
  // --- East & West Africa ---
  {
    id: 'geita',
    name: 'Geita Gold',
    type: 'mine',
    subtype: 'open_pit',
    region: 'africa',
    country: 'Tanzania',
    countryCode: 'TZ',
    province: 'Geita',
    lon: 32.19,
    lat: -2.87,
    commodity: 'Gold',
    status: 'producing',
    tpd: 3200,
    gradeLabel: '4.1 g/t Au',
    stockpileTons: 6800,
    trucksWeighedToday: 61,
    manager: 'N. Kimaro',
    corridor: 'tazara'
  },
  {
    id: 'tarkwa',
    name: 'Tarkwa Gold',
    type: 'mine',
    subtype: 'open_pit',
    region: 'africa',
    country: 'Ghana',
    countryCode: 'GH',
    province: 'Western',
    lon: -1.99,
    lat: 5.3,
    commodity: 'Gold',
    status: 'producing',
    tpd: 4400,
    gradeLabel: '1.3 g/t Au',
    stockpileTons: 8900,
    trucksWeighedToday: 74,
    manager: 'K. Mensah',
    corridor: 'takoradi'
  },
  {
    id: 'simandou',
    name: 'Simandou Iron Ore',
    type: 'mine',
    subtype: 'open_pit',
    region: 'africa',
    country: 'Guinea',
    countryCode: 'GN',
    province: 'Nzérékoré',
    lon: -8.87,
    lat: 8.53,
    commodity: 'Iron ore',
    status: 'ramp_up',
    tpd: 6200,
    gradeLabel: '65.5% Fe',
    stockpileTons: 44000,
    trucksWeighedToday: 129,
    manager: 'F. Camara',
    corridor: 'conakry',
    note: 'Ramp-up. Rail not commissioned to design rate — trucking the shortfall.'
  },
  // --- Ports ---
  {
    id: 'port-beira',
    name: 'Beira Coal Terminal',
    type: 'port',
    region: 'africa',
    country: 'Mozambique',
    countryCode: 'MZ',
    lon: 34.84,
    lat: -19.83,
    commodity: 'Coal',
    status: 'loading',
    berths: 2,
    stockpileTons: 96000,
    loadRateTph: 1450,
    manager: 'H. Sitoe',
    note: 'Draft-limited to 12.0 m — Panamax loads to 80% here and tops off at anchorage.'
  },
  {
    id: 'port-nacala',
    name: 'Nacala Deepwater Terminal',
    type: 'port',
    region: 'africa',
    country: 'Mozambique',
    countryCode: 'MZ',
    lon: 40.68,
    lat: -14.54,
    commodity: 'Coking coal',
    status: 'loading',
    berths: 1,
    stockpileTons: 61000,
    loadRateTph: 2100,
    manager: 'I. Bila'
  },
  {
    id: 'port-maputo',
    name: 'Maputo Bulk Terminal',
    type: 'port',
    region: 'africa',
    country: 'Mozambique',
    countryCode: 'MZ',
    lon: 32.57,
    lat: -25.97,
    commodity: 'Chrome & ferro-alloys',
    status: 'waiting_cargo',
    berths: 2,
    stockpileTons: 12400,
    loadRateTph: 0,
    manager: 'G. Nhaca'
  },
  {
    id: 'port-dar',
    name: 'Dar es Salaam Terminal',
    type: 'port',
    region: 'africa',
    country: 'Tanzania',
    countryCode: 'TZ',
    lon: 39.28,
    lat: -6.82,
    commodity: 'Copper concentrate',
    status: 'loading',
    berths: 3,
    stockpileTons: 18900,
    loadRateTph: 640,
    manager: 'A. Mrema'
  },
  {
    id: 'port-walvis',
    name: 'Walvis Bay',
    type: 'port',
    region: 'africa',
    country: 'Namibia',
    countryCode: 'NA',
    lon: 14.51,
    lat: -22.96,
    commodity: 'Uranium concentrate',
    status: 'idle',
    berths: 1,
    stockpileTons: 3100,
    loadRateTph: 0,
    manager: 'P. Amupolo'
  },
  {
    id: 'port-richards',
    name: 'Richards Bay Coal Terminal',
    type: 'port',
    region: 'africa',
    country: 'South Africa',
    countryCode: 'ZA',
    lon: 32.09,
    lat: -28.8,
    commodity: 'Coal & PGM',
    status: 'loading',
    berths: 4,
    stockpileTons: 143000,
    loadRateTph: 3200,
    manager: 'B. Naidoo'
  },
  {
    id: 'port-saldanha',
    name: 'Saldanha Iron Ore Terminal',
    type: 'port',
    region: 'africa',
    country: 'South Africa',
    countryCode: 'ZA',
    lon: 17.94,
    lat: -33.02,
    commodity: 'Iron ore',
    status: 'loading',
    berths: 2,
    stockpileTons: 220000,
    loadRateTph: 5400,
    manager: 'W. Botha'
  },
  {
    id: 'port-takoradi',
    name: 'Takoradi Port',
    type: 'port',
    region: 'africa',
    country: 'Ghana',
    countryCode: 'GH',
    lon: -1.76,
    lat: 4.9,
    commodity: 'Gold doré & manganese',
    status: 'idle',
    berths: 1,
    stockpileTons: 900,
    loadRateTph: 0,
    manager: 'Y. Owusu'
  },
  {
    id: 'port-conakry',
    name: 'Conakry Bulk Berth',
    type: 'port',
    region: 'africa',
    country: 'Guinea',
    countryCode: 'GN',
    lon: -13.71,
    lat: 9.51,
    commodity: 'Iron ore',
    status: 'waiting_cargo',
    berths: 1,
    stockpileTons: 27000,
    loadRateTph: 0,
    manager: 'M. Diallo'
  },
  // --- Assets outside the mapped extent, kept in the book so the roll-up is honest ---
  {
    id: 'kolar-north',
    name: 'Kolar North Open Pit',
    type: 'mine',
    subtype: 'open_pit',
    region: 'india',
    country: 'India',
    countryCode: 'IN',
    province: 'Karnataka',
    lon: 78.27,
    lat: 12.96,
    commodity: 'Gold',
    status: 'producing',
    tpd: 4080,
    gradeLabel: '3.42 g/t Au',
    stockpileTons: 6420,
    trucksWeighedToday: 88,
    manager: 'Oliver Vance'
  },
  {
    id: 'bellary-chrome',
    name: 'Bellary MG1 Chrome Pit',
    type: 'mine',
    subtype: 'open_pit',
    region: 'india',
    country: 'India',
    countryCode: 'IN',
    province: 'Karnataka',
    lon: 76.55,
    lat: 15.09,
    commodity: 'Chrome',
    status: 'degraded',
    tpd: 2160,
    gradeLabel: '24.1% Cr2O3 ROM',
    stockpileTons: 8200,
    trucksWeighedToday: 54,
    manager: 'Oliver Vance'
  },
  {
    id: 'queensway-nfg',
    name: 'Queensway Gold Project',
    type: 'mine',
    subtype: 'exploration',
    region: 'canada',
    country: 'Canada',
    countryCode: 'CA',
    province: 'Newfoundland & Labrador',
    lon: -54.75,
    lat: 48.95,
    commodity: 'Gold (exploration)',
    status: 'exploration',
    tpd: 0,
    gradeLabel: '343 g/t Au over 2.15 m',
    stockpileTons: 0,
    trucksWeighedToday: 0,
    manager: '—'
  }
]

/**
 * Rail corridors. Jindal runs its own locomotives on the Sena line, so the sidings
 * along it are the company's inventory, not a third party's — which is why siding
 * tonnage belongs on the executive map at all.
 */
export const RAIL_LINES = [
  {
    id: 'sena',
    name: 'Sena Line — Moatize → Beira',
    commodity: 'Coal',
    operator: 'Owner-operated (Jindal locos)',
    lengthKm: 575,
    railcarTons: 60,
    path: [
      [33.73, -16.13], [34.2, -16.6], [34.8, -17.4], [35.1, -18.3],
      [34.95, -19.1], [34.84, -19.83]
    ],
    sidings: [
      { id: 'sid-moatize', name: 'Moatize Loadout', lon: 34.2, lat: -16.6, tons: 18400, wagons: 307 },
      { id: 'sid-inhamitanga', name: 'Inhamitanga Siding', lon: 35.1, lat: -18.3, tons: 9600, wagons: 160 },
      { id: 'sid-dondo', name: 'Dondo Junction', lon: 34.95, lat: -19.1, tons: 14200, wagons: 237 }
    ]
  },
  {
    id: 'nacala',
    name: 'Nacala Corridor — Moatize → Nacala',
    commodity: 'Coking coal',
    operator: 'Concession slot',
    lengthKm: 912,
    railcarTons: 60,
    path: [
      [33.73, -16.13], [34.6, -15.6], [35.3, -15.2], [36.9, -14.9],
      [38.5, -14.8], [40.68, -14.54]
    ],
    sidings: [
      { id: 'sid-nkaya', name: 'Nkaya Junction', lon: 35.3, lat: -15.2, tons: 7100, wagons: 118 },
      { id: 'sid-cuamba', name: 'Cuamba Siding', lon: 36.9, lat: -14.9, tons: 11800, wagons: 197 }
    ]
  },
  {
    id: 'orex',
    name: 'Ore Line — Sishen → Saldanha',
    commodity: 'Iron ore',
    operator: 'Third-party slot',
    lengthKm: 861,
    railcarTons: 100,
    path: [[22.99, -27.7], [21.5, -28.7], [19.8, -30.2], [18.5, -31.8], [17.94, -33.02]],
    sidings: [
      { id: 'sid-sishen', name: 'Sishen Loadout', lon: 21.5, lat: -28.7, tons: 32000, wagons: 320 },
      { id: 'sid-vredendal', name: 'Vredendal Siding', lon: 18.5, lat: -31.8, tons: 19500, wagons: 195 }
    ]
  },
  {
    id: 'tazara',
    name: 'Copperbelt → Dar es Salaam',
    commodity: 'Copper concentrate',
    operator: 'Third-party slot',
    lengthKm: 1860,
    railcarTons: 55,
    path: [
      [27.87, -12.53], [29.5, -11.5], [31.5, -9.8], [33.5, -8.6],
      [35.8, -7.8], [39.28, -6.82]
    ],
    sidings: [
      { id: 'sid-mpika', name: 'Mpika Siding', lon: 31.5, lat: -9.8, tons: 4300, wagons: 78 },
      { id: 'sid-makambako', name: 'Makambako Siding', lon: 34.8, lat: -8.2, tons: 2900, wagons: 53 }
    ]
  }
]

/** Road haulage corridors. Truck convoys ride these between pit gate and port gate. */
export const ROAD_CORRIDORS = [
  { id: 'rd-tete-beira', from: 'chirodzi', to: 'port-beira', path: [[33.28, -16.42], [34.3, -17.2], [34.9, -18.6], [34.84, -19.83]] },
  { id: 'rd-kolwezi-dar', from: 'kolwezi', to: 'port-dar', path: [[25.47, -10.71], [28.2, -10.9], [31.5, -9.4], [35.0, -7.6], [39.28, -6.82]] },
  { id: 'rd-mogala-richards', from: 'mogalakwena', to: 'port-richards', path: [[28.9, -24.0], [29.8, -25.6], [31.0, -27.4], [32.09, -28.8]] },
  { id: 'rd-husab-walvis', from: 'husab', to: 'port-walvis', path: [[15.05, -22.55], [14.8, -22.8], [14.51, -22.96]] },
  { id: 'rd-simandou-conakry', from: 'simandou', to: 'port-conakry', path: [[-8.87, 8.53], [-10.5, 9.2], [-12.3, 9.6], [-13.71, 9.51]] }
]

export const CONVOY_SEED = [
  {
    id: 'cv-beira-01',
    corridorId: 'rd-tete-beira',
    label: 'Chirodzi → Beira',
    trucks: 90,
    tonsPerTruck: 34,
    t: 0.62,
    etaHours: 72,
    note: 'Booked against SierraYT65 at Beira. Vessel is 6 days into a 9-day laycan.'
  },
  { id: 'cv-dar-01', corridorId: 'rd-kolwezi-dar', label: 'Kolwezi → Dar es Salaam', trucks: 44, tonsPerTruck: 30, t: 0.35, etaHours: 96 },
  { id: 'cv-richards-01', corridorId: 'rd-mogala-richards', label: 'Mogalakwena → Richards Bay', trucks: 62, tonsPerTruck: 34, t: 0.48, etaHours: 18 },
  { id: 'cv-walvis-01', corridorId: 'rd-husab-walvis', label: 'Husab → Walvis Bay', trucks: 18, tonsPerTruck: 26, t: 0.71, etaHours: 3 },
  { id: 'cv-conakry-01', corridorId: 'rd-simandou-conakry', label: 'Simandou → Conakry', trucks: 120, tonsPerTruck: 40, t: 0.22, etaHours: 40 }
]

export const VESSEL_SEED = [
  {
    id: 'vsl-sierra',
    name: 'SierraYT65',
    flag: 'Panama',
    portId: 'port-beira',
    lon: 35.6,
    lat: -19.95,
    cargo: 'Thermal coal',
    capacityTons: 76000,
    loadedTons: 41200,
    status: 'demurrage',
    laycanDays: 9,
    laycanUsed: 6,
    demurrageUsdPerDay: 24500,
    note: 'Six days into a nine-day laycan with 3,060 t still three days out by road. Berth swap is live risk.'
  },
  { id: 'vsl-nacala', name: 'MV Zambezi Trader', flag: 'Liberia', portId: 'port-nacala', lon: 41.4, lat: -14.6, cargo: 'Coking coal', capacityTons: 82000, loadedTons: 68400, status: 'loading', laycanDays: 7, laycanUsed: 3, demurrageUsdPerDay: 0 },
  { id: 'vsl-dar', name: 'MV Rufiji Star', flag: 'Marshall Is.', portId: 'port-dar', lon: 40.1, lat: -6.95, cargo: 'Copper concentrate', capacityTons: 34000, loadedTons: 11800, status: 'loading', laycanDays: 6, laycanUsed: 2, demurrageUsdPerDay: 0 },
  { id: 'vsl-saldanha', name: 'MV Cape Agulhas', flag: 'Singapore', portId: 'port-saldanha', lon: 17.2, lat: -33.2, cargo: 'Iron ore', capacityTons: 180000, loadedTons: 132000, status: 'loading', laycanDays: 8, laycanUsed: 4, demurrageUsdPerDay: 0 },
  { id: 'vsl-richards', name: 'MV Tugela', flag: 'Panama', portId: 'port-richards', lon: 32.8, lat: -28.95, cargo: 'Coal', capacityTons: 64000, loadedTons: 9400, status: 'waiting_berth', laycanDays: 5, laycanUsed: 1, demurrageUsdPerDay: 0 },
  { id: 'vsl-conakry', name: 'MV Nimba', flag: 'Malta', portId: 'port-conakry', lon: -14.4, lat: 9.4, cargo: 'Iron ore', capacityTons: 58000, loadedTons: 0, status: 'waiting_cargo', laycanDays: 10, laycanUsed: 7, demurrageUsdPerDay: 18000, note: 'Waiting on a rail corridor that is not yet at design rate.' }
]

/**
 * Individual trucks drawn on the corridors.
 *
 * A convoy record is a commercial unit ("90 tippers booked against SierraYT65"); it is
 * not something you can watch move. These are the icons that actually drive: a handful
 * per corridor, enough to read as traffic without turning the road into a solid line.
 *
 * Half run laden pit -> port and half run empty port -> pit, because that round trip is
 * what the weighbridge story hangs off — a tipper is weighed empty at the gate on the
 * way in and laden on the way out, and the difference is the fraud check.
 */
const TRUCKS_PER_CORRIDOR = 6

export function buildTruckFleet() {
  const fleet = []
  ROAD_CORRIDORS.forEach((corridor, ci) => {
    const convoy = CONVOY_SEED.find(c => c.corridorId === corridor.id)
    for (let i = 0; i < TRUCKS_PER_CORRIDOR; i += 1) {
      const laden = i % 2 === 0
      fleet.push({
        id: `${corridor.id}-t${i}`,
        corridorId: corridor.id,
        convoyId: convoy ? convoy.id : null,
        label: convoy ? convoy.label : corridor.id,
        laden,
        tonsPerTruck: convoy ? convoy.tonsPerTruck : 34,
        // Stagger the start positions so trucks are spread along the road rather than
        // leaving the gate in a single clump.
        phase: (i / TRUCKS_PER_CORRIDOR + ci * 0.17) % 1,
        // A full corridor traverse lands around 70-100s: visible movement at a glance,
        // without trucks skating across a continent.
        speed: 0.0102 + (ci % 3) * 0.0016
      })
    }
  })
  return fleet
}

export const TRUCK_FLEET = buildTruckFleet()

export const MAP_LAYERS = [
  { id: 'mines', label: 'Mines', color: '#c026d3' },
  { id: 'plants', label: 'Processing', color: '#fb923c' },
  { id: 'trucks', label: 'Trucks', color: '#38bdf8' },
  { id: 'rail', label: 'Rail & sidings', color: '#a78bfa' },
  { id: 'ports', label: 'Ports & ships', color: '#34d399' }
]

export function createPortfolioState() {
  return {
    tick: 0,
    assets: ASSETS.map(a => ({ ...a })),
    convoys: CONVOY_SEED.map(c => ({ ...c })),
    vessels: VESSEL_SEED.map(v => ({ ...v })),
    rail: RAIL_LINES.map(l => ({ ...l, sidings: l.sidings.map(s => ({ ...s })) }))
  }
}

/**
 * One demo heartbeat. Convoys creep along their corridor, ships take on cargo at the
 * berth rate, sidings breathe as rakes arrive and depart, and gate weighings tick up.
 * Seeded on the tick count so a reload replays the same sequence.
 */
export function tickPortfolio(state) {
  const rng = mulberry32(0x5eed + state.tick)
  const tick = state.tick + 1

  const assets = state.assets.map(a => {
    if (a.type === 'port') {
      const moved = (a.loadRateTph / 3600) * 2.5
      return { ...a, stockpileTons: Math.max(0, Math.round(a.stockpileTons - moved)) }
    }
    if (!a.tpd) return a
    const mined = (a.tpd / 86400) * 2.5
    const trucks = rng() < 0.14 ? 1 : 0
    return {
      ...a,
      stockpileTons: Math.round(a.stockpileTons + mined),
      trucksWeighedToday: a.trucksWeighedToday + trucks
    }
  })

  const convoys = state.convoys.map(c => {
    const advanced = c.t + 0.0022 + rng() * 0.0016
    // Convoys that reach the port gate turn around and start the next run.
    const t = advanced >= 1 ? 0.02 : advanced
    return { ...c, t, etaHours: Math.max(0, +(c.etaHours - 0.05).toFixed(2)) }
  })

  const vessels = state.vessels.map(v => {
    if (v.status !== 'loading') return v
    const port = assets.find(a => a.id === v.portId)
    const rate = port ? (port.loadRateTph / 3600) * 2.5 : 0
    return { ...v, loadedTons: Math.min(v.capacityTons, Math.round(v.loadedTons + rate)) }
  })

  const rail = state.rail.map(l => ({
    ...l,
    sidings: l.sidings.map(s => {
      const delta = (rng() - 0.42) * 220
      const tons = Math.round(clamp(s.tons + delta, 0, 40000))
      return { ...s, tons, wagons: Math.round(tons / l.railcarTons) }
    })
  }))

  return { tick, assets, convoys, vessels, rail }
}

export function portfolioRollup(state) {
  const mapped = state.assets.filter(a => a.region === 'africa')
  const mines = mapped.filter(a => a.type === 'mine')
  const plants = mapped.filter(a => a.type === 'plant')
  const ports = mapped.filter(a => a.type === 'port')
  const countries = new Set(mapped.map(a => a.country))

  const railTons = state.rail.reduce(
    (sum, l) => sum + l.sidings.reduce((s, sd) => s + sd.tons, 0),
    0
  )
  const convoyTrucks = state.convoys.reduce((s, c) => s + c.trucks, 0)
  const convoyTons = state.convoys.reduce((s, c) => s + c.trucks * c.tonsPerTruck, 0)
  const atRisk = state.vessels.filter(v => v.status === 'demurrage' || v.status === 'waiting_cargo')
  const demurrageUsdPerDay = atRisk.reduce((s, v) => s + (v.demurrageUsdPerDay || 0), 0)

  return {
    countries: countries.size,
    mines: mines.length,
    plants: plants.length,
    ports: ports.length,
    tpd: mines.reduce((s, m) => s + m.tpd, 0),
    trucksWeighedToday: mapped.reduce((s, a) => s + (a.trucksWeighedToday || 0), 0),
    portStockTons: ports.reduce((s, p) => s + p.stockpileTons, 0),
    railTons,
    convoys: state.convoys.length,
    convoyTrucks,
    convoyTons,
    vesselsAtRisk: atRisk.length,
    demurrageUsdPerDay,
    unmappedAssets: state.assets.filter(a => a.region !== 'africa')
  }
}

export function formatTons(n) {
  if (n >= 1e6) return `${(n / 1e6).toFixed(2)} Mt`
  if (n >= 1e3) return `${Math.round(n / 1e3).toLocaleString()} kt`
  return `${Math.round(n).toLocaleString()} t`
}
