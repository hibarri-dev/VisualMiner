const MODELS = '/models'

export const MACHINE_GLB = {
  haul_truck: `${MODELS}/free_old_mine_dump_truck.glb`,
  excavator: `${MODELS}/atek_4321_excavator.glb`,
  shovel: `${MODELS}/hitachi_excavator.glb`,
  front_loader: `${MODELS}/road_roller_truck.glb`,
  dozer: `${MODELS}/road_roller_truck.glb`,
  grader: `${MODELS}/road_roller_truck.glb`,
  drill: `${MODELS}/atek_4321_excavator.glb`,
  water_truck: `${MODELS}/free_old_mine_dump_truck.glb`,
  fuel_truck: `${MODELS}/free_old_mine_dump_truck.glb`
}

export const WORKER_GLB = `${MODELS}/worker.glb`
export const TERRAIN_GLB = `${MODELS}/pit-terrain.glb`

export const MODEL_SIZE = {
  haul_truck: 0.5,
  excavator: 0.46,
  shovel: 0.55,
  front_loader: 0.4,
  dozer: 0.38,
  grader: 0.38,
  drill: 0.4,
  water_truck: 0.46,
  fuel_truck: 0.46,
  worker: 0.32
}

export const GLB_PRELOAD = [
  MACHINE_GLB.haul_truck,
  MACHINE_GLB.excavator,
  MACHINE_GLB.shovel,
  MACHINE_GLB.front_loader,
  WORKER_GLB
]
