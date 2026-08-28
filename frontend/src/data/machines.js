import { mulberry32, pick, randInt, uniqueCode } from './rng'

export const MACHINE_TYPES = {
  haul_truck: {
    label: 'Dump Truck',
    group: 'haulers',
    path: 'haul',
    payloadKg: 90000,
    models: ['CAT 777G', 'CAT 785D', 'Komatsu HD785', 'BEL BH100']
  },
  excavator: {
    label: 'Excavator',
    group: 'excavators',
    path: 'bench',
    payloadKg: 0,
    models: ['CAT 6030', 'Hitachi EX1900', 'Liebherr R 9400']
  },
  shovel: {
    label: 'Mining Shovel',
    group: 'excavators',
    path: 'bench',
    payloadKg: 0,
    models: ['P&H 4100XPC', 'CAT 6060']
  },
  front_loader: {
    label: 'Front Loader',
    group: 'loaders',
    path: 'bench',
    payloadKg: 35000,
    models: ['CAT 992K', 'Komatsu WA800', 'Volvo L350H']
  },
  dozer: {
    label: 'Track Dozer',
    group: 'dozers',
    path: 'bench',
    payloadKg: 0,
    models: ['CAT D11T', 'Komatsu D475A']
  },
  grader: {
    label: 'Motor Grader',
    group: 'dozers',
    path: 'haul',
    payloadKg: 0,
    models: ['CAT 16M', 'Komatsu GD825']
  },
  drill: {
    label: 'Drill Rig',
    group: 'drills',
    path: 'rim',
    payloadKg: 0,
    models: ['Epiroc PV-271', 'Sandvik DR412i', 'CAT MD6250']
  },
  water_truck: {
    label: 'Water Truck',
    group: 'support',
    path: 'haul',
    payloadKg: 80000,
    models: ['CAT 777 Water Cart', 'Terex TA400 Water']
  },
  fuel_truck: {
    label: 'Fuel / Lube Truck',
    group: 'support',
    path: 'haul',
    payloadKg: 20000,
    models: ['CAT 740 Fuel Truck', 'Ashok Leyland 3120']
  }
}

export const MACHINE_TYPE_LIST = Object.entries(MACHINE_TYPES).map(([id, spec]) => ({ id, ...spec }))

export const TRACK_PATHS = {
  haul: [
    { x: 19, y: 80 },
    { x: 28, y: 48 },
    { x: 31, y: 24 },
    { x: 52, y: 18 },
    { x: 72, y: 40 },
    { x: 78, y: 72 },
    { x: 64, y: 82 },
    { x: 40, y: 78 }
  ],
  bench: [
    { x: 38, y: 44 },
    { x: 50, y: 32 },
    { x: 62, y: 46 },
    { x: 52, y: 60 },
    { x: 40, y: 56 }
  ],
  rim: [
    { x: 16, y: 28 },
    { x: 50, y: 12 },
    { x: 84, y: 26 },
    { x: 76, y: 52 },
    { x: 24, y: 50 }
  ]
}

const STATUSES = {
  haul: ['Hauling', 'Dumping', 'Loading', 'Queued'],
  bench: ['Digging', 'Loading', 'Pushing'],
  rim: ['Drilling', 'Relocating']
}

const BENCHES = ['Bench 1 Rim', 'Bench 2 West', 'Bench 3 East', 'Bench 4 North', 'Bench 4 South', 'Bench 5 Floor']
export const MACHINE_ZONES = ['ROM Pad', 'Haul Road 1', 'Haul Road 2', 'Crusher Queue', 'Workshop', 'Pit Floor']

export const FEATURED_MACHINES = [
  {
    id: 'X7UIH53',
    name: 'CAT 777G #53',
    type: 'haul_truck',
    fuelPercent: 87,
    payloadKg: 6700,
    payloadCapacityKg: 90000,
    status: 'Dumping',
    bench: 'Bench 4 North',
    zone: 'ROM Pad',
    x: 72,
    y: 78,
    onMap: true,
    featured: true,
    tracked: true,
    trackerId: 'GPS-X7UIH53',
    waypointIndex: 5,
    speed: 2.4
  },
  {
    id: 'XYTH67',
    name: 'CAT 6030 #67',
    type: 'excavator',
    fuelPercent: 64,
    payloadKg: 0,
    payloadCapacityKg: 0,
    status: 'Loading',
    bench: 'Bench 4 North',
    zone: 'Bench 4 North',
    x: 31,
    y: 24,
    onMap: true,
    featured: true,
    tracked: true,
    trackerId: 'GPS-XYTH67',
    waypointIndex: 0,
    speed: 0.9
  },
  {
    id: 'K4MPL22',
    name: 'Komatsu HD785 #22',
    type: 'haul_truck',
    fuelPercent: 41,
    payloadKg: 78400,
    payloadCapacityKg: 90000,
    status: 'Hauling',
    bench: 'Bench 4 South',
    zone: 'Haul Road 2',
    x: 19,
    y: 80,
    onMap: true,
    featured: true,
    tracked: true,
    trackerId: 'GPS-K4MPL22',
    waypointIndex: 0,
    speed: 2.6
  }
]

export function pathSpeed(path) {
  if (path === 'haul') return 2.4
  if (path === 'rim') return 1.3
  return 0.95
}

export function stepAlongPath(m) {
  if (!m.onMap || !m.tracked) return m
  if (m.status === 'Breakdown' || m.status === 'Maintenance') return m

  const spec = MACHINE_TYPES[m.type]
  const path = TRACK_PATHS[spec?.path || 'bench']
  if (!path?.length) return m

  const idx = m.waypointIndex ?? 0
  const target = path[idx % path.length]
  const speed = m.speed || pathSpeed(spec?.path)
  const dx = target.x - m.x
  const dy = target.y - m.y
  const dist = Math.hypot(dx, dy)

  if (dist <= speed) {
    return { ...m, x: target.x, y: target.y, waypointIndex: (idx + 1) % path.length }
  }

  return {
    ...m,
    x: m.x + (dx / dist) * speed,
    y: m.y + (dy / dist) * speed
  }
}

export function createMachines() {
  const rng = mulberry32(20260828)
  const used = new Set(FEATURED_MACHINES.map(m => m.id))
  const machines = FEATURED_MACHINES.map(m => ({ ...m }))

  const plan = [
    { type: 'haul_truck', count: 14 },
    { type: 'excavator', count: 9 },
    { type: 'front_loader', count: 6 },
    { type: 'dozer', count: 4 },
    { type: 'grader', count: 2 },
    { type: 'drill', count: 5 },
    { type: 'water_truck', count: 3 },
    { type: 'fuel_truck', count: 1 },
    { type: 'shovel', count: 1 }
  ]

  const onMapBudget = {
    haul_truck: 4,
    excavator: 2,
    front_loader: 2,
    dozer: 1,
    grader: 1,
    drill: 1,
    water_truck: 1,
    fuel_truck: 1,
    shovel: 1
  }
  const onMapUsed = {}

  let serial = 10
  plan.forEach(({ type, count }) => {
    const spec = MACHINE_TYPES[type]
    for (let i = 0; i < count; i += 1) {
      const usedForType = onMapUsed[type] || 0
      const onMap = usedForType < (onMapBudget[type] || 0)
      if (onMap) onMapUsed[type] = usedForType + 1

      const path = spec.path
      const start = pick(rng, TRACK_PATHS[path])
      const waypointIndex = randInt(rng, 0, TRACK_PATHS[path].length - 1)
      const id = uniqueCode(rng, used)

      machines.push({
        id,
        name: `${pick(rng, spec.models)} #${serial++}`,
        type,
        fuelPercent: randInt(rng, 18, 96),
        payloadKg: spec.payloadKg ? randInt(rng, 0, spec.payloadKg) : 0,
        payloadCapacityKg: spec.payloadKg || 0,
        status: i === 0 && type === 'haul_truck' ? 'Breakdown' : pick(rng, STATUSES[path] || ['Idle']),
        bench: pick(rng, BENCHES),
        zone: pick(rng, MACHINE_ZONES),
        x: onMap ? start.x : randInt(rng, 12, 88),
        y: onMap ? start.y : randInt(rng, 16, 84),
        onMap,
        featured: false,
        tracked: true,
        trackerId: `GPS-${id}`,
        waypointIndex,
        speed: pathSpeed(path) + rng() * 0.6
      })
    }
  })

  return machines
}

export function machineGroup(type) {
  return MACHINE_TYPES[type]?.group ?? 'fleet'
}
