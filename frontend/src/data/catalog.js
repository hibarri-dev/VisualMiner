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
    name: 'Terminal 2',
    berth: 'B-4',
    vessel: 'MV Deccan Bulk',
    status: 'waiting_cargo',
    note: 'Hold — no crushed stockpiles available to load'
  }
]

export const WORKER_PERSONA = {
  personId: 'arvind-chopra',
  machineId: 'XYTH67'
}
