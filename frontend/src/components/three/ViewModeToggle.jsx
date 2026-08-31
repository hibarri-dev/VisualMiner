import React from 'react'

const SCENE_MODES = [
  { id: 'daylight', label: 'Site' },
  { id: 'lidar', label: 'LiDAR' }
]

/** LiDAR shading channel. Density is the default — depth stays for survey work. */
export const LIDAR_CHANNELS = [
  { id: 'density', label: 'Ore density' },
  { id: 'depth', label: 'Elevation' }
]

export default function ViewModeToggle({ mode, onChange, options = SCENE_MODES }) {
  return (
    <div className="flex items-center gap-0.5 p-0.5 rounded-md bg-black/55 border border-white/10 backdrop-blur-sm">
      {options.map(m => {
        const active = mode === m.id
        return (
          <button
            key={m.id}
            type="button"
            onClick={() => onChange(m.id)}
            aria-pressed={active}
            className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider transition-colors ${
              active ? 'bg-cyan-400/90 text-slate-900' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {m.label}
          </button>
        )
      })}
    </div>
  )
}
