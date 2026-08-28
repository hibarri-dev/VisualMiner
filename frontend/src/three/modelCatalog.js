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
export const QUARRY_GCP = `${MODELS}/quarry_gcp.glb`

export const MODEL_SIZE = {
  haul_truck: 0.34,
  excavator: 0.3,
  shovel: 0.36,
  front_loader: 0.28,
  dozer: 0.26,
  grader: 0.26,
  drill: 0.28,
  water_truck: 0.32,
  fuel_truck: 0.32,
  worker: 0.3
}

export const GLB_PRELOAD = [
  MACHINE_GLB.haul_truck,
  MACHINE_GLB.excavator,
  MACHINE_GLB.shovel,
  MACHINE_GLB.front_loader,
  WORKER_GLB,
  QUARRY_GCP
]
