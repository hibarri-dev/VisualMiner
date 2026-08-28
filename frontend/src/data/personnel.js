import { mulberry32, pick, randInt, slugify } from './rng'

const FIRST_NAMES = [
  'Arvind', 'Rajesh', 'Priya', 'Suresh', 'Kavita', 'Mohammed', 'Anita', 'Vikram',
  'Deepak', 'Sunita', 'Ramesh', 'Lakshmi', 'Farhan', 'Meera', 'Kiran', 'Naveen',
  'Asha', 'Imran', 'Pooja', 'Harish', 'Divya', 'Sanjay', 'Neha', 'Yusuf',
  'Rekha', 'Ajay', 'Sneha', 'Karthik', 'Fatima', 'Manoj', 'Isha', 'Rohan'
]

const LAST_NAMES = [
  'Chopra', 'Reddy', 'Nair', 'Khan', 'Patel', 'Sharma', 'Iyer', 'Das',
  'Menon', 'Gupta', 'Singh', 'Fernandes', 'Pillai', 'Joshi', 'Shetty', 'Rao'
]

export const FEATURED_PERSONNEL = [
  {
    id: 'arvind-chopra',
    name: 'Arvind Chopra',
    age: 31,
    role: 'Machine Operator',
    roleGroup: 'operators',
    clearanceLevel: 2,
    assignedMachineId: 'XYTH67',
    zone: 'Bench 4 North',
    status: 'on_shift',
    shift: 'B',
    x: 26,
    y: 12,
    onMap: true,
    featured: true
  },
  {
    id: 'meera-nair',
    name: 'Meera Nair',
    age: 36,
    role: 'Safety Supervisor',
    roleGroup: 'safety',
    clearanceLevel: 3,
    assignedMachineId: null,
    zone: 'Crusher X17 Exclusion',
    status: 'on_shift',
    shift: 'B',
    x: 43,
    y: 70,
    onMap: true,
    featured: true
  },
  {
    id: 'vikram-reddy',
    name: 'Vikram Reddy',
    age: 44,
    role: 'Geologist',
    roleGroup: 'geologists',
    clearanceLevel: 3,
    assignedMachineId: null,
    zone: 'Bench 3 East',
    status: 'on_shift',
    shift: 'B',
    x: 64,
    y: 75,
    onMap: true,
    featured: true
  }
]

const ROLE_PLAN = [
  { roleGroup: 'operators', role: 'Machine Operator', count: 63, clearance: [1, 2] },
  { roleGroup: 'geologists', role: 'Geologist', count: 12, clearance: [2, 3] },
  { roleGroup: 'geologists', role: 'Mining Engineer', count: 9, clearance: [2, 3] },
  { roleGroup: 'safety', role: 'Safety Supervisor', count: 11, clearance: [3, 4] },
  { roleGroup: 'other', role: 'Plant Operator', count: 14, clearance: [1, 2] },
  { roleGroup: 'other', role: 'Fitter', count: 12, clearance: [1, 2] },
  { roleGroup: 'other', role: 'Blaster', count: 6, clearance: [3, 4] },
  { roleGroup: 'other', role: 'Surveyor', count: 5, clearance: [2, 3] },
  { roleGroup: 'other', role: 'Dispatcher', count: 7, clearance: [2, 3] }
]

const ZONES = [
  'Bench 1 Rim',
  'Bench 2 West',
  'Bench 3 East',
  'Bench 4 North',
  'Bench 4 South',
  'ROM Pad',
  'Crusher X17 Exclusion',
  'Heavy Workshop',
  'Pit Floor'
]

const MAP_PEOPLE = [
  { x: 75, y: 85 },
  { x: 38, y: 52 },
  { x: 55, y: 38 },
  { x: 22, y: 62 },
  { x: 70, y: 28 }
]

export function createPersonnel(machines) {
  const rng = mulberry32(88442211)
  const people = FEATURED_PERSONNEL.map(p => ({ ...p }))
  const usedIds = new Set(people.map(p => p.id))
  const usedNames = new Set(people.map(p => p.name))

  const reservedMachines = new Set(['XYTH67', 'X7UIH53'])
  const assigned = new Set(
    people.map(p => p.assignedMachineId).filter(Boolean)
  )
  const freeMachineIds = machines
    .filter(m => !assigned.has(m.id) && !reservedMachines.has(m.id))
    .map(m => m.id)

  let mapIdx = 0

  ROLE_PLAN.forEach(plan => {
    for (let i = 0; i < plan.count; i += 1) {
      let name = `${pick(rng, FIRST_NAMES)} ${pick(rng, LAST_NAMES)}`
      let guard = 0
      while (usedNames.has(name) && guard < 40) {
        name = `${pick(rng, FIRST_NAMES)} ${pick(rng, LAST_NAMES)}`
        guard += 1
      }
      usedNames.add(name)

      let id = slugify(name)
      if (usedIds.has(id)) id = `${id}-${randInt(rng, 2, 99)}`
      usedIds.add(id)

      const isOperator = plan.roleGroup === 'operators'
      const machineId = isOperator && freeMachineIds.length ? freeMachineIds.shift() : null
      const onMap = mapIdx < MAP_PEOPLE.length && rng() > 0.55
      const slot = onMap ? MAP_PEOPLE[mapIdx++] : null

      people.push({
        id,
        name,
        age: randInt(rng, 22, 56),
        role: plan.role,
        roleGroup: plan.roleGroup,
        clearanceLevel: pick(rng, plan.clearance),
        assignedMachineId: machineId,
        zone: pick(rng, ZONES),
        status: rng() > 0.12 ? 'on_shift' : pick(rng, ['break', 'off_site']),
        shift: pick(rng, ['A', 'B', 'C']),
        x: slot ? slot.x : randInt(rng, 14, 86),
        y: slot ? slot.y : randInt(rng, 18, 82),
        onMap: Boolean(slot),
        featured: false
      })
    }
  })

  return people
}

export function personForMachine(personnel, machineId) {
  return personnel.find(p => p.assignedMachineId === machineId) ?? null
}
