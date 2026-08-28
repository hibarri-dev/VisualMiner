export const SITES_CATALOG = [
  {
    id: 'kolar-north',
    name: 'Kolar North Open Pit',
    code: 'KNP-01',
    location: 'Kolar Gold Fields, Karnataka',
    type: 'open_pit', // 'open_pit' | 'wash_plant' | 'crushing_plant' | 'exploration' | 'port_terminal'
    typeLabel: 'Open Pit Mine',
    stage: 'mining', // 'surveying' | 'prospecting' | 'mining' | 'processing' | 'rehabilitation'
    stageLabel: 'Active Mining',
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
    stage: 'processing',
    stageLabel: 'Logistics & Loading',
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
  }
]

export const SITE_STAGES = [
  { id: 'surveying', label: 'Surveying', color: '#a855f7', desc: 'Topographical LiDAR & baseline geodetic mapping' },
  { id: 'prospecting', label: 'Prospecting', color: '#38bdf8', desc: 'Core sampling, geological assay & reserve modeling' },
  { id: 'mining', label: 'Mining', color: '#10b981', desc: 'Active pit extraction, drilling & blast operations' },
  { id: 'processing', label: 'Processing', color: '#f59e0b', desc: 'Crushing, washing, screening & beneficiation plants' },
  { id: 'rehabilitation', label: 'Rehabilitation', color: '#06b6d4', desc: 'Topsoil restoration, eco-revegetation & monitoring' }
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
  { id: 'feed-cat', name: 'CAT Fleet System', status: 'connected', latency: 42, domain: 'fleet' },
  { id: 'feed-sap', name: 'SAP ERP', status: 'connected', latency: 120, domain: 'erp' },
  { id: 'feed-scada', name: 'SCADA Telemetry', status: 'live', latency: 18, domain: 'plant' },
  { id: 'feed-hexagon', name: 'Hexagon Mining', status: 'connected', latency: 65, domain: 'fleet' },
  { id: 'feed-deswik', name: 'Deswik Mine Planning', status: 'syncing', latency: 210, domain: 'planning' },
  { id: 'feed-micromine', name: 'Micromine Geological', status: 'connected', latency: 90, domain: 'geology' },
  { id: 'feed-arcgis', name: 'ArcGIS Geospatial', status: 'connected', latency: 55, domain: 'geo' },
  { id: 'feed-drone', name: 'Drone LiDAR System', status: 'live', latency: 30, domain: 'survey' },
  { id: 'feed-cmms', name: 'CMMS Maintenance', status: 'connected', latency: 140, domain: 'maintenance' },
  { id: 'feed-lab', name: 'Laboratory Assay System', status: 'connected', latency: 80, domain: 'lab' }
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
  { id: 'sp-crushed', name: 'Crushed Fines', tons: 0, capacity: 8000, status: 'empty' },
  { id: 'sp-rom', name: 'ROM Coarse', tons: 6420, capacity: 12000, status: 'high' },
  { id: 'sp-oxide', name: 'Oxide Ore', tons: 1880, capacity: 6000, status: 'ok' },
  { id: 'sp-waste', name: 'Waste Dump West', tons: 21400, capacity: 40000, status: 'ok' }
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
