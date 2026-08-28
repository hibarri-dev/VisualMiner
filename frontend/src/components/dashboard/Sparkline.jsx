import React from 'react'

export default function Sparkline({ values = [], color = '#ec4899', height = 28 }) {
  const max = Math.max(...values, 1)
  const min = Math.min(...values, 0)
  const span = Math.max(max - min, 1)

  return (
    <div className="flex items-end gap-[3px]" style={{ height }}>
      {values.map((v, i) => (
        <div
          key={i}
          className="w-[5px] rounded-sm opacity-90"
          style={{
            height: `${Math.max(12, ((v - min) / span) * 100)}%`,
            background: color
          }}
        />
      ))}
    </div>
  )
}
