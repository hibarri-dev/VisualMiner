import React, { useMemo } from 'react'
import { lidarColor } from '../../three/lidarPalette'
import { drillMeta, gradeNorm } from '../../three/oreBody'
import { FIELD_NOTE } from '../../three/densityField'
import { SITE } from '../../data'

// Both channels paint the same false-colour ramp, so the bar is shared and only the
// tick labels change with the channel.
const RAMP = (() => {
  const stops = []
  for (let i = 0; i <= 12; i += 1) {
    const t = i / 12
    stops.push(`${lidarColor(t).getStyle()} ${(t * 100).toFixed(0)}%`)
  }
  return `linear-gradient(to right, ${stops.join(', ')})`
})()

const GRADE_TICKS = [1, 5, 20, 100, 343]

function densityTicks() {
  return GRADE_TICKS.map(g => ({
    at: gradeNorm(g),
    label: g >= 100 ? `${g}` : `${g}`
  }))
}

function depthTicks() {
  const { floor, rim } = SITE.elevation
  return [0, 0.5, 1].map(t => ({
    at: t,
    label: `${Math.round(floor + (rim - floor) * t)}`
  }))
}

export default function LidarLegend({ channel }) {
  const density = channel === 'density'
  const ticks = useMemo(() => (density ? densityTicks() : depthTicks()), [density])

  return (
    <div className="w-40 sm:w-48 px-2 py-1.5 rounded-md bg-black/60 border border-white/10 backdrop-blur-sm pointer-events-none">
      <div className="flex items-baseline justify-between mb-1">
        <span className="text-[9px] font-bold uppercase tracking-wider text-slate-300">
          {density ? 'Mineral density' : 'Elevation'}
        </span>
        <span className="text-[9px] font-mono text-slate-500">
          {density ? `${drillMeta.unit} ${drillMeta.element}` : SITE.elevation.unit}
        </span>
      </div>
      <div className="h-1.5 rounded-full" style={{ background: RAMP }} />
      <div className="relative h-3 mt-0.5">
        {ticks.map(t => (
          <span
            key={t.label}
            className="absolute top-0 text-[8px] font-mono text-slate-400 -translate-x-1/2 whitespace-nowrap"
            style={{ left: `${Math.min(96, Math.max(4, t.at * 100))}%` }}
          >
            {t.label}
          </span>
        ))}
      </div>
      {density ? (
        <p className="mt-0.5 text-[8px] leading-tight text-slate-500">{FIELD_NOTE}</p>
      ) : null}
    </div>
  )
}
