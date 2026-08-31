import React, { useState } from 'react'
import { Check } from 'lucide-react'

export const TIME_RANGES = [
  { id: 'today', label: 'Today' },
  { id: 'yesterday', label: 'Yesterday' },
  { id: 'this_week', label: 'This Week' },
  { id: 'this_month', label: 'This Month' },
  { id: 'custom', label: 'Custom Dates' }
]

export const MINES_LIST = [
  { id: 'kulilia', name: 'Kulilia Mine', location: 'Limpopo Belt', stage: 'Production' },
  { id: 'kolar-north', name: 'Kolar North Open Pit', location: 'Karnataka', stage: 'Mining' },
  { id: 'bellary-chrome', name: 'Bellary Chrome Ridge', location: 'Sandur', stage: 'Extraction' },
  { id: 'talcher-anthracite', name: 'Talcher Anthracite', location: 'Odisha', stage: 'Active' },
  { id: 'queensway-nfg', name: 'Queensway Gold Project', location: 'Appalachian', stage: 'Prospecting' }
]

export const STAGE_MODES = [
  { id: 'production', label: 'Production Stage' },
  { id: 'surveying_prospecting', label: 'Surveying & Prospecting' },
  { id: 'spatial_3d', label: 'Live 3D Pit Overview' }
]

export default function StageControlBar({
  activeTimeRange = 'today',
  onSelectTimeRange,
  selectedMine = 'kulilia',
  onSelectMine,
  activeMode = 'production',
  onSelectMode,
  showMineSelect = true
}) {
  const [isMineOpen, setIsMineOpen] = useState(false)
  const [isModeOpen, setIsModeOpen] = useState(false)

  const currentMineObj = MINES_LIST.find(m => m.id === selectedMine) || MINES_LIST[0]
  const currentModeObj = STAGE_MODES.find(m => m.id === activeMode) || STAGE_MODES[0]

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 pt-2 pb-3">
      {/* 1. Date Range Segmented Pill Group (Matching Mockup Pill Container) */}
      <div className="flex items-center bg-[#1e1f24] rounded-xl px-2 py-1.5 gap-2 sm:gap-4 shadow-inner max-w-full overflow-x-auto">
        {TIME_RANGES.map(range => {
          const isSelected = activeTimeRange === range.id
          return (
            <button
              key={range.id}
              type="button"
              onClick={() => onSelectTimeRange && onSelectTimeRange(range.id)}
              className={`shrink-0 whitespace-nowrap px-3 sm:px-4 py-1.5 rounded-lg text-xs sm:text-sm font-normal transition-all duration-150 cursor-pointer ${
                isSelected
                  ? 'bg-[#d1d5db] text-[#121316] font-medium shadow-sm'
                  : 'text-slate-200 hover:text-white hover:bg-[#282a32]'
              }`}
            >
              {range.label}
            </button>
          )
        })}
      </div>

      {/* 2. Mine Selector & Stage Mode Dropdowns (Light Grey Buttons from Mockup) */}
      <div className="flex items-center gap-3">
        {showMineSelect ? (
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setIsMineOpen(!isMineOpen)
              setIsModeOpen(false)
            }}
            className="flex items-center justify-center px-5 sm:px-6 py-2 rounded-xl bg-[#d1d5db] hover:bg-[#e2e8f0] text-[#121316] text-xs sm:text-sm font-normal shadow-xs transition cursor-pointer"
          >
            <span>{currentMineObj.name}</span>
          </button>

          {isMineOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-[#181a21] border border-[#2a2d39] rounded-xl shadow-2xl p-1.5 z-50 animate-fadeIn text-xs">
              <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Select Active Mine
              </div>
              {MINES_LIST.map(mine => (
                <div
                  key={mine.id}
                  onClick={() => {
                    if (onSelectMine) onSelectMine(mine.id)
                    setIsMineOpen(false)
                  }}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition ${
                    selectedMine === mine.id
                      ? 'bg-indigo-600/20 text-indigo-200 font-semibold border border-indigo-500/30'
                      : 'hover:bg-[#222530] text-slate-300'
                  }`}
                >
                  <div>
                    <div className="text-white font-medium">{mine.name}</div>
                    <div className="text-[10px] text-slate-400">{mine.location} · {mine.stage}</div>
                  </div>
                  {selectedMine === mine.id && <Check className="w-3.5 h-3.5 text-indigo-400 shrink-0" />}
                </div>
              ))}
            </div>
          )}
        </div>
        ) : (
          <div className="flex items-center justify-center px-5 sm:px-6 py-2 rounded-xl bg-[#d1d5db] text-[#121316] text-xs sm:text-sm font-normal shadow-xs">
            {currentMineObj.name}
          </div>
        )}

        {/* Stage Mode Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setIsModeOpen(!isModeOpen)
              setIsMineOpen(false)
            }}
            className="flex items-center justify-center px-5 sm:px-6 py-2 rounded-xl bg-[#d1d5db] hover:bg-[#e2e8f0] text-[#121316] text-xs sm:text-sm font-normal shadow-xs transition cursor-pointer"
          >
            <span>{currentModeObj.label}</span>
          </button>

          {isModeOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-[#181a21] border border-[#2a2d39] rounded-xl shadow-2xl p-1.5 z-50 animate-fadeIn text-xs">
              <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Select View Perspective
              </div>
              {STAGE_MODES.map(mode => (
                <div
                  key={mode.id}
                  onClick={() => {
                    if (onSelectMode) onSelectMode(mode.id)
                    setIsModeOpen(false)
                  }}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition ${
                    activeMode === mode.id
                      ? 'bg-indigo-600/20 text-indigo-200 font-semibold border border-indigo-500/30'
                      : 'hover:bg-[#222530] text-slate-300'
                  }`}
                >
                  <span className="text-white">{mode.label}</span>
                  {activeMode === mode.id && <Check className="w-3.5 h-3.5 text-indigo-400 shrink-0" />}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
