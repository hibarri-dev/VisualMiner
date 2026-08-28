import React, { useMemo } from 'react'
import { useVisibleMine } from '../../context/useMineData'
import { personForMachine } from '../../data'
import StatusBadge from '../dashboard/StatusBadge'
import Scene3D from '../three/Scene3D'
import QuarryGltf3D from '../three/QuarryGltf3D'
import MachineMarker3D from '../three/MachineMarker3D'
import PersonMarker3D from '../three/PersonMarker3D'
import { preloadGltfs } from '../three/FittedGltf'
import { GLB_PRELOAD } from '../../three/modelCatalog'

preloadGltfs(GLB_PRELOAD)

export default function MapsView({ currentRole }) {
  const {
    mine,
    selectedMachineId,
    selectedPersonId,
    setSelectedMachineId,
    setSelectedPersonId
  } = useVisibleMine(currentRole)

  const mapMachines = useMemo(() => {
    const all = mine.machines.filter(m => m.onMap)
    const featured = all.filter(m => m.featured)
    const rest = all.filter(m => !m.featured)
    return [...featured, ...rest].slice(0, 9)
  }, [mine.machines])
  const mapPeople = mine.personnel.filter(p => p.onMap)

  return (
    <div className="flex-1 flex flex-col gap-4 p-5 overflow-y-auto bg-[#0d0e12]">
      <div className="relative flex-1 min-h-[320px] rounded-2xl overflow-hidden bg-[#07090f] border border-[#232634] shadow-xl select-none">
        <div className="absolute left-4 top-3 z-20 flex items-center gap-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Machine monitoring</span>
          <StatusBadge value={`${mapMachines.length} on pit`} />
        </div>
        <Scene3D
          cameraPosition={[0.4, 8.6, 9.8]}
          sunPosition={[10, 12, 4]}
          controlsTarget={[0, 0.4, 0]}
          minDistance={4}
          maxDistance={22}
          fogNear={18}
          fogFar={42}
          onPointerMissed={() => setSelectedMachineId(null)}
        >
          <QuarryGltf3D />
          {mapMachines.map((machine, i) => (
            <MachineMarker3D
              key={machine.id}
              machine={machine}
              slot={i}
              selected={machine.id === selectedMachineId}
              operator={personForMachine(mine.personnel, machine.id)}
              onSelect={setSelectedMachineId}
            />
          ))}
        </Scene3D>
      </div>

      <div className="relative flex-1 min-h-[300px] rounded-2xl overflow-hidden bg-[#07090f] border border-[#232634] shadow-xl select-none">
        <div className="absolute left-4 top-3 z-20 flex items-center gap-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Personnel monitoring</span>
          <StatusBadge value={`${mapPeople.length} tagged`} />
        </div>
        <Scene3D
          cameraPosition={[-4.8, 7.1, 10.2]}
          sunPosition={[-6, 11, 7]}
          controlsTarget={[0, 0.5, 0]}
          minDistance={4}
          maxDistance={28}
          fogNear={18}
          fogFar={42}
          onPointerMissed={() => setSelectedPersonId(null)}
        >
          <QuarryGltf3D />
          {mapPeople.map(person => (
            <PersonMarker3D
              key={person.id}
              person={person}
              selected={person.id === selectedPersonId}
              onSelect={setSelectedPersonId}
            />
          ))}
        </Scene3D>
      </div>
    </div>
  )
}
