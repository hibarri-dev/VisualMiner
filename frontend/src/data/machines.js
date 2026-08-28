import { mulberry32, pick, randInt, uniqueCode } from './rng'

export const MACHINE_TYPES = {
  haul_truck: { label: 'Haul Truck', group: 'haulers', models: ['CAT 777G', 'Komatsu HD785', 'BEL BH100'] },
  excavator: { label: 'Excavator', group: 'excavators', models: ['CAT 6030', 'Hitachi EX1900', 'Liebherr R 9400'] },
  drill: { label: 'Drill Rig', group: 'drills', models: ['Epiroc PV-271', 'Sandvik DR412i', 'CAT MD6250'] }
}

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
    featured: true
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
    featured: true
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
    featured: true
  }
]

const HAUL_STATUSES = ['Hauling', 'Dumping', 'Loading', 'Idle', 'Queued']
const EXCAVATOR_STATUSES = ['Digging', 'Loading', 'Idle', 'Maintenance']
const DRILL_STATUSES = ['Drilling', 'Relocating', 'Idle']
const BENCHES = ['Bench 1 Rim', 'Bench 2 West', 'Bench 3 East', 'Bench 4 North', 'Bench 4 South', 'Bench 5 Floor']

const MAP_SLOTS = [
  { x: 48, y: 42 },
  { x: 58, y: 30 },
  { x: 40, y: 58 },
  { x: 64, y: 62 },
  { x: 28, y: 48 },
  { x: 78, y: 40 },
  { x: 52, y: 72 }
]

export function createMachines() {
  const rng = mulberry32(20260828)
  const used = new Set(FEATURED_MACHINES.map(m => m.id))
  const machines = FEATURED_MACHINES.map(m => ({ ...m }))

  const plan = [
    { type: 'haul_truck', count: 24 },
    { type: 'excavator', count: 13 },
    { type: 'drill', count: 8 }
  ]

  let mapSlot = 0
  let serial = 10
  plan.forEach(({ type, count }) => {
    for (let i = 0; i < count; i += 1) {
      const spec = MACHINE_TYPES[type]
      const model = pick(rng, spec.models)
      const onMap = type === 'haul_truck' && mapSlot < MAP_SLOTS.length
      const slot = onMap ? MAP_SLOTS[mapSlot++] : null
      const status =
        type === 'haul_truck'
          ? pick(rng, HAUL_STATUSES)
          : type === 'excavator'
            ? pick(rng, EXCAVATOR_STATUSES)
            : pick(rng, DRILL_STATUSES)

      machines.push({
        id: uniqueCode(rng, used),
        name: `${model} #${serial++}`,
        type,
        fuelPercent: randInt(rng, 18, 96),
        payloadKg: type === 'haul_truck' ? randInt(rng, 0, 90000) : 0,
        payloadCapacityKg: type === 'haul_truck' ? 90000 : 0,
        status: i === 0 && type === 'haul_truck' ? 'Breakdown' : status,
        bench: pick(rng, BENCHES),
        zone: pick(rng, ['ROM Pad', 'Haul Road 1', 'Haul Road 2', 'Crusher Queue', 'Workshop', 'Pit Floor']),
        x: slot ? slot.x : randInt(rng, 12, 88),
        y: slot ? slot.y : randInt(rng, 16, 84),
        onMap,
        featured: false
      })
    }
  })

  return machines
}

export function machineGroup(type) {
  return MACHINE_TYPES[type]?.group ?? 'fleet'
}
