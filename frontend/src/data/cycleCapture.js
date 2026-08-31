/** Unique cycle fields the client asked for — not a second copy of plants / tippers / tickets. */

export const CYCLE_PERIODS = [
  { id: 'today', label: 'Today' },
  { id: 'yesterday', label: 'Yesterday' },
  { id: 'week', label: 'This Week' },
  { id: 'month', label: 'This Month' }
]

export const CYCLE_STAGES = [
  { id: 'surveying', label: 'Surveying' },
  { id: 'prospecting', label: 'Prospecting' },
  { id: 'production', label: 'Production' }
]

export const PRODUCTION_SLICES = [
  { id: 'blast', label: 'Blast geometry' },
  { id: 'extraction', label: 'Extraction' },
  { id: 'diesel', label: 'Diesel' },
  { id: 'fraud', label: 'Fraud' },
  { id: 'weather', label: 'Weather' },
  { id: 'licenses', label: 'Licenses' },
  { id: 'coal', label: 'Coal price' }
]

export function createCycleCapture() {
  return {
    surveying: {
      kpis: {
        today: { coveragePercent: 86, densityContrast: 4.2, followUp: 2, costAvoidedUsd: 48000 },
        yesterday: { coveragePercent: 84, densityContrast: 4.1, followUp: 2, costAvoidedUsd: 48000 },
        week: { coveragePercent: 91, densityContrast: 4.4, followUp: 3, costAvoidedUsd: 96000 },
        month: { coveragePercent: 97, densityContrast: 4.6, followUp: 3, costAvoidedUsd: 144000 }
      },
      flights: [
        { id: 'flt-28', siteId: 'kolar-survey-grid', date: '2026-08-28', method: 'Drone LiDAR', areaKm2: 12.4, gsdCm: 8, coveragePercent: 86 },
        { id: 'flt-26', siteId: 'kolar-survey-grid', date: '2026-08-26', method: 'Ground mag', areaKm2: 6.1, gsdCm: 50, coveragePercent: 71 },
        { id: 'flt-20', siteId: 'kolar-survey-grid', date: '2026-08-20', method: 'Photogrammetry', areaKm2: 9.8, gsdCm: 12, coveragePercent: 64 }
      ]
    },
    prospecting: {
      kpis: {
        today: { metresDrilled: 1840, pendingAssays: 3, bestTrueWidthM: 2.15, turnaroundH: 36 },
        yesterday: { metresDrilled: 1760, pendingAssays: 4, bestTrueWidthM: 2.15, turnaroundH: 41 },
        week: { metresDrilled: 4120, pendingAssays: 6, bestTrueWidthM: 2.15, turnaroundH: 38 },
        month: { metresDrilled: 12840, pendingAssays: 9, bestTrueWidthM: 8.2, turnaroundH: 44 }
      },
      collars: [
        { id: 'col-2158', siteId: 'queensway-nfg', holeId: 'NFGC-24-2158', azimuth: 135, dip: -55, depthM: 412, recoveryPercent: 97, resourceClass: 'indicated', status: 'complete' },
        { id: 'col-2112', siteId: 'queensway-nfg', holeId: 'NFGC-24-2112-W5', azimuth: 142, dip: -62, depthM: 688, recoveryPercent: 94, resourceClass: 'indicated', status: 'complete' },
        { id: 'col-2094', siteId: 'queensway-nfg', holeId: 'NFGC-24-2094', azimuth: 128, dip: -70, depthM: 924, recoveryPercent: 91, resourceClass: 'inferred', status: 'complete' },
        { id: 'col-cd18', siteId: 'chitradurga-prospect', holeId: 'CD-18', azimuth: 210, dip: -48, depthM: 286, recoveryPercent: 88, resourceClass: 'inferred', status: 'assays_pending' }
      ],
      intercepts: [
        { id: 'int-dome', siteId: 'queensway-nfg', holeId: 'NFGC-24-2158', fromM: 188.4, toM: 190.55, trueWidthM: 2.15, grade: '343 g/t Au', labTurnaroundH: 32, labStatus: 'cleared' },
        { id: 'int-keats', siteId: 'queensway-nfg', holeId: 'NFGC-24-2112-W5', fromM: 504.1, toM: 512.3, trueWidthM: 8.2, grade: '10.3 g/t Au', labTurnaroundH: 41, labStatus: 'cleared' },
        { id: 'int-seis', siteId: 'queensway-nfg', holeId: 'NFGC-24-2094', fromM: 711.0, toM: 718.0, trueWidthM: 7.0, grade: '1.50 g/t Au', labTurnaroundH: 38, labStatus: 'cleared' },
        { id: 'int-cd18', siteId: 'chitradurga-prospect', holeId: 'CD-18', fromM: 142.0, toM: 147.6, trueWidthM: 4.8, grade: '1.85% Cu, 0.22% Co', labTurnaroundH: 56, labStatus: 'pending' }
      ]
    },
    production: {
      kpis: {
        today: { blastHoles: 18, extractionHours: 6.4, dieselL: 1840, fraudFlags: 2, api4Usd: 109.4 },
        yesterday: { blastHoles: 0, extractionHours: 6.1, dieselL: 1760, fraudFlags: 1, api4Usd: 108.7 },
        week: { blastHoles: 42, extractionHours: 38.2, dieselL: 11240, fraudFlags: 2, api4Usd: 110.1 },
        month: { blastHoles: 168, extractionHours: 154, dieselL: 44800, fraudFlags: 3, api4Usd: 107.8 }
      },
      blasts: [
        {
          id: 'bl-b3e',
          siteId: 'kolar-north',
          bench: 'Bench 3 East',
          holes: 18,
          easting: 778412,
          northing: 1432088,
          rl: 810,
          azimuth: 92,
          dip: -18,
          burdenM: 4.5,
          spacingM: 5.0,
          delayMs: 25,
          status: 'stemmed'
        },
        {
          id: 'bl-b2w',
          siteId: 'kolar-north',
          bench: 'Bench 2 West pre-split',
          holes: 24,
          easting: 778201,
          northing: 1432194,
          rl: 860,
          azimuth: 274,
          dip: -15,
          burdenM: 3.2,
          spacingM: 3.5,
          delayMs: 17,
          status: 'charged'
        }
      ],
      extraction: [
        { id: 'ex-b4n', siteId: 'kolar-north', pit: 'Bench 4 North', ore: 'QZ-1 Quartz Lode', tons: 980, timeSpentH: 5.2, method: 'Shovel + 90 t dump', yieldPercent: 94.2, status: 'extracting' },
        { id: 'ex-b5', siteId: 'kolar-north', pit: 'Bench 5 Floor', ore: 'QZ-1 Quartz Lode', tons: 410, timeSpentH: 1.2, method: 'Loader reclaim', yieldPercent: 91.0, status: 'extracting' },
        { id: 'ex-qz2', siteId: 'kolar-north', pit: 'QZ-2 Footwall', ore: 'QZ-2 (deferred)', tons: 0, timeSpentH: 0, method: 'Idle — low grade', yieldPercent: 0, status: 'deferred_low_grade' },
        { id: 'ex-anth', siteId: 'talcher-anthracite', pit: 'Seam A face', ore: 'Anthracite Seam A', tons: 440, timeSpentH: 6.0, method: 'ROM sold raw', yieldPercent: 86.0, status: 'extracting_sell_raw' }
      ],
      diesel: [
        { id: 'dsl-ht14', siteId: 'kolar-north', asset: 'HT-14 haul', litres: 420, litresPerTon: 1.12, cycleMin: 28, shift: 'B', status: 'on_shift' },
        { id: 'dsl-ht07', siteId: 'kolar-north', asset: 'HT-07 haul', litres: 388, litresPerTon: 1.08, cycleMin: 31, shift: 'B', status: 'on_shift' },
        { id: 'dsl-ex3', siteId: 'kolar-north', asset: 'EX-03 shovel', litres: 610, litresPerTon: 0.62, cycleMin: 0, shift: 'B', status: 'on_shift' },
        { id: 'dsl-st11', siteId: 'talcher-anthracite', asset: 'ST-11 tipper (raw)', litres: 96, litresPerTon: 0.32, cycleMin: 44, shift: 'B', status: 'ticketed' }
      ],
      fraud: [
        { id: 'fr-st04', siteId: 'kolar-north', vehicle: 'ST-04', pile: 'Concentrate 50%', plannedKg: 28000, actualKg: 0, varianceKg: -28000, variancePercent: -100, flag: 'fraud_review', note: 'Gate hold — no crushed load; ticket would be empty.' },
        { id: 'fr-st09', siteId: 'kolar-north', vehicle: 'ST-09', pile: 'Concentrate 42%', plannedKg: 26000, actualKg: 0, varianceKg: -26000, variancePercent: -100, flag: 'held_gate', note: 'Plant starved. Not a theft flag yet.' },
        { id: 'fr-st11', siteId: 'talcher-anthracite', vehicle: 'ST-11', pile: 'Anthracite Seam A (raw)', plannedKg: 30000, actualKg: 29840, varianceKg: -160, variancePercent: -0.5, flag: 'cleared', note: 'Within 1% tolerance.' },
        { id: 'fr-st18', siteId: 'bellary-chrome', vehicle: 'ST-18', pile: 'ROM MG1', plannedKg: 27000, actualKg: 31220, varianceKg: 4220, variancePercent: 15.6, flag: 'fraud_review', note: 'Overload vs declared. Weighbridge mismatch.' }
      ],
      weather: [
        { id: 'wx-kn', siteId: 'kolar-north', at: 'Today 13:00', windKph: 18, rainMm: 0, visibilityKm: 12, lightning: 'none', blastWindow: 'open', note: 'Bench 3 East 14:00 tomorrow still clear.' },
        { id: 'wx-kn-storm', siteId: 'kolar-north', at: 'Tomorrow 16:00', windKph: 42, rainMm: 11, visibilityKm: 3, lightning: 'watch', blastWindow: 'hold', note: 'Cell after 15:30. Do not slip blast past 14:00.' }
      ],
      licenses: [
        { id: 'lic-ml', siteId: 'kolar-ml-renewal', permitId: 'ML/KGF/2018/04', type: 'Mining lease', expires: '2027-03-31', rehabBondInr: '4.8 Cr', status: 'renewal_in_progress', note: '' },
        { id: 'lic-ec', siteId: 'kolar-north', permitId: 'EC/KA/MIN/221', type: 'Environmental clearance', expires: '2028-11-12', rehabBondInr: 'included', status: 'valid', note: '' },
        { id: 'law-1', siteId: 'kolar-ml-renewal', permitId: 'Bill 14/2026', type: 'Upcoming law', expires: 'Vote Q4 2026', rehabBondInr: '—', status: 'watch', note: 'Draft royalty floor +2% on gold. CSR jobs still 38/60.' }
      ],
      coal: [
        { id: 'api4-today', siteId: 'talcher-anthracite', index: 'API4', basis: 'FOB Richards Bay 6000 kcal', usdPerT: 109.4, asOf: '2026-08-31', vsWeekPercent: 1.2, note: 'Mock snapshot — not a live socket. Seam A sold raw tracks this index.' },
        { id: 'api2-today', siteId: 'talcher-anthracite', index: 'API2', basis: 'CIF ARA 6000 kcal', usdPerT: 118.6, asOf: '2026-08-31', vsWeekPercent: 0.4, note: 'Reference only. Cargo is API4-linked.' }
      ]
    },
    insights: [
      {
        id: 'cap-survey',
        stage: 'surveying',
        area: 'Surveying',
        title: 'Anomaly C skipped — density too low to drill',
        detail: 'Density index 0.6 vs 4.2 on Anomaly A. Estimated $48k drill metres not spent on barren ground.'
      },
      {
        id: 'cap-prospect',
        stage: 'prospecting',
        area: 'Prospecting',
        title: 'Golden Dome true width 2.15 m at 343 g/t',
        detail: 'NFGC-24-2158 az 135° / dip −55°. CD-18 Cu/Co still pending (56 h). Resource class indicated on Dome, inferred on CD-18.'
      },
      {
        id: 'cap-prod',
        stage: 'production',
        area: 'Production',
        title: 'Blast geometry set; diesel 1.12 L/t; two fraud flags',
        detail: 'Bench 3 East 778412E / 1432088N, az 92°, dip −18°. ST-18 +15.6% vs declared. API4 $109.4/t (mock). Storm after 15:30 tomorrow — do not slip the 14:00 window.'
      }
    ]
  }
}

export function cycleKpis(capture, stage, period) {
  const block = capture?.[stage]
  if (!block?.kpis) return {}
  return block.kpis[period] || block.kpis.today
}
