import React from 'react'

export default function StageBreakdownChart({
  activeStage = 'extraction',
  timeRange = 'today',
  customData
}) {
  // Mockup precise 4-bar layout and proportions
  const defaultItems = [
    { id: 'stockpiled', label: 'Stockpiled', heightPct: 35, value: '28,400 t' },
    { id: 'processed', label: 'Processed', heightPct: 15, value: '14,200 t' },
    { id: 'shipped', label: 'Shipped', heightPct: 68, value: '49,800 t' },
    { id: 'raw_ore', label: 'Raw Ore', heightPct: 96, value: '67,500 t' }
  ]

  const items = customData || defaultItems

  return (
    <div className="relative w-full rounded-2xl p-[1.5px] mt-4 mb-2 shadow-2xl overflow-hidden group">
      {/* 1. Neon Gradient Border (Blue on left/top to Magenta/Pink on right/bottom) */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#2563eb] via-[#8b5cf6] to-[#ec4899] opacity-90 transition-opacity duration-300" />

      {/* 2. Inner Charcoal Workspace */}
      <div className="relative w-full rounded-2xl bg-[#18191e] px-6 sm:px-12 pt-8 pb-4 min-h-[360px] sm:min-h-[420px] flex flex-col justify-end">
        {/* Bars Container */}
        <div className="w-full flex items-end justify-between sm:justify-around gap-3 sm:gap-12 h-[260px] sm:h-[300px] pb-2">
          {items.map(item => (
            <div
              key={item.id}
              className="flex-1 min-w-0 flex flex-col items-center justify-end h-full max-w-[130px]"
            >
              {/* Category Label Above Bar (Matching Screenshot typography) */}
              <div className="mb-3 text-center w-full min-w-0">
                <span className="text-xs sm:text-sm font-normal text-slate-200 tracking-wide block truncate">
                  {item.label}
                </span>
              </div>

              {/* Solid White Bar with Rounded Top Corners */}
              <div
                className="w-full bg-white rounded-t-lg transition-all duration-500 shadow-[0_0_20px_rgba(255,255,255,0.12)] hover:shadow-[0_0_25px_rgba(255,255,255,0.25)] hover:brightness-105"
                style={{ height: `${item.heightPct}%` }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
