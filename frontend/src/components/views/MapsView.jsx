import React, { useMemo, useState } from 'react'
import { useVisibleMine } from '../../context/useMineData'
import { personForMachine } from '../../data'
import StatusBadge from '../dashboard/StatusBadge'
import Scene3D from '../three/Scene3D'
import QuarryGltf3D from '../three/QuarryGltf3D'
import LidarTerrain3D from '../three/LidarTerrain3D'
import ViewModeToggle from '../three/ViewModeToggle'
import MachineMarker3D from '../three/MachineMarker3D'
import PersonMarker3D from '../three/PersonMarker3D'
import { preloadGltfs } from '../three/FittedGltf'
import { GLB_PRELOAD } from '../../three/modelCatalog'

preloadGltfs(GLB_PRELOAD)

export default function MapsView({ currentRole }) {
  const [machineMode, setMachineMode] = useState('daylight')
  const [personMode, setPersonMode] = useState('daylight')
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
    <div className="flex-1 flex flex-col gap-3 sm:gap-4 p-3 sm:p-5 overflow-y-auto bg-[#0d0e12]">
      <div className="relative flex-1 min-h-[260px] sm:min-h-[320px] rounded-2xl overflow-hidden bg-[#07090f] border border-[#232634] shadow-xl select-none">
        <div className="absolute left-4 top-3 z-10 flex items-center gap-2 pointer-events-none">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Machine monitoring</span>
          <StatusBadge value={`${mapMachines.length} on pit`} />
        </div>
        <div className="absolute right-3 top-3 z-10">
          <ViewModeToggle mode={machineMode} onChange={setMachineMode} />
        </div>
        <Scene3D
          cameraPosition={[0.2, 3.4, 4.2]}
          sunPosition={[10, 12, 4]}
          controlsTarget={[0, 0.9, 0]}
          minDistance={1}
          maxDistance={22}
          fogNear={18}
          fogFar={42}
          variant={machineMode}
          onPointerMissed={() => setSelectedMachineId(null)}
        >
          {machineMode === 'lidar' ? <LidarTerrain3D /> : <QuarryGltf3D />}
          {mapMachines.map((machine, i) => (
            <MachineMarker3D
              key={machine.id}
              machine={machine}
              slot={i}
              selected={machine.id === selectedMachineId}
              operator={personForMachine(mine.personnel, machine.id)}
              onSelect={setSelectedMachineId}
              thermal={machineMode === 'lidar'}
            />
          ))}
        </Scene3D>
      </div>

      <div className="relative flex-1 min-h-[300px] rounded-2xl overflow-hidden bg-[#07090f] border border-[#232634] shadow-xl select-none">
        <div className="absolute left-4 top-3 z-10 flex items-center gap-2 pointer-events-none">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Personnel monitoring</span>
          <StatusBadge value={`${Math.min(mapPeople.length, 14)} tagged`} />
        </div>
        <div className="absolute right-3 top-3 z-10">
          <ViewModeToggle mode={personMode} onChange={setPersonMode} />
        </div>
        <Scene3D
          cameraPosition={[-2.1, 3.1, 4.5]}
          sunPosition={[-6, 11, 7]}
          controlsTarget={[0, 0.9, 0]}
          minDistance={1}
          maxDistance={28}
          fogNear={18}
          fogFar={42}
          variant={personMode}
          onPointerMissed={() => setSelectedPersonId(null)}
        >
          {personMode === 'lidar' ? <LidarTerrain3D /> : <QuarryGltf3D />}
          {mapPeople.slice(0, 14).map((person, i) => (
            <PersonMarker3D
              key={person.id}
              person={person}
              slot={i}
              selected={person.id === selectedPersonId}
              onSelect={setSelectedPersonId}
              thermal={personMode === 'lidar'}
            />
          ))}
        </Scene3D>
      </div>
    </div>
  )
}
