import React, { useMemo, useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { useVisibleMine } from '../../context/useMineData'
import { personForMachine } from '../../data'
import StatusBadge from '../dashboard/StatusBadge'
import Scene3D from '../three/Scene3D'
import QuarryGltf3D from '../three/QuarryGltf3D'
import LidarTerrain3D from '../three/LidarTerrain3D'
import ViewModeToggle, { LIDAR_CHANNELS } from '../three/ViewModeToggle'
import LidarLegend from '../three/LidarLegend'
import MachineMarker3D from '../three/MachineMarker3D'
import PersonMarker3D from '../three/PersonMarker3D'
import { preloadGltfs } from '../three/FittedGltf'
import { GLB_PRELOAD } from '../../three/modelCatalog'

preloadGltfs(GLB_PRELOAD)

export default function MapsView({ currentRole, focusedAsset, onNavigate }) {
  const [machineMode, setMachineMode] = useState('daylight')
  const [personMode, setPersonMode] = useState('daylight')
  // Shading channel for the LiDAR clouds. Density is the default: a depth-shaded
  // scan answers "how deep", a density-shaded one answers "where is the ore".
  const [machineChannel, setMachineChannel] = useState('density')
  const [personChannel, setPersonChannel] = useState('density')
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
      {focusedAsset ? (
        <div className="shrink-0 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 px-3 py-2.5 rounded-xl bg-[#14151c] border border-[#242836]">
          <button
            type="button"
            onClick={() => onNavigate?.('portfolio')}
            className="self-start flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-[#1a1d27] hover:bg-[#222636] text-slate-300 border border-[#2a2e3c] transition cursor-pointer shrink-0"
          >
            <ArrowLeft className="w-3 h-3" />
            Portfolio map
          </button>
          <div className="min-w-0 flex-1">
            <div className="text-[13px] font-semibold text-white leading-tight truncate">
              {focusedAsset.name}
            </div>
            <div className="text-[10px] text-slate-500 truncate">
              {[focusedAsset.country, focusedAsset.province, focusedAsset.commodity]
                .filter(Boolean)
                .join(' · ')}
            </div>
          </div>
          <dl className="flex items-center gap-3 sm:gap-4 shrink-0">
            {focusedAsset.tpd ? (
              <div>
                <dt className="text-[8.5px] font-bold uppercase tracking-[0.14em] text-slate-500">Rate</dt>
                <dd className="text-[12px] font-semibold text-slate-100 tabular-nums leading-tight">
                  {focusedAsset.tpd.toLocaleString()} t/d
                </dd>
              </div>
            ) : null}
            {focusedAsset.trucksWeighedToday ? (
              <div>
                <dt className="text-[8.5px] font-bold uppercase tracking-[0.14em] text-slate-500">Weighed</dt>
                <dd className="text-[12px] font-semibold text-slate-100 tabular-nums leading-tight">
                  {focusedAsset.trucksWeighedToday}
                </dd>
              </div>
            ) : null}
            {focusedAsset.manager ? (
              <div className="hidden sm:block">
                <dt className="text-[8.5px] font-bold uppercase tracking-[0.14em] text-slate-500">Manager</dt>
                <dd className="text-[12px] font-semibold text-slate-100 leading-tight">
                  {focusedAsset.manager}
                </dd>
              </div>
            ) : null}
          </dl>
        </div>
      ) : null}
      <div className="relative flex-1 min-h-[260px] sm:min-h-[320px] rounded-2xl overflow-hidden bg-[#07090f] border border-[#232634] shadow-xl select-none">
        <div className="absolute left-4 top-3 z-10 flex items-center gap-2 pointer-events-none">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Machine monitoring</span>
          <StatusBadge value={`${mapMachines.length} on pit`} />
        </div>
        <div className="absolute right-3 top-3 z-10 flex flex-col items-end gap-1.5">
          <ViewModeToggle mode={machineMode} onChange={setMachineMode} />
          {machineMode === 'lidar' ? (
            <>
              <ViewModeToggle
                mode={machineChannel}
                onChange={setMachineChannel}
                options={LIDAR_CHANNELS}
              />
              <LidarLegend channel={machineChannel} />
            </>
          ) : null}
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
          {machineMode === 'lidar' ? <LidarTerrain3D channel={machineChannel} /> : <QuarryGltf3D />}
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
        <div className="absolute right-3 top-3 z-10 flex flex-col items-end gap-1.5">
          <ViewModeToggle mode={personMode} onChange={setPersonMode} />
          {personMode === 'lidar' ? (
            <>
              <ViewModeToggle
                mode={personChannel}
                onChange={setPersonChannel}
                options={LIDAR_CHANNELS}
              />
              <LidarLegend channel={personChannel} />
            </>
          ) : null}
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
          {personMode === 'lidar' ? <LidarTerrain3D channel={personChannel} /> : <QuarryGltf3D />}
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
