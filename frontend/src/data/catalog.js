export const SITES_CATALOG = [
  {
    id: 'kolar-north',
    name: 'Kolar North Open Pit',
    code: 'KNP-01',
    location: 'Kolar Gold Fields, Karnataka',
    type: 'open_pit', // 'open_pit' | 'wash_plant' | 'crushing_plant' | 'exploration' | 'port_terminal'
    typeLabel: 'Open Pit Mine',
    stage: 'extraction',
    stageLabel: 'Extraction',
    commodity: 'Gold',
    activeAlerts: 1,
    testResults: {
      hasData: true,
      lithology: 'Banded Iron Formation & Quartz Lode',
      assayGrade: '3.42 g/t Au (Core Log #409)',
      recoveryRate: '94.2%',
      waterQualityIndex: '98.5 (Potable/Safe)',
      ambientDust: '38 µg/m³ (Normal)',
      lastSurveyDate: '2026-08-27'
    },
    metrics: {
      extraction: '170 t/h',
      personnel: 142,
      machines: 48
    }
  },
  {
    id: 'kolar-washplant-south',
    name: 'South Basin Wash Plant',
    code: 'SBW-04',
    location: 'Kolar South Valley, Karnataka',
    type: 'wash_plant',
    typeLabel: 'Stand-alone Wash Plant',
    stage: 'processing',
    stageLabel: 'Processing',
    commodity: 'Industrial Sand & Aggregates',
    activeAlerts: 0,
    testResults: {
      hasData: true,
      lithology: 'Fines & Tailings Slurry',
      assayGrade: '99.1% Silica purity',
      recoveryRate: '88.0%',
      waterQualityIndex: '92.0 (Recycled Closed Loop)',
      ambientDust: '22 µg/m³ (Low)',
      lastSurveyDate: '2026-08-25'
    },
    metrics: {
      extraction: '0 t/h (Feed only)',
      personnel: 18,
      machines: 4
    }
  },
  {
    id: 'hospet-crushing-hub',
    name: 'Hospet Secondary Crushing Plant',
    code: 'HCP-02',
    location: 'Hospet Industrial Corridor, Bellary',
    type: 'crushing_plant',
    typeLabel: 'Stand-alone Crushing Plant',
    stage: 'processing',
    stageLabel: 'Processing',
    commodity: 'Iron Ore (Lump & Fines)',
    activeAlerts: 1,
    testResults: {
      hasData: false, // Skipped / Add later demo
      lithology: 'Pending Laboratory Ingestion',
      assayGrade: 'Awaiting lab sync (add later)',
      recoveryRate: 'Pending calibration',
      waterQualityIndex: 'N/A',
      ambientDust: '54 µg/m³ (Moderate)',
      lastSurveyDate: '2026-08-20'
    },
    metrics: {
      extraction: '10 t/h (Reduced)',
      personnel: 24,
      machines: 8
    }
  },
  {
    id: 'queensway-nfg',
    name: 'Queensway Gold (New Found Gold)',
    code: 'NFGC-QW',
    location: '15 km west of Gander, Newfoundland and Labrador',
    type: 'exploration',
    typeLabel: 'Listed explorer — no operating mine',
    stage: 'prospecting',
    stageLabel: 'Prospecting',
    commodity: 'Gold (Appleton Fault)',
    activeAlerts: 0,
    testResults: {
      hasData: true,
      lithology: 'Orogenic gold in siltstone/sandstone along the Appleton Fault Zone',
      assayGrade: '343 g/t Au over 2.15 m (NFGC-24-2158, Golden Dome)',
      recoveryRate: 'No mill — PEA stage, public NI 43-101 only',
      waterQualityIndex: 'Baseline (exploration camp)',
      ambientDust: 'N/A (no pit)',
      lastSurveyDate: '2025-04-29'
    },
    metrics: {
      extraction: '0 t/h (pre-mining)',
      personnel: 0,
      machines: 8
    }
  },
  {
    id: 'chitradurga-prospect',
    name: 'Chitradurga East Ridge',
    code: 'CDE-09',
    location: 'Chitradurga Schist Belt',
    type: 'exploration',
    typeLabel: 'Survey & Exploration Prospect',
    stage: 'prospecting',
    stageLabel: 'Prospecting',
    commodity: 'Copper & Cobalt',
    activeAlerts: 0,
    testResults: {
      hasData: true,
      lithology: 'Volcanogenic Massive Sulfide',
      assayGrade: '1.85% Cu, 0.22% Co',
      recoveryRate: 'Feasibility Stage',
      waterQualityIndex: 'Baseline Pristine',
      ambientDust: '15 µg/m³',
      lastSurveyDate: '2026-08-28'
    },
    metrics: {
      extraction: '0 t/h (Pre-mining)',
      personnel: 12,
      machines: 2
    }
  },
  {
    id: 'mangalore-port-terminal',
    name: 'New Mangalore Bulk Port (Customer Owned)',
    code: 'NMPT-03',
    location: 'Panambur, Mangalore Coastal Port',
    type: 'port_terminal',
    typeLabel: 'Private Port & Transshipment',
    stage: 'transport',
    stageLabel: 'Transport',
    commodity: 'Bulk Ore & Aggregates',
    activeAlerts: 1,
    testResults: {
      hasData: true,
      lithology: 'Moisture & Granulometry Assay',
      assayGrade: 'Moisture: 7.2% | ISO Draft Survey',
      recoveryRate: 'Transshipment 1200 t/h design',
      waterQualityIndex: 'Coastal Monitoring Safe',
      ambientDust: '28 µg/m³',
      lastSurveyDate: '2026-08-28'
    },
    metrics: {
      extraction: 'Vessel: MV Deccan Bulk',
      personnel: 35,
      machines: 12
    }
  },
  {
    id: 'kolar-survey-grid',
    name: 'Kolar West LiDAR Block',
    code: 'KWL-00',
    location: 'West of Kolar North rim',
    type: 'exploration',
    typeLabel: 'Survey grid (no pit yet)',
    stage: 'surveying',
    stageLabel: 'Surveying',
    commodity: 'Gold targets',
    activeAlerts: 0,
    sellsRaw: false,
    testResults: {
      hasData: true,
      lithology: 'Drone LiDAR + ground mag — 3 anomalies',
      assayGrade: 'No core yet',
      recoveryRate: 'N/A',
      waterQualityIndex: 'Baseline',
      ambientDust: '12 µg/m³',
      lastSurveyDate: '2026-08-28'
    },
    metrics: { extraction: '0 t/h', personnel: 6, machines: 1 }
  },
  {
    id: 'bellary-chrome',
    name: 'Bellary MG1 Chrome Pit',
    code: 'BMC-07',
    location: 'Sandur belt, Bellary',
    type: 'open_pit',
    typeLabel: 'Chrome pit + plant',
    stage: 'processing',
    stageLabel: 'Processing',
    commodity: 'Chrome (24% ROM → 42/50/60% conc)',
    activeAlerts: 1,
    sellsRaw: false,
    testResults: {
      hasData: true,
      lithology: 'MG1 / MG2 chromite seams',
      assayGrade: 'ROM 24.1% Cr2O3 · Conc 42% lab 41.6% (off spec)',
      recoveryRate: 'Plant starved — X17 corridor',
      waterQualityIndex: 'Recycle 90',
      ambientDust: '44 µg/m³',
      lastSurveyDate: '2026-08-27'
    },
    metrics: { extraction: '90 t/h ROM', personnel: 86, machines: 22 }
  },
  {
    id: 'talcher-anthracite',
    name: 'Talcher Anthracite Seam A',
    code: 'TAS-03',
    location: 'Talcher coalfield (demo)',
    type: 'open_pit',
    typeLabel: 'Sells ROM raw — no plant',
    stage: 'extraction',
    stageLabel: 'Extraction',
    commodity: 'Anthracite',
    activeAlerts: 0,
    sellsRaw: true,
    testResults: {
      hasData: true,
      lithology: 'Seam A anthracite',
      assayGrade: 'Fixed carbon 86% — sold as extracted',
      recoveryRate: 'N/A (no concentrate)',
      waterQualityIndex: 'OK',
      ambientDust: '61 µg/m³',
      lastSurveyDate: '2026-08-26'
    },
    metrics: { extraction: '55 t/h raw', personnel: 40, machines: 11 }
  },
  {
    id: 'kolar-old-void',
    name: 'Kolar Historic Void',
    code: 'KHV-99',
    location: 'Legacy workings, KGF',
    type: 'open_pit',
    typeLabel: 'Closed pit',
    stage: 'rehabilitation',
    stageLabel: 'Rehabilitation',
    commodity: 'None — dormant',
    activeAlerts: 0,
    sellsRaw: false,
    testResults: {
      hasData: true,
      lithology: 'Backfill + topsoil trial plots',
      assayGrade: 'N/A',
      recoveryRate: 'Dormant',
      waterQualityIndex: 'Piezometers monthly',
      ambientDust: '18 µg/m³',
      lastSurveyDate: '2026-08-01'
    },
    metrics: { extraction: '0 t/h', personnel: 4, machines: 1 }
  },
  {
    id: 'kolar-ml-renewal',
    name: 'Kolar ML renewal & CSR desk',
    code: 'KML-11',
    location: 'Robertsonpet / district office',
    type: 'exploration',
    typeLabel: 'Licensing & communities',
    stage: 'licensing',
    stageLabel: 'Licensing & communities',
    commodity: 'Gold (permit cycle)',
    activeAlerts: 1,
    sellsRaw: false,
    testResults: {
      hasData: true,
      lithology: 'Rehab bond + village employment register',
      assayGrade: 'N/A — not extracting',
      recoveryRate: 'Jobs 38 / 60 promised',
      waterQualityIndex: 'Bond monitoring',
      ambientDust: 'N/A',
      lastSurveyDate: '2026-08-15'
    },
    metrics: { extraction: '0 t/h (permit)', personnel: 8, machines: 0 }
  },
  {
    id: 'bellary-conc-lab',
    name: 'Bellary concentrate assay shed',
    code: 'BCA-08',
    location: 'Adjacent MG1 plant, Sandur',
    type: 'crushing_plant',
    typeLabel: 'Stockpile laboratory',
    stage: 'testing',
    stageLabel: 'Testing',
    commodity: 'Chrome concentrate 42/50/60%',
    activeAlerts: 1,
    sellsRaw: false,
    testResults: {
      hasData: true,
      lithology: 'Named piles awaiting sale cert',
      assayGrade: 'Conc 42% = 41.6% Cr2O3 (off spec)',
      recoveryRate: 'Hold 42% pile — do not load',
      waterQualityIndex: 'N/A',
      ambientDust: 'Plant adjacent',
      lastSurveyDate: '2026-08-28'
    },
    metrics: { extraction: '0 t/h (lab)', personnel: 6, machines: 0 }
  }
]

export const SITE = {
  id: 'kolar-north',
  name: 'Kolar North Pit',
  code: 'KNP-01',
  commodity: 'Gold',
  region: 'Kolar, Karnataka',
  timezone: 'Asia/Kolkata',
  operator: 'Oliver Vance',
  shiftPattern: '3 × 8h',
  currentShift: 'B',
  elevation: { rim: 920, floor: 640, unit: 'm AMSL' }
}

export const BENCHES = [
  { id: 'bench-1', name: 'Bench 1 Rim', elevation: 900 },
  { id: 'bench-2', name: 'Bench 2 West', elevation: 860 },
  { id: 'bench-3', name: 'Bench 3 East', elevation: 810 },
  { id: 'bench-4-north', name: 'Bench 4 North', elevation: 760 },
  { id: 'bench-4-south', name: 'Bench 4 South', elevation: 755 },
  { id: 'bench-5', name: 'Bench 5 Floor', elevation: 680 }
]

export const GEOFENCES = [
  { id: 'gf-b4n', name: 'Bench 4 North', type: 'work', status: 'active', personnel: 18, machines: 7 },
  { id: 'gf-b4s', name: 'Bench 4 South', type: 'work', status: 'active', personnel: 11, machines: 4 },
  { id: 'gf-rom', name: 'ROM Pad', type: 'work', status: 'active', personnel: 9, machines: 8 },
  { id: 'gf-crusher', name: 'Crusher X17 Exclusion', type: 'hazard', status: 'active', personnel: 3, machines: 2 },
  { id: 'gf-blast', name: 'Bench 3 East Blast Radius', type: 'exclusion', status: 'armed', personnel: 0, machines: 0 },
  { id: 'gf-workshop', name: 'Heavy Workshop', type: 'work', status: 'active', personnel: 14, machines: 5 }
]

export const FEED_CATALOG = [
  { id: 'feed-cat', name: 'CAT Fleet System', status: 'connected', latency: 42, domain: 'fleet', lastPayload: 'X7UIH53 dumping · 6700 kg' },
  { id: 'feed-sap', name: 'SAP ERP', status: 'connected', latency: 120, domain: 'erp', lastPayload: '17 tippers standing time accruing' },
  { id: 'feed-scada', name: 'SCADA Telemetry', status: 'live', latency: 18, domain: 'plant', lastPayload: 'X17 fault F-441 · 10 t/h' },
  { id: 'feed-hexagon', name: 'Hexagon Mining', status: 'connected', latency: 65, domain: 'fleet', lastPayload: 'Haul spiral R12 machine guidance' },
  { id: 'feed-deswik', name: 'Deswik Mine Planning', status: 'syncing', latency: 210, domain: 'planning', lastPayload: 'Bench 3 East blast 14:00 tomorrow' },
  { id: 'feed-micromine', name: 'Micromine Geological', status: 'connected', latency: 90, domain: 'geology', lastPayload: 'QZ-1 block model 3.42 g/t Au' },
  { id: 'feed-arcgis', name: 'ArcGIS Geospatial', status: 'connected', latency: 55, domain: 'geo', lastPayload: 'ML boundary + Robertsonpet CSR layer' },
  { id: 'feed-drone', name: 'Drone LiDAR System', status: 'live', latency: 30, domain: 'survey', lastPayload: 'West grid — 3 mag anomalies' },
  { id: 'feed-cmms', name: 'CMMS Maintenance', status: 'connected', latency: 140, domain: 'maintenance', lastPayload: 'WO-441 jaw replacement open' },
  { id: 'feed-lab', name: 'Laboratory Assay System', status: 'connected', latency: 80, domain: 'lab', lastPayload: 'Conc 42% = 41.6% Cr2O3 off spec' }
]

export const PLANTS = [
  {
    id: 'X17',
    name: 'Crusher Unit X17',
    type: 'crusher',
    throughputTph: 10,
    nameplateTph: 210,
    status: 'mechanical_failure',
    note: 'Primary jaw seized — millwrights on site'
  },
  {
    id: 'SCR-1',
    name: 'Screening Deck A',
    type: 'screener',
    throughputTph: 5,
    nameplateTph: 180,
    status: 'starved',
    note: 'Starved of crushed feed from X17'
  },
  {
    id: 'WASH-1',
    name: 'Washing Plant',
    type: 'washer',
    throughputTph: 4,
    nameplateTph: 120,
    status: 'normal',
    note: 'Idling on recycle water'
  }
]

export const STOCKPILES = [
  { id: 'sp-rom', name: 'ROM Coarse (QZ-1)', tons: 6420, capacity: 12000, status: 'high', gradeLabel: '3.42 g/t Au', siteId: 'kolar-north' },
  { id: 'sp-crushed', name: 'Crushed Fines', tons: 0, capacity: 8000, status: 'empty', gradeLabel: '—', siteId: 'kolar-north' },
  { id: 'sp-oxide', name: 'Oxide Ore', tons: 1880, capacity: 6000, status: 'ok', gradeLabel: 'oxide Au', siteId: 'kolar-north' },
  { id: 'sp-waste', name: 'Waste Dump West', tons: 21400, capacity: 40000, status: 'ok', gradeLabel: 'waste', siteId: 'kolar-north' },
  { id: 'sp-rom-chrome', name: 'ROM Chrome 24%', tons: 8200, capacity: 15000, status: 'high', gradeLabel: '24% Cr2O3', siteId: 'bellary-chrome' },
  { id: 'sp-conc-42', name: 'Concentrate 42%', tons: 410, capacity: 5000, status: 'ok', gradeLabel: '42% Cr2O3', siteId: 'bellary-chrome' },
  { id: 'sp-conc-50', name: 'Concentrate 50%', tons: 880, capacity: 5000, status: 'ok', gradeLabel: '50% Cr2O3', siteId: 'bellary-chrome' },
  { id: 'sp-conc-60', name: 'Concentrate 60%', tons: 0, capacity: 4000, status: 'empty', gradeLabel: '60% Cr2O3', siteId: 'bellary-chrome' },
  { id: 'sp-anth', name: 'Anthracite Seam A (raw sale)', tons: 2100, capacity: 8000, status: 'ok', gradeLabel: 'FC 86%', siteId: 'talcher-anthracite' },
  { id: 'sp-silica', name: 'Washed silica (South Basin)', tons: 3400, capacity: 6000, status: 'ok', gradeLabel: '99.1% SiO2', siteId: 'kolar-washplant-south' }
]

export const PORTS = [
  {
    id: 'terminal-2',
    name: 'Mangalore Port Terminal 2 (Customer Berth)',
    berth: 'B-4 Deepwater',
    vessel: 'MV Deccan Bulk',
    status: 'waiting_cargo',
    capacityTons: 65000,
    loadedTons: 12400,
    loadRateTph: 0,
    note: 'Hold — no crushed stockpiles available to load from Hospet/Kolar corridor'
  },
  {
    id: 'terminal-west',
    name: 'Terminal 1 Coastal Barge Berth',
    berth: 'Barge Pier C',
    vessel: 'Barge V-102 (Washplant Slurry)',
    status: 'loading',
    capacityTons: 12000,
    loadedTons: 9800,
    loadRateTph: 450,
    note: 'Loading South Basin washed silica sand'
  }
]

export const WORKER_PERSONA = {
  personId: 'arvind-chopra',
  machineId: 'XYTH67'
}
